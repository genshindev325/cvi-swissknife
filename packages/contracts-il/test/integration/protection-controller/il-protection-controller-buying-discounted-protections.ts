import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  ILProtectionNFT,
  ILProtectionDiscountNFTController,
  LiquidityController,
  CVIFeedOracle,
  USDC,
  ILProtectionDiscountNFT,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  expect,
  cvi,
  policyPeriods,
  usdcDecimals,
  premiumParams1,
  runContractsFixtures,
  ethInitialPriceBN,
  usdInitialPriceBN,
  initialLiquidityBN,
  initialLiquidity,
  initialUsdcBalanceBN,
  TestHelper,
  calculateFeeTruncated,
  feeComponent,
  premiumGrowthStart,
  premiumSlope,
  lpTokensWorthAtBuyTimeUsdBN,
  lpTokensWorthAtBuyTimeUsd,
  growthFactor,
  maxImpermanentLoss,
  calcEstimatedAmountToBePaidTruncated,
  premiumDiscountComp,
  calculatePremiumWithFeesAndDiscount,
  maxPrecision,
} from '../../utils'
import { fromNumber, formatFixedAndRoundValue, roundCryptoValueString } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'
import { DiscountNFTType } from '../../utils/types'

describe('il-protection-controller-buying-discounted-protections-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let ilProtectionController: ILProtectionController
  let liquidityController: LiquidityController
  let protectionNFT: ILProtectionNFT
  let protectionDiscountNFT: ILProtectionDiscountNFT
  let protectionDiscountNFTController: ILProtectionDiscountNFTController
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let treasury: SignerWithAddress

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)

    ;({ owner, liquidityProvider, protectionBuyer, treasury } = await helper.getNamedSigners())
    ;({
      ethUsdPriceOracle,
      usdUsdPriceOracle,
      ilProtectionController,
      liquidityController,
      protectionNFT,
      protectionDiscountNFT,
      protectionDiscountNFTController,
      usdcToken,
      cviFeedOracle,
    } = await runContractsFixtures())

    await usdcToken.mint(liquidityProvider.address, '200000000000')
    await usdcToken.mint(protectionBuyer.address, initialUsdcBalanceBN)
    await usdcToken.connect(liquidityProvider).approve(liquidityController.address, '100000000000')
    await usdcToken.connect(protectionBuyer).approve(liquidityController.address, '100000000000')
    await liquidityController.connect(owner).approveTreasury('200000000000')

    await cviFeedOracle.updateRoundData(0, fromNumber(cvi, 18), 0, 0)

    await ethUsdPriceOracle.setPrice(ethInitialPriceBN)
    await usdUsdPriceOracle.setPrice(usdInitialPriceBN)

    await ilProtectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)
  })

  it("Protection bought with diamond nft discount - 'freeOfChargeTokensWorth' == 0 - should behave similarly to GOLD discount", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedDiscountedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      premiumDiscountComp,
    )

    const expectedDiscount = expectedPremium - expectedDiscountedPremium

    const expectedDiscountedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, premiumDiscountComp, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(formatFixedAndRoundValue(protectionDetails.premiumCostDiscountUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedDiscount.toString(), 5),
    )

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedDiscountedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD)),
    )
  })

  it("Protection bought with diamond nft discount - 'freeOfChargeTokensWorth' == 0,premiumDiscountComp == 0 - should have no discount", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(0)

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD.sub(treasuryBalance)),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )
  })

  it("Protection bought with diamond nft discount - tokensWorth > 'freeOfChargeTokensWorth',premiumDiscountComp == 0 - should only have discount for free tokens", async () => {
    const freeOfChargeTokensWorth = lpTokensWorthAtBuyTimeUsd * 0.5
    const freeOfChargeTokensWorthBN = fromNumber(freeOfChargeTokensWorth, usdcDecimals)

    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(freeOfChargeTokensWorthBN)

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedDiscountedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd - freeOfChargeTokensWorth,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedDiscount = expectedPremium - expectedDiscountedPremium

    const expectedDiscountedFee = calculateFeeTruncated(
      lpTokensWorthAtBuyTimeUsd - freeOfChargeTokensWorth,
      feeComponent,
      0,
      5,
    )

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(formatFixedAndRoundValue(protectionDetails.premiumCostDiscountUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedDiscount.toString(), 5),
    )

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedDiscountedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD)),
    )
  })

  it("Protection bought with diamond nft discount - tokensWorth > 'freeOfChargeTokensWorth',premiumDiscountComp == 100% - should have full discount (no premium paid)", async () => {
    const freeOfChargeTokensWorth = lpTokensWorthAtBuyTimeUsd * 0.5
    const freeOfChargeTokensWorthBN = fromNumber(freeOfChargeTokensWorth, usdcDecimals)

    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(freeOfChargeTokensWorthBN)

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(maxPrecision)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(protectionDetails.premiumCostUSD)

    expect(treasuryBalance).is.equal(0)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(initialLiquidityBN)
  })

  it('Protection bought with GOLD nft discount - premiumDiscountComp == 0 - should have no discount', async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.GOLD - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )
  })

  it('Protection bought with GOLD nft discount - premiumDiscountComp == 100% - should have full discount (no premium paid)', async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.GOLD - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(maxPrecision)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(protectionDetails.premiumCostUSD)

    expect(treasuryBalance).is.equal(0)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(initialLiquidityBN)
  })

  it('Protection bought - discount was already used - should have no discount', async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: true,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(0)

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD.sub(treasuryBalance)),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )
  })

  it('Protection bought - discount feature is disabled - should have no discount', async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    await protectionDiscountNFTController.connect(owner).setEnabled(false)

    await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(0)

    await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(0)

    await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthAtBuyTimeUsd,
      +expectedCollateral,
      initialLiquidity,
      premiumParams1.A,
      premiumParams1.X0,
      premiumParams1.C,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      feeComponent,
      0,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    expect(formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)).is.equal(
      roundCryptoValueString(expectedPremium.toString(), 5),
    )
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)

    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD.sub(treasuryBalance)),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )
  })
})
