import type { FC } from 'react'
import { PremiumChartBy } from './premium-chart-by-property'
import { PremiumParamsParabolaChartChartBy } from './premium-params-parabola-chart'

type Props = {}

export const AllCharts: FC<Props> = () => {
  return (
    <div>
      <hr
        style={{
          color: '#fffccc',
          backgroundColor: '#fffccc',
          marginTop: '100px',
        }}
      />
      <PremiumChartBy chartName={'lpTokensWorthAtBuyTimeUsdc'} />
      <PremiumChartBy chartName={'liquidityUsdc'} />
      <PremiumChartBy chartName={'totalLPTokensWorthAtBuyTimeUsdc'} />
      <PremiumChartBy chartName={'cvi'} />
      <PremiumChartBy chartName={'maxILProtectedPercentage'} />
      <PremiumChartBy chartName={'expectedLPTokensValueGrowth'} />
      <PremiumChartBy chartName={'premiumGrowthStart'} />
      <PremiumChartBy chartName={'premiumSlope'} />
      <PremiumParamsParabolaChartChartBy />
    </div>
  )
}
