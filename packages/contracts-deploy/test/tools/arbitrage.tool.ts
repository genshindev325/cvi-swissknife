import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { abi as UNIV2_ABI } from '@uniswap/v2-core/build/UniswapV2Pair.json'
import type {
  USDC,
  PlatformHelper,
  CVIUSDCVolatilityToken,
  CVIUSDCThetaVault,
  UniswapV2Factory,
  UniswapV2Pair,
} from '@coti-cvi/auto-generated-code/contracts'
import { tokenDecimals, volTokenDecimals } from '../../src/state/cvi-state'
import type { TestHelper } from '../utils'
import type { VolatilityTokenActions, UniswapActions } from './'
import { toNumber } from '../../../lw-sdk/src/util/big-number'

type ArbitrageContracts = {
  usdcToken: USDC
  platformHelper: PlatformHelper
  volToken: CVIUSDCVolatilityToken
  thetaVault: CVIUSDCThetaVault
  uniswapFactory: UniswapV2Factory
}

export type ArbitrageActions = ReturnType<typeof arbitrageActions>

export const arbitrageActions = (
  helper: TestHelper,
  { usdcToken, platformHelper, volToken, thetaVault, uniswapFactory }: ArbitrageContracts,
  { mint, burn }: { mint: VolatilityTokenActions['mint']; burn: VolatilityTokenActions['burn'] },
  { swapExactTokensForTokens }: { swapExactTokensForTokens: UniswapActions['swapExactTokensForTokens'] },
) => {
  /* 
  arbitrage optimal


  mint and swap
  1. mint X USDC for Y CVOL --- Y = X * 0.997 / iPrice => X = Y * iPrice / 0.997
  2. swap Y CVOL for Z USDC --- Z = Y * 0.997 * reserveUSDC / (reserveCVOL + Y * 0.997) => Z = (X * 0.997 / iPrice) * 0.997 * reserveUSDC / (reserveCVOL + (X * 0.997 / iPrice) * 0.997)

  reserveUSDCAfter = reserveUSDC - Z => reserveUSDCAfter = reserveUSDC - ((X * 0.997 / iPrice) * 0.997 * reserveUSDC / (reserveCVOL + (X * 0.997 / iPrice) * 0.997))
  reserveCVOLAfter = reserveCVOL + Y => reserveCVOLAfter = reserveCVOL + (X * 0.997 / iPrice)

  (0) iPrice = reserveUSDCAfter / reserveCVOLAfter
  (1) iPrice = (reserveUSDC - Z) / (reserveCVOL + Y)
  (2) iPrice * (reserveCVOL + Y) = reserveUSDC - Z
  (3) iPrice * Y + Z = reserveUSDC - iPrice * reserveCVOL
  (4) swap Y and Z and use equation solver to solve X => 
      X = (sqrt(3.988 * intrinsicPrice * reserveUSDC * reserveCVOL + 0.000009 * reserveCVOL ^ 2 * intrinsicPrice ^ 2) - 1.997 * intrinsicPrice * reserveCVOL) / 1.988018


  swap and burn
  1. swap X USDC for Y CVOL --- Y = X * 0.997 * reserveCVOL / (reserveUSDC + X * 0.997)
  2. burn Y CVOL for Z USDC --- Z = Y * 0.997 * iPrice => Z = (X * 0.997 * reserveCVOL / (reserveUSDC + X * 0.997)) * 0.997 * iPrice

  reserveUSDCAfter = reserveUSDC + X => reserveUSDCAfter = reserveUSDC + X
  reserveCVOLAfter = reserveCVOL - Y => reserveCVOLAfter = reserveCVOL - (X * 0.997 * reserveCVOL / (reserveUSDC + X * 0.997))

  (0) iPrice = reserveUSDCAfter / reserveCVOLAfter
  (1) iPrice = (reserveUSDC + X) / (reserveCVOL - Y)
  (2) iPrice * (reserveCVOL - Y) = reserveUSDC + X
  (3) iPrice * Y + X = iPrice * reserveCVOL - reserveUSDC
  (4) swap Y and use equation solver to solve X => 
      X = (sqrt(3.988 * intrinsicPrice * reserveUSDC * reserveCVOL + 0.000009 * reserveUSDC ^ 2) - 1.997 * reserveUSDC) / 1.994
  */

  const calculateOptimal = (
    { dexPrice, intrinsicPrice }: { dexPrice: number; intrinsicPrice: number },
    { reserveUSDC, reserveCVOL }: { reserveUSDC: number; reserveCVOL: number },
  ): { isBurn: boolean; optimal: number; profit: number } => {
    if (dexPrice === 0 || intrinsicPrice === 0) {
      return { isBurn: false, optimal: 0, profit: 0 }
    }
    const isBurn = dexPrice < intrinsicPrice
    const optimal = isBurn
      ? (Math.sqrt(3.988 * intrinsicPrice * reserveUSDC * reserveCVOL + 0.000009 * reserveUSDC * reserveUSDC) -
          1.997 * reserveUSDC) /
        1.994
      : (Math.sqrt(
          3.988 * intrinsicPrice * reserveUSDC * reserveCVOL +
            0.000009 * reserveCVOL * reserveCVOL * intrinsicPrice * intrinsicPrice,
        ) -
          1.997 * intrinsicPrice * reserveCVOL) /
        1.988018

    const bought = (optimal / (isBurn ? dexPrice : intrinsicPrice)) * 0.997
    const sold = (isBurn ? intrinsicPrice : dexPrice) * bought * 0.997
    const profit = (sold - optimal) / 2
    return { isBurn, optimal, profit }
  }

  const getReserves = async () => {
    const pairAddress = await uniswapFactory.getPair(usdcToken.address, volToken.address)
    const pair = await helper.attach<UniswapV2Pair>(UNIV2_ABI, pairAddress)
    const { _reserve0, _reserve1 } = await pair.getReserves()

    const [reserveUSDCAmount, reserveCVOLAmount] =
      volToken.address.toLowerCase() > usdcToken.address.toLowerCase() ? [_reserve0, _reserve1] : [_reserve1, _reserve0]
    return {
      reserveUSDC: toNumber(reserveUSDCAmount, tokenDecimals),
      reserveCVOL: toNumber(reserveCVOLAmount, volTokenDecimals),
    }
  }

  const getPrices = async () => {
    const [dexPrice, intrinsicPrice] = await Promise.all([
      platformHelper.volTokenDexPrice(thetaVault.address),
      platformHelper.volTokenIntrinsicPrice(volToken.address),
    ])
    return { dexPrice: toNumber(dexPrice, tokenDecimals), intrinsicPrice: toNumber(intrinsicPrice, tokenDecimals) }
  }

  const arbitrage = async (signer: SignerWithAddress) => {
    const [prices, reserves] = await Promise.all([getPrices(), getReserves()])
    const { isBurn, optimal, profit } = calculateOptimal(prices, reserves)

    let actualProfit: number
    let end: number
    if (isBurn) {
      const { received } = await swapExactTokensForTokens(signer, optimal, usdcToken, volToken)
      const balance = await volToken.balanceOf(signer.address) // TODO: fix imprecision in swap event (received)
      // console.log(`received ${received}, balance ${balance}`)
      const { tokenAmount } = await burn(signer, { burnAmount: balance })
      actualProfit = toNumber(tokenAmount, tokenDecimals) - optimal
      end = toNumber(tokenAmount, tokenDecimals)
    } else {
      const { mintedTokens } = await mint(signer, { mintAmount: optimal })
      const { received } = await swapExactTokensForTokens(signer, mintedTokens, volToken, usdcToken)
      actualProfit = toNumber(received, tokenDecimals) - optimal
      end = toNumber(received, tokenDecimals)
    }

    const [pricesAfter, reservesAfter] = await Promise.all([getPrices(), getReserves()])
    return { isBurn, optimal, profit, actualProfit, start: optimal, end, reserves, prices, pricesAfter, reservesAfter }
  }
  return { arbitrage, getPrices }
}
