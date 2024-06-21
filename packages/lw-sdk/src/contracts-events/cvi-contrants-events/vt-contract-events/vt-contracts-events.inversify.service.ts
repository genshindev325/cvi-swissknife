import type { ConnectedPair, Token, UniswapInversifyService } from '@coti-cvi/lw-sdk'
import type { VtCviEventsEmitterType, VtRequestEventsEmitterType } from '@coti-cvi/lw-sdk'
import type { TypedEvent, TypedEventFilter, TypedListener } from 'auto-generated-code/src/git-contract-types/common'
import type {
  BurnEvent,
  FulfillRequestEvent,
  LiquidateRequestEvent,
  MintEvent,
  SubmitRequestEvent,
} from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/VolatilityToken'
import type {
  SwapEvent,
  TransferEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/external/IUniswapV2Pair'
import { inject, injectable } from 'inversify'
import _ from 'lodash'
import { StrictEventEmitter } from 'strict-event-emitter'
import type { CviContractsInversifyService } from '../../../cvi-contracts'
import type { GlobalEventsInversifyService } from '../../../global-events.inversify.service'
import type { IERC20, PendingFeeTableRowType, PendingRequestTableType, TokenName } from '../../../types'
import type { TvSupportedChainIds } from '../../../types'
import type { FormattedSimpleEvent, VtRequestType } from '../../../types/vol-token-common-types'
import type {
  VolTokenEvent,
  FailedVolTokenEvent,
  CompletedMintVolTokenEvent,
  CompletedBurnVolTokenEvent,
  PendingVolTokenEvent,
  SimpleCompletedBurnVolTokenEvent,
  SimpleCompletedMintVolTokenEvent,
  SimpleFailedVolTokenEvent,
  SimplePendingVolTokenEvent,
  SimpleVolTokenEvent,
  GroupedFormattedVolTokenEvent,
} from '../../../types/vol-token-common-types'
import type { VtInversifyService } from '../../../volatility-token'

import type { FormatVtContractsEventsInversifyService } from './format-vt-contracts-events.inversify.service'
import type { CacheInversifyService } from '../../../cache.inversify.service'
import type { JsonRpcProvider } from '@ethersproject/providers'

@injectable()
export class VtContractsEventsInversifyService {
  public realTimeRequestEventEmitter = new StrictEventEmitter<VtRequestEventsEmitterType>()

  public realTimeCviEventEmitter = new StrictEventEmitter<VtCviEventsEmitterType>()

  public oldEventsIds = new Set<string>()

  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('FormatVtContractsEventsInversifyService')
    private readonly formatVtContractsEventsInversifyService: FormatVtContractsEventsInversifyService,
    @inject('VtInversifyService') private readonly vtInversifyService: VtInversifyService,
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('UniswapInversifyService') public readonly uniswapInversifyService: UniswapInversifyService,
    @inject('CacheInversifyService') public readonly cacheInversifyService: CacheInversifyService,
    @inject('CVIUSDCVolatilityToken') public readonly tokenCvi: Token<IERC20, TokenName.CVI>,
    @inject('cviUsdcPairContractAndLpToken') public readonly pairContract: ConnectedPair,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
  ) {}

  public registerNewVtSubmitRequestEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.SubmitRequest(
      undefined,
      undefined,
      address,
    )

    const listener: TypedListener<SubmitRequestEvent> = (...params) => {
      const event = params[9]
      const id = `SubmitRequestEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      console.log(
        `${new Date().toISOString()} - ${
          VtContractsEventsInversifyService.name
        } - new SubmitRequestEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedVtSubmittedRequest(event, true)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-submit', event: e })
          this.realTimeRequestEventEmitter.emit('VtSubmitRequestEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtBurnEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.Burn(undefined, address)

    const listener: TypedListener<BurnEvent> = (...params) => {
      const event = params[7]
      const id = `VtBurnEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      console.log(
        `${new Date().toISOString()} - ${
          VtContractsEventsInversifyService.name
        } - new VtBurnEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedVtBurnEvent(event, true)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-burn', event: e })
          this.realTimeRequestEventEmitter.emit('VtBurnEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtMintEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.Mint(undefined, address)

    const listener: TypedListener<MintEvent> = (...params) => {
      const event = params[7]
      const id = `VtMintEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      console.log(
        `${new Date().toISOString()} - ${
          VtContractsEventsInversifyService.name
        } - new VtMintEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedVtMintEvent(event, true)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-mint', event: e })
          this.realTimeRequestEventEmitter.emit('VtMintEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtFulfillRequestEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.FulfillRequest(
      undefined,
      undefined,
      address,
    )

    const listener: TypedListener<FulfillRequestEvent> = (...params) => {
      const event = params[9]
      const id = `VtFulfillRequestEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      console.log(
        `${new Date().toISOString()} - ${
          VtContractsEventsInversifyService.name
        } - new VtFulfillRequestEvent - requestId: ${event.args.requestId.toNumber()}, address: ${event.args.account}`,
      )

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedVtFulfillRequestEvent(event, true)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-fulfill', event: e })
          this.realTimeRequestEventEmitter.emit('VtFulfillRequestEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtLiquidateRequestEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.LiquidateRequest(
      undefined,
      undefined,
      address,
    )

    const listener: TypedListener<LiquidateRequestEvent> = (...params) => {
      const event = params[7]
      const id = `VtLiquidateRequestEvent::${event.blockNumber}::${event.transactionIndex}::${
        event.logIndex
      }::${event.args.requestId.toNumber()}`

      console.log(
        `${new Date().toISOString()} - ${
          VtContractsEventsInversifyService.name
        } - new VtLiquidateRequestEvent - requestId: ${event.args.requestId.toNumber()}, address: ${
          event.args.account
        }`,
      )

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedVtLiquidateRequestEvent(event, true)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-liquidate', event: e })
          this.realTimeRequestEventEmitter.emit('VtLiquidateRequestEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtCviTransferEvent(address?: string) {
    const filter = this.cviContractsInversifyService.volTokenContract.filters.Transfer(address)

    const listener: TypedListener<TransferEvent> = (...params) => {
      const event = params[3]
      const id = `VtCviTransferRequestEvent::${event.blockNumber}::${event.transactionIndex}::${event.logIndex}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(`${new Date().toISOString()} - ${VtContractsEventsInversifyService.name} - VtCviTransferRequestEvent`)

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedCviTransferEvent(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-transfer', event: e })
          this.realTimeCviEventEmitter.emit('VtCviTransferEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.cviContractsInversifyService.volTokenContract.on(filter, listener)

    return () => {
      this.cviContractsInversifyService.volTokenContract.off(filter, listener)
    }
  }

  public registerNewVtCviUniswapSwapEvent(address?: string) {
    const filter = this.pairContract.contract(this.provider).filters.Swap(address)

    const listener: TypedListener<SwapEvent> = (...params) => {
      const event = params[6]
      const id = `VtCviUniswapSwapEvent::${event.blockNumber}::${event.transactionIndex}::${event.logIndex}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      console.log(`${new Date().toISOString()} - ${VtContractsEventsInversifyService.name} - VtCviUniswapSwapEvent`)

      this.oldEventsIds.add(id)

      this.formatVtContractsEventsInversifyService
        .toFormattedCviSwapEvents(event)
        .then(async e => {
          await this.cacheInversifyService.saveEvent({ key: 'vt-v2-swap', event: e })
          this.realTimeCviEventEmitter.emit('VtCviUniswapSwapEvent', e)
        })
        .catch(error => this.globalEventsInversifyService.eventEmitter.emit('errors', error))
    }

    this.pairContract.contract(this.provider).on(filter, listener)

    return () => {
      this.pairContract.contract(this.provider).off(filter, listener)
    }
  }

  public getOldSubmittedRequestEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
    },
  ) {
    return this.cacheInversifyService.getEvents({
      key: 'vt-submit',
      invalidationKey: '2',
      address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.volTokenContract,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.getEventWithoutLogLimit(
          this.cviContractsInversifyService.volTokenContract.filters.SubmitRequest(undefined, undefined, address),
          fromBlockNumber,
          toBlockNumber,
        )
          .then(r =>
            Promise.all(
              r.map(e => this.formatVtContractsEventsInversifyService.toFormattedVtSubmittedRequest(e, getGeneralInfo)),
            ),
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

  public getOldMintEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
    },
  ) {
    return this.cacheInversifyService.getEvents({
      key: 'vt-mint',
      invalidationKey: '3',
      address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.volTokenContract,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.getEventWithoutLogLimit(
          this.cviContractsInversifyService.volTokenContract.filters.Mint(undefined, address),
          fromBlockNumber,
          toBlockNumber,
        )
          .then(r =>
            Promise.all(
              r.map(e => this.formatVtContractsEventsInversifyService.toFormattedVtMintEvent(e, getGeneralInfo)),
            ),
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

  public getOldLiquidateRequestEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
    },
  ) {
    return this.cacheInversifyService.getEvents({
      key: 'vt-liquidate',
      invalidationKey: '2',
      address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.volTokenContract,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.getEventWithoutLogLimit(
          this.cviContractsInversifyService.volTokenContract.filters.LiquidateRequest(undefined, undefined, address),
          fromBlockNumber,
          toBlockNumber,
        )
          .then(r =>
            Promise.all(
              r.map(e =>
                this.formatVtContractsEventsInversifyService.toFormattedVtLiquidateRequestEvent(e, getGeneralInfo),
              ),
            ),
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

  public getOldFulfillRequestEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
    },
  ) {
    return this.cacheInversifyService.getEvents({
      key: 'vt-fulfill',
      invalidationKey: '2',
      address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.volTokenContract,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.getEventWithoutLogLimit(
          this.cviContractsInversifyService.volTokenContract.filters.FulfillRequest(undefined, undefined, address),
          fromBlockNumber,
          toBlockNumber,
        )
          .then(r =>
            Promise.all(
              r.map(e =>
                this.formatVtContractsEventsInversifyService.toFormattedVtFulfillRequestEvent(e, getGeneralInfo),
              ),
            ),
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

  public getOldBurnEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
    },
  ) {
    return this.cacheInversifyService.getEvents({
      key: 'vt-burn',
      invalidationKey: '2',
      address,
      fromBlockNumber: options?.fromBlockNumber,
      contract: this.cviContractsInversifyService.volTokenContract,
      getFromBlockchain: ({ address, fromBlockNumber, toBlockNumber }) =>
        this.getEventWithoutLogLimit(
          this.cviContractsInversifyService.volTokenContract.filters.Burn(undefined, address),
          fromBlockNumber,
          toBlockNumber,
        )
          .then(r =>
            Promise.all(
              r.map(e => this.formatVtContractsEventsInversifyService.toFormattedVtBurnEvent(e, getGeneralInfo)),
            ),
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

  public async getBaseEvents(
    address?: string,
    getGeneralInfo = true,
    options?: {
      fromBlockNumber?: number
      trasferAndSwapEvents?: boolean
    },
  ) {
    const [eventSplitted, trasferAndSwapEvents] = await Promise.all([
      Promise.all([
        this.getOldSubmittedRequestEvents(address, getGeneralInfo, options),
        this.getOldLiquidateRequestEvents(address, getGeneralInfo, options),
        this.getOldFulfillRequestEvents(address, getGeneralInfo, options),
        this.getOldMintEvents(address, getGeneralInfo, options),
        this.getOldBurnEvents(address, getGeneralInfo, options),
      ]),
      options?.trasferAndSwapEvents ? this.getOldSwapAndTrasferEvents(options) : { dexSwaps: [], transfers: [] },
    ])

    const allEvents = eventSplitted.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)
    const allEventsIncludingTransfersAndSwaps = [
      ...eventSplitted,
      ...trasferAndSwapEvents.dexSwaps,
      ...trasferAndSwapEvents.transfers,
    ]
      .flat()
      .sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    const byRequestId = _.chain(allEvents)
      .groupBy(e => e.args.requestId)
      .map((events, requestIdString) => ({
        requestId: Number(requestIdString),
        events,
      }))
      .value()

    return {
      eventSplitted,
      allEvents,
      byRequestId,
      allEventsIncludingTransfersAndSwaps,
    }
  }

  public getEvents = async (address?: string, getGeneralInfo = false): Promise<PendingRequestTableType> => {
    const baseEvents = await this.getBaseEvents(address, getGeneralInfo)

    const [submitEvents, liquidateEvents, fulfillEvents, mintEvents, burnEvents] = baseEvents.eventSplitted

    const allEvents = baseEvents.allEvents

    const events: VolTokenEvent[] = submitEvents
      .map(e => {
        const requestType: VtRequestType = e.args.requestType
        const requestId = e.args.requestId
        const liquidateEvent = liquidateEvents.find(e => e.args.requestId === requestId)
        const baseEvent = { request: e, requestType, requestId } as const
        if (liquidateEvent) {
          return { ...baseEvent, status: 'failure', liquidate: liquidateEvent } as FailedVolTokenEvent
        }
        const fulfillEvent = fulfillEvents.find(e => e.args.requestId === requestId)
        if (fulfillEvent) {
          const mintEvent = mintEvents.find(e => e.args.requestId === requestId)
          const burnEvent = burnEvents.find(e => e.args.requestId === requestId)
          return {
            ...baseEvent,
            status: 'success',
            fulfill: fulfillEvent,
            mint: mintEvent,
            burn: burnEvent,
          } as CompletedMintVolTokenEvent | CompletedBurnVolTokenEvent
        }
        return { ...baseEvent, status: 'pending' } as PendingVolTokenEvent
      })
      .sort((e1, e2) => e2.request.blockNumber - e1.request.blockNumber)

    const pendingRequests = events.filter(e => e.status === 'pending') as PendingVolTokenEvent[]
    const completedRequest = events.filter(e => e.status !== 'pending') as (
      | CompletedMintVolTokenEvent
      | CompletedBurnVolTokenEvent
      | FailedVolTokenEvent
    )[]

    return {
      tableRowEvents: await Promise.all(
        pendingRequests.map<Promise<PendingFeeTableRowType>>(async p => {
          const extra =
            p.requestType == 1
              ? { extraMint: await this.vtInversifyService.checkPendingMint(p.requestId) }
              : { extraBurn: await this.vtInversifyService.checkPendingBurn(p.requestId) }

          return { ...p, ...extra }
        }),
      ),
      completedTableRowEvents: completedRequest.map(c => ({
        ...c,
        net:
          c.status === 'failure'
            ? 0
            : c.request.args.tokenAmountPaid -
              (c.requestType === 1
                ? c.fulfill.args.fulfillFeesAmount +
                  c.mint.args.openPositionFee +
                  c.mint.args.buyingPremiumFee +
                  c.request.args.submitFeesAmount
                : c.fulfill.args.fulfillFeesAmount + c.burn.args.closePositionFee + c.request.args.submitFeesAmount),
      })),
      pendingRequests,
      submitEvents,
      fulfillEvents,
      liquidateEvents,
      mintEvents,
      burnEvents,
      allEvents,
      events,
      completedRequest: completedRequest,
    }
  }

  private getEventWithoutLogLimit = async <TEvent extends TypedEvent>(
    filter: TypedEventFilter<TEvent>,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<TEvent[]> => {
    try {
      return await this.cviContractsInversifyService.volTokenContract.queryFilter(filter, fromBlock, toBlock)
    } catch (error) {
      const message: string = error.message
      if (message.startsWith('Log response size exceeded')) {
        const blocks = message.slice(message.indexOf('[') + 1, -1).split(', ')
        const [from, to] = blocks.map(b => +b)
        const [part1, part2] = await Promise.all([
          this.getEventWithoutLogLimit(filter, fromBlock, to),
          this.getEventWithoutLogLimit(filter, to + 1, toBlock),
        ])
        return [part1, part2].flat()
      }
      throw error
    }
  }

  private getEventsOfSameRequestId = (sorted: GroupedFormattedVolTokenEvent[], index: number) => {
    const requestId = sorted[index].args.requestId
    const arr = [sorted[index]]
    for (let i = index + 1; i < sorted.length && sorted[i].args.requestId === requestId; i++) {
      arr.push(sorted[i])
    }
    return arr
  }

  public getSimpleEvents = async ({
    address,
    fromBlock,
    toBlock,
  }: {
    address?: string
    fromBlock?: number
    toBlock?: number
  }) => {
    const contract = this.cviContractsInversifyService.volTokenContract
    const submitFilter = contract.filters.SubmitRequest(undefined, undefined, address)
    const liquidateFilter = contract.filters.LiquidateRequest(undefined, undefined, address)
    const fulfillFilter = contract.filters.FulfillRequest(undefined, undefined, address)
    const mintFilter = contract.filters.Mint(undefined, address)
    const burnFilter = contract.filters.Burn(undefined, address)

    const [submitEvents, liquidateEvents, fulfillEvents, mintEvents, burnEvents] = await Promise.all([
      this.getEventWithoutLogLimit(submitFilter, fromBlock, toBlock).then(events =>
        events.map(this.formatVtContractsEventsInversifyService.toFormattedVtSimpleSubmitRequestEvent),
      ),
      this.getEventWithoutLogLimit(liquidateFilter, fromBlock, toBlock).then(events =>
        events.map(this.formatVtContractsEventsInversifyService.toFormattedVtSimpleLiquidateRequestEvent),
      ),
      this.getEventWithoutLogLimit(fulfillFilter, fromBlock, toBlock).then(events =>
        events.map(this.formatVtContractsEventsInversifyService.toFormattedVtSimpleFulfillRequestEvent),
      ),
      this.getEventWithoutLogLimit(mintFilter, fromBlock, toBlock).then(events =>
        events.map(this.formatVtContractsEventsInversifyService.toFormattedVtSimpleMintEvent),
      ),
      this.getEventWithoutLogLimit(burnFilter, fromBlock, toBlock).then(events =>
        events.map(this.formatVtContractsEventsInversifyService.toFormattedVtSimpleBurnEvent),
      ),
    ])
    const allEvents = [submitEvents, liquidateEvents, fulfillEvents, mintEvents, burnEvents].flat()

    const sorted = allEvents.filter(e => e.args.requestId > 0).sort((e1, e2) => e1.args.requestId - e2.args.requestId)
    const events: SimpleVolTokenEvent[] = []
    for (let i = 0; i < sorted.length; ) {
      const requestId = sorted[i].args.requestId
      const relatedEvents = this.getEventsOfSameRequestId(sorted, i)
      const requestEvent = relatedEvents.find(e => e.event === 'SubmitRequest')
      if (requestEvent) {
        const request = requestEvent as FormattedSimpleEvent<SubmitRequestEvent>
        const requestType: VtRequestType = request.args.requestType
        const baseEvent = { request, requestType, requestId } as const
        if (relatedEvents.length === 3) {
          const fulfillEvent = relatedEvents.find(e => e.event === 'FulfillRequest')
          const mintEvent = relatedEvents.find(e => e.event === 'Mint')
          const burnEvent = relatedEvents.find(e => e.event === 'Burn')
          events.push({
            ...baseEvent,
            status: 'success',
            fulfill: fulfillEvent,
            mint: mintEvent,
            burn: burnEvent,
          } as SimpleCompletedMintVolTokenEvent | SimpleCompletedBurnVolTokenEvent)
        } else if (relatedEvents.length === 2) {
          const liquidateEvent = relatedEvents.find(e => e.event === 'LiquidateRequest')
          events.push({ ...baseEvent, status: 'failure', liquidate: liquidateEvent } as SimpleFailedVolTokenEvent)
        } else {
          events.push({ ...baseEvent, status: 'pending' } as SimplePendingVolTokenEvent)
        }
      }
      i += relatedEvents.length
    }
    const pendingRequests = events.filter(e => e.status === 'pending') as SimplePendingVolTokenEvent[]
    const completedRequests = events.filter(e => e.status !== 'pending') as (
      | SimpleCompletedMintVolTokenEvent
      | SimpleCompletedBurnVolTokenEvent
      | SimpleFailedVolTokenEvent
    )[]

    return {
      pendingRequests,
      completedRequests,
      submitEvents,
      fulfillEvents,
      liquidateEvents,
      mintEvents,
      burnEvents,
      allEvents,
      events,
    }
  }

  public emitPendingRequestTableInfoEvents = async (address?: string) => {
    if (address) {
      return this.globalEventsInversifyService.emitWithAddressVT(
        'vtPendingRequestTableWithAddress',
        address,
        async () => this.getEvents(address),
      )
    }
  }

  public registerNewPendingRequestTableEvents = (address?: string) => {
    this.emitPendingRequestTableInfoEvents(address)
    const id = setInterval(() => this.emitPendingRequestTableInfoEvents(address), 60_000)
    return () => clearInterval(id)
  }

  public async getOldSwapAndTrasferEvents(options?: { fromBlockNumber?: number }) {
    const pair = await this.uniswapInversifyService.getPair(this.tokenUSDC, this.tokenCvi)
    if (!pair.isConnected()) {
      throw new Error(`getOldSwapAndTrasferEvents - pair is not connected`)
    }
    const [transfers, dexSwaps] = await Promise.all([
      this.cacheInversifyService.getEvents({
        key: 'vt-transfer',
        invalidationKey: '3',
        fromBlockNumber: options?.fromBlockNumber,
        contract: this.tokenCvi.contract,
        getFromBlockchain: ({ fromBlockNumber, toBlockNumber }) =>
          this.tokenCvi.contract
            .queryFilter(this.tokenCvi.contract.filters.Transfer(), fromBlockNumber, toBlockNumber)
            .then(e =>
              Promise.all(e.map(e => this.formatVtContractsEventsInversifyService.toFormattedCviTransferEvent(e))),
            ),
      }),
      this.cacheInversifyService.getEvents({
        key: 'vt-v2-swap',
        invalidationKey: '4',
        fromBlockNumber: options?.fromBlockNumber,
        contract: this.uniswapInversifyService.getPairContract(pair),
        getFromBlockchain: ({ fromBlockNumber, toBlockNumber }) =>
          this.uniswapInversifyService
            .getEvents(pair, {
              fromBlockNumber,
              toBlockNumber,
            })
            .then(r =>
              Promise.all(r.map(e => this.formatVtContractsEventsInversifyService.toFormattedCviSwapEvents(e))),
            ),
      }),
    ])

    for (const e of [...transfers, ...dexSwaps]) {
      const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.logIndex}`
      this.oldEventsIds.add(id)
    }

    return { transfers, dexSwaps }
  }
}
