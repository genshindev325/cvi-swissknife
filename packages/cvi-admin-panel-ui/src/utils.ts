import type { AllTvEvents, AllVtEvents } from '@coti-cvi/lw-sdk/src'
import { catDecimalsBase } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { EnhancedDatesRange } from './hooks/use-dates-range'
import {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import type { VtRequest, TvRequest } from './types'
import millify from 'millify'

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

export function diffTimeFromNow({ dateMs, nowMs }: { dateMs: number; nowMs: number }) {
  return timeAgo.format(new Date(dateMs), undefined, {
    now: nowMs,
  })
}

export function usdcToString(usdc: number): string {
  if (-10 < usdc && usdc < 10) {
    return catDecimalsBase(usdc, 6)
  }
  return millify(usdc)
}

export function getStatusOfVtRequest(request: VtRequest) {
  if (request.events.some(e => e.type === VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT)) {
    return VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT
  }
  if (request.events.some(e => e.type === VtBurnEventDto.type.VT_BURN_EVENT)) {
    return VtBurnEventDto.type.VT_BURN_EVENT
  }
  if (request.events.some(e => e.type === VtMintEventDto.type.VT_MINT_EVENT)) {
    return VtMintEventDto.type.VT_MINT_EVENT
  }
  return VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT
}

export function getStatusOfTvRequest(request: TvRequest) {
  if (request.events.some(e => e.type === TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT)) {
    return TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT
  }
  if (request.events.some(e => e.type === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT)) {
    return TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT
  }
  if (request.events.some(e => e.type === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT)) {
    return TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT
  }
  return TvSubmitEventDto.type.TV_SUBMIT_EVENT
}

export function getStatusOfRequest(request: VtRequest | TvRequest) {
  return request.resource === 'tv' ? getStatusOfTvRequest(request) : getStatusOfVtRequest(request)
}

export const calculateTvPnl = (eventsAsc: (AllTvEvents | AllVtEvents)[]) => {
  if (eventsAsc.length > 0) {
    const start = eventsAsc[0].args.generalInfoOfEvent.tvInfo.tvPlatformPnl || 1
    const end = eventsAsc[eventsAsc.length - 1].args.generalInfoOfEvent.tvInfo.tvPlatformPnl
    return ((end - start) * 100) / start
  } else {
    return 0
  }
}

export function timestampToStartOfDayMs(timestamp: number) {
  const startOfDay = new Date(timestamp * 1000)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay.getTime()
}

export function timestampToStartOfWeekMs(timestamp: number) {
  const date = new Date(timestamp * 1000)

  date.setHours(0, 0, 0, 0)

  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)

  return new Date(date.setDate(diff)).getTime()
}

export function eventTimestampToChartsMs({
  eventTimestamp,
  filteredDatesRangeDurationDays,
}: {
  eventTimestamp: number
  filteredDatesRangeDurationDays: number
}): number {
  return filteredDatesRangeDurationDays < 35
    ? timestampToStartOfDayMs(eventTimestamp)
    : timestampToStartOfWeekMs(eventTimestamp)
}

export function getDatesRangeForChartsInMs(datesRange: EnhancedDatesRange): number[] {
  return _.uniq(
    _.range(datesRange.fromSeconds, datesRange.toSeconds, 60 * 60).map(daySeconds =>
      eventTimestampToChartsMs({
        eventTimestamp: daySeconds,
        filteredDatesRangeDurationDays: datesRange.durationInDays,
      }),
    ),
  )
}
