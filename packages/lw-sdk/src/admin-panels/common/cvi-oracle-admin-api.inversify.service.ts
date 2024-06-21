import { inject, injectable, postConstruct, preDestroy } from 'inversify'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import { startTimer } from '../../util'
import type { FormattedCviOracleAnswerUpdateEvent } from '../../contracts-events'
import type { CviOracleContractsEventsInversifyService } from '../../contracts-events'
import type { CVISupportedChainIds } from '../../types'
import { oldCviIndexesV3AntonSortedTimeAsc } from './anton-data-cvi-indexes-v3'
import type { GetCviOracleHistoryDataQuery } from '../cvi-admin-panel'
import _ from 'lodash'

export type CviOracleIndexValueArgsType = {
  timestamp: number
  value: number
}

export type MinimalCviOracleEvent = {
  events: CviOracleIndexValueArgsType[]
  lastBlockTimestamp?: number
}

export type MinimalCviOracleOhlcEvent = {
  events: [timestamp: number, open: number, high: number, low: number, close: number, volumeUsdc: number][]
  lastBlockTimestamp?: number
}

@injectable()
export class CviOracleAdminApiInversifyService {
  public readonly data = new Map<string, FormattedCviOracleAnswerUpdateEvent>()

  private antonEvents: CviOracleIndexValueArgsType[] = []

  private readonly cleanups: (() => unknown | Promise<unknown>)[] = []

  constructor(
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('IsTestMode')
    public readonly isTestMode: boolean,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('CviOracleContractsEventsInversifyService')
    private readonly cviOracleContractsEventsInversifyService: CviOracleContractsEventsInversifyService,
  ) {
    this.antonEvents = oldCviIndexesV3AntonSortedTimeAsc.map<CviOracleIndexValueArgsType>(e => ({
      timestamp: e.time,
      value: e.close,
    }))

    const cviOracleEventListener = () => {
      this.cviOracleContractsEventsInversifyService.realTimeEventEmitter.on(
        'CviOracleAnswerEvent',
        this.pushCviOracleEvent.bind(this),
      )
    }
    cviOracleEventListener()

    const requestEventStop1 = this.cviOracleContractsEventsInversifyService.registerNewCviOracleEvent()
    this.cleanups.push(requestEventStop1)
  }

  private pushCviOracleEvent = (event: FormattedCviOracleAnswerUpdateEvent) => {
    const id = `${event.type}::${event.blockNumber}::${event.transactionIndex}::${event.logIndex}::${event.args.cviRoundId}`
    this.data.set(id, event)
  }

  private getDataSortedAsc() {
    return [...this.data.values()].sort((a, b) => a.blockNumber - b.blockNumber)
  }

  @postConstruct()
  async init() {
    if (!this.isTestMode) {
      await Promise.all([this.fetchCviOracleEvents()]).then(() => {
        //
      })
    }
  }

  @preDestroy()
  async destroy() {
    await Promise.all(this.cleanups.map(cleanup => cleanup()))
  }

  public getLastCviOracleEvent() {
    return this.getDataSortedAsc()[this.data.size - 1]
  }

  public getMinimalCviOracleEvents(options: GetCviOracleHistoryDataQuery): MinimalCviOracleEvent {
    const fromTimestamp =
      options.fromBlockTimestamp === 0 || options.fromBlockTimestamp === undefined
        ? undefined
        : options.fromBlockTimestamp
    const toTimestamp =
      options.toBlockTimestamp === undefined ? undefined : options.toBlockTimestamp === 0 ? 0 : options.toBlockTimestamp

    const cviDataList = _.chain(this.antonEvents)
      .concat(
        [...this.data.values()].map<CviOracleIndexValueArgsType>(e => ({
          timestamp: e.blockTimestamp,
          value: e.args.cviIndex,
        })),
      )
      .filter(e => {
        if (fromTimestamp !== undefined && e.timestamp < fromTimestamp) {
          return false
        }

        if (toTimestamp !== undefined && e.timestamp > toTimestamp) {
          return false
        }

        return true
      })
      .groupBy(e => {
        if (options.groupBy === 'day') {
          const dateCopy = new Date(e.timestamp * 1000)
          dateCopy.setHours(0, 0, 0, 0)
          return dateCopy.getTime() / 1000
        } else if (options.groupBy === 'hour') {
          const dateCopy = new Date(e.timestamp * 1000)
          dateCopy.setHours(dateCopy.getHours(), 0, 0, 0)
          return dateCopy.getTime() / 1000
        } else {
          return e.timestamp
        }
      })
      .map(e => e.sort((a, b) => a.timestamp - b.timestamp))
      .map<CviOracleIndexValueArgsType>(e => ({
        timestamp: e[0].timestamp,
        value: e[0].value,
      }))
      .sort((a, b) => a.timestamp - b.timestamp) // by timestamp (asc)
      .value()

    return {
      events: cviDataList,
      lastBlockTimestamp: cviDataList.length > 0 ? cviDataList[cviDataList.length - 1].timestamp : undefined,
    }
  }

  public getMinimalCviOracleEventsOhlc(options: GetCviOracleHistoryDataQuery): MinimalCviOracleOhlcEvent {
    const fromTimestamp =
      options.fromBlockTimestamp === 0 || options.fromBlockTimestamp === undefined
        ? undefined
        : options.fromBlockTimestamp
    const toTimestamp =
      options.toBlockTimestamp === undefined ? undefined : options.toBlockTimestamp === 0 ? 0 : options.toBlockTimestamp

    const cviDataList = _.chain(this.antonEvents)
      .concat(
        [...this.data.values()].map<CviOracleIndexValueArgsType>(e => ({
          timestamp: e.blockTimestamp,
          value: e.args.cviIndex,
        })),
      )
      .filter(e => {
        if (fromTimestamp !== undefined && e.timestamp < fromTimestamp) {
          return false
        }

        if (toTimestamp !== undefined && e.timestamp > toTimestamp) {
          return false
        }

        return true
      })
      .groupBy(e => {
        if (options.groupBy === 'day') {
          const dateCopy = new Date(e.timestamp * 1000)
          dateCopy.setHours(0, 0, 0, 0)
          return dateCopy.getTime() / 1000
        } else if (options.groupBy === 'hour') {
          const dateCopy = new Date(e.timestamp * 1000)
          dateCopy.setHours(dateCopy.getHours(), 0, 0, 0)
          return dateCopy.getTime() / 1000
        } else {
          return e.timestamp
        }
      })
      .map(e => e.sort((a, b) => a.timestamp - b.timestamp))
      .map<MinimalCviOracleOhlcEvent['events'][0]>(e => [
        e[0].timestamp,
        e[0].value,
        Math.max(...e.map(e1 => e1.value)),
        Math.min(...e.map(e1 => e1.value)),
        e[e.length - 1].value,
        0,
      ])
      .sort((a, b) => a[0] - b[0]) // by timestamp (asc)
      .value()

    return {
      events: cviDataList,
      lastBlockTimestamp: cviDataList.length > 0 ? cviDataList[cviDataList.length - 1][0] : undefined,
    }
  }

  private async fetchCviOracleEvents() {
    try {
      const e = startTimer()

      const allEvents = await this.cviOracleContractsEventsInversifyService.getBaseEvents()

      for (const e of allEvents) {
        this.pushCviOracleEvent(e)
      }

      console.log(
        `${CviOracleAdminApiInversifyService.name} - ${new Date().toISOString()} - fetched ${
          allEvents.length
        } cvi oracle events (${e().toFixed(2)}s)`,
      )
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    }
  }
}
