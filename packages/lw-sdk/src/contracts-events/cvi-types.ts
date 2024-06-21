import type { TokenName, TvRequestType } from '../types'
import type { VtRequestType } from '../types/vol-token-common-types'
import type {
  GeneralInfoOfEvent,
  GeneralInfoOfEventByAddress,
} from './cvi-contrants-events/cvi-cache-events-api.inversify.service'
import type { BlockchainEvent } from './types'

// =========== Theta Vaults Formats =========== //

// SubmitRequest
export interface FormattedTvSubmitEventObject {
  readonly account: string
  readonly requestId: number
  readonly requestType: number
  readonly tokenAmountInUsdcTokenName: string
  readonly tokenAmountInUsdc: number
  readonly tokenAmountName: string
  readonly tokenAmount: number
  readonly targetTimestamp: number
  readonly currentThetaVaultUsdcBalance: number
  readonly totalSupply: number
  readonly action: keyof typeof TvRequestType
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
}

export type FormattedTvSubmitEvent = BlockchainEvent<'TvSubmitEvent', FormattedTvSubmitEventObject> & {
  blockTimestamp: number
}

// FulfillDeposit
export interface FormattedTvFulfillDepositEventObject {
  readonly account: string
  readonly action: 'Deposit'
  readonly requestId: number
  readonly tokenName: string
  readonly submitRequestTokenAmountUsdc: number
  readonly platformLiquidityAmountUsdc: number
  readonly dexVolTokenUSDCAmount: number
  readonly dexVolTokenAmount: number
  readonly dexUSDCAmount: number
  readonly mintedThetaTokens: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
}

export type FormattedTvFulfillDepositEvent = BlockchainEvent<
  'TvFulfillDepositEvent',
  FormattedTvFulfillDepositEventObject
> & {
  blockTimestamp: number
}

// FulfillWithdraw
export interface FormattedTvFulfillWithdrawEventObject {
  readonly account: string
  readonly action: 'Withdraw'
  readonly requestId: number
  readonly tokenName: string
  readonly usdcAmountReceived: number
  readonly platformLiquidityAmountUsdc: number
  readonly dexVolTokenAmount: number
  readonly dexUSDCviTokenAmount: number
  readonly dexUSDCAmount: number
  readonly burnedThetaTokens: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
}
export type FormattedTvFulfillWithdrawEvent = BlockchainEvent<
  'TvFulfillWithdrawEvent',
  FormattedTvFulfillWithdrawEventObject
> & {
  blockTimestamp: number
}

// LiquidateRequest (Expired)
export interface FormattedTvLiquidateEventObject {
  readonly account: string
  readonly requestId: number
  readonly tokenAmountName: string
  readonly requestType: TvRequestType
  readonly liquidator: string
  readonly tokenAmount: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly action: keyof typeof TvRequestType
}
export type FormattedTvLiquidateEvent = BlockchainEvent<'TvLiquidateEvent', FormattedTvLiquidateEventObject> & {
  blockTimestamp: number
}

export type GroupFormattedThetaVaultsEvents =
  | FormattedTvSubmitEvent
  | FormattedTvFulfillDepositEvent
  | FormattedTvFulfillWithdrawEvent
  | FormattedTvLiquidateEvent

export type ArrayFormattedThetaVaultsEvents = [
  FormattedTvSubmitEvent[],
  FormattedTvFulfillDepositEvent[],
  FormattedTvFulfillWithdrawEvent[],
  FormattedTvLiquidateEvent[],
]

// =========== Volatility Tokens Formats =========== //

export interface FormattedVtUniswapSwapEventObject {
  readonly account: string
  readonly tokenNameAmountIn: TokenName
  readonly tokenAmountIn: number
  readonly tokenNameAmountOut: TokenName
  readonly tokenAmountOut: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
}

export type FormattedVtUniswapSwapEvent = BlockchainEvent<'VtUniswapSwapEvent', FormattedVtUniswapSwapEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtCviTransferEventObject {
  readonly fromAccount: string
  readonly toAccount: string
  readonly cviAmount: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventBySender: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventBySenderOneBlockBefore: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByReceiver: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByReceiverOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtCviTransferEvent = BlockchainEvent<'VtCviTransferEvent', FormattedVtCviTransferEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtSubmitRequestEventObject {
  // from args but human readable types
  readonly account: string
  readonly requestId: number
  readonly requestType: VtRequestType
  readonly action: keyof typeof VtRequestType
  readonly submitFeesAmount: number
  readonly tokenNameSubmitFeesAmount: TokenName
  readonly requestTimestamp: number
  readonly targetTimestamp: number
  readonly tokenAmountPaid: number
  readonly tokenNameAmountPaid: TokenName
  readonly useKeepers: boolean
  readonly maxBuyingPremiumFeePercentage: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtSubmitRequestEvent = BlockchainEvent<'VtSubmitEvent', FormattedVtSubmitRequestEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtMintEventObject {
  // from args but human readable types
  readonly requestId: number
  readonly account: string
  usdcPaidAfterTimeDelayFee: number
  readonly action: 'Mint'
  readonly positionedTokenAmount: number
  readonly positionedTokenNameAmount: TokenName
  readonly mintedTokens: number
  readonly mintedTokenName: TokenName
  readonly openPositionFee: number
  readonly openPositionFeeTokenName: TokenName
  readonly buyingPremiumFee: number
  readonly buyingPremiumFeeTokenName: TokenName
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtMintEvent = BlockchainEvent<'VtMintEvent', FormattedVtMintEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtLiquidateEventObject {
  // from args but human readable types
  readonly requestId: number
  readonly requestType: VtRequestType
  readonly action: keyof typeof VtRequestType
  readonly account: string
  readonly liquidator: string
  readonly findersFeeAmount: number
  readonly findersFeeAmountTokenName: TokenName
  readonly useKeepers: boolean
  readonly liquidateTimestamp: number
  readonly liquidateTimestampString: string
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtLiquidateRequestEvent = BlockchainEvent<'VtLiquidateEvent', FormattedVtLiquidateEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtFulfillRequestEventObject {
  // from args but human readable types
  readonly requestId: number
  readonly requestType: number
  readonly action: keyof typeof VtRequestType
  readonly account: string
  readonly fulfillFeesAmount: number
  readonly tokenNameFulfillFeesAmount: TokenName
  readonly isAborted: boolean
  readonly useKeepers: boolean
  readonly keepersCalled: boolean
  readonly fulfiller: string
  readonly fulfillTimestamp: number
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtFulfillRequestEvent = BlockchainEvent<'VtFulfillEvent', FormattedVtFulfillRequestEventObject> & {
  blockTimestamp: number
}

export interface FormattedVtBurnEventObject {
  // from args but human readable types
  readonly requestId: number
  readonly account: string
  readonly action: 'Burn'
  readonly usdcReceivedBeforeFees: number
  readonly usdcAmountReceived: number
  readonly burnedTokensCvi: number
  readonly burnedTokenscviTokenName: TokenName
  readonly closePositionFee: number
  readonly closingPremiumFee: number
  readonly closingPremiumFeeTokenName: TokenName
  readonly tokenNameClosePositionFee: TokenName
  readonly generalInfoOfEvent: GeneralInfoOfEvent
  readonly generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
  readonly generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  readonly generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  readonly cviTokenName: TokenName
}

export type FormattedVtBurnEvent = BlockchainEvent<'VtBurnEvent', FormattedVtBurnEventObject> & {
  blockTimestamp: number
}

export type GroupFormattedVolatilityTokensEvents =
  | FormattedVtSubmitRequestEvent
  | FormattedVtLiquidateRequestEvent
  | FormattedVtFulfillRequestEvent
  | FormattedVtMintEvent
  | FormattedVtBurnEvent

export type GroupFormattedCviEvents = FormattedVtCviTransferEvent | FormattedVtUniswapSwapEvent

// =========== Staking Formats =========== //

export type FormattedStakingUnstakedObject = {
  readonly account: string
  readonly xGOVIBurned: number
  readonly goviReward: number
  readonly xGOVIBalance: number
}

export type FormattedStakingUnstakedEvent = BlockchainEvent<'UnstakedEvent', FormattedStakingUnstakedObject>

export type FormattedStakingStakedObject = {
  readonly account: string
  readonly goviAmount: number
  readonly xGOVIMinted: number
  readonly xGOVIBalance: number
}

export type FormattedStakingStakedEvent = BlockchainEvent<'StakedEvent', FormattedStakingStakedObject>
