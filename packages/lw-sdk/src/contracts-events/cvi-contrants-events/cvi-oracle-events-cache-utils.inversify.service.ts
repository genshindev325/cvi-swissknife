import { inject, injectable, optional } from 'inversify'
import type { BlockchainEventBase } from '../types'
import { ChainId, CHAIN_IDS_INFO, NetworkName } from '../../types'
import type { RedisInvalidationKeysValue, CVISupportedChainIds, IRedisInversifyService } from '../../types'
import type { Event } from 'ethers'
import type { GetForkNumberInversifyService } from '../../util'
import { safeObjectEntries } from '../../util'
import type { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'
import type { FormattedCviOracleAnswerUpdateEvent } from '../cvi-oracle-types'

type BlockNumber = number
type TransactionIndex = number
type LogIndex = number

type BlockchainEventsTypes = FormattedCviOracleAnswerUpdateEvent

@injectable()
export class BlockchainContractEventsCacheUtils {
  private readonly inMemoryCacheOfBlockchainEvents = new Map<
    `${BlockNumber}::${TransactionIndex}::${LogIndex}::${RedisInvalidationKeysValue}`,
    BlockchainEventsTypes
  >()

  constructor(
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('GetForkNumberInversifyService')
    @optional()
    private readonly getForkNumberInversifyService?: GetForkNumberInversifyService,
    @inject('RedisInversifyService') @optional() private readonly redisClient?: IRedisInversifyService,
  ) {}

  public formatBaseEvent(e: Event): BlockchainEventBase {
    return {
      blockNumber: e.blockNumber,
      transactionIndex: e.transactionIndex,
      transactionHash: e.transactionHash,
      logIndex: e.logIndex,
    }
  }

  public getChainIdKey(chainId: ChainId): keyof typeof ChainId {
    const chainIdKey = safeObjectEntries(ChainId).find(e => e[1] === chainId)?.[0]
    if (!chainIdKey) {
      throw new Error(`unsupported chainId: ${chainId}`)
    }
    return chainIdKey
  }

  public getRedisHsetKey(blockNumber: number, customKey = '') {
    return `${CHAIN_IDS_INFO[this.chainId].blockchainName}::${
      NetworkName.Mainnet
    }::blockNumber::${blockNumber}::${customKey}`
  }

  public shouldUseCache(blockNumber?: number | 'latest') {
    if (blockNumber === undefined || blockNumber === 'latest') {
      return false
    }
    if (!this.redisClient) {
      return false
    }
    if (CHAIN_IDS_INFO[this.chainId].networkName === NetworkName.Mainnet) {
      return true
    }
    return (
      this.getForkNumberInversifyService !== undefined &&
      this.getForkNumberInversifyService.stagingNodeForkBlockNumber !== undefined &&
      blockNumber < this.getForkNumberInversifyService.stagingNodeForkBlockNumber
    )
  }

  public async getCviOracleEventsFromCache(cacheInvalidationKey: RedisInvalidationKeysValue) {
    const filterPredicate = (e: BlockchainEventsTypes) => this.shouldUseCache(e.blockNumber)

    if (this.redisClient) {
      try {
        const eventsRecord = await this.redisClient.client.hgetall(cacheInvalidationKey)
        return (Object.values(eventsRecord).map(v => JSON.parse(v)) as BlockchainEventsTypes[])
          .sort((a, b) => a.blockNumber - b.blockNumber)
          .filter(filterPredicate)
      } catch (error) {
        this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      }
    }

    return []
  }

  public async saveCviOracleEvent(
    redisCacheInvalidationKey: RedisInvalidationKeysValue,
    e: BlockchainEventsTypes,
  ): Promise<void> {
    if (
      this.shouldUseCache(e.blockNumber) &&
      !this.inMemoryCacheOfBlockchainEvents.get(
        `${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${redisCacheInvalidationKey}`,
      )
    ) {
      this.inMemoryCacheOfBlockchainEvents.set(
        `${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${redisCacheInvalidationKey}`,
        e,
      )

      if (this.redisClient) {
        try {
          await this.redisClient.client.hset(
            redisCacheInvalidationKey,
            this.getRedisHsetKey(e.blockNumber),
            JSON.stringify(e),
          )
        } catch (error) {
          this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        }
      }
    }
  }
}
