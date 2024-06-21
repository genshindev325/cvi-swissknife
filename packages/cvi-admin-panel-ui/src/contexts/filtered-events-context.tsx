import { strictObjectKeys } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createContext } from 'react'
import React from 'react'
import { filterEventsArray, flattenEvents, useAppSelector } from '../redux'
import { VtCviTransferEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { useStrictParams, useEvents } from '../hooks'
import { useDatesRange } from '../hooks/use-dates-range'
import { DatesRangeOptions } from '../redux/types'
import { defaultEventsContext } from './events-context'
import useInversify from '../hooks/use-inversify'
import type { EventsContextType } from '../types'

export const filteredEventsContext = createContext<EventsContextType>(defaultEventsContext)

export const FilteredEventsProvider: FC<PropsWithChildren<EventsContextType>> = ({ children }) => {
  const params = useStrictParams()
  const events = useEvents()
  const filters = useAppSelector(state => state.filters)
  const datesRange = useDatesRange()
  const { cviContractsInversifyService } = useInversify()

  const filteredTokensDailyPriceHistory = useMemo(() => {
    if (datesRange.option === DatesRangeOptions.All) {
      return events.tokensDailyPriceHistory
    } else {
      const clone = { ...events.tokensDailyPriceHistory }
      for (const chartName of strictObjectKeys(clone)) {
        const r = clone[chartName].x
          .map((x, i) => ({ x, y: clone[chartName].y[i] }))
          .filter(p => datesRange.fromSeconds * 1000 <= p.x && p.x <= datesRange.toSeconds * 1000)
        clone[chartName] = {
          x: r.map(p => p.x),
          y: r.map(p => p.y),
        }
      }
      return clone
    }
  }, [datesRange.fromSeconds, datesRange.option, datesRange.toSeconds, events.tokensDailyPriceHistory])

  function findNewAccountsFromDateRange(): Set<string> | undefined {
    const { onlyNewAccountsFromDateRange } = filters ?? {}

    if (!events || !onlyNewAccountsFromDateRange) {
      return undefined
    }

    const eventsFromDateRange = events.allEventsAsc.filter(
      e =>
        onlyNewAccountsFromDateRange.fromSeconds <= e.blockTimestamp &&
        e.blockTimestamp <= onlyNewAccountsFromDateRange.toSeconds,
    )

    const eventsBeforeDateRange = events.allEventsAsc.filter(
      e => e.blockTimestamp < onlyNewAccountsFromDateRange.fromSeconds,
    )

    const newAccountsBeforeDateRange = new Set<string>(
      eventsBeforeDateRange.flatMap(e =>
        e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
          ? [e.args.fromAccount, e.args.toAccount]
          : [e.args.account],
      ),
    )

    const r = new Set<string>(
      eventsFromDateRange
        .flatMap(e =>
          e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
            ? [e.args.fromAccount, e.args.toAccount]
            : [e.args.account],
        )
        .filter(account => !newAccountsBeforeDateRange.has(account)),
    )

    console.log(r.size)

    return r
  }

  const newAccountsFromDateRange = findNewAccountsFromDateRange()

  const tvEventsAsc = useMemo(
    () =>
      cviContractsInversifyService
        ? filterEventsArray({
            events,
            newAccountsFromDateRange,
            array: events.tvEventsAsc,
            filters,
            params,
            cviContractsInversifyService,
          })
        : [],
    [cviContractsInversifyService, events, filters, newAccountsFromDateRange, params],
  )

  const vtEventsAsc = useMemo(
    () =>
      cviContractsInversifyService
        ? filterEventsArray({
            events,
            newAccountsFromDateRange,
            array: events.vtEventsAsc,
            filters,
            params,
            cviContractsInversifyService,
          })
        : [],
    [cviContractsInversifyService, events, filters, newAccountsFromDateRange, params],
  )

  const result = useMemo(
    () =>
      flattenEvents({
        newAccountsFromDateRange,
        cviContractsInversifyService,
        tvEventsAsc,
        vtEventsAsc,
        tokensDailyPriceHistory: filteredTokensDailyPriceHistory,
        updatedGeneralInfoOfEventByAddressMap: events.updatedGeneralInfoOfEventByAddressMap,
        filters,
        params,
      }),
    [
      newAccountsFromDateRange,
      cviContractsInversifyService,
      tvEventsAsc,
      vtEventsAsc,
      filteredTokensDailyPriceHistory,
      events.updatedGeneralInfoOfEventByAddressMap,
      filters,
      params,
    ],
  )

  return <filteredEventsContext.Provider value={result}>{children}</filteredEventsContext.Provider>
}
