import { MODE, Stator } from '@coti-cvi/lw-sdk'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import type { CviTradingCompetitionRanegs, LeaderboardType } from 'beta-cvi-ui/src/redux'

import classNames from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import React from 'react'
import Table from '../Table/Table'
import CviTradingRow from './CviTradingRow'
import { useOrderBy } from 'beta-cvi-ui/src/hooks/useOrderBy'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

type Props = {
  tradingData: {
    range?: CviTradingCompetitionRanegs
    chooseTimestamps: { fromTimestamp?: number; toTimestamp?: number }
    leaderBoardData?: Array<LeaderboardType>
  }
  type?: 'liveLeaderboard'
  isCompetition?: boolean
}
// change the type
type Columns = keyof Pick<LeaderboardType, 'maxTradeUsdc' | 'pnlUsdc' | 'tvCvix1BalanceInUsdc'>
const COLUMNS: Columns[] = ['maxTradeUsdc', 'pnlUsdc', 'tvCvix1BalanceInUsdc']

const CviTradingTable: FC<Props> = ({ type, tradingData, isCompetition }) => {
  const [fullMode] = useLocalStorage('fullMode')

  const { orderBy, onOrderBy } = useOrderBy(COLUMNS, 'pnlUsdc')

  const sortByData = useMemo(() => {
    if (isCompetition) {
      return tradingData.leaderBoardData
    }
    const oldTradingData = tradingData.leaderBoardData
    return oldTradingData
      ?.map((nd: LeaderboardType, i: number) => {
        return {
          traderAddress: nd.traderAddress,
          pnlUsdc: nd.pnlUsdc,
          maxTradeUsdc: nd.maxTradeUsdc,
          trades: nd.trades,
          score: nd.score,
          tvCvix1BalanceInUsdc: nd.tvCvix1BalanceInUsdc,
        }
      })
      .sort((a, b) => {
        const aValue = a[orderBy.key]
        const bValue = b[orderBy.key]
        return orderBy.option === 'asc' ? aValue - bValue : bValue - aValue
      })
  }, [isCompetition, orderBy.key, orderBy.option, tradingData.leaderBoardData])

  return (
    <Table
      state={sortByData !== undefined ? Stator.resolve(sortByData) : Stator.pending()}
      className="right-auto"
      tableClassName="border-separate  border-spacing-y-2  w-full m-auto lg:px-4 "
      pendingClassName="ml-[48%] mt-10"
      resolvedClassName="flex items-center gap-6 w-full  bg-dark-600 justify-center h-32 rounded-2xl"
      type="transactionsTable"
      name="leaderboard"
    >
      <thead className="text-sm text-white text-opacity-50 font-normal ">
        <tr>
          <th scope="col" className={classNames({ 'pl-6  w-1/4 md:w-fit table-cell text-center': true })}>
            #
          </th>

          <th scope="col" className=" w-1/4 md:w-fit table-cell text-center">
            Trader
          </th>
          <th
            scope="col"
            className={classNames({
              ' text-custom-300 hidden md:table-cell text-center': fullMode === MODE.ON,
              hidden: fullMode === MODE.OFF,
            })}
          >
            Admin panel
          </th>
          <th
            scope="col"
            className={classNames({
              ' text-custom-300  hidden md:table-cell text-center': fullMode === MODE.ON,
              hidden: fullMode === MODE.OFF,
            })}
          >
            DeBank
          </th>

          {isCompetition && (
            <th scope="col" className={classNames({ ' hidden md:table-cell text-center ': true })}>
              #Trades
            </th>
          )}
          <th scope="col" className=" w-1/4 md:w-fit table-cell text-center">
            <span className="flex flex-row gap-1 justify-center items-center">
              P&L
              {type === 'liveLeaderboard' && (
                <button className="hidden md:flex" onClick={() => onOrderBy('pnlUsdc')}>
                  <GetSvg
                    svgName={orderBy.key === 'pnlUsdc' && orderBy.option === 'asc' ? 'orderByAsc' : 'orderByDesc'}
                    className="h-fit"
                  />
                </button>
              )}
            </span>
          </th>
          <th scope="col" className="w-1/4 hidden md:table-cell text-center ">
            <span className="flex flex-row gap-1 justify-center items-center">
              Largest trade
              {type === 'liveLeaderboard' && (
                <button onClick={() => onOrderBy('maxTradeUsdc')}>
                  <GetSvg
                    svgName={orderBy.key === 'maxTradeUsdc' && orderBy.option === 'asc' ? 'orderByAsc' : 'orderByDesc'}
                    className="h-fit"
                  />
                </button>
              )}
            </span>
          </th>

          <th
            scope="col"
            className={classNames({
              ' hidden md:table-cell text-center': true,
              'w-fit': isCompetition,
              'w-1/4': !isCompetition,
            })}
          >
            <span
              className={classNames({ 'mr-1': true, 'flex flex-row justify-center gap-1': type === 'liveLeaderboard' })}
            >
              {type === 'liveLeaderboard' ? (
                <>
                  Theta vault deposits
                  <button onClick={() => onOrderBy('tvCvix1BalanceInUsdc')}>
                    <GetSvg
                      svgName={
                        orderBy.key === 'tvCvix1BalanceInUsdc' && orderBy.option === 'asc'
                          ? 'orderByAsc'
                          : 'orderByDesc'
                      }
                      className="h-fit"
                    />
                  </button>
                </>
              ) : (
                'Score'
              )}
            </span>
          </th>
        </tr>
      </thead>

      {data => (
        <tbody className={classNames({ ' text-white text-sm ': true })}>
          {data.map((ct, i: number) => (
            <CviTradingRow status={''} isCompetition={isCompetition} id={i} type={type} key={i} {...ct} />
          ))}
        </tbody>
      )}
    </Table>
  )
}

export default CviTradingTable
