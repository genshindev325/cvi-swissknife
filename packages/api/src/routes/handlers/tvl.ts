import type express from 'express'
import { getAllTVL } from '../../core'
import { loggerInfo } from '../../utils/logger'
// import * as errors from '../../utils/errors';

let counter = 0

export async function getTVL(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`getTVL: counter: ${counter++}`)
    const tvl = await getAllTVL()
    const statusCode = tvl ? 200 : 400
    res.status(statusCode)
    res.send(tvl)
    return next()
  } catch (e) {
    next(e)
  }
}
