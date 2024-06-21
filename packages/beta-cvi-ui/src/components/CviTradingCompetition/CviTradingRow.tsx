import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useState } from 'react'
import { FullTableSizeTr } from '../FullTableSizeTr/FullTableSizeTr'
import ReactTooltip from 'react-tooltip'
import { EquationEvaluate, defaultErrorHandler, Equation } from 'react-equation'
import { defaultVariables, defaultFunctions } from 'equation-resolver'

import DisplayNumber from '../DisplayNumber/DisplayNumber'
import { catDecimalsNoRoundUp, MODE } from '@coti-cvi/lw-sdk'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import { useAccount } from 'wagmi'
import type { LeaderboardType } from 'beta-cvi-ui/src/redux'

type Props = LeaderboardType & { status: string; type?: 'liveLeaderboard'; isCompetition?: boolean; id: number }

const BonuswMultiplierTable = {
  50: 1,
  100: 1.2,
  500: 1.3,
  1000: 1.5,
}
export const calculateBonusMultiplier = (maxTradeUsdc: number) => {
  if (maxTradeUsdc >= 50 && maxTradeUsdc < 100) {
    return BonuswMultiplierTable[50]
  } else if (maxTradeUsdc >= 100 && maxTradeUsdc < 500) {
    return BonuswMultiplierTable[100]
  } else if (maxTradeUsdc >= 500 && maxTradeUsdc < 1000) {
    return BonuswMultiplierTable[500]
  } else if (maxTradeUsdc >= 1000) {
    return BonuswMultiplierTable[1000]
  }
  return 0
}

const CviTradingRow: FC<Props> = ({
  id,
  traderAddress,
  trades,
  pnlUsdc,
  maxTradeUsdc,
  score,
  type,
  tvCvix1BalanceInUsdc,
  status,
  isCompetition,
}) => {
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { address } = useAccount()

  const tradingCompettitionScoreFormula = () => {
    const BonusMultiplier = calculateBonusMultiplier(maxTradeUsdc)

    return (
      <span className="flex flex-col md:flex-row justify-evenly  items-center">
        <Equation value="(total pnl) / (largest trade) * 100 * bonus multiplier " errorHandler={defaultErrorHandler} />
        <b>=</b>
        {maxTradeUsdc !== 0 && (
          <EquationEvaluate
            value={`${catDecimalsNoRoundUp(pnlUsdc, 7)} / ${catDecimalsNoRoundUp(
              maxTradeUsdc,
              7,
            )}  * 100 * ${BonusMultiplier}`}
            errorHandler={defaultErrorHandler}
            variables={defaultVariables}
            functions={defaultFunctions}
          />
        )}
      </span>
    )
  }

  const getTd = (
    action:
      | 'id'
      | 'traderAddress'
      | 'cvi-admin'
      | 'deBank'
      | 'trades'
      | 'pnlUsdc'
      | 'score'
      | 'tvCvix1BalanceInUsdc'
      | 'maxTradeUsdc'
      | 'status'
      | 'chevron',
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
      case 'cvi-admin': {
        return (
          <div className={classNames({ 'flex flex-row justify-center': !isOpen })}>
            <a
              className="flex flex-row items-center gap-1 text-custom-300 text-xs"
              href={`https://cvi-admin-panel-ui.surge.sh/volatility_tokens/${traderAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <GetSvg svgName={'popLink'} className="cursor-pointer fill-custom-300" />
            </a>
          </div>
        )
      }
      case 'deBank': {
        return (
          <div className={classNames({ 'flex flex-row justify-center': !isOpen })}>
            <a
              className="flex flex-row items-center gap-1 text-custom-300 text-xs"
              href={`https://debank.com/profile/${traderAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <GetSvg svgName={'popLink'} className="cursor-pointer fill-custom-300" />
            </a>
          </div>
        )
      }
      case 'trades': {
        return <div className={classNames({ 'text-center ': !isOpen })}>{trades}</div>
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
      case 'score': {
        return (
          <div
            className={classNames({
              'flex flex-row gap-1': true,
              'items-center justify-center gap-1 text-center ': !isOpen,
            })}
          >
            <DisplayNumber state={maxTradeUsdc === 0 ? 0 : score} customDecimal={2} className="text-sm" />

            <span className="flex items-center" data-tip data-for={`leaderboardScore-${id}`}>
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>
            <ReactTooltip
              id={`leaderboardScore-${id}`}
              place="bottom"
              effect="solid"
              data-html={true}
              insecure={true}
              multiline={true}
              className="default-react-tooltip-style default-react-long-tooltip-style"
              delayHide={0}
            >
              {tradingCompettitionScoreFormula()}
            </ReactTooltip>
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
              'bg-dark-400': (status === 'pending' || id === 0) && type !== 'liveLeaderboard',
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

          'bg-dark-400': (status === 'pending' || id === 0) && type !== 'liveLeaderboard',
          'outline outline-1 outline-common-turquoise rounded-xl': traderAddress === address,
          'md:hover:bg-dark-100': status !== 'pending',
        })}
      >
        <td className={classNames({ 'rounded-l-xl rounded-r-none': true })}>{getTd('id')}</td>
        <td className="table-cell">{getTd('traderAddress')}</td>
        <td className={classNames({ 'hidden md:table-cell': fullMode === MODE.ON, hidden: fullMode === MODE.OFF })}>
          {getTd('cvi-admin')}
        </td>
        <td className={classNames({ 'hidden md:table-cell': fullMode === MODE.ON, hidden: fullMode === MODE.OFF })}>
          {getTd('deBank')}
        </td>
        {isCompetition && <td className={classNames({ 'hidden md:table-cell': true })}>{getTd('trades')}</td>}
        <td className="table-cell ">{getTd('pnlUsdc')}</td>
        <td className="hidden md:table-cell ">{getTd('maxTradeUsdc')}</td>
        {type === 'liveLeaderboard' ? (
          <td className="hidden md:table-cell rounded-r-xl rounded-l-none">{getTd('tvCvix1BalanceInUsdc')}</td>
        ) : (
          <td className="hidden md:table-cell rounded-r-xl rounded-l-none">{getTd('score')}</td>
        )}
        <td className="md:hidden rounded-r-xl rounded-l-none " onClick={() => setIsOpen(prev => !prev)}>
          {getTd('chevron')}
        </td>
      </tr>
      {isOpen && (
        <>
          <FullTableSizeTr
            className={classNames({
              'bg-dark-600  flex min-h-full  rounded-2xl ': true,
              'bg-dark-400': status === 'pending' || id === 0 || type !== 'liveLeaderboard',
            })}
          >
            <div className="w-full  px-4 flex mt-4 mb-4 flex-col flex-wrap gap-6">
              <div
                className={classNames({
                  'flex flex-col md:hidden lg:flex w-fit': fullMode === MODE.ON,
                  hidden: fullMode === MODE.OFF,
                })}
              >
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1">Admin panel</span>
                </span>
                {getTd('cvi-admin')}
              </div>
              <div
                className={classNames({
                  'flex flex-col md:hidden lg:flex w-fit': fullMode === MODE.ON,
                  hidden: fullMode === MODE.OFF,
                })}
              >
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1">DeBank</span>
                </span>
                {getTd('deBank')}
              </div>
              <div className={classNames({ 'flex flex-col  md:hidden lg:flex': true, hidden: !isCompetition })}>
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1">Trades</span>
                </span>
                {getTd('trades')}
              </div>
              {/* <div className="flex flex-col  md:hidden lg:flex   ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1 flex  gap-1 items-center">pnlUsdc</span>
                </span>
                {getTd('pnlUsdc')}
              </div> */}
              <div className="flex flex-col  md:hidden lg:flex   ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1 flex  gap-1 items-center">Largest trade</span>
                </span>
                {getTd('maxTradeUsdc')}
              </div>
              {type === 'liveLeaderboard' ? (
                <div className="flex flex-col  md:hidden lg:flex   ">
                  <span className="mr-1 text-white text-opacity-50 block">
                    <span className="mr-1 flex  gap-1 items-center">Theta vault deposits</span>
                  </span>
                  {getTd('tvCvix1BalanceInUsdc')}
                </div>
              ) : (
                <div className="flex flex-col  md:hidden lg:flex   ">
                  <span className="mr-1 text-white text-opacity-50 block">
                    <span className="mr-1 flex  gap-1 items-center">Score</span>
                  </span>
                  {getTd('score')}
                </div>
              )}
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default CviTradingRow
