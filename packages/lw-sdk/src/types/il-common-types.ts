import type { BigNumber } from 'ethers'
import type { ProtectionNFTDetailsStructOutput } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionNFT'
import type { SupportedZapperProtocolNames } from '../zapper-api/types'
import type { BlockchainName } from './config-types'
import type { ArmadilloSupportedPair, ArmadilloSupportedTokenName } from './token-types'
import type { IArmadilloSupportedTokenName, Override } from './common-types'

export type ProtectionDetails = Pick<
  ProtectionNFTDetailsStructOutput,
  | 'id'
  | 'owner'
  | 'protectionStartTimestamp'
  | 'protectionEndTimestamp'
  | 'premiumCostUSD'
  | 'lpTokensWorthAtBuyTimeUSD'
  | 'policyPeriod'
> & {
  tokenName1: ArmadilloSupportedTokenName
  tokenName2: ArmadilloSupportedTokenName
  protocol: SupportedZapperProtocolNames
  blockChainName: BlockchainName
}

export type HistoryProtectionDetails = Pick<
  ProtectionNFTDetailsStructOutput,
  | 'id'
  | 'owner'
  | 'protectionStartTimestamp'
  | 'protectionEndTimestamp'
  | 'premiumCostUSD'
  | 'lpTokensWorthAtBuyTimeUSD'
> & {
  tokenName1: ArmadilloSupportedTokenName
  tokenName2: ArmadilloSupportedTokenName
  protocol: SupportedZapperProtocolNames
  blockChainName: BlockchainName
}

export type ActiveProtection = {
  type: 'active-protection'
  id: BigNumber
  owner: string
  protectionStartTimestamp: number
  protectionEndTimestamp: number
  premiumCostUSD: BigNumber
  lpTokensWorthAtBuyTimeUSD: BigNumber
  tokenName1: ArmadilloSupportedTokenName
  tokenName2: ArmadilloSupportedTokenName
  policyPeriodSeconds: number
  blockChainName: BlockchainName
  protectionWorthNowUsdc: BigNumber
  currentILsPercentageForActiveProtections: number
}

export type ExpiredProtection = Omit<
  ActiveProtection,
  'type' | 'protectionWorthNowUsdc' | 'currentILsPercentageForActiveProtections'
> & {
  type: 'expired-protection'
  expiredProtectionWorthUsdc: BigNumber
}

export type Protections = {
  activeProtections: ActiveProtection[]
  expiredProtections: ExpiredProtection[]
}

export type PeriodSeconds = { periodSeconds: number; periodSecondsFormat: string }

export type PremiumValues<T extends string | number | BigNumber | undefined> = {
  lpTokensWorthAtBuyTimeUsdc: T
  totalLPTokensWorthAtBuyTimeUsdc: T
  expectedLPTokensValueGrowth: T
  liquidityUsdc: T
  maxILProtectedPercentage: T
  cvi: T
  premiumGrowthStart: T
  premiumSlope: T
  premiumParams: {
    A: T
    X0: T
    C: T
  }
}

export type CalculateCustomPremiumValues = PremiumValues<BigNumber>

export type AntonPremiumParamsByPeriod = {
  pair: ArmadilloSupportedPair
  period: PeriodSeconds
  premiumParams: PremiumValues<number>['premiumParams']
}

export type AccountProtectionsDto = {
  address: string
  isInternalAddress: boolean
  protections: {
    activeProtections: ActiveProtectionDto[]
    expiredProtections: ExpiredProtectionDto[]
  }
}

export type ActiveProtectionDto = Override<
  ActiveProtection,
  { id: string; premiumCostUSD: string; lpTokensWorthAtBuyTimeUSD: string; protectionWorthNowUsdc: string }
> & { blockNumber: number }

export type ProtectionAccountAddressToNftIdDto = {
  address: string
  isInternalAddress: boolean
  protectionsIds: number[]
}

export type ExpiredProtectionDto = Override<
  ExpiredProtection,
  { id: string; premiumCostUSD: string; lpTokensWorthAtBuyTimeUSD: string; expiredProtectionWorthUsdc: string }
> & { blockNumber: number }

export type StaticProtectionMetadataDto = Pick<
  ActiveProtectionDto,
  | 'id'
  | 'owner'
  | 'protectionStartTimestamp'
  | 'protectionEndTimestamp'
  | 'premiumCostUSD'
  | 'lpTokensWorthAtBuyTimeUSD'
  | 'tokenName1'
  | 'tokenName2'
  | 'policyPeriodSeconds'
>

export type WalletAddress = string
export type ProtectionId = string

export type ProtectionMetadata = {
  readonly id: ProtectionId
  readonly owner: WalletAddress
  readonly protectionStartTimestamp: number
  readonly protectionEndTimestamp: number
  readonly premiumCostUSD: number
  readonly lpTokensWorthAtBuyTimeUSD: number
  readonly tokenName1: IArmadilloSupportedTokenName
  readonly tokenName2: IArmadilloSupportedTokenName
  readonly policyPeriodSeconds: number
  readonly maxAmountToBePaidUsdc: number
  readonly protectionStartTimestampUtc: string
  readonly protectionEndTimestampUtc: string
  readonly policyPeriodDays: number
  readonly feeUsdc?: number
  readonly feePercentage?: number
}
