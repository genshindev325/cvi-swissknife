import { ethers } from 'hardhat'
import { BigNumber, formatFixed } from '@ethersproject/bignumber'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  LiquidityController,
  ILProtectionNFT,
  USDC,
  CVIFeedOracle,
  ILProtectionConfig,
  LINKUSDOracle,
  TokenPairRepository,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  runContractsFixtures,
  cvi,
  ethInitialPriceBN,
  usdInitialPriceBN,
  initialLiquidityBN,
  lpTokensWorthAtBuyTimeUsdBN,
  policyPeriods,
  usdcDecimals,
  expect,
  priceOracleUsdPairDecimals,
  initialUsdcBalanceBN,
  TestHelper,
  lpTokensWorthAtBuyTimeUsd,
  growthFactor,
  maxImpermanentLoss,
  setNextBlockTimestampAndMineWithPolicyPeriod,
  maxPrecisionDecimals,
  initialLiquidity,
  premiumParams1,
  calculateLinearlyIncreasingPremiums,
  premiumParams2,
  premiumParams3,
  address1,
  address2,
  premiumParamsToBN,
  calculatePremiumTruncated,
  calcEstimatedAmountToBePaidTruncated,
  feeComponent,
  premiumGrowthStart,
  premiumSlope,
} from '../../utils'
import { formatFixedAndRoundValue, fromNumber, roundCryptoValueString } from '../../../../lw-sdk/src/util/big-number'
import { NUMBER_OF_SECONDS_IN_1_DAY, TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-config-state-changes-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let protectionNFT: ILProtectionNFT
  let protectionConfig: ILProtectionConfig
  let tokenPairRepository: TokenPairRepository
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let alice: SignerWithAddress

  const newPolicyPeriods = [
    20 * NUMBER_OF_SECONDS_IN_1_DAY,
    40 * NUMBER_OF_SECONDS_IN_1_DAY,
    70 * NUMBER_OF_SECONDS_IN_1_DAY,
  ]
  const newPremiumParams1 = { A: 0.00033232, X0: 11.055283, C: 0.00525643 }
  const newPremiumParams2 = { A: 0.00004424222, X0: 11.54497, C: 0.42353252 }
  const newPremiumParams3 = { A: 0.000424429, X0: 14.59557, C: 0.242422 }
  const newPremiumParams1BN = premiumParamsToBN(newPremiumParams1)
  const newPremiumParams2BN = premiumParamsToBN(newPremiumParams2)
  const newPremiumParams3BN = premiumParamsToBN(newPremiumParams3)

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, liquidityProvider, protectionBuyer, alice } = await helper.getNamedSigners())
    ;({
      ethUsdPriceOracle,
      usdUsdPriceOracle,
      linkUsdPriceOracle,
      ilProtectionController: protectionController,
      liquidityController,
      protectionNFT,
      protectionConfig,
      tokenPairRepository,
      usdcToken,
      cviFeedOracle,
    } = await runContractsFixtures())

    await usdcToken.mint(liquidityProvider.address, initialUsdcBalanceBN)
    await usdcToken.mint(protectionBuyer.address, initialUsdcBalanceBN)
    await usdcToken.mint(alice.address, initialUsdcBalanceBN)
    await usdcToken.connect(liquidityProvider).approve(liquidityController.address, '200000000000')
    await usdcToken.connect(protectionBuyer).approve(liquidityController.address, '200000000000')
    await usdcToken.connect(alice).approve(liquidityController.address, '200000000000')
    await liquidityController.connect(owner).approveTreasury('200000000000')

    await cviFeedOracle.updateRoundData(0, fromNumber(cvi, 18), 0, 0)

    await ethUsdPriceOracle.setPrice(ethInitialPriceBN)
    await usdUsdPriceOracle.setPrice(usdInitialPriceBN)
    await linkUsdPriceOracle.setPrice(ethInitialPriceBN)

    await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)
  })

  describe('Premium params state changes', () => {
    it('Deleting premium params for policies - buying protection - should revert because of premium == 0', async () => {
      await tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods)

      await expect(
        protectionController
          .connect(protectionBuyer)
          .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0]),
      ).to.be.revertedWith('Premium cost is too low')
    })

    it('Buying protection - protection expired - deleting premium params for policies - protection can be closed successfully', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods)

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const { performData } = await protectionController.checkUpkeep([])

      await protectionController.performUpkeep(performData)

      const openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
      const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)

      expect(openProtectionWithMetadata.exists).is.equal(false)
      expect(closedProtectionWithMetadata.exists).is.equal(true)
    })

    it('Buying 3 protections with 3 different policy periods - update premium params for all policy periods - all premiums are correct', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

      const expectedPremiums = calculateLinearlyIncreasingPremiums(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        maxImpermanentLoss,
        initialLiquidity,
        [premiumParams1, premiumParams2, premiumParams3, newPremiumParams1, newPremiumParams2, newPremiumParams3],
        cvi,
        premiumGrowthStart,
        premiumSlope,
        feeComponent,
        0,
        4,
      )

      for (let i = 0; i < expectedPremiums.length; i++) {
        const premium = (await protectionNFT.getProtectionDetails(i)).premiumCostUSD

        expect(formatFixedAndRoundValue(premium, usdcDecimals, 4)).is.equal(expectedPremiums[i])
      }
    })

    it('Buying 3 protections with 3 different policy periods - update premium params for some policy periods - all premiums are correct', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(
          TokenName.WETH,
          TokenName.USDC,
          [policyPeriods[0], policyPeriods[2]],
          [newPremiumParams1BN, newPremiumParams3BN],
        )

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

      const expectedPremiums = calculateLinearlyIncreasingPremiums(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        maxImpermanentLoss,
        initialLiquidity,
        [premiumParams1, premiumParams2, premiumParams3, newPremiumParams1, premiumParams2, newPremiumParams3],
        cvi,
        premiumGrowthStart,
        premiumSlope,
        feeComponent,
        0,
        5,
      )

      for (let i = 0; i < expectedPremiums.length; i++) {
        const premium = (await protectionNFT.getProtectionDetails(i)).premiumCostUSD

        expect(formatFixedAndRoundValue(premium, usdcDecimals, 5)).is.equal(expectedPremiums[i])
      }
    })

    it('Buying 3 protections with 3 different policy periods - new policy periods and premium params - all premiums are correct', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

      await protectionConfig.connect(owner).setPolicyPeriodsInSeconds(newPolicyPeriods)

      await await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, newPolicyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', newPolicyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', newPolicyPeriods[1])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', newPolicyPeriods[2])

      const expectedPremiums = calculateLinearlyIncreasingPremiums(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        maxImpermanentLoss,
        initialLiquidity,
        [premiumParams1, premiumParams2, premiumParams3, newPremiumParams1, newPremiumParams2, newPremiumParams3],
        cvi,
        premiumGrowthStart,
        premiumSlope,
        feeComponent,
        0,
        4,
      )

      for (let i = 0; i < expectedPremiums.length; i++) {
        const premium = (await protectionNFT.getProtectionDetails(i)).premiumCostUSD

        expect(formatFixedAndRoundValue(premium, usdcDecimals, 4)).is.equal(expectedPremiums[i])
      }
    })
  })

  describe('Growth ratio state changes', () => {
    it('Modifying growth rate and buying protection - max amount to be paid and premium should change accordingly', async () => {
      const newGrowthRate = 3.1

      await protectionConfig
        .connect(owner)
        .setExpectedLPTokensValueGrowth(fromNumber(newGrowthRate, maxPrecisionDecimals))

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      const expectedMaxAmountToBePaid = calcEstimatedAmountToBePaidTruncated(
        lpTokensWorthAtBuyTimeUsd,
        newGrowthRate,
        maxImpermanentLoss,
        usdcDecimals,
      )

      const expectedPremium = calculatePremiumTruncated(
        lpTokensWorthAtBuyTimeUsd,
        +expectedMaxAmountToBePaid,
        initialLiquidity,
        premiumParams1.A,
        premiumParams1.X0,
        premiumParams1.C,
        cvi,
        premiumGrowthStart,
        premiumSlope,
        feeComponent,
        0,
        usdcDecimals,
      )

      const premium = (await protectionNFT.getProtectionDetails(0)).premiumCostUSD
      const maxAmountToBePaid = (await protectionController.openProtectionsWithMetadata(0)).maxAmountToBePaid

      expect(formatFixedAndRoundValue(premium, usdcDecimals, 5)).is.equal(roundCryptoValueString(expectedPremium, 5))
      expect(formatFixed(maxAmountToBePaid, usdcDecimals)).is.equal(expectedMaxAmountToBePaid)
    })
  })

  describe('MaxIL state changes', () => {
    it('Protection bought - trying to set maxIL - should revert when there is an open protection', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await expect(protectionController.connect(owner).setMaxILProtected(500)).to.be.revertedWith(
        'Cannot change value with existing open protections',
      )
    })

    it('No protections(open or closed) - trying to set maxIL - successfully set maxIL', async () => {
      await protectionController.connect(owner).setMaxILProtected(500)

      expect(await protectionConfig.maxILProtected()).is.equal(500)
    })

    it('Protection bought and closed - trying to set maxIL - successfully set maxIL', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const { performData } = await protectionController.checkUpkeep([])

      await protectionController.performUpkeep(performData)

      await protectionController.connect(owner).setMaxILProtected(500)

      expect(await protectionConfig.maxILProtected()).is.equal(500)
    })

    it('2 Protections bought and closed - setting maxIL in between - maxAmountToPayBack should be correct', async () => {
      const newMaxImpermanentLoss = 0.45
      const newMaxImpermanentLossBN = BigNumber.from(newMaxImpermanentLoss * Math.pow(10, maxPrecisionDecimals))

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const { performData } = await protectionController.checkUpkeep([])

      await protectionController.performUpkeep(performData)

      await protectionController.connect(owner).setMaxILProtected(newMaxImpermanentLossBN)

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      const expectedMaxAmountToBePaid1 = calcEstimatedAmountToBePaidTruncated(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        maxImpermanentLoss,
        5,
      )

      const expectedMaxAmountToBePaid2 = calcEstimatedAmountToBePaidTruncated(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        newMaxImpermanentLoss,
        5,
      )

      const maxAmountToBePaid1 = (await protectionController.closedProtectionsWithMetadata(0)).maxAmountToBePaid
      const maxAmountToBePaid2 = (await protectionController.openProtectionsWithMetadata(1)).maxAmountToBePaid

      expect(formatFixedAndRoundValue(maxAmountToBePaid1, usdcDecimals, 5)).is.equal(expectedMaxAmountToBePaid1)
      expect(formatFixedAndRoundValue(maxAmountToBePaid2, usdcDecimals, 5)).is.equal(expectedMaxAmountToBePaid2)
    })
  })

  describe('Changing config states not related to protection state', () => {
    it('Open protection state should not change', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      const amountToPayBeforeStateChanges = await protectionController.calcAmountToBePaidWithProtectionId(0)
      const protectionDetailsBeforeStateChanges = await protectionNFT.getProtectionDetails(0)
      const protectionMetadataBeforeStateChanges = await protectionController.openProtectionsWithMetadata(0)

      await protectionController.connect(owner).setMaxProtectionsInUpkeep(70)

      await protectionConfig.connect(owner).setBuyILProtectionEnabled(false)
      await tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods)
      await protectionConfig.connect(owner).setPolicyPeriodsInSeconds(newPolicyPeriods)
      await protectionConfig.connect(owner).setPremiumGrowthStart(10)
      await protectionConfig.connect(owner).setPremiumSlope(5)
      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, newPolicyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])

      await protectionConfig.connect(owner).setExpectedLPTokensValueGrowth(14520)
      await protectionConfig.connect(owner).setFeeComponent('345')

      await tokenPairRepository.connect(owner).setPair('Token1', 'Token2', address1, address2)
      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams('Token1', 'Token2', newPolicyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])
      await tokenPairRepository.connect(owner).setCollateralCapComponent('Token1', 'Token2', 500)

      const amountToPayAfterStateChanges = await protectionController.calcAmountToBePaidWithProtectionId(0)
      const protectionDetailsAfterStateChanges = await protectionNFT.getProtectionDetails(0)
      const protectionMetadataAfterStateChanges = await protectionController.openProtectionsWithMetadata(0)

      expect(amountToPayBeforeStateChanges).is.equal(amountToPayAfterStateChanges)
      expect(protectionDetailsBeforeStateChanges).to.eql(protectionDetailsAfterStateChanges)
      expect(protectionMetadataBeforeStateChanges).to.eql(protectionMetadataAfterStateChanges)
    })

    it('Closed protection state should not change', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await ethUsdPriceOracle.setPrice(fromNumber(5000, priceOracleUsdPairDecimals))

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const { performData } = await protectionController.checkUpkeep([])

      await protectionController.performUpkeep(performData)

      const protectionDetailsBeforeStateChanges = await protectionNFT.getProtectionDetails(0)
      const protectionMetadataBeforeStateChanges = await protectionController.closedProtectionsWithMetadata(0)

      await protectionController.connect(owner).setMaxProtectionsInUpkeep(70)

      await protectionConfig.connect(owner).setBuyILProtectionEnabled(false)
      await tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods)
      await protectionConfig.connect(owner).setPolicyPeriodsInSeconds(newPolicyPeriods)
      await protectionConfig.connect(owner).setFeeComponent('345')
      await protectionConfig.connect(owner).setPremiumGrowthStart(10)
      await protectionConfig.connect(owner).setPremiumSlope(5)

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, newPolicyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])

      await protectionConfig.connect(owner).setExpectedLPTokensValueGrowth(14520)

      await tokenPairRepository.connect(owner).setPair('Token1', 'Token2', address1, address2)
      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams('Token1', 'Token2', newPolicyPeriods, [
          newPremiumParams1BN,
          newPremiumParams2BN,
          newPremiumParams3BN,
        ])

      const protectionDetailsAfterStateChanges = await protectionNFT.getProtectionDetails(0)
      const protectionMetadataAfterStateChanges = await protectionController.closedProtectionsWithMetadata(0)

      expect(protectionDetailsBeforeStateChanges).to.eql(protectionDetailsAfterStateChanges)
      expect(protectionMetadataBeforeStateChanges).to.eql(protectionMetadataAfterStateChanges)
    })
  })
})
