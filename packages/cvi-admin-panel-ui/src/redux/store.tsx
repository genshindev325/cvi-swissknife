/* eslint-disable @typescript-eslint/no-use-before-define */

import type { PayloadAction, TypedStartListening } from '@reduxjs/toolkit'
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Block, State, TvSupportedChainIds } from '@coti-cvi/lw-sdk'
import { AddressGroup } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import { ChainId, CustomError, BackendEnvironment } from '@coti-cvi/lw-sdk'
import * as Sentry from '@sentry/react'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import localforage from 'localforage'
import type { UpdateGeneralInfoOfEventAndAddressesDto } from '../../../auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { ChartName, DateRange, DealsWorthInUsdc, ReduxState } from './types'
import { DatesRangeOptions } from './types'
import type { AllEvents } from './selected-columns-in-tables'
import { selectedColumnsInTables } from './selected-columns-in-tables'
import type { WritableDraft } from 'immer/dist/types/types-external'

const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

const defaults = {
  cviBackendEnvironment: BackendEnvironment.Local,
  dataFeedBackendEnvironment: BackendEnvironment.K8s,
  cviOracleBackendEnvironment: BackendEnvironment.K8s,
}
const initialState: ReduxState = {
  ui: 'cvi-hedging-ui',
  latestBlock: Stator.pending(),
  fullMode: false,
  isDebugMode: false,
  cviBackendEnvironment: isLocalhost ? defaults.cviBackendEnvironment : BackendEnvironment.K8s,
  dataFeedBackendEnvironment: isLocalhost ? defaults.dataFeedBackendEnvironment : BackendEnvironment.K8s,
  cviOracleBackendEnvironment: isLocalhost ? defaults.cviOracleBackendEnvironment : BackendEnvironment.K8s,
  chainId: ChainId.ArbitrumMainnet,
  websiteLoading: {
    updateGeneralInfoOfEventAndAddresses: 'not-started',
    oldPolygonCviDailyPriceHistory: 'not-started',
    wbtcPriceHistory: 'not-started',
    ethPriceHistory: 'not-started',
    cviDailyPriceHistory: 'not-started',
    ucviHistory: 'not-started',
    latestBlock: 'not-started',
    vtEventsAsc: 'not-started',
    tvEventsAsc: 'not-started',
    currentHourlyFundingFee: 'not-started',
  },
  selectedChartNames: ['buildVtMintAndBurnTrendsByRequestIdChart', 'buildTvDepositsAndWithdrawTrendsByRequestIdChart'],
  filters: {
    eventTypes: [],
    addressGroups: [AddressGroup.USERS],
    datesRange: {
      option: DatesRangeOptions.Last24Hours,
    },
    addresses: [],
    requestIds: {
      tv: [],
      vt: [],
    },
    dealsWorthInUsdc: {
      fromUsdc: undefined,
      toUsdc: undefined,
    },
    excluding: {
      addresses: [],
    },
  },
  selectedColumnsInTables,
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
    setUi: (state, action: PayloadAction<'cvi-hedging-ui' | 'cvi-admin-panel-ui'>) => {
      state.ui = action.payload
    },
    setCurrentHourlyFundingFee: (state, action: PayloadAction<number>) => {
      state.currentHourlyFundingFee = action.payload
    },
    setColumnVisibilityInTable: <
      TableType extends keyof ReduxState['selectedColumnsInTables'],
      TableName extends keyof ReduxState['selectedColumnsInTables'][TableType],
    >(
      state: WritableDraft<ReduxState>,
      action: PayloadAction<{
        tableType: TableType
        tableName: TableName
        column: keyof ReduxState['selectedColumnsInTables'][TableType][TableName]
        visible: boolean
      }>,
    ) => {
      const tables = Object.entries(state.selectedColumnsInTables).find(
        ([tableType]) => tableType === action.payload.tableType,
      )?.[1]

      if (!tables) {
        throw new Error(`can't be here`)
      }

      const table: ReduxState['selectedColumnsInTables'][TableType][TableName] = Object.entries(tables).find(
        ([tableName]) => tableName === action.payload.tableName,
      )?.[1]

      if (!table) {
        throw new Error(`can't be here`)
      }

      for (const [column, info] of Object.entries(table)) {
        if (column === action.payload.column) {
          // @ts-ignore
          info.visible = action.payload.visible
        }
      }
    },
    setWebsiteLoadingPercentage: (
      state,
      action: PayloadAction<{
        type: ReduxState['websiteLoading'][keyof ReduxState['websiteLoading']]
        key: keyof ReduxState['websiteLoading']
      }>,
    ) => {
      state.websiteLoading[action.payload.key] = action.payload.type
    },
    setLatestBlock: (state, action: PayloadAction<State<Block>>) => {
      state.latestBlock = action.payload
    },
    setUpdateGeneralInfoOfEventAndAddressesDto: (
      state,
      action: PayloadAction<UpdateGeneralInfoOfEventAndAddressesDto>,
    ) => {
      state.updateGeneralInfoOfEventAndAddresses = action.payload
    },
    setSelectedCharts: (state, action: PayloadAction<ChartName[]>) => {
      state.selectedChartNames = action.payload
    },
    setFullMode: (state, action: PayloadAction<boolean>) => {
      state.fullMode = action.payload
    },
    setIsDebugMode: (state, action: PayloadAction<boolean>) => {
      state.isDebugMode = action.payload
    },
    setCviBackendEnvironment: (state, action: PayloadAction<BackendEnvironment>) => {
      state.cviBackendEnvironment = action.payload
    },
    setDataFeedBackendEnvironment: (state, action: PayloadAction<BackendEnvironment>) => {
      state.dataFeedBackendEnvironment = action.payload
    },
    setChainId: (state, action: PayloadAction<TvSupportedChainIds>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload
      }
    },
    setFilteredEventTypes: (state, action: PayloadAction<AllEvents[keyof AllEvents]['type'][]>) => {
      state.filters.eventTypes = action.payload
    },
    setFilteredAddressGroups: (state, action: PayloadAction<AddressGroup[]>) => {
      state.filters.addressGroups = action.payload
    },
    setFilteredAddresses: (state, action: PayloadAction<string[]>) => {
      state.filters.addresses = action.payload
    },
    setFilteredExcludingAddresses: (state, action: PayloadAction<string[]>) => {
      state.filters.excluding.addresses = action.payload
    },
    setFilterEventsDateRange: (state, action: PayloadAction<DateRange>) => {
      state.filters.datesRange = action.payload
    },
    setFilterTvRequestIds: (state, action: PayloadAction<number[]>) => {
      state.filters.requestIds.tv = action.payload
    },
    setFilterVtRequestIds: (state, action: PayloadAction<number[]>) => {
      state.filters.requestIds.vt = action.payload
    },
    setFilterDealsWorthInUsdc: (state, action: PayloadAction<DealsWorthInUsdc>) => {
      state.filters.dealsWorthInUsdc = action.payload
    },
    setOnlyNewAccountsFromDateRange: (
      state,
      action: PayloadAction<
        | {
            fromSeconds: number
            toSeconds: number
          }
        | undefined
      >,
    ) => {
      state.filters.onlyNewAccountsFromDateRange = action.payload
    },
    resetFilters: state => {
      state.filters = initialState.filters
    },
  },
})

export const { actions } = stateSlice

export const INVALIDATE_CACHE = 106 // manually increase it everytime there is a major change

export const REDUX_PERSIST_KEY = `cvi-admin-panel-ui::redux-persist::invalidate-cache::${INVALIDATE_CACHE}`

const persistedReducer = persistReducer<ReduxState>(
  {
    key: REDUX_PERSIST_KEY,
    version: 1,
    storage: localforage,
    blacklist: ['websiteLoadingPercentage'],
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
