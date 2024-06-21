/* eslint-disable @typescript-eslint/no-use-before-define */

import type { PayloadAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type {
  AntonPremiumParamsByPeriod,
  IlSupportedChainIds,
  PeriodSeconds,
  PremiumValues,
  ArmadilloSupportedPair,
} from '@coti-cvi/lw-sdk'
import { ChainId, safeObjectEntries } from '@coti-cvi/lw-sdk'
import type { ChartNames, Point, PremiumPriceSerieInfo, RangeInfo, SelectedPairAndPeriod, SerieId } from '../types'
import { PyParabolaBaseUrls } from '../types'

interface ReduxState {
  selectedPairAndPeriods: SelectedPairAndPeriod[]
  selectedPairAndPeriod?: SelectedPairAndPeriod
  pyParabolaBaseUrls: PyParabolaBaseUrls
  chainId: IlSupportedChainIds
  contractPremiumValuesWithoutParams?: Omit<PremiumValues<number>, 'premiumParams'>
  maxCvi?: number
  pairs: ArmadilloSupportedPair[]
  periods: PeriodSeconds[]
  chartsSeries: Record<ChartNames, PremiumPriceSerieInfo[]>
  chartsRanges: Record<ChartNames, RangeInfo<number> | undefined>
  seriesData: Record<SerieId, Point[] | undefined>
  overridenValues?: PremiumValues<number>
  premiumPriceUsdcFromOverridenValues?: number
  antonData: AntonPremiumParamsByPeriod[]
}

const initialState: ReduxState = {
  pyParabolaBaseUrls: PyParabolaBaseUrls.K8s,
  chainId: ChainId.PolygonMainnet,
  selectedPairAndPeriods: [],
  antonData: [],
  pairs: [],
  periods: [],
  seriesData: {},
  chartsSeries: {
    cvi: [],
    expectedLPTokensValueGrowth: [],
    liquidityUsdc: [],
    maxILProtectedPercentage: [],
    lpTokensWorthAtBuyTimeUsdc: [],
    totalLPTokensWorthAtBuyTimeUsdc: [],
    premiumGrowthStart: [],
    premiumSlope: [],
  },
  chartsRanges: {
    cvi: undefined,
    expectedLPTokensValueGrowth: undefined,
    liquidityUsdc: undefined,
    maxILProtectedPercentage: undefined,
    lpTokensWorthAtBuyTimeUsdc: undefined,
    totalLPTokensWorthAtBuyTimeUsdc: undefined,
    premiumGrowthStart: undefined,
    premiumSlope: undefined,
  },
}

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setPyParabolaBaseUrls: (state, action: PayloadAction<PyParabolaBaseUrls>) => {
      state.pyParabolaBaseUrls = action.payload
    },
    setChainId: (state, action: PayloadAction<IlSupportedChainIds>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload
        state.overridenValues = undefined
        state.contractPremiumValuesWithoutParams = undefined
        state.maxCvi = undefined
        state.pairs = []
        state.periods = []
        state.selectedPairAndPeriod = undefined
        state.premiumPriceUsdcFromOverridenValues = undefined
        state.selectedPairAndPeriods = []
      }
    },
    setSelectedPairAndPeriods: (state, action: PayloadAction<SelectedPairAndPeriod[]>) => {
      state.selectedPairAndPeriods = action.payload
      if (state.selectedPairAndPeriods.every(r => JSON.stringify(r) !== JSON.stringify(state.selectedPairAndPeriod))) {
        state.selectedPairAndPeriod = undefined
      }
      for (const [chartName] of safeObjectEntries(state.chartsSeries)) {
        state.chartsSeries[chartName] = state.chartsSeries[chartName].filter(serieInfo =>
          state.selectedPairAndPeriods.some(s => JSON.stringify(s) === JSON.stringify(serieInfo.selectedPairAndPeriod)),
        )
      }
    },
    setSelectedPairAndPeriod: (state, action: PayloadAction<SelectedPairAndPeriod>) => {
      state.selectedPairAndPeriod = action.payload
      state.premiumPriceUsdcFromOverridenValues = undefined
    },
    setPremiumPriceUsdcFromOverridenValues: (state, action: PayloadAction<number>) => {
      state.premiumPriceUsdcFromOverridenValues = action.payload
    },
    setMaxCvi: (state, action: PayloadAction<number>) => {
      if (state.maxCvi !== action.payload) {
        state.maxCvi = action.payload
      }
    },
    setPairs: (state, action: PayloadAction<ArmadilloSupportedPair[]>) => {
      if (JSON.stringify(state.pairs) !== JSON.stringify(action.payload)) {
        state.pairs = action.payload
      }
    },
    setPeriods: (state, action: PayloadAction<PeriodSeconds[]>) => {
      if (JSON.stringify(state.periods) !== JSON.stringify(action.payload)) {
        state.periods = action.payload
      }
    },
    setChartRangeInfo: (
      state,
      action: PayloadAction<{
        chartName: ChartNames
        range?: RangeInfo<number>
      }>,
    ) => {
      if (JSON.stringify(state.chartsRanges[action.payload.chartName]) !== JSON.stringify(action.payload.range)) {
        state.chartsRanges[action.payload.chartName] = action.payload.range
      }
    },
    setContractPremiumValuesWithoutParams: (
      state,
      action: PayloadAction<Omit<PremiumValues<number>, 'premiumParams'>>,
    ) => {
      if (JSON.stringify(state.contractPremiumValuesWithoutParams) !== JSON.stringify(action.payload)) {
        state.contractPremiumValuesWithoutParams = action.payload
        state.premiumPriceUsdcFromOverridenValues = undefined

        const overridesLiquidityUsdcNumber = Math.floor(action.payload.liquidityUsdc)
        const overridesTotalLPTokensWorthAtBuyTimeUsdcNumber = Math.floor(
          action.payload.totalLPTokensWorthAtBuyTimeUsdc,
        )

        state.chartsRanges = {
          cvi: {
            min: 30,
            max: 150,
            interval: 1,
          },
          expectedLPTokensValueGrowth: {
            min: 1,
            max: 2,
            interval: 1,
          },
          liquidityUsdc: {
            min: 1,
            max: overridesLiquidityUsdcNumber * 5,
            interval: 1,
          },
          maxILProtectedPercentage: {
            min: 1,
            max: 80,
            interval: 1,
          },
          lpTokensWorthAtBuyTimeUsdc: {
            min: 0,
            max: overridesLiquidityUsdcNumber * 5 - overridesTotalLPTokensWorthAtBuyTimeUsdcNumber,
            interval: 1,
          },
          totalLPTokensWorthAtBuyTimeUsdc: {
            min: 1,
            max: overridesLiquidityUsdcNumber * 4,
            interval: 1,
          },
          premiumGrowthStart: {
            min: 1,
            max: 4,
            interval: 1,
          },
          premiumSlope: {
            min: 1,
            max: 4,
            interval: 1,
          },
        }

        for (const range of Object.values(state.chartsRanges)) {
          if (range) {
            range.interval = Math.round((range.max - range.min) / 100)
          }
        }

        if (state.chartsRanges.expectedLPTokensValueGrowth) {
          state.chartsRanges.expectedLPTokensValueGrowth.interval = 0.01
        }
      }
    },
    setOverridenValues: (state, action: PayloadAction<PremiumValues<number>>) => {
      if (JSON.stringify(state.overridenValues) !== JSON.stringify(action.payload)) {
        state.overridenValues = action.payload
        state.premiumPriceUsdcFromOverridenValues = undefined
      }
    },
    setAntonData: (state, action: PayloadAction<AntonPremiumParamsByPeriod[]>) => {
      if (JSON.stringify(state.antonData) !== JSON.stringify(action.payload)) {
        state.antonData = action.payload
      }
    },
    addSerieData: (state, action: PayloadAction<[SerieId, Point[]]>) => {
      if (JSON.stringify(state.seriesData[action.payload[0]]) !== JSON.stringify(action.payload[1])) {
        state.seriesData[action.payload[0]] = action.payload[1]
      }
    },
    addSerie: (state, action: PayloadAction<PremiumPriceSerieInfo>) => {
      if (state.chartsSeries[action.payload.chartName].every(s => s.id !== action.payload.id)) {
        if (
          state.selectedPairAndPeriods.some(
            r => JSON.stringify(r) === JSON.stringify(action.payload.selectedPairAndPeriod),
          )
        ) {
          action.payload.name = `(${state.chartsSeries[action.payload.chartName].length + 1}) ${action.payload.name}`
          state.chartsSeries[action.payload.chartName].push(action.payload)
        } else {
          throw new Error(`Serie ${action.payload.id} is not selected. can't add it to charts`)
        }
      }
    },
  },
})

export const { actions } = stateSlice

export const store = configureStore({
  reducer: {
    state: stateSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
