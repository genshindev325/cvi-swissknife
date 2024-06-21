import type { MODE, NetworkName } from '@coti-cvi/lw-sdk'

export type RoutesLink = {
  name: string
  path: string
  externalUrl?: string
  isNew?: boolean
  hideByNetwork?: NetworkName[]
  mode?: MODE
  subPath?: string[]
}
export interface Networks {
  title: string
  icon: string
}
