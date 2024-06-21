import type { FC } from 'react'
import { useEffect } from 'react'
import React, { useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Footer } from './footer'
import { ROUTES_ARRAY, ROUTES, UIs_ROUTES } from '../routes'
import { Effects } from '../effects'
import { SelectCviBackendDropdown } from './select-cvi-backend-dropdown'
import { SelectNetworkDropdown } from './SelectNetworkDropdown'
import classNames from 'classnames'
import { Dashboard } from '../pages/dashboard'
import { selectors, useAppSelector } from '../redux'
import { Staking } from '../pages/staking/Staking'
import { VtAccountRequests } from '../pages/vt/vt-account-requests'
import { VtRequest } from '../pages/vt/vt-request'
import { TvAccountRequests } from '../pages/tv/tv-account-requests'
import { MainVtPage } from '../pages/vt/main-vt-page'
import { MainTvPage } from '../pages/tv/main-tv-page'
import { TvRequest } from '../pages/tv/tv-request'
import { Charts } from '../pages/charts'
import { AllEventsTable } from '../pages/all-events-table'
import { Filters } from './filters/filters'
import { useDefaultRoute, useStrictCurrentPath } from '../hooks/use-strict-current-path'
import { TvPlatformStatistics } from './tv/tv-statistics'
import { VtPlatformStatistics } from './vt/vt-statistics'
import DisplayNumber from '../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { Hedging } from '../pages/hedging'
import { Kpis } from '../pages/kpis'
import { Report } from '../pages/report'
import type { UI } from '../types'
import { ExternalHedging } from '../pages/external-hedging'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

type Props = {
  ui: UI
}

export const General: FC<Props> = ({ ui }) => {
  const defaultRoute = useDefaultRoute()
  const location = useLocation()
  const [showStats, setStats] = useState(true)
  const [showFilters, setFilters] = useState(true)
  const [showCviBackend, setCviBackend] = useState(false)
  const [showNetwork, setShowNetwork] = useState(false)
  const fullMode = useAppSelector(state => state.fullMode)
  const currentPath = useStrictCurrentPath()
  const websiteLoading = useAppSelector(state => state.websiteLoading)
  const websiteLoadingPercentage = useAppSelector(selectors.websiteLoadingPercentageSelector)

  useEffect(() => {
    if (currentPath === '/kpis' || currentPath === '/hedging') {
      setStats(false)
      setFilters(false)
    }
  }, [currentPath])

  const stats =
    showStats &&
    (currentPath === '/theta_vaults' ? (
      <TvPlatformStatistics />
    ) : currentPath === '/volatility_tokens' ? (
      <VtPlatformStatistics />
    ) : (
      <>
        <VtPlatformStatistics />
        <br />
        <TvPlatformStatistics />
      </>
    ))

  return (
    <div className="flex flex-col min-h-screen ">
      <Effects ui={ui} />
      <div className=" sticky top-0 z-50 flex items-center gap-12 py-1 px-4 bg-dark-300 ">
        <span className="border-b border-b-common-orange text-1xl">
          <a href="https://theta.cvi.finance" target="new" title="Go to theta.cvi.finance">
            <img src="https://theta.cvi.finance/cvi_favicon.ico" width="25" />
          </a>
          <a href="/" title="Admin">
            {ui === 'cvi-admin-panel-ui' && 'CVI-AP'}
          </a>
        </span>
        <span className="flex gap-2" onClick={() => console.log(websiteLoading)}>
          <span>Loading Data: </span>
          <DisplayNumber state={websiteLoadingPercentage} percentage />
        </span>
        {ROUTES_ARRAY.filter(tab => UIs_ROUTES[ui][tab.path])
          .filter(tab => (fullMode ? true : tab.path !== '/dashboard'))
          .map(tab => (
            <Link key={tab.name} to={tab.path}>
              <span className={classNames({ 'text-common-orange': location.pathname.includes(tab.path) })}>
                {tab.name}
              </span>
            </Link>
          ))}
        <div className="flex flex-row items-center gap-4 ml-auto">
          <div className="flex flex-row gap-4 p-2 ">
            {ui === 'cvi-admin-panel-ui' && (
              <>
                <button
                  className={classNames({
                    'w-20 border-2 rounded-lg hover:text-common-orange': true,
                    'border-common-orange text-common-orange hover:text-white': showStats,
                    ' border-white ': !showStats,
                  })}
                  onClick={() => setStats(!showStats)}
                >
                  Stats
                </button>
                <button
                  className={classNames({
                    'w-20 border-2 rounded-lg hover:text-common-orange': true,
                    'border-common-orange text-common-orange hover:text-white': showFilters,
                    'border-white ': !showFilters,
                  })}
                  onClick={() => setFilters(!showFilters)}
                >
                  Filters
                </button>
              </>
            )}
          </div>
          {ui === 'cvi-admin-panel-ui' && (
            <>
              <div className="flex flex-row">
                <fieldset
                  className={classNames({
                    ' border-common-lightGreen border-y-2 border-l-2  items-center  rounded-tl-lg w-[11.6rem] hover:bg-common-blue':
                      true,
                    'border-b-dark-300 rounded-bl-0': showNetwork,
                    'rounded-bl-lg border-b-common-lightGreen': !showNetwork,
                  })}
                >
                  <legend className="text-xs text-center">network</legend>
                  <SelectNetworkDropdown setShowNetwork={setShowNetwork} setCviBackend={setCviBackend} />
                </fieldset>

                <fieldset
                  className={classNames({
                    'border-common-lightGreen border-y-2 border-r-2 border-l-2 items-center  rounded-tr-lg w-20 hover:bg-common-blue':
                      true,
                    'border-b-dark-300 rounded-br-0': showCviBackend,
                    'rounded-br-lg border-b-common-lightGreen': !showCviBackend,
                  })}
                >
                  <legend className="text-xs text-center">cvi backend</legend>
                  <SelectCviBackendDropdown setCviBackend={setCviBackend} setShowNetwork={setShowNetwork} />
                </fieldset>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="m-4">
        {ui === 'cvi-admin-panel-ui' && stats}
        {ui === 'cvi-admin-panel-ui' && showStats && showFilters && <br />}
        {ui === 'cvi-admin-panel-ui' && <Filters showOnlyDates={!showFilters} />}
        <SentryRoutes>
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          {fullMode && <Route path={ROUTES.Dashboard} element={<Dashboard />} />}
          {ui === 'cvi-admin-panel-ui' && (
            <>
              <Route path={ROUTES['Theta vaults']} element={<MainTvPage />} />
              <Route path={`${ROUTES['Theta vaults']}/:address`} element={<TvAccountRequests />} />
              <Route path={`${ROUTES['Theta vaults']}/request/:requestId`} element={<TvRequest />} />
              <Route path={ROUTES['Volatility tokens']} element={<MainVtPage />} />
              <Route path={`${ROUTES['Volatility tokens']}/:address`} element={<VtAccountRequests />} />
              <Route path={`${ROUTES['Volatility tokens']}/request/:requestId`} element={<VtRequest />} />
              <Route path={ROUTES.Staking} element={<Staking />} />
              <Route path={ROUTES['All Events']} element={<AllEventsTable />} />
              <Route path={ROUTES.Hedging} element={<Hedging />} />
              <Route path={ROUTES.Charts} element={<Charts />} />
              <Route path={ROUTES.Report} element={<Report />} />
              <Route path={ROUTES.KPIs} element={<Kpis />} />
            </>
          )}
          <Route path={ROUTES.ExternalHedging} element={<ExternalHedging />} />
        </SentryRoutes>
        {ui === 'cvi-admin-panel-ui' && <Footer />}
      </div>
    </div>
  )
}
