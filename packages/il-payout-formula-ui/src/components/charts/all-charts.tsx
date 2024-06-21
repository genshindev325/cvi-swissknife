import type { FC } from 'react'
import { PayoutChartBy } from './payout-chart-by-property'

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
      <PayoutChartBy min={1} max={3000} interval={10} chartName={'token1EndPriceUSD'} />
      <PayoutChartBy min={1} max={1.05} interval={0.01} chartName={'token0EndPriceUSD'} />
      <PayoutChartBy min={1} max={100} interval={1} chartName={'lpTokensWorthAtBuyTimeUSD'} />
    </div>
  )
}
