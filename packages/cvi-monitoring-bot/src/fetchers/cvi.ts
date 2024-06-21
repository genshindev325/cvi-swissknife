/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Oracle } from '@coti-cvi/cvi-sdk'
import { Fetcher } from './fetcher'

export class CVIFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const oracles = Object.values(this.w3.oracles)
    return this.asyncCall(oracles, o => this.getIndex(o))
  }

  async getIndex(oracle: Oracle) {
    const index = await oracle.contract.methods.getCVILatestRoundData().call()
    return { id: oracle.id, index }
  }
}
