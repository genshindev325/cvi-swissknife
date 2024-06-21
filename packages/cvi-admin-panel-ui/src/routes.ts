import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import type { UI } from './types'

export const ROUTES = {
  'Volatility tokens': '/volatility_tokens',
  'Theta vaults': '/theta_vaults',
  Staking: '/staking',
  'All Events': '/all-events',
  Hedging: '/hedging',
  ExternalHedging: '/external-hedging',
  Charts: '/charts',
  KPIs: '/kpis',
  Report: '/report',
  Dashboard: '/dashboard',
} as const

export const UIs_ROUTES: Record<UI, Partial<Record<typeof ROUTES[keyof typeof ROUTES], boolean>>> = {
  'cvi-admin-panel-ui': {
    '/volatility_tokens': true,
    '/theta_vaults': true,
    '/staking': true,
    '/all-events': true,
    '/hedging': true,
    '/charts': true,
    '/kpis': true,
    '/report': true,
    '/dashboard': true,
    '/external-hedging': true,
  },
  'cvi-hedging-ui': {
    '/external-hedging': true,
  },
}

export const ROUTES_ARRAY = safeObjectEntries(ROUTES).map(entrie => ({ name: entrie[0], path: entrie[1] }))

export type Routes = typeof ROUTES_ARRAY
