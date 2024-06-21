import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import type { Point, PremiumValues } from '@coti-cvi/lw-sdk'
import type { AsyncQueue } from '../hooks/use-async-queue'
import { useAsyncQueue } from '../hooks/use-async-queue'
import type { InversifyContext } from './inversify-context'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import type { ChartNames, RangeInfo, SelectedPairAndPeriod, SerieId } from '../types'
import useInversify from '../hooks/use-inversify'
import { usePremiumPriceUsdcCalculator } from '../effects/use-premium-price-usdc-calculator'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import { createNewChartSerie, getPremiumChartSerieId } from '../utils'
import { downloadSerieData } from '../effects/download-serie-data'

const toSerieDataLocalStorageId = (id: string) => `il-furmula-ui::premium-price-serie-id::${id}`

export type Task = {
  chartName: ChartNames
  selectedPairAndPeriod: SelectedPairAndPeriod
  premiumValues: PremiumValues<number>
}

export type FullTaskDetails = Task & {
  inversifyContext: Required<
    Pick<InversifyContext, 'globalEventsInversifyService' | 'iLProtectionInversifyService' | 'tokenUSDC'>
  >
  chartRanges: RangeInfo<number>
}

export type SeriesDownloaderContext = AsyncQueue<Task>

export const seriesDownloaderContext = createContext<SeriesDownloaderContext>({
  push: (_t: Task) => {
    throw new Error(`SeriesDownloaderContext.push() is not yet initialized`)
  },
  stats: {
    processingCount: 0,
    pendingCount: 0,
  },
})

export const SeriesDownloaderProvider: FC<PropsWithChildren<{ concurrency: number }>> = ({ children, concurrency }) => {
  const [isDebugMode] = useLocalStorage('isDebugMode')
  const dispatch = useAppDispatch()
  const inversifyContext = useInversify()
  const chainId = useAppSelector(state => state.state.chainId)
  const selectedPairAndPeriods = useAppSelector(state => state.state.selectedPairAndPeriods)
  const chartsRanges = useAppSelector(state => state.state.chartsRanges)
  const chartsSeries = useAppSelector(state => state.state.chartsSeries)
  const overridenValues = useAppSelector(state => state.state.overridenValues)
  const contractPremiumValuesWithoutParams = useAppSelector(state => state.state.contractPremiumValuesWithoutParams)

  const calculatePremiumPrice = usePremiumPriceUsdcCalculator()

  const downloadingSerieIds = useRef(new Set<SerieId>())

  const checkIfselectedPairAndPeriodIsStillRelevant = useCallback(
    (selectedPairAndPeriod: SelectedPairAndPeriod) =>
      selectedPairAndPeriods.some(r => JSON.stringify(r) === JSON.stringify(selectedPairAndPeriod)),
    [selectedPairAndPeriods],
  )

  const runTask = useCallback(
    async ({ inversifyContext, selectedPairAndPeriod, premiumValues, chartName, chartRanges }: FullTaskDetails) => {
      if (!checkIfselectedPairAndPeriodIsStillRelevant(selectedPairAndPeriod)) {
        if (isDebugMode) {
          console.log(
            chartName,
            '-',
            'selectedPairAndPeriod was not relevant anymore, skipping fetching and showing it',
            {
              selectedPairAndPeriod,
            },
          )
        }
        return
      }

      const propertyValueNumber = premiumValues[chartName]

      const serieId = getPremiumChartSerieId({
        chainId,
        chartName,
        premiumValues,
        rangeInfo: chartRanges,
        selectedPairAndPeriod,
      })

      if (downloadingSerieIds.current.has(serieId) || chartsSeries[chartName].some(s => s.id === serieId)) {
        return
      }

      downloadingSerieIds.current.add(serieId)

      const premiumPriceUsdc = await calculatePremiumPrice(premiumValues)

      if (premiumPriceUsdc === undefined) {
        return
      }

      const serieInfo = createNewChartSerie(chainId, {
        chartName,
        borderPoint: [propertyValueNumber, (premiumPriceUsdc * 100) / premiumValues.lpTokensWorthAtBuyTimeUsdc],
        premiumValues,
        rangeInfo: chartRanges,
        selectedPairAndPeriod,
      })

      if (!checkIfselectedPairAndPeriodIsStillRelevant(selectedPairAndPeriod)) {
        if (isDebugMode) {
          console.log(
            chartName,
            '-',
            'selectedPairAndPeriod was not relevant anymore, skipping fetching and showing it',
            {
              selectedPairAndPeriod,
            },
          )
        }
        return
      }

      dispatch(actions.addSerie(serieInfo))

      if (isDebugMode) {
        console.log(chartName, '-', 'checking if we need to download serie-data')
      }

      const serieDataFromLocalStorage = localStorage.getItem(toSerieDataLocalStorageId(serieInfo.id))
      const serieDataFromLocalStorageResult =
        serieDataFromLocalStorage === null ? undefined : (JSON.parse(serieDataFromLocalStorage) as Point[])

      if (serieDataFromLocalStorageResult) {
        dispatch(actions.addSerieData([serieInfo.id, serieDataFromLocalStorageResult]))
      }

      if (isDebugMode) {
        if (serieDataFromLocalStorageResult) {
          console.log(chartName, '-', `fetched serie of chart: ${serieInfo.chartName} from localStorage`, {
            result: serieDataFromLocalStorageResult,
          })
          downloadingSerieIds.current.delete(serieId)
          return
        } else {
          console.log(
            chartName,
            '-',
            `could not find serie of chart: ${serieInfo.chartName} in localStorage. fetching it from contract...`,
          )
        }
      }

      if (!checkIfselectedPairAndPeriodIsStillRelevant(selectedPairAndPeriod)) {
        if (isDebugMode) {
          console.log(
            chartName,
            '-',
            'selectedPairAndPeriod was not relevant anymore, skipping fetching and showing it',
            {
              selectedPairAndPeriod,
            },
          )
        }
        return
      }

      try {
        const result = await downloadSerieData({
          iLProtectionInversifyService: inversifyContext.iLProtectionInversifyService,
          isDebugMode,
          tokenUSDC: inversifyContext.tokenUSDC,
          serieInfo,
        })

        if (!checkIfselectedPairAndPeriodIsStillRelevant(selectedPairAndPeriod)) {
          if (isDebugMode) {
            console.log(
              chartName,
              '-',
              'selectedPairAndPeriod was not relevant anymore, skipping fetching and showing it',
              {
                selectedPairAndPeriod,
              },
            )
          }
          return
        }

        dispatch(actions.addSerieData([serieInfo.id, result]))
        localStorage.setItem(toSerieDataLocalStorageId(serieInfo.id), JSON.stringify(result))
        if (isDebugMode) {
          console.log(chartName, '-', `fetched serie of chart: ${serieInfo.chartName} from contract`, { result })
        }
      } catch (error) {
        inversifyContext.globalEventsInversifyService.eventEmitter.emit('errors', error)
      } finally {
        downloadingSerieIds.current.delete(serieId)
      }
    },
    [calculatePremiumPrice, chainId, chartsSeries, checkIfselectedPairAndPeriodIsStillRelevant, dispatch, isDebugMode],
  )

  const queue = useAsyncQueue(concurrency, runTask)

  const [pendingTasks, setPendingTasks] = useState<Task[]>([])

  const push = useCallback((t: Task) => {
    setPendingTasks(prev => [...prev, t])
  }, [])

  useEffect(() => {
    const { globalEventsInversifyService, iLProtectionInversifyService, tokenUSDC } = inversifyContext
    if (globalEventsInversifyService && iLProtectionInversifyService && tokenUSDC) {
      for (const task of pendingTasks) {
        const chartRanges = chartsRanges[task.chartName]
        if (chartRanges) {
          queue.push({
            ...task,
            chartRanges,
            inversifyContext: {
              globalEventsInversifyService,
              iLProtectionInversifyService,
              tokenUSDC,
            },
          })
          setPendingTasks(prev => prev.filter(t => JSON.stringify(t) !== JSON.stringify(task)))
        }
      }
    }
  }, [chartsRanges, inversifyContext, pendingTasks, queue, overridenValues, contractPremiumValuesWithoutParams])

  return <seriesDownloaderContext.Provider value={{ ...queue, push }}>{children}</seriesDownloaderContext.Provider>
}
