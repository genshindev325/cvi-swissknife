import { inject, injectable, postConstruct } from 'inversify'
import type {
  GeneralInfoOfEventByAddress,
  GeneralInfoOfEvent,
  CviCacheEventsApiInversifyService,
} from '../../contracts-events'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { Address, Block } from '../../types'
import type {
  LatestGeneralInfoOfEventByAddressInfo,
  UpdateGeneralInfoOfEventAndAddresses,
  UpdateGeneralInfoOfEventOfAddress,
} from './types'
import { getScore, startTimer, toNumber } from '../../util'
import type { CacheInversifyService } from '../../cache.inversify.service'
import type { LatestBlockInfoInversifyService } from '../../latest-block-info-events.inversify.service'

@injectable()
export class LatestGeneralInfoOfEventByAddressInversifyService {
  private updatedBlock?: Block

  private updatedGeneralInfoOfEvent?: GeneralInfoOfEvent

  public readonly latestGeneralInfoOfEventByAddress = new Map<Address, LatestGeneralInfoOfEventByAddressInfo>()

  private cleanups: (() => void)[] = []

  private lastPromise?: Promise<void>

  constructor(
    @inject('IsTestMode')
    public readonly isTestMode: boolean,
    @inject('CacheInversifyService') public readonly cacheInversifyService: CacheInversifyService,
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('CviCacheEventsApiInversifyService')
    public readonly cviCacheEventsApiInversifyService: CviCacheEventsApiInversifyService,
  ) {}

  public isReady() {
    return (
      this.isTestMode ||
      Boolean(this.updatedBlock && this.updatedGeneralInfoOfEvent && this.latestGeneralInfoOfEventByAddress.size > 0)
    )
  }

  public isReadyDescription() {
    return {
      updatedBlock: this.updatedBlock ? `fetched` : 'Loading...',
      updatedGeneralInfoOfEvent: this.updatedGeneralInfoOfEvent ? `fetched` : 'Loading...',
      latestGeneralInfoOfEventByAddressSize_needs_to_be_greater_than_0: this.latestGeneralInfoOfEventByAddress.size,
    }
  }

  public getUpdateGeneralInfoOfEventAndAddresses(): UpdateGeneralInfoOfEventAndAddresses {
    if (!this.updatedBlock || !this.updatedGeneralInfoOfEvent) {
      throw new Error(`${LatestGeneralInfoOfEventByAddressInversifyService.name} not ready!`)
    }
    return {
      block: this.updatedBlock,
      generalInfoOfEvent: this.updatedGeneralInfoOfEvent,
      updatedGeneralInfoOfEventByAddress: Array.from(
        this.latestGeneralInfoOfEventByAddress.entries(),
      ).map<UpdateGeneralInfoOfEventOfAddress>(([address, info]) => ({
        address,
        generalInfoOfEventByAddress: info.generalInfoOfEventByAddress,
      })),
    }
  }

  public setLatestGeneralInfoOfEvent({
    address,
    blockNumber,
    transactionIndex,
    logIndex,
    generalInfoOfEventByAddress,
  }: {
    address: string
    blockNumber: number
    transactionIndex: number
    logIndex: number
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
  }) {
    const r = this.latestGeneralInfoOfEventByAddress.get(address)
    if (!r || getScore(r) < getScore({ blockNumber, transactionIndex, logIndex })) {
      this.latestGeneralInfoOfEventByAddress.set(address, {
        blockNumber,
        transactionIndex,
        logIndex,
        generalInfoOfEventByAddress,
      })
    }
  }

  private runAgain = false

  private lastRunDateMs = 0

  public fetchUpdateGeneralInfoOfEventByAddress = async () => {
    if (Date.now() - this.lastRunDateMs <= 1000 * 60 * 60) {
      return
    }
    if (this.lastPromise) {
      this.runAgain = true
      return
    }
    try {
      this.lastRunDateMs = Date.now()
      this.lastPromise = this.updateGeneralInfoOfEventByAddress()
      await this.lastPromise
      if (this.runAgain) {
        this.runAgain = false
        this.lastPromise = this.updateGeneralInfoOfEventByAddress()
        await this.lastPromise
      }
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    } finally {
      this.lastPromise = undefined
    }
  }

  @postConstruct()
  async init() {
    if (!this.isTestMode) {
      const id1 = setInterval(this.fetchUpdateGeneralInfoOfEventByAddress, 1000 * 60 * 60)
      this.cleanups.push(() => clearInterval(id1))
    }
  }

  private async updateGeneralInfoOfEventByAddress() {
    const e = startTimer()

    console.log(
      `${new Date().toISOString()} - ${
        LatestGeneralInfoOfEventByAddressInversifyService.name
      }: start polling updateGeneralInfoOfEventByAddress`,
    )

    const latestBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()
    let completed = 0
    let callsToAlchemy = 1
    let lastLogMs = 0
    const [generalInfoOfEvent, newData] = await Promise.all([
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEvent(latestBlock.number).finally(() => {
        callsToAlchemy++
      }),
      Promise.all(
        Array.from(this.latestGeneralInfoOfEventByAddress.entries()).map(async ([address, info], index, array) => {
          const [vtCviBalance, vtCviUsdcLpTokens] = await Promise.all([
            info.generalInfoOfEventByAddress.vtCvix1BalanceInUsdc <= 1
              ? info.generalInfoOfEventByAddress.vtCviBalance
              : this.cacheInversifyService.get({
                  key: `vtCviBalance`,
                  blockTag: latestBlock.number,
                  address,
                  getFromBlockchain: async () => {
                    callsToAlchemy++
                    return this.cviCacheEventsApiInversifyService.tokenCvi.toNumber(
                      await this.cviCacheEventsApiInversifyService.tokenCvi.getBalance(address, latestBlock.number),
                    )
                  },
                }),
            info.generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc <= 1
              ? info.generalInfoOfEventByAddress.vtCviUsdcLpTokens
              : this.cacheInversifyService.get({
                  key: `vtCviUsdcLpTokens`,
                  blockTag: latestBlock.number,
                  address,
                  getFromBlockchain: async () => {
                    callsToAlchemy++
                    return toNumber(
                      await this.cviCacheEventsApiInversifyService.pairContract
                        .contract(this.cviCacheEventsApiInversifyService.provider)
                        .balanceOf(address, { blockTag: latestBlock.number }),
                      this.cviCacheEventsApiInversifyService.pairContract.decimals,
                    )
                  },
                }),
          ])
          completed++
          if (Date.now() - lastLogMs >= 100 || completed === array.length) {
            console.log(
              `${new Date().toISOString()} - ${LatestGeneralInfoOfEventByAddressInversifyService.name} - ${completed}/${
                array.length
              } users (${((completed * 100) / array.length).toFixed(
                2,
              )}%) - polling updateGeneralInfoOfEventByAddress - fetched data for address: ${address}`,
            )
            lastLogMs = Date.now()
          }
          return {
            address,
            info,
            vtCviBalance,
            vtCviUsdcLpTokens,
          }
        }),
      ),
    ])

    this.updatedBlock = latestBlock
    this.updatedGeneralInfoOfEvent = generalInfoOfEvent.generalInfoOfEvent

    for (const { address, info, vtCviBalance, vtCviUsdcLpTokens } of newData) {
      this.setLatestGeneralInfoOfEvent({
        address,
        blockNumber: latestBlock.number,
        transactionIndex: 0,
        logIndex: 0,
        generalInfoOfEventByAddress: this.cviCacheEventsApiInversifyService.calculateGeneralInfoOfEventByAddress({
          generalInfoOfEvent: generalInfoOfEvent.generalInfoOfEvent,
          tvCvix1Balance: info.generalInfoOfEventByAddress.tvCvix1Balance,
          usdcBalance: info.generalInfoOfEventByAddress.usdcBalance,
          vtCviBalance,
          vtCviUsdcLpTokens,
        }),
      })
    }

    console.log(
      `${new Date().toISOString()} - ${
        LatestGeneralInfoOfEventByAddressInversifyService.name
      }: ended polling updateGeneralInfoOfEventByAddress with ${callsToAlchemy} calls to alchemy (${e().toFixed(2)}s)`,
    )
  }
}
