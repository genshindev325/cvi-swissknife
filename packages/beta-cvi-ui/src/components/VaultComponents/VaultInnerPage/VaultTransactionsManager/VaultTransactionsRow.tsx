import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import React from 'react'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import { FullTableSizeTr } from 'beta-cvi-ui/src/components/FullTableSizeTr/FullTableSizeTr'
import type { VaultTransaction } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import { TokenName } from '@coti-cvi/lw-sdk'
import DisplayNumber from 'beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'

import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { useAddress } from '../../../../hooks/use-address'

type Props = VaultTransaction

const VaultTransactionsRow: FC<Props> = ({ submitDateToString, action, amount, status, targetTimestamp }) => {
  const { address } = useAddress()
  const { thetaVaultInversifyService, globalEventsInversifyService, tvContractsEventsInversifyService } =
    useTvInversifyServices()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const latestBlock = useAppSelector(state => state.state.latestBlock)

  useEffect(() => {
    const updateData = async () => {
      if (!thetaVaultInversifyService || !address || !tvContractsEventsInversifyService || !latestBlock.data) {
        return
      }

      if (latestBlock.data?.timestamp >= targetTimestamp && status === 'pending') {
        tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
        await thetaVaultInversifyService?.emitPnlEvents(address)
      }

      if (action === 'Deposit') {
        await thetaVaultInversifyService.emitLockWithdrawEvents(address)
      }
    }
    updateData()
  }, [
    action,
    address,
    latestBlock.data,
    status,
    targetTimestamp,
    thetaVaultInversifyService,
    tvContractsEventsInversifyService,
  ])

  const getTd = (type: 'date' | 'action' | 'amount' | 'status' | 'chevron') => {
    switch (type) {
      case 'date': {
        return <div className={classNames({ 'rounded-tl-2xl rounded-bl-2xl pl-4': true })}>{submitDateToString}</div>
      }
      case 'action': {
        return action === 'Withdraw' ? 'Withdrawal' : action
      }
      case 'amount': {
        return (
          <DisplayNumber
            state={Stator.resolve(amount)}
            tokenName={TokenName.USDC}
            className={classNames({ 'font-bold': true })}
            tokenNameClassName="font-normal"
            withTooltip
            customTooltipDecimal={20}
          />
        )
      }
      case 'status': {
        return (
          <div className={classNames({ 'rounded-tr-2xl rounded-br-2xl flex  gap-2': !isOpen })}>
            <span className="flex flex-row gap-1">
              <GetSvg svgName={status} />
              {status === 'pending' ? 'Processing' : status === 'failure' ? 'Failed' : 'Completed'}
            </span>
          </div>
        )
      }
      case 'chevron': {
        return (
          <div
            className={classNames({
              '  h-17 text-sm  bg-dark-600 flex items-center pr-4 rounded-tr-2xl rounded-br-2xl': true,
              'bg-dark-400': status === 'pending',
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
          'bg-dark-400': status === 'pending',
          'md:hover:bg-dark-100': status !== 'pending',
        })}
      >
        <td className={classNames({ 'rounded-l-xl rounded-r-none': true })}>{getTd('date')}</td>
        <td className="hidden md:table-cell">{getTd('action')}</td>
        <td className="hidden md:table-cell">{getTd('amount')}</td>
        <td className="hidden md:table-cell rounded-r-xl rounded-l-none">{getTd('status')}</td>
        <td className="md:hidden rounded-r-xl rounded-l-none " onClick={() => setIsOpen(prev => !prev)}>
          {getTd('chevron')}
        </td>
      </tr>
      {isOpen && (
        <>
          <FullTableSizeTr
            className={classNames({
              'bg-dark-600  flex min-h-full  rounded-2xl ': true,
              'bg-dark-400 ': status === 'pending',
            })}
          >
            <div className="w-full  px-4 flex mt-4 mb-4 flex-col flex-wrap gap-6">
              <div className="flex flex-col md:hidden lg:flex  w-fit ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1">Action</span>
                </span>
                {getTd('action')}
              </div>
              <div className="flex flex-col  md:hidden lg:flex   ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1">Amount</span>
                </span>
                {getTd('amount')}
              </div>
              <div className="flex flex-col  md:hidden lg:flex   ">
                <span className="mr-1 text-white text-opacity-50 block">
                  <span className="mr-1 flex  gap-1 items-center">Status </span>
                </span>
                {getTd('status')}
              </div>
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default VaultTransactionsRow
