import type express from 'express'
import { get, post } from './handlers/ping'
import { historicalData } from './handlers/history'
import { fullDailyHistoricalData } from './handlers/fullDailyHistory'
import { latestDataPoint } from './handlers/latest'
import { getGeo } from './handlers/geo'
import { getTVL } from './handlers/tvl'
import { getLPsValues } from './handlers/lpValues'
import { getPrice } from './handlers/price'
import { getFees } from './handlers/fees'

export function setRoutes(app: express.Application) {
  app.get('/', get)
  app.post('/', post)
  app.get('/history', historicalData) // Split between Anton's API and chainlink. If chainlink it's for 40 days, hourly. Both Polygon and Ethereum
  app.get('/fullDailyHistory', fullDailyHistoricalData) // Full history daily from Anton's API. Only Ethereum
  app.get('/latest', latestDataPoint)
  app.get('/geo', getGeo)
  app.get('/fees', getFees)
  app.get('/tvl', getTVL)
  app.get('/lpValues', getLPsValues)
  app.get('/price', getPrice)
}
