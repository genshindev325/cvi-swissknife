import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../redux'
import type { Routes } from '../routes'
import { ROUTES } from '../routes'
import { ROUTES_ARRAY } from '../routes'

export function useDefaultRoute() {
  const ui = useAppSelector(state => state.ui)
  return ui === 'cvi-admin-panel-ui' ? ROUTES['Volatility tokens'] : ROUTES.ExternalHedging
}

export function useStrictCurrentPath(): Routes[number]['path'] {
  const defaultRoute = useDefaultRoute()
  const location = useLocation()
  const currentTabPath = ROUTES_ARRAY.find(r => location.pathname.includes(r.path))

  return currentTabPath?.path || defaultRoute
}
