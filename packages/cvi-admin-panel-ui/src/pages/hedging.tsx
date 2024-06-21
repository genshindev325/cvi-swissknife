import { useMemo } from 'react'
import { LtDashboard } from '../components/vt/charts/lt-chart'
import { useCommonCharts } from '../hooks/use-common-charts'

export const Hedging = () => {
  const commonCharts = useCommonCharts()

  const fn1 = useMemo(
    () =>
      [
        commonCharts.vtCharts?.buildPieAddressGroupcviBalanceGroupChart.bind(commonCharts.vtCharts),
        commonCharts.tvCharts?.buildPieAddressGroupTvCviBalanceGroupChart.bind(commonCharts.tvCharts),
      ].flatMap(f => (f ? [f] : [])),
    [commonCharts.tvCharts, commonCharts.vtCharts],
  )

  return (
    <div>
      {fn1.map((f, i) => (
        <LtDashboard key={i} id={`heding-chart-${i}`} numberOfColumns={1} buildChartFns={[f]} />
      ))}
    </div>
  )
}
