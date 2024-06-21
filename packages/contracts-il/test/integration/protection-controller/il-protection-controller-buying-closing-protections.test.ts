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
  ethInitialPrice,
  usdInitialPrice,
  calcAmountToBePaid,
  maxPrecisionDecimals,
  initialLiquidity,
  premiumParams1,
  calculateLinearlyIncreasingPremiums,
  assertTransferEvents,
  premiumParamsToBN,
  feeComponent,
  calculateFeeTruncated,
  feeComponentBN,
  premiumGrowthStart,
  premiumSlope,
} from '../../utils'
import { formatFixedAndRoundValue, fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { AddressZero } from '@ethersproject/constants'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-buying-closing-protections-tests', () => {
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
  let deployer: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let alice: SignerWithAddress
  let treasury: SignerWithAddress

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
    ;({ owner, deployer, liquidityProvider, protectionBuyer, alice, treasury } = await helper.getNamedSigners())
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

  it('Should not close a protection if it is not expired', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])
    await protectionController.closeProtections([0])
    const openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    expect(openProtectionWithMetadata.exists).is.equal(true)
    expect(closedProtectionWithMetadata.exists).is.equal(false)
  })

  it('Should not close a protection if no matching protection is found (mismatched protection id is passed)', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    await protectionController.closeProtections([1])

    const openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.exists).is.equal(true)
    expect(closedProtectionWithMetadata.exists).is.equal(false)
  })

  it('2 Protections opened and expired - closing only 1 specific protection', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    await protectionController.closeProtections([1])

    const openProtection1WithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const openProtection2WithMetadata = await protectionController.openProtectionsWithMetadata(1)
    const closedProtection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)

    expect(openProtection1WithMetadata.exists).is.equal(true)
    expect(closedProtection1WithMetadata.exists).is.equal(false)
    expect(openProtection2WithMetadata.exists).is.equal(false)
    expect(closedProtection2WithMetadata.exists).is.equal(true)
  })

  it('3 Protections opened - only 2 expired - closing only 1 specific protection', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    await protectionController.closeProtections([0])

    const openProtection1WithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const openProtection2WithMetadata = await protectionController.openProtectionsWithMetadata(1)
    const closedProtection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)
    const openProtection3WithMetadata = await protectionController.openProtectionsWithMetadata(2)
    const closedProtection3WithMetadata = await protectionController.closedProtectionsWithMetadata(2)

    expect(openProtection1WithMetadata.exists).is.equal(false)
    expect(closedProtection1WithMetadata.exists).is.equal(true)
    expect(openProtection2WithMetadata.exists).is.equal(true)
    expect(closedProtection2WithMetadata.exists).is.equal(false)
    expect(openProtection3WithMetadata.exists).is.equal(true)
    expect(closedProtection3WithMetadata.exists).is.equal(false)
  })

  it('Opened and closed 2 protections then 2 more protections opened and closed', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData1 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData1)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData2 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData2)

    const openProtection1WithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const openProtection2WithMetadata = await protectionController.openProtectionsWithMetadata(1)
    const closedProtection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)
    const openProtection3WithMetadata = await protectionController.openProtectionsWithMetadata(2)
    const closedProtection3WithMetadata = await protectionController.closedProtectionsWithMetadata(2)
    const openProtection4WithMetadata = await protectionController.openProtectionsWithMetadata(3)
    const closedProtection4WithMetadata = await protectionController.closedProtectionsWithMetadata(3)

    expect(openProtection1WithMetadata.exists).is.equal(false)
    expect(closedProtection1WithMetadata.exists).is.equal(true)
    expect(openProtection2WithMetadata.exists).is.equal(false)
    expect(closedProtection2WithMetadata.exists).is.equal(true)
    expect(openProtection3WithMetadata.exists).is.equal(false)
    expect(closedProtection3WithMetadata.exists).is.equal(true)
    expect(openProtection4WithMetadata.exists).is.equal(false)
    expect(closedProtection4WithMetadata.exists).is.equal(true)
  })

  it('Buy and close protections for different token pairs', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.LINK, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const openProtection1WithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const closedProtection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const openProtection2WithMetadata = await protectionController.openProtectionsWithMetadata(1)
    const closedProtection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)

    expect(openProtection1WithMetadata.exists).is.equal(false)
    expect(closedProtection1WithMetadata.exists).is.equal(true)
    expect(openProtection2WithMetadata.exists).is.equal(false)
    expect(closedProtection2WithMetadata.exists).is.equal(true)
  })

  it('Buy and close protections with different buyers', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(alice)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const closedProtection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const closedProtection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)

    const protectionDetails1 = await protectionNFT.getProtectionDetails(0)
    const protectionDetails2 = await protectionNFT.getProtectionDetails(1)

    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialUsdcBalanceBN
        .sub(protectionDetails1.premiumCostUSD)
        .add(closedProtection1WithMetadata.amountPaidOnPolicyClose),
    )

    expect(await usdcToken.balanceOf(alice.address)).is.equal(
      initialUsdcBalanceBN
        .sub(protectionDetails2.premiumCostUSD)
        .add(closedProtection2WithMetadata.amountPaidOnPolicyClose),
    )
  })

  it('Buying protection, minAmountToBePaid < amountToPayBack , payment sent to buyer', async () => {
    const ethEndPrice = 4000

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const estimatedAmountToBePaid = calcAmountToBePaid(
      lpTokensWorthAtBuyTimeUsd,
      ethInitialPrice,
      usdInitialPrice,
      ethEndPrice,
      usdInitialPrice,
    )
    const estimatedAmountToBePaidBN = fromNumber(estimatedAmountToBePaid, usdcDecimals)

    await protectionConfig.connect(owner).setMinAmountToBePaid(estimatedAmountToBePaidBN.sub(1))

    await ethUsdPriceOracle.setPrice(fromNumber(ethEndPrice, priceOracleUsdPairDecimals))

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const protectionMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    expect(estimatedAmountToBePaidBN).is.equal(protectionMetadata.amountPaidOnPolicyClose)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialUsdcBalanceBN.sub(protectionDetails.premiumCostUSD).add(protectionMetadata.amountPaidOnPolicyClose),
    )
  })

  it('Buying protection, minAmountToBePaid > amountToPayBack , payment not sent to buyer', async () => {
    const ethEndPrice = 4000

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const estimatedAmountToBePaid = calcAmountToBePaid(
      lpTokensWorthAtBuyTimeUsd,
      ethInitialPrice,
      usdInitialPrice,
      ethEndPrice,
      usdInitialPrice,
    )
    const estimatedAmountToBePaidBN = fromNumber(estimatedAmountToBePaid, usdcDecimals)

    await protectionConfig.connect(owner).setMinAmountToBePaid(estimatedAmountToBePaidBN.add(1))

    await ethUsdPriceOracle.setPrice(fromNumber(ethEndPrice, priceOracleUsdPairDecimals))

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const protectionMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    expect(protectionMetadata.amountPaidOnPolicyClose).is.equal(0)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialUsdcBalanceBN.sub(protectionDetails.premiumCostUSD),
    )
  })

  it('Transfer event count should be correct when buying and closing protections', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await ethUsdPriceOracle.setPrice(fromNumber(5000, priceOracleUsdPairDecimals))

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData1 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData1)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await ethUsdPriceOracle.setPrice(fromNumber(7000, priceOracleUsdPairDecimals))

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData2 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData2)

    const protection1Metadata = await protectionController.closedProtectionsWithMetadata(0)
    const protection1Details = await protectionNFT.getProtectionDetails(0)

    const protection2Metadata = await protectionController.closedProtectionsWithMetadata(1)
    const protection2Details = await protectionNFT.getProtectionDetails(1)

    const transferEvents = await usdcToken.queryFilter(usdcToken.filters.Transfer(), 0)

    expect(transferEvents.length).is.equal(11)

    assertTransferEvents(transferEvents, [
      { from: AddressZero, to: deployer.address, value: initialUsdcBalanceBN },
      {
        from: AddressZero,
        to: liquidityProvider.address,
        value: initialUsdcBalanceBN,
      },
      {
        from: AddressZero,
        to: protectionBuyer.address,
        value: initialUsdcBalanceBN,
      },
      {
        from: AddressZero,
        to: alice.address,
        value: initialUsdcBalanceBN,
      },
      {
        from: liquidityProvider.address,
        to: liquidityController.address,
        value: initialLiquidityBN,
      },
      {
        from: protectionBuyer.address,
        to: liquidityController.address,
        value: protection1Details.premiumCostUSD,
      },
      {
        from: liquidityController.address,
        to: treasury.address,
        value: protection1Metadata.fee,
      },
      {
        from: liquidityController.address,
        to: protectionBuyer.address,
        value: protection1Metadata.amountPaidOnPolicyClose,
      },
      {
        from: protectionBuyer.address,
        to: liquidityController.address,
        value: protection2Details.premiumCostUSD,
      },
      {
        from: liquidityController.address,
        to: treasury.address,
        value: protection2Metadata.fee,
      },
      {
        from: liquidityController.address,
        to: protectionBuyer.address,
        value: protection2Metadata.amountPaidOnPolicyClose,
      },
    ])
  })

  it('Buying and closing 2 protections - changing token pair in between - protections should be closed properly', async () => {
    const token1 = 'OtherEth'
    const newPairCollateralCapComponent = 2000

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await tokenPairRepository
      .connect(owner)
      .setPair(token1, TokenName.USDC, ethUsdPriceOracle.address, usdUsdPriceOracle.address)

    await tokenPairRepository
      .connect(owner)
      .setPremiumsParams(token1, TokenName.USDC, policyPeriods, [
        newPremiumParams1BN,
        newPremiumParams2BN,
        newPremiumParams3BN,
      ])

    await tokenPairRepository
      .connect(owner)
      .setCollateralCapComponent(token1, TokenName.USDC, newPairCollateralCapComponent)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(token1, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const expectedPremiums = calculateLinearlyIncreasingPremiums(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      initialLiquidity,
      [premiumParams1, newPremiumParams1],
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
      expect((await protectionController.closedProtectionsWithMetadata(i)).exists).is.equal(true)
    }
  })

  it('Buying 2 protections - fee component is 0 - No fees are paid by buyers or sent to treasury', async () => {
    await protectionConfig.connect(owner).setFeeComponent(0)

    const expectedPremiums = calculateLinearlyIncreasingPremiums(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      initialLiquidity,
      [premiumParams1, premiumParams1],
      cvi,
      premiumGrowthStart,
      premiumSlope,
      0,
      0,
      5,
    )

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const protection1Metadata = await protectionController.openProtectionsWithMetadata(0)
    const protection2Metadata = await protectionController.openProtectionsWithMetadata(1)

    const protection1Details = await protectionNFT.getProtectionDetails(0)
    const protection2Details = await protectionNFT.getProtectionDetails(1)

    expect(await usdcToken.balanceOf(treasury.address)).is.equal(0)
    expect(protection1Metadata.fee).is.equal(0)
    expect(protection1Metadata.feeComponent).is.equal(0)
    expect(protection2Metadata.fee).is.equal(0)
    expect(protection2Metadata.feeComponent).is.equal(0)

    expect(formatFixedAndRoundValue(protection1Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[0])
    expect(formatFixedAndRoundValue(protection2Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[1])
  })

  it('Buying 2 protections - fee component > 0 - premium cost should include fee and treasury balance should be correct', async () => {
    const expectedPremiums = calculateLinearlyIncreasingPremiums(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      initialLiquidity,
      [premiumParams1, premiumParams1],
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
      5,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, usdcDecimals)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const protection1Metadata = await protectionController.openProtectionsWithMetadata(0)
    const protection2Metadata = await protectionController.openProtectionsWithMetadata(1)

    const protection1Details = await protectionNFT.getProtectionDetails(0)
    const protection2Details = await protectionNFT.getProtectionDetails(1)

    expect(await usdcToken.balanceOf(treasury.address)).is.equal(protection1Metadata.fee.add(protection2Metadata.fee))
    expect(formatFixed(protection1Metadata.fee, usdcDecimals)).is.equal(expectedFee)
    expect(protection1Metadata.feeComponent).is.equal(feeComponentBN)
    expect(formatFixed(protection2Metadata.fee, usdcDecimals)).is.equal(expectedFee)
    expect(protection2Metadata.feeComponent).is.equal(feeComponentBN)

    expect(formatFixedAndRoundValue(protection1Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[0])
    expect(formatFixedAndRoundValue(protection2Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[1])
  })

  it('Buying 2 protections - changing fee in between - premium cost should include fee and treasury balance should be correct', async () => {
    const newFeeComponent = 0.0139
    const newFeeComponentBN = BigNumber.from(newFeeComponent * Math.pow(10, maxPrecisionDecimals))

    const expectedPremiums = calculateLinearlyIncreasingPremiums(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      initialLiquidity,
      [premiumParams1, premiumParams1],
      cvi,
      premiumGrowthStart,
      premiumSlope,
      [feeComponent, newFeeComponent],
      0,
      5,
    )

    const expectedFee1 = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, usdcDecimals)
    const expectedFee2 = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, newFeeComponent, 0, usdcDecimals)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionConfig.connect(owner).setFeeComponent(newFeeComponentBN)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const protection1Metadata = await protectionController.openProtectionsWithMetadata(0)
    const protection2Metadata = await protectionController.openProtectionsWithMetadata(1)

    const protection1Details = await protectionNFT.getProtectionDetails(0)
    const protection2Details = await protectionNFT.getProtectionDetails(1)

    expect(await usdcToken.balanceOf(treasury.address)).is.equal(protection1Metadata.fee.add(protection2Metadata.fee))
    expect(formatFixed(protection1Metadata.fee, usdcDecimals)).is.equal(expectedFee1)
    expect(protection1Metadata.feeComponent).is.equal(feeComponentBN)
    expect(formatFixed(protection2Metadata.fee, usdcDecimals)).is.equal(expectedFee2)
    expect(protection2Metadata.feeComponent).is.equal(newFeeComponentBN)

    expect(formatFixedAndRoundValue(protection1Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[0])
    expect(formatFixedAndRoundValue(protection2Details.premiumCostUSD, usdcDecimals, 5)).is.equal(expectedPremiums[1])
  })
})
