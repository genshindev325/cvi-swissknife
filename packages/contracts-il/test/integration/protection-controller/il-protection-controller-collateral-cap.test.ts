import { ethers } from 'hardhat'
import { formatFixed } from '@ethersproject/bignumber'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  LiquidityController,
  USDC,
  CVIFeedOracle,
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
  initialUsdcBalanceBN,
  TestHelper,
  lpTokensWorthAtBuyTimeUsd,
  growthFactor,
  maxImpermanentLoss,
  setNextBlockTimestampAndMineWithPolicyPeriod,
  initialLiquidity,
  calcEstimatedAmountToBePaidTruncated,
  epsilon,
  buyMaximalProtections,
  ethBtcCollateralCapComponent,
} from '../../utils'
import { fromNumber, toNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-collateral-cap-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let tokenPairRepository: TokenPairRepository
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

  it('Buying protection - pair collateral should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const collateral = await protectionController.collateral()

    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(collateral, usdcDecimals)).is.equal(expectedCollateral)
  })

  it('Buying/closing protection - pair collateral should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    const { performData } = await protectionController.checkUpkeep([])
    await protectionController.performUpkeep(performData)

    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const collateral = await protectionController.collateral()

    expect(pairCollateral).is.equal(0)
    expect(collateral).is.equal(0)
  })

  it('Buying largest possible protections - pair collateral should match max cap (up to epsilon)', async () => {
    await buyMaximalProtections(TokenName.WETH, TokenName.WBTC, protectionController, protectionBuyer, policyPeriods[0])

    const pairCollateral = toNumber(
      await protectionController.pairsCollaterals(TokenName.WETH, TokenName.WBTC),
      usdcDecimals,
    )
    const liquidity = toNumber(await liquidityController.liquidity(), usdcDecimals)

    expect(ethBtcCollateralCapComponent - pairCollateral / liquidity).is.below(epsilon)
  })

  it('Buying 2 protections - closing first one - pair collateral should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[1])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    const { performData } = await protectionController.checkUpkeep([])
    await protectionController.performUpkeep(performData)

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const collateral = await protectionController.collateral()

    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(collateral).is.equal(pairCollateral)
  })

  it('Buying 2 protections - pair collateral should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd * 2,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const collateral = await protectionController.collateral()

    expect(formatFixed(pairCollateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(collateral).is.equal(pairCollateral)
  })

  it('Buying/closing 2 protections - pair collateral should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    const { performData } = await protectionController.checkUpkeep([])
    await protectionController.performUpkeep(performData)

    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const collateral = await protectionController.collateral()

    expect(pairCollateral).is.equal(0)
    expect(collateral).is.equal(0)
  })

  it('Buying protections for 2 pairs - pairs collaterals should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.LINK, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    const expectedCollateral = calcEstimatedAmountToBePaidTruncated(
      lpTokensWorthAtBuyTimeUsd,
      growthFactor,
      maxImpermanentLoss,
      usdcDecimals,
    )

    const ethUsdPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const ethLinkPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.LINK)
    const collateral = await protectionController.collateral()

    expect(formatFixed(ethUsdPairCollateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(formatFixed(ethLinkPairCollateral, usdcDecimals)).is.equal(expectedCollateral)
    expect(collateral).is.equal(ethUsdPairCollateral.add(ethLinkPairCollateral))
  })

  it('Buying/closing protections for 2 pairs - pairs collaterals should be correct', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.LINK, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    const { performData } = await protectionController.checkUpkeep([])
    await protectionController.performUpkeep(performData)

    const ethUsdPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const ethLinkPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.LINK)
    const collateral = await protectionController.collateral()

    expect(ethUsdPairCollateral).is.equal(0)
    expect(ethLinkPairCollateral).is.equal(0)
    expect(collateral).is.equal(0)
  })

  it("Can't buy protection, tokens worth larger than max - increasing collateral cap component - can buy protection", async () => {
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 5900)

    const maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(
          TokenName.WETH,
          TokenName.USDC,
          maxPossibleTokensProtected.add(1),
          '1000000000000',
          policyPeriods[0],
        ),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')

    // Increasing pair collateral component to 62%
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 6200)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(
        TokenName.WETH,
        TokenName.USDC,
        maxPossibleTokensProtected.add(1),
        '1000000000000',
        policyPeriods[0],
      )
  })

  it('Calculating max tokens to protect - lowering pair collateral component - should revert on buying previously calculated max tokens to protect', async () => {
    const maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    // Lowering pair collateral component to 59%
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 5900)

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, maxPossibleTokensProtected, '1000000000000', policyPeriods[0]),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')
  })

  it('Buying max possible protection - lowering pair collateral component below previous one - should revert on buying another protection', async () => {
    const maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, maxPossibleTokensProtected, '1000000000000', policyPeriods[0])

    // Lowering pair collateral component to 20%
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 2000)

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, 1, '1000000000000', policyPeriods[0]),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')
  })

  it('Buying max possible protection - lowering pair collateral component below previous one - buying another protection should succeed after closing previous one', async () => {
    const maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, maxPossibleTokensProtected, '1000000000000', policyPeriods[0])

    // Lowering pair collateral component to 20%
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 2000)

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, 1, '1000000000000', policyPeriods[0]),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    const { performData } = await protectionController.checkUpkeep([])
    await protectionController.performUpkeep(performData)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])
  })

  it('Buying max possible protection - lowering pair collateral component below previous one - should succeed when buying protection for different pair', async () => {
    const maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      TokenName.WETH,
      TokenName.USDC,
    )

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, maxPossibleTokensProtected, '1000000000000', policyPeriods[0])

    // Lowering pair collateral component to 20%
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 2000)

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, 1, '1000000000000', policyPeriods[0]),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.LINK, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0])
  })

  it('Setting a single pair collateral component to 100% - can buy all liquidity', async () => {
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.WBTC, 10000)

    await buyMaximalProtections(TokenName.WETH, TokenName.WBTC, protectionController, protectionBuyer, policyPeriods[0])

    const liquidity = await liquidityController.liquidity()
    const pairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.WBTC)
    const collateral = await protectionController.collateral()

    expect(toNumber(liquidity, usdcDecimals) - toNumber(pairCollateral, usdcDecimals)).is.below(epsilon)
    expect(collateral).is.equal(pairCollateral)
  })

  it('Pairs collateral component sum > 100% - buying max possible protections for both pairs - no remaining liquidity left', async () => {
    await buyMaximalProtections(TokenName.WETH, TokenName.USDC, protectionController, protectionBuyer, policyPeriods[0])
    await buyMaximalProtections(TokenName.WETH, TokenName.LINK, protectionController, protectionBuyer, policyPeriods[0])

    const liquidity = await liquidityController.liquidity()
    const ethUsdPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const ethLinkPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.LINK)
    const collateral = await protectionController.collateral()
    const remainingLiquidity = toNumber(liquidity.sub(ethUsdPairCollateral).sub(ethLinkPairCollateral), usdcDecimals)

    expect(remainingLiquidity).is.above(0)
    expect(remainingLiquidity).is.below(epsilon)
    expect(collateral).is.equal(ethUsdPairCollateral.add(ethLinkPairCollateral))
  })

  it('Pairs collateral component sum < 100% - buying max possible protections for both pairs - remaining liquidity amount is correct', async () => {
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 2500)
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.LINK, 2500)

    await buyMaximalProtections(TokenName.WETH, TokenName.USDC, protectionController, protectionBuyer, policyPeriods[0])
    await buyMaximalProtections(TokenName.WETH, TokenName.LINK, protectionController, protectionBuyer, policyPeriods[0])

    const liquidity = await liquidityController.liquidity()
    const ethUsdPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.USDC)
    const ethLinkPairCollateral = await protectionController.pairsCollaterals(TokenName.WETH, TokenName.LINK)
    const collateral = await protectionController.collateral()
    const remainingLiquidity = toNumber(liquidity.sub(ethUsdPairCollateral).sub(ethLinkPairCollateral), usdcDecimals)

    expect(remainingLiquidity).is.above(initialLiquidity / 2)
    expect(collateral).is.equal(ethUsdPairCollateral.add(ethLinkPairCollateral))
  })

  it('Setting pair collateral cap to 0 - should revert when buying protection', async () => {
    await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 0)

    await expect(
      protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '1000000000000', policyPeriods[0]),
    ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')
  })
})
