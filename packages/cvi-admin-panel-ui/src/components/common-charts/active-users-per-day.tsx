import {
  VtCviTransferEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useFilteredEvents } from '../../hooks'
import { useDatesRange } from '../../hooks/use-dates-range'
import useInversify from '../../hooks/use-inversify'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const ActiveUsersPerDay: FC<Props> = ({}) => {
  const { tvEventsAsc, addressToGroupMap, newAccountsFromDateRange } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])
  const datesRange = useDatesRange()
  const { cviContractsInversifyService } = useInversify()

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[] = []) =>
      _.chain(events)
        .groupBy(e =>
          eventTimestampToChartsMs({
            eventTimestamp: e.blockTimestamp,
            filteredDatesRangeDurationDays: datesRange.durationInDays,
          }),
        )
        .map((eventsInSameDay, date) => ({ date: Number(date), eventsInSameDay }))
        .value()
        .sort((a, b) => a.date - b.date)
        .map(({ date, eventsInSameDay }) => {
          return {
            date: date,
            users: new Set(
              eventsInSameDay
                .flatMap(e =>
                  e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
                    ? [e.args.fromAccount, e.args.toAccount]
                    : [e.args.account],
                )
                .filter(address => addressToGroupMap.has(address)),
            ),
          }
        }),
    [addressToGroupMap, datesRange.durationInDays],
  )

  const { series, categories, allUsersSet, tvUsersSet, vtUsersSet } = useMemo(() => {
    const tv = new Map(getData(tvStatisticsApi.allEventsAsc).map(d => [d.date, d.users]))
    const vtDex = new Map(
      getData(
        vtStatisticsApi?.eventsAsc.flatMap(e =>
          e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
        ),
      ).map(d => [d.date, d.users]),
    )
    const vtPlatform = new Map(
      getData(
        vtStatisticsApi?.eventsAsc.flatMap(e =>
          e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
        ),
      ).map(d => [d.date, d.users]),
    )

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      users: {
        tv: tv.get(dateMs) ?? new Set(),
        vtDex: vtDex.get(dateMs) ?? new Set(),
        vtPlatform: vtPlatform.get(dateMs) ?? new Set(),
      },
    }))

    if (newAccountsFromDateRange && cviContractsInversifyService) {
      console.log(
        'stav30-active',
        newAccountsFromDateRange.size,
        data.map(
          a =>
            `${new Date(a.dateMs).toISOString()} - ${_.uniq([...a.users.tv, ...a.users.vtDex, ...a.users.vtPlatform])}`,
        ),
      )
    }

    const series = [
      {
        name: 'Theta Vault',
        data: data.map(d => d.users.tv.size),
      },
      {
        name: 'Volatility Tokens (DEX)',
        data: data.map(d => d.users.vtDex.size),
      },
      {
        name: 'Volatility Tokens (Platform)',
        data: data.map(d => d.users.vtPlatform.size),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      allUsersSet: new Set(data.flatMap(d => Object.values(d.users).flatMap(s => Array.from(s.values())))),
      tvUsersSet: new Set(data.flatMap(d => Array.from(d.users.tv))),
      vtUsersSet: new Set(data.flatMap(d => [...Array.from(d.users.vtDex), ...Array.from(d.users.vtPlatform)])),
    }
  }, [
    cviContractsInversifyService,
    datesRange,
    getData,
    newAccountsFromDateRange,
    tvStatisticsApi.allEventsAsc,
    vtStatisticsApi?.eventsAsc,
  ])

  return (
    <Chart
      type="bar"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: `${allUsersSet.size} Active Users (vt: ${vtUsersSet.size}, tv: ${tvUsersSet.size})`,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40,
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '12px',
            colors: ['white'],
          },
        },
        chart: {
          stacked: true,
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
        plotOptions: {
          bar: {
            dataLabels: {
              // @ts-ignore
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900,
                  color: 'white',
                },
                formatter: (val, options: { serieIndex: number; dataPointIndex: number }) => {
                  const dayMs = categories[options.dataPointIndex]
                  const dataInDayMs = [...(vtStatisticsApi?.eventsAsc ?? []), ...tvStatisticsApi.allEventsAsc].filter(
                    e => {
                      return (
                        eventTimestampToChartsMs({
                          eventTimestamp: e.blockTimestamp,
                          filteredDatesRangeDurationDays: datesRange.durationInDays,
                        }) === dayMs
                      )
                    },
                  )
                  const total = new Set(
                    dataInDayMs.flatMap(e =>
                      e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
                        ? [e.args.fromAccount, e.args.toAccount]
                        : [e.args.account],
                    ),
                  )
                  return total.size.toString()
                },
              },
            },
          },
        },
        xaxis: {
          type: 'datetime',
          categories,

          title: { style: { color: 'white' } },
          labels: {
            style: { colors: 'white' },
          },
        },
        yaxis: {
          title: {
            text: 'Accounts',
            style: { color: 'white' },
          },
          labels: {
            style: { colors: 'white' },
            formatter: y => y.toString(),
          },
        },
      }}
    />
  )
}
