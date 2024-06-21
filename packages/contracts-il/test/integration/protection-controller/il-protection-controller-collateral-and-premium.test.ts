import { ethers } from 'hardhat'
import { formatFixed } from '@ethersproject/bignumber'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  LiquidityController,
  ILProtectionNFT,
  CVIFeedOracle,
  LINKUSDOracle,
  USDC,
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
  calcEstimatedAmountToBePaidTruncated,
} from '../../utils'
import { formatFixedAndRoundValue, fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-collateral-and-premium-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let protectionNFT: ILProtectionNFT
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let alice: SignerWithAddress

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

  it('Opening 10 protections with amount X should require the same collateral requirements as one protection with amount 10 * X', async () => {
    for (let i = 0; i < 10; i++) {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])
    }

    const collateral1 = formatFixedAndRoundValue(await protectionController.collateral(), usdcDecimals, 5)

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    expect(await protectionController.collateral()).is.equal(0)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(
        TokenName.WETH,
        TokenName.USDC,
        lpTokensWorthAtBuyTimeUsdBN.mul(10),
        '100000000000',
        policyPeriods[0],
      )

    const collateral2 = formatFixedAndRoundValue(await protectionController.collateral(), usdcDecimals, 5)

    expect(collateral1).is.equal(collateral2)
  })

  it('Protection bought - IL incurred > max IL - should pay no more then maxAmountToBePaid', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await ethUsdPriceOracle.setPrice(fromNumber(10000, priceOracleUsdPairDecimals))

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData)

    const protectionDetails = await protectionNFT.getProtectionDetails(0)
    const protectionWithMetadata = await protectionController.closedProtectionsWithMetadata(0)

    expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(
      initialUsdcBalanceBN.sub(protectionDetails.premiumCostUSD).add(protectionWithMetadata.maxAmountToBePaid),
    )
    expect(protectionWithMetadata.maxAmountToBePaid).is.equal(protectionWithMetadata.amountPaidOnPolicyClose)

    const expectedMaxAmountToBePaid = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    expect(formatFixed(protectionWithMetadata.maxAmountToBePaid, usdcDecimals)).is.equal(expectedMaxAmountToBePaid)
  })

  it('Collateral ratio very low, protection bought with max amount of tokens - Buying protection should succeed', async () => {
    const maxAmountOfTokensWorth = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, maxAmountOfTokensWorth, '100000000000', policyPeriods[0])

    const protectionWithMetadata = await protectionController.openProtectionsWithMetadata(0)

    expect(protectionWithMetadata.exists).is.equal(true)
  })

  it('Should revert if premium cost is too low', async () => {
    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, '1', '100000000000', policyPeriods[0]),
    ).to.be.revertedWith('Premium cost is too low')
  })

  it('Should revert if max premium cost exceeded', async () => {
    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000', policyPeriods[0]),
    ).to.be.revertedWith('Max premium cost exceeded')
  })

  it('When a protection is purchased, collateral increases more than the liquidity (ratio decreases) - the premium increases', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(
        TokenName.WETH,
        TokenName.USDC,
        lpTokensWorthAtBuyTimeUsdBN.mul(10),
        '100000000000',
        policyPeriods[0],
      )

    const premium1 = (await protectionNFT.getProtectionDetails(0)).premiumCostUSD
    const premium2 = (await protectionNFT.getProtectionDetails(1)).premiumCostUSD

    expect(premium2).to.be.above(premium1)
  })

  it('When liquidity is added, such that liquidity ratio becomes smaller, the premium decreases', async () => {
    // We need to buy protections of higher worth because of current premium growth start/premium slope
    const largeTokensWorth = fromNumber(100000, usdcDecimals)

    // Minting some more tokens so we can buy more protection's worth and add more liquidity
    await usdcToken.mint(liquidityProvider.address, initialUsdcBalanceBN)
    await usdcToken.connect(liquidityProvider).approve(liquidityController.address, '200000000000')
    await usdcToken.mint(protectionBuyer.address, initialUsdcBalanceBN)
    await usdcToken.connect(protectionBuyer).approve(liquidityController.address, '200000000000')

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, largeTokensWorth, '100000000000', policyPeriods[0])

    await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, largeTokensWorth, '100000000000', policyPeriods[0])

    const premium1 = (await protectionNFT.getProtectionDetails(0)).premiumCostUSD
    const premium2 = (await protectionNFT.getProtectionDetails(1)).premiumCostUSD

    expect(premium2).to.be.below(premium1)
  })
})
