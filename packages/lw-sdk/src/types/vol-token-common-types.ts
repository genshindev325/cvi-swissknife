import type {
  FormattedVtBurnEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtMintEvent,
  FormattedVtSubmitRequestEvent,
} from '../contracts-events'
import type {
  SubmitRequestEvent,
  LiquidateRequestEvent,
  BurnEvent,
  FulfillRequestEvent,
  MintEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IVolatilityToken'

export enum VtRequestType {
  Mint = 1,
  Burn = 2,
}

export type VolTokenTransactionStatus = 'pending' | 'success' | 'failure'

export interface VolTokenEventBase {
  requestType: VtRequestType
  requestId: number
  request: FormattedVtSubmitRequestEvent
  status: VolTokenTransactionStatus
}

export interface PendingVolTokenEvent extends VolTokenEventBase {
  status: 'pending'
}

export interface CompletedMintVolTokenEvent extends VolTokenEventBase {
  status: 'success'
  requestType: VtRequestType.Mint
  fulfill: FormattedVtFulfillRequestEvent
  mint: FormattedVtMintEvent
}

export interface CompletedBurnVolTokenEvent extends VolTokenEventBase {
  status: 'success'
  requestType: VtRequestType.Burn
  fulfill: FormattedVtFulfillRequestEvent
  burn: FormattedVtBurnEvent
}

export interface FailedVolTokenEvent extends VolTokenEventBase {
  status: 'failure'
  liquidate: FormattedVtLiquidateRequestEvent
}

export type VolTokenEvent =
  | PendingVolTokenEvent
  | CompletedMintVolTokenEvent
  | CompletedBurnVolTokenEvent
  | FailedVolTokenEvent

export type VolFundingFeeTableEvents = VolTokenEventBase

export type FormattedSimpleEvent<
  E extends SubmitRequestEvent | FulfillRequestEvent | LiquidateRequestEvent | MintEvent | BurnEvent,
> = Omit<E, 'args'> & { args: Omit<E['args'], 'requestId'> & { requestId: number } }

interface SimpleVolTokenEventBase {
  requestType: VtRequestType
  requestId: number
  request: FormattedSimpleEvent<SubmitRequestEvent>
  status: VolTokenTransactionStatus
}

export interface SimplePendingVolTokenEvent extends SimpleVolTokenEventBase {
  status: 'pending'
}

export interface SimpleCompletedMintVolTokenEvent extends SimpleVolTokenEventBase {
  status: 'success'
  requestType: VtRequestType.Mint
  fulfill: FormattedSimpleEvent<FulfillRequestEvent>
  mint: FormattedSimpleEvent<MintEvent>
}

export interface SimpleCompletedBurnVolTokenEvent extends SimpleVolTokenEventBase {
  status: 'success'
  requestType: VtRequestType.Burn
  fulfill: FormattedSimpleEvent<FulfillRequestEvent>
  burn: FormattedSimpleEvent<BurnEvent>
}

export interface SimpleFailedVolTokenEvent extends SimpleVolTokenEventBase {
  status: 'failure'
  liquidate: FormattedSimpleEvent<LiquidateRequestEvent>
}

export type SimpleVolTokenEvent =
  | SimplePendingVolTokenEvent
  | SimpleCompletedMintVolTokenEvent
  | SimpleCompletedBurnVolTokenEvent
  | SimpleFailedVolTokenEvent

export type GroupedVolTokenEvent =
  | SubmitRequestEvent
  | LiquidateRequestEvent
  | BurnEvent
  | FulfillRequestEvent
  | MintEvent

export type GroupedFormattedVolTokenEvent =
  | FormattedSimpleEvent<SubmitRequestEvent>
  | FormattedSimpleEvent<LiquidateRequestEvent>
  | FormattedSimpleEvent<BurnEvent>
  | FormattedSimpleEvent<FulfillRequestEvent>
  | FormattedSimpleEvent<MintEvent>
