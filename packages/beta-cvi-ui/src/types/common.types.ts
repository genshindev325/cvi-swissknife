export type StakeUnstaleModalState = { modalIsOpen: boolean; title: 'stake' | 'unstake' }
export type mintBurnModalState = {
  modalIsOpen: boolean
  title?: 'mint' | 'burn'
  id?: number | undefined
  clickReceiveFromModal?: boolean
}

export enum WebSite {
  Cvi = 'CVI',
  Armadillo = 'ARMADILLO',
}

export type Tab = {
  name: string
  path: string
}
export enum CviName {
  '1x' = 'cvi',
  '2x' = 'cvi2x',
}
export enum PathName {
  'dashboard' = 'dashboard',
}

// export type AppState = {
//   activeTab: ProtectionTabsPaths | VaultsTabsPaths | VolatilityTokensChartsTabsPaths | ''
// }

export enum ProtectionTabsPaths {
  'active-protection' = 'active-protection',
  'history' = 'history',
}
export enum PendingRequestsTabsPaths {
  'balance' = 'balance',
  'pending-request' = 'pending-request',
  'history' = 'history',
}
export enum VolatilityTokensChartsTabsPaths {
  'trading-view' = 'trading_view',
  'index' = 'index',
  'funding-fee' = 'funding_fee',
}
export enum LeaderboardTabsPaths {
  'Top-trades' = 'Top_trades',
  'live' = 'live',
  'competition' = 'competition',
}

export enum CompetitionTabsPaths {
  'current' = 'current',
  'history' = 'history',
}
export enum VaultTransactionTabPaths {
  'vault-transactions' = 'vault-transactions',
}

export enum VaultsTabsPaths {
  'deposit' = 'deposit',
  'withdraw' = 'withdraw',
}
export enum VolatilityTokensTabsPaths {
  'mint' = 'mint',
  'burn' = 'burn',
}
export type RadioGroupSelectOption = {
  key: string
  valueToString: string
}

export type UnstakeLockType = { isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }
export type WithdrawLockType = { isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }

export enum ActiveProtectionsHeaders {
  id = 'Id',
  pair = 'Pair',
  protected_amount = 'Protected amount',
  purchase_date = 'Purchase date',
  period = 'Period',
  protection_end_date = 'Protection end date',
  current_il = 'Current IL',
  payout = 'Payout',
}

export type ActiveProtectionsKeys = keyof typeof ActiveProtectionsHeaders
export enum HistoryProtectionsHeaders {
  id = 'Id',
  pair = 'Pair',
  protected_amount = 'Protected amount',
  purchase_date = 'Purchase date',
  period = 'Period',
  protection_end_date = 'Protection end date',
  il = 'IL',
  payout = 'Payout',
}
export type HistoryProtectionsKeys = keyof Omit<typeof ActiveProtectionsHeaders, 'current_il'> | 'il'

export enum PendingRequestHeaders {
  id = 'Id',
  type = 'Type',
  submit_time = 'Submit time',
  amount = 'Amount',
  expected_no_of_tokens = 'Expected # of tokens',
  receive_in = 'Receive in',
}
export type PendingRequestKeys = keyof typeof PendingRequestHeaders
export enum HistoryPendingRequestHeaders {
  id = 'Id',
  type = 'Type',
  submit_time = 'Submit time',
  amount = 'Amount',
  received_tokens = 'Received tokens',
  status = 'Status',
}
export type HistoryPendingRequestKeys = keyof typeof HistoryPendingRequestHeaders

export enum BalancesPendingRequestHeaders {
  token = 'Token',
  amount = 'Amount',
  platform_price = 'Platform price',
  total_value = 'Total value',
}
export type BalancesPendingRequestKeys = keyof typeof BalancesPendingRequestHeaders
