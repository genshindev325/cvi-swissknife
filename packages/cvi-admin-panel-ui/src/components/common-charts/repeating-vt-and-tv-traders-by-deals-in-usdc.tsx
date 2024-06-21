import { VtCviTransferEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useEvents, useFilteredEvents } from '../../hooks'
import { useDatesRange } from '../../hooks/use-dates-range'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { filterEventByVolumeInUsdc } from '../../redux'
import type { DealsWorthInUsdc } from '../../redux/types'
import { eventTimestampToChartsMs } from '../../utils'

type Props = {
  dealsWorthInUsdc: DealsWorthInUsdc
  chartTitle: string
}

export const RepeatingUsersByDealsInUsdc: FC<Props> = ({ dealsWorthInUsdc, chartTitle }) => {
  const allEvents = useEvents()
  const { tvEventsAsc, addressToGroupMap } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])
  const datesRange = useDatesRange()

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[] = []) => {
      const addressesEachDayMs = _.chain(events)
        .filter(e => filterEventByVolumeInUsdc({ e, dealsWorthInUsdc, events: allEvents }))
        .groupBy(e =>
          eventTimestampToChartsMs({
            eventTimestamp: e.blockTimestamp,
            filteredDatesRangeDurationDays: datesRange.durationInDays,
          }),
        )
        .map((eventsInSameDay, dateMs) => ({ dateMs: Number(dateMs), eventsInSameDay }))
        .map(({ dateMs, eventsInSameDay }) => {
          const activeAddressesSetInSameDateMs = new Set(
            eventsInSameDay
              .flatMap(e =>
                e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
                  ? [e.args.fromAccount, e.args.toAccount]
                  : [e.args.account],
              )
              .filter(address => addressToGroupMap.has(address)),
          )
          return {
            dateMs,
            activeAddressesSetInSameDateMs,
          }
        })
        .flatMap(({ dateMs, activeAddressesSetInSameDateMs }) =>
          Array.from(activeAddressesSetInSameDateMs).map(address => ({ dateMs, address })),
        )
        .groupBy(r => r.address)
        .map((numberOfOperationsInDifferentDays, address) => ({
          address,
          numberOfOperationsInDifferentDays: numberOfOperationsInDifferentDays.length,
        }))
        .value()

      type NumberOfOperationsInDifferentDays = number
      type NumberOfAddresses = number

      const results = new Map<NumberOfOperationsInDifferentDays, NumberOfAddresses>()

      for (const { numberOfOperationsInDifferentDays } of addressesEachDayMs) {
        results.set(numberOfOperationsInDifferentDays, (results.get(numberOfOperationsInDifferentDays) ?? 0) + 1)
      }

      return Array.from(results.entries()).map(([numberOfOperationsInDifferentDays, numberOfAddresses]) => ({
        numberOfOperationsInDifferentDays,
        numberOfAddresses,
      }))
    },
    [addressToGroupMap, allEvents, datesRange.durationInDays, dealsWorthInUsdc],
  )

  const { series, data } = useMemo(() => {
    const tv = getData(tvStatisticsApi?.allEventsAsc)
    const vt = getData(vtStatisticsApi?.eventsAsc)

    const series = [
      {
        name: 'Theta Vault',
        data: tv.map(d => [d.numberOfAddresses, d.numberOfOperationsInDifferentDays]),
      },
      {
        name: 'Volatility Tokens (Platform + DEX)',
        data: vt.map(d => [d.numberOfAddresses, d.numberOfOperationsInDifferentDays]),
      },
    ]

    return {
      series,
      data: { vt, tv },
    }
  }, [getData, tvStatisticsApi?.allEventsAsc, vtStatisticsApi?.eventsAsc])

  return (
    <Chart
      type="scatter"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: chartTitle,
        },
        stroke: {
          width: 1,
        },
        chart: {
          foreColor: 'white',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: true,
          },
          animations: {
            enabled: false,
          },
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
            autoSelected: 'zoom',
          },
        },
        xaxis: {
          title: {
            text: 'Number Of Users',
            style: { color: 'white' },
          },
          labels: {
            style: { colors: 'white' },
          },
        },
        yaxis: {
          tickAmount: 7,
          title: {
            text: 'Number of Operations',
            style: { color: 'white' },
          },
          labels: {
            style: { colors: 'white' },
          },
        },
      }}
    />
  )
}
