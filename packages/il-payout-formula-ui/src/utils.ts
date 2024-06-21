import type { BigNumber } from 'ethers'
import { convertPayoutParams } from './convert-payout-params'
import type { ChartName, ErrorObject, PayoutParams, PayoutSerieInfo } from './types'

export const getSerieId = (payoutSerieInfo: Omit<PayoutSerieInfo, 'id'>) =>
  JSON.stringify([
    payoutSerieInfo.chainId,
    payoutSerieInfo.chartName,
    payoutSerieInfo.payoutValues,
    payoutSerieInfo.rangeInfo,
  ])

export function toErrorObject({
  error,
  chartName,
  propertyValue,
  request,
  ilRatioToContract,
}: {
  chartName: ChartName
  propertyValue: number
  error: unknown
  request: PayoutParams<BigNumber>
  ilRatioToContract?: {
    asNumber: number
    asBigNumber: string
  }
}): ErrorObject {
  return {
    props: {
      chartName,
      propertyValue,
      rawParams: request,
      rawParamsToString: convertPayoutParams({
        from: 'BigNumber',
        to: 'string',
        values: request,
      }),
      readableParams: convertPayoutParams({
        from: 'BigNumber',
        to: 'number',
        values: request,
      }),
      ilRatioToContract,
    },
    cause: error,
  }
}

export function getChartDisplayName({ chartName }: { chartName: ChartName }) {
  switch (chartName) {
    case 'lpTokensWorthAtBuyTimeUSD':
      return 'LP Tokens At Buy Time $'
    case 'token0EndPriceUSD':
      return `Token0 End Price $`
    case 'token1EndPriceUSD':
      return `Token1 End Price $`
  }
}
