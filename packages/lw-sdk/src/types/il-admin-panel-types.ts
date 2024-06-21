import type { FormattedProtectionBoughtEvent, FormattedProtectionClosedEvent } from '../contracts-events'
import type { UsedEmbedDiscountForAddress } from './embed'

export type ProtectionStatusProfit = {
  payoutOrDuePayoutUsdc: number
  lpRevenueUsdc: number
  lpProfitPercentage: number
  userRevenueUsdc: number
  userProfitPercentage: number
}

export type ProtectionStatus = ProtectionStatusProfit & {
  blockNumber: number
  blockTimestamp: number
  blockTimestampUtc: string
  ilPercentage: number
  withoutMinPayout: ProtectionStatusProfit
}

export type ProtectionInfoMetadata = {
  readonly lpTokensWorthAtBuyTimeUsdc: number
  readonly maxAmountToBePaidUsdc: number
  readonly feeUsdc?: number
  readonly feePercentage?: number
  readonly embedDiscount?: UsedEmbedDiscountForAddress
}

export type ProtectionInfo = {
  readonly metadata: ProtectionInfoMetadata
  status: ProtectionStatus
  readonly boughtEvent: FormattedProtectionBoughtEvent
  expiredEvent?: FormattedProtectionClosedEvent
}

export type ProtectionIdWithInfo = {
  readonly protectionId: string
  readonly protectionInfo: ProtectionInfo
}

export type WalletProtections = {
  readonly wallet: string
  readonly isInternalWallet: boolean
  readonly protections: ProtectionIdWithInfo[]
}

export type ProtectionDuePayoutsInfo = {
  readonly protectionInfo: ProtectionInfo
  readonly points: DuePayoutPoint[]
}

export type DuePayoutPoint = {
  readonly pointIndex: number
  readonly protectionStatus: ProtectionStatus
}

export type ProtectionDuePayoutPoints = {
  readonly protectionId: string
  readonly protectionDuePayoutsInfo: ProtectionDuePayoutsInfo
}
