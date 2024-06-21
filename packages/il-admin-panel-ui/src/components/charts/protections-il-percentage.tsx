import type { FC } from 'react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import millify from 'millify'
import { useAppSelector } from '../../redux'
import '../../styles/globals.scss'
import type { Point } from '@coti-cvi/lw-sdk'
import { format } from 'date-fns'
import { protectionTooltipToString } from '../../utils'
import type { ProtectionIdWithInfoDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'
import { filteredWalletProtectionsSelector } from '../../redux/selectors'

type Props = {}

type Serie = {
  name: string
  color: string
  strokeColor: string
  data: Point[]
}

export const ProtectionsIlPercentageChart: FC<Props> = () => {
  const filteredWalletsProtections = useAppSelector(filteredWalletProtectionsSelector)

  const series = useMemo<Serie[]>(() => {
    const gerProtectionColor = (protection: ProtectionIdWithInfoDto) =>
      protection.protectionInfo.expiredEvent ? '#E9967A' : '#6495ED'
    return filteredWalletsProtections.flatMap(w =>
      w.protections.map<Serie>(p => ({
        name: p.protectionId,
        color: gerProtectionColor(p),
        strokeColor: p.protectionInfo.status.withoutMinPayout.lpRevenueUsdc > 0 ? 'green' : 'red',
        data: [[p.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000, p.protectionInfo.status.ilPercentage]],
      })),
    )
  }, [filteredWalletsProtections])

  return (
    <div>
      <div>Protections IL %</div>
      <Chart
        type={'scatter'}
        height={450}
        width={'90%'}
        series={series}
        options={{
          colors: series.map(s => s.color),
          stroke: {
            width: 1,
          },
          markers: {
            strokeColors: series.map(s => s.strokeColor),
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
              text: 'End Protection Date',
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
              text: 'Profit %',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: y => millify(y) + '%',
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
                if (filteredWalletsProtections.length === 0 || series[seriesIndex].name === 'now') {
                  return ''
                }
                const protection = filteredWalletsProtections
                  .flatMap(p => p.protections)
                  .find(p => p.protectionId === series[seriesIndex].name)?.protectionInfo

                if (!protection) {
                  throw new Error(`can't be here`)
                }

                return protectionTooltipToString(protection)
              },
            },
          },
        }}
      />
    </div>
  )
}
