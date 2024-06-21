import type {
  SubmitRequestEvent,
  FulfillDepositEvent,
  FulfillWithdrawEvent,
  LiquidateRequestEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/ThetaVault'

export enum TvRequestType {
  Deposit = 1,
  Withdraw = 2,
}

export type VaultTransactionStatus = 'pending' | 'success' | 'failure'

export interface ThetaVaultEventBase {
  requestType: TvRequestType
  requestId: string
  request: SubmitRequestEvent
  status: VaultTransactionStatus
}

export interface PendingThetaVaultEvent extends ThetaVaultEventBase {
  status: 'pending'
}

export interface CompletedDepositThetaVaultEvent extends ThetaVaultEventBase {
  status: 'success'
  requestType: TvRequestType.Deposit
  fulfill: FulfillDepositEvent
}

export interface CompletedWithdrawThetaVaultEvent extends ThetaVaultEventBase {
  status: 'success'
  requestType: TvRequestType.Withdraw
  fulfill: FulfillWithdrawEvent
}

export interface FailedThetaVaultEvent extends ThetaVaultEventBase {
  status: 'failure'
  liquidate: LiquidateRequestEvent
}

export type ThetaVaultEvent =
  | PendingThetaVaultEvent
  | CompletedDepositThetaVaultEvent
  | CompletedWithdrawThetaVaultEvent
  | FailedThetaVaultEvent

export type VaultTransaction = {
  txHash: string
  submitDateToString: string
  targetDateToString: string
  targetTimestamp: number
  action: keyof typeof TvRequestType
  amount: number
  status: VaultTransactionStatus
}
