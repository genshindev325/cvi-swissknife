/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-const */
/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import type { Request, Response, NextFunction } from 'express'
import type { Index, ChainName } from '../../utils/general'
import { getHistoricalPrunedData } from '../../core'
import { loggerInfo } from '../../utils/logger'

interface QueryParams {
  chain: string
  index: string
  cutoff: string
}

let counter = 0
export async function historicalData(req: Request<{}, {}, {}, QueryParams>, res: Response, next: NextFunction) {
  try {
    console.time('historicalData')

    loggerInfo(`historicalData: counter: ${counter++}`)

    let { chain, index, cutoff } = req.query
    if (chain !== undefined && chain !== 'Ethereum' && chain !== 'Polygon') {
      loggerInfo('Usage: chain should be Ethereum or Polygon. Defaulting to Ethereum')
      chain = 'Ethereum'
    }

    if (index !== 'CVI' && index !== 'ETHVOL') {
      loggerInfo(`Usage: index should be a CVI or ETHVOL, got ${index}. Defaulting to CVI`)
      index = 'CVI'
    }

    if (cutoff !== undefined && cutoff.length !== 10) {
      loggerInfo('Usage: cutoff should be a timestamp in seconds. Defaulting to undefined')
    }

    let cutOffFallback = Number(cutoff)
    if (isNaN(cutOffFallback)) {
      // @ts-ignore
      cutOffFallback = undefined
    }

    const historicalData = await getHistoricalPrunedData(chain as ChainName, index as Index, cutOffFallback)

    console.timeEnd('historicalData')
    res.send(historicalData)
    return next()
  } catch (e) {
    next(e)
  }
}
