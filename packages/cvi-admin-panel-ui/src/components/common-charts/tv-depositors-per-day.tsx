import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useFilteredEvents } from '../../hooks'
import { usdcToString } from '../../../../il-admin-panel-ui/src/utils'
import {
  TvSubmitEventArgsDto,
  TvSubmitEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { useDatesRange } from '../../hooks/use-dates-range'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const TvDepositorsPerDay: FC<Props> = ({}) => {
  const { tvEventsAsc, addressToGroupMap } = useFilteredEvents()
  const datesRange = useDatesRange()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[]) =>
      _.chain(events)
        .groupBy(e =>
          eventTimestampToChartsMs({
            eventTimestamp: e.blockTimestamp,
            filteredDatesRangeDurationDays: datesRange.durationInDays,
          }),
        )
        .map((eventsInSameDay, dateMs) => ({ dateMs: Number(dateMs), eventsInSameDay }))
        .value()
        .sort((a, b) => a.dateMs - b.dateMs)
        .map(({ dateMs, eventsInSameDay }) => ({
          dateMs,
          tvDepositsUsdc: Math.floor(
            new TvStatisticsApi(
              eventsInSameDay.flatMap(e =>
                e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT &&
                e.args.action === TvSubmitEventArgsDto.action.DEPOSIT
                  ? [e]
                  : [],
              ),
            ).calcVolumeUsdc(),
          ),
          tvWithrawsUsdc: Math.floor(
            new TvStatisticsApi(
              eventsInSameDay.flatMap(e =>
                e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT &&
                e.args.action === TvSubmitEventArgsDto.action.WITHDRAW
                  ? [e]
                  : [],
              ),
            ).calcVolumeUsdc(),
          ),
          addresses: Array.from(
            new Set(
              eventsInSameDay
                .flatMap(e => (e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT ? [e] : []))
                .map(e => e.args.account)
                .filter(address => addressToGroupMap.has(address)),
            ),
          ),
        })),
    [addressToGroupMap, datesRange.durationInDays],
  )

  const { series, categories, map, totalDeposits, totalWithdraws } = useMemo(() => {
    const map = new Map(getData(tvStatisticsApi.allEventsAsc).map(d => [d.dateMs, d]))

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      tvDepositsUsdc: map.get(dateMs)?.tvDepositsUsdc ?? 0,
      tvWithrawsUsdc: map.get(dateMs)?.tvWithrawsUsdc ?? 0,
    }))

    const series = [
      {
        name: 'Theta Vault Deposits',
        data: data.map(d => d.tvDepositsUsdc),
      },
      {
        name: 'Theta Vault Withraws',
        data: data.map(d => d.tvWithrawsUsdc),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      map,
      totalDeposits: _.sum(data.map(d => d.tvDepositsUsdc)),
      totalWithdraws: _.sum(data.map(d => d.tvWithrawsUsdc)),
    }
  }, [datesRange, getData, tvStatisticsApi.allEventsAsc])

  return (
    <Chart
      type="bar"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: `$ Tv Deposits (Total Deposits: $${usdcToString(totalDeposits)}, Total Withdraws: $${usdcToString(
            totalWithdraws,
          )})`,
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
          formatter: val => `$${usdcToString(Number(val))}`,
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
        stroke: {
          width: 1,
          colors: ['#fff'],
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
                  return (map.get(dateMs)?.addresses.length ?? 0).toString()
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
            text: '$ Volume',
            style: { color: 'white' },
          },
          labels: {
            style: { colors: 'white' },
            formatter: y => `$${usdcToString(y)}`,
          },
        },
        tooltip: {
          y: {
            formatter: y => `$${usdcToString(y)}`,
          },
        },
      }}
    />
  )
}
