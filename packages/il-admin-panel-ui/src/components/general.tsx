import type { FC } from 'react'
import React, { useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Footer } from './footer'
import { Charts } from './pages/charts'
import { ROUTES } from '../routes'
import { Effects } from './effects'
import { SelectIlBackendDropdown } from './select-il-backend-dropdown'
import { SelectNetworkDropdown } from './SelectNetworkDropdown'
import classNames from 'classnames'
import { Protections } from './pages/protections'
import { Stats } from './AllProtections/Stats'
import { Dashboard } from './pages/dashboard'
import armadilloLogoBetaTag from './../../../../packages/beta-cvi-ui/src/assets/icons/armadillo_icon.svg'
import { useAppSelector } from '../redux'
import { LiquidityEvents } from './pages/liquidity-events'
import { Wallet } from './pages/wallet'
import { Protection } from './pages/protection'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

type Props = {}

export const General: FC<Props> = () => {
  const location = useLocation()
  const [showStats, setStats] = useState(true)
  const [showFilters, setFilters] = useState(true)
  const [showIlBackend, setIlBackend] = useState(false)
  const [showNetwork, setShowNetwork] = useState(false)
  const fullMode = useAppSelector(state => state.fullMode)
  return (
    <div className="flex flex-col min-h-screen ">
      <Effects />

      <div className=" sticky top-0 z-50 flex items-center gap-12 py-1 px-4 bg-dark-300 ">
        <span className="border-b border-b-common-orange text-1xl">
          <a href="https://www.armadillo.is/" target="new" title="Go to Armadillo.is">
            <img src={armadilloLogoBetaTag} width="25" />
          </a>
          <a href="/" title="Admin">
            ILPA
          </a>
        </span>
        {(fullMode ? [...ROUTES, { name: 'Dashboard', path: '/dashboard' }] : ROUTES).map(({ name, path }) => (
          <Link key={name} to={path}>
            <span className={classNames({ 'text-common-orange': location.pathname === path })}>{name}</span>
          </Link>
        ))}
        <div className="flex flex-row items-center gap-4 ml-auto">
          <div className="flex flex-row gap-4  p-2 ">
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
          </div>
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
              <SelectNetworkDropdown setShowNetwork={setShowNetwork} setIlBackend={setIlBackend} />
            </fieldset>

            <fieldset
              className={classNames({
                'border-common-lightGreen border-y-2 border-r-2 border-l-2 items-center  rounded-tr-lg w-20 hover:bg-common-blue':
                  true,
                'border-b-dark-300 rounded-br-0': showIlBackend,
                'rounded-br-lg border-b-common-lightGreen': !showIlBackend,
              })}
            >
              <legend className="text-xs text-center">il backend</legend>
              <SelectIlBackendDropdown setIlBackend={setIlBackend} setShowNetwork={setShowNetwork} />
            </fieldset>
          </div>
        </div>
      </div>
      {showStats && <Stats />}
      <SentryRoutes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/protections" replace />} />
        <Route path="/wallet/:address" element={<Wallet showFilters={showFilters} />} />
        <Route path="/protection/:protectionId" element={<Protection showFilters={showFilters} />} />
        <Route path="/protections" element={<Protections showFilters={showFilters} />} />
        <Route path="/charts" element={<Charts showFilters={showFilters} />} />
        <Route path="/events" element={<LiquidityEvents />} />
        <Route path="*" element={<Navigate to="/protections" replace />} />
      </SentryRoutes>
      <Footer />
    </div>
  )
}
