import { Stator } from '@coti-cvi/lw-sdk'

import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'
import Table from '../Table/Table'
import TradingTopRow from './TradingTopRow'

// type TopLeaderboardType = {
//     traderAddress: string;
//     (pnlUsdc: number
//    | maxTradeUsdc: number
//    | tvCvix1BalanceInUsdc: number)
// }

type Props = {
  tradingData:
    | { traderAddress: string; pnlUsdc: number; tvCvix1BalanceInUsdc: number; maxTradeUsdc: number }[]
    | undefined
  column: string
  rowName: 'pnlUsdc' | 'tvCvix1BalanceInUsdc' | 'maxTradeUsdc'
  widthOverride?: string
  tableClassNameOverride?: string
}

const TradingTopTable: FC<Props> = ({ tradingData, column, rowName, widthOverride, tableClassNameOverride }) => {
  return (
    <Table
      state={tradingData !== undefined ? Stator.resolve(tradingData) : Stator.pending()}
      className={classNames({
        'lg:left-0': true,
      })}
      tableWidthOverride={widthOverride}
      tableClassName={classNames({
        'border-separate  border-spacing-y-2  ': true,
        [tableClassNameOverride ?? '']: !!tableClassNameOverride,
      })}
      pendingClassName="ml-[48%] mt-10"
      resolvedClassName="flex items-center gap-6   bg-dark-600 h-32 rounded-2xl"
      type="transactionsTable"
      name="leaderboard"
    >
      <thead className="text-sm text-white text-opacity-50 font-normal ">
        <tr>
          <th scope="col" className={classNames({ 'pl-6  w-1/3  table-cell text-center': true })}>
            #
          </th>

          <th scope="col" className=" w-1/3  table-cell text-center">
            Trader
          </th>
          <th scope="col" className=" w-1/3  table-cell text-center">
            {column}
          </th>
        </tr>
      </thead>

      {data => (
        <tbody className={classNames({ ' text-white text-sm ': true })}>
          {data.map((ct, i: number) => (
            <TradingTopRow status={''} rowName={rowName} id={i} key={i} {...ct} />
          ))}
        </tbody>
      )}
    </Table>
  )
}

export default TradingTopTable
