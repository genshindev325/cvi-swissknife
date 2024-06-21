/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  GeneralInfoOfEventByAddressDto,
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtCviTransferEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AddressGroup } from '@coti-cvi/lw-sdk/src'
import type { TokensDailyPriceHistory } from './redux/types'

export type Flatten<T extends object> = object extends T
  ? object
  : {
      [K in keyof T]-?: (
        x: NonNullable<T[K]> extends infer V
          ? V extends object
            ? V extends readonly any[]
              ? Pick<T, K>
              : Flatten<V> extends infer FV
              ? {
                  [P in keyof FV as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: FV[P]
                }
              : never
            : Pick<T, K>
          : never,
      ) => void
    } extends Record<keyof T, (y: infer O) => void>
  ? O extends infer U
    ? { [K in keyof O]: O[K] }
    : never
  : never

export type UI = 'cvi-hedging-ui' | 'cvi-admin-panel-ui'

export type TvRequest = {
  resource: 'tv'
  requestId: number
  address: string
  events: (TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)[]
  eventsByType: {
    [TvSubmitEventDto.type.TV_SUBMIT_EVENT]?: TvSubmitEventDto
    [TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT]?: TvLiquidateEventDto
    [TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT]?: TvFulfillDepositEventDto
    [TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT]?: TvFulfillWithdrawEventDto
  }
}

export type VtRequest = {
  resource: 'vt'
  requestId: number
  address: string
  events: (
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
  )[]
  eventsByType: {
    [VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT]?: VtSubmitRequestEventDto
    [VtFulfillRequestEventDto.type.VT_FULFILL_EVENT]?: VtFulfillRequestEventDto
    [VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT]?: VtLiquidateRequestEventDto
    [VtMintEventDto.type.VT_MINT_EVENT]?: VtMintEventDto
    [VtBurnEventDto.type.VT_BURN_EVENT]?: VtBurnEventDto
  }
}

export type EventsContextType = {
  swapEventsAsc: VtUniswapSwapEventDto[]
  tokensDailyPriceHistory: TokensDailyPriceHistory
  addresses: string[]
  addressToGroupMap: Map<string, AddressGroup>
  updatedGeneralInfoOfEventByAddressMap: Map<string, GeneralInfoOfEventByAddressDto>
  addressesWithCvisx1AllTime: Set<string>
  addressesWithTvCvisx1AllTime: Set<string>
  newAccountsFromDateRange?: Set<string>
  allEventsAsc: (
    | VtUniswapSwapEventDto
    | VtCviTransferEventDto
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
    | TvSubmitEventDto
    | TvFulfillDepositEventDto
    | TvFulfillWithdrawEventDto
    | TvLiquidateEventDto
  )[]
  tvEventsAsc: (TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)[]
  vtEventsWithoutTransferAndSwapAsc: (
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
  )[]
  vtTransferAndSwapEventsAsc: (VtUniswapSwapEventDto | VtCviTransferEventDto)[]
  vtEventsAsc: (
    | VtUniswapSwapEventDto
    | VtCviTransferEventDto
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
  )[]
  tvRequestIdToSubmitEventMap: Map<number, TvSubmitEventDto>
  vtRequestIdToSubmitEventMap: Map<number, VtSubmitRequestEventDto>
  tvRequests: TvRequest[]
  tvRequestIdToRequest: Map<number, TvRequest>
  vtRequestIdToRequest: Map<number, VtRequest>
  vtRequests: VtRequest[]
  allRequests: (TvRequest | VtRequest)[]
}
