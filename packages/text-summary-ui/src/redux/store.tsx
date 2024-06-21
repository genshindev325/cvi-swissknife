import type { PayloadAction, TypedStartListening } from '@reduxjs/toolkit'
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { BackendEnvironment, ChainId, CustomError } from '@coti-cvi/lw-sdk'
import * as Sentry from '@sentry/react'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { QueryResultDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/chatgpt-server-wrapper-swagger-client'

export type GptQuery = {
  id: number
  dateMs: number
  appSessionId: number
  request: {
    query: string
    longText: string
  }
  response: { status: 'pending' } | { status: 'resolved'; value: QueryResultDto } | { status: 'failed' }
}

export interface ReduxState {
  fullMode: boolean
  isDebugMode: boolean
  chatGptWrapperBackendEnvironment: BackendEnvironment
  chainId: ChainId
  gptQueries: GptQuery[]
  selectedQueryId?: number
}

export const APP_SESSION_ID = Date.now()

const initialState: ReduxState = {
  fullMode: false, // location.hostname === 'localhost' || location.hostname === '127.0.0.1',
  isDebugMode: false,
  chatGptWrapperBackendEnvironment: BackendEnvironment.K8s,
  chainId: ChainId.ArbitrumMainnet,
  gptQueries: [],
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
    setFullMode: (state, action: PayloadAction<boolean>) => {
      state.fullMode = action.payload
    },
    setChainId: (state, action: PayloadAction<ChainId>) => {
      state.chainId = action.payload
    },
    setIsDebugMode: (state, action: PayloadAction<boolean>) => {
      state.isDebugMode = action.payload
    },
    setChatGptBackendEnviroment: (state, action: PayloadAction<BackendEnvironment>) => {
      state.chatGptWrapperBackendEnvironment = action.payload
    },
    setSelectedQueryId: (state, action: PayloadAction<number>) => {
      state.selectedQueryId = action.payload
    },
    clearGptQueriesHistory: state => {
      state.gptQueries = []
    },
    createNewGptQuery: (
      state,
      action: PayloadAction<{ newId: number; query: string; textToSummariesValue: string }>,
    ) => {
      if (action.payload.query.length === 0 && action.payload.textToSummariesValue.length === 0) {
        return
      }

      state.gptQueries.push({
        id: action.payload.newId,
        dateMs: Date.now(),
        appSessionId: APP_SESSION_ID,
        request: {
          query: action.payload.query,
          longText: action.payload.textToSummariesValue,
        },
        response: { status: 'pending' },
      })
      state.selectedQueryId = action.payload.newId
    },
    updateGptQueryResult: (
      state,
      action: PayloadAction<{
        queryId: number
        result: { status: 'resolved'; value: QueryResultDto } | { status: 'failed' }
      }>,
    ) => {
      const gptQuery = state.gptQueries.find(q => q.id === action.payload.queryId)
      if (gptQuery) {
        gptQuery.response = action.payload.result
      }
    },
  },
})

export const { actions } = stateSlice

const INVALIDATE_CACHE = 2 // manually increase it everytime there is a major change

const persistedReducer = persistReducer(
  {
    key: `text-summary-ui::redux-persist::invalidate-cache::${INVALIDATE_CACHE}`,
    version: 2,
    storage,
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
