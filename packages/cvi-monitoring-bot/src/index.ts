/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { Chain } from '@coti-cvi/cvi-sdk'
import { getW3, toTimeString } from '@coti-cvi/cvi-sdk'
import { INTERVAL, USERS_INTERVAL, CHAINS } from './utils/secrets'
import logger from './utils/logger'
import { startBot } from './bot/bot'
import {
  CVIFetcher,
  TVLFetcher,
  StakingRewardsFetcher,
  UsersFetcher,
  TraderRewardsFetcher,
  TurbulenceFetcher,
  BalanceFetcher,
  ArbitrageBotFetcher,
} from './fetchers'
import type { Updater } from './updaters'
import {
  CVIUpdater,
  TVLUpdater,
  StakingRewardsUpdater,
  UsersUpdater,
  TraderRewardsUpdater,
  TurbulenceUpdater,
  BalanceUpdater,
  ArbitrageBotUpdater,
} from './updaters'

init().then(start)

async function init() {
  const w3s = CHAINS.map(c => getW3(c as Chain))
  w3s.map(w3 => {
    logger.info(`${w3} url: ${w3.url} ==> starting...`)
  })
  return Promise.all(w3s.map(w3 => w3.init()))
}

function start() {
  startBot()

  const staggerInterval = 5000
  let counter = 0

  setTimeout(
    () => startUpdater(new ArbitrageBotUpdater(new ArbitrageBotFetcher('Ethereum', INTERVAL)), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(() => startUpdater(new CVIUpdater(new CVIFetcher('Ethereum')), INTERVAL), counter++ * staggerInterval)
  setTimeout(() => startUpdater(new TVLUpdater(new TVLFetcher('Ethereum')), INTERVAL), counter++ * staggerInterval)
  setTimeout(
    () => startUpdater(new StakingRewardsUpdater(new StakingRewardsFetcher('Ethereum')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new UsersUpdater(new UsersFetcher('Ethereum')), USERS_INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new TraderRewardsUpdater(new TraderRewardsFetcher('Ethereum')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new TurbulenceUpdater(new TurbulenceFetcher('Ethereum')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new BalanceUpdater(new BalanceFetcher('Ethereum')), INTERVAL),
    counter++ * staggerInterval,
  )

  setTimeout(
    () => startUpdater(new ArbitrageBotUpdater(new ArbitrageBotFetcher('Polygon', INTERVAL)), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(() => startUpdater(new CVIUpdater(new CVIFetcher('Polygon')), INTERVAL), counter++ * staggerInterval)
  setTimeout(() => startUpdater(new TVLUpdater(new TVLFetcher('Polygon')), INTERVAL), counter++ * staggerInterval)
  setTimeout(
    () => startUpdater(new StakingRewardsUpdater(new StakingRewardsFetcher('Polygon')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new UsersUpdater(new UsersFetcher('Polygon')), USERS_INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new TraderRewardsUpdater(new TraderRewardsFetcher('Polygon')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new TurbulenceUpdater(new TurbulenceFetcher('Polygon')), INTERVAL),
    counter++ * staggerInterval,
  )
  setTimeout(
    () => startUpdater(new BalanceUpdater(new BalanceFetcher('Polygon')), INTERVAL),
    counter++ * staggerInterval,
  )

  setTimeout(
    () => startUpdater(new BalanceUpdater(new BalanceFetcher('Arbitrum')), INTERVAL),
    counter++ * staggerInterval,
  )
}

function startUpdater(updater: Updater, interval: number) {
  const func = () => {
    logger.debug(`Running ${updater.constructor.name}. next update in ${toTimeString(interval / 1000)}`)
    updater.update().catch(printError)
  }
  func()
  setInterval(func, interval)
}

function printError(error: any) {
  logger.debug(`bot error: ${error.message}`)
  logger.debug(error.stack)
}
