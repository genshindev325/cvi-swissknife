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

const REWARD_THRESHOLD = 75
const BIG_REWARD_THRESHOLD = 90
const SILENT_TIME_PERIOD = 86400000

interface Rewards {
  estimate: number
  max: number
  lastAlert: number
}

export class TraderRewardsUpdater extends Updater {
  rewards: { [symbol: string]: Rewards } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const key in this.rewards) {
      this.checkRewards(key, this.rewards[key])
    }
  }

  checkRewards(name: string, rewards: Rewards) {
    const percent = (rewards.estimate / rewards.max) * 100
    const numbers = `(${rewards.estimate.toFixed(2)} / ${rewards.max.toFixed(2)})`
    logger.debug(`[${name}] Trader rewards percent in the last 24 hours: ${percent.toFixed(2)}% ${numbers}`)
    this.send('update', `[${name}] Trader rewards percent in the last 24 hours: ${percent.toFixed(2)}% ${numbers}`)
    if (new Date().getTime() > rewards.lastAlert + SILENT_TIME_PERIOD) {
      if (percent > BIG_REWARD_THRESHOLD) {
        this.send(
          'medium',
          `${name} Trader rewards percent reached ${percent.toFixed(2)}% in the last 24 hours ${numbers}`,
        )
        rewards.lastAlert = new Date().getTime()
      } else if (percent > REWARD_THRESHOLD) {
        this.send(
          'low',
          `${name} Trader rewards percent reached ${percent.toFixed(2)}% in the last 24 hours ${numbers}`,
        )
        rewards.lastAlert = new Date().getTime()
      }
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`traderRewards newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      const lastAlert = this.rewards[item.id] ? this.rewards[item.id].lastAlert : 0
      this.rewards[item.id] = { estimate: item.rewardEstimate, max: item.maxDailyReward, lastAlert }
    }
    await super.update()
  }
}
