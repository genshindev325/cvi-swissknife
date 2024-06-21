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
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const RepeatingUsersEachDay: FC<Props> = ({}) => {
  const { tvEventsAsc, addressToGroupMap } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])
  const datesRange = useDatesRange()

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[] = []) => {
      const result = _.chain(events)
        .groupBy(e =>
          eventTimestampToChartsMs({
            eventTimestamp: e.blockTimestamp,
            filteredDatesRangeDurationDays: datesRange.durationInDays,
          }),
        )
        .map((eventsInSameDay, dateMs) => ({ dateMs: Number(dateMs), eventsInSameDay }))
        .value()
        .sort((a, b) => a.dateMs - b.dateMs)
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
        .filter(r => r.activeAddressesSetInSameDateMs.size > 0)

      return result.map(d => ({
        dateMs: d.dateMs,
        repeatingAddressesSet: new Set(
          Array.from(d.activeAddressesSetInSameDateMs.values()).filter(
            address => result.filter(r => r.activeAddressesSetInSameDateMs.has(address)).length >= 2,
          ),
        ),
      }))
    },
    [addressToGroupMap, datesRange.durationInDays],
  )

  const { series, categories, data, allNewAddressesSet, tvNewUsersSet, vtNewUsersSet } = useMemo(() => {
    const tvResult = getData(tvStatisticsApi.allEventsAsc)
    const tv = new Map(tvResult.map(d => [d.dateMs, d]))
    const vtDexResult = getData(
      vtStatisticsApi?.eventsAsc.flatMap(e => (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [])),
    )
    const vtDex = new Map(vtDexResult.map(d => [d.dateMs, d]))
    const vtPlatformResult = getData(
      vtStatisticsApi?.eventsAsc.flatMap(e => (e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [])),
    )
    const vtPlatform = new Map(vtPlatformResult.map(d => [d.dateMs, d]))

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      repeatingAddressesSet: {
        tv: tv.get(dateMs)?.repeatingAddressesSet ?? new Set(),
        vtDex: vtDex.get(dateMs)?.repeatingAddressesSet ?? new Set(),
        vtPlatform: vtPlatform.get(dateMs)?.repeatingAddressesSet ?? new Set(),
      },
    }))

    const allNewAddressesSet = new Set(
      data.flatMap(d => Object.values(d.repeatingAddressesSet).flatMap(s => Array.from(s.values()))),
    )

    const series = [
      {
        name: 'Theta Vault',
        data: data.map(d => d.repeatingAddressesSet.tv.size),
      },
      {
        name: 'Volatility Tokens (DEX)',
        data: data.map(d => d.repeatingAddressesSet.vtDex.size),
      },
      {
        name: 'Volatility Tokens (Platform)',
        data: data.map(d => d.repeatingAddressesSet.vtPlatform.size),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      data,
      allNewAddressesSet,
      tvNewUsersSet: new Set(data.flatMap(d => Array.from(d.repeatingAddressesSet.tv))),
      vtNewUsersSet: new Set(
        data.flatMap(d => [
          ...Array.from(d.repeatingAddressesSet.vtDex),
          ...Array.from(d.repeatingAddressesSet.vtPlatform),
        ]),
      ),
    }
  }, [datesRange, getData, tvStatisticsApi.allEventsAsc, vtStatisticsApi?.eventsAsc])

  return (
    <Chart
      type="bar"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: `${allNewAddressesSet.size} Repeating Users (vt: ${vtNewUsersSet.size}, tv: ${tvNewUsersSet.size})`,
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
                    ...(d?.repeatingAddressesSet.tv ?? new Set()),
                    ...(d?.repeatingAddressesSet.vtDex ?? new Set()),
                    ...(d?.repeatingAddressesSet.vtPlatform ?? new Set()),
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
