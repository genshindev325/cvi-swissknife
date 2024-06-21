import type { FC } from 'react'
import Chart from 'react-apexcharts'
import { useAppSelector } from '../../redux'

type Props = {}

export const LiquidityChart: FC<Props> = ({}) => {
  const { total, free, workingCapital, now } = useAppSelector(state => state.charts.liquiditySeries)

  return (
    <div>
      <div>Liquidity Usage</div>
      <Chart
        type="line"
        height={450}
        width={'90%'}
        series={[
          {
            name: 'Total',
            data: total,
          },
          {
            name: 'Free',
            data: free,
          },
          {
            name: 'Working Capital',
            data: workingCapital,
          },
          {
            name: 'now',
            data: now,
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
            },
          },
          yaxis: {
            tickAmount: 7,
            title: {
              text: 'liquidity $',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: y => y + '$',
            },
          },
        }}
      />
    </div>
  )
}
