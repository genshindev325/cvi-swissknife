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
import { PERIOD_FINISH_THRESHOLD } from '../utils/secrets'

const RESET_TIME = 86400 // (1 Day)

const now = (): number => {
  return new Date().getTime() / 1000
}

class PeriodFinish {
  finish: number

  reset: number

  constructor(finish: number) {
    this.finish = finish
    this.reset = 0
  }

  getTimeToFinish() {
    return this.finish - now()
  }

  getTimeToReset() {
    return this.reset - now()
  }
}

export class StakingRewardsUpdater extends Updater {
  finishPeriods: { [symbol: string]: PeriodFinish } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const key in this.finishPeriods) {
      this.checkPeriod(key, this.finishPeriods[key])
    }
  }

  checkPeriod(symbol: string, period: PeriodFinish) {
    const timeToFinish = period.getTimeToFinish()
    const timeToReset = period.getTimeToReset()
    logger.debug(
      `[${symbol}] == timeToFinish ${timeToFinish.toFixed(0)} sec | timeToReset ${timeToReset.toFixed(0)} sec`,
    )
    if (timeToFinish > 0 && timeToFinish < PERIOD_FINISH_THRESHOLD && timeToReset <= 0) {
      this.send(
        'medium',
        `${symbol} Staking Rewards finish period is about to expire in ${(timeToFinish / 60).toFixed(2)} minutes`,
      )
      this.send(
        'update',
        `${symbol} Staking Rewards finish period is about to expire in ${(timeToFinish / 60).toFixed(2)} minutes`,
      )
      period.reset = now() + RESET_TIME
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`stakingRewards newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      if (!this.finishPeriods[item.id]) {
        this.finishPeriods[item.id] = new PeriodFinish(item.periodFinish)
      } else {
        this.finishPeriods[item.id].finish = item.periodFinish
      }
    }
    await super.update()
  }
}
