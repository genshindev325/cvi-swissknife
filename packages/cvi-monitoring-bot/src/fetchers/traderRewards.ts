/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable eqeqeq */
import type { Platform } from '@coti-cvi/cvi-sdk'
import { fromBN, toBN } from '@coti-cvi/cvi-sdk'
import type BN from 'bn.js'
import { Fetcher } from './fetcher'
import { ACTIVE_PLATFORMS } from '../utils/secrets'

const GOVI_DECIMALS = 18

export class TraderRewardsFetcher extends Fetcher {
  async fetch(): Promise<never> {
    const platforms = Object.values(this.w3.platforms).filter(
      p => ACTIVE_PLATFORMS.includes(p.id) && p.id != 'ETHVOL-USDC-Platform',
    )
    // @ts-ignore
    return this.asyncCall(platforms, p => this.getTraderRewards(p))
  }

  async getTraderRewards(platform: Platform) {
    try {
      const { rewards } = platform
      const maxDailyReward = toBN(await rewards.contract.methods.maxDailyReward().call())
      const todayClaimedRewards = toBN(await rewards.contract.methods.todayClaimedRewards().call())
      const lastClaimedDay = fromBN(await rewards.contract.methods.lastClaimedDay().call())
      const today = Math.floor(+platform.w3.block.latestBlock.timestamp / 86400)
      const claimed = today > lastClaimedDay ? 0 : todayClaimedRewards
      return {
        id: platform.id,
        rewardEstimate: fromBN(claimed, GOVI_DECIMALS),
        maxDailyReward: fromBN(maxDailyReward, GOVI_DECIMALS),
      }
    } catch (error) {
      console.log(`[${platform.id}] error ${error}`)
    }
  }

  async getPlatformOpenAmounts(platform: Platform): Promise<BN[]> {
    const { contract } = platform
    const eventsData = [{ contract, events: { OpenPosition: [{}] } }]
    const platformEvents = await this.w3.getEvents(eventsData, { days: 1 })
    const accounts: { [account: string]: BN } = {}
    for (const event of platformEvents) {
      if (!accounts[event.returnValues.account]) {
        accounts[event.returnValues.account] = toBN(0)
      }
      accounts[event.returnValues.account] = accounts[event.returnValues.account].add(
        this.getPositionUnits(event, platform.maxIndexValue),
      )
    }
    return Object.values(accounts)
  }

  getPositionUnits(event: any, maxIndex: BN): BN {
    const tokenAmount: BN = toBN(event.returnValues.tokenAmount.toString())
    const cviValue: BN = toBN(event.returnValues.cviValue.toString())
    return tokenAmount.mul(maxIndex).div(cviValue)
  }
}
