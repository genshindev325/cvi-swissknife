export type RoutesLink = {
  name: string
  path: string
}

export const ROUTES: RoutesLink[] = [
  {
    name: 'Protections',
    path: '/protections',
  },
  {
    name: 'Charts',
    path: '/charts',
  },
  {
    name: 'Liquidity Events',
    path: '/events',
  },
]
