/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StakingRewards } from '@coti-cvi/cvi-sdk'
import { Fetcher } from './fetcher'

export class StakingRewardsFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const stakingRewards = Object.values(this.w3.stakingRewards)
    return this.asyncCall(stakingRewards, sr => this.getPeriodFinish(sr))
  }

  async getPeriodFinish(stakingRewards: StakingRewards) {
    const periodFinish = await stakingRewards.contract.methods.periodFinish().call()
    return { id: stakingRewards.id, periodFinish }
  }
}
