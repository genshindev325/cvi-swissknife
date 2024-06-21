import type { Block, State } from '@coti-cvi/lw-sdk/src'
import { startTimer } from '@coti-cvi/lw-sdk/src'
import { getCviOracleEventsBackend } from '@coti-cvi/lw-sdk/src'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk/src'
import { TokenName } from '@coti-cvi/lw-sdk/src'
import type { FC } from 'react'
import { useEffect } from 'react'
import usePromise from 'react-use-promise'
import { getCviBackendClient, getDataFeedClient } from '@coti-cvi/lw-sdk/src'
import { actions, selectors } from './redux'
import { useAppDispatch, useAppSelector } from './redux/redux-hook'
import type { Point } from './redux/types'
import useInversify from './hooks/use-inversify'
import { GetCviOracleHistoryDataQueryDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-oracle-events-backend-swagger-client'
import type { UI } from './types'
import type { Types, LocalForageTypes } from './hooks'
import { customLocalforage, useLocalStorage, useLocalStorageKey } from './hooks'

type Props = {
  ui: UI
}

export const Effects: FC<Props> = ({ ui }) => {
  const dispatch = useAppDispatch()
  const chainId = useAppSelector(state => state.chainId)
  const cviBackendEnvironment = useAppSelector(state => state.cviBackendEnvironment)
  const dataFeedBackendEnvironment = useAppSelector(state => state.dataFeedBackendEnvironment)
  const cviOracleBackendEnvironment = useAppSelector(state => state.cviOracleBackendEnvironment)
  const [, setTokensDailyPriceHistory_ETH] = useLocalStorage('tokensDailyPriceHistory_ETH')
  const [, setTokensDailyPriceHistory_WBTC] = useLocalStorage('tokensDailyPriceHistory_WBTC')
  const [tokensDailyPriceHistory_arbitrumCvi, setTokensDailyPriceHistory_arbitrumCvi] = useLocalStorage(
    'tokensDailyPriceHistory_arbitrumCvi',
  )
  const [, setTokensDailyPriceHistory_oldPolygonCvi] = useLocalStorage('tokensDailyPriceHistory_oldPolygonCvi')
  const [, setTokensDailyPriceHistory_ucvi] = useLocalStorage('tokensDailyPriceHistory_ucvi')
  const { globalEventsInversifyService, vtInversifyService } = useInversify()
  const websiteLoading = useAppSelector(state => state.websiteLoading)
  const websiteLoadingPercentage = useAppSelector(selectors.websiteLoadingPercentageSelector)

  const requestCviIndexesFromTimestamp = tokensDailyPriceHistory_arbitrumCvi
    ? !tokensDailyPriceHistory_arbitrumCvi || tokensDailyPriceHistory_arbitrumCvi.x.length === 0
      ? 0
      : tokensDailyPriceHistory_arbitrumCvi.x[tokensDailyPriceHistory_arbitrumCvi.x.length - 1] + 1
    : undefined

  useEffect(() => {
    dispatch(actions.setUi(ui))
  }, [dispatch, ui])

  useEffect(() => {
    if (websiteLoadingPercentage < 100) {
      console.log(websiteLoading)
    }
  }, [websiteLoading, websiteLoadingPercentage])

  const [oldPolygonCviDailyPriceHistory] = usePromise(() => {
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'oldPolygonCviDailyPriceHistory',
        type: 'in-progress',
      }),
    )
    return getDataFeedClient({
      backendEnvironment: dataFeedBackendEnvironment,
    })
      .tokens.tokensControllerTokenDailyPriceHistory({ token: 'oldPolygonCvi' })
      .then(r =>
        r.map(p => ({
          ...p,
          x: p.x * 1000,
        })),
      )
  }, [dataFeedBackendEnvironment, dispatch])

  useEffect(() => {
    if (oldPolygonCviDailyPriceHistory?.length) {
      setTokensDailyPriceHistory_oldPolygonCvi(prev => ({
        x: (prev?.x ?? []).concat(oldPolygonCviDailyPriceHistory.map(d => d.x)),
        y: (prev?.y ?? []).concat(oldPolygonCviDailyPriceHistory.map(d => d.y)),
      }))
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'oldPolygonCviDailyPriceHistory',
          type: 'done',
        }),
      )
    }
  }, [dispatch, oldPolygonCviDailyPriceHistory, setTokensDailyPriceHistory_oldPolygonCvi])

  const [wbtcPriceHistory] = usePromise(() => {
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'wbtcPriceHistory',
        type: 'in-progress',
      }),
    )
    return getDataFeedClient({
      backendEnvironment: dataFeedBackendEnvironment,
    })
      .tokens.tokensControllerTokenDailyPriceHistory({ token: TokenName.WBTC })
      .then(r =>
        r.map(p => ({
          ...p,
          x: p.x * 1000,
        })),
      )
  }, [dataFeedBackendEnvironment, dispatch])

  useEffect(() => {
    if (wbtcPriceHistory?.length) {
      setTokensDailyPriceHistory_WBTC(prev => ({
        x: (prev?.x ?? []).concat(wbtcPriceHistory.map(d => d.x)),
        y: (prev?.y ?? []).concat(wbtcPriceHistory.map(d => d.y)),
      }))
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'wbtcPriceHistory',
          type: 'done',
        }),
      )
    }
  }, [dispatch, setTokensDailyPriceHistory_WBTC, wbtcPriceHistory])

  const [ethPriceHistory] = usePromise(() => {
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'ethPriceHistory',
        type: 'in-progress',
      }),
    )
    return getDataFeedClient({
      backendEnvironment: dataFeedBackendEnvironment,
    })
      .tokens.tokensControllerTokenDailyPriceHistory({ token: TokenName.ETH })
      .then(r =>
        r.map(p => ({
          ...p,
          x: p.x * 1000,
        })),
      )
  }, [dataFeedBackendEnvironment, dispatch])

  useEffect(() => {
    if (ethPriceHistory?.length) {
      setTokensDailyPriceHistory_ETH(prev => ({
        x: (prev?.x ?? []).concat(ethPriceHistory.map(d => d.x)),
        y: (prev?.y ?? []).concat(ethPriceHistory.map(d => d.y)),
      }))
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'ethPriceHistory',
          type: 'done',
        }),
      )
    }
  }, [dispatch, ethPriceHistory, setTokensDailyPriceHistory_ETH])

  const [cviDailyPriceHistory] = usePromise(async () => {
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'cviDailyPriceHistory',
        type: 'in-progress',
      }),
    )
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'ucviHistory',
        type: 'in-progress',
      }),
    )
    if (
      requestCviIndexesFromTimestamp === undefined ||
      Math.abs(Date.now() - requestCviIndexesFromTimestamp * 1000) <= 30_000
    ) {
      return []
    }
    return getCviOracleEventsBackend({
      backendEnvironment: cviOracleBackendEnvironment,
      network: CHAIN_IDS_INFO[chainId].networkName,
    })
      .cviOracle.cviOracleApiControllerGetAllCviIndexes({
        requestBody: {
          groupBy: GetCviOracleHistoryDataQueryDto.groupBy.MINUTES,
          fromBlockTimestamp: requestCviIndexesFromTimestamp,
        },
      })
      .then<Point[]>(r => r.events.map(p => ({ x: p.timestamp * 1000, y: p.value })))
  }, [chainId, cviOracleBackendEnvironment, dispatch, requestCviIndexesFromTimestamp])

  useEffect(() => {
    if (!cviDailyPriceHistory) {
      return
    }
    setTokensDailyPriceHistory_arbitrumCvi(prev => ({
      x: (prev?.x ?? []).concat(cviDailyPriceHistory.map(d => d.x)),
      y: (prev?.y ?? []).concat(cviDailyPriceHistory.map(d => d.y)),
    }))
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'cviDailyPriceHistory',
        type: 'done',
      }),
    )
    const ucviHistory: Point[] = cviDailyPriceHistory.map(p => ({
      x: p.x,
      y: Math.pow(p.y, 1.5) / Math.pow(50, 0.5), // talk to tomer/yoni to understand this formula
    }))
    setTokensDailyPriceHistory_ucvi(prev => ({
      x: (prev?.x ?? []).concat(ucviHistory.map(d => d.x)),
      y: (prev?.y ?? []).concat(ucviHistory.map(d => d.y)),
    }))
    dispatch(
      actions.setWebsiteLoadingPercentage({
        key: 'ucviHistory',
        type: 'done',
      }),
    )
  }, [dispatch, cviDailyPriceHistory, setTokensDailyPriceHistory_arbitrumCvi, setTokensDailyPriceHistory_ucvi])

  useEffect(() => {
    if (!globalEventsInversifyService) {
      return
    }

    let initialized = false

    function setLatestBlockToRedux(block: State<Block>) {
      dispatch(actions.setLatestBlock(block))
      if (!initialized) {
        if (block.status === 'pending') {
          dispatch(
            actions.setWebsiteLoadingPercentage({
              key: 'latestBlock',
              type: 'in-progress',
            }),
          )
        }
        if (block.status === 'resolved') {
          dispatch(
            actions.setWebsiteLoadingPercentage({
              key: 'latestBlock',
              type: 'done',
            }),
          )
          initialized = true
          if (globalEventsInversifyService) {
            globalEventsInversifyService.eventEmitter.off('latestBlock', setLatestBlockToRedux)
          }
        }
      }
    }

    globalEventsInversifyService.eventEmitter.on('latestBlock', setLatestBlockToRedux)

    return () => {
      globalEventsInversifyService.eventEmitter.off('latestBlock', setLatestBlockToRedux)
      initialized = false
    }
  }, [dispatch, globalEventsInversifyService])

  const vtEventsAscKey = useLocalStorageKey('vtEventsAsc')

  useEffect(() => {
    if (!globalEventsInversifyService) {
      return
    }

    const cleanups: (() => void)[] = []
    async function run() {
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'vtEventsAsc',
          type: 'in-progress',
        }),
      )
      const e = startTimer()
      console.log('stav0-vt-extract-cache')
      const vtEventsAscFromLocalStorage = await customLocalforage
        .getItem<LocalForageTypes['vtEventsAsc']>(vtEventsAscKey)
        .then<Types['vtEventsAsc']>(r => r?.map(v => JSON.parse(v)) ?? [])
      console.log('stav0-vt-extract-cache-end', e())

      const client = getCviBackendClient({
        network: CHAIN_IDS_INFO[chainId].networkName,
        backendEnvironment: cviBackendEnvironment,
      }).accounts

      const serverEventCountPromise = client.adminApiControllerEventsInRange({
        resource: 'vt',
        toTimestamp:
          vtEventsAscFromLocalStorage.length > 0
            ? vtEventsAscFromLocalStorage[vtEventsAscFromLocalStorage.length - 1].blockTimestamp
            : undefined,
      })
      cleanups.push(() => serverEventCountPromise.cancel())

      const serverEventCount = await serverEventCountPromise

      if (vtEventsAscFromLocalStorage.length === serverEventCount) {
        const eventsPromise = client.adminApiControllerGetAllVtEventsAsc({
          fromTimestamp:
            vtEventsAscFromLocalStorage.length > 0
              ? vtEventsAscFromLocalStorage[vtEventsAscFromLocalStorage.length - 1].blockTimestamp
              : undefined,
        })
        cleanups.push(() => eventsPromise.cancel())
        console.log('stav4-vt-started-1')
        const events = await eventsPromise
        console.log('stav4-vt-ended-1', events.length)
        await customLocalforage.setItem(
          vtEventsAscKey,
          vtEventsAscFromLocalStorage.concat(events).map(r => JSON.stringify(r)),
        )
      } else {
        const eventsPromise = client.adminApiControllerGetAllVtEventsAsc({})
        cleanups.push(() => eventsPromise.cancel())
        console.log('stav4-vt-started-2')
        const events = await eventsPromise
        console.log('stav4-vt-ended-2', events.length)
        await customLocalforage.setItem(
          vtEventsAscKey,
          events.map(r => JSON.stringify(r)),
        )
      }
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'vtEventsAsc',
          type: 'done',
        }),
      )
    }

    run().catch(e => globalEventsInversifyService.eventEmitter.emit('errors', e))

    return () => {
      cleanups.forEach(f => f())
    }
  }, [chainId, cviBackendEnvironment, dispatch, globalEventsInversifyService, vtEventsAscKey])

  const tvEventsAscKey = useLocalStorageKey('tvEventsAsc')

  useEffect(() => {
    if (!globalEventsInversifyService) {
      return
    }

    const cleanups: (() => void)[] = []
    async function run() {
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'tvEventsAsc',
          type: 'in-progress',
        }),
      )
      const e = startTimer()
      console.log('stav0-tv-extract-cache')
      const tvEventsAscFromLocalStorage = await customLocalforage
        .getItem<LocalForageTypes['tvEventsAsc']>(tvEventsAscKey)
        .then<Types['tvEventsAsc']>(r => r?.map(v => JSON.parse(v)) ?? [])
      console.log('stav0-tv-extract-cache-end', e())

      const client = getCviBackendClient({
        network: CHAIN_IDS_INFO[chainId].networkName,
        backendEnvironment: cviBackendEnvironment,
      }).accounts

      const serverEventCountPromise = client.adminApiControllerEventsInRange({
        resource: 'tv',
        toTimestamp:
          tvEventsAscFromLocalStorage.length > 0
            ? tvEventsAscFromLocalStorage[tvEventsAscFromLocalStorage.length - 1].blockTimestamp
            : undefined,
      })
      cleanups.push(() => serverEventCountPromise.cancel())

      const serverEventCount = await serverEventCountPromise

      if (tvEventsAscFromLocalStorage.length === serverEventCount) {
        const eventsPromise = client.adminApiControllerGetAllTvEventsAsc({
          fromTimestamp:
            tvEventsAscFromLocalStorage.length > 0
              ? tvEventsAscFromLocalStorage[tvEventsAscFromLocalStorage.length - 1].blockTimestamp
              : undefined,
        })
        cleanups.push(() => eventsPromise.cancel())
        console.log('stav3-tv-started-1')
        const events = await eventsPromise
        console.log('stav3-tv-ended-1', events.length)
        await customLocalforage.setItem(
          tvEventsAscKey,
          tvEventsAscFromLocalStorage.concat(events).map(r => JSON.stringify(r)),
        )
      } else {
        const eventsPromise = client.adminApiControllerGetAllTvEventsAsc({})
        cleanups.push(() => eventsPromise.cancel())
        console.log('stav3-tv-started-2')
        const events = await eventsPromise
        console.log('stav3-tv-ended-2', events.length)
        await customLocalforage.setItem(
          tvEventsAscKey,
          events.map(r => JSON.stringify(r)),
        )
      }
      dispatch(
        actions.setWebsiteLoadingPercentage({
          key: 'tvEventsAsc',
          type: 'done',
        }),
      )
    }

    run().catch(e => globalEventsInversifyService.eventEmitter.emit('errors', e))

    return () => {
      cleanups.forEach(f => f())
    }
  }, [chainId, cviBackendEnvironment, dispatch, globalEventsInversifyService, tvEventsAscKey])

  useEffect(() => {
    if (!vtInversifyService || !globalEventsInversifyService) {
      return
    }

    let initialized = false
    const get = async () => {
      if (!initialized) {
        dispatch(
          actions.setWebsiteLoadingPercentage({
            key: 'updateGeneralInfoOfEventAndAddresses',
            type: 'in-progress',
          }),
        )
        dispatch(
          actions.setWebsiteLoadingPercentage({
            key: 'currentHourlyFundingFee',
            type: 'in-progress',
          }),
        )
      }
      const updateGeneralInfoOfEventAndAddresses = await getCviBackendClient({
        network: CHAIN_IDS_INFO[chainId].networkName,
        backendEnvironment: cviBackendEnvironment,
      }).accounts.adminApiControllerGetUpdateGeneralInfoOfEventAndAddressesDto()

      dispatch(actions.setUpdateGeneralInfoOfEventAndAddressesDto(updateGeneralInfoOfEventAndAddresses))

      const cviIndex = updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent.cviIndex
      const tvCollateralRatio = updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent.tvInfo.tvCollateralRatio

      const currentHourlyFundingFeeByTvCollateralRatio = await vtInversifyService.fundingFees(
        Math.round(tvCollateralRatio),
      )
      const currentHourlyFundingFee =
        currentHourlyFundingFeeByTvCollateralRatio[Math.round(tvCollateralRatio)][Math.round(cviIndex)]

      dispatch(actions.setCurrentHourlyFundingFee(currentHourlyFundingFee))

      if (!initialized) {
        dispatch(
          actions.setWebsiteLoadingPercentage({
            key: 'updateGeneralInfoOfEventAndAddresses',
            type: 'done',
          }),
        )
        dispatch(
          actions.setWebsiteLoadingPercentage({
            key: 'currentHourlyFundingFee',
            type: 'done',
          }),
        )
        initialized = true
      }
    }
    get()
    const id = setInterval(get, 1000 * 60 * 60 * 30) // every 30m
    return () => {
      clearInterval(id)
      initialized = false
    }
  }, [chainId, dispatch, cviBackendEnvironment, vtInversifyService, globalEventsInversifyService])

  return null
}
