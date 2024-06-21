import type express from 'express'
import { getAllLPValues } from '../../updaters/lpValues'
import { loggerInfo } from '../../utils/logger'

let counter = 0

export async function getLPsValues(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    loggerInfo(`getLPsValues: counter: ${counter++}`)

    const chain = req.query.chain ? (req.query.chain as string) : undefined
    const token = req.query.token ? (req.query.token as string) : undefined

    const lpValues = await getAllLPValues(chain, token)
    const statusCode = lpValues ? 200 : 400
    res.status(statusCode)
    res.send(lpValues)
    return next()
  } catch (e) {
    next(e)
  }
}
