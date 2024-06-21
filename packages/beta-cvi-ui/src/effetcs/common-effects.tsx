import type { Block, State } from '@coti-cvi/lw-sdk'
import { getFromTimestampForLeaderBoardTimeRangeString } from '@coti-cvi/lw-sdk'
import { competition_1_data } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, NetworkName } from '@coti-cvi/lw-sdk'
import { getCviBackendClient } from '@coti-cvi/lw-sdk'
import { BackendEnvironment, getCviOracleEventsBackend } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import { MODE } from '@coti-cvi/lw-sdk'

import { GetCviOracleHistoryDataQueryDto } from 'auto-generated-code/src/backend-client-apis/cvi-oracle-events-backend-swagger-client'
import { useState, useEffect, useRef } from 'react'
import usePromise from 'react-use-promise'
import { useAddress } from '../hooks/use-address'
import { useChain } from '../hooks/use-chain'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import { useImpersonation } from '../hooks/useImpersonation'
import { useWallet } from '../hooks/useWallet'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { actions } from '../redux/store'
import type { TradingCompetitionInfoAddressDto } from 'auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { calculateBonusMultiplier } from '../components/CviTradingCompetition/CviTradingRow'
import { getHourData } from '../components/Charts/TradingView/api/helper'
import { useTvInversifyServices } from '../hooks/useTvInversifyServices'

type LeaderBoardFromatedType = {
  traderAddress: string
  pnlUsdc: number
  maxTradeUsdc: number
  trades: number
  score: number
  tvCvix1BalanceInUsdc: number
}
export const formatLeaderboardData = (res: Array<TradingCompetitionInfoAddressDto>, formatBy?: 'score') => {
  return res
    .filter(lb => (formatBy === 'score' ? lb.maxTradeUsdc >= 50 : lb.maxTradeUsdc >= 0))
    .map((lb: TradingCompetitionInfoAddressDto): LeaderBoardFromatedType => {
      return {
        traderAddress: lb.address,
        pnlUsdc: lb.pnlUsdc,
        maxTradeUsdc: lb.maxTradeUsdc,
        trades: lb.trades,
        score: (lb.pnlUsdc / lb.maxTradeUsdc) * 100 * calculateBonusMultiplier(lb.maxTradeUsdc),
        tvCvix1BalanceInUsdc: lb.tvCvix1BalanceInUsdc,
      }
    })
    .sort((a, b) => {
      if (formatBy === 'score') {
        return b.score - a.score
      }
      return b.pnlUsdc - a.pnlUsdc
    })
}

export function CommonEffects() {
  const dispatch = useAppDispatch()
  const { inversifyContainer } = useWallet()
  const [fullMode] = useLocalStorage('fullMode')
  const [initImpersonateUrlQueryParam, setInitImpersonateUrlQueryParam] = useState<boolean>(false)
  const { onImpersonation } = useImpersonation()
  const restrictRegion = useAppSelector(state => state.state.isCurrentIpApproved)
  const [, setShowRestrictRegionModal] = useLocalStorage('showRestrictRegionModal')
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const { selectedChainInfo } = useChain()
  const { impersonatedMode } = useAddress()

  const tradingCompetition = useAppSelector(state => state.state.cvi.tradingCompetition)

  const liveTrading = useAppSelector(state => state.state.cvi.liveTrading)
  const historyCompetition = useAppSelector(state => state.state.cvi.historyCompetition)
  const { cviOracleInversifyService } = useTvInversifyServices()

  useEffect(() => {
    dispatch(actions.setLiveTrading(undefined))
    if (liveTrading.range !== undefined) {
      const fromTimestamp = getFromTimestampForLeaderBoardTimeRangeString(liveTrading.range)
      dispatch(
        actions.setCviTradingCompetitionChooseTimestamps({
          fromTimestamp,
        }),
      )
    }
  }, [dispatch, liveTrading.range])

  //CVI data by hour
  useEffect(() => {
    getHourData()
  }, [])

  //CVI data lastWeek
  useEffect(() => {
    const getCviDataLastWeek = async () => {
      const fromTS = Math.floor((Date.now() - 604800000) / 1000)
      const toTS = Math.floor(Date.now() / 1000)
      const res = await getCviOracleEventsBackend({
        backendEnvironment: BackendEnvironment.K8s,
        network: selectedChainInfo.networkName,
      }).cviOracle.cviOracleApiControllerGetAllCviIndexes({
        requestBody: {
          fromBlockTimestamp: fromTS,
          toBlockTimestamp: toTS,
          groupBy: GetCviOracleHistoryDataQueryDto.groupBy.HOUR,
        },
      })

      dispatch(actions.setCviDataLastWeek(res))
    }
    getCviDataLastWeek()
    const interval = setInterval(() => {
      getCviDataLastWeek()
    }, 180_000)
    return () => clearInterval(interval)
  }, [dispatch, selectedChainInfo.networkName])

  //CVI data 24h data
  useEffect(() => {
    const getCviDataLast24h = async () => {
      const fromTS = Math.floor((Date.now() - 86400000) / 1000)
      const toTS = Math.floor(Date.now() / 1000)
      const res = await getCviOracleEventsBackend({
        backendEnvironment: BackendEnvironment.K8s,
        network: selectedChainInfo.networkName,
      }).cviOracle.cviOracleApiControllerGetAllCviIndexes({
        requestBody: {
          fromBlockTimestamp: fromTS,
          toBlockTimestamp: toTS,
          groupBy: GetCviOracleHistoryDataQueryDto.groupBy.HOUR,
        },
      })

      dispatch(actions.setCviDataLast24h(res))
    }
    getCviDataLast24h()
    const interval = setInterval(() => {
      getCviDataLast24h()
    }, 180_000)
    return () => clearInterval(interval)
  }, [dispatch, selectedChainInfo.networkName])

  // current cvi
  useEffect(() => {
    const getCurrentCvi = async () => {
      const res = await cviOracleInversifyService?.getCviIndex()
      if (res) {
        dispatch(
          actions.setCurrentCvi(
            Stator.resolve({
              cviIndex: res.cviNumber,
              timestamp: res.cviRoundTimestamp,
            }),
          ),
        )
      }
    }
    getCurrentCvi()

    const interval = setInterval(() => {
      getCurrentCvi()
    }, 180_000)

    return () => clearInterval(interval)
  }, [dispatch, cviOracleInversifyService])

  useEffect(() => {
    dispatch(actions.setWalletProtections(Stator.pending()))
    dispatch(actions.setLiquiditiesFromZapper(Stator.pending()))
  }, [dispatch, selectedChainInfo.chainId])

  //LeaderBoard - Current competition data
  const cviTradingCompetitionRequestIdRef = useRef(0)
  useEffect(() => {
    if (CHAIN_IDS_INFO[selectedChainInfo.chainId].networkName !== NetworkName.Mainnet) {
      return
    }

    const getLeaderBoardData = async () => {
      cviTradingCompetitionRequestIdRef.current++
      const requestId = cviTradingCompetitionRequestIdRef.current
      const res = await getCviBackendClient({
        network: selectedChainInfo.networkName,
        backendEnvironment: BackendEnvironment.K8s,
      }).accounts.adminApiControllerGetVtTradingCompetition({
        fromTimestamp: tradingCompetition.chooseTimestamps.fromTimestamp,
      })
      if (requestId === cviTradingCompetitionRequestIdRef.current) {
        const formattedRes = formatLeaderboardData(res, 'score')
        dispatch(actions.setLeaderBoardData(formattedRes))
      }
    }
    if (tradingCompetition.chooseTimestamps.toTimestamp) {
      getLeaderBoardData()
      const interval = setInterval(() => {
        getLeaderBoardData()
      }, 60_000)

      return () => clearInterval(interval)
    }
  }, [
    dispatch,
    selectedChainInfo.chainId,
    selectedChainInfo.networkName,
    tradingCompetition.chooseTimestamps.fromTimestamp,
    tradingCompetition.chooseTimestamps.toTimestamp,
  ])
  //LeaderBoard - Live competition data
  const cviLiveTradingRequestIdRef = useRef(0)
  useEffect(() => {
    if (CHAIN_IDS_INFO[selectedChainInfo.chainId].networkName !== NetworkName.Mainnet) {
      return
    }

    const getLiveLeaderBoardData = async () => {
      cviLiveTradingRequestIdRef.current++
      const requestId = cviLiveTradingRequestIdRef.current
      const res = await getCviBackendClient({
        network: selectedChainInfo.networkName,
        backendEnvironment: BackendEnvironment.K8s,
      }).accounts.adminApiControllerGetVtTradingCompetition({
        fromTimestamp: liveTrading.chooseTimestamps.fromTimestamp,
      })
      if (requestId === cviLiveTradingRequestIdRef.current) {
        const formattedRes = formatLeaderboardData(res)
        dispatch(actions.setLiveTrading(formattedRes))
      }
    }
    getLiveLeaderBoardData()
    const interval = setInterval(() => {
      getLiveLeaderBoardData()
    }, 60_000)

    return () => clearInterval(interval)
  }, [
    dispatch,
    liveTrading.chooseTimestamps.fromTimestamp,
    liveTrading.chooseTimestamps.toTimestamp,
    selectedChainInfo.chainId,
    selectedChainInfo.networkName,
  ])

  //LeaderBoard - History competition data
  const cviHistoryTradingRequestIdRef = useRef(0)
  useEffect(() => {
    if (CHAIN_IDS_INFO[selectedChainInfo.chainId].networkName !== NetworkName.Mainnet) {
      return
    }

    const comp_1_fromTS = Math.floor(Date.parse('2022-12-22T16:00:00.000Z') / 1000)
    const comp_1_toTS = Math.floor(Date.parse('2023-01-05T16:00:00.000Z') / 1000)
    let isCompetition_1 = false
    if (
      historyCompetition.chooseTimestamps.fromTimestamp === comp_1_fromTS &&
      historyCompetition.chooseTimestamps.toTimestamp === comp_1_toTS
    ) {
      isCompetition_1 = true
      const formattedRes = formatLeaderboardData(competition_1_data, 'score')
      dispatch(actions.setHistoryCompetition(formattedRes))
    }

    // const getHistoryLeaderBoardData = async () => {
    //   cviHistoryTradingRequestIdRef.current++
    //   const requestId = cviHistoryTradingRequestIdRef.current
    //   const res = await getCviBackendClient({
    //     network: selectedChainInfo.networkName,
    //     backendEnvironment: BackendEnvironment.K8s,
    //   }).accounts.adminApiControllerGetVtTradingCompetition({
    //     fromTimestamp: historyCompetition.chooseTimestamps.fromTimestamp,
    //   })
    //   if (requestId === cviHistoryTradingRequestIdRef.current) {
    //     const formattedRes = formatLeaderboardData(res, 'score')
    //     dispatch(actions.setHistoryCompetition(formattedRes))
    //   }
    // }

    // if (historyCompetition.chooseTimestamps.toTimestamp && !isCompetition_1) {
    //   getHistoryLeaderBoardData()
    // }
  }, [dispatch, selectedChainInfo.chainId, selectedChainInfo.networkName, historyCompetition.chooseTimestamps])

  const [ipGeoLocationInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('IpGeoLocationInversifyService'),
    [inversifyContainer],
  )

  const [isCurrentIpApprovedInCvi] = usePromise(
    async () =>
      fullMode === MODE.ON || impersonatedMode ? true : ipGeoLocationInversifyService?.isCurrentIpApproved(),
    [fullMode, impersonatedMode, ipGeoLocationInversifyService],
  )
  useEffect(() => {
    if (isCurrentIpApprovedInCvi !== undefined) {
      dispatch(actions.setIsCurrentIpApprovedInCvi(isCurrentIpApprovedInCvi))
    }
  }, [dispatch, isCurrentIpApprovedInCvi])

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  useEffect(() => {
    if (!globalEventsInversifyService) {
      return
    }

    function setLatestBlockToRedux(block: State<Block>) {
      dispatch(actions.setLatestBlock(block))
    }

    globalEventsInversifyService.eventEmitter.on('latestBlock', setLatestBlockToRedux)

    return () => {
      globalEventsInversifyService.eventEmitter.off('latestBlock', setLatestBlockToRedux)
    }
  }, [dispatch, globalEventsInversifyService])

  useEffect(() => {
    if (!initImpersonateUrlQueryParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const params = Object.fromEntries(urlSearchParams.entries())
      const impersonateAddress = params?.impersonate

      if (impersonateAddress) {
        onImpersonation(impersonateAddress)
        setInitImpersonateUrlQueryParam(true)
      }
    }
  }, [onImpersonation, initImpersonateUrlQueryParam, setInitImpersonateUrlQueryParam, impersonatedMode])

  useEffect(() => {
    if (restrictRegion === false) {
      setShowRestrictRegionModal(true)
    } else if (restrictRegion === true || restrictRegion === undefined) {
      setShowRestrictRegionModal(false)
    }
  }, [restrictRegion, setShowRestrictRegionModal, themeWeb])

  return null
}
