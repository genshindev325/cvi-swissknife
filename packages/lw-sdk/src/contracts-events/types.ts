import type { FormattedCviOracleAnswerUpdateEvent } from './cvi-oracle-types'
import type {
  FormattedVtSubmitRequestEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtMintEvent,
  FormattedVtBurnEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedTvFulfillDepositEvent,
  FormattedTvFulfillWithdrawEvent,
  FormattedTvLiquidateEvent,
  FormattedTvSubmitEvent,
  FormattedVtCviTransferEvent,
  FormattedVtUniswapSwapEvent,
} from './cvi-types'

export type BlockchainEventBase = {
  readonly blockNumber: number
  readonly transactionIndex: number
  readonly transactionHash: string
  readonly logIndex: number
}

export type BlockchainEvent<Type extends string, Args> = BlockchainEventBase & {
  readonly type: Type
  readonly args: Args
}
export type VtRequestEventsEmitterType = {
  VtSubmitRequestEvent: (payload: FormattedVtSubmitRequestEvent) => void
  VtFulfillRequestEvent: (payload: FormattedVtFulfillRequestEvent) => void
  VtMintEvent: (payload: FormattedVtMintEvent) => void
  VtBurnEvent: (payload: FormattedVtBurnEvent) => void
  VtLiquidateRequestEvent: (payload: FormattedVtLiquidateRequestEvent) => void
}

export type VtCviEventsEmitterType = {
  VtCviUniswapSwapEvent: (payload: FormattedVtUniswapSwapEvent) => void
  VtCviTransferEvent: (payload: FormattedVtCviTransferEvent) => void
}

export type TvRequestEventsEmitterType = {
  TvSubmitRequestEvent: (payload: FormattedTvSubmitEvent) => void
  TvFulfillDepositEvent: (payload: FormattedTvFulfillDepositEvent) => void
  TvFulfillWithdrawEvent: (payload: FormattedTvFulfillWithdrawEvent) => void
  TvLiquidateEvent: (payload: FormattedTvLiquidateEvent) => void
}

export type CviOracleEventsEmitterType = {
  CviOracleAnswerEvent: (payload: FormattedCviOracleAnswerUpdateEvent) => void
}
