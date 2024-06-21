/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */

import type { LongToken } from '@coti-cvi/cvi-sdk'
import type { Fetcher } from '../fetchers'
import { Updater } from './updater'
import logger from '../utils/logger'

const MAX_PERCENT_DEVIATION = 5
const MAX_SUBMIT_PERCENT = 90
const SILENT_TIME_PERIOD = 86400000

interface BotActions {
  token: LongToken
  events: any[]
  rebaseEvents: number
  intPrice: number
  uniPrice: number
  submitPercent: number
  lastBlock: number
  lastAlert: number
  lastRebaseAlert: number
}

export class ArbitrageBotUpdater extends Updater {
  values: { [name: string]: BotActions } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const name in this.values) {
      this.checkBotAlert(name, this.values[name])
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    for (const item of newValue) {
      logger.info(
        `${item.id} arbitrageBot new data: events: ${item.events.length} rebases: ${item.rebaseEvents.length}`,
      )
      await this.updateBotActions(item.id, item.events, item.rebaseEvents, item.token)
    }
    await super.update()
  }

  async updateBotActions(name: string, newEvents: any[], rebaseEvents: any[], token: LongToken) {
    const currentValue = this.values[name]
    const value: BotActions = {
      rebaseEvents: 0,
      events: [],
      intPrice: 0,
      uniPrice: 0,
      submitPercent: 0,
      lastBlock: currentValue ? currentValue.lastBlock : 0,
      // @ts-ignore
      token: undefined,
      lastAlert: currentValue ? currentValue.lastAlert : 0,
      lastRebaseAlert: currentValue ? currentValue.lastRebaseAlert : 0,
    }
    value.token = token
    value.events = currentValue
      ? newEvents.filter((e: { blockNumber: number }) => e.blockNumber > currentValue.lastBlock)
      : newEvents
    value.rebaseEvents = rebaseEvents.length
    value.intPrice = await value.token.getIntrinsicPrice()
    value.uniPrice = await value.token.getUSDPrice()
    value.submitPercent = value.token.verifyTotalRequestsAmount
      ? (value.token.baseToken.fromAmount(value.token.totalRequestsAmount) /
          value.token.baseToken.fromAmount(value.token.maxTotalRequestsAmount)) *
        100
      : 0
    if (value.events.length > 0) {
      value.lastBlock = value.events[0].blockNumber
    }
    this.values[name] = value
  }

  checkBotAlert(name: string, value: BotActions) {
    const prices = `prices: intrinsic ${value.intPrice.toFixed(2)}, uniswap: ${value.uniPrice.toFixed(2)}`
    logger.debug(`${name} ${prices}, submit ${value.submitPercent.toFixed(2)}%`)
    const deviation = (Math.abs(value.intPrice - value.uniPrice) / Math.max(value.intPrice, value.uniPrice)) * 100
    const submit = value.submitPercent
    if (new Date().getTime() > value.lastRebaseAlert + SILENT_TIME_PERIOD && value.rebaseEvents == 0) {
      this.send('medium', `${name} no rebase in 3 days`)
      value.lastRebaseAlert = new Date().getTime()
    }
    if (
      new Date().getTime() > value.lastAlert + SILENT_TIME_PERIOD &&
      deviation > MAX_PERCENT_DEVIATION &&
      value.uniPrice != 0
    ) {
      this.send('medium', `${name} price difference of ${deviation.toFixed(2)}% - ${prices}`)
      value.lastAlert = new Date().getTime()
    }
    if (new Date().getTime() > value.lastAlert + SILENT_TIME_PERIOD && submit > MAX_SUBMIT_PERCENT) {
      this.send('medium', `${name} submit percent at ${value.submitPercent.toFixed(2)}%`)
      value.lastAlert = new Date().getTime()
    }
    for (const event of value.events) {
      this.send(
        'low',
        `${name} Arbitrage bot ${eventToString(
          event,
          value.token,
        )} - ${prices} submit percent at ${value.submitPercent.toFixed(2)}%`,
      )
    }
  }
}

function eventToString(event: any, token: LongToken) {
  let str = ''
  if (event.event === 'SubmitRequest') {
    str = token.requestEventToString(event)
  } else if (event.event === 'Mint' || event.event === 'CollateralizedMint') {
    str = `minted ${token.baseToken.toAmountString(event.returnValues.tokenAmount)} for ${token.toAmountString(
      event.returnValues.mintedTokens,
    )}`
  } else if (event.event === 'Burn') {
    str = `burned ${token.toAmountString(event.returnValues.burnedTokens)} for ${token.baseToken.toAmountString(
      event.returnValues.tokenAmount,
    )}`
  } else if (event.event === 'Swap') {
    const amountIn =
      event.returnValues.amount0In == '0'
        ? token.baseToken.toAmountString(event.returnValues.amount1In)
        : token.toAmountString(event.returnValues.amount0In)
    const amountOut =
      event.returnValues.amount0Out == '0'
        ? token.baseToken.toAmountString(event.returnValues.amount1Out)
        : token.toAmountString(event.returnValues.amount0Out)
    str = `swapped ${amountIn} for ${amountOut}`
  }
  return `[${event.event}] ${str}`
}
