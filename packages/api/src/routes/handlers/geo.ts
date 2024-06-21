import type express from 'express'
import geoip from 'geoip-lite'
import * as errors from '../../utils/errors'
import environment from '../../utils/environment'
import { loggerInfo } from '../../utils/logger'

const whitelistedIPS = environment.whitelistedIPS ? environment.whitelistedIPS.split(',') : []
const whitelistedOrigins = environment.whitelistedOrigins ? environment.whitelistedOrigins.split(',') : []

let counter = 0
export async function getGeo(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`getGeo: counter: ${counter++}`)

    const origin = req.get('origin')
    loggerInfo(`origin: ${origin}`)
    const host = origin?.replace('https://', '')?.replace('http://', '')
    loggerInfo(`host: ${host}`)
    loggerInfo(`whitelisted: ${whitelistedOrigins}`)
    // @ts-ignore
    const clientOrigin = !origin || whitelistedOrigins.includes(host)
    loggerInfo(`clientOrigin: ${clientOrigin}`)

    const { ip } = req
    const geoLocation = geoip.lookup(ip)
    const isNotIsraelIp: boolean =
      geoLocation === null || clientOrigin || whitelistedIPS.includes(ip) || geoLocation?.country !== 'IL'
    const status = isNotIsraelIp
    let failureReasons
    if (!status) {
      failureReasons = [!isNotIsraelIp && errors.isIsraelIpError].filter((r: errors.CVIError) => r)
    }

    const result = {
      status: status ? 'Success' : 'Failure',
      reason: failureReasons?.map((fr: errors.CVIError) => fr.reason),
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
