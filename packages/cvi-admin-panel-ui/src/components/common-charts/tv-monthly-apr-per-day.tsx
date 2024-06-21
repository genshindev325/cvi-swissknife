import { catDecimalsBase } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import type { FC } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useEvents } from '../../hooks'
import { useDatesRange } from '../../hooks/use-dates-range'

type Props = {}

export const TvMonthlyAprPerDay: FC<Props> = ({}) => {
  const events = useEvents()
  const datesRange = useDatesRange()

  const { series, categories } = useMemo(() => {
    const allEventsDesc = events.allEventsAsc.reverse()
    const data = _.range(datesRange.fromSeconds, datesRange.toSeconds, 60 * 60 * 24)
      .map(daySeconds => {
        const startOfDay = new Date(daySeconds * 1000)
        startOfDay.setHours(0, 0, 0, 0)
        return startOfDay.getTime()
      })
      .map(dayMs => {
        const lastEventInDay = allEventsDesc.find(e => {
          const startOfDay = new Date(e.blockTimestamp * 1000)
          startOfDay.setHours(0, 0, 0, 0)
          return startOfDay.getTime() === dayMs
        })
        return {
          dayMs,
          monthlyApr: lastEventInDay === undefined ? 0 : lastEventInDay.args.generalInfoOfEvent.tvAprByLast30Days,
        }
      })

    const series = [
      {
        name: 'Theta Vault Monthly APR',
        data: data.map(d => d.monthlyApr),
      },
    ]

    const categories = data.map(d => d.dayMs)

    return {
      series,
      categories,
    }
  }, [datesRange.fromSeconds, datesRange.toSeconds, events.allEventsAsc])

  return (
    <Chart
      type="bar"
      height={'100%'}
      width={'100%'}
      series={series}
      options={{
        title: {
          text: 'Tv Monthly APR %',
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40,
        },
        dataLabels: {
          enabled: false,
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
                formatter: v => (v === undefined ? '' : `${catDecimalsBase(Number(v), 2)}%`),
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
            formatter: y => `${catDecimalsBase(y, 2)}%`,
          },
        },
      }}
    />
  )
}
