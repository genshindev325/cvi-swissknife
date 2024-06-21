import type { LeaderboardType } from 'beta-cvi-ui/src/redux'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import React, { useCallback } from 'react'
import Spinner from '../../Spinner/Spinner'
import TradingTopTable from '../TradingTopTable'
import { CommunityBanner } from './CviLiveTradingCompetition'

const CviTopTradingCometions = () => {
  const liveTrading = useAppSelector(state => state.state.cvi.liveTrading)

  const topTree = useCallback(
    (sortBy: 'maxTradeUsdc' | 'pnlUsdc' | 'tvCvix1BalanceInUsdc') => {
      let data:
        | { traderAddress: string; pnlUsdc: number; tvCvix1BalanceInUsdc: number; maxTradeUsdc: number }[]
        | undefined
      if (liveTrading.leaderBoardData) {
        data = liveTrading.leaderBoardData
          .map((lb: LeaderboardType) => {
            return {
              traderAddress: lb.traderAddress,
              pnlUsdc: lb.pnlUsdc,
              tvCvix1BalanceInUsdc: lb.tvCvix1BalanceInUsdc,
              maxTradeUsdc: lb.maxTradeUsdc,
            }
          })
          .sort((a, b) => {
            return b[sortBy] - a[sortBy]
          })

        return [data[0], data[1], data[3]]
      }
    },
    [liveTrading.leaderBoardData],
  )

  return (
    <div className=" flex flex-col gap-4 text-white ">
      <CommunityBanner />
      <span className="flex flex-wrap   w-full">
        {liveTrading.leaderBoardData === undefined ? (
          <Spinner className="w-8 h-8 border-2 border-solid mx-auto mt-10" />
        ) : (
          <>
            <TradingTopTable
              tradingData={topTree('maxTradeUsdc')}
              column={'Largest trade'}
              rowName={'maxTradeUsdc'}
              widthOverride="md:w-6/12"
              tableClassNameOverride="md:pr-4"
            />
            <TradingTopTable
              tradingData={topTree('pnlUsdc')}
              column={'P&L'}
              rowName={'pnlUsdc'}
              widthOverride="md:w-6/12"
              tableClassNameOverride="md:pl-4"
            />

            <TradingTopTable
              tradingData={topTree('tvCvix1BalanceInUsdc')}
              column={'Theta vault deposits'}
              rowName={'tvCvix1BalanceInUsdc'}
              widthOverride="md:w-6/12"
              tableClassNameOverride="md:pr-4 md:pt-4"
            />
          </>
        )}
      </span>
    </div>
  )
}

export default CviTopTradingCometions
