import { inject, injectable, optional } from 'inversify'
import type { AsyncQueueInversifyService } from './async-queue.inversify.service'
import type { BlockTag } from '@ethersproject/providers'
import type { BlockchainContractEventsCacheUtils } from './contracts-events'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { CVISupportedChainIds, IRedisInversifyService } from './types'
import { CHAIN_IDS_INFO, NetworkName } from './types'
import { getScore, sortEventsAsc, startTimer } from './util'
import type { LatestBlockInfoInversifyService } from './latest-block-info-events.inversify.service'
import _ from 'lodash'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { Contract } from 'ethers'
import pLimit from 'p-limit'
import millify from 'millify'

type EventName =
  | 'vt-submit'
  | 'vt-burn'
  | 'vt-mint'
  | 'vt-fulfill'
  | 'vt-liquidate'
  | 'vt-transfer'
  | 'vt-v2-swap'
  | 'tv-submit'
  | 'tv-deposit'
  | 'tv-withdraw'
  | 'tv-liquidate'

@injectable()
export class CacheInversifyService {
  private readonly inMemoryCache = new Map<string, string>()

  constructor(
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('AsyncQueueInversifyService') private readonly asyncQueueInversifyService: AsyncQueueInversifyService,
    @inject('BlockchainContractEventsCacheUtils')
    private readonly blockchainContractEventsCacheUtils: BlockchainContractEventsCacheUtils,
    @inject('RedisInversifyService')
    @optional()
    private readonly redisClient?: IRedisInversifyService,
  ) {}

  // @postConstruct()
  // async init() {
  //   const keys = await this.redisClient?.client.keys('*::events::*')
  //   await Promise.all(keys?.map(k => this.redisClient?.client.del(k)))
  //   console.log('stav1', keys?.length, keys)
  // }

  public async get<T>({
    key,
    address,
    blockTag,
    invalidationKey = '0',
    getFromBlockchain,
    skipQueue,
    debug = false,
  }: {
    key: string
    invalidationKey?: string
    blockTag?: BlockTag | Promise<BlockTag>
    address?: string | string[]
    getFromBlockchain: () => Promise<T>
    skipQueue?: boolean
    debug?: boolean
  }): Promise<T> {
    const blockNumber = await Promise.resolve(blockTag).then(r => {
      if (r === undefined || r === 'latest') {
        return undefined
      }
      if (typeof r === 'number') {
        return r
      }
      throw new Error(`blockTag can't be string (it must be equal to 'latest' or a number)`)
    })

    const useCache = this.blockchainContractEventsCacheUtils.shouldUseCache(blockNumber)

    const cacheKey = `${CHAIN_IDS_INFO[this.chainId].blockchainName}::${NetworkName.Mainnet}${
      blockNumber === undefined ? '' : `::blockNumber::${blockNumber}`
    }${
      address ? (Array.isArray(address) ? `::addresses::${address.join(',')}` : `::address::${address}`) : ''
    }::invalidationKey::${invalidationKey}::${key}`

    if (useCache) {
      const fromInMemory = this.inMemoryCache.get(cacheKey)
      if (fromInMemory !== undefined) {
        return JSON.parse(fromInMemory)
      }
      if (this.redisClient) {
        const fromRedis = await this.redisClient.client
          .get(cacheKey)
          .then(r => (r !== undefined && r !== null ? (JSON.parse(r) as T) : undefined))
        if (fromRedis !== undefined && fromRedis !== null) {
          this.inMemoryCache.set(cacheKey, JSON.stringify(fromRedis))
          return fromRedis
        }
      }
    }

    const currentBlockNumber = await this.latestBlockInfoInversifyService.getCurrentBlock().then(r => r.number)

    const getFromBlockchainWithLog = () => {
      if (debug) {
        console.log(
          `${new Date().toISOString()} - ${
            CacheInversifyService.name
          } - getting "${key}" from blockchain in block-number: ${
            blockNumber !== undefined
              ? `${blockNumber} (${Math.abs(currentBlockNumber - blockNumber)} blocks from latest)`
              : 0
          }${address ? `, address: ${address}` : ''}`,
        )
      }
      return getFromBlockchain()
    }

    const fromBlockchain = await (skipQueue
      ? getFromBlockchainWithLog()
      : this.asyncQueueInversifyService.push(() => getFromBlockchainWithLog(), key))

    if (useCache) {
      this.inMemoryCache.set(cacheKey, JSON.stringify(fromBlockchain))
      if (this.redisClient) {
        await this.redisClient.client.set(cacheKey, JSON.stringify(fromBlockchain))
      }
    }

    return fromBlockchain
  }

  private eventsKey({ key, invalidationKey = '0' }: { key: string; invalidationKey?: string }): string {
    return `${CHAIN_IDS_INFO[this.chainId].blockchainName}::${
      NetworkName.Mainnet
    }::invalidationKey::14-${invalidationKey}::events::${key}`
  }

  public async saveEvent<T extends { blockNumber: number; transactionIndex: number; logIndex: number }>({
    key,
    invalidationKey = '0',
    event,
  }: {
    key: EventName
    invalidationKey?: string
    event: T
  }): Promise<void> {
    if (CHAIN_IDS_INFO[this.chainId].networkName !== NetworkName.Mainnet || !this.redisClient) {
      return
    }

    if (this.redisClient) {
      const cacheKey = this.eventsKey({ key, invalidationKey })
      const score = getScore(event)
      // await this.redisClient.client.zadd(cacheKey, score, JSON.stringify(event))
      await this.redisClient.client.hset(cacheKey, score, JSON.stringify(event))
    }
  }

  public async getEvents<
    T extends { blockNumber: number; blockTimestamp: number; transactionIndex: number; logIndex: number },
  >({
    key,
    address,
    invalidationKey = '0',
    getFromBlockchain,
    skipQueue,
    fromBlockNumber,
    contract,
  }: {
    key: EventName
    address?: string
    invalidationKey?: string
    getFromBlockchain: (options: { fromBlockNumber: number; toBlockNumber?: number; address?: string }) => Promise<T[]>
    skipQueue?: boolean
    fromBlockNumber?: number
    contract: Contract
  }): Promise<T[]> {
    const overrideFromBlockNumber = Math.max(
      fromBlockNumber ?? 0,
      this.getContractInversifyService.getContractData(contract).creationBlock,
    )
    const client = this.redisClient?.client
    if (address || CHAIN_IDS_INFO[this.chainId].networkName !== NetworkName.Mainnet || !client) {
      return getFromBlockchain({ fromBlockNumber: 0, address })
    }

    const cacheKey = this.eventsKey({ key, invalidationKey })

    const e1 = startTimer()
    const r: string[] = await client.hvals(cacheKey)
    const receivedFromRedisSeconds = e1()
    const e2 = startTimer()
    const fromRedis: T[] = []
    for (const chunk of _.chunk(r, 1_000)) {
      const data = await new Promise<T[]>(resolve => setTimeout(() => resolve(chunk.map<T>(e => JSON.parse(e))), 50))
      fromRedis.push(...data)
    }
    const parsedSeconds = e2()

    const latestBlockNumberFromRedis = fromRedis.length === 0 ? 0 : Math.max(...fromRedis.map(e => e.blockNumber))
    const latestTsFromRedis = fromRedis.length === 0 ? 0 : Math.max(...fromRedis.map(e => e.blockTimestamp))

    console.log(
      `${new Date().toISOString()} - ${
        CacheInversifyService.name
      } - received from redis value of key: "${cacheKey}" from blockNumber: ${
        fromBlockNumber ?? 0
      } to blockNumber: ${latestBlockNumberFromRedis} (${new Date(
        latestTsFromRedis * 1000,
      ).toISOString()}) (received from redis: ${receivedFromRedisSeconds.toFixed(
        2,
      )}s, json-parse: ${parsedSeconds.toFixed(2)}s events: ${r.length}, ${(
        (_.sum(r.map(e => e.length)) * 2) /
        1024 /
        1024
      ).toFixed(2)}mb)`,
    )

    const currentBlockNumber = await this.latestBlockInfoInversifyService.getCurrentBlock().then(r => r.number)

    const getFromBlockchainWithLog = (options: {
      fromBlockNumber: number
      toBlockNumber?: number
      address?: string
      taskIndex: number
      totalTasks: number
    }) => {
      console.log(
        `${new Date().toISOString()} - ${CacheInversifyService.name} - ${options.taskIndex}/${
          options.totalTasks
        } task - getting "${key}" from blockchain from block-number: ${options.fromBlockNumber} (${millify(
          Math.abs(currentBlockNumber - options.fromBlockNumber),
        )} blocks from latest) to block-number: ${
          options.toBlockNumber !== undefined
            ? `${options.toBlockNumber} (${millify(
                Math.abs(currentBlockNumber - options.toBlockNumber),
              )} blocks from latest)`
            : 'latest'
        }${address ? `, address: ${address}` : ''}`,
      )
      return getFromBlockchain(options)
    }

    const get = async () => {
      const from = Math.max(overrideFromBlockNumber, latestBlockNumberFromRedis)

      if (
        key === 'tv-liquidate' ||
        key === 'vt-liquidate' ||
        from > this.getContractInversifyService.getContractData(contract).creationBlock
      ) {
        return getFromBlockchainWithLog({ fromBlockNumber: from, address, taskIndex: 1, totalTasks: 1 })
      }

      const to = (await this.latestBlockInfoInversifyService.getCurrentBlock()).number
      const interval = Math.floor((to - from) / (key === 'vt-transfer' ? 200 : 50))

      const limit = pLimit(10)

      const endTimer = startTimer()
      let completed = 0
      const results: T[] = await Promise.all(
        _.range(from, to, interval).map(async (from, index, ranges) => {
          const options = {
            fromBlockNumber: from,
            toBlockNumber: Math.min(from + interval, to) - (index < ranges.length ? 1 : 0),
            address,
            taskIndex: index + 1,
            totalTasks: ranges.length,
          }
          const endTimer = startTimer()
          const r = await limit(() => getFromBlockchainWithLog(options))
          completed++
          console.log(
            `${new Date().toISOString()} - ${CacheInversifyService.name} - ${completed}/${ranges.length} completed (${(
              (completed * 100) /
              ranges.length
            ).toFixed(2)}%) - received "${key}" from blockchain from block-number: ${
              options.fromBlockNumber
            } (${millify(
              Math.abs(currentBlockNumber - options.fromBlockNumber),
            )} blocks from latest) to block-number: ${options.toBlockNumber} (${millify(
              Math.abs(currentBlockNumber - options.toBlockNumber),
            )} blocks from latest)${address ? `, address: ${address}` : ''} - ${r.length} results (${endTimer().toFixed(
              1,
            )}s)`,
          )
          return r
        }),
      ).then(r => r.flat())

      console.log(
        `${new Date().toISOString()} - ${
          CacheInversifyService.name
        } - received "${key}" from blockchain from block-number: ${from} (${millify(
          Math.abs(currentBlockNumber - from),
        )} blocks from latest) to block-number: ${to} (${millify(
          Math.abs(currentBlockNumber - to),
        )} blocks from latest)${address ? `, address: ${address}` : ''} - ${
          results.length
        }  results (${endTimer().toFixed(1)}s)`,
      )

      return results
    }

    const fromBlockchain = await (skipQueue ? get() : this.asyncQueueInversifyService.push(() => get(), key))

    await Promise.all(fromBlockchain.map(event => this.saveEvent({ key, invalidationKey, event })))

    const events = fromRedis.concat(fromBlockchain).sort(sortEventsAsc)
    if (overrideFromBlockNumber === undefined) {
      return events
    } else {
      return events.filter(e => overrideFromBlockNumber <= e.blockNumber)
    }
  }
}
