import { ethers } from 'hardhat'
import { formatFixed } from '@ethersproject/bignumber'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  ILProtectionNFT,
  LiquidityController,
  CVIFeedOracle,
  USDC,
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
  getLatestBlockTimestamp,
  setNextBlockTimestampAndMine,
  calcAmountToBePaid,
  runContractsFixtures,
  ethInitialPriceBN,
  usdInitialPriceBN,
  ethInitialPrice,
  usdInitialPrice,
  lpTokensWorthAtBuyTimeUsd,
  lpTokensWorthAtBuyTimeUsdBN,
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
  priceOracleUsdPairDecimals,
  queryEvents,
} from '../../utils'
import { fromNumber, roundCryptoValueString, formatFixedAndRoundValue } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'
import { DiscountNFTType } from '../../utils/types'

describe('ILProtectionControllerTest full flows', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let protectionNFT: ILProtectionNFT
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let liquidityWithdrawnToAccount: SignerWithAddress
  let treasury: SignerWithAddress

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)

    ;({ owner, liquidityProvider, protectionBuyer, liquidityWithdrawnToAccount, treasury } =
      await helper.getNamedSigners())
    ;({
      ethUsdPriceOracle,
      usdUsdPriceOracle,
      ilProtectionController: protectionController,
      liquidityController,
      protectionNFT,
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
    await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN)
    expect(await usdcToken.balanceOf(liquidityProvider.address)).is.equal('100000000000')
  })

  it('Protection bought and closed - eth price goes down, buyer gains profit, liquidity withdrawn', async () => {
    const ethEndPrice = '200000000000'

    /** Buying protection **/

    const [estimatedPremium] = await protectionController.calculatePremiumDetailsAndMaxAmountToBePaid(
      protectionBuyer.address,
      TokenName.WETH,
      TokenName.USDC,
      lpTokensWorthAtBuyTimeUsdBN,
      policyPeriods[0],
    )

    const buyProtectionTx = await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, estimatedPremium, policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.ProtectionBought()],
      },
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args

    /** Preparing data for buying protection asserts **/

    let collateral = await protectionController.collateral()
    let pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumTruncated(
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(2)

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
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.NONE)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    // Asserting the premium was transferred to liquidity
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )

    expect(await protectionController.openProtectionsIds(0)).is.equal(0)

    expect((await protectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(openProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await protectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await protectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.ProtectionClosed()],
      },
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await protectionController.collateral()
    pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      lpTokensWorthAtBuyTimeUsd,
      ethInitialPrice,
      usdInitialPrice,
      2000,
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
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN
        .sub(protectionDetails.premiumCostUSD)
        .add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(closedProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(protectionController.openProtectionsIds(0)).to.be.reverted

    /** Withdrawing liquidity **/

    const liquidityBeforeWithdrawal = await usdcToken.balanceOf(liquidityController.address)

    await protectionController
      .connect(liquidityProvider)
      .withdrawLiquidity(liquidityBeforeWithdrawal, liquidityWithdrawnToAccount.address)

    expect(await usdcToken.balanceOf(liquidityWithdrawnToAccount.address)).is.equal(liquidityBeforeWithdrawal)
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(0)
  })

  it('Protection bought and closed - eth price goes up, buyer gains profit', async () => {
    const ethEndPrice = '400000000000'

    /** Buying protection **/

    const buyProtectionTx = await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.ProtectionBought()],
      },
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args

    /** Preparing data for buying protection asserts **/

    let collateral = await protectionController.collateral()
    let pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumTruncated(
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(2)

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
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.NONE)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    // Asserting the premium was transferred to liquidity
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )

    expect(await protectionController.openProtectionsIds(0)).is.equal(0)

    expect((await protectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(openProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { upkeepNeeded, performData } = await protectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await protectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.ProtectionClosed()],
      },
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await protectionController.collateral()
    pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
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
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN
        .sub(protectionDetails.premiumCostUSD)
        .add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPrice)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(closedProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(protectionController.openProtectionsIds(0)).to.be.reverted
  })

  it('Protection bought and closed - eth price goes up a very small amount, buyer gains profit', async () => {
    const ethEndPrice = ethInitialPrice + 0.01
    const ethEndPriceBN = fromNumber(ethEndPrice, priceOracleUsdPairDecimals)

    /** Buying protection **/

    const buyProtectionTx = await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.ProtectionBought()],
      },
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args

    /** Preparing data for buying protection asserts **/

    let collateral = await protectionController.collateral()
    let pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumTruncated(
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(2)

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
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.NONE)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    // Asserting the premium was transferred to liquidity
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )

    expect(await protectionController.openProtectionsIds(0)).is.equal(0)

    expect((await protectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(openProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPriceBN)

    const { upkeepNeeded, performData } = await protectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await protectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.ProtectionClosed()],
      },
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await protectionController.collateral()
    pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)
    const expectedAmountToPay = calcAmountToBePaid(
      lpTokensWorthAtBuyTimeUsd,
      ethInitialPrice,
      usdInitialPrice,
      ethEndPrice,
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
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN
        .sub(protectionDetails.premiumCostUSD)
        .add(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethEndPriceBN)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(closedProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethEndPriceBN)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN
        .add(protectionDetails.premiumCostUSD)
        .sub(treasuryBalance)
        .sub(closedProtectionWithMetadata.amountPaidOnPolicyClose),
    )

    await expect(protectionController.openProtectionsIds(0)).to.be.reverted
  })

  it('Protection bought and closed - eth price stays the same, buyer gains no profit', async () => {
    /** Buying protection **/

    const buyProtectionTx = await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const buyProtectionEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.ProtectionBought()],
      },
      {
        contract: protectionController,
        fromBlock: buyProtectionTx.blockNumber!,
        toBlock: buyProtectionTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionBoughtEventArgs = buyProtectionEvents[0].args
    let pairCollateralChangedEventArgs = buyProtectionEvents[1].args

    /** Preparing data for buying protection asserts **/

    let collateral = await protectionController.collateral()
    let pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const maxAmountToBePaid = collateral
    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    let totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    let sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedPremium = calculatePremiumTruncated(
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
      5,
    )

    const formattedPremiumCost = formatFixedAndRoundValue(protectionDetails.premiumCostUSD, usdcDecimals, 5)

    const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, 5)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    /** Buying protections asserts **/

    expect(buyProtectionEvents?.length).is.equal(2)

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
    expect(formattedPremiumCost).is.equal(expectedPremium)
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(0)
    expect(protectionDetails.discountNFTType).is.equal(DiscountNFTType.NONE)
    expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(lpTokensWorthAtBuyTimeUsdBN)
    expect(protectionDetails.token1Symbol).is.equal(TokenName.WETH)
    expect(protectionDetails.token2Symbol).is.equal(TokenName.USDC)

    // Asserting treasury balance
    expect(formatFixedAndRoundValue(treasuryBalance, usdcDecimals, 5)).is.equal(expectedFee)

    // Asserting the premium was transferred to liquidity
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )

    expect(await protectionController.openProtectionsIds(0)).is.equal(0)

    expect((await protectionController.closedProtectionsWithMetadata(0)).exists).is.equal(false)

    // Asserting opened protection's metadata
    let openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(openProtectionWithMetadata.protectionId).is.equal(0)
    expect(openProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(openProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(openProtectionWithMetadata.token1EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.token2EndPriceUSD).is.equal(0)
    expect(openProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(openProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )

    /** Closing protection **/

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    const { upkeepNeeded, performData } = await protectionController.checkUpkeep([])

    expect(upkeepNeeded).is.equal(true)

    const closeProtectionsTx = await protectionController.performUpkeep(performData)

    const protectionClosedEvents = await queryEvents([
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.ProtectionClosed()],
      },
      {
        contract: protectionController,
        fromBlock: closeProtectionsTx.blockNumber!,
        toBlock: closeProtectionsTx.blockNumber!,
        filters: [protectionController.filters.CollateralUpdated()],
      },
    ])

    const protectionClosedEventArgs = protectionClosedEvents[0].args
    pairCollateralChangedEventArgs = protectionClosedEvents[1].args

    collateral = await protectionController.collateral()
    pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    totalTokensWorth = await protectionController.totalLPTokensWorthAtBuyTimeUSD()
    sumTokensWorth = await protectionController.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    openProtectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(protectionClosedEvents?.length).is.equal(2)

    expect(collateral).is.equal(0)
    expect(pairCollateral).is.equal(0)

    expect(totalTokensWorth).is.equal(0)
    expect(sumTokensWorth).is.equal(lpTokensWorthAtBuyTimeUsdBN)

    expect(closedProtectionWithMetadata.amountPaidOnPolicyClose).is.equal(0)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )

    expect(openProtectionWithMetadata.exists).is.equal(false)

    expect(closedProtectionWithMetadata.protectionId).is.equal(0)
    expect(closedProtectionWithMetadata.token1EntryPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EntryPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.token1EndPriceUSD).is.equal(ethInitialPriceBN)
    expect(closedProtectionWithMetadata.token2EndPriceUSD).is.equal(usdInitialPriceBN)
    expect(closedProtectionWithMetadata.maxAmountToBePaid).is.equal(maxAmountToBePaid)
    expect(closedProtectionWithMetadata.fee).is.equal(treasuryBalance)
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
    expect(protectionClosedEventArgs!.token1EndPriceUSD).is.equal(ethInitialPriceBN)
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
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(pairCollateralChangedEventArgs!.newLiquidity).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )

    await expect(protectionController.openProtectionsIds(0)).to.be.reverted
  })

  it('Protection bought and closed - eth price is stagnant, buyer gains 0 profit, liquidity withdrawn', async () => {
    const ethEndPrice = '276000000000'

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    await ethUsdPriceOracle.setPrice(ethEndPrice)

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const closedProtectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)

    expect(closedProtectionWithMetadata.amountPaidOnPolicyClose).is.equal(0)

    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(treasuryBalance),
    )
    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialLiquidityBN.sub(protectionDetails.premiumCostUSD),
    )
  })

  it('3 protections bought with different periods - period expires for 1 protection - only earliest 1 should be closed, the others should remain open (since no price change - amountPaidOnPolicyClose = 0)', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[2])

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    const protectionIdPeriod1 = await protectionController.openProtectionsIds(0)
    const protectionIdPeriod2 = await protectionController.openProtectionsIds(1)
    const protectionIdPeriod3 = await protectionController.openProtectionsIds(2)

    let openProtectionPeriod1 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod1)
    let openProtectionPeriod2 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod2)
    let openProtectionPeriod3 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod3)

    let protectionDetailsPeriod1 = await protectionNFT.getProtectionDetails(protectionIdPeriod1)
    let protectionDetailsPeriod2 = await protectionNFT.getProtectionDetails(protectionIdPeriod2)
    let protectionDetailsPeriod3 = await protectionNFT.getProtectionDetails(protectionIdPeriod3)

    expect(openProtectionPeriod1.exists).is.equal(true)
    expect(openProtectionPeriod2.exists).is.equal(true)
    expect(openProtectionPeriod3.exists).is.equal(true)
    expect(protectionDetailsPeriod1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetailsPeriod2.policyPeriod).is.equal(policyPeriods[1])
    expect(protectionDetailsPeriod3.policyPeriod).is.equal(policyPeriods[2])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    openProtectionPeriod1 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod1)
    openProtectionPeriod2 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod2)
    openProtectionPeriod3 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod3)

    protectionDetailsPeriod1 = await protectionNFT.getProtectionDetails(protectionIdPeriod1)
    protectionDetailsPeriod2 = await protectionNFT.getProtectionDetails(protectionIdPeriod2)
    protectionDetailsPeriod3 = await protectionNFT.getProtectionDetails(protectionIdPeriod3)

    const closedProtectionPeriod1 = await protectionController.closedProtectionsWithMetadata(protectionIdPeriod1)

    expect(openProtectionPeriod1.exists).is.equal(false)
    expect(openProtectionPeriod2.exists).is.equal(true)
    expect(openProtectionPeriod3.exists).is.equal(true)
    expect(closedProtectionPeriod1.exists).is.equal(true)
    expect(closedProtectionPeriod1.amountPaidOnPolicyClose).is.equal(0)
    expect(protectionDetailsPeriod1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetailsPeriod2.policyPeriod).is.equal(policyPeriods[1])
    expect(protectionDetailsPeriod3.policyPeriod).is.equal(policyPeriods[2])
    expect(await protectionController.openProtectionsIds(0)).is.equal(protectionIdPeriod3)
    expect(await protectionController.openProtectionsIds(1)).is.equal(protectionIdPeriod2)
    await expect(protectionController.openProtectionsIds(2)).to.be.reverted
  })

  it('2 protections bought with same period - period expires - protections closed successfully (since no price change - both protections - amountPaidOnPolicyClose = 0)', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[0])

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    const protectionId1 = await protectionController.openProtectionsIds(0)
    const protectionId2 = await protectionController.openProtectionsIds(1)

    let openProtection1 = await protectionController.openProtectionsWithMetadata(protectionId1)
    let openProtection2 = await protectionController.openProtectionsWithMetadata(protectionId2)

    let protectionDetails1 = await protectionNFT.getProtectionDetails(protectionId1)
    let protectionDetails2 = await protectionNFT.getProtectionDetails(protectionId2)

    expect(openProtection1.exists).is.equal(true)
    expect(openProtection2.exists).is.equal(true)
    expect(protectionDetails1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetails2.policyPeriod).is.equal(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    openProtection1 = await protectionController.openProtectionsWithMetadata(protectionId1)
    openProtection2 = await protectionController.openProtectionsWithMetadata(protectionId2)

    protectionDetails1 = await protectionNFT.getProtectionDetails(protectionId1)
    protectionDetails2 = await protectionNFT.getProtectionDetails(protectionId2)

    const closedProtection1 = await protectionController.closedProtectionsWithMetadata(protectionId1)
    const closedProtection2 = await protectionController.closedProtectionsWithMetadata(protectionId2)

    expect(openProtection1.exists).is.equal(false)
    expect(openProtection2.exists).is.equal(false)
    expect(closedProtection1.exists).is.equal(true)
    expect(closedProtection2.exists).is.equal(true)

    expect(closedProtection1.amountPaidOnPolicyClose).is.equal(0)
    expect(closedProtection2.amountPaidOnPolicyClose).is.equal(0)

    expect(protectionDetails1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetails1.policyPeriod).is.equal(policyPeriods[0])
    await expect(protectionController.openProtectionsIds(0)).to.be.reverted
    await expect(protectionController.openProtectionsIds(1)).to.be.reverted
  })

  it('2 protections bought with different periods - periods expires - both protections closed successfully', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

    const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
    const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriods[1])

    await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)

    const protectionIdPeriod1 = await protectionController.openProtectionsIds(0)
    const protectionIdPeriod2 = await protectionController.openProtectionsIds(1)

    let openProtectionPeriod1 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod1)
    let openProtectionPeriod2 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod2)

    let protectionDetailsPeriod1 = await protectionNFT.getProtectionDetails(protectionIdPeriod1)
    let protectionDetailsPeriod2 = await protectionNFT.getProtectionDetails(protectionIdPeriod2)

    expect(openProtectionPeriod1.exists).is.equal(true)
    expect(openProtectionPeriod2.exists).is.equal(true)
    expect(protectionDetailsPeriod1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetailsPeriod2.policyPeriod).is.equal(policyPeriods[1])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    openProtectionPeriod1 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod1)
    openProtectionPeriod2 = await protectionController.openProtectionsWithMetadata(protectionIdPeriod2)

    protectionDetailsPeriod1 = await protectionNFT.getProtectionDetails(protectionIdPeriod1)
    protectionDetailsPeriod2 = await protectionNFT.getProtectionDetails(protectionIdPeriod2)

    const closedProtectionPeriod1 = await protectionController.closedProtectionsWithMetadata(protectionIdPeriod1)
    const closedProtectionPeriod2 = await protectionController.closedProtectionsWithMetadata(protectionIdPeriod2)

    expect(openProtectionPeriod1.exists).is.equal(false)
    expect(openProtectionPeriod2.exists).is.equal(false)
    expect(closedProtectionPeriod1.exists).is.equal(true)
    expect(closedProtectionPeriod2.exists).is.equal(true)
    expect(protectionDetailsPeriod1.policyPeriod).is.equal(policyPeriods[0])
    expect(protectionDetailsPeriod2.policyPeriod).is.equal(policyPeriods[1])

    await expect(protectionController.openProtectionsIds(0)).to.be.reverted
    await expect(protectionController.openProtectionsIds(1)).to.be.reverted
  })
})
