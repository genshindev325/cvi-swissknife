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

const PERCENT_SPIKE = 10
const BIG_PERCENT_SPIKE = 50
const SILENT_TIME_PERIOD = 86400000

interface PlatformUsers {
  lastUsersValue?: UsersValue
  currUsersValue?: UsersValue
  lastAlert: number
}

interface UsersValue {
  timestamp: number
  value: number
}

export class UsersUpdater extends Updater {
  users: { [name: string]: PlatformUsers } = {}

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  checkAlert() {
    for (const name in this.users) {
      this.checkUsersAlert(name, this.users[name])
    }
  }

  async update() {
    const newValue = await this.fetcher.fetch()
    logger.info(`users newValue: ${JSON.stringify(newValue)}`)
    for (const item of newValue) {
      if (!(item.id in this.users)) {
        this.users[item.id] = { lastAlert: 0 }
      }
      this.updateUsers(item.id, item.accounts, this.users[item.id])
    }
    await super.update()
  }

  updateUsers(name: string, newValue: any, users: PlatformUsers) {
    if (users.currUsersValue) {
      users.lastUsersValue = users.currUsersValue
    }
    users.currUsersValue = { timestamp: new Date().getTime(), value: newValue }
    logger.info(`[${name}] curr ${JSON.stringify(users.currUsersValue)} last ${JSON.stringify(users.lastUsersValue)}`)
  }

  checkUsersAlert(name: string, users: PlatformUsers) {
    if (!users.lastUsersValue) {
      return
    }
    const last = users.lastUsersValue.value
    // @ts-ignore
    const curr = users.currUsersValue.value
    const change = curr - last
    const changePercent = last > 0 ? (change / last) * 100 : 0
    if (change != 0) {
      this.send('update', `${name} Platform active users changed ${changePercent.toFixed(2)}% (${last} => ${curr})`)
    }
    if (new Date().getTime() > users.lastAlert + SILENT_TIME_PERIOD) {
      if (changePercent < -BIG_PERCENT_SPIKE) {
        this.send(
          'medium',
          `${name} Platform active users spiked in the last 24 hours ${changePercent.toFixed(2)}% (${last} => ${curr})`,
        )
        users.lastAlert = new Date().getTime()
      } else if (changePercent < -PERCENT_SPIKE) {
        this.send(
          'low',
          `${name} Platform active users spiked in the last 24 hours ${changePercent.toFixed(2)}% (${last} => ${curr})`,
        )
        users.lastAlert = new Date().getTime()
      }
    }
  }
}
