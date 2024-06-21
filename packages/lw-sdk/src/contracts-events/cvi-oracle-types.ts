import type { BlockchainEvent } from './types'

// AnswerUpdateEvent
export interface FormattedCviOracleAnswerUpdateObject {
  readonly cviIndex: number
  readonly cviRoundId: number
}

export type FormattedCviOracleAnswerUpdateEvent = BlockchainEvent<
  'AnswerUpdateEvent',
  FormattedCviOracleAnswerUpdateObject
> & {
  blockTimestamp: number
}
