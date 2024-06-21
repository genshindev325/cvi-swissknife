import type { GeneralInfoOfEventByAddress, GeneralInfoOfEventFromBlock } from '../../contracts-events'
import type { CviHistoryGroupBy } from '../../types'

export enum AddressGroup {
  COMMUNITY = 'Community',
  USERS = 'Users',
  CVI_CONTRACTS = 'CVI Contracts',
  DEX_CONTRACTS = 'DEX Contracts',
  GNOSIS_SAFE = 'Gnosis Safe',
}

export type GetCviOracleHistoryDataQuery = {
  readonly fromBlockTimestamp?: number

  readonly toBlockTimestamp?: number

  readonly groupBy?: CviHistoryGroupBy
}

export type UpdateGeneralInfoOfEventOfAddress = {
  address: string
  generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
}

export type UpdateGeneralInfoOfEventAndAddresses = GeneralInfoOfEventFromBlock & {
  updatedGeneralInfoOfEventByAddress: UpdateGeneralInfoOfEventOfAddress[]
}

export type TradingCompetitionInfoParameters = {
  fromTimestamp?: number
  debug?: boolean
}

export type TradingCompetitionInfoAddress = {
  address: string
  pnlUsdc: number
  maxTradeUsdc: number
  trades: number
  tvCvix1BalanceInUsdc: number
}

export type LatestGeneralInfoOfEventByAddressInfo = {
  blockNumber: number
  transactionIndex: number
  logIndex: number
  generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
}
