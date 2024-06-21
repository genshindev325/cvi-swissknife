import { gql, request } from 'graphql-request'
import { inject, injectable } from 'inversify'
import { StrictEventEmitter } from 'strict-event-emitter'
import { concatMap, Subject } from 'rxjs'
import axios from 'axios'
import { BigNumber } from 'ethers'
import type {
  PolygonClosePosition,
  PolygonClosePositionRaw,
  PolygonOpenPosition,
  PolygonOpenPositionRaw,
} from '../types'
import { getDateNowSeconds, theGraphUrls } from '../util/utils'
import type { PolygonContractsInversifyService } from '../blockchains/polygon-contracts.inversify.service'
import { sumBigNumber } from '../util/big-number'
import { openPositionsData } from '../blockchains/open-positions-data.the-graph'
import { closePositionsData } from '../blockchains/close-positions-data.the-graph'

export type WalletId = string
export type OpenClosePositionsTraderInfo = {
  pnl: BigNumber
  allPnl: BigNumber
  positionsHistory: (PolygonOpenPosition | PolygonClosePosition)[]
  allPositionsHistory: (PolygonOpenPosition | PolygonClosePosition)[]
  currentWorthInUsdc: BigNumber
  pastWorthInUsdc?: BigNumber
}

@injectable()
export class PolygonPositionsTheGraphInversifyService {
  private lastKnownTimestampOpenPositionsPolling = 0

  private lastKnownTimestampClosePositionsPolling = 0

  private allPositions = new Map<string, PolygonOpenPosition | PolygonClosePosition>()

  constructor(
    @inject('PolygonContractsInversifyService')
    private polygonContractsInversifyService: PolygonContractsInversifyService,
  ) {}

  public isPositionInTimeframe(options: {
    position: PolygonOpenPosition | PolygonClosePosition
    fromEpoch: number
  }): boolean {
    return options.position.epochSeconds > options.fromEpoch
  }

  private calculateWalletPositionsInfo(
    options: {
      walletId: string
      positionsHistoryOfWallet: (PolygonOpenPosition | PolygonClosePosition)[]
    } & (
      | {
          strategy: 'all-time'
          currentWorthInUsdc: BigNumber
        }
      | {
          strategy: 'last-x-sec'
          lastXSec: number
          currentWorthInUsdc: BigNumber
          pastWorthInUsdc: BigNumber
        }
    ),
  ): BigNumber {
    const closePositionsWorth = sumBigNumber(
      options.positionsHistoryOfWallet
        .filter(
          (p): p is PolygonClosePosition =>
            p.eventType === 'ClosePosition' &&
            (options.strategy === 'all-time' ||
              this.isPositionInTimeframe({ position: p, fromEpoch: getDateNowSeconds() - options.lastXSec })),
        )
        .map(p => p.tokenAmount.sub(p.feeAmount)),
    )

    const openPositionsWorth = sumBigNumber(
      options.positionsHistoryOfWallet
        .filter(
          (p): p is PolygonOpenPosition =>
            p.eventType === 'OpenPosition' &&
            (options.strategy === 'all-time' ||
              this.isPositionInTimeframe({ position: p, fromEpoch: getDateNowSeconds() - options.lastXSec })),
        )
        .map(p => p.tokenAmount.sub(p.feeAmount)),
    )

    if (options.strategy === 'last-x-sec') {
      return closePositionsWorth.add(options.currentWorthInUsdc).sub(openPositionsWorth).sub(options.pastWorthInUsdc)
    }

    return closePositionsWorth.add(options.currentWorthInUsdc).sub(openPositionsWorth)
  }

  public getCviIndexHistoryAsc() {
    return axios
      .get<[number, number][]>('https://api-v2.cvi.finance/history?chain=Polygon&index=CVI')
      .then(r =>
        r.data
          .map(([epoch, cviValue]) => ({ cviIndex: cviValue, dateMs: epoch * 1000 }))
          .sort((a, b) => a.dateMs - b.dateMs),
      )
  }

  public pollingOpenClosePositionsTraders(
    options: { strategy: 'all-time' } | { strategy: 'last-x-sec'; lastXSec: number },
  ) {
    const eventEmitter = new StrictEventEmitter<{
      openClosePositionsTradersUpdate: (options: {
        tradersInfo: Map<WalletId, OpenClosePositionsTraderInfo>
        updatedWalletIds: Set<WalletId>
      }) => void
    }>()

    const tradersInfoMap = new Map<WalletId, OpenClosePositionsTraderInfo>()

    const newPositions$ = new Subject<(PolygonOpenPosition | PolygonClosePosition)[]>()

    const listenToNewPositionsSubscription = newPositions$
      .pipe(
        concatMap(async positions => {
          const walletIds = Array.from(new Set(positions.map(p => p.account)))

          const [openPositionWorthOfWalletsNow, openPositionWorthOfWalletsLastXSeconds] = await Promise.all([
            this.polygonContractsInversifyService.getOpenPositionWorthOfWallets({ walletIds }),
            this.polygonContractsInversifyService.getOpenPositionWorthOfWallets({
              walletIds,
              fromTsSeconds: options.strategy === 'last-x-sec' ? getDateNowSeconds() - options.lastXSec : undefined,
            }),
          ])

          const relaventWalletIdsSet = new Set<WalletId>(
            options.strategy === 'all-time'
              ? walletIds
              : walletIds.filter((_walletId, i) => openPositionWorthOfWalletsLastXSeconds[i].gt(0)),
          )

          for (const position of positions) {
            const isPositionInTimeframe =
              options.strategy === 'all-time' ||
              this.isPositionInTimeframe({ position, fromEpoch: getDateNowSeconds() - options.lastXSec })

            const walletIndex = walletIds.indexOf(position.account)
            if (walletIndex === -1) {
              throw new Error(`can't be here`)
            }

            const isWalletHasPositiveBalanceInTimeframe = openPositionWorthOfWalletsLastXSeconds[walletIndex].gte(1)

            if (isPositionInTimeframe || isWalletHasPositiveBalanceInTimeframe) {
              const positionWorthUsdcCurrent = openPositionWorthOfWalletsNow[walletIndex]
              const positionWorthUsdcLastXSec = openPositionWorthOfWalletsLastXSeconds[walletIndex]

              const traderInfo =
                tradersInfoMap.get(position.account) ??
                (() => {
                  const t: OpenClosePositionsTraderInfo = {
                    pnl: BigNumber.from(0),
                    allPnl: BigNumber.from(0),
                    positionsHistory: [],
                    allPositionsHistory: [],
                    currentWorthInUsdc: BigNumber.from(0),
                  }
                  tradersInfoMap.set(position.account, t)
                  return t
                })()

              traderInfo.currentWorthInUsdc = positionWorthUsdcCurrent

              traderInfo.allPositionsHistory.push(position)

              if (isPositionInTimeframe) {
                traderInfo.positionsHistory.push(position)
              }

              traderInfo.allPnl = this.calculateWalletPositionsInfo({
                walletId: position.account,
                positionsHistoryOfWallet: traderInfo.positionsHistory,
                strategy: 'all-time',
                currentWorthInUsdc: positionWorthUsdcCurrent,
              })

              if (options.strategy === 'all-time') {
                traderInfo.pnl = traderInfo.allPnl
              } else {
                traderInfo.pnl = this.calculateWalletPositionsInfo({
                  walletId: position.account,
                  positionsHistoryOfWallet: traderInfo.positionsHistory,
                  strategy: 'last-x-sec',
                  lastXSec: options.lastXSec,
                  currentWorthInUsdc: positionWorthUsdcCurrent,
                  pastWorthInUsdc: positionWorthUsdcLastXSec,
                })
                traderInfo.pastWorthInUsdc = positionWorthUsdcLastXSec
              }
            }
          }

          return relaventWalletIdsSet
        }),
      )
      .subscribe(relaventWalletIdsSet => {
        if (relaventWalletIdsSet.size > 0) {
          eventEmitter.emit('openClosePositionsTradersUpdate', {
            tradersInfo: tradersInfoMap,
            updatedWalletIds: relaventWalletIdsSet,
          })
        }
      })

    // first, load all positions that we alreadfy received from the-graph by now.
    // do it only after the UI will subscribe to the event emitter!!!
    setTimeout(() => {
      if (this.allPositions.size > 0) {
        newPositions$.next(Array.from(this.allPositions.values()))
      }
    }, 0)

    const r1 = this.pollingOpenPositions()
    const r2 = this.pollingClosePositions()

    function onNewPositions(positions: (PolygonOpenPosition | PolygonClosePosition)[]) {
      newPositions$.next(positions)
    }

    r1.eventEmitter.on('openPositions', onNewPositions)
    r2.eventEmitter.on('closePositions', onNewPositions)

    const fiveMinutesInMs = 5 * 60 * 1000

    const updateCurrentOpenPositionsId = setInterval(async () => {
      const tradersInfoArray = Array.from(tradersInfoMap.entries())
      const walletIds = tradersInfoArray.map(t => t[0])

      const [openPositionWorthOfWalletsNow, openPositionWorthOfWalletsLastXSeconds] = await Promise.all([
        this.polygonContractsInversifyService.getOpenPositionWorthOfWallets({ walletIds }),
        this.polygonContractsInversifyService.getOpenPositionWorthOfWallets({
          walletIds,
          fromTsSeconds: options.strategy === 'last-x-sec' ? getDateNowSeconds() - options.lastXSec : undefined,
        }),
      ])

      for (const [i, [_walletId, traderInfo]] of tradersInfoArray.entries()) {
        traderInfo.currentWorthInUsdc = openPositionWorthOfWalletsNow[i]
        if (options.strategy === 'all-time') {
          traderInfo.pnl = this.calculateWalletPositionsInfo({
            walletId: _walletId,
            positionsHistoryOfWallet: traderInfo.positionsHistory,
            strategy: 'all-time',
            currentWorthInUsdc: openPositionWorthOfWalletsNow[i],
          })
        } else {
          traderInfo.pnl = this.calculateWalletPositionsInfo({
            walletId: _walletId,
            positionsHistoryOfWallet: traderInfo.positionsHistory,
            strategy: 'last-x-sec',
            lastXSec: options.lastXSec,
            currentWorthInUsdc: openPositionWorthOfWalletsNow[i],
            pastWorthInUsdc: openPositionWorthOfWalletsLastXSeconds[i],
          })
          traderInfo.pastWorthInUsdc = openPositionWorthOfWalletsLastXSeconds[i]
        }
      }

      eventEmitter.emit('openClosePositionsTradersUpdate', {
        tradersInfo: tradersInfoMap,
        updatedWalletIds: new Set(walletIds),
      })
    }, fiveMinutesInMs)

    return {
      eventEmitter,
      stopReceivingData: () => {
        clearInterval(updateCurrentOpenPositionsId)
        r1.eventEmitter.off('openPositions', onNewPositions)
        r2.eventEmitter.off('closePositions', onNewPositions)
        r1.stopReceivingData()
        r2.stopReceivingData()
        listenToNewPositionsSubscription.unsubscribe()
      },
    }
  }

  public pollingOpenPositions() {
    const eventEmitter = new StrictEventEmitter<{
      openPositions: (openPositions: PolygonOpenPosition[]) => void
    }>()

    let closed = false
    setTimeout(async () => {
      const save = (result: { openPositions: PolygonOpenPositionRaw[] }) => {
        const positions = result.openPositions.map<PolygonOpenPosition>(raw => ({
          eventType: 'OpenPosition',
          id: raw.id,
          account: raw.account,
          blockNumber: Number(raw.blockNumber),
          epochSeconds: Number(raw.timestamp),
          dateUtc: new Date(Number(raw.timestamp) * 1000).toISOString(),
          cviValue: BigNumber.from(raw.cviValue),
          feeAmount: BigNumber.from(raw.feeAmount),
          tokenAmount: BigNumber.from(raw.tokenAmount),
          leverage: raw.leverage,
          positionUnitsAmount: BigNumber.from(raw.positionUnitsAmount),
        }))

        const newPositions: PolygonOpenPosition[] = []
        for (const r of positions) {
          if (!this.allPositions.has(r.id)) {
            this.allPositions.set(r.id, r)
            newPositions.push(r)
          }
        }
        if (newPositions.length > 0) {
          eventEmitter.emit('openPositions', newPositions)
        }
        this.lastKnownTimestampOpenPositionsPolling = Number(
          result.openPositions[result.openPositions.length - 1].timestamp,
        )
      }

      save({ openPositions: openPositionsData() })

      while (!closed) {
        const result = await request<{ openPositions: PolygonOpenPositionRaw[] }>(
          theGraphUrls.cvi.polygon.platform,
          gql`
      query query1($orderBy: String, $orderDirection: String) {
        openPositions(first: 1000, orderBy: $orderBy, 
          orderDirection: $orderDirection, where: {timestamp_gt: ${this.lastKnownTimestampOpenPositionsPolling}}) {
            id
            blockNumber
            timestamp
            account
            tokenAmount
            feeAmount
            positionUnitsAmount
            leverage
            cviValue
          }
        }
        `,
          {
            orderBy: 'timestamp',
            orderDirection: 'asc',
          },
        )
        if (result.openPositions.length > 0) {
          save(result)
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
    })

    return {
      eventEmitter,
      stopReceivingData: () => {
        closed = true
      },
    }
  }

  public pollingClosePositions() {
    const eventEmitter = new StrictEventEmitter<{
      closePositions: (closePositions: PolygonClosePosition[]) => void
    }>()

    let closed = false
    setTimeout(async () => {
      const save = (result: { closePositions: PolygonClosePositionRaw[] }) => {
        const positions = result.closePositions.map<PolygonClosePosition>(raw => ({
          eventType: 'ClosePosition',
          id: raw.id,
          account: raw.account,
          platformAddress: raw.platformAddress,
          blockNumber: Number(raw.blockNumber),
          epochSeconds: Number(raw.timestamp),
          dateUtc: new Date(Number(raw.timestamp) * 1000).toISOString(),
          cviValue: BigNumber.from(raw.cviValue),
          feeAmount: BigNumber.from(raw.feeAmount),
          tokenAmount: BigNumber.from(raw.tokenAmount),
          leverage: raw.leverage,
          positionUnitsAmount: BigNumber.from(raw.positionUnitsAmount),
        }))

        const newPositions: PolygonClosePosition[] = []
        for (const r of positions) {
          if (!this.allPositions.has(`${r.epochSeconds}_${r.account}`)) {
            this.allPositions.set(`${r.epochSeconds}_${r.account}`, r)
            newPositions.push(r)
          }
        }
        if (newPositions.length > 0) {
          eventEmitter.emit('closePositions', newPositions)
        }
        this.lastKnownTimestampClosePositionsPolling = Number(
          result.closePositions[result.closePositions.length - 1].timestamp,
        )
      }

      save({ closePositions: closePositionsData() })

      while (!closed) {
        const result = await request<{ closePositions: PolygonClosePositionRaw[] }>(
          theGraphUrls.cvi.polygon.platform,
          gql`
            query query2($orderBy: String, $orderDirection: String) {
              closePositions(first: 1000, orderBy: $orderBy, 
                  orderDirection: $orderDirection, where: {timestamp_gt: ${this.lastKnownTimestampClosePositionsPolling}}) {
                    id
                    platformAddress
                    blockNumber
                    timestamp
                    account
                    tokenAmount
                    feeAmount
                    positionUnitsAmount
                    leverage
                    cviValue
                  }
              }
              `,
          {
            orderBy: 'timestamp',
            orderDirection: 'asc',
          },
        )
        if (result.closePositions.length > 0) {
          save(result)
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
    }, 0)
    return {
      eventEmitter,
      stopReceivingData: () => {
        closed = true
      },
    }
  }
}
