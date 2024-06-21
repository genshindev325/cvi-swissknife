/* eslint-disable @typescript-eslint/no-use-before-define */
import logger from '../utils/logger'
import type { Fetcher } from '../fetchers'
import { sendMessage } from '../bot/bot'

const alerts: { [severity: string]: { header: string; chat: string } } = {
  update: { header: 'Update', chat: 'updates' },
  low: { header: 'CVI Report', chat: 'alerts' },
  medium: { header: 'CVI Notification', chat: 'alerts' },
  high: { header: 'CVI High severity Notification', chat: 'alerts' },
  critical: { header: 'CVI Critical alert', chat: 'alerts' },
}

export abstract class Updater {
  fetcher: Fetcher

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher
  }

  async update(): Promise<void> {
    this.checkAlert()
  }

  abstract checkAlert(): void

  send(severity: string, message: string) {
    const alert = alerts[severity]
    if (!alert) {
      throw Error(`[${getNow()}] unrecognized severity level: ${severity}`)
    }
    logger.debug(`[${getNow()}] ${this.fetcher.chain} [${severity} severity] ${message}`)
    sendMessage(`${this.fetcher.chain} ${alert.header} - ${message}`, alert.chat)
  }
}

function getNow() {
  return new Date().toLocaleString()
}
