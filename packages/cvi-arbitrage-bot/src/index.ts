/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-return-assign */

require('dotenv').config()

import type { W3, Chain } from '@coti-cvi/cvi-sdk'
import { getW3, W3Component, LongToken, logger, toTimeString } from '@coti-cvi/cvi-sdk'
import { arbitrage } from './arbitrage'
import { INTERVAL, MIN_PROFIT, TOKENS, CHAINS, MAX_TX_COST } from './util/constants'

init().then(start)

async function init() {
  const w3s = CHAINS.map(c => getW3(c as Chain))
  w3s.map(w3 => logger.info(`${w3} url: ${w3.url} ==> starting...`))
  return Promise.all(w3s.map(w3 => w3.init()))
}

function start(w3s: W3[]) {
  logger.info(`Min Profit: ${MIN_PROFIT}`)
  w3s.map(w3 => (w3.cache.defaultInterval = 0))
  // @ts-ignore
  w3s.map(w3 => console.log(`${w3} default account ${w3.dafaultAccount} [${w3.account().address}]`))
  const w3 = w3s.find(w3 => w3.getChain() === 'Ethereum')
  if (w3) {
    logger.info(`Setting max tx cost: ${MAX_TX_COST}`)
    w3.maxTxCost = MAX_TX_COST
  }
  const longTokens = w3s.flatMap(w3 =>
    w3.getComponents(W3Component.token).filter(c => c instanceof LongToken && TOKENS.includes(c.id)),
  )
  longTokens.map(t => run(t as LongToken))
}

async function run(token: LongToken) {
  try {
    await token.refresh()
    logger.debug(`${token} started arbitrage ${token.infoString()}`)
    await arbitrage(token)
  } catch (error) {
    logger.error(`${token} error ${error}`)
  } finally {
    await token.refresh()
    logger.debug(
      `${token} finished running - will run again in ${toTimeString(INTERVAL / 1000)} [${token.infoString()}]`,
    )
    setTimeout(() => run(token), INTERVAL)
  }
}
