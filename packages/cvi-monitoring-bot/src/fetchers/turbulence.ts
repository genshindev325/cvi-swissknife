/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Platform } from '@coti-cvi/cvi-sdk'
import { Fetcher } from './fetcher'

const MAX_PERCENTAGE = 10000

export class TurbulenceFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const platforms = Object.values(this.w3.platforms)
    return this.asyncCall(platforms, p => this.getTurbulence(p))
  }

  async getTurbulence(platform: Platform) {
    const turbulence = await platform.getTurbulenceIndicatorPercent()
    return { id: platform.id, turbulence: (+turbulence / MAX_PERCENTAGE) * 100 }
  }
}
