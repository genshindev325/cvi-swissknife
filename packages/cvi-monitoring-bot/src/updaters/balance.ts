/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */

import type { Fetcher } from '../fetchers'
import { Updater } from './updater'
import logger from '../utils/logger'

const SILENT_TIME_PERIOD = 86400000

interface Balance {
  balance: number
  min: number
  symbol: string
  decimals: number
  lastAlert: number
}

export class BalanceUpdater extends Updater {
  balances: { [symbol: string]: Balance } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const key in this.balances) {
      this.checkBalance(key, this.balances[key])
    }
  }

  checkBalance(name: string, balance: Balance) {
    const needed = balance.min
    const has = balance.balance
    logger.debug(
      `[${name}] ${balance.symbol} balance - has: ${has} ${balance.symbol}, needed: ${needed} ${balance.symbol}`,
    )
    this.send(
      'update',
      `[${name}] ${balance.symbol} balance - has: ${has} ${balance.symbol}, needed: ${needed} ${balance.symbol}`,
    )
    if (new Date().getTime() > balance.lastAlert + SILENT_TIME_PERIOD && has < needed) {
      this.send(
        'high',
        `${name} needs ${balance.symbol} refill - has: ${has} ${balance.symbol}, needed: ${needed} ${balance.symbol}`,
      )
      balance.lastAlert = new Date().getTime()
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`balance newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      const lastAlert = this.balances[item.id] ? this.balances[item.id].lastAlert : 0
      this.balances[item.id] = {
        balance: item.balance,
        min: item.min,
        symbol: item.symbol,
        decimals: item.decimals,
        lastAlert,
      }
    }
    await super.update()
  }
}
