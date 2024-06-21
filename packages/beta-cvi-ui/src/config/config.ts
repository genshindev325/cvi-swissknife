import { MODE } from '@coti-cvi/lw-sdk'
import type { RoutesLink } from '../types/navbar.types'

export const METAMASK_DEEPLINK = 'https://metamask.app.link/dapp/cvi.finance.io'

export const ROUTES: RoutesLink[] = [
  {
    name: 'Volatility Tokens',
    path: '/',
  },
  {
    name: 'Vaults',
    path: '/vaults',
    subPath: ['/vaults', '/vaults/cvi', '/vaults/cvi2x'],
  },
  {
    name: 'Staking',
    path: '/staking',
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
  },
  {
    name: 'The Scoop',
    path: '/the-scoop',
  },
  {
    name: 'Community',
    path: '/community',
  },
  {
    name: 'Docs',
    path: '/docs',
    externalUrl: 'https://docs.cvi.finance/',
  },
  {
    name: 'CVI v2',
    path: '/cvi_v2',
    externalUrl: 'https://v2.cvi.finance/',
  },
  {
    name: 'Armadillo',
    path: '/armadillo',
    externalUrl: 'https://armadillo.is',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    mode: MODE.OFF,
  },
]
export const ARMADILLO_ROUTES: RoutesLink[] = [
  {
    name: 'Buy protection',
    path: '/',
  },
  {
    name: 'Community',
    path: '/community',
  },
  {
    name: 'Docs',
    path: '/docs',
    externalUrl: 'https://doc.armadillo.is/',
  },
  {
    name: 'CVI',
    path: '/cvi',
    externalUrl: 'https://cvi.finance/',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    mode: MODE.OFF,
  },
]

export enum SlippageOptions {
  'Slippage_0.1' = 0.1,
  'Slippage_0.5' = 0.5,
  'Slippage_1' = 1,
  'Slippage_custom' = 'custom',
}

export const SLIPPAGESELECT: SlippageOptions[] = [
  SlippageOptions['Slippage_0.1'],
  SlippageOptions['Slippage_0.5'],
  SlippageOptions.Slippage_1,
  SlippageOptions.Slippage_custom,
]
