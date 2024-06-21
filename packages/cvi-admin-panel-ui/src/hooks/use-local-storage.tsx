import type {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtCviTransferEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { REDUX_PERSIST_KEY, useAppSelector } from '../redux'
import type { TokensDailyPriceHistory } from '../redux/types'
import originalLocalforage from 'localforage'
import { extendPrototype } from 'localforage-observable'
import * as Rx from 'rxjs'

export const customLocalforage = extendPrototype(originalLocalforage)

customLocalforage.newObservable.factory = function (subscribeFn) {
  return Rx.Observable.create(subscribeFn)
}

export type Types = {
  vtEventsAsc: (
    | VtUniswapSwapEventDto
    | VtCviTransferEventDto
    | VtSubmitRequestEventDto
    | VtMintEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtBurnEventDto
  )[]
  tvEventsAsc: (TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)[]
} & TokensDailyPriceHistory

export type LocalForageTypes = {
  vtEventsAsc: string[]
  tvEventsAsc: string[]
} & TokensDailyPriceHistory

export const DEFAULT_LOCAL_STORAGE_VALUES: Types = {
  vtEventsAsc: [],
  tvEventsAsc: [],
  tokensDailyPriceHistory_arbitrumCvi: { x: [], y: [] },
  tokensDailyPriceHistory_oldPolygonCvi: { x: [], y: [] },
  tokensDailyPriceHistory_ucvi: { x: [], y: [] },
  tokensDailyPriceHistory_ETH: { x: [], y: [] },
  tokensDailyPriceHistory_WBTC: { x: [], y: [] },
}

export function useLocalStorageKey<Key extends keyof typeof DEFAULT_LOCAL_STORAGE_VALUES>(key: Key) {
  const chainId = useAppSelector(state => state.chainId)
  const cviBackendEnvironment = useAppSelector(state => state.cviBackendEnvironment)
  const cviOracleBackendEnvironment = useAppSelector(state => state.cviOracleBackendEnvironment)
  const dataFeedBackendEnvironment = useAppSelector(state => state.dataFeedBackendEnvironment)

  return useMemo(() => {
    switch (key) {
      case 'vtEventsAsc':
      case 'tvEventsAsc':
        return `key::${key}::${REDUX_PERSIST_KEY}::chainId::${chainId}::cviBackendEnvironment::${cviBackendEnvironment}`
      case 'tokensDailyPriceHistory_ETH':
      case 'tokensDailyPriceHistory_WBTC':
      case 'tokensDailyPriceHistory_oldPolygonCvi':
        return `key::${key}::${REDUX_PERSIST_KEY}::chainId::${chainId}::dataFeedBackendEnvironment::${dataFeedBackendEnvironment}`
      case 'tokensDailyPriceHistory_arbitrumCvi':
      case 'tokensDailyPriceHistory_ucvi':
        return `key::${key}::${REDUX_PERSIST_KEY}::chainId::${chainId}::cviOracleBackendEnvironment::${cviOracleBackendEnvironment}`
    }
    throw new Error(`can't be here`)
  }, [chainId, cviBackendEnvironment, cviOracleBackendEnvironment, dataFeedBackendEnvironment, key])
}

export const useLocalStorage = <Key extends keyof typeof DEFAULT_LOCAL_STORAGE_VALUES>(
  key: Key,
): [Types[Key] | undefined, (userSetter: (prev?: Types[Key] | undefined) => Types[Key]) => void] => {
  const localStorageKey = useLocalStorageKey(key)

  const [value, setValue] = useState<Types[Key] | undefined>()
  const valueRef = useRef<Types[Key] | undefined>()

  useEffect(() => {
    const subscription = customLocalforage
      .getItemObservable<LocalForageTypes[Key]>(localStorageKey, {
        crossTabChangeDetection: true,
        crossTabNotification: true,
      })
      .subscribe({
        next: val => {
          const newValue =
            ((Array.isArray(val) ? val.map(v => JSON.parse(v)) : val) as Types[Key]) ??
            DEFAULT_LOCAL_STORAGE_VALUES[key]
          setValue(newValue)
          valueRef.current = newValue
        },
      })

    return () => subscription.unsubscribe()
  }, [key, localStorageKey])

  const setter = useCallback(
    (userSetter: (prev?: Types[Key]) => Types[Key]) => {
      const newValueParsed = userSetter(valueRef.current)
      customLocalforage.setItem(
        localStorageKey,
        Array.isArray(newValueParsed) ? newValueParsed.map(v => JSON.stringify(v)) : newValueParsed,
      )
    },
    [localStorageKey],
  )

  return [value, setter]
}
