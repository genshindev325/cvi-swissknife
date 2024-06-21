import type { FC } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import type { LpRevenueLiquidityPoint } from '../redux'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import type { FormattedLiquidityAddedEvent, FormattedLiquidityWithdrawnEvent, Point } from '@coti-cvi/lw-sdk'
import { sortEventsAsc } from '@coti-cvi/lw-sdk'
import { getIlBackendClient } from '@coti-cvi/lw-sdk'
import useInversify from '../use-inversify'
import usePromise from 'react-use-promise'
import {
  FormattedProtectionBoughtEventDto,
  FormattedProtectionClosedEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'

type Props = {}

export const Effects: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const isDebugMode = useAppSelector(state => state.isDebugMode)
  const ilBackendBaseUrl = useAppSelector(state => state.ilBackendBaseUrl)
  const {
    ilContractsEventsInversifyService,
    iLProtectionInversifyService,
    tokenUSDC,
    ethersJsonRpcBatchProvider,
    globalEventsInversifyService,
    embedArmadilloDiscountInversifyService,
    asyncQueueInversifyService,
  } = useInversify()
  const chainId = useAppSelector(state => state.chainId)
  const currentLiquidityUsdc = useAppSelector(state => state.currentLiquidityUsdc)
  const walletsProtections = useAppSelector(state => state.walletsProtections)
  const liquidityEvents = useAppSelector(state => state.liquidityEvents)

  const [newLiquidityEvents = []] = usePromise(async () => {
    if (!ilContractsEventsInversifyService) {
      return
    }

    const [oldAdded, oldWithdrawn] = await Promise.all([
      ilContractsEventsInversifyService.getOldLiquidityAddedEvents(),
      ilContractsEventsInversifyService.getOldLiquidityWithdrawnEvents(),
    ])
    return [...oldAdded, ...oldWithdrawn]
  }, [ilContractsEventsInversifyService])

  useEffect(() => {
    dispatch(actions.addLiquidityEvents(newLiquidityEvents))
  }, [dispatch, newLiquidityEvents])

  useEffect(() => {
    async function init() {
      if (tokenUSDC && iLProtectionInversifyService) {
        const [liquidityUsdc, workingCapitalUsdc] = await Promise.all([
          iLProtectionInversifyService.getLiquidity(),
          iLProtectionInversifyService.getWorkingCapitalUsdc(),
        ])
        dispatch(actions.setCurrentLiquidityUsdc(tokenUSDC.toNumber(liquidityUsdc)))
        dispatch(actions.setCurrentWorkingCapitalUsdc(tokenUSDC.toNumber(workingCapitalUsdc)))
      }
    }
    init()
  }, [dispatch, iLProtectionInversifyService, tokenUSDC])

  useEffect(() => {
    const get = async () => {
      const walletsProtections = await getIlBackendClient(chainId, {
        baseUrl: ilBackendBaseUrl,
      }).accounts.adminApiControllerProtections()

      dispatch(actions.setWalletsProtections(walletsProtections))
    }
    get()
    const id = setInterval(get, 300_000)
    return () => clearInterval(id)
  }, [chainId, dispatch, ilBackendBaseUrl])

  const [liqEventsBlockTimestampsSeconds] = usePromise<Record<number, number> | undefined>(async () => {
    if (!ethersJsonRpcBatchProvider || !asyncQueueInversifyService) {
      return
    }
    const result = await Promise.all(
      liquidityEvents.map<Promise<[number, number]>>(async event => [
        event.blockNumber,
        await asyncQueueInversifyService.push(
          () => ethersJsonRpcBatchProvider.getBlock(event.blockNumber).then(b => b.timestamp),
          'getBlock',
        ),
      ]),
    )

    return Object.fromEntries(result)
  }, [asyncQueueInversifyService, ethersJsonRpcBatchProvider, liquidityEvents])

  useEffect(() => {
    if (liqEventsBlockTimestampsSeconds) {
      dispatch(actions.setBlocksToTimestamp(liqEventsBlockTimestampsSeconds))
    }
  }, [dispatch, liqEventsBlockTimestampsSeconds])

  const calculateEventTimestamp = useCallback(
    ({
      event,
      liqEventsBlockTimestampsSeconds,
    }: {
      liqEventsBlockTimestampsSeconds: Record<number, number>
      event:
        | FormattedLiquidityAddedEvent
        | FormattedLiquidityWithdrawnEvent
        | FormattedProtectionBoughtEventDto
        | FormattedProtectionClosedEventDto
    }): number => {
      if (event.type === FormattedProtectionBoughtEventDto.type.PROTECTION_BOUGHT_EVENT) {
        return event.args.protectionStartTimestamp * 1000
      }
      if (event.type === FormattedProtectionClosedEventDto.type.PROTECTION_CLOSED_EVENT) {
        return event.args.protectionEndTimestamp * 1000
      }
      return liqEventsBlockTimestampsSeconds[event.blockNumber] * 1000
    },
    [],
  )

  useEffect(
    function createLpRevenueVsTotalLiquiditySerie() {
      if (!tokenUSDC || !liqEventsBlockTimestampsSeconds || currentLiquidityUsdc === undefined) {
        return
      }

      const liquidityEventsReversed = liquidityEvents.slice().sort(sortEventsAsc).reverse()

      const lpRevenueVsTotalLiquiditySerie: LpRevenueLiquidityPoint[] = []

      let sumLpRevenueUntilNow = 0

      // calculate serie until now

      const expiredProtectionsEvents = walletsProtections
        .flatMap(walletProtections => walletProtections.protections)
        .map(p => p.protectionInfo.expiredEvent)
        .filter((e): e is FormattedProtectionClosedEventDto => Boolean(e))
        .sort(sortEventsAsc)

      for (const event of expiredProtectionsEvents) {
        const r = liquidityEventsReversed.find(l => l.blockNumber <= event.blockNumber)

        const totalLiquidityUntilEvent = r ? r.args.updatedTotalLiquidity : currentLiquidityUsdc

        sumLpRevenueUntilNow += event.args.premiumCostUSD - event.args.amountPaidUSD

        lpRevenueVsTotalLiquiditySerie.push({
          liquidity: totalLiquidityUntilEvent,
          lpRevenueUsdc: sumLpRevenueUntilNow,
          'lp revenue % liquidity': (sumLpRevenueUntilNow * 100) / totalLiquidityUntilEvent,
          timeMs: calculateEventTimestamp({ event, liqEventsBlockTimestampsSeconds }),
        })
      }

      const liquidityNow = currentLiquidityUsdc

      let totalLiquidityInFuture = liquidityNow

      // calculate serie in the future

      const activeProtections = walletsProtections
        .flatMap(walletProtections => walletProtections.protections)
        .filter(p => !p.protectionInfo.expiredEvent)
        .sort(
          (a, b) =>
            a.protectionInfo.boughtEvent.args.protectionEndTimestamp -
            b.protectionInfo.boughtEvent.args.protectionEndTimestamp,
        )

      for (const activeProtection of activeProtections) {
        totalLiquidityInFuture -= activeProtection.protectionInfo.status.payoutOrDuePayoutUsdc

        sumLpRevenueUntilNow += activeProtection.protectionInfo.status.lpRevenueUsdc

        lpRevenueVsTotalLiquiditySerie.push({
          liquidity: totalLiquidityInFuture,
          lpRevenueUsdc: sumLpRevenueUntilNow,
          'lp revenue % liquidity': (sumLpRevenueUntilNow * 100) / totalLiquidityInFuture,
          timeMs: activeProtection.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000,
        })
      }

      dispatch(actions['set - lp revenue % liquidity - total'](lpRevenueVsTotalLiquiditySerie))
    },
    [
      calculateEventTimestamp,
      liqEventsBlockTimestampsSeconds,
      liquidityEvents,
      tokenUSDC,
      walletsProtections,
      dispatch,
      currentLiquidityUsdc,
    ],
  )

  useEffect(() => {
    if (tokenUSDC && liqEventsBlockTimestampsSeconds && liquidityEvents.length > 0) {
      if (isDebugMode) {
        console.log(
          'liquidity-events',
          liquidityEvents.map(e => ({
            type: e.type,
            amount: e.args.amount,
            updatedTotalLiquidity: e.args.updatedTotalLiquidity,
          })),
        )
      }

      const protectionEvents = walletsProtections
        .flatMap(walletProtections => walletProtections.protections)
        .flatMap(p => [p.protectionInfo.boughtEvent, p.protectionInfo.expiredEvent])
        .filter((p): p is FormattedProtectionBoughtEventDto | FormattedProtectionClosedEventDto => Boolean(p))

      const events = [...liquidityEvents, ...protectionEvents].sort(sortEventsAsc)

      const stillActiveProtectionsEvents = walletsProtections
        .flatMap(walletProtections => walletProtections.protections)
        .filter(p => !p.protectionInfo.expiredEvent?.event)
        .map(p => p.protectionInfo)
        .sort((a, b) => a.boughtEvent.args.protectionEndTimestamp - b.boughtEvent.args.protectionEndTimestamp)

      const blocksTimestamp = events.map(event => calculateEventTimestamp({ event, liqEventsBlockTimestampsSeconds }))

      const liquidityEventsReversed = liquidityEvents.slice().reverse()

      const totalsUntilNow = events.map(e => {
        const r = liquidityEventsReversed.find(l => l.blockNumber <= e.blockNumber)
        if (!r) {
          throw new Error(`can't be here`)
        }
        return r.args.updatedTotalLiquidity
      })
      const untilNowTotalSeries = totalsUntilNow.map<Point>((t, i) => [blocksTimestamp[i], t])

      const totalNow = totalsUntilNow[totalsUntilNow.length - 1]
      let totalSum = totalNow
      const futureTotalSerie = stillActiveProtectionsEvents.map<Point>(s => {
        totalSum -= s.status.payoutOrDuePayoutUsdc
        return [s.boughtEvent.args.protectionEndTimestamp * 1000, totalSum]
      })
      const totalSerie = [...untilNowTotalSeries, ...futureTotalSerie]

      const workingCapitalsUntilNow = events.map(
        (_e, i) =>
          events
            .slice(0, i + 1)
            .reverse()
            .find(
              (event): event is FormattedProtectionBoughtEventDto | FormattedProtectionClosedEventDto =>
                event.type === FormattedProtectionBoughtEventDto.type.PROTECTION_BOUGHT_EVENT ||
                event.type === FormattedProtectionClosedEventDto.type.PROTECTION_CLOSED_EVENT,
            )?.args.collateral ?? 0,
      )
      const workingCapitalsUntilNowSerie = workingCapitalsUntilNow.map<Point>((t, i) => [blocksTimestamp[i], t])

      const workingCapitalNow = workingCapitalsUntilNow[workingCapitalsUntilNow.length - 1]
      let workingCapitalsSum = workingCapitalNow
      const futureWorkingCapitalSerie = stillActiveProtectionsEvents.map<Point>(s => {
        workingCapitalsSum -= s.metadata.maxAmountToBePaidUsdc
        return [s.boughtEvent.args.protectionEndTimestamp * 1000, workingCapitalsSum]
      })
      const workingCapitalSerie = [...workingCapitalsUntilNowSerie, ...futureWorkingCapitalSerie]

      const freesUntilNow = events.map((_, i) => totalsUntilNow[i] - workingCapitalsUntilNow[i])
      const futureFrees = stillActiveProtectionsEvents.map<Point>((event, i) => [
        event.boughtEvent.args.protectionEndTimestamp * 1000,
        futureTotalSerie[i][1] - futureWorkingCapitalSerie[i][1],
      ])
      const freeUntilNowSerie = freesUntilNow.map<Point>((t, i) => [blocksTimestamp[i], t])
      const freeSerie = [...freeUntilNowSerie, ...futureFrees]

      const highestPoint = Math.max(...totalsUntilNow)
      const nowSerie: Point[] = [
        [Date.now(), 0],
        [Date.now(), highestPoint],
      ]

      dispatch(actions.setLiquidityTotalSerie(totalSerie))
      dispatch(actions.setLiquidityWorkingCapitalSerie(workingCapitalSerie))
      dispatch(actions.setLiquidityFreeSerie(freeSerie))
      dispatch(actions.setLiquidityNowSerie(nowSerie))
    }
  }, [
    dispatch,
    liqEventsBlockTimestampsSeconds,
    ethersJsonRpcBatchProvider,
    globalEventsInversifyService,
    iLProtectionInversifyService,
    liquidityEvents,
    tokenUSDC,
    walletsProtections,
    isDebugMode,
    calculateEventTimestamp,
  ])

  useEffect(() => {
    async function init() {
      if (tokenUSDC && iLProtectionInversifyService) {
        const [liquidityUsdc, workingCapitalUsdc] = await Promise.all([
          iLProtectionInversifyService.getLiquidity(),
          iLProtectionInversifyService.getWorkingCapitalUsdc(),
        ])
        dispatch(actions.setCurrentLiquidityUsdc(tokenUSDC.toNumber(liquidityUsdc)))
        dispatch(actions.setCurrentWorkingCapitalUsdc(tokenUSDC.toNumber(workingCapitalUsdc)))
      }
    }
    init()
  }, [dispatch, iLProtectionInversifyService, tokenUSDC])

  const [updatedPeriods] = usePromise(
    async () => iLProtectionInversifyService?.getPeriodsSeconds(),
    [iLProtectionInversifyService],
  )
  const [updatedPairs] = usePromise(
    async () => iLProtectionInversifyService?.getPairs(),
    [iLProtectionInversifyService],
  )
  useEffect(() => {
    if (updatedPeriods) {
      dispatch(actions.setPeriods(updatedPeriods))
    }
  }, [dispatch, updatedPeriods])

  useEffect(() => {
    if (updatedPairs) {
      dispatch(actions.setSupportedPairs(updatedPairs))
    }
  }, [dispatch, updatedPairs])

  const [newEmbedStatistics] = usePromise(
    async () => embedArmadilloDiscountInversifyService?.getStatistics(),
    [embedArmadilloDiscountInversifyService],
  )

  useEffect(() => {
    if (newEmbedStatistics) {
      dispatch(actions.setEmbedStatistics(newEmbedStatistics))
    }
  }, [dispatch, newEmbedStatistics])

  return null
}
