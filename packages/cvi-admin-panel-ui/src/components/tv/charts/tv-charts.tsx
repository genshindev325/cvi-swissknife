import { useMemo } from 'react'
import { useCommonCharts } from '../../../hooks/use-common-charts'
import { LtDashboard } from '../../vt/charts/lt-chart'

export const TvCharts = () => {
  const { tvCharts, vtCharts } = useCommonCharts()

  const buildChartFns1 = useMemo(
    () =>
      tvCharts
        ? [
            tvCharts.buildTvLiquidityPieChart.bind(tvCharts),
            tvCharts.buildTvCurrentDepositsUsdcChart.bind(tvCharts),
            tvCharts.buildVolumeInUsdcChart.bind(tvCharts),
            tvCharts.buildVolumeInUsdcPrDayChart.bind(tvCharts),
            tvCharts.buildTvLockedUsdcChart.bind(tvCharts),
            tvCharts.buildTvLockedPercentageChart.bind(tvCharts),
          ]
        : [],
    [tvCharts],
  )

  const buildChartFns2 = useMemo(
    () =>
      tvCharts && vtCharts
        ? [
            tvCharts.buildTvCollateralPercentageChart.bind(tvCharts),
            tvCharts.buildTvUtilizationPercentageChart.bind(tvCharts),
            tvCharts.buildTvPnlChart.bind(tvCharts),
            tvCharts.buildTvPriceUsdChart.bind(tvCharts),
            tvCharts.buildVtAmountInDexChart.bind(tvCharts),
            tvCharts.buildTvPlatformDexLiquidityUsdChart.bind(tvCharts),
            tvCharts.buildTvPlatformDexLiquidityPercentageChart.bind(tvCharts),
            tvCharts.buildTvPositionBalanceOfVolatilityTokensChart.bind(tvCharts),
            tvCharts.buildEventsCountChart.bind(tvCharts),
            tvCharts.buildTvVtTrendsByRequestIdtsChart.bind(tvCharts),
            tvCharts.buildTvDepositsAndWithdrawTrendsByRequestIdChart.bind(tvCharts),
            vtCharts.buildVtMintAndBurnTrendsByRequestIdChart.bind(tvCharts),
            tvCharts.buildTvDepositsAccodringToCviIndexChart.bind(tvCharts),
            tvCharts.buildTvWithdrawsAccodringToCviIndexChart.bind(tvCharts),
            tvCharts.buildCountOfOpenTvPositionsChart.bind(tvCharts),
            tvCharts.buildSumOfOwnedTvCvisChart.bind(tvCharts),
            tvCharts.buildWorthOfOpenTvPositionsInUsdcChart.bind(tvCharts),
            tvCharts.buildAvgTotalOwnedTvCvisByCviIndexChart.bind(tvCharts),
            tvCharts.buildAvgWorthUsdcOfOwnedTvCvisByCviIndexChart.bind(tvCharts),
          ]
        : [],
    [tvCharts, vtCharts],
  )

  return (
    <>
      <LtDashboard id="grid1" numberOfColumns={2} buildChartFns={buildChartFns1} />
      <LtDashboard id="grid2" numberOfColumns={2} buildChartFns={buildChartFns2} />
    </>
  )
}
