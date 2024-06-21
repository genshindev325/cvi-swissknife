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

const PERCENT_SPIKE = 15
const BIG_PERCENT_SPIKE = 30
const ANOMALY_PERCENT_SPIKE = 10
const ANOMALY_BIG_PERCENT_SPIKE = 50
const SPIKE_TIME_PERIOD = 86400000 // (day)

interface PlatformTVL {
  pastTVLValues: TVLValue[]
  currTVLValue?: TVLValue
}

interface TVLValue {
  timestamp: number
  realValue: number
  contractValue: number
}

export class TVLUpdater extends Updater {
  tvls: { [name: string]: PlatformTVL } = {}

  lastAnomaly = 0

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const name in this.tvls) {
      this.checkTVLAlert(name, this.tvls[name])
      // this.checkAnomalyAlert(name, this.tvls[name]);
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`tvl newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      if (!(item.id in this.tvls)) {
        this.tvls[item.id] = { pastTVLValues: [] }
      }
      this.updateTVL(item.id, item, this.tvls[item.id])
    }
    await super.update()
  }

  updateTVL(name: string, newValue: any, tvl: PlatformTVL) {
    if (tvl.currTVLValue) {
      tvl.pastTVLValues.push(tvl.currTVLValue)
    }
    tvl.currTVLValue = {
      timestamp: new Date().getTime(),
      realValue: newValue.realBalance,
      contractValue: newValue.contractBalance,
    }
    tvl.pastTVLValues = tvl.pastTVLValues.filter(v => new Date().getTime() - v.timestamp < SPIKE_TIME_PERIOD)
    logger.info(`[${name}] curr ${JSON.stringify(tvl.currTVLValue)} past ${JSON.stringify(tvl.pastTVLValues)}`)
  }

  checkTVLAlert(name: string, tvl: PlatformTVL) {
    if (tvl.pastTVLValues.length < 1) {
      return
    }
    const max = Math.max(...tvl.pastTVLValues.map(v => v.realValue))
    // @ts-ignore
    const change = tvl.currTVLValue.realValue - max
    const changePercent = max > 0 ? (change / max) * 100 : 0
    if (change != 0) {
      this.send(
        'update',
        // @ts-ignore
        `${name} Platform TVL changed ${changePercent.toFixed(2)}% (${max} => ${tvl.currTVLValue.realValue})`,
      )
    }
    if (changePercent < -BIG_PERCENT_SPIKE) {
      this.send(
        'high',
        // @ts-ignore
        `${name} Platform TVL spiked ${changePercent.toFixed(2)}% (${max} => ${tvl.currTVLValue.realValue})`,
      )
      tvl.pastTVLValues = []
    } else if (changePercent < -PERCENT_SPIKE) {
      this.send(
        'medium',
        // @ts-ignore
        `${name} Platform TVL spiked ${changePercent.toFixed(2)}% (${max} => ${tvl.currTVLValue.realValue})`,
      )
      tvl.pastTVLValues = []
    }
  }

  checkAnomalyAlert(name: string, tvl: PlatformTVL) {
    // @ts-ignore
    const value = tvl.currTVLValue.realValue
    // @ts-ignore
    const { contractValue } = tvl.currTVLValue
    const anomaly = value - contractValue
    const anomalyPercent = value > 0 ? (anomaly / value) * 100 : 0
    logger.info(`${name} Platform TVL anomaly ${anomalyPercent.toFixed(2)}% (real ${value}, contract ${contractValue})`)
    if (Math.abs(anomalyPercent) > ANOMALY_BIG_PERCENT_SPIKE) {
      this.send(
        'critical',
        `${name} Platform TVL anomaly ${anomalyPercent.toFixed(2)}% (real ${value}, contract ${contractValue})`,
      )
    } else if (
      Math.abs(anomalyPercent) > ANOMALY_PERCENT_SPIKE &&
      this.lastAnomaly + SPIKE_TIME_PERIOD < new Date().getTime()
    ) {
      this.send(
        'high',
        `${name} Platform TVL anomaly ${anomalyPercent.toFixed(2)}% (real ${value}, contract ${contractValue})`,
      )
      this.lastAnomaly = new Date().getTime()
    }
  }
}
