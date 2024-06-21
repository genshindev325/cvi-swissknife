import {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
} from '../../../../auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'

export const tvEventsTypes = {
  [TvSubmitEventDto.type.TV_SUBMIT_EVENT]: TvSubmitEventDto.type.TV_SUBMIT_EVENT,
  [TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT]: TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT,
  [TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT]: TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT,
  [TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT]: TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT,
} as const

type ReverseMap<T> = T[keyof T]

export type TvEventsValues = ReverseMap<typeof tvEventsTypes>

export type AccountType = 'internal' | 'external'
