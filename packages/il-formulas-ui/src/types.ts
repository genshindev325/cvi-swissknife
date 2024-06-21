import type {
  PremiumValues,
  CVIOracleInversifyService,
  GetContractInversifyService,
  GlobalEventsInversifyService,
  IERC20,
  IlContractsInversifyService,
  ILProtectionInversifyService,
  IlSupportedChainIds,
  LatestBlockInfoInversifyService,
  PeriodSeconds,
  Token,
  TokenName,
  ArmadilloSupportedPair,
} from '@coti-cvi/lw-sdk'
import type { CHART_NAMES } from './utils'

export type ChartNames = typeof CHART_NAMES[number]

export type PremiumPricePoint = {
  propertyValue: number
  premiumUsdc: number
}

export type RangeInfo<T extends number | string> = {
  min: T
  max: T
  interval: T
}

export type Point = [x: number, y: number]

export type SerieId = string

export type PremiumPriceSerieInfo = {
  id: SerieId
  name: string
  chartName: ChartNames
  premiumValues: PremiumValues<number>
  chainId: IlSupportedChainIds
  selectedPairAndPeriod: SelectedPairAndPeriod
  rangeInfo: RangeInfo<number>
  borderPoint: Point
}

export type PremiumPriceChartSeries = {
  seriesSortedByCreationDateAsc: PremiumPriceSerieInfo[]
}

export type InversifyServices = {
  globalEventsInversifyService: GlobalEventsInversifyService
  getContractInversifyService: GetContractInversifyService
  latestBlockInfoInversifyService: LatestBlockInfoInversifyService
  ilContractsInversifyService: IlContractsInversifyService
  iLProtectionInversifyService: ILProtectionInversifyService
  cviOracleInversifyService: CVIOracleInversifyService
  tokenUSDC: Token<IERC20, TokenName.USDC>
}

export enum PyParabolaBaseUrls {
  Local = 'http://localhost:8003',
  K8s = 'https://py-parabola-coefficients.cvi-team.com',
}

export type SelectedPairAndPeriod = {
  source: 'anton' | 'contract'
  chainId: IlSupportedChainIds
  pair: ArmadilloSupportedPair
  period: PeriodSeconds
  premiumParams: PremiumValues<number>['premiumParams']
}
