import type { PremiumValues, CalculateCustomPremiumValues, IERC20, Token, TokenName } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'
import millify from 'millify'
import { convertPremiumValues } from './convert-premium-values'
import type { RootState } from './redux'
import type { ChartNames, PremiumPriceSerieInfo } from './types'

export const CHART_NAMES = [
  'lpTokensWorthAtBuyTimeUsdc',
  'totalLPTokensWorthAtBuyTimeUsdc',
  'expectedLPTokensValueGrowth',
  'liquidityUsdc',
  'maxILProtectedPercentage',
  'cvi',
  'premiumGrowthStart',
  'premiumSlope',
] as const

export function getPremiumChartSerieId(
  newChartSerieWithoutId: Pick<
    PremiumPriceSerieInfo,
    'chainId' | 'chartName' | 'premiumValues' | 'rangeInfo' | 'selectedPairAndPeriod'
  >,
): string {
  return JSON.stringify({
    ...newChartSerieWithoutId,
    premiumValues: {
      ...newChartSerieWithoutId.premiumValues,
      [newChartSerieWithoutId.chartName]: undefined,
    },
  })
}

export type ErrorObject = {
  props: {
    propertyName?: ChartNames
    propertyValue?: number
    rawParams: CalculateCustomPremiumValues
    rawParamsToString: unknown
    readableParams: PremiumValues<string>
  }
  cause: unknown
}

export function toErrorObject({
  error,
  propertyName,
  propertyValue,
  request,
  tokenUSDC,
}: {
  propertyName?: ChartNames
  propertyValue?: number
  error: unknown
  request: PremiumValues<BigNumber>
  tokenUSDC: Token<IERC20, TokenName.USDC>
}): ErrorObject {
  return {
    props: {
      propertyName,
      propertyValue,
      rawParams: request,
      rawParamsToString: {
        ...Object.fromEntries(
          Object.entries(request)
            .filter(([key]) => key !== 'premiumParams')
            .map(([key, value]) => [key, value.toString()]),
        ),
        premiumParams: Object.fromEntries(
          Object.entries(request.premiumParams).map(([key, value]) => [key, value.toString()]),
        ),
      },
      readableParams: convertPremiumValues({
        from: 'BigNumber',
        to: 'string',
        tokenUSDC,
        values: request,
      }),
    },
    cause: error,
  }
}

export const getChartDisplayName = <ChartName extends ChartNames>(
  chartName: ChartName,
  val?: PremiumValues<number>[ChartName],
) => {
  switch (chartName) {
    case 'premiumGrowthStart':
      return `Premium Growth Start: ${val ? parseFloat(val.toString()).toFixed(0) : 'loading...'}`
    case 'premiumSlope':
      return `Premkum Slope: ${val ? parseFloat(val.toString()).toFixed(0) : 'loading...'}`
    case 'cvi':
      return `CVI: ${val ? parseFloat(val.toString()).toFixed(0) : 'loading...'}`
    case 'expectedLPTokensValueGrowth':
      return `Growth: ${val ? val.toFixed(val >= 10 ? 0 : 2) : 'loading...'}`
    case 'maxILProtectedPercentage':
      return `Max. IL protection: ${val ? `${parseFloat(val.toString()).toFixed(0)}%` : 'loading...'}`
    case 'liquidityUsdc':
      return `Liquidity: ${
        val
          ? `$${millify(val, {
              precision: 2,
              lowercase: true,
            })}`
          : 'loading...'
      }`
    case 'lpTokensWorthAtBuyTimeUsdc':
      return `Amount to Protect: ${
        val
          ? `$${millify(val, {
              precision: 2,
              lowercase: true,
            })}`
          : 'loading...'
      }`
    case 'totalLPTokensWorthAtBuyTimeUsdc':
      return `AMM Total Amount Protected: ${
        val
          ? `$${millify(val, {
              precision: 2,
              lowercase: true,
            })}`
          : 'loading...'
      }`
  }
}

export const getPRemiumFormulaPropertyDisplayName = (chartName: ChartNames) => {
  switch (chartName) {
    case 'cvi':
      return `CVI`
    case 'expectedLPTokensValueGrowth':
      return `Growth`
    case 'maxILProtectedPercentage':
      return `Max. IL protection %`
    case 'liquidityUsdc':
      return `Liquidity`
    case 'lpTokensWorthAtBuyTimeUsdc':
      return `Amount to Protect`
    case 'totalLPTokensWorthAtBuyTimeUsdc':
      return `AMM Total Amount Protected`
    case 'premiumGrowthStart':
      return `Growth Start`
    case 'premiumSlope':
      return `Growth Slope`
  }
}

export const getFormattedValueAndUnitsForChartName = (chartName: ChartNames, value: number): string => {
  switch (chartName) {
    case 'cvi':
    case 'premiumGrowthStart':
    case 'premiumSlope':
      return `${value}`
    case 'maxILProtectedPercentage':
      return `${value}%`
    case 'liquidityUsdc':
    case 'lpTokensWorthAtBuyTimeUsdc':
    case 'totalLPTokensWorthAtBuyTimeUsdc':
      return `$${millify(value, {
        precision: 2,
        lowercase: true,
      })}`

    default:
      return `${value} n/a`
  }
}

export function createNewChartSerie(
  chainId: RootState['state']['chainId'],
  serieInfo: Omit<PremiumPriceSerieInfo, 'id' | 'name' | 'chainId'>,
): PremiumPriceSerieInfo {
  const name = `(${CHAIN_IDS_INFO[chainId].blockchainName}-${CHAIN_IDS_INFO[chainId].networkName}) <b>${
    serieInfo.selectedPairAndPeriod.pair.tokenName1
  }-${serieInfo.selectedPairAndPeriod.pair.tokenName2} (${
    serieInfo.selectedPairAndPeriod.period.periodSecondsFormat
  })</b>
${
  serieInfo.chartName !== 'lpTokensWorthAtBuyTimeUsdc'
    ? `Protecting: ${getFormattedValueAndUnitsForChartName(
        serieInfo.chartName,
        serieInfo.premiumValues.lpTokensWorthAtBuyTimeUsdc,
      )}`
    : ``
} 
${
  serieInfo.chartName !== 'totalLPTokensWorthAtBuyTimeUsdc'
    ? `TVP: ${getFormattedValueAndUnitsForChartName(
        serieInfo.chartName,
        serieInfo.premiumValues.totalLPTokensWorthAtBuyTimeUsdc,
      )}`
    : ``
}
${
  serieInfo.chartName !== 'cvi'
    ? `CVI: ${getFormattedValueAndUnitsForChartName(serieInfo.chartName, serieInfo.premiumValues.cvi)},`
    : ``
}
${
  serieInfo.chartName !== 'maxILProtectedPercentage'
    ? `max. cover IL: ${getFormattedValueAndUnitsForChartName(
        serieInfo.chartName,
        serieInfo.premiumValues.maxILProtectedPercentage,
      )},`
    : ``
}
${
  serieInfo.chartName !== 'liquidityUsdc'
    ? `Liq.: ${getFormattedValueAndUnitsForChartName(serieInfo.chartName, serieInfo.premiumValues.liquidityUsdc)}`
    : ``
}
(From ${serieInfo.selectedPairAndPeriod.source} - a: ${serieInfo.premiumValues.premiumParams.A.toFixed(10)};
x0: ${serieInfo.premiumValues.premiumParams.X0.toFixed(4)};
c: ${serieInfo.premiumValues.premiumParams.C.toFixed(10)})
`

  const newChartSerieWithoutId: Omit<PremiumPriceSerieInfo, 'id'> = {
    name,
    chartName: serieInfo.chartName,
    premiumValues: serieInfo.premiumValues,
    rangeInfo: serieInfo.rangeInfo,
    chainId,
    selectedPairAndPeriod: serieInfo.selectedPairAndPeriod,
    borderPoint: serieInfo.borderPoint,
  }

  return {
    ...newChartSerieWithoutId,
    id: getPremiumChartSerieId({
      chainId: newChartSerieWithoutId.chainId,
      chartName: newChartSerieWithoutId.chartName,
      premiumValues: newChartSerieWithoutId.premiumValues,
      rangeInfo: newChartSerieWithoutId.rangeInfo,
      selectedPairAndPeriod: newChartSerieWithoutId.selectedPairAndPeriod,
    }),
  }
}
