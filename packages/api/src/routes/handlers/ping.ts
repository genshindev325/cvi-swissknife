import type express from 'express'
import { loggerInfo } from '../../utils/logger'

let counter1 = 0

export async function get(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`get: counter: ${counter1++}`)

    res.json({ status: true })
    return next()
  } catch (e) {
    next(e)
  }
}

let counter2 = 0

export async function post(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`post: counter: ${counter2++}`)

    res.json({ status: true })
    return next()
  } catch (e) {
    next(e)
  }
}
