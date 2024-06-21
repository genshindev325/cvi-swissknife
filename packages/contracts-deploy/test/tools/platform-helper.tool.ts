import type { BigNumber } from 'ethers'
import type {
  CVIUSDCThetaVault,
  CVIUSDCVolatilityToken,
  CVIUSDCPlatform,
  PlatformHelper,
} from '@coti-cvi/auto-generated-code/contracts'
import type { TestHelper } from '../utils'
import { thetaTokenDecimals, tokenDecimals } from '../../src/state/cvi-state'
import { fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'

type PlatformHelperContracts = {
  volToken: CVIUSDCVolatilityToken
  thetaVault: CVIUSDCThetaVault
  platform: CVIUSDCPlatform
  platformHelper: PlatformHelper
}

export type PlatformHelperActions = ReturnType<typeof platformHelperActions>

export const platformHelperActions = (
  helper: TestHelper,
  { volToken, thetaVault, platform, platformHelper }: PlatformHelperContracts,
) => {
  const volTokenIntrinsicPrice = async () => {
    const price = await platformHelper.volTokenIntrinsicPrice(volToken.address)
    return { price, priceNumber: toNumber(price, tokenDecimals) }
  }
  const volTokenDexPrice = async () => {
    const price = await platformHelper.volTokenDexPrice(thetaVault.address)
    return { price, priceNumber: toNumber(price, tokenDecimals) }
  }
  const volTokenPrice = async () => {
    const [{ priceNumber: intrinsicPrice }, { priceNumber: dexPrice }] = await Promise.all([
      volTokenIntrinsicPrice(),
      volTokenDexPrice(),
    ])
    return { intrinsicPrice, dexPrice }
  }
  const dailyFundingFee = async () => {
    const fundingFee = await platformHelper.dailyFundingFee(platform.address)
    return { fundingFee, fundingFeeNumber: toNumber(fundingFee, tokenDecimals) }
  }
  const fundingFeeValues = async (cvi: number, collateralRatio: number) => {
    const cviValue = Math.round(cvi)
    const collateralRatioValue = Math.round(collateralRatio)
    const args: [number, number, number, number] = [cviValue, cviValue, collateralRatioValue, collateralRatioValue]
    const fundingFee = await platformHelper.fundingFeeValues(platform.address, ...args)
    return { value: toNumber(fundingFee[0][0], tokenDecimals) }
  }
  const willWithdrawSucceed = async (withdrawAmount: number | BigNumber) => {
    const amount = typeof withdrawAmount === 'number' ? fromNumber(withdrawAmount, thetaTokenDecimals) : withdrawAmount
    return platformHelper.willWithdrawSucceed(thetaVault.address, amount)
  }
  const collateralRatio = async () => {
    const [collateralRatioAmount, utilizationRatioAmount] = await Promise.all([
      platformHelper.collateralRatio(platform.address),
      platformHelper.premiumFeeCollateralRatio(platform.address),
    ])
    return { CR: toNumber(collateralRatioAmount, 8), UR: toNumber(utilizationRatioAmount, 8) }
  }

  return {
    volTokenIntrinsicPrice,
    volTokenDexPrice,
    volTokenPrice,
    dailyFundingFee,
    fundingFeeValues,
    willWithdrawSucceed,
    collateralRatio,
  }
}
