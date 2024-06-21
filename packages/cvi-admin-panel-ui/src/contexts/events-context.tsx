import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createContext } from 'react'
import React from 'react'
import { flattenEvents, useAppSelector } from '../redux'
import useInversify from '../hooks/use-inversify'
import type { EventsContextType } from '../types'
import type { GeneralInfoOfEventByAddressDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { VtCviTransferEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { DEFAULT_LOCAL_STORAGE_VALUES, useLocalStorage } from '../hooks'

export const defaultEventsContext: EventsContextType = {
  tokensDailyPriceHistory: {
    tokensDailyPriceHistory_arbitrumCvi: { x: [], y: [] },
    tokensDailyPriceHistory_oldPolygonCvi: { x: [], y: [] },
    tokensDailyPriceHistory_ucvi: { x: [], y: [] },
    tokensDailyPriceHistory_ETH: { x: [], y: [] },
    tokensDailyPriceHistory_WBTC: { x: [], y: [] },
  },
  addressesWithCvisx1AllTime: new Set(),
  addressesWithTvCvisx1AllTime: new Set(),
  addresses: [],
  addressToGroupMap: new Map(),
  updatedGeneralInfoOfEventByAddressMap: new Map(),
  allEventsAsc: [],
  tvEventsAsc: [],
  vtEventsWithoutTransferAndSwapAsc: [],
  vtTransferAndSwapEventsAsc: [],
  vtEventsAsc: [],
  swapEventsAsc: [],
  tvRequests: [],
  vtRequests: [],
  allRequests: [],
  tvRequestIdToSubmitEventMap: new Map(),
  vtRequestIdToSubmitEventMap: new Map(),
  tvRequestIdToRequest: new Map(),
  vtRequestIdToRequest: new Map(),
}

export const eventsContext = createContext<EventsContextType>(defaultEventsContext)

export const EventsProvider: FC<PropsWithChildren<EventsContextType>> = ({ children }) => {
  const [tokensDailyPriceHistory_ETH = DEFAULT_LOCAL_STORAGE_VALUES.tokensDailyPriceHistory_ETH] =
    useLocalStorage('tokensDailyPriceHistory_ETH')
  const [tokensDailyPriceHistory_WBTC = DEFAULT_LOCAL_STORAGE_VALUES.tokensDailyPriceHistory_WBTC] =
    useLocalStorage('tokensDailyPriceHistory_WBTC')
  const [tokensDailyPriceHistory_arbitrumCvi = DEFAULT_LOCAL_STORAGE_VALUES.tokensDailyPriceHistory_arbitrumCvi] =
    useLocalStorage('tokensDailyPriceHistory_arbitrumCvi')
  const [tokensDailyPriceHistory_oldPolygonCvi = DEFAULT_LOCAL_STORAGE_VALUES.tokensDailyPriceHistory_oldPolygonCvi] =
    useLocalStorage('tokensDailyPriceHistory_oldPolygonCvi')
  const [tokensDailyPriceHistory_ucvi = DEFAULT_LOCAL_STORAGE_VALUES.tokensDailyPriceHistory_ucvi] =
    useLocalStorage('tokensDailyPriceHistory_ucvi')
  const [tvEventsAsc = DEFAULT_LOCAL_STORAGE_VALUES.tvEventsAsc] = useLocalStorage('tvEventsAsc')
  const [vtEventsAsc = DEFAULT_LOCAL_STORAGE_VALUES.vtEventsAsc] = useLocalStorage('vtEventsAsc')
  const updatedGeneralInfoOfEventByAddress = useAppSelector(
    state => state.updateGeneralInfoOfEventAndAddresses?.updatedGeneralInfoOfEventByAddress,
  )
  const { cviContractsInversifyService } = useInversify()

  const extendedUpdatedGeneralInfoOfEventByAddressMap = useMemo(
    () =>
      new Map([
        ...vtEventsAsc.flatMap<[string, GeneralInfoOfEventByAddressDto]>(e =>
          e.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
            ? [
                [e.args.fromAccount, e.args.generalInfoOfEventBySender],
                [e.args.toAccount, e.args.generalInfoOfEventByReceiver],
              ]
            : [[e.args.account, e.args.generalInfoOfEventByAddress]],
        ),
        ...tvEventsAsc.map<[string, GeneralInfoOfEventByAddressDto]>(e => [
          e.args.account,
          e.args.generalInfoOfEventByAddress,
        ]),
        ...(updatedGeneralInfoOfEventByAddress?.map<[string, GeneralInfoOfEventByAddressDto]>(r => [
          r.address,
          r.generalInfoOfEventByAddress,
        ]) ?? []),
      ]),
    [tvEventsAsc, updatedGeneralInfoOfEventByAddress, vtEventsAsc],
  )

  const result = useMemo(
    () =>
      flattenEvents({
        tvEventsAsc,
        vtEventsAsc,
        updatedGeneralInfoOfEventByAddressMap: extendedUpdatedGeneralInfoOfEventByAddressMap,
        tokensDailyPriceHistory: {
          tokensDailyPriceHistory_ETH: tokensDailyPriceHistory_ETH,
          tokensDailyPriceHistory_WBTC: tokensDailyPriceHistory_WBTC,
          tokensDailyPriceHistory_arbitrumCvi: tokensDailyPriceHistory_arbitrumCvi,
          tokensDailyPriceHistory_oldPolygonCvi: tokensDailyPriceHistory_oldPolygonCvi,
          tokensDailyPriceHistory_ucvi: tokensDailyPriceHistory_ucvi,
        },
        cviContractsInversifyService,
      }),
    [
      cviContractsInversifyService,
      tokensDailyPriceHistory_ETH,
      tokensDailyPriceHistory_WBTC,
      tokensDailyPriceHistory_arbitrumCvi,
      tokensDailyPriceHistory_oldPolygonCvi,
      tokensDailyPriceHistory_ucvi,
      tvEventsAsc,
      extendedUpdatedGeneralInfoOfEventByAddressMap,
      vtEventsAsc,
    ],
  )

  return <eventsContext.Provider value={result}>{children}</eventsContext.Provider>
}
