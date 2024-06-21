import type express from 'express'
import geoip from 'geoip-lite'
import type { ChainName, DataSource, Index } from '../../utils/general'
import { getLatestIndexesDataPoint } from '../../core'
import * as errors from '../../utils/errors'
import { loggerInfo } from '../../utils/logger'

let counter = 0

export async function latestDataPoint(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`latestDataPoint: counter: ${counter++}`)

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // @ts-ignore
    const geo = geoip.lookup(ip)
    const isNotUsIp = geo === null || geo?.country !== 'US'

    let { chain, index, source } = req.query
    if (chain !== undefined && chain !== 'Ethereum' && chain !== 'Polygon' && chain !== 'Arbitrum') {
      console.warn('Usage: chain should be Ethereum or Polygon or Arbitrum')
      chain = 'Ethereum'
    }

    if (index !== 'CVI' && index !== 'ETHVOL') {
      index = undefined
    }

    if (source !== 'Anton' && source !== 'Chainlink') {
      loggerInfo(`source in api: ${source}`)
      source = 'Anton'
    }

    const latestExtendedDataPoint = await getLatestIndexesDataPoint(
      chain as ChainName,
      source as DataSource,
      index as Index,
    )

    const status = isNotUsIp && latestExtendedDataPoint !== null
    let failureReasons
    if (!status) {
      failureReasons = [
        !isNotUsIp && errors.isUsIpError,
        latestExtendedDataPoint === null && errors.noLatestCVIDataError,
        // @ts-ignore
      ].filter((r: errors.CVIError) => r)
    }

    const result = {
      status: status ? 'Success' : 'Failure',
      // @ts-ignore
      reason: failureReasons?.map((fr: errors.CVIError) => fr.reason),
      data: latestExtendedDataPoint,
    }

    // @ts-ignore
    const statusCode = status ? 200 : failureReasons[0]?.code ?? 400
    res.status(statusCode)
    res.send(result)
    return next()
  } catch (e) {
    next(e)
  }
}
