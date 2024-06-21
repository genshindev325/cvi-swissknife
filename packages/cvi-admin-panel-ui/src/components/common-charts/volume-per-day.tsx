import { VtUniswapSwapEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { sortEventsAsc } from '@coti-cvi/lw-sdk/src'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useFilteredEvents } from '../../hooks'
import { usdcToString } from '../../../../il-admin-panel-ui/src/utils'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { useDatesRange } from '../../hooks/use-dates-range'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const VolumePerDay: FC<Props> = ({}) => {
  const { tvEventsAsc } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])
  const datesRange = useDatesRange()

  const getData = useCallback(
    (events: (TvRequestsEvents | AllVtEvents)[] = []): { dateMs: number; volumeUsdc: number }[] =>
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
          dateMs: dateMs,
          volumeUsdc: vtStatisticsApi
            ? Math.floor(
                vtStatisticsApi
                  .NewVtStatisticsApi({
                    eventsAsc: eventsInSameDay
                      .flatMap(e =>
                        e.type === 'VtUniswapSwapEvent' ||
                        e.type === 'VtCviTransferEvent' ||
                        e.type === 'VtSubmitEvent' ||
                        e.type === 'VtMintEvent' ||
                        e.type === 'VtLiquidateEvent' ||
                        e.type === 'VtFulfillEvent' ||
                        e.type === 'VtBurnEvent'
                          ? [e]
                          : [],
                      )
                      .sort(sortEventsAsc),
                  })
                  .calcVolumeUsdc() +
                  new TvStatisticsApi(
                    eventsInSameDay.flatMap(e =>
                      e.type === 'TvSubmitEvent' ||
                      e.type === 'TvFulfillDepositEvent' ||
                      e.type === 'TvFulfillWithdrawEvent' ||
                      e.type === 'TvLiquidateEvent'
                        ? [e]
                        : [],
                    ),
                  ).calcVolumeUsdc(),
              )
            : 0,
        }))
        .filter(d => d.volumeUsdc > 0),
    [datesRange.durationInDays, vtStatisticsApi],
  )

  const { series, categories, totalVolume, vtTotalVolume, tvTotalVolume } = useMemo(() => {
    const tv = new Map(getData(tvStatisticsApi.allEventsAsc).map(d => [d.dateMs, d.volumeUsdc]))
    const vtDex = new Map(
      getData(
        vtStatisticsApi?.eventsAsc.flatMap(e =>
          e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
        ),
      ).map(d => [d.dateMs, d.volumeUsdc]),
    )
    const vtPlatform = new Map(
      getData(
        vtStatisticsApi?.eventsAsc.flatMap(e =>
          e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
        ),
      ).map(d => [d.dateMs, d.volumeUsdc]),
    )

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      volumes: {
        tv: tv.get(dateMs) ?? 0,
        vtDex: vtDex.get(dateMs) ?? 0,
        vtPlatform: vtPlatform.get(dateMs) ?? 0,
      },
    }))

    const series = [
      {
        name: 'Theta Vault',
        data: data.map(d => d.volumes.tv),
      },
      {
        name: 'Volatility Tokens (DEX)',
        data: data.map(d => d.volumes.vtDex),
      },
      {
        name: 'Volatility Tokens (Platform)',
        data: data.map(d => d.volumes.vtPlatform),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      totalVolume: _.sum(data.flatMap(d => Object.values(d.volumes))),
      vtTotalVolume: _.sum(data.flatMap(d => d.volumes.vtDex + d.volumes.vtPlatform)),
      tvTotalVolume: _.sum(data.flatMap(d => d.volumes.tv)),
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
          text: `$${usdcToString(totalVolume)} Volume (vt: $${usdcToString(vtTotalVolume)}, tv:$ ${usdcToString(
            tvTotalVolume,
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
            formatter: val => `$${usdcToString(val)}`,
          },
        },
      }}
    />
  )
}
