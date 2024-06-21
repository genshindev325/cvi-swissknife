import { ethers } from 'hardhat'
import { premiumParamsFeed } from './premium-params-feed'
import { AddressZero } from '@ethersproject/constants'
import type { ILProtectionController } from '@coti-cvi/auto-generated-code/contracts'
import { maxPrecision, TestHelper, usdcDecimals, expect, calculatePremiumTruncated } from '../../utils'
import { formatFixedAndRoundValue, fromNumber, roundCryptoValueString } from '../../../../lw-sdk/src/util/big-number'
import { calcEstimatedAmountToBePaid } from '../../../../lw-sdk/src'

describe('Parameterized premium calculations', () => {
  let protectionController: ILProtectionController

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)
    const owner = await helper.getNamedSigner('owner')

    const mathUtils = await helper.deploy('MathUtils')
    const ilUtils = await helper.deploy('ILUtils')
    const premiumCalculator = await helper.deploy('PremiumCalculator')

    protectionController = await helper.deployProxy(
      'ILProtectionController',
      {
        ILUtils: ilUtils.address,
        MathUtils: mathUtils.address,
        PremiumCalculator: premiumCalculator.address,
      },
      owner.address,
      AddressZero,
      AddressZero,
      AddressZero,
      AddressZero,
      AddressZero,
      AddressZero,
      10,
    )
  })

  it('calculateParameterizedPremium - iterate input parameters array - all expected premiums should be correct', async () => {
    for (const feed of premiumParamsFeed) {
      const lpTokensWorthAtBuyTimeUSD = fromNumber(feed.input.lpTokensWorthAtBuyTimeUSD, usdcDecimals)
      const totalLPTokensWorthAtBuyTimeUSD = fromNumber(feed.input.totalLPTokensWorthAtBuyTimeUSD, usdcDecimals)
      const expectedLPTokensValueGrowth = Math.trunc(feed.input.expectedLPTokensValueGrowth * maxPrecision)
      const liquidity = fromNumber(feed.input.liquidity, usdcDecimals)
      const impermanentLoss = Math.trunc(feed.input.impermanentLoss * maxPrecision)
      const premiumParamsBN = {
        A: fromNumber(feed.input.A, 18),
        X0: fromNumber(feed.input.X0, 18),
        C: fromNumber(feed.input.C, 18),
      }
      const cvi = fromNumber(feed.input.cvi, 18)
      const premiumGrowthStart = fromNumber(feed.input.premiumGrowthStart, 18)
      const premiumSlope = fromNumber(feed.input.premiumSlope, 18)

      const premium = await protectionController.calculateParameterizedPremium(
        lpTokensWorthAtBuyTimeUSD,
        totalLPTokensWorthAtBuyTimeUSD,
        expectedLPTokensValueGrowth,
        liquidity,
        impermanentLoss,
        premiumParamsBN,
        cvi,
        premiumGrowthStart,
        premiumSlope,
      )

      const formattedPremiumCost = formatFixedAndRoundValue(premium, usdcDecimals, 5)
      const expectedPremium = roundCryptoValueString(feed.expectedPremium.toString(), 5)

      expect(formattedPremiumCost).is.equal(expectedPremium)

      const expectedCollateral = calcEstimatedAmountToBePaid(
        feed.input.totalLPTokensWorthAtBuyTimeUSD + feed.input.lpTokensWorthAtBuyTimeUSD,
        feed.input.expectedLPTokensValueGrowth,
        feed.input.impermanentLoss,
      )

      const localyCalculatedPremium = calculatePremiumTruncated(
        feed.input.lpTokensWorthAtBuyTimeUSD,
        expectedCollateral,
        feed.input.liquidity,
        feed.input.A,
        feed.input.X0,
        feed.input.C,
        feed.input.cvi,
        feed.input.premiumGrowthStart,
        feed.input.premiumSlope,
        0,
        0,
        5,
      )

      expect(formattedPremiumCost, 'localy calculated premium').is.equal(localyCalculatedPremium)
    }
  })
})
