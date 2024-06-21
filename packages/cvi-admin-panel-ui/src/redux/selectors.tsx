import {
  SubmitRequestEventDto,
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
  VtUniswapSwapEventArgsDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { GeneralInfoOfEventByAddressDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { createSelector } from '@reduxjs/toolkit'
import _ from 'lodash'
import type { StrictParams } from '../hooks/use-strict-params'
import type { DealsWorthInUsdc, Filters, ReduxState, TokensDailyPriceHistory } from './types'
import type { AddressGroup, CviContractsInversifyService } from '@coti-cvi/lw-sdk/src'
import { sortEventsAsc, TokenName } from '@coti-cvi/lw-sdk/src'
import { enhanceDatesRange } from '../hooks/use-dates-range'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk'
import type { EventsContextType, TvRequest, VtRequest } from '../types'

const stateSelector = createSelector([(state: ReduxState) => state], state => state)

const websiteLoadingPercentageSelector = createSelector(
  [stateSelector],
  state =>
    (Object.values(state.websiteLoading).filter(s => s === 'done').length * 100) /
    Object.values(state.websiteLoading).length,
)

export function flattenEvents({
  newAccountsFromDateRange,
  tvEventsAsc = [],
  vtEventsAsc = [],
  updatedGeneralInfoOfEventByAddressMap = new Map(),
  cviContractsInversifyService,
  tokensDailyPriceHistory,
  filters,
  params,
}: {
  newAccountsFromDateRange?: Set<string>
  filters?: Filters
  vtEventsAsc?: (
    | VtUniswapSwapEventDto
    | VtCviTransferEventDto
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
  )[]
  params?: StrictParams
  tvEventsAsc?: (TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)[]
  updatedGeneralInfoOfEventByAddressMap?: Map<string, GeneralInfoOfEventByAddressDto>
  cviContractsInversifyService?: CviContractsInversifyService
  tokensDailyPriceHistory: TokensDailyPriceHistory
}): EventsContextType {
  const vtEventsWithoutTransferAndSwapAsc = vtEventsAsc.flatMap(e =>
    e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT &&
    e.type !== VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
      ? [e]
      : [],
  )

  const vtTransferAndSwapEventsAsc = vtEventsAsc.flatMap(e =>
    e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT &&
    e.type !== VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
      ? []
      : [e],
  )

  const swapEventsAsc = vtTransferAndSwapEventsAsc.flatMap(e =>
    e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
  )

  const tvRequests = _.chain(tvEventsAsc)
    .groupBy(e => e.args.requestId)
    .map(
      (events, requestIdStr): TvRequest => ({
        resource: 'tv',
        requestId: Number(requestIdStr),
        address: events[0].args.account,
        events,
        eventsByType: {
          TvSubmitEvent: events.flatMap(e => (e.type === 'TvSubmitEvent' ? [e] : [])).find(Boolean),
          TvFulfillDepositEvent: events.flatMap(e => (e.type === 'TvFulfillDepositEvent' ? [e] : [])).find(Boolean),
          TvFulfillWithdrawEvent: events.flatMap(e => (e.type === 'TvFulfillWithdrawEvent' ? [e] : [])).find(Boolean),
          TvLiquidateEvent: events.flatMap(e => (e.type === 'TvLiquidateEvent' ? [e] : [])).find(Boolean),
        },
      }),
    )
    .value()
    .sort((a, b) => a.requestId - b.requestId)
  const vtRequests = _.chain(vtEventsWithoutTransferAndSwapAsc)
    .groupBy(e => e.args.requestId)
    .map(
      (events, requestIdStr): VtRequest => ({
        resource: 'vt',
        requestId: Number(requestIdStr),
        address: events[0].args.account,
        events,
        eventsByType: {
          VtBurnEvent: events.flatMap(e => (e.type === 'VtBurnEvent' ? [e] : [])).find(Boolean),
          VtFulfillEvent: events.flatMap(e => (e.type === 'VtFulfillEvent' ? [e] : [])).find(Boolean),
          VtLiquidateEvent: events.flatMap(e => (e.type === 'VtLiquidateEvent' ? [e] : [])).find(Boolean),
          VtMintEvent: events.flatMap(e => (e.type === 'VtMintEvent' ? [e] : [])).find(Boolean),
          VtSubmitEvent: events.flatMap(e => (e.type === 'VtSubmitEvent' ? [e] : [])).find(Boolean),
        },
      }),
    )
    .value()
    .sort((a, b) => a.requestId - b.requestId)

  function filterAddress(address: string): boolean {
    if (params?.address && params.address !== address) {
      return false
    }
    if (!filters) {
      return true
    }
    if (filters.excluding.addresses.length > 0 && filters.excluding.addresses.includes(address)) {
      return false
    }
    if (filters.addresses.length > 0 && !filters.addresses.includes(address)) {
      return false
    }
    if (
      filters.addressGroups.length > 0 &&
      cviContractsInversifyService &&
      !filters.addressGroups.includes(getAddressGroupAndName(address, cviContractsInversifyService).addressGroup)
    ) {
      return false
    }
    if (newAccountsFromDateRange && !newAccountsFromDateRange.has(address)) {
      return false
    }
    return true
  }

  const addressesSetFromAllFilteredEvents = new Set([
    ...tvEventsAsc.map(e => e.args.account),
    ...vtEventsAsc.flatMap(e =>
      e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
        ? [e.args.fromAccount, e.args.toAccount]
        : [e.args.account],
    ),
  ])

  const filteredUpdatedGeneralInfoOfEventByAddressMap = new Map<string, GeneralInfoOfEventByAddressDto>()
  for (const [address, updatedGeneralInfoOfEventOfAddress] of updatedGeneralInfoOfEventByAddressMap) {
    if (
      addressesSetFromAllFilteredEvents.has(address) ||
      updatedGeneralInfoOfEventOfAddress.tvCvix1Balance > 0 ||
      updatedGeneralInfoOfEventOfAddress.vtCviBalance > 0 ||
      updatedGeneralInfoOfEventOfAddress.vtCviUsdcLpTokens > 0
    ) {
      if (filterAddress(address)) {
        filteredUpdatedGeneralInfoOfEventByAddressMap.set(address, updatedGeneralInfoOfEventOfAddress)
      }
    }
  }

  const addressToGroupMap = new Map(
    cviContractsInversifyService
      ? Array.from(filteredUpdatedGeneralInfoOfEventByAddressMap.keys()).map<[string, AddressGroup]>(address => [
          address,
          getAddressGroupAndName(address, cviContractsInversifyService).addressGroup,
        ])
      : [],
  )

  return {
    addressToGroupMap,
    newAccountsFromDateRange,
    updatedGeneralInfoOfEventByAddressMap: filteredUpdatedGeneralInfoOfEventByAddressMap,
    allEventsAsc: [...tvEventsAsc, ...vtEventsAsc].sort(sortEventsAsc),
    addressesWithCvisx1AllTime: new Set(
      vtEventsAsc
        .flatMap(e => {
          const r: string[] = []
          if (e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
            if (e.args.generalInfoOfEventBySender.vtCviBalance > 0) {
              r.push(e.args.fromAccount)
            }
            if (e.args.generalInfoOfEventByReceiver.vtCviBalance > 0) {
              r.push(e.args.toAccount)
            }
          } else {
            if (e.args.generalInfoOfEventByAddress.vtCviBalance > 0) {
              r.push(e.args.account)
            }
          }
          return r
        })
        .concat(
          Array.from(filteredUpdatedGeneralInfoOfEventByAddressMap.entries()).flatMap(([address, info]) =>
            info.vtCviBalance > 0 ? [address] : [],
          ),
        )
        .filter(address => filteredUpdatedGeneralInfoOfEventByAddressMap.has(address)),
    ),
    addressesWithTvCvisx1AllTime: new Set(
      tvEventsAsc
        .flatMap(e => (e.args.generalInfoOfEventByAddress.tvCvix1Balance > 0 ? [e.args.account] : []))
        .concat(
          Array.from(filteredUpdatedGeneralInfoOfEventByAddressMap.entries()).flatMap(([address, info]) =>
            info.tvCvix1Balance > 0 ? [address] : [],
          ),
        )
        .filter(address => filteredUpdatedGeneralInfoOfEventByAddressMap.has(address)),
    ),
    tvEventsAsc,
    vtEventsWithoutTransferAndSwapAsc,
    vtTransferAndSwapEventsAsc,
    vtEventsAsc,
    tvRequests,
    vtRequests,
    allRequests: [...tvRequests, ...vtRequests],
    tvRequestIdToSubmitEventMap: new Map(
      tvEventsAsc.flatMap(e => (e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT ? [[e.args.requestId, e]] : [])),
    ),
    vtRequestIdToSubmitEventMap: new Map(
      vtEventsAsc.flatMap(e =>
        e.type === VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT ? [[e.args.requestId, e]] : [],
      ),
    ),
    tvRequestIdToRequest: new Map(tvRequests.map(r => [r.requestId, r])),
    vtRequestIdToRequest: new Map(vtRequests.map(r => [r.requestId, r])),
    addresses: Array.from(filteredUpdatedGeneralInfoOfEventByAddressMap.keys()),
    tokensDailyPriceHistory,
    swapEventsAsc,
  }
}

export function filterEventByVolumeInUsdc<
  T extends
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
    | TvLiquidateEventDto,
>({ e, dealsWorthInUsdc, events }: { e: T; dealsWorthInUsdc: DealsWorthInUsdc; events: EventsContextType }): boolean {
  switch (e.type) {
    case TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= e.args.submitRequestTokenAmountUsdc) &&
        (dealsWorthInUsdc.toUsdc === undefined || e.args.submitRequestTokenAmountUsdc <= dealsWorthInUsdc.toUsdc)
      )
    case VtBurnEventDto.type.VT_BURN_EVENT:
    case TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= e.args.usdcAmountReceived) &&
        (dealsWorthInUsdc.toUsdc === undefined || e.args.usdcAmountReceived <= dealsWorthInUsdc.toUsdc)
      )
    case TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined ||
          dealsWorthInUsdc.fromUsdc <=
            (e.args.tokenAmountName === TokenName.USDC
              ? e.args.tokenAmount
              : e.args.tokenAmount * e.args.generalInfoOfEvent.tvCvix1PriceInUsdc)) &&
        (dealsWorthInUsdc.toUsdc === undefined ||
          (e.args.tokenAmountName === TokenName.USDC
            ? e.args.tokenAmount
            : e.args.tokenAmount * e.args.generalInfoOfEvent.tvCvix1PriceInUsdc) <= dealsWorthInUsdc.toUsdc)
      )
    case TvSubmitEventDto.type.TV_SUBMIT_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= e.args.tokenAmountInUsdc) &&
        (dealsWorthInUsdc.toUsdc === undefined || e.args.tokenAmountInUsdc <= dealsWorthInUsdc.toUsdc)
      )
    case VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined ||
          dealsWorthInUsdc.fromUsdc <= e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceInUsdc) &&
        (dealsWorthInUsdc.toUsdc === undefined ||
          e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceInUsdc <= dealsWorthInUsdc.toUsdc)
      )
    case VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT:
    case VtFulfillRequestEventDto.type.VT_FULFILL_EVENT:
      if (e.args.requestId === 0) {
        return true
      }
      const sumbitEvent = events.vtRequestIdToSubmitEventMap.get(e.args.requestId)
      if (sumbitEvent) {
        const tokensUsdc =
          sumbitEvent.args.action === SubmitRequestEventDto.action.MINT
            ? sumbitEvent.args.tokenAmountPaid
            : sumbitEvent.args.tokenAmountPaid * sumbitEvent.args.generalInfoOfEvent.vtCviPriceInUsdc
        return (
          (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= tokensUsdc) &&
          (dealsWorthInUsdc.toUsdc === undefined || tokensUsdc <= dealsWorthInUsdc.toUsdc)
        )
      }
      return false
    case VtMintEventDto.type.VT_MINT_EVENT:
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= e.args.positionedTokenAmount) &&
        (dealsWorthInUsdc.toUsdc === undefined || e.args.positionedTokenAmount <= dealsWorthInUsdc.toUsdc)
      )
    case VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT: {
      const tokensUsdc =
        e.args.action === SubmitRequestEventDto.action.MINT
          ? e.args.tokenAmountPaid
          : e.args.tokenAmountPaid * e.args.generalInfoOfEvent.vtCviPriceInUsdc
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= tokensUsdc) &&
        (dealsWorthInUsdc.toUsdc === undefined || tokensUsdc <= dealsWorthInUsdc.toUsdc)
      )
    }
    case VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT: {
      const tokensUsdc =
        e.args.tokenNameAmountIn === VtUniswapSwapEventArgsDto.tokenNameAmountIn.USDC
          ? e.args.tokenAmountIn
          : e.args.tokenAmountOut
      return (
        (dealsWorthInUsdc.fromUsdc === undefined || dealsWorthInUsdc.fromUsdc <= tokensUsdc) &&
        (dealsWorthInUsdc.toUsdc === undefined || tokensUsdc <= dealsWorthInUsdc.toUsdc)
      )
    }
  }
}

export function filterEventsArray<
  T extends
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
    | TvLiquidateEventDto,
>({
  array,
  events,
  filters,
  params,
  cviContractsInversifyService,
  newAccountsFromDateRange,
}: {
  array: T[]
  newAccountsFromDateRange?: Set<string>
  events: EventsContextType
  filters: Filters
  params: StrictParams
  cviContractsInversifyService: CviContractsInversifyService
}): T[] {
  const transactionIndexesOfChosedVtRequestIds = [
    ...new Set(
      filters.requestIds.vt.flatMap(requestId =>
        events.vtRequestIdToRequest.get(requestId)?.events.map(e => e.transactionIndex),
      ),
    ),
  ]

  const datesRange = enhanceDatesRange(filters.datesRange)

  function generalFilter(e: T): boolean {
    if (e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
      if (params.address && params.address !== e.args.fromAccount && params.address !== e.args.toAccount) {
        return false
      }

      if (
        filters.excluding.addresses.includes(e.args.fromAccount) &&
        filters.excluding.addresses.includes(e.args.toAccount)
      ) {
        return false
      }

      const fromAccountGroup = getAddressGroupAndName(e.args.fromAccount, cviContractsInversifyService).addressGroup
      const toAccountGroup = getAddressGroupAndName(e.args.toAccount, cviContractsInversifyService).addressGroup

      if (
        filters.addressGroups.length > 0 &&
        !filters.addressGroups.includes(fromAccountGroup) &&
        !filters.addressGroups.includes(toAccountGroup)
      ) {
        return false
      }

      if (
        filters.addresses.length > 0 &&
        !filters.addresses.includes(e.args.fromAccount) &&
        !filters.addresses.includes(e.args.toAccount)
      ) {
        return false
      }
    } else {
      if (params.address && params.address !== e.args.account) {
        return false
      }

      if (filters.excluding.addresses.includes(e.args.account)) {
        return false
      }

      const accountGroup = getAddressGroupAndName(e.args.account, cviContractsInversifyService).addressGroup

      if (filters.addressGroups.length > 0 && !filters.addressGroups.includes(accountGroup)) {
        return false
      }

      if (filters.addresses.length > 0 && !filters.addresses.includes(e.args.account)) {
        return false
      }
    }

    if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(e.type)) {
      return false
    }

    const isBetweenDates = datesRange.fromSeconds <= e.blockTimestamp && e.blockTimestamp <= datesRange.toSeconds

    if (!isBetweenDates) {
      return false
    }

    if (!filterEventByVolumeInUsdc({ e, events, dealsWorthInUsdc: filters.dealsWorthInUsdc })) {
      return false
    }

    if (
      e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT ||
      e.type === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT ||
      e.type === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT ||
      e.type === TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT
    ) {
      if (params.tvRequestId !== undefined && e.args.requestId !== params.tvRequestId) {
        return false
      }

      if (filters.requestIds.tv.length > 0 && !filters.requestIds.tv.includes(e.args.requestId)) {
        return false
      }
    }

    if (
      e.type === VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT ||
      e.type === VtMintEventDto.type.VT_MINT_EVENT ||
      e.type === VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT ||
      e.type === VtFulfillRequestEventDto.type.VT_FULFILL_EVENT ||
      e.type === VtBurnEventDto.type.VT_BURN_EVENT
    ) {
      if (params.vtRequestId !== undefined && e.args.requestId !== params.vtRequestId) {
        return false
      }

      if (filters.requestIds.vt.length > 0 && !filters.requestIds.vt.includes(e.args.requestId)) {
        return false
      }
    }

    if (
      (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ||
        e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) &&
      filters.requestIds.tv.length > 0 &&
      !transactionIndexesOfChosedVtRequestIds.includes(e.transactionIndex)
    ) {
      return false
    }

    if (newAccountsFromDateRange) {
      if (e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
        if (!newAccountsFromDateRange.has(e.args.fromAccount) && !newAccountsFromDateRange.has(e.args.toAccount)) {
          return false
        }
      } else {
        if (!newAccountsFromDateRange.has(e.args.account)) {
          return false
        }
      }
    }

    return true
  }

  return array.filter(generalFilter)
}

export const selectors = {
  stateSelector,
  websiteLoadingPercentageSelector,
}
