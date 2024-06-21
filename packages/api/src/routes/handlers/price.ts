import type { Request, Response, NextFunction } from 'express'
import { getPrices } from '../../updaters/prices'
import { loggerInfo } from '../../utils/logger'

interface PriceQuery {
  token?: string
  timestamp?: number
}

let counter = 0

export function getPrice(req: Request<{}, {}, {}, PriceQuery>, res: Response, next: NextFunction) {
  try {
    loggerInfo(`getPrice: counter: ${counter++}`)

    getPrices(req.query.token, req.query.timestamp)
      .then(data => {
        res.json(data)
      })
      .catch(error => {
        next(Error(`getPrice error: ${error}`))
      })
  } catch (e) {
    next(e)
  }
}
