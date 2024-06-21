/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import { getW3 } from '@coti-cvi/cvi-sdk'
import type { Request, Response, NextFunction } from 'express'
import { feesCache, getCollectedFees } from '../../updaters/staking'
import { loggerInfo } from '../../utils/logger'

interface FeesQuery {
  chain: string
  from?: number
  to?: number
}

let counter = 0

export function getFees(req: Request<{}, {}, {}, FeesQuery>, res: Response, next: NextFunction) {
  loggerInfo(`getFees: counter: ${counter++}`)
  // @ts-ignore
  fees(req.query.chain, req.query.from, req.query.to)
    .then(data => {
      res.json(data)
    })
    .catch(error => {
      next(Error(`getFees error: ${error}`))
    })
}

async function fees(chain: string, from: number, to: number) {
  if (chain === undefined) {
    return Object.fromEntries(
      await Promise.all(
        (['Ethereum', 'Polygon', 'Arbitrum'] as const).map(async chain => {
          const w3 = getW3(chain)
          const { collectedFees } = await w3.staking.getAllCollectedFees({ historyId: 'GraphHistory' })
          const num = await w3.staking.getTotalCollectedFees({ historyId: 'GraphHistory' })
          const result = Object.fromEntries(collectedFees.map(r => [r.tokenId, r.sum.toString()]))
          return [chain, result]
        }),
      ),
    )
  }
  if (chain !== undefined && chain !== 'Ethereum' && chain !== 'Polygon' && chain !== 'Arbitrum') {
    console.warn('Usage: chain should be Ethereum or Polygon or Arbitrum')
    chain = 'Ethereum'
  }
  if (from || to) {
    return getCollectedFees(chain, from, to)
  }
  return feesCache[chain]
}
