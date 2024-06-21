/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */

import type { W3, Chain } from '@coti-cvi/cvi-sdk'
import { getW3, logger } from '@coti-cvi/cvi-sdk'

export abstract class Fetcher {
  chain: Chain

  w3: W3

  interval: number

  constructor(chain: Chain, interval = 0) {
    this.chain = chain
    this.w3 = getW3(chain)
    this.interval = interval
  }
  abstract fetch(): Promise<any>

  async asyncCall<T, U>(list: T[], mapper: (i: T) => Promise<U>) {
    const res = await Promise.allSettled(list.map(mapper))
    return res
      .map((r, i) => {
        if (r.status === 'rejected') {
          logger.error(`${list[i]} error ${r.reason}`)
        } else {
          return r.value
        }
      })
      .filter(d => d)
  }
}
