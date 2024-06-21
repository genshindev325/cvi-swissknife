import { inject, injectable, postConstruct, preDestroy } from 'inversify'
import type { TvContractsEventsInversifyService } from '../../contracts-events'
import type {
  FormattedTvFulfillDepositEvent,
  FormattedTvFulfillWithdrawEvent,
  FormattedTvLiquidateEvent,
  FormattedTvSubmitEvent,
  GroupFormattedThetaVaultsEvents,
  GeneralInfoOfEventByAddress,
} from '../../contracts-events'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { Address } from '../../types'
import type { CviContractsInversifyService } from '../../cvi-contracts'
import { sortEventsAsc, startTimer } from '../../util'
import type { LatestGeneralInfoOfEventByAddressInversifyService } from './latest-general-info-of-event-by-address.inversify.service'

export type TVEventsByRequestIdEvents = {
  TvSubmitEvent?: FormattedTvSubmitEvent
  TvFulfillDepositEvent?: FormattedTvFulfillDepositEvent
  TvFulfillWithdrawEvent?: FormattedTvFulfillWithdrawEvent
  TvLiquidateEvent?: FormattedTvLiquidateEvent
}

@injectable()
export class CviAdminApiThetaVaultsInversifyService {
  public data = new Map<string, GroupFormattedThetaVaultsEvents>()

  public readonly addressToEventsAsc = new Map<Address, GroupFormattedThetaVaultsEvents[]>()

  public readonly latestGeneralInfoOfEventByAddress = new Map<Address, GeneralInfoOfEventByAddress>()

  private readonly cleanups: (() => unknown | Promise<unknown>)[] = []

  private lastPromise?: Promise<void>

  private pullingEventsFromBlockNumber = 0

  constructor(
    @inject('IsTestMode')
    public readonly isTestMode: boolean,
    @inject('LatestGeneralInfoOfEventByAddressInversifyService')
    private readonly latestGeneralInfoOfEventByAddressInversifyService: LatestGeneralInfoOfEventByAddressInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('TvContractsEventsInversifyService')
    private readonly tvContractsEventsInversifyService: TvContractsEventsInversifyService,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
  ) {
    const TvSubmitRequestEventEmitter = () => {
      this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'TvSubmitRequestEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'TvSubmitRequestEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    TvSubmitRequestEventEmitter()

    const TvFulfillDepopsitEventEmitter = () => {
      this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'TvFulfillDepositEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'TvFulfillDepositEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    TvFulfillDepopsitEventEmitter()

    const TvFulfillWithdrawEventEmitter = () => {
      this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'TvFulfillWithdrawEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'TvFulfillWithdrawEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    TvFulfillWithdrawEventEmitter()

    const TvLiquidateEventEmitter = () => {
      this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.on(
        'TvLiquidateEvent',
        this.pushEvent.bind(this),
      )

      this.cleanups.push(() =>
        this.tvContractsEventsInversifyService.realTimeRequestEventEmitter.off(
          'TvLiquidateEvent',
          this.pushEvent.bind(this),
        ),
      )
    }
    TvLiquidateEventEmitter()

    const stop1 = this.tvContractsEventsInversifyService.registerNewTvSubmitRequestEvent()
    this.cleanups.push(stop1)

    const stop2 = this.tvContractsEventsInversifyService.registerNewTvFulfillDepositEvent()
    this.cleanups.push(stop2)

    const stop3 = this.tvContractsEventsInversifyService.registerNewTvFulfillWithdrawEvent()
    this.cleanups.push(stop3)

    const stop4 = this.tvContractsEventsInversifyService.registerNewTvLiquidateRequestEvent()
    this.cleanups.push(stop4)

    this.cleanups.push(() => this.lastPromise)
  }

  private pushEvent = (event: GroupFormattedThetaVaultsEvents) => {
    const id = `${event.type}::${event.blockNumber}::${event.transactionIndex}::${event.logIndex}::${event.args.requestId}`
    if (!this.data.has(id)) {
      this.data.set(id, event)
      const addressEvents = this.addressToEventsAsc.get(event.args.account) ?? []
      addressEvents.push(event)
      addressEvents.sort(sortEventsAsc)
      this.addressToEventsAsc.set(event.args.account, addressEvents)
      this.latestGeneralInfoOfEventByAddressInversifyService.setLatestGeneralInfoOfEvent({
        address: event.args.account,
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex,
        logIndex: event.logIndex,
        generalInfoOfEventByAddress: event.args.generalInfoOfEventByAddress,
      })
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

      const fromBlockNumber = this.pullingEventsFromBlockNumber

      console.log(
        `${
          CviAdminApiThetaVaultsInversifyService.name
        } - ${new Date().toISOString()} - start fetching tv events from blockNumber ${fromBlockNumber}`,
      )

      const baseEvents = await this.tvContractsEventsInversifyService.getBaseEvents({
        fromBlockNumber: this.pullingEventsFromBlockNumber,
      })

      for (const e of baseEvents.allEvents) {
        this.pushEvent(e)
        if (this.pullingEventsFromBlockNumber < e.blockNumber) {
          this.pullingEventsFromBlockNumber = e.blockNumber + 1
        }
      }

      await this.latestGeneralInfoOfEventByAddressInversifyService.fetchUpdateGeneralInfoOfEventByAddress()

      console.log(
        `${CviAdminApiThetaVaultsInversifyService.name} - ${new Date().toISOString()} - fetched ${
          baseEvents.allEvents.length
        } tv events from blockNumber: ${fromBlockNumber}. new from-blockNumber for next polling: ${
          this.pullingEventsFromBlockNumber
        } (${e().toFixed(2)}s)`,
      )
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    }
  }
}
