/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

// the stack-traces in debugging and in errors are wrong if this we are using this package + ts-node/ts-jest
if (__filename.endsWith('js')) {
  // eslint-disable-next-line global-require
  require('@cspotcode/source-map-support/register')
}

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// @ts-ignore
import ExpressCache from 'express-cache-middleware'
import cacheManager from 'cache-manager'
// @ts-ignore
import rateLimit from 'express-rate-limit'
import * as routes from './routes'
import { startTVLRefresh } from './updaters/tvlRefresh'
import { startPricesSync } from './updaters/prices'
import { init } from './core'
import { loggerInfo } from './utils/logger'
import { startCVISync } from './updaters/cvi'

const PORT = process.env.PORT || 3000
const app = express()

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 15, // limit each IP to 15 requests per windowMs
})

const cacheMiddleware = new ExpressCache(
  // @ts-ignore
  cacheManager.caching({
    store: 'memory',
    max: 100,
    ttl: 10,
  }),
)

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.set('trust proxy', true)
app.use(limiter)
cacheMiddleware.attach(app)
app.all('*')

routes.setRoutes(app)
app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('server error!')
})

init().then(w3s => {
  startCVISync(w3s)
  // startStakingSync(w3s)
  startTVLRefresh(w3s)
  // startLPValues(w3s)
  startPricesSync(w3s)
})

app.listen(PORT, () => loggerInfo(`Listening on port ${PORT}`))
