import type { FC } from 'react'
import { useMemo } from 'react'
import type { Point, PremiumValues } from '@coti-cvi/lw-sdk'
import Chart from 'react-apexcharts'
import { useAppSelector } from '../../redux'
import uniqBy from 'lodash/uniqBy'
import range from 'lodash/range'

type Props = {}

function getY(premiumParams: PremiumValues<number>['premiumParams'], x: number): number {
  // a * (x - X0)**2 + c
  return premiumParams.A * (x - premiumParams.X0) ** 2 + premiumParams.C
}

export const PremiumParamsParabolaChartChartBy: FC<Props> = () => {
  const { chartsSeries } = useAppSelector(state => state.state)

  const now = useMemo(() => {
    const allSeries = Object.values(chartsSeries).flatMap(chartInfo => chartInfo)
    const withUniquePremiumParams = uniqBy(allSeries, serieInfo => JSON.stringify(serieInfo.premiumValues))
    return withUniquePremiumParams.map<{ name: string; data: Point[]; cviRanges: Point[] }>((serieInfo, i) => {
      const data = range(50, 200, 5).map<Point>(cvi => [cvi, getY(serieInfo.premiumValues.premiumParams, cvi)])
      return {
        name: `\
(${i + 1}) - <b>${serieInfo.selectedPairAndPeriod.pair.tokenName1}-${serieInfo.selectedPairAndPeriod.pair.tokenName2}/${
          serieInfo.selectedPairAndPeriod.period.periodSecondsFormat
        }</b>: 
(From ${serieInfo.selectedPairAndPeriod.source} - a: ${serieInfo.premiumValues.premiumParams.A.toFixed(10)};
x0: ${serieInfo.premiumValues.premiumParams.X0.toFixed(4)};
c: ${serieInfo.premiumValues.premiumParams.C.toFixed(10)})`,
        data: data,
        cviRanges: [50, 100, 195].map(cvi => [cvi, getY(serieInfo.premiumValues.premiumParams, cvi)]),
      }
    })
  }, [chartsSeries])

  return (
    <div>
      Parabola:
      <Chart
        type="line"
        height={450}
        width={'90%'}
        series={now}
        options={{
          annotations: {
            points: now.flatMap(x => x.cviRanges.map(point => ({ x: point[0], y: point[1] }))),
          },
          chart: {
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
          yaxis: {
            tickAmount: 3,
            labels: {
              formatter: val => `${val.toFixed(val >= 10 ? 0 : 2)}`,
            },
          },
        }}
      />
    </div>
  )
}
