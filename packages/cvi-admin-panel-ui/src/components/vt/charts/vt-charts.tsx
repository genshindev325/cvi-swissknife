import { useMemo } from 'react'
import { LtDashboard } from './lt-chart'
import { useCommonCharts } from '../../../hooks/use-common-charts'

export const VtCharts = () => {
  const { vtCharts } = useCommonCharts()

  const buildChartFns = useMemo(
    () =>
      vtCharts
        ? [
            vtCharts.buildVolumeInUsdcChart.bind(vtCharts),
            vtCharts.buildVolumeInUsdcPrDayChart.bind(vtCharts),
            vtCharts.buildFeesPerCviIndexChart.bind(vtCharts),
            vtCharts.buildEventsCountChart.bind(vtCharts),
            vtCharts.buildMintBurnFeesChart.bind(vtCharts),
            vtCharts.buildTotalMintBurnFeesChart.bind(vtCharts),
            vtCharts.buildAccumulateeFeesByEventChart.bind(vtCharts),
            vtCharts.buildVtMintAndBurnTrendsByRequestIdChart.bind(vtCharts),
            vtCharts.buildCountOfOpenPositionsChart.bind(vtCharts),
            vtCharts.buildSumOfOwnedCvisChart.bind(vtCharts),
            vtCharts.buildAvgTotalOwnedCvisByCviIndexChart.bind(vtCharts),
            vtCharts.buildAvgWorthUsdcOfOwnedCvisByCviIndexChart.bind(vtCharts),
          ]
        : [],
    [vtCharts],
  )
  return <LtDashboard id="grid1" numberOfColumns={2} buildChartFns={buildChartFns} />
}
