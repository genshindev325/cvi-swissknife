/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Platform } from '@coti-cvi/cvi-sdk'
import { Fetcher } from './fetcher'

const DAYS = 1

export class UsersFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const platforms = Object.values(this.w3.platforms)
    return this.asyncCall(platforms, p => this.getUserCount(p))
  }

  async getUserCount(platform: Platform) {
    const { contract } = platform
    const eventsData = [
      { contract, events: { OpenPosition: [{}], ClosePosition: [{}], Deposit: [{}], Withdraw: [{}] } },
    ]
    const platformEvents = await this.w3.getEvents(eventsData, { days: DAYS })
    const accounts = new Set(platformEvents.map(e => e.returnValues.account))
    return { id: platform.id, accounts: accounts.size }
  }
}
