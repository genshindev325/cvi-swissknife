import type { BigNumber } from 'ethers'
import type { IlSupportedChainIds, Point } from '@coti-cvi/lw-sdk'

export type ChartName = 'lpTokensWorthAtBuyTimeUSD' | 'token0EndPriceUSD' | 'token1EndPriceUSD'

export type PayoutParams<T extends number | string | BigNumber> = {
  lpTokensWorthAtBuyTimeUSD: T
  token0EntryPriceUSD: T
  token0EndPriceUSD: T
  token1EntryPriceUSD: T
  token1EndPriceUSD: T
}

export type SerieId = string

export type PayoutSerieInfo = {
  id: SerieId
  name: string
  chartName: ChartName
  creationDateUtc: string
  payoutValues: PayoutParams<number>
  chainId: IlSupportedChainIds
  rangeInfo: {
    min: number
    max: number
    interval: number
  }
  borderPoint?: Point
}

export type PayoutChartSeries = {
  chartName: ChartName
  currentRangeInfo: {
    min: number
    max: number
    interval: number
  }
  seriesSortedByCreationDateAsc: PayoutSerieInfo[]
}

export type ErrorObject = {
  props: {
    chartName: ChartName
    propertyValue: number
    rawParams: PayoutParams<BigNumber>
    rawParamsToString: PayoutParams<string>
    readableParams: PayoutParams<number>
    ilRatioToContract?: {
      asNumber: number
      asBigNumber: string
    }
  }
  cause: unknown
}
