import type { FC } from 'react'
import React from 'react'
import { LiquidityChart } from '../charts/liquidity-chart'
import { ProtectionsDurationsChart } from '../charts/protections-durations-chart'
import { ProtectionsLpProfitOnExpiredChart } from '../charts/protections-lp-profit-on-expired-chart'
import { ProtectionsRevenueOnExpiredChart } from '../charts/protections-lp-revenue-on-expired-chart'
import { LpRevenueVsTotalLiquidityChart } from '../charts/lp-revenue-vs-total-liquidity-chart'
import { Filters } from '../AllProtections/filters/filters'
import { ProtectionsIlPercentageChart } from '../charts/protections-il-percentage'
import { ProtectionsCostPercentageToIlPercentageChart } from '../charts/protections-cost-percentage-to-il-percentage'

type Props = { showFilters: boolean }

export const Charts: FC<Props> = ({ showFilters }) => {
  const charts = [
    <LpRevenueVsTotalLiquidityChart />,
    <LiquidityChart />,
    <ProtectionsDurationsChart />,
    <ProtectionsLpProfitOnExpiredChart />,
    <ProtectionsRevenueOnExpiredChart />,
    <ProtectionsIlPercentageChart />,
    <ProtectionsCostPercentageToIlPercentageChart />,
  ]
  return (
    <div className="flex flex-col items-center p-4">
      {showFilters && <Filters />}
      <div className="w-full px-32">
        {charts.map((c, index) => (
          <div key={index}>
            {c}
            <hr
              style={{
                color: '#fffccc',
                backgroundColor: '#fffccc',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
