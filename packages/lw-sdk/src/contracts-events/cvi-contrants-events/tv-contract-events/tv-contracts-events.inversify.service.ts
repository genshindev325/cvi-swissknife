import type {
  FulfillDepositEvent,
  FulfillWithdrawEvent,
  SubmitRequestEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/ThetaVault'
import type { TvRequestEventsEmitterType } from '@coti-cvi/lw-sdk'
import type { TypedListener } from 'auto-generated-code/src/git-contract-types/common'
import type { LiquidateRequestEvent } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/contracts/theta-vault/ThetaVaultContracts.sol/CVIUSDCThetaVault'
import { inject, injectable } from 'inversify'
import { StrictEventEmitter } from 'strict-event-emitter'
import type { CacheInversifyService } from '../../../cache.inversify.service'
import type { CviContractsInversifyService } from '../../../cvi-contracts'
import type { GlobalEventsInversifyService } from '../../../global-events.inversify.service'
import type { PositionOfAddress } from '../../../theta-vault'
import type { ThetaVaultInversifyService } from '../../../theta-vault'
import type { Token } from '../../../token'
import type {
  CompletedDepositThetaVaultEvent,
  CompletedWithdrawThetaVaultEvent,
  FailedThetaVaultEvent,
  IERC20,
  PendingThetaVaultEvent,
  ThetaVaultEvent,
  TokenName,
  VaultTransaction,
} from '../../../types'
import { TvRequestType } from '../../../types'

import type { FormatTvContractsEventsInversifyService } from './format-tv-contracts-events.inversify.service'

@injectable()
export class TvContractsEventsInversifyService {
  public realTimeRequestEventEmitter = new StrictEventEmitter<TvRequestEventsEmitterType>()

  public oldEventsIds = new Set<string>()

  constructor(
    @inject('ThetaVaultInversifyService') private readonly thetaVaultInversifyService: ThetaVaultInversifyService,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('FormatTvContractsEventsInversifyService')
    private readonly formatTvContractsEventsInversifyService: FormatTvContractsEventsInversifyService,
    @inject('CacheInversifyService') public readonly cacheInversifyService: CacheInversifyService,
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
  ) {}

  public registerNewTvSubmitRequestEvent(address?: string) {
    const filter = this.cviContractsInversifyService.vaultCvi.filters.SubmitRequest(
      undefined,
      undefined,
      undefined,
      undefined,
      address,
    )

    const listener: TypedListener<SubmitRequestEvent> = (...params) => {
      const event = params[7]
      const id = `SubmitRequestEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(
        `${new Date().toISOString()} - ${
          TvContractsEventsInversifyService.name
        } - SubmitRequestEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      this.oldEventsIds.add(id)

      this.formatTvContractsEventsInversifyService
        .toFormatTvSubmitEvent(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'tv-submit', event: e })
          this.realTimeRequestEventEmitter.emit('TvSubmitRequestEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.vaultCvi.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.vaultCvi.off(filter, listener)
    }
  }

  public registerNewTvFulfillDepositEvent(address?: string) {
    const filter = this.cviContractsInversifyService.vaultCvi.filters.FulfillDeposit(undefined, address)

    const listener: TypedListener<FulfillDepositEvent> = (...params) => {
      const event = params[8]
      const id = `FulfillDeposit::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(
        `${new Date().toISOString()} - ${
          TvContractsEventsInversifyService.name
        } - FulfillDeposit - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      this.oldEventsIds.add(id)

      this.formatTvContractsEventsInversifyService
        .toFormatTvFulfillDepositEvent(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'tv-deposit', event: e })
          this.realTimeRequestEventEmitter.emit('TvFulfillDepositEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.vaultCvi.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.vaultCvi.off(filter, listener)
    }
  }

  public registerNewTvFulfillWithdrawEvent(address?: string) {
    const filter = this.cviContractsInversifyService.vaultCvi.filters.FulfillWithdraw(undefined, address)

    const listener: TypedListener<FulfillWithdrawEvent> = (...params) => {
      const event = params[8]
      const id = `FulfillWithdraw::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(
        `${new Date().toISOString()} - ${
          TvContractsEventsInversifyService.name
        } - FulfillWithdraw - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      this.oldEventsIds.add(id)

      this.formatTvContractsEventsInversifyService
        .toFormatTvFulfillWithdrawEvent(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'tv-withdraw', event: e })
          this.realTimeRequestEventEmitter.emit('TvFulfillWithdrawEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.vaultCvi.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.vaultCvi.off(filter, listener)
    }
  }

  public registerNewTvLiquidateRequestEvent(address?: string) {
    const filter = this.cviContractsInversifyService.vaultCvi.filters.LiquidateRequest(undefined, undefined, address)

    const listener: TypedListener<LiquidateRequestEvent> = (...params) => {
      const event = params[5]
      const id = `LiquidateRequestEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(
        `${new Date().toISOString()} - ${
          TvContractsEventsInversifyService.name
        } - LiquidateRequestEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      this.oldEventsIds.add(id)

      this.formatTvContractsEventsInversifyService
        .toFormatTvLiquidateEvent(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'tv-liquidate', event: e })
          this.realTimeRequestEventEmitter.emit('TvLiquidateEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.vaultCvi.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.vaultCvi.off(filter, listener)
    }
  }

  public getOldTvSubmitEvents(options?: { fromBlockNumber?: number; address?: string }) {
    return this.cacheInversifyService.getEvents({
      key: 'tv-submit',
      invalidationKey: '2',
      address: options?.address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.vaultCvi,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.cviContractsInversifyService.vaultCvi
          .queryFilter(
            this.cviContractsInversifyService.vaultCvi.filters.SubmitRequest(
              undefined,
              undefined,
              undefined,
              undefined,
              address,
            ),
            fromBlockNumber,
            toBlockNumber,
          )
          .then(r => Promise.all(r.map(e => this.formatTvContractsEventsInversifyService.toFormatTvSubmitEvent(e))))
          .then(r => {
            for (const e of r) {
              const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${e.args.requestId}`
              this.oldEventsIds.add(id)
            }
            return r
          }),
    })
  }

  public getOldTvFulfillDepositEvents(options?: { fromBlockNumber?: number; address?: string }) {
    return this.cacheInversifyService.getEvents({
      key: 'tv-deposit',
      invalidationKey: '2',
      address: options?.address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.vaultCvi,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.cviContractsInversifyService.vaultCvi
          .queryFilter(
            this.cviContractsInversifyService.vaultCvi.filters.FulfillDeposit(undefined, address),
            fromBlockNumber,
            toBlockNumber,
          )
          .then(r =>
            Promise.all(r.map(e => this.formatTvContractsEventsInversifyService.toFormatTvFulfillDepositEvent(e))),
          )
          .then(r => {
            for (const e of r) {
              const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${e.args.requestId}`
              this.oldEventsIds.add(id)
            }
            return r
          }),
    })
  }

  public getOldTvFulfillWithdrawEvents(options?: { fromBlockNumber?: number; address?: string }) {
    return this.cacheInversifyService.getEvents({
      key: 'tv-withdraw',
      invalidationKey: '2',
      address: options?.address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.vaultCvi,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.cviContractsInversifyService.vaultCvi
          .queryFilter(
            this.cviContractsInversifyService.vaultCvi.filters.FulfillWithdraw(undefined, address),
            fromBlockNumber,
            toBlockNumber,
          )
          .then(r =>
            Promise.all(r.map(e => this.formatTvContractsEventsInversifyService.toFormatTvFulfillWithdrawEvent(e))),
          )
          .then(r => {
            for (const e of r) {
              const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${e.args.requestId}`
              this.oldEventsIds.add(id)
            }
            return r
          }),
    })
  }

  public getOldTvLiquidateEvents(options?: { fromBlockNumber?: number; address?: string }) {
    return this.cacheInversifyService.getEvents({
      key: 'tv-liquidate',
      invalidationKey: '2',
      address: options?.address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.vaultCvi,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.cviContractsInversifyService.vaultCvi
          .queryFilter(
            this.cviContractsInversifyService.vaultCvi.filters.LiquidateRequest(undefined, undefined, address),
            fromBlockNumber,
            toBlockNumber,
          )
          .then(r => Promise.all(r.map(e => this.formatTvContractsEventsInversifyService.toFormatTvLiquidateEvent(e))))
          .then(r => {
            for (const e of r) {
              const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.logIndex}::${e.args.requestId}`
              this.oldEventsIds.add(id)
            }
            return r
          }),
    })
  }

  public getBaseEvents = async (options?: { fromBlockNumber?: number; address?: string }) => {
    const [submitFilter, liquidateFilter, fulfillDepositFilter, fulfillWithdrawFilter] = [
      this.getOldTvSubmitEvents(options),
      this.getOldTvLiquidateEvents(options),
      this.getOldTvFulfillDepositEvents(options),
      this.getOldTvFulfillWithdrawEvents(options),
    ]

    const eventSplitted = await Promise.all([
      submitFilter,
      liquidateFilter,
      fulfillDepositFilter,
      fulfillWithdrawFilter,
    ])

    const allEvents = eventSplitted.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    return {
      eventSplitted,
      allEvents,
    }
  }

  public getEvents = async (address?: string) => {
    const submitFilter = this.cviContractsInversifyService.vaultCvi.filters.SubmitRequest(
      undefined,
      undefined,
      undefined,
      undefined,
      address,
    )
    const liquidateFilter = this.cviContractsInversifyService.vaultCvi.filters.LiquidateRequest(
      undefined,
      undefined,
      address,
    )
    const fulfillDepositFilter = this.cviContractsInversifyService.vaultCvi.filters.FulfillDeposit(undefined, address)
    const fulfillWithdrawFilter = this.cviContractsInversifyService.vaultCvi.filters.FulfillWithdraw(undefined, address)

    const [submitEvents, liquidateEvents, fulfillDepositEvents, fulfillWithdrawEvents] = await Promise.all([
      this.cviContractsInversifyService.vaultCvi.queryFilter(submitFilter),
      this.cviContractsInversifyService.vaultCvi.queryFilter(liquidateFilter),
      this.cviContractsInversifyService.vaultCvi.queryFilter(fulfillDepositFilter),
      this.cviContractsInversifyService.vaultCvi.queryFilter(fulfillWithdrawFilter),
    ])

    const allEvents = [submitEvents, liquidateEvents, fulfillDepositEvents, fulfillWithdrawEvents]
      .flat()
      .sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    const events: ThetaVaultEvent[] = submitEvents
      .map(e => {
        const requestType: TvRequestType = e.args.requestType
        const requestId = e.args.requestId.toString()
        const liquidateEvent = liquidateEvents.find(e => e.args.requestId.toString() === requestId)
        const baseEvent = { request: e, requestType, requestId }
        if (liquidateEvent) {
          return { ...baseEvent, status: 'failure', liquidate: liquidateEvent } as FailedThetaVaultEvent
        }
        const fulfillEvents: (FulfillDepositEvent | FulfillWithdrawEvent)[] =
          requestType === TvRequestType.Deposit ? fulfillDepositEvents : fulfillWithdrawEvents
        const fulfillEvent = fulfillEvents.find(e => e.args.requestId.toString() === requestId)
        if (fulfillEvent) {
          return { ...baseEvent, status: 'success', fulfill: fulfillEvent } as
            | CompletedWithdrawThetaVaultEvent
            | CompletedDepositThetaVaultEvent
        }
        return { ...baseEvent, status: 'pending' } as PendingThetaVaultEvent
      })
      .sort((e1, e2) => e2.request.blockNumber - e1.request.blockNumber)

    const pendingRequests = events.filter(e => e.status === 'pending') as PendingThetaVaultEvent[]

    return {
      pendingRequests,
      submitEvents,
      liquidateEvents,
      fulfillDepositEvents,
      fulfillWithdrawEvents,
      allEvents,
      events,
    }
  }

  public getVaultTransactions = async (address: string): Promise<VaultTransaction[]> => {
    try {
      const events = await this.getEvents(address)
      const formattedEvents = await Promise.all(
        events.events.map(async event =>
          this.formatTvContractsEventsInversifyService.formatEventToVaultTransaction(event),
        ),
      )
      if (formattedEvents) {
        return formattedEvents
      }
    } catch (error) {
      this.globalEventsInversifyService.emitWithAddress(
        'errorWithAddress',
        address,
        error.reason ?? 'Failed to get vault transactions.',
      )
    }

    return []
  }

  public emitTransactionsOfAddressEvent = (address: string) => {
    this.globalEventsInversifyService.emitWithAddress('tvTransactionsOfAddress', address, async () => {
      return this.getVaultTransactions(address)
    })
  }

  public registerNewTransactionsOfAddressEvent = (address: string) => {
    this.emitTransactionsOfAddressEvent(address)
    const id = setInterval(() => this.emitTransactionsOfAddressEvent(address), 30_000)
    return () => clearInterval(id)
  }

  public emitPositionOfAddressEvent = (address: string) => {
    this.globalEventsInversifyService.emitWithAddress('tvPositionOfAddress', address, async () => {
      return this.thetaVaultInversifyService.positionOfAddress(address).then<PositionOfAddress>(r => ({
        balanceThetaTokens: r.balanceThetaTokens,
        positionBalanceUsdc: r.positionBalanceUsdc,
        sharePercentage: r.sharePercentage,
      }))
    })
  }

  public emitCollateralRatioEvent = () => {
    this.globalEventsInversifyService.emitTvault('tvCollateralRatio', async () =>
      this.thetaVaultInversifyService.getCollateralRatio(),
    )
  }

  public emitRegisterTvlUsdc = () => {
    this.globalEventsInversifyService.emitTvault('tvTvlUsdc', async () =>
      this.tokenUSDC.toNumber(await this.thetaVaultInversifyService.tvl().then(r => r.balance)),
    )
  }

  public emitRegisterTvUtilizationPercentage = () => {
    this.globalEventsInversifyService.emitTvault('tvUtilizationPercentage', () =>
      this.thetaVaultInversifyService.getTvUtilizationPercentage(),
    )
  }

  public emitMaxCapacityUsdcEvent = () => {
    this.globalEventsInversifyService.emitTvault(
      'tvMaxCapacityUsdc',
      async () => (await this.thetaVaultInversifyService.maxCapacity()).depositCapNumber,
    )
  }

  public registerNewPositionOfAddressEvent = (address: string) => {
    this.emitPositionOfAddressEvent(address)
    const id = setInterval(() => this.emitPositionOfAddressEvent(address), 60_000)
    return () => clearInterval(id)
  }

  public registerNewTvlUsdcEvent = () => {
    this.emitRegisterTvlUsdc()
    const id = setInterval(() => this.emitRegisterTvlUsdc(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewTvUtilizationPercentage = () => {
    this.emitRegisterTvUtilizationPercentage()
    const id = setInterval(() => this.emitRegisterTvUtilizationPercentage(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewCollateralRatioEvent = () => {
    this.emitCollateralRatioEvent()
    const id = setInterval(() => this.emitCollateralRatioEvent(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewMaxCapacityUsdcEvent = () => {
    this.emitMaxCapacityUsdcEvent()
    const id = setInterval(() => this.emitMaxCapacityUsdcEvent(), 60_000)
    return () => clearInterval(id)
  }
}
