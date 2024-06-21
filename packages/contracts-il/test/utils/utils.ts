import type { BigNumber } from 'ethers'
import type { PremiumParamsStruct } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/TokenPairRepository'
import { fromNumber, roundCryptoValueString } from '../../../lw-sdk/src/util/big-number'
import type { ILProtectionController } from '@coti-cvi/auto-generated-code/contracts'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { epsilon, usdcDecimals } from './fixtures'
import { calcEstimatedAmountToBePaid, calculateIL } from '../../../lw-sdk/src'
import { setNextBlockTimestampAndMine, getLatestBlockTimestamp } from '.'

export function truncateByDecimalPlace(value: number, decimalPlaces: number) {
  return Math.trunc(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
}

export function calculateFee(lpTokensWorthAtBuyTimeUSD: number, feeComponent: number) {
  return lpTokensWorthAtBuyTimeUSD * feeComponent
}

export function calculateFeeTruncated(
  lpTokensWorthAtBuyTimeUSD: number,
  feeComponent: number,
  premiumDiscountComponent: number,
  decimalPlaces: number,
) {
  let fee = calculateFee(lpTokensWorthAtBuyTimeUSD, feeComponent)

  fee *= 1 - premiumDiscountComponent

  return roundCryptoValueString(fee.toString(), decimalPlaces)
}

export function calculatePremium(
  lpTokensWorthAtBuyTimeUSD: number,
  collateral: number,
  liquidity: number,
  A: number,
  X0: number,
  C: number,
  cvi: number,
  premiumGrowthStart: number,
  premiumSlope: number,
) {
  const p = Math.exp(Math.pow(collateral / liquidity, premiumGrowthStart) / premiumSlope)

  return lpTokensWorthAtBuyTimeUSD * ((A * Math.pow(cvi - X0, 2) + C) * p)
}

export function calculatePremiumWithFeesAndDiscount(
  lpTokensWorthAtBuyTimeUSD: number,
  collateral: number,
  liquidity: number,
  A: number,
  X0: number,
  C: number,
  cvi: number,
  premiumGrowthStart: number,
  premiumSlope: number,
  feeComponent: number,
  premiumDiscountComponent: number,
) {
  let premium = calculatePremium(
    lpTokensWorthAtBuyTimeUSD,
    collateral,
    liquidity,
    A,
    X0,
    C,
    cvi,
    premiumGrowthStart,
    premiumSlope,
  )

  if (feeComponent > 0) {
    const fee = calculateFee(lpTokensWorthAtBuyTimeUSD, feeComponent)

    premium += fee
  }

  premium *= 1 - premiumDiscountComponent

  return premium
}

export function calculatePremiumTruncated(
  lpTokensWorthAtBuyTimeUSD: number,
  collateral: number,
  liquidity: number,
  A: number,
  X0: number,
  C: number,
  cvi: number,
  premiumGrowthStart: number,
  premiumSlope: number,
  feeComponent: number,
  premiumDiscountComponent: number,
  decimalPlaces: number,
) {
  const premium = calculatePremiumWithFeesAndDiscount(
    lpTokensWorthAtBuyTimeUSD,
    collateral,
    liquidity,
    A,
    X0,
    C,
    cvi,
    premiumGrowthStart,
    premiumSlope,
    feeComponent,
    premiumDiscountComponent,
  )

  return roundCryptoValueString(premium.toString(), decimalPlaces)
}

export function calcEstimatedAmountToBePaidTruncated(
  lpTokensWorthAtBuyTimeUSD: number,
  expectedLPTokensValueGrowth: number,
  impermanentLoss: number,
  decimalPlaces: number,
) {
  const estimatedAmountToBePaid = calcEstimatedAmountToBePaid(
    lpTokensWorthAtBuyTimeUSD,
    expectedLPTokensValueGrowth,
    impermanentLoss,
  )

  return roundCryptoValueString(estimatedAmountToBePaid.toString(), decimalPlaces)
}

export function calcPolicyPeriodEnd(protectionStartTimestamp: number, policyPeriod: number) {
  return protectionStartTimestamp + policyPeriod
}

export function calcAmountToBePaid(
  lpTokensWorthAtBuyTimeUSD: number,
  token1EntryPrice: number,
  token2EntryPrice: number,
  token1EndPrice: number,
  token2EndPrice: number,
) {
  const pricesRatio = (token1EndPrice / token1EntryPrice + token2EndPrice / token2EntryPrice) / 2

  const lpTokensWorthIfHeld = lpTokensWorthAtBuyTimeUSD * pricesRatio

  return lpTokensWorthIfHeld * calculateIL(token1EntryPrice, token2EntryPrice, token1EndPrice, token2EndPrice)
}

export function calcCollateralCap(liquidity: number, collateralCapComponent: number) {
  return liquidity * collateralCapComponent
}

export function calcMaxValueOfTokensWorthToProtect(
  liquidity: number,
  pairCollateral: number,
  tokensValueGrowth: number,
  maxIL: number,
  collateralCapComponent: number,
) {
  const denominator = truncateByDecimalPlace(tokensValueGrowth / (1 - maxIL) - tokensValueGrowth, 4)

  const collateralCap = calcCollateralCap(liquidity, collateralCapComponent)

  return (collateralCap - pairCollateral) / denominator
}

export function calcMaxValueOfTokensWorthToProtectTruncated(
  liquidity: number,
  collateral: number,
  tokensValueGrowth: number,
  maxIL: number,
  collateralCapComponent: number,
  decimalPlaces: number,
) {
  const maxValueOfTokensWorthToProtect = calcMaxValueOfTokensWorthToProtect(
    liquidity,
    collateral,
    tokensValueGrowth,
    maxIL,
    collateralCapComponent,
  )

  return roundCryptoValueString(maxValueOfTokensWorthToProtect.toString(), decimalPlaces)
}

export function calculateLinearlyIncreasingPremiums(
  lpTokensWorthAtBuyTimeUSD: number,
  expectedGrowthFactor: number,
  maxImpermanentLoss: number,
  initialLiquidity: number,
  premiumsParams: PremiumParamsStruct[],
  cvi: number,
  premiumGrowthStart: number,
  premiumSlope: number,
  feeComponent: number | number[],
  premiumDiscountComponent: number,
  premiumDecimalPlaces: number,
) {
  const baseCollateral = calcEstimatedAmountToBePaid(
    lpTokensWorthAtBuyTimeUSD,
    expectedGrowthFactor,
    maxImpermanentLoss,
  )

  let currLiquidity = initialLiquidity
  let chosenFeeComponent: number

  return premiumsParams.map((premiumParams, index) => {
    if (typeof feeComponent == 'number') {
      chosenFeeComponent = feeComponent
    } else {
      chosenFeeComponent = feeComponent[index]
    }

    const premium = calculatePremiumTruncated(
      lpTokensWorthAtBuyTimeUSD,
      baseCollateral * (index + 1),
      currLiquidity,
      premiumParams.A as number,
      premiumParams.X0 as number,
      premiumParams.C as number,
      cvi,
      premiumGrowthStart,
      premiumSlope,
      chosenFeeComponent,
      premiumDiscountComponent,
      premiumDecimalPlaces,
    )

    currLiquidity += +premium - calculateFee(lpTokensWorthAtBuyTimeUSD, chosenFeeComponent)

    return premium
  })
}

export async function setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriod: number) {
  const expectedProtectionStartTimestamp = await getLatestBlockTimestamp()
  const expectedProtectionEndTimestamp = calcPolicyPeriodEnd(expectedProtectionStartTimestamp, policyPeriod)

  await setNextBlockTimestampAndMine(expectedProtectionEndTimestamp)
}

export async function buyMaximalProtections(
  token1Symbol: string,
  token2Symbol: string,
  protectionController: ILProtectionController,
  signer: SignerWithAddress,
  policyPeriod: number,
) {
  let maxPossibleTokensProtected: BigNumber

  while (
    !(maxPossibleTokensProtected = await protectionController.calcMaxValueOfTokensWorthToProtect(
      token1Symbol,
      token2Symbol,
    )).lte(fromNumber(epsilon, usdcDecimals))
  ) {
    try {
      await protectionController
        .connect(signer)
        .buyProtection(token1Symbol, token2Symbol, maxPossibleTokensProtected, '1000000000000', policyPeriod)
    } catch (e) {
      if (e.message.includes('Premium cost is too low')) {
        break
      } else {
        throw e
      }
    }
  }
}
