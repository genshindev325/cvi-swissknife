import { ethers } from 'hardhat'
import { formatFixed } from '@ethersproject/bignumber'
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
  growthFactor,
  maxImpermanentLoss,
  usdcDecimals,
  premiumParams1,
  calcPolicyPeriodEnd,
  calcAmountToBePaid,
  runContractsFixtures,
  ethInitialPriceBN,
  usdInitialPriceBN,
  ethInitialPrice,
  usdInitialPrice,
  initialLiquidityBN,
  initialLiquidity,
  initialUsdcBalanceBN,
  TestHelper,
  calculatePremiumTruncated,
  calcEstimatedAmountToBePaidTruncated,
  calculateFeeTruncated,
  feeComponent,
  feeComponentBN,
  premiumGrowthStart,
  premiumSlope,
  getLatestBlockTimestamp,
  queryEvents,
  premiumDiscountCompBN,
  freeOfChargeTokensBN,
  freeOfChargeTokens,
  premiumDiscountComp,
  calculatePremiumWithFeesAndDiscount,
  lpTokensWorthAtBuyTimeUsdBN,
  lpTokensWorthAtBuyTimeUsd,
  setNextBlockTimestampAndMine,
} from '../../utils'
import { fromNumber, roundCryptoValueString, formatFixedAndRoundValue } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'
import { DiscountNFTType } from '../../utils/types'

describe('il-protection-controller-buying-discounted-protections-full-flows-tests', () => {
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

  const lpTokensWorthSmallAmount = 200
  const lpTokensWorthSmallAmountBN = fromNumber(lpTokensWorthSmallAmount, usdcDecimals)
  const lpTokensWorthMoreThanFreeTokens = freeOfChargeTokens * 10
  const lpTokensWorthMoreThanFreeTokensBN = fromNumber(lpTokensWorthMoreThanFreeTokens, usdcDecimals)
  const ethEndPrice = '400000000000'

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

    /** Adding liquidity + asserts **/
    await ilProtectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(liquidityProvider.address)).is.equal('100000000000')
  })

  it("Protection bought with diamond nft discount - tokensWorth < 'freeOfChargeTokensWorth' - protection closed", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    /** Buying protection **/

    const buyProtectionTx = await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthSmallAmountBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionBought(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
      {
        contract: protectionNFT,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionNFT.filters.ProtectionMintDiscountDetails()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args
    const protectionMintDiscountDetailsEventArgs = buyProtectionEvents[2].args

    /** Preparing data for buying protection asserts **/

    let collateral = await ilProtectionController.collateral()
    let pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthSmallAmount,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const discountDetails = await protectionDiscountNFTController.getDiscountDetails(protectionBuyer.address)

    const expectedPremium = calculatePremiumTruncated(
      lpTokensWorthSmallAmount,
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)
    const formattedPremiumCostDiscount = formatFixedAndRoundValue(
      protectionDetails.premiumCostDiscountUSD,
      usdcDecimals,
      5,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthSmallAmount, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()

    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(3)

    expect(formatFixed(collateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)

    expect(totalTokensWorth).is.equal(lpTokensWorthSmallAmountBN)
    expect(sumTokensWorth).is.equal(lpTokensWorthSmallAmountBN)

    expect(await protectionNFT.tokenIdCounter()).is.equal(1)

    // Asserting protection NFT details
    expect(protectionDetails.id).is.equal(0)
    expect(protectionDetails.owner).is.equal(protectionBuyer.address)
    expect(protectionDetails.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionDetails.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(formattedPremiumCostDiscount).is.equal(expectedPremium)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthSmallAmountBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(treasuryBalance).is.equal(0)

    // Asserting that no premium was transferred to liquidity or from buyer (full discount)
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(initialLiquidityBN)

    expect(await ilProtectionController.openProtectionsIds(0)).is.equal(0)

    expect((await ilProtectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(openProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(openProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)
    expect(openProtectionWithMetadata.mappingIdx).is.equal(0)
    expect(openProtectionWithMetadata.exists).is.equal(true)

    expect(protectionBoughtEventArgs!.id).is.equal(0)
    expect(protectionBoughtEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionBoughtEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionBoughtEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionBoughtEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionBoughtEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionBoughtEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionBoughtEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionBoughtEventArgs!.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(protectionBoughtEventArgs!.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionBoughtEventArgs!.collateral).is.equal(collateral)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(initialLiquidityBN)

    expect(protectionMintDiscountDetailsEventArgs!.id).is.equal(0)
    expect(protectionMintDiscountDetailsEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionMintDiscountDetailsEventArgs!.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostBeforeDiscount).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostDiscount).is.equal(protectionDetails.premiumCostUSD)

    expect(discountDetails.discountType).is.equal(DiscountNFTType.DIAMOND)
    expect(discountDetails.isUsed).is.equal(true)
    expect(discountDetails.premiumDiscountComponent).is.equal(premiumDiscountCompBN)
    expect(discountDetails.freeOfChargeTokensWorth).is.equal(freeOfChargeTokensBN)

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await ilProtectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await ilProtectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionClosed(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await ilProtectionController.collateral()
    pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await ilProtectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      lpTokensWorthSmallAmount,
      ethInitialPrice,
      usdInitialPrice,
      4000,
      usdInitialPrice,
    )

    expect(protectionClosedEvents?.length).is.equal(2)

    expect(collateral).is.equal(0)
    expect(pairCollateral).is.equal(0)

    expect(totalTokensWorth).is.equal(0)
    expect(sumTokensWorth).is.equal(lpTokensWorthSmallAmountBN)

    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.amountPaidOnPolicyClose, usdcDecimals, 4)).is.equal(
      roundCryptoValueString(expectedAmountToPay.toString(), 4),
    )

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(closedProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)

    expect(closedProtectionWithMetadata.exists).is.equal(true)

    expect(protectionClosedEventArgs!.amountPaidUSD).is.equal(closedProtectionWithMetadata.amountPaidOnPolicyClose)
    expect(protectionClosedEventArgs!.id).is.equal(0)
    expect(protectionClosedEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionClosedEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionClosedEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionClosedEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionClosedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionClosedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionClosedEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(protectionClosedEventArgs!.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionClosedEventArgs!.collateral).is.equal(0)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN.sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(ilProtectionController.openProtectionsIds(0)).to.be.reverted
  })

  it("Protection bought with diamond nft discount - tokensWorth == 'freeOfChargeTokensWorth' - protection closed", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    /** Buying protection **/

    const buyProtectionTx = await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, freeOfChargeTokensBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionBought(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
      {
        contract: protectionNFT,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionNFT.filters.ProtectionMintDiscountDetails()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args
    const protectionMintDiscountDetailsEventArgs = buyProtectionEvents[2].args

    /** Preparing data for buying protection asserts **/

    let collateral = await ilProtectionController.collateral()
    let pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      freeOfChargeTokens,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const discountDetails = await protectionDiscountNFTController.getDiscountDetails(protectionBuyer.address)

    const expectedPremium = calculatePremiumTruncated(
      freeOfChargeTokens,
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)
    const formattedPremiumCostDiscount = formatFixedAndRoundValue(
      protectionDetails.premiumCostDiscountUSD,
      usdcDecimals,
      5,
    )

    const expectedFee = calculateFeeTruncated(freeOfChargeTokens, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()

    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(3)

    expect(formatFixed(collateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)

    expect(totalTokensWorth).is.equal(freeOfChargeTokensBN)
    expect(sumTokensWorth).is.equal(freeOfChargeTokensBN)

    expect(await protectionNFT.tokenIdCounter()).is.equal(1)

    // Asserting protection NFT details
    expect(protectionDetails.id).is.equal(0)
    expect(protectionDetails.owner).is.equal(protectionBuyer.address)
    expect(protectionDetails.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionDetails.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(formattedPremiumCostDiscount).is.equal(expectedPremium)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(freeOfChargeTokensBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(treasuryBalance).is.equal(0)

    // Asserting that no premium was transferred to liquidity or from buyer (full discount)
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(initialLiquidityBN)

    expect(await ilProtectionController.openProtectionsIds(0)).is.equal(0)

    expect((await ilProtectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(openProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(openProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)
    expect(openProtectionWithMetadata.mappingIdx).is.equal(0)
    expect(openProtectionWithMetadata.exists).is.equal(true)

    expect(protectionBoughtEventArgs!.id).is.equal(0)
    expect(protectionBoughtEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionBoughtEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionBoughtEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionBoughtEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionBoughtEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionBoughtEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionBoughtEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionBoughtEventArgs!.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(protectionBoughtEventArgs!.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionBoughtEventArgs!.collateral).is.equal(collateral)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(initialLiquidityBN)

    expect(protectionMintDiscountDetailsEventArgs!.id).is.equal(0)
    expect(protectionMintDiscountDetailsEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionMintDiscountDetailsEventArgs!.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostBeforeDiscount).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostDiscount).is.equal(protectionDetails.premiumCostUSD)

    expect(discountDetails.discountType).is.equal(DiscountNFTType.DIAMOND)
    expect(discountDetails.isUsed).is.equal(true)
    expect(discountDetails.premiumDiscountComponent).is.equal(premiumDiscountCompBN)
    expect(discountDetails.freeOfChargeTokensWorth).is.equal(freeOfChargeTokensBN)

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await ilProtectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await ilProtectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionClosed(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await ilProtectionController.collateral()
    pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await ilProtectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      freeOfChargeTokens,
      ethInitialPrice,
      usdInitialPrice,
      4000,
      usdInitialPrice,
    )

    expect(protectionClosedEvents?.length).is.equal(2)

    expect(collateral).is.equal(0)
    expect(pairCollateral).is.equal(0)

    expect(totalTokensWorth).is.equal(0)
    expect(sumTokensWorth).is.equal(freeOfChargeTokensBN)

    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.amountPaidOnPolicyClose, usdcDecimals, 4)).is.equal(
      roundCryptoValueString(expectedAmountToPay.toString(), 4),
    )

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(closedProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)

    expect(closedProtectionWithMetadata.exists).is.equal(true)

    expect(protectionClosedEventArgs!.amountPaidUSD).is.equal(closedProtectionWithMetadata.amountPaidOnPolicyClose)
    expect(protectionClosedEventArgs!.id).is.equal(0)
    expect(protectionClosedEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionClosedEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionClosedEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionClosedEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionClosedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionClosedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionClosedEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(protectionClosedEventArgs!.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionClosedEventArgs!.collateral).is.equal(0)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN.sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(ilProtectionController.openProtectionsIds(0)).to.be.reverted
  })

  it("Protection bought with diamond nft discount - tokensWorth > 'freeOfChargeTokensWorth' - protection closed", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.DIAMOND - 1,
      isUsed: false,
      isMinted: true,
    })

    /** Buying protection **/

    const buyProtectionTx = await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(
        TokenName.WETH,
        TokenName.USDC,
        lpTokensWorthMoreThanFreeTokensBN,
        '100000000000',
        policyPeriods[0],
      )

    const buyProtectionEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionBought(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
      {
        contract: protectionNFT,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionNFT.filters.ProtectionMintDiscountDetails()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args
    const protectionMintDiscountDetailsEventArgs = buyProtectionEvents[2].args

    /** Preparing data for buying protection asserts **/

    let collateral = await ilProtectionController.collateral()
    let pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthMoreThanFreeTokens,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    let openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const discountDetails = await protectionDiscountNFTController.getDiscountDetails(protectionBuyer.address)

    const expectedPremium = calculatePremiumWithFeesAndDiscount(
      lpTokensWorthMoreThanFreeTokens,
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
      lpTokensWorthMoreThanFreeTokens - freeOfChargeTokens,
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

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)
    const formattedPremiumCostDiscount = formatFixedAndRoundValue(
      protectionDetails.premiumCostDiscountUSD,
      usdcDecimals,
      5,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthMoreThanFreeTokens, feeComponent, 0, 5)
    const expectedDiscountedFee = calculateFeeTruncated(
      lpTokensWorthMoreThanFreeTokens - freeOfChargeTokens,
      feeComponent,
      premiumDiscountComp,
      5,
    )

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()

    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(3)

    expect(formatFixed(collateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)

    expect(totalTokensWorth).is.equal(lpTokensWorthMoreThanFreeTokensBN)
    expect(sumTokensWorth).is.equal(lpTokensWorthMoreThanFreeTokensBN)

    expect(await protectionNFT.tokenIdCounter()).is.equal(1)

    // Asserting protection NFT details
    expect(protectionDetails.id).is.equal(0)
    expect(protectionDetails.owner).is.equal(protectionBuyer.address)
    expect(protectionDetails.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionDetails.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(formattedPremiumCost).is.equal(roundCryptoValueString(expectedPremium.toString(), 5))
    expect(formattedPremiumCostDiscount).is.equal(roundCryptoValueString(expectedDiscount.toString(), 5))
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthMoreThanFreeTokensBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedDiscountedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD)),
    )

    expect(await ilProtectionController.openProtectionsIds(0)).is.equal(0)

    expect((await ilProtectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(openProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(openProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)
    expect(openProtectionWithMetadata.mappingIdx).is.equal(0)
    expect(openProtectionWithMetadata.exists).is.equal(true)

    expect(protectionBoughtEventArgs!.id).is.equal(0)
    expect(protectionBoughtEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionBoughtEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionBoughtEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionBoughtEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionBoughtEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionBoughtEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionBoughtEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionBoughtEventArgs!.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(protectionBoughtEventArgs!.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionBoughtEventArgs!.collateral).is.equal(collateral)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )

    expect(protectionMintDiscountDetailsEventArgs!.id).is.equal(0)
    expect(protectionMintDiscountDetailsEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionMintDiscountDetailsEventArgs!.discountNFTType).is.equal(DiscountNFTType.DIAMOND)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostBeforeDiscount).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostDiscount).is.equal(
      protectionDetails.premiumCostDiscountUSD,
    )

    expect(discountDetails.discountType).is.equal(DiscountNFTType.DIAMOND)
    expect(discountDetails.isUsed).is.equal(true)
    expect(discountDetails.premiumDiscountComponent).is.equal(premiumDiscountCompBN)
    expect(discountDetails.freeOfChargeTokensWorth).is.equal(freeOfChargeTokensBN)

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await ilProtectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await ilProtectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionClosed(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await ilProtectionController.collateral()
    pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await ilProtectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      lpTokensWorthMoreThanFreeTokens,
      ethInitialPrice,
      usdInitialPrice,
      4000,
      usdInitialPrice,
    )

    expect(protectionClosedEvents?.length).is.equal(2)

    expect(collateral).is.equal(0)
    expect(pairCollateral).is.equal(0)

    expect(totalTokensWorth).is.equal(0)
    expect(sumTokensWorth).is.equal(lpTokensWorthMoreThanFreeTokensBN)

    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.amountPaidOnPolicyClose, usdcDecimals, 4)).is.equal(
      roundCryptoValueString(expectedAmountToPay.toString(), 4),
    )

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance))
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN
        .sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD))
        .add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(closedProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)

    expect(closedProtectionWithMetadata.exists).is.equal(true)

    expect(protectionClosedEventArgs!.amountPaidUSD).is.equal(closedProtectionWithMetadata.amountPaidOnPolicyClose)
    expect(protectionClosedEventArgs!.id).is.equal(0)
    expect(protectionClosedEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionClosedEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionClosedEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionClosedEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionClosedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionClosedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionClosedEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(protectionClosedEventArgs!.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionClosedEventArgs!.collateral).is.equal(0)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance))
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(ilProtectionController.openProtectionsIds(0)).to.be.reverted
  })

  it("Protection bought with gold nft discount - premium discount should be 'premiumDiscountComponent' - protection closed", async () => {
    await protectionDiscountNFT.setTokenInfo(protectionBuyer.address, {
      index: DiscountNFTType.GOLD - 1,
      isUsed: false,
      isMinted: true,
    })

    /** Buying protection **/

    const buyProtectionTx = await ilProtectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionBought(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
      {
        contract: protectionNFT,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionNFT.filters.ProtectionMintDiscountDetails()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args
    const protectionMintDiscountDetailsEventArgs = buyProtectionEvents[2].args

    /** Preparing data for buying protection asserts **/

    let collateral = await ilProtectionController.collateral()
    let pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    let openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const discountDetails = await protectionDiscountNFTController.getDiscountDetails(protectionBuyer.address)

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

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)
    const formattedPremiumCostDiscount = formatFixedAndRoundValue(
      protectionDetails.premiumCostDiscountUSD,
      usdcDecimals,
      5,
    )

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)
    const expectedDiscountedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, premiumDiscountComp, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()

    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(3)

    expect(formatFixed(collateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)

    expect(totalTokensWorth).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(sumTokensWorth).is.equal(lpTokensWorthAtBuyTimeUsdBN)

    expect(await protectionNFT.tokenIdCounter()).is.equal(1)

    // Asserting protection NFT details
    expect(protectionDetails.id).is.equal(0)
    expect(protectionDetails.owner).is.equal(protectionBuyer.address)
    expect(protectionDetails.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionDetails.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(formattedPremiumCost).is.equal(roundCryptoValueString(expectedPremium.toString(), 5))
    expect(formattedPremiumCostDiscount).is.equal(roundCryptoValueString(expectedDiscount.toString(), 5))
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.GOLD)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedDiscountedFee)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD)),
    )

    expect(await ilProtectionController.openProtectionsIds(0)).is.equal(0)

    expect((await ilProtectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(openProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(openProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)
    expect(openProtectionWithMetadata.mappingIdx).is.equal(0)
    expect(openProtectionWithMetadata.exists).is.equal(true)

    expect(protectionBoughtEventArgs!.id).is.equal(0)
    expect(protectionBoughtEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionBoughtEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionBoughtEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionBoughtEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionBoughtEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionBoughtEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionBoughtEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionBoughtEventArgs!.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(protectionBoughtEventArgs!.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionBoughtEventArgs!.collateral).is.equal(collateral)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(collateral)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(initialLiquidityBN)
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )

    expect(protectionMintDiscountDetailsEventArgs!.id).is.equal(0)
    expect(protectionMintDiscountDetailsEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionMintDiscountDetailsEventArgs!.discountNFTType).is.equal(DiscountNFTType.GOLD)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostBeforeDiscount).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionMintDiscountDetailsEventArgs!.premiumCostDiscount).is.equal(
      protectionDetails.premiumCostDiscountUSD,
    )

    expect(discountDetails.discountType).is.equal(DiscountNFTType.GOLD)
    expect(discountDetails.isUsed).is.equal(true)
    expect(discountDetails.premiumDiscountComponent).is.equal(premiumDiscountCompBN)
    expect(discountDetails.freeOfChargeTokensWorth).is.equal(freeOfChargeTokensBN)

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await ilProtectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await ilProtectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: ilProtectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [
          ilProtectionController.filters.ProtectionClosed(),
          ilProtectionController.filters.CollateralUpdated(),
        ],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await ilProtectionController.collateral()
    pairCollateral = await ilProtectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await ilProtectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await ilProtectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await ilProtectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await ilProtectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      lpTokensWorthAtBuyTimeUsd,
      ethInitialPrice,
      usdInitialPrice,
      4000,
      usdInitialPrice,
    )

    expect(protectionClosedEvents?.length).is.equal(2)

    expect(collateral).is.equal(0)
    expect(pairCollateral).is.equal(0)

    expect(totalTokensWorth).is.equal(0)
    expect(sumTokensWorth).is.equal(lpTokensWorthAtBuyTimeUsdBN)

    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.amountPaidOnPolicyClose, usdcDecimals, 4)).is.equal(
      roundCryptoValueString(expectedAmountToPay.toString(), 4),
    )

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance))
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN
        .sub(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD))
        .add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(formatFixedAndRoundValue(closedProtectionWithMetadata.fee, usdcDecimals, 5)).is.equal(expectedFee)
    expect(closedProtectionWithMetadata.feeComponent).is.equal(feeComponentBN)

    expect(closedProtectionWithMetadata.exists).is.equal(true)

    expect(protectionClosedEventArgs!.amountPaidUSD).is.equal(closedProtectionWithMetadata.amountPaidOnPolicyClose)
    expect(protectionClosedEventArgs!.id).is.equal(0)
    expect(protectionClosedEventArgs!.owner).is.equal(protectionBuyer.address)
    expect(protectionClosedEventArgs!.protectionStartTimestamp).is.equal(expectedProtectionStartTimestamp)
    expect(protectionClosedEventArgs!.protectionEndTimestamp).is.equal(expectedProtectionEndTimestamp)
    expect(protectionClosedEventArgs!.premiumCostUSD).is.equal(protectionDetails.premiumCostUSD)
    expect(protectionClosedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionClosedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(protectionClosedEventArgs!.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(protectionClosedEventArgs!.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(protectionClosedEventArgs!.collateral).is.equal(0)

    expect(pairCollateralChangedEventArgs!.token1Symbol).is.equal(TokenName.WETH)
    expect(pairCollateralChangedEventArgs!.token2Symbol).is.equal(TokenName.USDC)
    expect(pairCollateralChangedEventArgs!.protectionId).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevPairCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newPairCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevCollateral).is.equal(maxAmountToBePaid)
    expect(pairCollateralChangedEventArgs!.newCollateral).is.equal(0)
    expect(pairCollateralChangedEventArgs!.prevLiquidity).is.equal(
      initialLiquidityBN.add(
        protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance),
      ),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD.sub(protectionDetails.premiumCostDiscountUSD).sub(treasuryBalance))
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(ilProtectionController.openProtectionsIds(0)).to.be.reverted
  })
})
