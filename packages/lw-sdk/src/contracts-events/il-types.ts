import type { IArmadilloSupportedTokenName } from '../types'
import type { BlockchainEvent } from './types'

export interface FormattedLiquidityAddedEventObject {
  from: string
  amount: number
  updatedTotalLiquidity: number
}

export type FormattedLiquidityAddedEvent = BlockchainEvent<'LiquidityAdded', FormattedLiquidityAddedEventObject>

export interface FormattedLiquidityWithdrawnEventObject {
  to: string
  amount: number
  updatedTotalLiquidity: number
}

export type FormattedLiquidityWithdrawnEvent = BlockchainEvent<
  'LiquidityWithdrawn',
  FormattedLiquidityWithdrawnEventObject
>

export type FormattedProtectionBoughtEventObject = {
  readonly id: string
  readonly owner: string
  readonly protectionStartTimestamp: number
  readonly protectionStartTimestampUtc: string
  readonly protectionEndTimestamp: number
  readonly protectionEndTimestampUtc: string
  readonly premiumCostUSD: number
  readonly tokenName1: IArmadilloSupportedTokenName
  readonly tokenName2: IArmadilloSupportedTokenName
  readonly policyPeriodSeconds: number
  readonly policyPeriodDays: number
  readonly token1EntryPriceUSD: number
  readonly token2EntryPriceUSD: number
  readonly collateral: number
}

export type FormattedProtectionBoughtEvent = BlockchainEvent<
  'ProtectionBoughtEvent',
  FormattedProtectionBoughtEventObject
>

export type FormattedProtectionClosedEventObject = {
  readonly id: string
  readonly owner: string
  readonly protectionStartTimestamp: number
  readonly protectionStartTimestampUtc: string
  readonly protectionEndTimestamp: number
  readonly protectionEndTimestampUtc: string
  readonly premiumCostUSD: number
  readonly tokenName1: IArmadilloSupportedTokenName
  readonly tokenName2: IArmadilloSupportedTokenName
  readonly policyPeriodSeconds: number
  readonly policyPeriodDays: number
  readonly token1EndPriceUSD: number
  readonly token2EndPriceUSD: number
  readonly collateral: number
  readonly amountPaidUSD: number
}

export type FormattedProtectionClosedEvent = BlockchainEvent<
  'ProtectionClosedEvent',
  FormattedProtectionClosedEventObject
>

export interface FormattedProtectionMintDiscountDetailsObject {
  id: string
  owner: string
  discountNFTType: number
  premiumCostBeforeDiscount: number
  premiumCostDiscount: number
}

export type FormattedProtectionMintDiscountDetailsEvent = BlockchainEvent<
  'ProtectionMintDiscountDetails',
  FormattedProtectionMintDiscountDetailsObject
>
