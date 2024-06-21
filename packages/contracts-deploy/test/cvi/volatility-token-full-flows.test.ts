import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  USDC,
  CVIFeedOracle,
  PlatformHelper,
  CVIUSDCPlatform,
  CVIUSDCThetaVault,
  CVIUSDCThetaVaultRequestFulfiller,
  CVIUSDCVolatilityToken,
  CVIUSDCRequestFeesCalculator,
  CVIUSDCVolTokenRequestFulfiller,
} from '@coti-cvi/auto-generated-code/contracts'
import { expect, TestHelper, getContractsAndConfigure } from '../utils'
import { MAX_INDEX, leverage, tokenDecimals, volTokenDecimals, afterTargetMaxTime } from '../../src/state/cvi-state'
import { toNumber, fromNumber } from '../../../lw-sdk/src/util/big-number'
import type { ThetaVaultActions, VolatilityTokenActions } from '../tools'
import { thetaVaultActions, volatilityTokenActions } from '../tools'

describe('Volatility token full flows', () => {
  let helper: TestHelper

  let deposit: ThetaVaultActions['deposit']
  let mint: VolatilityTokenActions['mint']
  let submitMint: VolatilityTokenActions['submitMint']
  let submitBurn: VolatilityTokenActions['submitBurn']
  let getKeepersFee: VolatilityTokenActions['getKeepersFee']

  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle
  let platformHelper: PlatformHelper
  let platform: CVIUSDCPlatform
  let thetaVault: CVIUSDCThetaVault
  let vaultRequestFulfiller: CVIUSDCThetaVaultRequestFulfiller
  let volToken: CVIUSDCVolatilityToken
  let requestFeesCalculatorContract: CVIUSDCRequestFeesCalculator
  let volTokenRequestFulfiller: CVIUSDCVolTokenRequestFulfiller

  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress

  beforeEach(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, liquidityProvider, alice, bob } = await helper.getNamedSigners())
    const contracts = await getContractsAndConfigure()
    ;({
      usdcToken,
      cviFeedOracle,
      platformHelper,
      platform,
      thetaVault,
      volToken,
      vaultRequestFulfiller,
      requestFeesCalculatorContract,
      volTokenRequestFulfiller,
    } = contracts)
    ;({ deposit } = thetaVaultActions(helper, contracts))
    ;({ mint, submitMint, submitBurn, getKeepersFee } = volatilityTokenActions(helper, contracts))
  })

  it('Try to mint big amount of vol token, should fail with insufficient liquidity', async () => {
    const mintAmount = fromNumber(1000, tokenDecimals)
    const { requestId, targetTimestamp } = await submitMint(bob, mintAmount)
    await helper.setTimestamp(targetTimestamp)

    const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
    expect(upkeepNeeded).to.equal(true)
    await expect(volTokenRequestFulfiller.connect(bob).performUpkeep(performData)).to.be.revertedWith(
      'Failed to fulfill requests',
    )

    await expect(volToken.connect(bob).fulfillMintRequest(requestId, 10000, false)).to.be.revertedWith(
      'Not enough liquidity',
    )
  })

  it('Try to mint big amount of vol token, should fail with insufficient liquidity. Should succeed after adding enough liquidity', async () => {
    const mintAmount = fromNumber(1000, tokenDecimals)
    const { requestId, targetTimestamp, maxBuyingPremiumFeePercentage } = await submitMint(bob, mintAmount)
    await helper.setTimestamp(targetTimestamp)

    const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
    expect(upkeepNeeded).to.equal(true)
    await expect(volTokenRequestFulfiller.connect(bob).performUpkeep(performData)).to.be.revertedWith(
      'Failed to fulfill requests',
    )

    await expect(volToken.connect(bob).fulfillMintRequest(requestId, 10000, false)).to.be.revertedWith(
      'Not enough liquidity',
    )

    await deposit(alice, 20_000)

    await volToken.connect(bob).fulfillMintRequest(requestId, maxBuyingPremiumFeePercentage, false)
  })

  it('Try to mint big amount of vol token, should fail with insufficient liquidity. Should (upkeep) succeed after adding enough liquidity', async () => {
    const mintAmount = fromNumber(1000, tokenDecimals)
    const { requestId, targetTimestamp } = await submitMint(bob, mintAmount)
    await helper.setTimestamp(targetTimestamp)

    const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
    expect(upkeepNeeded).to.equal(true)
    await expect(volTokenRequestFulfiller.connect(bob).performUpkeep(performData)).to.be.revertedWith(
      'Failed to fulfill requests',
    )

    await expect(volToken.connect(bob).fulfillMintRequest(requestId, 10000, false)).to.be.revertedWith(
      'Not enough liquidity',
    )

    await deposit(alice, 20_000)

    await volTokenRequestFulfiller.connect(bob).performUpkeep(performData)
  })

  it('Should liquidate expired request with fulfillMintRequest', async () => {
    const mintAmount = fromNumber(100, tokenDecimals)

    const { requestId, targetTimestamp } = await submitMint(bob, mintAmount)
    await helper.setTimestamp(targetTimestamp + afterTargetMaxTime)

    const res = await (await volToken.connect(bob).fulfillMintRequest(requestId, 10000, false)).wait()
    const block = res.blockNumber
    const events = await volToken.queryFilter(volToken.filters.LiquidateRequest(), block, block)
    expect(events.length).to.equal(1)
  })

  it('Should liquidate expired mint request with performUpkeep - should return the token back to owner of the request', async () => {
    const mintAmount = fromNumber(100, tokenDecimals)

    const balanceBeforeLiquidation = await usdcToken.balanceOf(bob.address)
    const balanceBeforeLiquidationWithKeepersFee = balanceBeforeLiquidation.sub(getKeepersFee(mintAmount))

    const { targetTimestamp } = await submitMint(bob, mintAmount)
    await helper.setTimestamp(targetTimestamp + afterTargetMaxTime)

    const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
    expect(upkeepNeeded).to.equal(true)

    const tx = await volTokenRequestFulfiller.connect(alice).performUpkeep(performData)
    const block = (await tx.wait()).blockNumber
    const events = await volToken.queryFilter(volToken.filters.LiquidateRequest(), block, block)
    expect(events.length).to.equal(1)

    const balanceAfterLiquidation = await usdcToken.balanceOf(bob.address)
    expect(balanceAfterLiquidation.toString()).to.equal(balanceBeforeLiquidationWithKeepersFee.toString())
  })

  it('Should liquidate expired burn request with performUpkeep - should return the token back to owner of the request', async () => {
    await mint(bob, { mintAmount: 1 })

    const usdcBalanceBefore = await usdcToken.balanceOf(bob.address)
    const balanceBeforeLiquidation = await volToken.balanceOf(bob.address)

    const { targetTimestamp } = await submitBurn(bob, balanceBeforeLiquidation)
    await helper.setTimestamp(targetTimestamp + afterTargetMaxTime)

    const price = await platformHelper.volTokenIntrinsicPrice(volToken.address)
    const usdcTokenAmount = balanceBeforeLiquidation.mul(price).div(fromNumber(1, volTokenDecimals))
    const balanceBeforeLiquidationWithKeepersFee = usdcTokenAmount.sub(getKeepersFee(usdcTokenAmount))

    const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
    expect(upkeepNeeded).to.equal(true)

    const tx = await volTokenRequestFulfiller.connect(alice).performUpkeep(performData)
    const block = (await tx.wait()).blockNumber
    const events = await volToken.queryFilter(volToken.filters.LiquidateRequest(), block, block)
    expect(events.length).to.equal(1)

    const usdcBalanceAfter = await usdcToken.balanceOf(bob.address)
    const balanceAfterLiquidation = usdcBalanceAfter.sub(usdcBalanceBefore)
    expect(toNumber(balanceAfterLiquidation, tokenDecimals)).to.be.closeTo(
      toNumber(balanceBeforeLiquidationWithKeepersFee, tokenDecimals),
      0.01,
    )
  })

  describe('Intrinsic price at cvi index', () => {
    const testIndexes: number[] = [50, 80, 90, 100, 120, 140, 160, 180]

    testIndexes.forEach(index => {
      it(`Intrinsic price should be close to index * leverage (testing index ${index})`, async () => {
        await helper.setCVI(cviFeedOracle, index)

        const intrinsicPrice = await platformHelper.volTokenIntrinsicPrice(volToken.address)
        const intrinsicPriceNumber = toNumber(intrinsicPrice, tokenDecimals)

        expect(intrinsicPriceNumber).to.be.closeTo(index * leverage, 0.01)
      })

      it(`Intrinsic price should be below max index (testing index ${index})`, async () => {
        await helper.setCVI(cviFeedOracle, index)

        const intrinsicPrice = await platformHelper.volTokenIntrinsicPrice(volToken.address)
        const intrinsicPriceNumber = toNumber(intrinsicPrice, tokenDecimals)

        expect(intrinsicPriceNumber).to.be.below(MAX_INDEX)
      })
    })
  })
})
