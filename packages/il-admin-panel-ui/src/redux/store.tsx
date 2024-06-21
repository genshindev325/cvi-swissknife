/* eslint-disable @typescript-eslint/no-use-before-define */

import type { PayloadAction, TypedStartListening } from '@reduxjs/toolkit'
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type {
  FormattedLiquidityAddedEvent,
  FormattedLiquidityWithdrawnEvent,
  IlSupportedChainIds,
  PeriodSeconds,
  Point,
  ProtectionId,
  ArmadilloSupportedPair,
  DiscountTypeInfoState,
} from '@coti-cvi/lw-sdk'
import { sortEventsAsc } from '@coti-cvi/lw-sdk'
import { secondsToString } from '@coti-cvi/lw-sdk'
import { ChainId, CustomError } from '@coti-cvi/lw-sdk'
import type { IlBackendClientApi } from '@coti-cvi/auto-generated-code'
import * as Sentry from '@sentry/react'
import type { AccountType, ProtectionStatus } from '../components/AllProtections/types'
import { EMBED_NO_DISCOUNT } from '../components/AllProtections/types'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import localforage from 'localforage'

export enum IlBackendBaseUrls {
  Local = 'http://localhost:8001',
  K8s = 'https://il-backend-polygon-mainnet.cvi-team.com',
}

export type XDaysAgoTimeRange = {
  xDaysAgo: number
}

export type NextXDaysTimeRange = {
  nextXDays: number
}

export type LpRevenueLiquidityPoint = {
  lpRevenueUsdc: number
  liquidity: number
  ['lp revenue % liquidity']: number
  timeMs: number
}

export interface ReduxState {
  fullMode: boolean
  isDebugMode: boolean
  ilBackendBaseUrl: IlBackendBaseUrls
  embedStatistics: DiscountTypeInfoState[]
  allDuePayoutsByProtectionId: Record<ProtectionId, { timestamp: number; payoutUsdc: number }[] | undefined>
  chainId: IlSupportedChainIds
  walletsProtections: IlBackendClientApi.WalletProtectionsDto[]
  currentLiquidityUsdc?: number
  currentWorkingCapitalUsdc?: number
  currentFreeLiquidityUsdc?: number
  supportedPairs: ArmadilloSupportedPair[]
  supportedPeriods: PeriodSeconds[]
  charts: {
    liquiditySeries: {
      total: Point[]
      workingCapital: Point[]
      free: Point[]
      now: Point[]
    }
    'lp revenue % liquidity': {
      total: LpRevenueLiquidityPoint[]
      workingCapital: LpRevenueLiquidityPoint[]
    }
  }
  liquidityEvents: (FormattedLiquidityAddedEvent | FormattedLiquidityWithdrawnEvent)[]
  blocksToTimestamp: Record<number, number | undefined>
  selected: {
    pairs: ArmadilloSupportedPair[]
    periods: PeriodSeconds[]
    startProtectionsDateRange: XDaysAgoTimeRange
    endProtectionsDateRange: NextXDaysTimeRange
    accountTypes: AccountType[]
    protectionStatuses: ProtectionStatus[]
    protectedAmountMin: number
    protectedAmountMax: number
    embedDiscountsTypes: (DiscountTypeInfoState | typeof EMBED_NO_DISCOUNT)[]
    protectionIds: string[]
  }
}

const initialState: ReduxState = {
  fullMode: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
  isDebugMode: false,
  ilBackendBaseUrl: IlBackendBaseUrls.K8s,
  chainId: ChainId.PolygonMainnet,
  embedStatistics: [],
  allDuePayoutsByProtectionId: {},
  blocksToTimestamp: {},
  walletsProtections: [],
  supportedPairs: [],
  supportedPeriods: [],
  charts: {
    liquiditySeries: {
      now: [],
      total: [],
      workingCapital: [],
      free: [],
    },
    'lp revenue % liquidity': {
      total: [],
      workingCapital: [],
    },
  },
  liquidityEvents: [],
  selected: {
    periods: [],
    pairs: [],
    startProtectionsDateRange: {
      xDaysAgo: 100,
    },
    endProtectionsDateRange: {
      nextXDays: 61,
    },
    accountTypes: ['internal', 'external'],
    protectionStatuses: ['active', 'expired'],
    protectedAmountMin: 0,
    protectedAmountMax: 100_000_000,
    embedDiscountsTypes: [],
    protectionIds: [],
  },
}

const listenerMiddleware = createListenerMiddleware({
  onError: (error, raisedBy) => {
    Sentry.captureException(error)
    console.error(`error raised by: ${raisedBy}`)
    CustomError.printErrorToConsole(error as Error)
  },
})

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setBlocksToTimestamp: (state, action: PayloadAction<Record<number, number | undefined>>) => {
      state.blocksToTimestamp = action.payload
    },
    setSelectedProtectionIds: (state, action: PayloadAction<string[]>) => {
      state.selected.protectionIds = action.payload
    },
    setFullMode: (state, action: PayloadAction<boolean>) => {
      state.fullMode = action.payload
    },
    setEmbedStatistics: (state, action: PayloadAction<DiscountTypeInfoState[]>) => {
      state.embedStatistics = action.payload
      state.selected.embedDiscountsTypes = [...state.embedStatistics, EMBED_NO_DISCOUNT]
    },
    setIsDebugMode: (state, action: PayloadAction<boolean>) => {
      state.isDebugMode = action.payload
    },
    setIlBackendBaseUrl: (state, action: PayloadAction<IlBackendBaseUrls>) => {
      state.ilBackendBaseUrl = action.payload
    },
    ['set - lp revenue % liquidity - total']: (state, action: PayloadAction<LpRevenueLiquidityPoint[]>) => {
      state.charts['lp revenue % liquidity'].total = action.payload
    },
    ['set - lp revenue % liquidity - working-capital']: (state, action: PayloadAction<LpRevenueLiquidityPoint[]>) => {
      state.charts['lp revenue % liquidity'].workingCapital = action.payload
    },
    setMinimumProtectedAmountSelectedRange: (state, action: PayloadAction<number>) => {
      state.selected.protectedAmountMin = action.payload
    },
    setMaximumProtectedAmountSelectedRange: (state, action: PayloadAction<number>) => {
      state.selected.protectedAmountMax = action.payload
    },
    setSelectedProtectionsStatuses: (state, action: PayloadAction<ProtectionStatus[]>) => {
      state.selected.protectionStatuses = action.payload
    },
    setSelectedEmbedDiscountTypes: (
      state,
      action: PayloadAction<(DiscountTypeInfoState | typeof EMBED_NO_DISCOUNT)[]>,
    ) => {
      state.selected.embedDiscountsTypes = action.payload
    },
    setSelectedPeriods: (state, action: PayloadAction<PeriodSeconds[]>) => {
      state.selected.periods = action.payload
    },
    setAllDuePayoutsByProtectionId: (
      state,
      action: PayloadAction<Record<ProtectionId, { timestamp: number; payoutUsdc: number }[] | undefined>>,
    ) => {
      state.allDuePayoutsByProtectionId = action.payload
    },
    setPeriods: (state, action: PayloadAction<PeriodSeconds[]>) => {
      const allPeriodsSeconds = new Set([
        ...action.payload.map(period => period.periodSeconds),
        ...state.walletsProtections
          .flatMap(w => w.protections)
          .map(p => p.protectionInfo.boughtEvent.args.policyPeriodSeconds),
      ])
      for (const periodSeconds of allPeriodsSeconds) {
        if (state.supportedPeriods.every(s => s.periodSeconds !== periodSeconds)) {
          state.supportedPeriods.push({
            periodSeconds,
            periodSecondsFormat: secondsToString(periodSeconds),
          })
          state.selected.periods.push(state.supportedPeriods[state.supportedPeriods.length - 1])
        }
      }
    },
    setSelectedPairs: (state, action: PayloadAction<ArmadilloSupportedPair[]>) => {
      state.selected.pairs = action.payload
    },
    setSupportedPairs: (state, action: PayloadAction<ArmadilloSupportedPair[]>) => {
      state.supportedPairs = action.payload
      state.selected.pairs = state.supportedPairs
    },
    setStartProtectionsSelectedDateRange: (state, action: PayloadAction<XDaysAgoTimeRange>) => {
      state.selected.startProtectionsDateRange = action.payload
    },
    setEndProtectionsSelectedDateRange: (state, action: PayloadAction<NextXDaysTimeRange>) => {
      state.selected.endProtectionsDateRange = action.payload
    },
    setSelectedAccountTypes: (state, action: PayloadAction<AccountType[]>) => {
      state.selected.accountTypes = action.payload
    },
    setChainId: (state, action: PayloadAction<IlSupportedChainIds>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload
        state.walletsProtections = []
        state.liquidityEvents = []
        state.supportedPeriods = []
        state.supportedPairs = []
        state.selected = initialState.selected
        state.currentLiquidityUsdc = undefined
        state.currentFreeLiquidityUsdc = undefined
        state.currentWorkingCapitalUsdc = undefined
        state.blocksToTimestamp = {}
      }
    },
    setWalletsProtections: (state, action: PayloadAction<IlBackendClientApi.WalletProtectionsDto[]>) => {
      if (JSON.stringify(state.walletsProtections) !== JSON.stringify(action.payload)) {
        state.walletsProtections = action.payload

        const allPeriodsSeconds = new Set(
          state.walletsProtections
            .flatMap(w => w.protections)
            .map(p => p.protectionInfo.boughtEvent.args.policyPeriodSeconds),
        )
        for (const periodSeconds of allPeriodsSeconds) {
          if (state.supportedPeriods.every(s => s.periodSeconds !== periodSeconds)) {
            state.supportedPeriods.push({
              periodSeconds,
              periodSecondsFormat: secondsToString(periodSeconds),
            })
            state.selected.periods.push(state.supportedPeriods[state.supportedPeriods.length - 1])
          }
        }
      }
    },
    setCurrentLiquidityUsdc: (state, action: PayloadAction<number>) => {
      state.currentLiquidityUsdc = action.payload
      state.currentFreeLiquidityUsdc = undefined
      if (state.currentLiquidityUsdc !== undefined && state.currentWorkingCapitalUsdc !== undefined) {
        state.currentFreeLiquidityUsdc = state.currentLiquidityUsdc - state.currentWorkingCapitalUsdc
      }
    },
    setCurrentWorkingCapitalUsdc: (state, action: PayloadAction<number>) => {
      state.currentWorkingCapitalUsdc = action.payload
      state.currentFreeLiquidityUsdc = undefined
      if (state.currentLiquidityUsdc !== undefined && state.currentWorkingCapitalUsdc !== undefined) {
        state.currentFreeLiquidityUsdc = state.currentLiquidityUsdc - state.currentWorkingCapitalUsdc
      }
    },
    setLiquidityTotalSerie: (state, action: PayloadAction<Point[]>) => {
      state.charts.liquiditySeries.total = action.payload
    },
    setLiquidityWorkingCapitalSerie: (state, action: PayloadAction<Point[]>) => {
      state.charts.liquiditySeries.workingCapital = action.payload
    },
    setLiquidityFreeSerie: (state, action: PayloadAction<Point[]>) => {
      state.charts.liquiditySeries.free = action.payload
    },
    setLiquidityNowSerie: (state, action: PayloadAction<Point[]>) => {
      state.charts.liquiditySeries.now = action.payload
    },
    addLiquidityEvents: (
      state,
      action: PayloadAction<(FormattedLiquidityAddedEvent | FormattedLiquidityWithdrawnEvent)[]>,
    ) => {
      const set = new Set(
        state.liquidityEvents.map(e => e.transactionHash + '-' + e.transactionIndex + '-' + e.logIndex),
      )
      for (const e of action.payload) {
        if (!set.has(e.transactionHash + '-' + e.transactionIndex + '-' + e.logIndex)) {
          state.liquidityEvents.push(e)
        }
      }
      state.liquidityEvents.sort(sortEventsAsc)
    },
  },
})

export const { actions } = stateSlice

const INVALIDATE_CACHE = 9 // manually increase it every-time there is a major change

const REDUX_PERSIST_KEY = `admin-panel-ui::redux-persist::invalidate-cache::${INVALIDATE_CACHE}`

const persistedReducer = persistReducer(
  {
    key: REDUX_PERSIST_KEY,
    version: 2,
    storage: localforage,
  },
  stateSlice.reducer,
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
})

export const listenerActions = {}

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = listenerMiddleware.startListening as AppStartListening

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const selectChainId = (state: RootState) => state.chainId
