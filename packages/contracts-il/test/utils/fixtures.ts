import type { PremiumParamsStruct } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionController'
import { BigNumber } from 'ethers'
import { runFixture, TestHelper } from '.'
import { fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'
import { NUMBER_OF_SECONDS_IN_1_DAY } from '../../../lw-sdk/src/util/time'
import {
  freeOfChargeTokensWorth,
  policyPeriodParamsETHUSD,
  premiumDiscountComponent,
} from '../../../contracts-deploy/src/state/il-state'

export const premiumParamsToBN = (premiumParams: PremiumParamsStruct) => {
  return {
    A: BigNumber.from(((premiumParams.A as number) * Math.pow(10, 18)).toString()),
    X0: BigNumber.from(((premiumParams.X0 as number) * Math.pow(10, 18)).toString()),
    C: BigNumber.from(((premiumParams.C as number) * Math.pow(10, 18)).toString()),
  }
}

export const premiumParamsToNumber = (premiumParams: PremiumParamsStruct) => {
  return {
    A: toNumber(BigNumber.from(premiumParams.A), 18),
    X0: toNumber(BigNumber.from(premiumParams.X0), 18),
    C: toNumber(BigNumber.from(premiumParams.C), 18),
  }
}

//Tokens
export const usdcDecimals = 6
export const priceOracleUsdPairDecimals = 8

//Calculations constants
export const premiumParams1 = premiumParamsToNumber(policyPeriodParamsETHUSD.TWOWEEKS)
export const premiumParams2 = premiumParamsToNumber(policyPeriodParamsETHUSD.MONTH)
export const premiumParams3 = premiumParamsToNumber(policyPeriodParamsETHUSD.TWOMONTHS)

export const premiumParams1BN = policyPeriodParamsETHUSD.TWOWEEKS
export const premiumParams2BN = policyPeriodParamsETHUSD.MONTH
export const premiumParams3BN = policyPeriodParamsETHUSD.TWOMONTHS

export const maxPrecisionDecimals = 4
export const growthFactor = 1.2
export const growthFactorBN = BigNumber.from(growthFactor * Math.pow(10, maxPrecisionDecimals))
export const maxImpermanentLoss = 0.15
export const maxImpermanentLossBN = BigNumber.from(maxImpermanentLoss * Math.pow(10, maxPrecisionDecimals))
export const feeComponent = 0.0005
export const feeComponentBN = BigNumber.from(feeComponent * Math.pow(10, maxPrecisionDecimals))

export const maxPrecision = Math.pow(10, maxPrecisionDecimals)
// todo: get this from solidity
export const policyPeriods = [
  14 * NUMBER_OF_SECONDS_IN_1_DAY,
  30 * NUMBER_OF_SECONDS_IN_1_DAY,
  60 * NUMBER_OF_SECONDS_IN_1_DAY,
]
export const cvi = 100
export const cviBN = fromNumber(cvi, 18)
export const premiumGrowthStart = 8
export const premiumGrowthStartBN = fromNumber(premiumGrowthStart, 18)
export const premiumSlope = 2
export const premiumSlopeBN = fromNumber(premiumSlope, 18)

export const ethUsdcCollateralCapComponent = 1
export const ethUsdcCollateralCapComponentBN = BigNumber.from(
  ethUsdcCollateralCapComponent * Math.pow(10, maxPrecisionDecimals),
)
export const linkEthCollateralCapComponent = 0.06
export const linkUsdCollateralCapComponentBN = BigNumber.from(
  linkEthCollateralCapComponent * Math.pow(10, maxPrecisionDecimals),
)

export const ethBtcCollateralCapComponent = 0.1
export const ethBtcCollateralCapComponentBN = BigNumber.from(
  linkEthCollateralCapComponent * Math.pow(10, maxPrecisionDecimals),
)

export const epsilon = 0.0002

//Financial
export const ethInitialPrice = 2750
export const linkInitialPrice = 10
export const usdInitialPrice = 1
export const ethInitialPriceBN = fromNumber(ethInitialPrice, priceOracleUsdPairDecimals)
export const linkInitialPriceBN = fromNumber(linkInitialPrice, priceOracleUsdPairDecimals)
export const usdInitialPriceBN = fromNumber(usdInitialPrice, priceOracleUsdPairDecimals)

export const lpTokensWorthAtBuyTimeUsd = 5000
export const lpTokensWorthAtBuyTimeUsdBN = fromNumber(lpTokensWorthAtBuyTimeUsd, 6)
export const initialLiquidity = 100000
export const initialLiquidityBN = fromNumber(initialLiquidity, usdcDecimals)
export const initialUsdcBalanceBN = fromNumber(100000, usdcDecimals)

//Addresses
export const address1 = '0xAC0E843Dc73912231a78943Cd146c8E0B4a480fF'
export const address2 = '0xC62d96C555FDcCfed9021D289C60F1aa0218F126'

//NFT
export const protectionMetadataCID = 'QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb'
export const freeOfChargeTokens = toNumber(freeOfChargeTokensWorth, usdcDecimals)
export const freeOfChargeTokensBN = freeOfChargeTokensWorth
export const premiumDiscountComp = premiumDiscountComponent / maxPrecision
export const premiumDiscountCompBN = premiumDiscountComponent

export async function runContractsFixtures() {
  await runFixture(['il-contracts', 'il-contracts-initial-permissions', 'il-contracts-set-state'])

  const helper = TestHelper.get()
  return {
    ethUsdPriceOracle: await helper.connect('ETHUSDOracle'),
    usdUsdPriceOracle: await helper.connect('USDUSDOracle'),
    linkUsdPriceOracle: await helper.connect('LINKUSDOracle'),
    usdcToken: await helper.connect('USDC'),
    cviFeedOracle: await helper.connect('CVIFeedOracle'),
    ilProtectionController: await helper.connect('ILProtectionController'),
    liquidityController: await helper.connect('LiquidityController'),
    treasuryController: await helper.connect('TreasuryController'),
    tokenPairRepository: await helper.connect('TokenPairRepository'),
    protectionNFT: await helper.connect('ILProtectionNFT'),
    protectionDiscountNFT: await helper.connect('ILProtectionDiscountNFT'),
    protectionDiscountNFTController: await helper.connect('ILProtectionDiscountNFTController'),
    protectionConfig: await helper.connect('ILProtectionConfig'),
  }
}
