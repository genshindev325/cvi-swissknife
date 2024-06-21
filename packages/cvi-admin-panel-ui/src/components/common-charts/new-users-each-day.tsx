import {
  VtCviTransferEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk/src'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useEvents, useFilteredEvents } from '../../hooks'
import { useDatesRange } from '../../hooks/use-dates-range'
import useInversify from '../../hooks/use-inversify'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const NewUsersEachDay: FC<Props> = ({}) => {
  const { allEventsAsc } = useEvents()
  const { tvEventsAsc, newAccountsFromDateRange, addressToGroupMap } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])
  const datesRange = useDatesRange()
  const { cviContractsInversifyService } = useInversify()

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[] = [], allUsersUntilStartOfDatesRange: Set<string> = new Set()) => {
      return _.chain(events)
        .groupBy(e =>
          eventTimestampToChartsMs({
            eventTimestamp: e.blockTimestamp,
            filteredDatesRangeDurationDays: datesRange.durationInDays,
          }),
        )
        .map((eventsInSameDay, dateMs) => ({ dateMs: Number(dateMs), eventsInSameDay }))
        .value()
        .sort((a, b) => a.dateMs - b.dateMs)
        .reduce(
          ({ data, addressesSeenSoFar }, { dateMs, eventsInSameDay }) => {
            const newAddressesSet = new Set(
              eventsInSameDay
                .flatMap(e =>
                  e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
                    ? [e.args.fromAccount, e.args.toAccount]
                    : [e.args.account],
                )
                .filter(
                  account =>
                    addressToGroupMap.has(account) &&
                    !addressesSeenSoFar.has(account) &&
                    !allUsersUntilStartOfDatesRange.has(account),
                ),
            )
            return {
              data: data.concat([
                {
                  dateMs: dateMs,
                  numberOfNewUsers: newAddressesSet.size,
                  newAddressesSet,
                },
              ]),
              addressesSeenSoFar: new Set([...addressesSeenSoFar, ...newAddressesSet]),
            }
          },
          {
            data: [] as { dateMs: number; numberOfNewUsers: number; newAddressesSet: Set<string> }[],
            addressesSeenSoFar: new Set<string>(),
          },
        ).data
    },
    [addressToGroupMap, datesRange.durationInDays],
  )

  const { series, categories, data, allNewAddressesSet, tvNewUsersSet, vtNewUsersSet } = useMemo(() => {
    const allUsersUntilStartOfDatesRange = new Set(
      allEventsAsc
        .filter(e => e.blockTimestamp < datesRange.fromSeconds)
        .flatMap(e =>
          e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
            ? [e.args.fromAccount, e.args.toAccount]
            : [e.args.account],
        ),
    )

    const tvResult = getData(tvStatisticsApi.allEventsAsc, allUsersUntilStartOfDatesRange)
    const tv = new Map(tvResult.map(d => [d.dateMs, d]))
    const vtDexResult = getData(
      vtStatisticsApi?.eventsAsc.flatMap(e => (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [])),
      allUsersUntilStartOfDatesRange,
    )
    const vtDex = new Map(vtDexResult?.map(d => [d.dateMs, d]) ?? [])
    const vtPlatformResult = getData(
      vtStatisticsApi?.eventsAsc.flatMap(e => (e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [])),
      allUsersUntilStartOfDatesRange,
    )
    const vtPlatform = new Map(vtPlatformResult.map(d => [d.dateMs, d]))

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      newAddressesSet: {
        tv: tv.get(dateMs)?.newAddressesSet ?? new Set(),
        vtDex: vtDex.get(dateMs)?.newAddressesSet ?? new Set(),
        vtPlatform: vtPlatform.get(dateMs)?.newAddressesSet ?? new Set(),
      },
    }))

    console.log(
      'stav20',
      data.map(
        r =>
          `${new Date(r.dateMs).toISOString()} - ${
            new Set(Object.values(r.newAddressesSet).flatMap(s => Array.from(s.values()))).size
          }`,
      ),
    )

    const allNewAddressesSet = new Set(
      data.flatMap(d => Object.values(d.newAddressesSet).flatMap(s => Array.from(s.values()))),
    )

    if (newAccountsFromDateRange && cviContractsInversifyService) {
      console.log(
        'stav10',
        allNewAddressesSet.size,
        newAccountsFromDateRange.size,
        Array.from(allNewAddressesSet)
          .filter(a => !newAccountsFromDateRange.has(a))
          .map(a => `${a} - ${JSON.stringify(getAddressGroupAndName(a, cviContractsInversifyService))}`),
      )
    }

    const series = [
      {
        name: 'Theta Vault',
        data: data.map(d => d.newAddressesSet.tv.size),
      },
      {
        name: 'Volatility Tokens (DEX)',
        data: data.map(d => d.newAddressesSet.vtDex.size),
      },
      {
        name: 'Volatility Tokens (Platform)',
        data: data.map(d => d.newAddressesSet.vtPlatform.size),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      data,
      allNewAddressesSet,
      tvNewUsersSet: new Set(data.flatMap(d => Array.from(d.newAddressesSet.tv))),
      vtNewUsersSet: new Set(
        data.flatMap(d => [...Array.from(d.newAddressesSet.vtDex), ...Array.from(d.newAddressesSet.vtPlatform)]),
      ),
    }
  }, [
    allEventsAsc,
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
          text: `${allNewAddressesSet.size} New Users (vt: ${vtNewUsersSet.size}, tv: ${tvNewUsersSet.size})`,
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
                  const dateMs = categories[options.dataPointIndex]
                  const d = data.find(d1 => d1.dateMs === dateMs)
                  return new Set([
                    ...(d?.newAddressesSet.tv ?? new Set()),
                    ...(d?.newAddressesSet.vtDex ?? new Set()),
                    ...(d?.newAddressesSet.vtPlatform ?? new Set()),
                  ]).size.toString()
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
            text: 'Users',
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
