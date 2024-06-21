import type { FC } from 'react'
import React, { useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Footer } from './footer'
import { ROUTES } from '../routes'
import { Effects } from '../effects'
import { SelectGraphBackendDropdown } from './select-gpt-backend-dropdown'
import { SelectNetworkDropdown } from './SelectNetworkDropdown'
import classNames from 'classnames'
import { Dashboard } from '../pages/dashboard'
import { safeObjectEntries } from '../../../lw-sdk/src'
import { TextSummary } from '../pages/summary-text'
import { useAppSelector } from '../redux'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

type Props = {}

export const General: FC<Props> = () => {
  const location = useLocation()
  const [showIlBackend, setIlBackend] = useState(false)
  const [showNetwork, setShowNetwork] = useState(false)
  const fullMode = useAppSelector(state => state.fullMode)

  return (
    <div className="flex flex-col h-screen w-full">
      <Effects />

      {fullMode && (
        <div className="text-white sticky top-0 z-50 flex items-center gap-12 py-1 px-4 bg-dark-300 ">
          <span className="border-b border-b-common-orange text-1xl">
            <a href="https://www.text-summary.surge.sh" target="new" title="Go to text-summary.surge.sh"></a>
            <a href="/" title="Text Summary">
              Text Summary
            </a>
          </span>
          {safeObjectEntries(ROUTES).map(([name, path]) => (
            <Link key={name} to={path}>
              <span className={classNames({ 'text-common-orange': location.pathname === path })}>{name}</span>
            </Link>
          ))}
          <div className="flex flex-row items-center gap-4 ml-auto">
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
                <legend className="text-xs text-center">GPT</legend>
                <SelectGraphBackendDropdown setGraphBackend={setIlBackend} setShowNetwork={setShowNetwork} />
              </fieldset>
            </div>
          </div>
        </div>
      )}
      <SentryRoutes>
        <Route path={ROUTES.Dashboard} element={<Dashboard />} />
        <Route path={ROUTES.Summaries} element={<TextSummary />} />
        <Route path="*" element={<Navigate to={ROUTES.Summaries} replace />} />
      </SentryRoutes>
      {fullMode && <Footer />}
    </div>
  )
}
