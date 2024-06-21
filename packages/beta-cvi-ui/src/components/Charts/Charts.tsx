import React, { useState } from 'react'

import CviTitleInfo from '../CviTitleInfo'
import Tabs from '../Tabs/Tabs'

import { useLocation } from 'react-router-dom'
import { VolatilityTokensChartsTabsPaths, WebSite } from 'beta-cvi-ui/src/types/common.types'
import FubdingFeeChart from './FundingFeeChart'

import TradingViewChart from './TradingView/TradingViewChart'
import { useAppSelector } from 'beta-cvi-ui/src/redux'

export const graphTimeRanges = {
  one_day: { name: '24h', inSecond: 86400 + 3600 },
  one_week: { name: '1w', inSecond: 604800 + 3600 },
  one_month: { name: '1m', inSecond: 2630000 },
  three_month: { name: '3m', inSecond: 7890000 },
  six_month: { name: '6m', inSecond: 15780000 },
  one_year: { name: '1y', inSecond: 31536000 + 3600 },
  two_year: { name: '2y', inSecond: 63072000 },
  all_time: { name: 'all', inSecond: 0 },
} as const
export const typeOfCvi = {
  cvi: { name: 'cvi' },
} as const

const Charts = () => {
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const [selectedCvi, setSelectedCvi] = useState<keyof typeof typeOfCvi>('cvi')

  const location = useLocation()

  let chartsActiveTab = VolatilityTokensChartsTabsPaths['trading-view']
  chartsActiveTab = location.hash.includes(VolatilityTokensChartsTabsPaths['funding-fee'])
    ? VolatilityTokensChartsTabsPaths['funding-fee']
    : VolatilityTokensChartsTabsPaths['trading-view']

  return (
    <>
      <CviTitleInfo />

      {
        <Tabs
          tabs={[
            { name: 'Trading view', path: 'trading_view' },
            ...(themeWeb === WebSite.Cvi ? [{ name: 'Funding fee', path: 'funding_fee' }] : []),
          ]}
          activeTab={chartsActiveTab}
          type={'funding_fee'}
        />
      }

      {chartsActiveTab === VolatilityTokensChartsTabsPaths['trading-view'] ? (
        <TradingViewChart />
      ) : (
        <FubdingFeeChart selectedCvi={selectedCvi} setSelectedCvi={setSelectedCvi} />
      )}
    </>
  )
}

export default Charts
