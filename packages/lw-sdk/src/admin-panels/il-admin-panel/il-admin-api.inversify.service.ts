import { inject, injectable, optional } from 'inversify'
import type { ILProtectionInversifyService } from '../../il-protection.inversify.service'
import type {
  DuePayoutPoint,
  IERC20,
  ProtectionDuePayoutPoints,
  ProtectionId,
  ProtectionInfo,
  ProtectionInfoMetadata,
  ProtectionMetadata,
  ProtectionStatus,
  TokenName,
  WalletAddress,
  WalletProtections,
} from '../../types'
import type { ChainId } from '../../types'
import cloneDeep from 'lodash/cloneDeep'
import type { AsyncQueueInversifyService } from '../../async-queue.inversify.service'
import { StatusCodes } from 'http-status-codes'
import { toNumber, fromNumber } from '../../util/big-number'
import { calculateIL, calcEstimatedAmountToBePaid } from '../../il-offline-calculations'
import type { S3InversifyService } from '../../s3.inversify.service'
import range from 'lodash/range'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type {
  FormattedProtectionMintDiscountDetailsEvent,
  FormattedProtectionBoughtEvent,
  FormattedProtectionClosedEvent,
} from '../../contracts-events'
import type { ILContractsEventsInversifyService } from '../../contracts-events'
import { CustomError, ErrorKind } from '../../custom-error'
import type { EmbedArmadilloDiscountInversifyService } from '../../embed'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { IlContractsInversifyService } from '../../il-contracts'
import type { LatestBlockInfoInversifyService } from '../../latest-block-info-events.inversify.service'
import { INVERSIFY_SERVICES, catDecimalsWithRound, startTimer } from '../../util'
import { isInternalEVMAddress } from '../../util/internal-accounts'
import type { Token } from '../../token'

@injectable()
export class ILAdminApiInversifyService {
  private readonly protectionMintDiscountDetailsEvents = new Map<
    ProtectionId,
    FormattedProtectionMintDiscountDetailsEvent
  >()

  private readonly boughtEvents = new Map<ProtectionId, FormattedProtectionBoughtEvent>()

  private readonly expiredEvents = new Map<ProtectionId, FormattedProtectionClosedEvent>()

  private readonly protectionsByWallet = new Map<WalletAddress, Map<ProtectionId, ProtectionInfo>>()

  private readonly expiredProtectionIdHistory = new Map<ProtectionId, ProtectionDuePayoutPoints>()

  constructor(
    @inject('ChainId') private readonly chainId: ChainId,
    @inject('AsyncQueueInversifyService') private readonly asyncQueueInversifyService: AsyncQueueInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('LatestBlockInfoInversifyService')
    private readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('ILContractsEventsInversifyService')
    private readonly ilContractsEventsInversifyService: ILContractsEventsInversifyService,
    @inject('IlContractsInversifyService') private readonly ilContractsInversifyService: IlContractsInversifyService,
    @inject(INVERSIFY_SERVICES.IL_PROTECTION)
    private readonly ilProtectionInversifyService: ILProtectionInversifyService,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
    @inject('EmbedArmadilloDiscountInversifyService')
    private readonly embedArmadilloDiscountInversifyService: EmbedArmadilloDiscountInversifyService,
    @inject('S3InversifyService') @optional() private readonly s3InversifyService?: S3InversifyService,
  ) {}

  private async getAllDuePayoutsOfProtection({
    currentBlockNumber,
    protectionInfo,
    pointsToCalculate,
  }: {
    currentBlockNumber: number
    protectionInfo: ProtectionInfo
    pointsToCalculate: number
  }): Promise<DuePayoutPoint[]> {
    const s = protectionInfo.boughtEvent.blockNumber
    const e = protectionInfo.expiredEvent?.blockNumber ?? currentBlockNumber

    const r = range(s, e, (e - s) / pointsToCalculate).map(blockNumber => Number(blockNumber.toFixed(0)))

    const results = await Promise.all(
      r.map<Promise<DuePayoutPoint | undefined>>(async (blockNumber, pointIndex) => {
        try {
          const protectionStatus = await this.getProtectionStatus({
            blockNumber,
            boughtEvent: protectionInfo.boughtEvent,
            expiredEvent: protectionInfo.expiredEvent,
            metadata: protectionInfo.metadata,
            useCache: true,
          })

          return {
            pointIndex,
            protectionStatus,
          }
        } catch (error) {
          return undefined
        }
      }),
    )

    const filtered = results.filter((r): r is DuePayoutPoint => Boolean(r))

    return [
      ...filtered,
      {
        pointIndex: r.length,
        protectionStatus: protectionInfo.status,
      },
    ]
  }

  public async getProtectionHistory({
    protectionId,
    pointsToCalculate,
  }: {
    protectionId: ProtectionId
    pointsToCalculate: number
  }): Promise<ProtectionDuePayoutPoints> {
    const cache = this.expiredProtectionIdHistory.get(protectionId)
    if (cache) {
      return cache
    }

    const protectionInfo = Array.from(this.protectionsByWallet.values())
      .flatMap(p => Array.from(p.values()))
      .find(p => p.boughtEvent.args.id === protectionId)

    if (!protectionInfo) {
      throw new CustomError({
        name: 'protection-id-not-found',
        errorKind: ErrorKind.UserError,
        httpStatus: StatusCodes.BAD_REQUEST,
        message: 'Protection id not found',
        extras: {
          protectionId,
        },
      })
    }

    const currentBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()

    const r: ProtectionDuePayoutPoints = {
      protectionId,
      protectionDuePayoutsInfo: {
        points: await this.getAllDuePayoutsOfProtection({
          protectionInfo,
          pointsToCalculate,
          currentBlockNumber: currentBlock.number,
        }),
        protectionInfo,
      },
    }

    if (protectionInfo.expiredEvent) {
      this.expiredProtectionIdHistory.set(protectionId, r)
    }

    return r
  }

  public getProtectionsByWalletAsJson(): WalletProtections[] {
    return Array.from(this.protectionsByWallet.entries()).map(([wallet, protections]) => ({
      wallet,
      isInternalWallet: isInternalEVMAddress(wallet),
      protections: Array.from(protections.entries()).map(([protectionId, protectionInfo]) => ({
        protectionId,
        protectionInfo,
      })),
    }))
  }

  private async calcAmountToBePaidWithoutMinPayout({
    boughtEvent,
    payoutOrDuePayoutUsdc,
    lpTokensWorthAtBuyTimeUsdc,
    maxAmountToBePaidUsdc,
    token1EndPrice,
    token2EndPrice,
    blockNumber,
  }: {
    boughtEvent: FormattedProtectionBoughtEvent
    payoutOrDuePayoutUsdc: number
    lpTokensWorthAtBuyTimeUsdc: number
    maxAmountToBePaidUsdc: number
    token1EndPrice: number
    token2EndPrice: number
    blockNumber: number
  }): Promise<number> {
    if (payoutOrDuePayoutUsdc === 0) {
      const token1EntryPrice = boughtEvent.args.token1EntryPriceUSD
      const token2EntryPrice = boughtEvent.args.token2EntryPriceUSD
      try {
        const amountToBePaidWithoutMinUsdc = await this.ilContractsInversifyService.controller
          .calcAmountToBePaid(
            fromNumber(lpTokensWorthAtBuyTimeUsdc, 6),
            fromNumber(token1EntryPrice, 8),
            fromNumber(token2EntryPrice, 8),
            fromNumber(token1EndPrice, 8),
            fromNumber(token2EndPrice, 8),
            { blockTag: blockNumber },
          )
          .then(r => this.tokenUSDC.toNumber(r))

        return Math.min(amountToBePaidWithoutMinUsdc, maxAmountToBePaidUsdc)
      } catch (e) {
        // this method is new so we can't use it in old blocks
        return 0
      }
    } else {
      return payoutOrDuePayoutUsdc
    }
  }

  public async getProtectionStatusById({
    protectionId,
    useCache,
    blockNumber,
  }: {
    protectionId: string
    useCache: boolean
    blockNumber?: number
  }): Promise<ProtectionStatus> {
    const protection = Array.from(this.protectionsByWallet.values())
      .flatMap(w => Array.from(w.values()))
      .find(p => p.boughtEvent.args.id === protectionId)
    if (!protection) {
      throw new CustomError({
        name: 'protection-not-found-error',
        errorKind: ErrorKind.UserError,
        httpStatus: StatusCodes.BAD_REQUEST,
        message: 'protection id not found',
        extras: {
          protectionId,
        },
      })
    }

    return this.getProtectionStatus({
      ...protection,
      useCache,
      blockNumber: blockNumber || (await this.latestBlockInfoInversifyService.getCurrentBlock().then(b => b.number)),
    })
  }

  private async getProtectionStatus({
    boughtEvent,
    expiredEvent,
    metadata,
    blockNumber,
    useCache,
  }: Pick<ProtectionInfo, 'boughtEvent' | 'expiredEvent' | 'metadata'> & {
    blockNumber: number
    useCache: boolean
  }): Promise<ProtectionStatus> {
    const statusVersion = 6
    const statusS3Key = `armadillo::protection-id::${boughtEvent.args.id}-chain-id::${this.chainId}::block-number::${blockNumber}::status`

    const statusFromS3 =
      useCache && expiredEvent && (await this.s3InversifyService?.readS3Key_legacy<ProtectionStatus>(statusS3Key))

    if (statusFromS3 && statusFromS3.version === statusVersion) {
      return statusFromS3.value
    }

    const token1EntryPrice = boughtEvent.args.token1EntryPriceUSD
    const token2EntryPrice = boughtEvent.args.token2EntryPriceUSD
    const [blockInfo, token1EndPrice, token2EndPrice, payoutOrDuePayoutUsdc, ilPercentageFromContract] =
      await Promise.all([
        this.asyncQueueInversifyService.push(() => this.ethersJsonRpcBatchProvider.getBlock(blockNumber)),
        this.asyncQueueInversifyService.push(() =>
          this.ilContractsInversifyService.tokenPairRepository
            .getTokenPrice(
              boughtEvent.args.tokenName1.ArmadilloSupportedTokenName,
              boughtEvent.args.tokenName2.ArmadilloSupportedTokenName,
              true,
              {
                blockTag: blockNumber,
              },
            )
            .then(
              price => toNumber(price, 8),
              error => {
                throw new CustomError({
                  name: 'getTokenPriceError',
                  errorKind: ErrorKind.SystemError,
                  message: 'failed to calculate token price',
                  cause: error,
                  extras: {
                    tokenName1: boughtEvent.args.tokenName1.ArmadilloSupportedTokenName,
                    tokenName2: boughtEvent.args.tokenName2.ArmadilloSupportedTokenName,
                    calculateFirstToken: true,
                    blockNumber,
                  },
                })
              },
            ),
        ),
        this.asyncQueueInversifyService.push(() =>
          this.ilContractsInversifyService.tokenPairRepository
            .getTokenPrice(
              boughtEvent.args.tokenName1.ArmadilloSupportedTokenName,
              boughtEvent.args.tokenName2.ArmadilloSupportedTokenName,
              false,
              {
                blockTag: blockNumber,
              },
            )
            .then(
              price => toNumber(price, 8),
              error => {
                throw new CustomError({
                  name: 'getTokenPriceError',
                  errorKind: ErrorKind.SystemError,
                  message: 'failed to calculate token price',
                  cause: error,
                  extras: {
                    tokenName1: boughtEvent.args.tokenName1.ArmadilloSupportedTokenName,
                    tokenName2: boughtEvent.args.tokenName2.ArmadilloSupportedTokenName,
                    calculateFirstToken: false,
                    blockNumber,
                  },
                })
              },
            ),
        ),
        this.asyncQueueInversifyService.push(() =>
          this.ilContractsInversifyService.controller
            .calcAmountToBePaidWithProtectionId(boughtEvent.args.id, { blockTag: blockNumber })
            .then(payout => this.tokenUSDC.toNumber(payout))
            .catch(error => {
              throw new CustomError({
                name: 'calcAmountToBePaidWithProtectionIdError',
                message: 'Failed to call calcAmountToBePaidWithProtectionId',
                errorKind: ErrorKind.SystemError,
                cause: error,
                extras: {
                  boughtEvent,
                },
              })
            }),
        ),
        this.asyncQueueInversifyService.push(() =>
          this.ilProtectionInversifyService
            .getActiveProtectionIlPercentage({
              protectionId: boughtEvent.args.id,
              blockTag: blockNumber,
            })
            .catch(() => {
              // this method was created only a while ago, so it might not be available yet
              return undefined
            }),
        ),
      ])

    const ilPercentage =
      ilPercentageFromContract ?? calculateIL(token1EntryPrice, token2EntryPrice, token1EndPrice, token2EndPrice) * 100

    const payoutOrDuePayoutWithoutMinUsdc = await this.asyncQueueInversifyService.push(() =>
      this.calcAmountToBePaidWithoutMinPayout({
        boughtEvent,
        payoutOrDuePayoutUsdc,
        lpTokensWorthAtBuyTimeUsdc: metadata.lpTokensWorthAtBuyTimeUsdc,
        maxAmountToBePaidUsdc: metadata.maxAmountToBePaidUsdc,
        token1EndPrice,
        token2EndPrice,
        blockNumber,
      }),
    )
    const premiumCost = boughtEvent.args.premiumCostUSD

    const getInfo = (
      payout: number,
    ): Pick<
      ProtectionStatus,
      'payoutOrDuePayoutUsdc' | 'lpRevenueUsdc' | 'lpProfitPercentage' | 'userRevenueUsdc' | 'userProfitPercentage'
    > => {
      const lpRevenueUsdc = premiumCost - payout
      const lpProfitPercentage = (lpRevenueUsdc / premiumCost) * 100

      const userRevenueUsdc = payout - premiumCost
      const userProfitPercentage = (userRevenueUsdc / premiumCost) * 100

      return {
        payoutOrDuePayoutUsdc: catDecimalsWithRound(payout, 8),
        lpProfitPercentage: catDecimalsWithRound(lpProfitPercentage, 8),
        lpRevenueUsdc: catDecimalsWithRound(lpRevenueUsdc, 8),
        userProfitPercentage: catDecimalsWithRound(userProfitPercentage, 8),
        userRevenueUsdc: catDecimalsWithRound(userRevenueUsdc, 8),
      }
    }

    const result: ProtectionStatus = {
      blockNumber,
      blockTimestamp: blockInfo.timestamp,
      blockTimestampUtc: new Date(blockInfo.timestamp * 1000).toISOString(),
      ilPercentage,
      ...getInfo(payoutOrDuePayoutUsdc),
      withoutMinPayout: getInfo(payoutOrDuePayoutWithoutMinUsdc),
    }

    // if useCache===False, we don't save it in s3 as well because maybe
    // we are in a fix-bug session and the data is not verified
    if (useCache && expiredEvent) {
      await this.s3InversifyService?.writeToS3Key_legacy<ProtectionStatus>(statusS3Key, {
        version: statusVersion,
        value: result,
      })
    }

    return result
  }

  private async calcMaxAmountToBePaidUsdc({
    boughtEvent,
    lpTokensWorthAtBuyTimeUSD,
  }: {
    boughtEvent: FormattedProtectionBoughtEvent
    lpTokensWorthAtBuyTimeUSD: number
  }) {
    const [maxIlRatio, growth] = await Promise.all([
      this.asyncQueueInversifyService.push(() =>
        this.ilProtectionInversifyService.getMaxILProtectedPercentage(boughtEvent.blockNumber).then(
          r => r.number / 100,
          e => {
            return 0.15
          },
        ),
      ),
      this.asyncQueueInversifyService.push(() =>
        this.ilProtectionInversifyService.getExpectedLPTokensValueGrowth(boughtEvent.blockNumber).then(r => r.number),
      ),
    ])

    return calcEstimatedAmountToBePaid(lpTokensWorthAtBuyTimeUSD, growth, maxIlRatio)
  }

  private addProtectionEvent = async ({
    protectionsByWallet,
    boughtEvent,
    expiredEvent,
    currentBlockNumber,
  }: {
    protectionsByWallet: Map<WalletAddress, Map<ProtectionId, ProtectionInfo>>
    boughtEvent: FormattedProtectionBoughtEvent
    expiredEvent?: FormattedProtectionClosedEvent
    currentBlockNumber: number
  }): Promise<ProtectionInfo> => {
    const walletProtections =
      protectionsByWallet.get(boughtEvent.args.owner.toLowerCase()) ??
      (() => {
        const newMap = new Map<ProtectionId, ProtectionInfo>()
        protectionsByWallet.set(boughtEvent.args.owner.toLowerCase(), newMap)
        return newMap
      })()

    const metadataSchemaVersion = 4
    const metadataS3Key = `armadillo::protection-id::${boughtEvent.args.id}-chain-id::${this.chainId}::metadata`

    const metadataFromS3 = await this.s3InversifyService?.readS3Key_legacy<ProtectionMetadata>(metadataS3Key)

    const info =
      metadataFromS3?.version === metadataSchemaVersion
        ? metadataFromS3.value
        : await this.asyncQueueInversifyService.push(async () => {
            const r = await this.ilProtectionInversifyService.getProtectionMetadata(boughtEvent.args.id)
            await this.s3InversifyService?.writeToS3Key_legacy<ProtectionMetadata>(metadataS3Key, {
              version: metadataSchemaVersion,
              value: r,
            })
            return r
          })

    const maxAmountToBePaidUsdc =
      info.maxAmountToBePaidUsdc > 0
        ? info.maxAmountToBePaidUsdc
        : await this.calcMaxAmountToBePaidUsdc({
            boughtEvent,
            lpTokensWorthAtBuyTimeUSD: info.lpTokensWorthAtBuyTimeUSD,
          })

    const embedDiscount = this.protectionMintDiscountDetailsEvents.get(boughtEvent.args.id)

    const embedDiscountTypeInfo =
      embedDiscount &&
      this.embedArmadilloDiscountInversifyService.discountTypesInfo.find(
        d =>
          d.typeId ===
          // omri saves the id as plus one from embed
          embedDiscount.args.discountNFTType - 1,
      )

    const metadata: ProtectionInfoMetadata = {
      lpTokensWorthAtBuyTimeUsdc: info.lpTokensWorthAtBuyTimeUSD,
      maxAmountToBePaidUsdc,
      feePercentage: info.feePercentage ? catDecimalsWithRound(info.feePercentage, 8) : undefined,
      feeUsdc: info.feeUsdc ? catDecimalsWithRound(info.feeUsdc, 8) : undefined,
      embedDiscount: embedDiscount &&
        embedDiscountTypeInfo && {
          discountTypeId: embedDiscountTypeInfo.typeId,
          discountTypeName: embedDiscountTypeInfo.name,
          discountUsdc: embedDiscount.args.premiumCostDiscount,
        },
    }

    const status = await this.getProtectionStatus({
      boughtEvent,
      expiredEvent,
      blockNumber: expiredEvent ? expiredEvent.blockNumber - 1 : currentBlockNumber,
      metadata,
      useCache: true,
    })

    const updatedProtectionInfo: ProtectionInfo = {
      metadata,
      status,
      boughtEvent,
      expiredEvent,
    }

    walletProtections.set(boughtEvent.args.id, updatedProtectionInfo)

    return updatedProtectionInfo
  }

  private updateActiveProtectionsState() {
    const task = async (): Promise<void> => {
      const latestBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()
      await Promise.all(
        Array.from(cloneDeep(this.protectionsByWallet.values())).map(async protectionIdToProtectionInfo => {
          await Promise.all(
            Array.from(protectionIdToProtectionInfo.values()).map(async protectionInfo => {
              if (
                !protectionInfo.expiredEvent &&
                protectionInfo.boughtEvent.args.protectionEndTimestamp > latestBlock.timestamp
              ) {
                protectionInfo.status = await this.getProtectionStatus({
                  ...protectionInfo,
                  blockNumber: latestBlock.number,
                  useCache: true,
                })
              }
            }),
          )
        }),
      )
    }

    let lastTask: Promise<void> | undefined
    const interval = async (): Promise<void> => {
      try {
        if (!lastTask) {
          lastTask = task()
          await lastTask
        }
      } catch (error) {
        this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      } finally {
        lastTask = undefined
      }
    }

    const id = setInterval(interval, 10_000)
    interval()

    return async () => {
      clearInterval(id)
      await lastTask
    }
  }

  private async fillOldProtections(
    protectionsByWallet: Map<WalletAddress, Map<ProtectionId, ProtectionInfo>>,
    currentBlockNumber: number,
    address?: string,
  ) {
    const [allBought, allClosed] = await Promise.all([
      this.ilContractsEventsInversifyService.getProtectionsBoughtEventsUpToNow(address),
      this.ilContractsEventsInversifyService.getProtectionsClosedEventsUpToNow(address),
    ])

    for (const boughtEvent of allBought) {
      this.boughtEvents.set(boughtEvent.args.id.toString(), boughtEvent)
    }
    for (const closedEvent of allClosed) {
      this.expiredEvents.set(closedEvent.args.id.toString(), closedEvent)
    }

    await Promise.all(
      allBought.map(boughtEvent =>
        this.addProtectionEvent({
          protectionsByWallet,
          boughtEvent,
          expiredEvent: this.expiredEvents.get(boughtEvent.args.id.toString()),
          currentBlockNumber,
        }),
      ),
    )
  }

  public async getOldProtections(currentBlockNumber: number, address?: string) {
    const protectionsByWallet = new Map<WalletAddress, Map<ProtectionId, ProtectionInfo>>()

    await this.fillOldProtections(protectionsByWallet, currentBlockNumber, address)

    return protectionsByWallet
  }

  public listenToProtectionEvents(options?: { address?: string; loadChartsData?: boolean }) {
    const cleanups: (() => unknown | Promise<unknown>)[] = []

    let didGetOldProtectionsEvents = false

    const id = setTimeout(async () => {
      const addNewProtectionEvent = async (event: FormattedProtectionBoughtEvent | FormattedProtectionClosedEvent) => {
        try {
          const boughtEvent =
            event.type === 'ProtectionBoughtEvent' ? event : this.boughtEvents.get(event.args.id.toString())

          if (!boughtEvent) {
            throw new Error(`can't be here`)
          }

          switch (event.type) {
            case 'ProtectionBoughtEvent':
              this.boughtEvents.set(event.args.id.toString(), event)
              break
            case 'ProtectionClosedEvent':
              this.expiredEvents.set(event.args.id.toString(), event)
              break
          }

          await this.addProtectionEvent({
            protectionsByWallet: this.protectionsByWallet,
            boughtEvent,
            expiredEvent: this.expiredEvents.get(boughtEvent.args.id.toString()),
            currentBlockNumber: event.blockNumber,
          })

          this.globalEventsInversifyService.eventEmitter.emit('ilWalletProtections', {
            address: event.args.owner,
            protections: cloneDeep(this.protectionsByWallet.get(event.args.owner.toLowerCase()) ?? new Map()),
          })
        } catch (error) {
          this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        }
      }

      const run = async () => {
        try {
          const cleanup = this.updateActiveProtectionsState()
          cleanups.push(() => cleanup())

          if (!options?.address) {
            console.log(`il-admin-panel-service: subscribing to new protection events`)
          }

          this.globalEventsInversifyService.eventEmitter.on(
            'ilNewContractEventProtectionsBought',
            addNewProtectionEvent,
          )
          cleanups.push(() =>
            this.globalEventsInversifyService.eventEmitter.off(
              'ilNewContractEventProtectionsBought',
              addNewProtectionEvent,
            ),
          )

          this.globalEventsInversifyService.eventEmitter.on('ilNewContractEventProtectionClosed', addNewProtectionEvent)
          cleanups.push(() =>
            this.globalEventsInversifyService.eventEmitter.off(
              'ilNewContractEventProtectionClosed',
              addNewProtectionEvent,
            ),
          )

          const onNewContractEventProtectionMintDiscountDetailsEvent = (
            event: FormattedProtectionMintDiscountDetailsEvent,
          ) => this.protectionMintDiscountDetailsEvents.set(event.args.id, event)

          this.globalEventsInversifyService.eventEmitter.on(
            'ilContractNewEventProtectionMintDiscountDetailsEvent',
            onNewContractEventProtectionMintDiscountDetailsEvent,
          )
          cleanups.push(() =>
            this.globalEventsInversifyService.eventEmitter.off(
              'ilContractNewEventProtectionMintDiscountDetailsEvent',
              onNewContractEventProtectionMintDiscountDetailsEvent,
            ),
          )

          const stop1 = this.ilContractsEventsInversifyService.registerNewProtectionsBoughtEvents(options?.address)
          cleanups.push(stop1)

          const stop2 = this.ilContractsEventsInversifyService.registerNewProtectionClosedEvents(options?.address)
          cleanups.push(stop2)

          const stop3 = this.ilContractsEventsInversifyService.registerNewProtectionMintDiscountDetailsEvents()
          cleanups.push(stop3)

          const end = startTimer()

          if (!options?.address) {
            console.log(`il-admin-panel-service: loading all protection events until now...`)
          }

          const oldProtectionMintDiscountDetailsEvents =
            await this.ilContractsEventsInversifyService.getOldProtectionMintDiscountDetailsEvents()

          for (const event of oldProtectionMintDiscountDetailsEvents) {
            onNewContractEventProtectionMintDiscountDetailsEvent(event)
          }

          await this.fillOldProtections(
            this.protectionsByWallet,
            await this.latestBlockInfoInversifyService.getCurrentBlock().then(r => r.number),
            options?.address,
          )

          if (!options?.address) {
            console.log(`il-admin-panel-service: loaded all protection events until now (${end().toFixed(0)}s)`)
          }

          if (!options?.address) {
            console.log(`il-admin-panel-service: ready: ${new Date().toISOString()} (${end().toFixed(0)}s)`, {
              wallets: this.protectionsByWallet.size,
              protections: Array.from(this.protectionsByWallet.values()).reduce((acc, cur) => acc + cur.size, 0),
            })
          }

          didGetOldProtectionsEvents = true

          if (options?.address) {
            this.globalEventsInversifyService.eventEmitter.emit('ilWalletProtections', {
              address: options.address,
              protections: this.protectionsByWallet.get(options.address.toLowerCase()) ?? new Map(),
            })
          } else {
            for (const [address, protections] of this.protectionsByWallet) {
              this.globalEventsInversifyService.eventEmitter.emit('ilWalletProtections', {
                address,
                protections: cloneDeep(protections),
              })
            }
          }
        } catch (error) {
          this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        }
      }
      const promise = run()
      cleanups.push(async () => {
        await promise
      })
      await promise
    }, 0)

    return {
      isReady: () => didGetOldProtectionsEvents,
      cleanup: async () => {
        clearTimeout(id)
        await Promise.all(cleanups.map(cleanup => cleanup()))
      },
    }
  }
}
