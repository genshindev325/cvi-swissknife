import type { PointSummary } from '@coti-cvi/lw-sdk'
import { BlockchainName, CustomError, ErrorKind, oldCviIndexesV3AntonSortedTimeAsc, startTimer } from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import {
  chainToBlockchainName,
  CviHistoryDataEntity,
  MysqlDatabaseConnectionService,
  SentryService,
} from '@coti-cvi/common-be'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import type { PrometheusService } from '../prometheus/prometheus.service'
import _ from 'lodash'

const getOldDataFromAnton = () => ({
  dataAscTime: oldCviIndexesV3AntonSortedTimeAsc.slice(),
  highestTimestampMs: oldCviIndexesV3AntonSortedTimeAsc[oldCviIndexesV3AntonSortedTimeAsc.length - 1].time * 1000,
})

export class CviIndexesHistoryService implements OnModuleDestroy {
  private cviIndexHistoryDataDescDate: Record<
    BlockchainName,
    {
      byDay: {
        dataAscTime: PointSummary[]
        highestTimestampMs: number
      }
      byHour: {
        dataAscTime: PointSummary[]
        highestTimestampMs: number
      }
    }
  > = {
    [BlockchainName.ARBITRUM]: {
      byDay: getOldDataFromAnton(),
      byHour: getOldDataFromAnton(),
    },
    [BlockchainName.ETHEREUM]: {
      byDay: getOldDataFromAnton(),
      byHour: getOldDataFromAnton(),
    },
    [BlockchainName.POLYGON]: {
      byDay: getOldDataFromAnton(),
      byHour: getOldDataFromAnton(),
    },
  }

  private ethvolEthHistoryDataDescDate: {
    byDay: {
      dataAscTime: PointSummary[]
      highestTimestampMs: number
    }
    byHour: {
      dataAscTime: PointSummary[]
      highestTimestampMs: number
    }
  } = {
    byDay: { dataAscTime: [], highestTimestampMs: 0 },
    byHour: { dataAscTime: [], highestTimestampMs: 0 },
  }

  private mysqlHighestId = -1

  private readonly intervalId: NodeJS.Timeout

  private fetchedInitialCviIndexData = false

  private fetchedInitialEthvolData = false

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(SentryService) private readonly sentryService: SentryService,
    @Inject(MysqlDatabaseConnectionService) private mysqlDatabaseConnectionService: MysqlDatabaseConnectionService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
  ) {
    this.fetchData()
    this.intervalId = setInterval(() => this.fetchData(), 1000 * 60 * 10)
  }

  onModuleDestroy() {
    clearInterval(this.intervalId)
  }

  public didFetchedInitialData() {
    return this.fetchedInitialCviIndexData && this.fetchedInitialEthvolData
  }

  private fixData(data: PointSummary[]): PointSummary[] {
    return data.map((point, index) => {
      if (index === 0) {
        return point
      }
      return {
        ...point,
        open: data[index - 1].close,
      }
    })
  }

  private async fetchData() {
    try {
      await Promise.all([this.fetchCviIndexesDescDate(), this.fetchEthvolDescDate()])
    } catch (e) {
      this.sentryService.sendErrorToSentry(e as Error)
    }
  }

  private async fetchEthvolDescDate() {
    console.log(`${new Date().toISOString()} - data-feed periodically fetching ethvol data from defi.r-synergy.com`)
    const startFetch = startTimer()

    type Result = [time: string, open: number, high: number, low: number, close: number][]
    try {
      const [byDaySortedTimeAsc, byHourSortedTimeAsc] = await Promise.all([
        axios.get<Result>(`http://defi.r-synergy.com/V0043/ethvolohlcday/2000`),
        axios.get<Result>(`http://defi.r-synergy.com/V0043/ethvolohlchour/${24 * 31 * 3}`),
      ]).then(results => {
        const [byDaySortedTimeAsc, byHourSortedTimeAsc] = results.map(result =>
          this.fixData(
            result.data
              .map<PointSummary>(c => ({
                time: new Date(c[0]).getTime() / 1000,
                timeUtc: new Date(c[0]).toISOString(),
                open: Math.min(c[1], 200),
                high: Math.min(c[2], 200),
                low: Math.min(c[3], 200),
                close: Math.min(c[4], 200),
              }))
              .sort((a, b) => a.time - b.time),
          ),
        )
        return [byDaySortedTimeAsc, byHourSortedTimeAsc]
      })
      this.ethvolEthHistoryDataDescDate.byDay.dataAscTime = byDaySortedTimeAsc
      this.ethvolEthHistoryDataDescDate.byDay.highestTimestampMs =
        byDaySortedTimeAsc[byDaySortedTimeAsc.length - 1].time

      this.ethvolEthHistoryDataDescDate.byHour.dataAscTime = byHourSortedTimeAsc
      this.ethvolEthHistoryDataDescDate.byHour.highestTimestampMs =
        byHourSortedTimeAsc[byHourSortedTimeAsc.length - 1].time

      if (!this.fetchedInitialEthvolData) {
        this.logger.info(`fetched initial ethvol data from anton`)
        this.fetchedInitialEthvolData = true
      }
      this.prometheusService.cviHistoryIndexesRecurringFetchTotal
        .labels({ index_type: 'ethvol', success: 'true' })
        .inc()
      this.prometheusService.cviHistoryIndexesRecurringFetchDurationSeconds
        .labels({ index_type: 'ethvol', success: 'true' })
        .observe(startFetch())
    } catch (error) {
      this.logger.info(
        `error in fetchEthvolDescDate (check that anton's defi.r-synergy.com is up and running) - `,
        error,
      )
      this.prometheusService.cviHistoryIndexesRecurringFetchTotal
        .labels({ index_type: 'ethvol', success: 'false' })
        .inc()
      this.prometheusService.cviHistoryIndexesRecurringFetchDurationSeconds
        .labels({ index_type: 'ethvol', success: 'false' })
        .observe(startFetch())
    }
  }

  private async fetchCviIndexesDescDate() {
    const startFetch = startTimer()

    const rawCviIndexesFromMysql: Pick<CviHistoryDataEntity, 'id' | 'timestamp' | 'cvi' | 'chain'>[] =
      await this.mysqlDatabaseConnectionService.dataSource
        .getRepository(CviHistoryDataEntity)
        .createQueryBuilder('c')
        .select('c.id', 'id')
        .addSelect('c.timestamp', 'timestamp')
        .addSelect('c.cvi', 'cvi')
        .addSelect('c.chain', 'chain')
        .where(`c.id > ${this.mysqlHighestId}`)
        .orderBy({
          timestamp: 'DESC',
        })
        .getRawMany()

    const cviIndexesByBlockchain = _.chain(rawCviIndexesFromMysql)
      .groupBy(c => c.chain)
      .map((entities, chain: string) => {
        const cviIndexesFromMysql = entities.map<[date: Date, cviIndex: number]>(e => [
          new Date(e.timestamp * 1000),
          e.cvi,
        ])

        const blockchainName = chainToBlockchainName(chain)

        const groupByDay = this.groupByDataAscTime({
          rawData: cviIndexesFromMysql,
          groupByKey: 'day',
        })

        const groupByHour = this.groupByDataAscTime({
          rawData: cviIndexesFromMysql,
          groupByKey: 'hour',
        })

        return {
          blockchainName,
          cviIndexesByDay: groupByDay,
          cviIndexesByHour: groupByHour,
        }
      })
      .value()

    for (const { blockchainName, cviIndexesByDay, cviIndexesByHour } of cviIndexesByBlockchain) {
      const existingData = this.cviIndexHistoryDataDescDate[blockchainName]
      for (const newData of cviIndexesByDay) {
        if (existingData.byDay.dataAscTime.length === 0) {
          existingData.byDay.dataAscTime.push(newData)
          existingData.byDay.highestTimestampMs = newData.time
        } else {
          const last = existingData.byDay.dataAscTime[existingData.byDay.dataAscTime.length - 1]
          if (last.time < newData.time) {
            existingData.byDay.dataAscTime.push(newData)
            existingData.byDay.highestTimestampMs = newData.time
          } else {
            last.close = newData.close
            if (last.low > newData.low) {
              last.low = newData.low
            }
            if (last.high < newData.high) {
              last.high = newData.high
            }
          }
        }
      }
      for (const newData of cviIndexesByHour) {
        if (existingData.byHour.dataAscTime.length === 0) {
          existingData.byHour.dataAscTime.push(newData)
          existingData.byHour.highestTimestampMs = newData.time
        } else {
          const last = existingData.byHour.dataAscTime[existingData.byHour.dataAscTime.length - 1]
          if (last.time < newData.time) {
            existingData.byHour.dataAscTime.push(newData)
            existingData.byHour.highestTimestampMs = newData.time
          } else {
            last.close = newData.close
            if (last.low > newData.low) {
              last.low = newData.low
            }
            if (last.high < newData.high) {
              last.high = newData.high
            }
          }
        }
      }
    }

    this.fetchedInitialCviIndexData = true
    if (rawCviIndexesFromMysql.length > 0) {
      this.mysqlHighestId = rawCviIndexesFromMysql[0].id
    }

    this.prometheusService.cviHistoryIndexesRecurringFetchTotal.labels({ index_type: 'cvi', success: 'true' }).inc()
    this.prometheusService.cviHistoryIndexesRecurringFetchDurationSeconds
      .labels({ index_type: 'cvi', success: 'true' })
      .observe(startFetch())

    this.logger.info(`fetched new ${rawCviIndexesFromMysql.length} cvi indexes from mysql`)
  }

  private groupByDataAscTime({
    rawData,
    groupByKey,
  }: {
    rawData: [date: Date, index: number][]
    groupByKey: 'day' | 'hour'
  }): PointSummary[] {
    return this.fixData(
      _.chain(rawData)
        .groupBy((c): number => {
          if (groupByKey === 'day') {
            const dateCopy = new Date(c[0])
            dateCopy.setHours(0, 0, 0, 0)
            return dateCopy.getTime() / 1000
          } else {
            const dateCopy = new Date(c[0])
            dateCopy.setHours(c[0].getHours(), 0, 0, 0)
            return dateCopy.getTime() / 1000
          }
        })
        .map((entities, time): PointSummary => {
          const entitiesSortedTimeAsc = entities.sort((a, b) => a[0].getTime() - b[0].getTime())
          return {
            open: Number(entitiesSortedTimeAsc[0][1].toFixed(2)),
            close: Number(entitiesSortedTimeAsc[entitiesSortedTimeAsc.length - 1][1].toFixed(2)),
            low: Number(Math.min(...entitiesSortedTimeAsc.map(c => c[1])).toFixed(2)),
            high: Number(Math.max(...entitiesSortedTimeAsc.map(c => c[1])).toFixed(2)),
            time: Number(time),
            timeUtc: new Date(Number(time) * 1000).toISOString(),
          }
        })
        .value()
        .sort((a, b) => a.time - b.time),
    )
  }

  public getAllCviIndexesPerDay({
    fromTimestampMs = 0,
    blockchainName,
  }: {
    fromTimestampMs?: number
    blockchainName: BlockchainName
  }): {
    data: PointSummary[]
    highestTimestampMs: number
  } {
    return {
      data: this.cviIndexHistoryDataDescDate[blockchainName].byDay.dataAscTime.filter(
        r => fromTimestampMs < r.time * 1000,
      ),
      highestTimestampMs: this.cviIndexHistoryDataDescDate[blockchainName].byDay.highestTimestampMs,
    }
  }

  public getAllCviIndexesPerHour({
    fromTimestampMs = 0,
    blockchainName,
  }: {
    fromTimestampMs?: number
    blockchainName: BlockchainName
  }): {
    data: PointSummary[]
    highestTimestampMs: number
  } {
    return {
      data: this.cviIndexHistoryDataDescDate[blockchainName].byHour.dataAscTime.filter(
        r => fromTimestampMs < r.time * 1000,
      ),
      highestTimestampMs: this.cviIndexHistoryDataDescDate[blockchainName].byHour.highestTimestampMs,
    }
  }

  public getAllEthvolPerDay({
    fromTimestampMs = 0,
    blockchainName,
  }: {
    fromTimestampMs?: number
    blockchainName: BlockchainName
  }): {
    data: PointSummary[]
    highestTimestampMs: number
  } {
    if (blockchainName !== BlockchainName.ETHEREUM) {
      throw new CustomError({
        name: 'WrongBlockchain',
        message: 'Can request ethvol only for Ethereum blockchain',
        errorKind: ErrorKind.UserError,
        httpStatus: StatusCodes.BAD_REQUEST,
        extras: {
          blockchainName,
        },
      })
    }
    return {
      data: this.ethvolEthHistoryDataDescDate.byDay.dataAscTime.filter(r => fromTimestampMs < r.time * 1000),
      highestTimestampMs: this.ethvolEthHistoryDataDescDate.byDay.highestTimestampMs,
    }
  }

  public getAllEthvolPerHour({
    fromTimestampMs = 0,
    blockchainName,
  }: {
    fromTimestampMs?: number
    blockchainName: BlockchainName
  }): {
    data: PointSummary[]
    highestTimestampMs: number
  } {
    if (blockchainName !== BlockchainName.ETHEREUM) {
      throw new CustomError({
        name: 'WrongBlockchain',
        message: 'Can request ethvol only for Ethereum blockchain',
        errorKind: ErrorKind.UserError,
        httpStatus: StatusCodes.BAD_REQUEST,
        extras: {
          blockchainName,
        },
      })
    }
    return {
      data: this.ethvolEthHistoryDataDescDate.byHour.dataAscTime.filter(r => fromTimestampMs < r.time * 1000),
      highestTimestampMs: this.ethvolEthHistoryDataDescDate.byHour.highestTimestampMs,
    }
  }
}
