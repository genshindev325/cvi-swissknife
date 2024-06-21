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

const PERCENT_SPIKE = 0

interface TurbulenceValue {
  current: number
  last?: number
}

export class TurbulenceUpdater extends Updater {
  values: { [name: string]: TurbulenceValue } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const name in this.values) {
      this.checkTurbulenceAlert(name, this.values[name])
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`turbulence newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      if (!(item.id in this.values)) {
        this.values[item.id] = { current: item.turbulence }
      } else {
        this.updateTurbulence(item.id, item.turbulence, this.values[item.id])
      }
    }
    await super.update()
  }

  updateTurbulence(name: string, newValue: any, value: TurbulenceValue) {
    value.last = value.current
    value.current = +newValue
    logger.info(`[${name}] curr ${value.current} last ${value.last}`)
  }

  checkTurbulenceAlert(name: string, value: TurbulenceValue) {
    if (value.last == undefined) {
      return
    }
    const change = value.current - value.last
    if (change != 0) {
      this.send('update', `${name} Platform turbulence changed by ${change}% (${value.last}% => ${value.current}%)`)
    }
    if (Math.abs(change) > PERCENT_SPIKE) {
      this.send('medium', `${name} Platform turbulence changed by ${change}% (${value.last}% => ${value.current}%)`)
    }
  }
}
