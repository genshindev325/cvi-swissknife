import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useState } from 'react'

import DisplayNumber from '../DisplayNumber/DisplayNumber'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import { useAccount } from 'wagmi'
import type { LeaderboardType } from 'beta-cvi-ui/src/redux'

type Props = LeaderboardType & {
  status: string
  rowName: 'pnlUsdc' | 'tvCvix1BalanceInUsdc' | 'maxTradeUsdc'
  id: number
}

const TradingTopRow: FC<Props> = ({
  id,
  traderAddress,
  trades,
  pnlUsdc,
  maxTradeUsdc,
  score,
  rowName,
  tvCvix1BalanceInUsdc,
  status,
}) => {
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { address } = useAccount()

  const getTd = (
    action: 'id' | 'traderAddress' | 'pnlUsdc' | 'tvCvix1BalanceInUsdc' | 'maxTradeUsdc' | 'status' | 'chevron',
  ) => {
    switch (action) {
      case 'id': {
        return <div className={classNames({ 'rounded-tl-2xl rounded-bl-2xl pl-5 text-center': true })}>{id + 1}</div>
      }
      case 'traderAddress': {
        return (
          <div className={classNames({ 'flex flex-row justify-center': true })}>
            <a
              className="flex flex-row items-center gap-1 text-custom-300 text-sm"
              href={`https://arbiscan.io/address/${traderAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {traderAddress.slice(0, 7)}
            </a>
          </div>
        )
      }

      case 'pnlUsdc': {
        return (
          <div className={classNames({ 'flex flex-row justify-center': true })}>
            {`${pnlUsdc > 0 ? '+' : pnlUsdc < 0 ? '-' : ''}`}
            <DisplayNumber
              state={pnlUsdc < 0 ? Number(pnlUsdc.toString().slice(1)) : pnlUsdc}
              dollar
              className="text-sm"
            />
          </div>
        )
      }
      case 'maxTradeUsdc': {
        return (
          <div className={classNames({ 'flex flex-row justify-center': !isOpen })}>
            <DisplayNumber state={maxTradeUsdc} dollar className="text-sm" />
          </div>
        )
      }
      case 'tvCvix1BalanceInUsdc': {
        return (
          <div
            className={classNames({
              'flex flex-row gap-1': true,
              'items-center justify-center gap-1 text-center ': !isOpen,
            })}
          >
            <DisplayNumber state={tvCvix1BalanceInUsdc} dollar customDecimal={2} className="text-sm" />
          </div>
        )
      }

      case 'chevron': {
        return (
          <div
            className={classNames({
              '  h-17 text-sm  bg-dark-600 flex items-center pr-4 rounded-tr-2xl rounded-br-2xl': true,
              'bg-dark-400': status === 'pending' || id === 1,
            })}
          >
            <GetSvg
              svgName="chevron"
              className={classNames({
                'block ml-auto transition duration-200 fill-custom-300': true,
                'rotate-180': isOpen,
              })}
            />
          </div>
        )
      }
    }
  }
  return (
    <>
      <tr
        className={classNames({
          'h-17 text-sm bg-dark-600 items-center ': true,

          'bg-dark-400': status === 'pending' || id === 0,
          'outline outline-1 outline-common-turquoise rounded-xl': traderAddress === address,
          'md:hover:bg-dark-100': status !== 'pending',
        })}
      >
        <td className={classNames({ 'rounded-l-xl rounded-r-none': true })}>{getTd('id')}</td>
        <td className="table-cell">{getTd('traderAddress')}</td>
        <td className="table-cell rounded-r-xl ">{getTd(rowName)}</td>

        {/* <td className="md:hidden rounded-r-xl rounded-l-none " onClick={() => setIsOpen(prev => !prev)}>
          {getTd('chevron')}
        </td> */}
      </tr>
      {/* {isOpen && (
        <>
          <FullTableSizeTr
            className={classNames({
              'bg-dark-600  flex min-h-full  rounded-2xl ': true,
              'bg-dark-400': status === 'pending' || id === 1,
            })}
          >
            <div className="w-full  px-4 flex mt-4 mb-4 flex-col flex-wrap gap-6">
              <div className="flex flex-col  md:hidden lg:flex   ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1 flex  gap-1 items-center">Largest trade</span>
                </span>
                {getTd('maxTradeUsdc')}
              </div>
            </div>
          </FullTableSizeTr>
        </>
      )} */}
    </>
  )
}

export default TradingTopRow
