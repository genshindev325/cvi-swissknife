/* eslint-disable @typescript-eslint/no-use-before-define */

import type { PayloadAction } from '@reduxjs/toolkit'
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type {
  IERC20,
  IlContractsInversifyService,
  IlSupportedChainIds,
  Point,
  State,
  Token,
  TokenName,
} from '@coti-cvi/lw-sdk'
import { ChainId, fromNumber, Stator, toNumber } from '@coti-cvi/lw-sdk'
import type { ErrorObject, PayoutChartSeries, PayoutParams, PayoutSerieInfo, SerieId } from '../types'
import { getChartDisplayName, getSerieId, toErrorObject } from '../utils'
import { BigNumber } from 'ethers'
import { convertPayoutParams } from '../convert-payout-params'
import range from 'lodash/range'

interface ReduxState {
  isDebugMode: boolean
  chainId: IlSupportedChainIds
  charts: PayoutChartSeries[]
  chartsData: Record<SerieId, State<Point[]> | undefined>
  overrides: PayoutParams<number>
  currentMaxIlRatio: State<number>
}

const initialState: ReduxState = {
  isDebugMode: true,
  chainId: ChainId.PolygonMainnet,
  charts: [],
  chartsData: {},
  overrides: {
    lpTokensWorthAtBuyTimeUSD: 100,
    token0EntryPriceUSD: 1,
    token0EndPriceUSD: 1,
    token1EntryPriceUSD: 1000,
    token1EndPriceUSD: 3000,
  },
  currentMaxIlRatio: Stator.pending(),
}

export const updateAllChartsThunk = createAsyncThunk<
  void,
  {
    ilContractsInversifyService: IlContractsInversifyService
    tokenUSDC: Token<IERC20, TokenName.USDC>
    currentMaxIlRatio: number
  },
  {
    state: RootState
  }
>('updateAllChartsThunk', async ({ ilContractsInversifyService, tokenUSDC, currentMaxIlRatio }, thunkApi) => {
  const { overrides, charts, chainId } = thunkApi.getState().state
  await Promise.all(
    charts.map(chart =>
      thunkApi.dispatch(
        downloadSerieThunk({
          ilContractsInversifyService,
          tokenUSDC: tokenUSDC,
          serieInfo: {
            name: getChartDisplayName({ chartName: chart.chartName }),
            chainId,
            chartName: chart.chartName,
            creationDateUtc: new Date().toISOString(),
            rangeInfo: chart.currentRangeInfo,
            payoutValues: overrides,
          },
          currentMaxIlRatio,
        }),
      ),
    ),
  )
})

export const downloadSerieThunk = createAsyncThunk<
  void,
  {
    ilContractsInversifyService: IlContractsInversifyService
    tokenUSDC: Token<IERC20, TokenName.USDC>
    serieInfo: Omit<PayoutSerieInfo, 'id'>
    currentMaxIlRatio: number
  },
  {
    state: RootState
  }
>('downloadSerieThunk', async ({ ilContractsInversifyService, tokenUSDC, serieInfo, currentMaxIlRatio }, thunkApi) => {
  thunkApi.dispatch(actions.addSerieToChart(serieInfo))
  const id = getSerieId(serieInfo)
  const getCurrentState = () => thunkApi.getState().state.chartsData[id]
  thunkApi.dispatch(actions.setChartDataEntrie([id, Stator.pending(getCurrentState())]))

  const errors: ErrorObject[] = []

  try {
    const propertyValues = range(serieInfo.rangeInfo.min, serieInfo.rangeInfo.max, serieInfo.rangeInfo.interval)
    const requests = propertyValues.map<PayoutParams<BigNumber>>(propertyValue =>
      convertPayoutParams({
        from: 'number',
        to: 'BigNumber',
        values: {
          ...serieInfo.payoutValues,
          [serieInfo.chartName]: propertyValue,
        },
      }),
    )

    function printDebug(results: (Point | undefined)[]) {
      const debug = propertyValues.map((propertyValue, i) => ({
        propertyValue,
        rawParams: requests[i],
        rawParamsToString: convertPayoutParams({
          from: 'BigNumber',
          to: 'string',
          values: requests[i],
        }),
        readableParams: convertPayoutParams({
          from: 'BigNumber',
          to: 'number',
          values: requests[i],
        }),
        result: results[i]?.[1],
      }))

      if (thunkApi.getState().state.isDebugMode) {
        console.log(`chart: ${serieInfo.chartName} - requests+results`, debug)
      }
    }

    const localStorageId = `payout-serie::${id}`

    const dataFromLocalStorage = localStorage.getItem(localStorageId)
    if (dataFromLocalStorage) {
      const results: (Point | undefined)[] = JSON.parse(dataFromLocalStorage)
      thunkApi.dispatch(actions.setChartDataEntrie([id, Stator.resolve(results.filter((r): r is Point => Boolean(r)))]))

      printDebug(results)

      return
    }

    const results = await Promise.all(
      requests.map<Promise<Point | undefined>>(async (request, i) => {
        const il = await ilContractsInversifyService.controller
          .calculateIL(
            request.token0EntryPriceUSD,
            request.token1EntryPriceUSD,
            request.token0EndPriceUSD,
            request.token1EndPriceUSD,
          )
          .catch<undefined>(error => {
            errors.push(
              toErrorObject({
                error,
                request,
                chartName: serieInfo.chartName,
                propertyValue: propertyValues[i],
              }),
            )
            return undefined
          })
        if (il) {
          const ilRatio = toNumber(BigNumber.from(il), 4)
          const min = Math.min(currentMaxIlRatio, ilRatio)
          const ilRatioToContract = fromNumber(min, 4)
          const payoutPriceUsdc = await ilContractsInversifyService.controller
            .calcAmountToBePaid(
              request.lpTokensWorthAtBuyTimeUSD,
              request.token0EntryPriceUSD,
              request.token1EntryPriceUSD,
              request.token0EndPriceUSD,
              request.token1EndPriceUSD,
            )
            .catch<undefined>(error => {
              errors.push(
                toErrorObject({
                  error,
                  request,
                  chartName: serieInfo.chartName,
                  propertyValue: propertyValues[i],
                  ilRatioToContract: {
                    asNumber: min,
                    asBigNumber: ilRatioToContract.toString(),
                  },
                }),
              )
              return undefined
            })
          if (payoutPriceUsdc) {
            return [propertyValues[i], tokenUSDC.toNumber(payoutPriceUsdc)]
          }
        }
      }),
    )

    if (errors.length > 0) {
      console.error(`failed to calculate chart: ${serieInfo.chartName}. errors: `, errors)
    }

    printDebug(results)

    localStorage.setItem(localStorageId, JSON.stringify(results))

    const serieData = results.filter((r): r is Point => Boolean(r))
    thunkApi.dispatch(actions.setChartDataEntrie([id, Stator.resolve(serieData)]))
  } catch (error) {
    thunkApi.dispatch(actions.setChartDataEntrie([id, Stator.reject(getCurrentState(), error)]))
  }
})

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setDebugMode: (state, action: PayloadAction<boolean>) => {
      state.isDebugMode = action.payload
    },
    setChainId: (state, action: PayloadAction<IlSupportedChainIds>) => {
      if (state.chainId !== action.payload) {
        state.chainId = action.payload
      }
    },
    addSerieToChart: (state, action: PayloadAction<Omit<PayoutSerieInfo, 'id'>>) => {
      const id = getSerieId(action.payload)
      const chart = state.charts.find(c => c.chartName === action.payload.chartName)
      if (chart) {
        if (chart.seriesSortedByCreationDateAsc.every(s => s.id !== id)) {
          chart.seriesSortedByCreationDateAsc.push({ ...action.payload, id })
        }
      } else {
        state.charts.push({
          chartName: action.payload.chartName,
          currentRangeInfo: action.payload.rangeInfo,
          seriesSortedByCreationDateAsc: [{ ...action.payload, id }],
        })
      }
    },
    setChartDataEntrie: (state, action: PayloadAction<[serieId: SerieId, stateStatus: State<Point[]>]>) => {
      const oldState = state.chartsData[action.payload[0]]
      const newState = action.payload[1]
      state.chartsData[action.payload[0]] = newState
    },
    setOverrides: (state, action: PayloadAction<PayoutParams<number>>) => {
      state.overrides = action.payload
    },
    setCurrentMaxIlRatio: (state, action: PayloadAction<State<number>>) => {
      state.currentMaxIlRatio = typeof action.payload === 'function' ? state.currentMaxIlRatio : action.payload
    },
  },
})

export const { actions } = stateSlice

export const store = configureStore({
  reducer: {
    state: stateSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const selectChainId = (state: RootState) => state.state.chainId
