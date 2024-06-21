import type { FC } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import type { Point } from '@coti-cvi/lw-sdk'
import { useAppSelector } from '../../redux'
import millify from 'millify'
import { format } from 'date-fns'

type Props = {}

export const LpRevenueVsTotalLiquidityChart: FC<Props> = ({}) => {
  const { total } = useAppSelector(state => state.charts['lp revenue % liquidity'])

  const t = useMemo(() => total.map<Point>(t => [t.timeMs, Number(t['lp revenue % liquidity'].toFixed(2))]), [total])

  const nowData = useMemo<Point[]>(
    () =>
      t.length === 0
        ? []
        : [
            [Date.now(), Math.min(...t.map(p => p[1]))],
            [Date.now(), Math.max(...t.map(p => p[1]))],
          ],
    [t],
  )

  return (
    <div>
      <div>LP Revenue % Total Liquidity</div>
      <Chart
        type="line"
        height={450}
        width={'90%'}
        series={[
          {
            name: 'lp revenue % total liquidity',
            data: t,
          },
          {
            name: 'now',
            color: '#40E0D0',
            data: nowData,
          },
        ]}
        options={{
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
            type: 'datetime',
            tickAmount: 10,
            title: { style: { color: 'white' } },
            labels: {
              style: { colors: 'white' },
              formatter: x => {
                if (x) {
                  return format(Number(x), 'dd/MM/yy')
                }
                return ''
              },
            },
          },
          yaxis: {
            tickAmount: 7,
            title: {
              text: 'LP Revenue % Liquidity',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: y => {
                if (y) {
                  return `${y.toFixed(2)}%`
                }
                return ''
              },
            },
          },
          tooltip: {
            y: {
              formatter: (
                val: number,
                {
                  dataPointIndex,
                  series: onlyXValuesArray,
                  seriesIndex,
                }: { dataPointIndex: number; series: number[]; seriesIndex: number },
              ) => {
                if (total.length === 0) {
                  return ''
                }
                const data = total[dataPointIndex]
                const isLast = dataPointIndex === total.length - 1
                return `${data['lp revenue % liquidity'].toFixed(2)}% - ${
                  isLast ? 'Total' : data.timeMs < Date.now() ? 'Expired' : 'Expired+Some_Active'
                }-LP_Revenue: $${millify(data.lpRevenueUsdc)}, ${
                  data.timeMs < Date.now() ? 'Past' : 'Future'
                }_Liquidity: $${millify(data.liquidity)} (${format(data.timeMs, 'dd/MM/yy HH:mm:ss')})`
              },
            },
          },
        }}
      />
    </div>
  )
}
