import type { AllVtEvents, TvRequestsEvents } from '@coti-cvi/lw-sdk/src'
import { sortEventsAsc } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useFilteredEvents } from '../../hooks'
import { usdcToString } from '../../../../il-admin-panel-ui/src/utils'
import {
  SubmitRequestEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventArgsDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { useDatesRange } from '../../hooks/use-dates-range'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { eventTimestampToChartsMs, getDatesRangeForChartsInMs } from '../../utils'

type Props = {}

export const VtTradersPerDay: FC<Props> = ({}) => {
  const { vtEventsAsc, addressToGroupMap } = useFilteredEvents()
  const datesRange = useDatesRange()
  const vtStatisticsApi = useVtStatisticsApi()

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
        .map(({ dateMs, eventsInSameDay }) => {
          const vtMintOrBuy = eventsInSameDay.flatMap(e =>
            (e.type === VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT &&
              e.args.action === SubmitRequestEventDto.action.MINT) ||
            (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT &&
              e.args.tokenNameAmountOut === VtUniswapSwapEventArgsDto.tokenNameAmountOut.CVI)
              ? [e]
              : [],
          )
          const vtBurnOrSell = eventsInSameDay.flatMap(e =>
            (e.type === VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT &&
              e.args.action === SubmitRequestEventDto.action.BURN) ||
            (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT &&
              e.args.tokenNameAmountIn === VtUniswapSwapEventArgsDto.tokenNameAmountIn.CVI)
              ? [e]
              : [],
          )
          return {
            dateMs: dateMs,
            vtMintOrBuyUsdc: Math.floor(
              vtStatisticsApi
                ?.NewVtStatisticsApi({
                  eventsAsc: vtMintOrBuy.sort(sortEventsAsc),
                })
                .calcVolumeUsdc() ?? 0,
            ),
            vtBurnOrSellUsdc: Math.floor(
              vtStatisticsApi
                ?.NewVtStatisticsApi({
                  eventsAsc: vtBurnOrSell.sort(sortEventsAsc),
                })
                .calcVolumeUsdc() ?? 0,
            ),
            addresses: Array.from(new Set([...vtMintOrBuy, ...vtBurnOrSell].map(e => e.args.account))).filter(address =>
              addressToGroupMap.has(address),
            ),
          }
        }),
    [addressToGroupMap, datesRange.durationInDays, vtStatisticsApi],
  )

  const { series, categories, map, totalMintOrBuy, totalBurnOrSell } = useMemo(() => {
    const map = new Map(getData(vtEventsAsc).map(d => [d.dateMs, d]))

    const data = getDatesRangeForChartsInMs(datesRange).map(dateMs => ({
      dateMs,
      vtMintOrBuyUsdc: map.get(dateMs)?.vtMintOrBuyUsdc ?? 0,
      vtBurnOrSellUsdc: map.get(dateMs)?.vtBurnOrSellUsdc ?? 0,
    }))

    const series = [
      {
        name: 'Vt Mint/Buy',
        data: data.map(d => d.vtMintOrBuyUsdc),
      },
      {
        name: 'Vt Burn/Sell',
        data: data.map(d => d.vtBurnOrSellUsdc),
      },
    ]

    const categories = data.map(d => d.dateMs)

    return {
      series,
      categories,
      map,
      totalMintOrBuy: _.sum(data.map(d => d.vtMintOrBuyUsdc)),
      totalBurnOrSell: _.sum(data.map(d => d.vtBurnOrSellUsdc)),
    }
  }, [datesRange, getData, vtEventsAsc])

  return (
    <Chart
      type="bar"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: `$ Vt Traders (Total Mint/Buy: $${usdcToString(totalMintOrBuy)}, Total Burn/Sell: $${usdcToString(
            totalBurnOrSell,
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
