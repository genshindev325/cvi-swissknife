import { inject, injectable, postConstruct, preDestroy } from 'inversify'
import type { VtContractsEventsInversifyService } from '../../contracts-events'
import type {
  GroupFormattedVolatilityTokensEvents,
  FormattedVtSubmitRequestEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtBurnEvent,
  FormattedVtMintEvent,
  GroupFormattedCviEvents,
} from '../../contracts-events'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { Address, IERC20, TokenName } from '../../types'
import type { TvSupportedChainIds } from '../../types'
import type { Token } from '../../token'
import type { CviContractsInversifyService } from '../../cvi-contracts'
import { getScore, sortEventsAsc, startTimer } from '../../util'
import type { LatestGeneralInfoOfEventByAddressInversifyService } from './latest-general-info-of-event-by-address.inversify.service'

export type VTEventsByRequestIdEvents = {
  readonly VtSubmitEvent: FormattedVtSubmitRequestEvent[]
  readonly VtLiquidateEvent: FormattedVtLiquidateRequestEvent[]
  readonly VtFulfillEvent: FormattedVtFulfillRequestEvent[]
  readonly VtMintEvent: FormattedVtMintEvent[]
  readonly VtBurnEvent: FormattedVtBurnEvent[]
}

@injectable()
export class CviAdminApiVolatilityTokensInversifyService {
  public readonly data = new Map<string, GroupFormattedVolatilityTokensEvents | GroupFormattedCviEvents>()

  public readonly addressToEventsAsc = new Map<
    Address,
    (GroupFormattedVolatilityTokensEvents | GroupFormattedCviEvents)[]
  >()

  private readonly cleanups: (() => unknown | Promise<unknown>)[] = []

  private lastPromise?: Promise<void>

  private pullingVtEventsFromBlockNumber = 0

  constructor(
    @inject('IsTestMode')
    public readonly isTestMode: boolean,
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('LatestGeneralInfoOfEventByAddressInversifyService')
    private readonly latestGeneralInfoOfEventByAddressInversifyService: LatestGeneralInfoOfEventByAddressInversifyService,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('VtContractsEventsInversifyService')
    private readonly vtContractsEventsInversifyService: VtContractsEventsInversifyService,
    @inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCVolatilityToken') public readonly tokencvix2: Token<IERC20, TokenName.CVI>,
  ) {
    const vtSubmitRequestListener = () => {
      this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'VtSubmitRequestEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'VtSubmitRequestEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    vtSubmitRequestListener()

    const vtBurnEventListener = () => {
      this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.on('VtBurnEvent', this.pushEvent.bind(this))

      this.cleanups.push(() =>
        this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'VtBurnEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    vtBurnEventListener()

    const vtMintEventListener = () => {
      this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.on('VtMintEvent', this.pushEvent.bind(this))

      this.cleanups.push(() =>
        this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'VtMintEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    vtMintEventListener()

    const vtFulfillRequestEventListener = () => {
      this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'VtFulfillRequestEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'VtFulfillRequestEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    vtFulfillRequestEventListener()

    const vtLiquidateRequestEventListener = () => {
      this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'VtLiquidateRequestEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.vtContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'VtLiquidateRequestEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    vtLiquidateRequestEventListener()

    const requestEventStop1 = this.vtContractsEventsInversifyService.registerNewVtSubmitRequestEvent()
    this.cleanups.push(requestEventStop1)

    const requestEventStop2 = this.vtContractsEventsInversifyService.registerNewVtMintEvent()
    this.cleanups.push(requestEventStop2)

    const requestEventStop3 = this.vtContractsEventsInversifyService.registerNewVtBurnEvent()
    this.cleanups.push(requestEventStop3)

    const requestEventStop4 = this.vtContractsEventsInversifyService.registerNewVtFulfillRequestEvent()
    this.cleanups.push(requestEventStop4)

    const requestEventStop5 = this.vtContractsEventsInversifyService.registerNewVtLiquidateRequestEvent()
    this.cleanups.push(requestEventStop5)

    this.vtContractsEventsInversifyService.realTimeCviEventEmitter.on('VtCviTransferEvent', this.pushEvent.bind(this))

    this.cleanups.push(() =>
      this.vtContractsEventsInversifyService.realTimeCviEventEmitter.off(
        'VtCviTransferEvent',
        this.pushEvent.bind(this),
      ),
    )

    const cviEventStop1 = this.vtContractsEventsInversifyService.registerNewVtCviTransferEvent()
    this.cleanups.push(cviEventStop1)

    this.vtContractsEventsInversifyService.realTimeCviEventEmitter.on(
      'VtCviUniswapSwapEvent',
      this.pushEvent.bind(this),
    )

    this.cleanups.push(() =>
      this.vtContractsEventsInversifyService.realTimeCviEventEmitter.off(
        'VtCviUniswapSwapEvent',
        this.pushEvent.bind(this),
      ),
    )

    const cviEventStop2 = this.vtContractsEventsInversifyService.registerNewVtCviUniswapSwapEvent()
    this.cleanups.push(cviEventStop2)

    this.cleanups.push(() => this.lastPromise)
  }

  private pushEvent = (event: GroupFormattedVolatilityTokensEvents | GroupFormattedCviEvents) => {
    const id = getScore(event).toString()
    if (!this.data.has(id)) {
      this.data.set(id, event)
      if (event.type === 'VtCviTransferEvent') {
        const fromAddressEvents = this.addressToEventsAsc.get(event.args.fromAccount) ?? []
        fromAddressEvents.push(event)
        fromAddressEvents.sort(sortEventsAsc)
        this.addressToEventsAsc.set(event.args.fromAccount, fromAddressEvents)
        const toAddressEvents = this.addressToEventsAsc.get(event.args.toAccount) ?? []
        toAddressEvents.push(event)
        toAddressEvents.sort(sortEventsAsc)
        this.addressToEventsAsc.set(event.args.toAccount, toAddressEvents)
      } else {
        const addressEvents = this.addressToEventsAsc.get(event.args.account) ?? []
        addressEvents.push(event)
        addressEvents.sort(sortEventsAsc)
        this.addressToEventsAsc.set(event.args.account, addressEvents)
      }
      if (event.type === 'VtCviTransferEvent') {
        this.latestGeneralInfoOfEventByAddressInversifyService.setLatestGeneralInfoOfEvent({
          address: event.args.fromAccount,
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex,
          logIndex: event.logIndex,
          generalInfoOfEventByAddress: event.args.generalInfoOfEventBySender,
        })
        this.latestGeneralInfoOfEventByAddressInversifyService.setLatestGeneralInfoOfEvent({
          address: event.args.toAccount,
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex,
          logIndex: event.logIndex,
          generalInfoOfEventByAddress: event.args.generalInfoOfEventByReceiver,
        })
      } else {
        this.latestGeneralInfoOfEventByAddressInversifyService.setLatestGeneralInfoOfEvent({
          address: event.args.account,
          blockNumber: event.blockNumber,
          transactionIndex: event.transactionIndex,
          logIndex: event.logIndex,
          generalInfoOfEventByAddress: event.args.generalInfoOfEventByAddress,
        })
      }
    }
  }

  public isReady() {
    return this.isTestMode || this.data.size > 0
  }

  public isReadyDescription() {
    return {
      dataSize_needs_to_be_greater_than_0: this.data.size,
    }
  }

  private pollingGetRequestEvents = async () => {
    if (this.lastPromise) {
      return
    }
    try {
      this.lastPromise = this.getRequestEvents()
      await this.lastPromise
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    } finally {
      this.lastPromise = undefined
    }
  }

  @postConstruct()
  async init() {
    if (!this.isTestMode) {
      // this.intervalId = setInterval(() => this.pollingGetRequestEvents(), 1000 * 60)
      // this.cleanups.push(() => {
      //   if (this.intervalId) {
      //     return clearInterval(this.intervalId)
      //   }
      // })
      this.pollingGetRequestEvents()
    }
  }

  @preDestroy()
  async destroy() {
    await Promise.all(this.cleanups.map(cleanup => cleanup()))
  }

  private async getRequestEvents() {
    try {
      const e = startTimer()

      const fromBlockNumber = this.pullingVtEventsFromBlockNumber

      console.log(
        `${
          CviAdminApiVolatilityTokensInversifyService.name
        } - ${new Date().toISOString()} - start fetching vt events from blockNumber ${fromBlockNumber}`,
      )

      const baseEvents = await this.vtContractsEventsInversifyService.getBaseEvents(undefined, true, {
        fromBlockNumber,
        trasferAndSwapEvents: true,
      })

      for (const e of baseEvents.allEventsIncludingTransfersAndSwaps) {
        this.pushEvent(e)
        if (this.pullingVtEventsFromBlockNumber < e.blockNumber) {
          this.pullingVtEventsFromBlockNumber = e.blockNumber + 1
        }
      }

      await this.latestGeneralInfoOfEventByAddressInversifyService.fetchUpdateGeneralInfoOfEventByAddress()

      console.log(
        `${CviAdminApiVolatilityTokensInversifyService.name} - ${new Date().toISOString()} - fetched ${
          baseEvents.allEvents.length
        } vt events from blockNumber: ${fromBlockNumber}. new from-blockNumber for next polling: ${
          this.pullingVtEventsFromBlockNumber
        } (${e().toFixed(2)}s)`,
      )
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    }
  }
}
