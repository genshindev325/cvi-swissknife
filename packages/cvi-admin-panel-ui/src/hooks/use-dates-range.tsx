import { formatDate, cviTradingCompetitionDates } from '@coti-cvi/lw-sdk/src'
import { useMemo } from 'react'
import { useAppSelector } from '../redux'
import type { DateRange } from '../redux/types'
import { DatesRangeOptions } from '../redux/types'

export type EnhancedDatesRange = {
  option: DatesRangeOptions
  fromSeconds: number
  toSeconds: number
  fromSecondsFormatted: string
  toSecondsFormatted: string
  durationInDays: number
  isEndsNow: boolean
}

export function enhanceDatesRange(datesRange: DateRange): EnhancedDatesRange {
  const maxToSeconds = Math.floor(Date.now() / 1000)
  let fromSeconds: number
  let toSeconds: number
  let isEndsNow: boolean
  switch (datesRange.option) {
    case DatesRangeOptions.Custom:
      fromSeconds = datesRange.fromSeconds
      toSeconds = datesRange.toSeconds
      isEndsNow = Math.abs(maxToSeconds - toSeconds) < 60
      break
    case DatesRangeOptions.All:
      fromSeconds = 1665486836 // ~ first ever event of CVI V3
      toSeconds = maxToSeconds
      isEndsNow = true
      break
    case DatesRangeOptions.TradingCompetition1:
      fromSeconds = cviTradingCompetitionDates.currentCompetition.fromTimestamp
      toSeconds = cviTradingCompetitionDates.currentCompetition.toTimestamp
      isEndsNow = Math.abs(maxToSeconds - toSeconds) < 60
      break
    case DatesRangeOptions.Last24Hours:
      fromSeconds = maxToSeconds - 60 * 60 * 24
      toSeconds = maxToSeconds
      isEndsNow = true
      break
    case DatesRangeOptions.Last3Days:
      fromSeconds = maxToSeconds - 60 * 60 * 24 * 3
      toSeconds = maxToSeconds
      isEndsNow = true
      break
    case DatesRangeOptions.LastWeek:
      fromSeconds = maxToSeconds - 60 * 60 * 24 * 7
      toSeconds = maxToSeconds
      isEndsNow = true
      break
    case DatesRangeOptions.LastMonth:
      fromSeconds = maxToSeconds - 60 * 60 * 24 * 30
      toSeconds = maxToSeconds
      isEndsNow = true
      break
  }

  return {
    ...datesRange,
    fromSeconds,
    toSeconds,
    fromSecondsFormatted: formatDate(fromSeconds),
    toSecondsFormatted: formatDate(toSeconds),
    durationInDays: (toSeconds - fromSeconds) / (60 * 60 * 24),
    isEndsNow,
  }
}
export function useDatesRange(): EnhancedDatesRange {
  const datesRange = useAppSelector(state => state.filters.datesRange)

  return useMemo(() => enhanceDatesRange(datesRange), [datesRange])
}
