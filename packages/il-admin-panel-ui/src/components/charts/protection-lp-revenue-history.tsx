import type { FC } from 'react'
import Chart from 'react-apexcharts'
import '../../styles/globals.scss'
import type { Point } from '@coti-cvi/lw-sdk'
import { format } from 'date-fns'
import type { ProtectionDuePayoutPointsDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'
import { usdcToString } from '../../utils'

type Serie = {
  name: string
  color: string
  data: Point[]
}

type Props = {
  protectionHistoricalData?: ProtectionDuePayoutPointsDto
}

export const ProtectionLpRevenuHistoryChart: FC<Props> = ({ protectionHistoricalData }) => {
  const serie1: Serie = {
    name: `$ LP Revenue`,
    color: '#00FFFF',
    data: protectionHistoricalData
      ? protectionHistoricalData.protectionDuePayoutsInfo.points.map(point => [
          point.protectionStatus.blockTimestamp * 1000,
          point.protectionStatus.withoutMinPayout.lpRevenueUsdc,
        ])
      : [],
  }

  const series = [serie1]

  return (
    <div className="w-full">
      <div>$ LP Revenue Of Protection</div>
      <Chart
        type={'line'}
        height={450}
        width={'90%'}
        series={series}
        options={{
          stroke: {
            colors: series.map(s => s.color),
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
            type: 'datetime',
            tickAmount: 10,
            title: {
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: ms => format(new Date(Number(ms)), 'dd/MM HH:mm'),
            },
          },
          yaxis: {
            tickAmount: 7,
            title: {
              text: '$ LP Revenue',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: y => '$' + usdcToString(y),
            },
          },
        }}
      />
    </div>
  )
}
