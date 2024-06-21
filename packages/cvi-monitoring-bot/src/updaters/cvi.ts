/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */

import { BN } from '@coti-cvi/cvi-sdk'
import type { Fetcher } from '../fetchers'
import { Updater } from './updater'
import logger from '../utils/logger'

const MAX_PERCENT_CVI_SPIKE = 5
const ORACLE_MULFUNCTION_TIME = 6000000 // (100 min)

class IndexValue {
  cviCurrent: number

  cviLast?: number

  // @ts-ignore
  lastChange: number

  roundId: BN

  alerted: boolean

  constructor(value: { cviRoundId: string; cviValue: string }) {
    this.cviLast = 0
    this.cviCurrent = +value.cviValue
    this.roundId = new BN(value.cviRoundId)
    this.alerted = false
  }

  newValue(value: { cviRoundId: string; cviValue: string }) {
    const newRoundId = new BN(value.cviRoundId)
    if (this.roundId.lt(newRoundId)) {
      this.roundId = newRoundId
      this.lastChange = new Date().getTime()
      this.cviLast = this.cviCurrent
      this.cviCurrent = +value.cviValue
      this.alerted = false
    }
  }

  toString() {
    return `{${this.roundId}} curr: ${this.cviCurrent} last: ${this.cviLast}`
  }
}

export class CVIUpdater extends Updater {
  values: { [name: string]: IndexValue } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const name in this.values) {
      this.checkIndexAlert(name, this.values[name])
    }
  }

  checkIndexAlert(name: string, value: IndexValue) {
    if (!value.cviLast) {
      return
    }
    const change = value.cviCurrent - value.cviLast
    const timeSincelastUpdate = new Date().getTime() - value.lastChange
    const changePercent = (change / value.cviLast) * 100
    const percentString = changePercent.toFixed(2)
    if (!value.alerted) {
      value.alerted = true
      this.send(
        'update',
        `${name} Index [${value.roundId}] changed ${percentString}% (${value.cviLast / 100} => ${
          value.cviCurrent / 100
        })`,
      )
      if (Math.abs(changePercent) > MAX_PERCENT_CVI_SPIKE) {
        this.send(
          'medium',
          `${name} Index spiked ${percentString}% (${value.cviLast / 100} => ${value.cviCurrent / 100})`,
        )
      }
    }
    if (timeSincelastUpdate > ORACLE_MULFUNCTION_TIME && value.cviCurrent == value.cviLast) {
      this.send(
        'high',
        `[${value.roundId}] ${name} Oracle mulfunction time since last update ${(timeSincelastUpdate / 60000).toFixed(
          2,
        )} minutes`,
      )
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`oracle newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      if (!(item.id in this.values)) {
        this.values[item.id] = new IndexValue(item.index)
      } else {
        this.values[item.id].newValue(item.index)
      }
    }
    await super.update()
  }
}
