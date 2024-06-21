import type { FC } from 'react'
import React from 'react'
import type { Page } from './Router'
import { useRouter } from './useRouter'

type RouteProps = {
  path: Page['path']
  component: React.ReactChild
}

export const Route: FC<RouteProps> = ({ path, component }) => {
  const router = useRouter()

  return router.currentPage.path === path ? <>{component}</> : null
}
