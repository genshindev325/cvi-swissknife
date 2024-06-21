import type { FC } from 'react'
import type { CalculateCustomPremiumValues } from '@coti-cvi/lw-sdk'
import { Equation, defaultErrorHandler } from 'react-equation'
import { useAppSelector } from '../redux'
import type { ChartNames } from '../types'

type Props = {}

const propertiesShortName: Record<ChartNames | keyof CalculateCustomPremiumValues['premiumParams'], string> = {
  totalLPTokensWorthAtBuyTimeUsdc: 'totalLpTokens_usd',
  lpTokensWorthAtBuyTimeUsdc: 'lpTokens_usd',
  expectedLPTokensValueGrowth: 'growth',
  liquidityUsdc: 'liquidity_usd',
  maxILProtectedPercentage: 'maxIL',
  premiumGrowthStart: 'growthStart',
  premiumSlope: 'slope',
  A: 'A',
  X0: 'X0',
  C: 'C',
  cvi: 'cvi',
}

function buildFormula({
  totalLPTokensWorthAtBuyTimeUsdc = propertiesShortName.totalLPTokensWorthAtBuyTimeUsdc,
  lpTokensWorthAtBuyTimeUsdc = propertiesShortName.lpTokensWorthAtBuyTimeUsdc,
  expectedLPTokensValueGrowth = propertiesShortName.expectedLPTokensValueGrowth,
  liquidityUsdc = propertiesShortName.liquidityUsdc,
  maxILProtectedPercentage = propertiesShortName.maxILProtectedPercentage,
  premiumParams: { A = propertiesShortName.A, X0 = propertiesShortName.X0, C = propertiesShortName.C },
  cvi = propertiesShortName.cvi,
}: {
  totalLPTokensWorthAtBuyTimeUsdc?: number | string
  lpTokensWorthAtBuyTimeUsdc?: number | string
  expectedLPTokensValueGrowth?: number | string
  liquidityUsdc?: number | string
  maxILProtectedPercentage?: number | string
  cvi?: number | string
  premiumParams: {
    A?: number | string
    X0?: number | string
    C?: number | string
  }
}) {
  A = isNaN(Number(A)) ? A : Number(A).toFixed(10)
  C = isNaN(Number(C)) ? C : Number(C).toFixed(10)
  return `${lpTokensWorthAtBuyTimeUsdc}*(${A} * (${cvi} - (${X0}))^2 + (${C}))* e^(((${lpTokensWorthAtBuyTimeUsdc}+${totalLPTokensWorthAtBuyTimeUsdc})/(${liquidityUsdc}*(1/((${maxILProtectedPercentage}/100)*${expectedLPTokensValueGrowth})))))`
}

export const PremiumFormula: FC<Props> = () => {
  const overridenValues = useAppSelector(state => state.state.overridenValues)
  const premiumPriceUsdcFromOverridenValues = useAppSelector(state => state.state.premiumPriceUsdcFromOverridenValues)

  const formula = buildFormula({ premiumParams: {} })

  if (!overridenValues || premiumPriceUsdcFromOverridenValues === undefined) {
    return <Equation value={`PremiumPrice_usd = (Calculating)`} errorHandler={defaultErrorHandler} />
  }

  const percentage = (premiumPriceUsdcFromOverridenValues * 100) / overridenValues.lpTokensWorthAtBuyTimeUsdc

  return (
    <Equation
      value={`PremiumPrice_usd = ${premiumPriceUsdcFromOverridenValues.toFixed(2)}_usdc = ${percentage.toFixed(2)}%`}
      errorHandler={defaultErrorHandler}
    />
  )
}
