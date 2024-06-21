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
  ethInitialPrice,
  usdInitialPrice,
  calcAmountToBePaid,
  maxPrecisionDecimals,
  initialLiquidity,
  premiumParams1,
  calculatePremiumTruncated,
  calcEstimatedAmountToBePaidTruncated,
  calcMaxValueOfTokensWorthToProtectTruncated,
  feeComponent,
  calculateFeeTruncated,
  feeComponentBN,
  premiumGrowthStart,
  premiumSlope,
  ethUsdcCollateralCapComponent,
} from '../../utils'
import { formatFixedAndRoundValue, fromNumber, roundCryptoValueString } from '../../../../lw-sdk/src/util/big-number'
import { calculateIL, TokenName } from '@coti-cvi/lw-sdk'
import { DiscountNFTType } from '../../utils/types'

describe('ILProtectionController-calculations-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
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

  describe('calcAmountToBePaidWithProtectionId', () => {
    it('Should calculate amount to be paid for open protection', async () => {
      const ethEndPrice = 5000

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await ethUsdPriceOracle.setPrice(fromNumber(ethEndPrice, priceOracleUsdPairDecimals))

      const expectedAmountToBePaid = calcAmountToBePaid(
        lpTokensWorthAtBuyTimeUsd,
        ethInitialPrice,
        usdInitialPrice,
        ethEndPrice,
        usdInitialPrice,
      )

      const amountToBePaid = await protectionController.calcAmountToBePaidWithProtectionId(0)

      expect(formatFixed(amountToBePaid, usdcDecimals)).is.equal(
        roundCryptoValueString(expectedAmountToBePaid.toString(), usdcDecimals),
      )
    })
  })

  describe('calculateOpenProtectionIL', () => {
    it('Should return IL for open protection', async () => {
      const ethEndPrice = 5000

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await ethUsdPriceOracle.setPrice(fromNumber(ethEndPrice, priceOracleUsdPairDecimals))

      const impermanentLoss = await protectionController.calculateOpenProtectionIL(0)

      const expectedIL = calculateIL(ethInitialPrice, usdInitialPrice, ethEndPrice, usdInitialPrice)

      expect(formatFixed(impermanentLoss, maxPrecisionDecimals)).is.equal(expectedIL.toString())
    })
  })

  describe('calculateFee', () => {
    it('Should calculate correct fee', async () => {
      const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, usdcDecimals)

      const fee = await protectionController.calculateFee(lpTokensWorthAtBuyTimeUsdBN, feeComponentBN)

      expect(formatFixed(fee, usdcDecimals)).is.equal(expectedFee)
    })
  })

  describe('calculatePremiumDetailsAndMaxAmountToBePaid', () => {
    it('Should calculate premium details and max amount to be paid', async () => {
      const [premium, premiumCostDiscount, fee, feeDiscount, maxAmountToBePaid, discountNFTType] =
        await protectionController.calculatePremiumDetailsAndMaxAmountToBePaid(
          owner.address,
          TokenName.WETH,
          TokenName.USDC,
          lpTokensWorthAtBuyTimeUsdBN,
          policyPeriods[0],
        )

      const expectedMaxAmountToBePaid = calcEstimatedAmountToBePaidTruncated(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
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

      const expectedFee = calculateFeeTruncated(lpTokensWorthAtBuyTimeUsd, feeComponent, 0, usdcDecimals)

      expect(formatFixedAndRoundValue(premium.add(fee), usdcDecimals, 5)).is.equal(
        roundCryptoValueString(expectedPremium, 5),
      )
      expect(formatFixed(maxAmountToBePaid, usdcDecimals)).is.equal(expectedMaxAmountToBePaid)
      expect(formatFixed(fee, usdcDecimals)).is.equal(expectedFee)
      expect(premiumCostDiscount).is.equal(0)
      expect(feeDiscount).is.equal(0)
      expect(discountNFTType).is.equal(DiscountNFTType.NONE)
    })

    it('Should revert of passed tokens worth is larger than max worth protect', async () => {
      const maxAmountOfTokensWorth = await protectionController.calcMaxValueOfTokensWorthToProtect(
        TokenName.WETH,
        TokenName.USDC,
      )

      await expect(
        protectionController.calculatePremiumDetailsAndMaxAmountToBePaid(
          owner.address,
          TokenName.WETH,
          TokenName.USDC,
          maxAmountOfTokensWorth.add(1),
          policyPeriods[0],
        ),
      ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD > maxValueOfTokensWorthToProtect')
    })
  })

  describe('calcMaxValueOfTokensWorthToProtect', () => {
    it('Should calculate max value of tokens to protect', async () => {
      const maxValue = await protectionController.calcMaxValueOfTokensWorthToProtect(TokenName.WETH, TokenName.USDC)
      const expectedMaxValue = calcMaxValueOfTokensWorthToProtectTruncated(
        initialLiquidity,
        0,
        growthFactor,
        maxImpermanentLoss,
        ethUsdcCollateralCapComponent,
        usdcDecimals,
      )

      expect(formatFixed(maxValue, usdcDecimals)).is.equal(expectedMaxValue)
    })
  })

  describe('calculateIL', () => {
    type PricesTuple = [t1Entry: number, t1Exit: number, t2Entry: number, t2Exit: number]
    const testPrices: PricesTuple[] = [
      [5000, 6000, 1, 1],
      [5000, 5001, 1, 1],
      [5000, 6000, 1, 1.01],
      [1000, 1000, 1, 1.01],
      [1000, 1012, 1, 1.01],
      [1000, 2000, 1, 0.13],
    ]

    const priceOracleDecimals = 8
    const toBigNumber = (value: number) => fromNumber(value, priceOracleDecimals)

    testPrices.forEach(([t1Entry, t1Exit, t2Entry, t2Exit]) => {
      const pricesStr = `Token1: ${t1Entry} => ${t1Exit}, Token2: ${t2Entry} => ${t2Exit}`
      it(`Contract calculated IL should match localy calculated IL - [${pricesStr}]`, async () => {
        const contractIl = await protectionController.calculateIL(
          toBigNumber(t1Entry),
          toBigNumber(t1Exit),
          toBigNumber(t2Entry),
          toBigNumber(t2Exit),
        )

        const expectedIL = calculateIL(t1Entry, t1Exit, t2Entry, t2Exit)
        expect(contractIl / 10000).is.equal(expectedIL)
      })
    })
  })
})
