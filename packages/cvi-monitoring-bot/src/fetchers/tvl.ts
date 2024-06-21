/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Platform } from '@coti-cvi/cvi-sdk'
import { ACTIVE_PLATFORMS } from '../utils/secrets'
import { Fetcher } from './fetcher'

export class TVLFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const platforms = Object.values(this.w3.platforms).filter(p => ACTIVE_PLATFORMS.includes(p.id))
    return this.asyncCall(platforms, p => this.getContractBalance(p))
  }

  async getContractBalance(platform: Platform) {
    const index = await platform.oracle.contract.methods.getCVILatestRoundData().call()
    const totalBalance = await platform.getTotalBalance() // can only get leveraged total balance - cant calculate how much of it is leveraged
    const totalFundingFees = await platform.getTotalFundingFees()
    const totalOpenAmount = platform.fromUnits(await platform.getTotalPositionUnits(), index.cviValue)
    const contractBalance = totalBalance.add(totalOpenAmount).sub(totalFundingFees)
    const realBalance = await platform.token.balanceOf(platform.address)
    return { id: platform.id, realBalance, contractBalance }
  }
}
