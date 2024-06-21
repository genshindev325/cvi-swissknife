import type { UpdateGeneralInfoOfEventAndAddressesDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { BackendEnvironment, TvSupportedChainIds, State, Block, TokenName, AddressGroup } from '@coti-cvi/lw-sdk'
import type { BuildCommonCharts } from '../components/build-common-charts'
import type { BuildTvCharts } from '../components/tv/charts/tv-build-charts'
import type { BuildChartFn } from '../components/vt/charts/lt-chart'
import type { BuildVtCharts } from '../components/vt/charts/vt-build-charts'
import type { Flatten, UI } from '../types'
import type { AllEvents, TablesColumnObject } from './selected-columns-in-tables'

export type Point = {
  x: number
  y: number
}

export type ColumnInfo = { visible: boolean; columnIndex: number }

export type selectedColumnsInTablesVt = {
  VtUniswapSwapEvent: Record<keyof Flatten<TablesColumnObject['VtUniswapSwapEvent']>, ColumnInfo>
  VtCviTransferEvent: Record<keyof Flatten<TablesColumnObject['VtCviTransferEvent']>, ColumnInfo>
  VtSubmitEvent: Record<keyof Flatten<TablesColumnObject['VtSubmitEvent']>, ColumnInfo>
  VtMintEvent: Record<keyof Flatten<TablesColumnObject['VtMintEvent']>, ColumnInfo>
  VtLiquidateEvent: Record<keyof Flatten<TablesColumnObject['VtLiquidateEvent']>, ColumnInfo>
  VtFulfillEvent: Record<keyof Flatten<TablesColumnObject['VtFulfillEvent']>, ColumnInfo>
  VtBurnEvent: Record<keyof Flatten<TablesColumnObject['VtBurnEvent']>, ColumnInfo>
}

export type selectedColumnsInTablesTv = {
  TvSubmitEvent: Record<keyof Flatten<TablesColumnObject['TvSubmitEvent']>, ColumnInfo>
  TvFulfillDepositEvent: Record<keyof Flatten<TablesColumnObject['TvFulfillDepositEvent']>, ColumnInfo>
  TvFulfillWithdrawEvent: Record<keyof Flatten<TablesColumnObject['TvFulfillWithdrawEvent']>, ColumnInfo>
  TvLiquidateEvent: Record<keyof Flatten<TablesColumnObject['TvLiquidateEvent']>, ColumnInfo>
}

export type TokensDailyPriceHistory = Record<
  | 'tokensDailyPriceHistory_oldPolygonCvi'
  | 'tokensDailyPriceHistory_arbitrumCvi'
  | 'tokensDailyPriceHistory_ucvi'
  | `tokensDailyPriceHistory_${TokenName.WBTC}`
  | `tokensDailyPriceHistory_${TokenName.ETH}`,
  { x: number[]; y: number[] }
>

export enum DatesRangeOptions {
  'TradingCompetition1' = 'Trading Competition 1',
  'Last24Hours' = 'Last 24 Hours',
  'Last3Days' = 'Last 3 Days',
  'LastWeek' = 'Last Week',
  'LastMonth' = 'Last Month',
  'All' = 'All Time',
  'Custom' = 'Custom Time',
}

export const FilterNewAccountsFromSpecificDateRange = {
  tradingCompetition1: {
    fromSeconds: Math.floor(new Date('2022-12-22T00:00:00.000Z').getTime() / 1000),
    toSeconds: Math.floor(new Date('2023-01-05T00:00:00.000Z').getTime() / 1000),
  },
  layer3: {
    fromSeconds: Math.floor(new Date('2023-02-05T00:00:00.000Z').getTime() / 1000),
    toSeconds: Math.floor(new Date('2023-02-07T00:00:00.000Z').getTime() / 1000),
  },
}

export type DateRange =
  | { option: DatesRangeOptions.Custom; fromSeconds: number; toSeconds: number }
  | {
      option:
        | DatesRangeOptions.TradingCompetition1
        | DatesRangeOptions.Last24Hours
        | DatesRangeOptions.Last3Days
        | DatesRangeOptions.LastMonth
        | DatesRangeOptions.LastWeek
        | DatesRangeOptions.All
    }

export type DealsWorthInUsdc = {
  fromUsdc?: number
  toUsdc?: number
}

export type Filters = {
  eventTypes: AllEvents[keyof AllEvents]['type'][]
  addressGroups: AddressGroup[]
  addresses: string[]
  onlyNewAccountsFromDateRange?: {
    fromSeconds: number
    toSeconds: number
  }
  requestIds: {
    tv: number[]
    vt: number[]
  }
  datesRange: DateRange
  dealsWorthInUsdc: DealsWorthInUsdc
  excluding: {
    addresses: string[]
  }
}

export type ChartClassMethods<T> = { [K in keyof T as T[K] extends BuildChartFn ? K : never]: T[K] }

export type ChartName =
  | keyof ChartClassMethods<BuildCommonCharts>
  | keyof ChartClassMethods<BuildTvCharts>
  | keyof ChartClassMethods<BuildVtCharts>

export interface ReduxState {
  ui: UI
  latestBlock: State<Block>
  updateGeneralInfoOfEventAndAddresses?: UpdateGeneralInfoOfEventAndAddressesDto
  fullMode: boolean
  isDebugMode: boolean
  currentHourlyFundingFee?: number
  websiteLoading: Record<
    | 'updateGeneralInfoOfEventAndAddresses'
    | 'oldPolygonCviDailyPriceHistory'
    | 'wbtcPriceHistory'
    | 'ethPriceHistory'
    | 'cviDailyPriceHistory'
    | 'ucviHistory'
    | 'latestBlock'
    | 'vtEventsAsc'
    | 'tvEventsAsc'
    | 'currentHourlyFundingFee',
    'not-started' | 'in-progress' | 'done'
  >
  cviBackendEnvironment: BackendEnvironment
  dataFeedBackendEnvironment: BackendEnvironment
  cviOracleBackendEnvironment: BackendEnvironment
  chainId: TvSupportedChainIds
  filters: Filters
  selectedColumnsInTables: {
    vt: selectedColumnsInTablesVt
    tv: selectedColumnsInTablesTv
  }
  selectedChartNames: ChartName[]
}
