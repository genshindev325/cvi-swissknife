import { tokenDecimals, Stator, TokenName, catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import useUsdcBalance from '../../../../hooks/useUsdcBalance'
import { useTvInversifyServices } from '../../../../hooks/useTvInversifyServices'
import { useWallet } from '../../../../hooks/useWallet'
import { useAppSelector } from '../../../../redux/hooks'
import Button from '../../../Button/Button'
import InputAmount from '../../../InputAmount/InputAmount'
import ConnectButton from '../../../NavbarButtons/ConnectButton'
import CustomNotification from 'beta-cvi-ui/src/components/CustomNotification'
import { displayNotification } from '../../../../utils/utilities'
import { useAddress } from '../../../../hooks/use-address'
import usePromise from 'react-use-promise'

type Props = {
  amount: number | undefined
  setAmount: React.Dispatch<React.SetStateAction<number | undefined>>
}
const Withdraw: FC<Props> = ({ amount, setAmount }) => {
  const { address } = useAddress()

  const balanceUsdc = useUsdcBalance()

  const { globalEventsInversifyService } = useWallet()
  const { thetaVaultInversifyService, tvContractsEventsInversifyService } = useTvInversifyServices()
  const [minimumToWithdraw, setMinimumToWithdraw] = useState<number>()
  const { positionOfAddress } = useAppSelector(({ state }) => state.cvi.tv)
  const [isLiquiditySufficient, setIsLiquiditySufficient] = useState(false)
  const [maxWithdrawLiquidity, setMaxWithdrawLiquidity] = useState<number | undefined>(undefined)
  const [IsMaxClicked, setIsMaxClicked] = useState(false)
  const withdrawLock = useAppSelector(state => state.state.cvi.tv.withdrawLock)

  const [reloadApproval, setReloadApproval] = useState(1)

  const [approvedTvCviX2Info] = usePromise(async () => {
    if (address && thetaVaultInversifyService) {
      return {
        result: await thetaVaultInversifyService?.getApproveTvCviX2(address),
        reloadApproval,
      }
    }
  }, [address, thetaVaultInversifyService, reloadApproval])

  const approvedTvCviX2 =
    approvedTvCviX2Info?.reloadApproval === reloadApproval ? approvedTvCviX2Info.result : undefined

  useEffect(() => {
    let shouldUpdate = true

    if (thetaVaultInversifyService) {
      const getMinLimitToWithdraw = async () => {
        thetaVaultInversifyService?.getMinWithdraw().then(data => {
          if (shouldUpdate) {
            setMinimumToWithdraw(data)
          }
        })
      }
      getMinLimitToWithdraw()
    }
    return () => {
      shouldUpdate = false
    }
  }, [thetaVaultInversifyService])

  useEffect(() => {
    let shouldUpdate = true

    if (thetaVaultInversifyService) {
      const getMaxLimitToWithdraw = async () => {
        thetaVaultInversifyService?.getMaxWithdraw().then(data => {
          if (shouldUpdate) {
            setMaxWithdrawLiquidity(data)
          }
        })
      }
      getMaxLimitToWithdraw()
    }
    return () => {
      shouldUpdate = false
    }
  }, [amount, thetaVaultInversifyService])

  useEffect(() => {
    if (maxWithdrawLiquidity !== undefined && amount !== undefined) {
      if (amount < maxWithdrawLiquidity) {
        setIsLiquiditySufficient(false)
      } else {
        setIsLiquiditySufficient(true)
      }
    }
  }, [amount, maxWithdrawLiquidity])

  // useEffect(() => {
  //   if (useDebounceToDisplayNotifications !== undefined) {
  //     if (minimumToWithdraw !== undefined && minimumToWithdraw > useDebounceToDisplayNotifications) {
  //       displayNotification({
  //         id: 'minimum withdraw limit',
  //         type: 'danger',
  //         message: `The withdraw limit is ${minimumToWithdraw}`,
  //       })
  //     }
  //   }
  // }, [minimumToWithdraw, useDebounceToDisplayNotifications, withdrawLock.data?.isLocked])

  const insufficientBalance = () => {
    return (
      positionOfAddress.data !== undefined &&
      amount !== undefined &&
      amount > positionOfAddress.data.positionBalanceUsdc
    )
  }

  function ShowSumbitButton() {
    if (!address) {
      return <ConnectButton type="form" />
    }

    const approveButton = (
      <Button
        type="approve"
        title={`Approve T-CVI-LP`}
        status={approvedTvCviX2 === undefined ? 'pending' : 'resolved'}
        onClick={async () => {
          if (!globalEventsInversifyService || !thetaVaultInversifyService) {
            return
          }
          try {
            await thetaVaultInversifyService.approveTvCviX2()
          } catch (error) {
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setReloadApproval(prev => prev + 1)
          }
        }}
        disabled={
          approvedTvCviX2 === undefined ||
          !globalEventsInversifyService ||
          !thetaVaultInversifyService ||
          (minimumToWithdraw !== undefined && amount !== undefined && minimumToWithdraw > amount)
        }
      />
    )

    const notEnoughFunds =
      withdrawLock.data?.isLocked ||
      isLiquiditySufficient ||
      positionOfAddress.data === undefined ||
      positionOfAddress.data.positionBalanceUsdc === 0 ||
      !amount ||
      amount > positionOfAddress.data.positionBalanceUsdc ||
      (minimumToWithdraw !== undefined && minimumToWithdraw > amount)

    const submitButton = (
      <Button
        type="submit"
        title={amount === undefined ? 'enter amount' : 'withdraw'}
        disabled={approvedTvCviX2 === undefined || notEnoughFunds}
        status={approvedTvCviX2 === undefined ? 'pending' : 'resolved'}
        onClick={async () => {
          if (window.gtag) {
            window.gtag('event', 'withdraw_request_started', {
              page_title: 'withdraw_request_started',
              withdraw_title: 'Withdraw request started',
              description: 'User click on withdraw button',
              page_path: window.location.pathname,
            })
          }
          if (
            !globalEventsInversifyService ||
            !thetaVaultInversifyService ||
            amount === undefined ||
            !tvContractsEventsInversifyService
          ) {
            return
          }
          try {
            if (isLiquiditySufficient === false) {
              if (amount === positionOfAddress.data?.positionBalanceUsdc) {
                await thetaVaultInversifyService?.withdrawFull()
                tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
              } else {
                const tx = await thetaVaultInversifyService.withdraw(amount)
                if (amount !== undefined) {
                  displayNotification({
                    id: `${tx !== undefined ? `pending-${tx?.transactionHash}` : 'pending'}`,
                    title: 'pending',
                    type: 'info',
                    message: `Submitting request to withdraw ${amount} USDC`,
                    content: CustomNotification,
                  })
                }
                tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
                if (approvedTvCviX2 !== undefined && amount !== undefined) {
                  displayNotification({
                    id: `${tx?.transactionHash}`,
                    title: 'completed',
                    type: 'success',
                    message: `The request to withdraw ${amount} USDC was submitted successfully`,
                    content: CustomNotification,
                  })
                }
              }
            }

            if (window.gtag) {
              window.gtag('event', 'withdraw_request_successed', {
                page_title: 'withdraw_request_successed',
                withdraw_title: 'Successful - Submitting request to withdraw',
                description: 'The transaction successed',
                page_path: window.location.pathname,
              })
            }
            setAmount(undefined)
          } catch (error) {
            if (error.message.includes('User denied transaction signature')) {
              if (window.gtag) {
                window.gtag('event', 'withdraw_transaction_denied', {
                  page_title: 'withdraw_transaction_denied',
                  withdraw_denied_title: 'Fail - Denied request to withdraw',
                  description: 'User denied the transaction on the wallet',
                  page_path: window.location.pathname,
                })
              }
              displayNotification({
                id: 'withdrawCancelled',
                title: 'failed',
                type: 'danger',
                message: `Transaction was cancelled`,
                content: CustomNotification,
              })
            } else {
              if (window.gtag) {
                window.gtag('event', 'withdraw_transaction_fail', {
                  page_title: 'withdraw_transaction_fail',
                  withdraw_fail_title: 'Fail - Failed to submit request to withdraw',
                  description: 'The transaction failed',
                  page_path: window.location.pathname,
                })
              }

              if (amount !== undefined) {
                displayNotification({
                  id: 'withdrawFailed',
                  title: 'failed',
                  type: 'danger',
                  message: `Failed to submit the request to withdraw ${amount} USDC`,
                  content: CustomNotification,
                })
              }
            }
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setReloadApproval(prev => prev + 1)
            tvContractsEventsInversifyService.emitPositionOfAddressEvent(address)
          }
        }}
      />
    )

    if (
      approvedTvCviX2 !== undefined &&
      ((amount !== undefined && approvedTvCviX2 < amount) || (amount === undefined && approvedTvCviX2 === 0))
    ) {
      return approveButton
    }

    return submitButton
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="text-white flex flex-col gap-2.5">
          <InputAmount
            userBalanceText={'Available to withdraw'}
            typeOfBalance={TokenName.USDC}
            userBalance={Stator.map(positionOfAddress, d => d.positionBalanceUsdc)}
            customDecimalUserBalance={2}
            fromWhereThisPageInput="withdraw"
            customTitle="amount"
            setIsMaxClicked={setIsMaxClicked}
            value={amount}
            setValue={setAmount}
            fractionDigits={IsMaxClicked ? 20 : tokenDecimals.USDC}
            maxBalanceTitle="Max"
            maxBalance={positionOfAddress.data?.positionBalanceUsdc}
            custompPaceholder={`Enter withdraw amount`}
            type={TokenName.USDC}
            className={classNames({
              'outline outline-2 outline-common-lightRed':
                isLiquiditySufficient ||
                insufficientBalance() ||
                (minimumToWithdraw !== undefined && amount !== undefined && minimumToWithdraw > amount),
            })}
            maxValues={[
              // {
              //   value: positionOfAddress.data?.positionBalanceUsdc,
              //   errorMessage: <span className="text-common-lightRed text-xs">Not enough balance</span>,
              // },
              {
                value:
                  maxWithdrawLiquidity &&
                  positionOfAddress.data?.positionBalanceUsdc &&
                  maxWithdrawLiquidity < positionOfAddress.data?.positionBalanceUsdc
                    ? maxWithdrawLiquidity
                    : undefined,
                errorMessage: (
                  <span className="text-xs text-common-lightRed">
                    Due to the current utilization ratio, the maximum of{' '}
                    <b>{maxWithdrawLiquidity && catDecimalsNoRoundUp(maxWithdrawLiquidity, 4)}</b> USDC can be
                    withdrawn.
                  </span>
                ),
              },
            ]}
          />

          {/* {address && isLiquiditySufficient && maxWithdrawLiquidity !== undefined && (
            <span className="text-xs text-common-lightRed">
              Due to the current utilization ratio, the maximum of
              <b>{catDecimalsNoRoundUp(maxWithdrawLiquidity, 4)}</b> USDC can be withdrawn.
            </span>
          )} */}
          {/* <span
            className={classNames({
              'text-common-lightRed': isLiquiditySufficient || insufficientBalance(),
              'text-xs mr-1 flex felx-row  gap-1 mt-2': true,
              'mt-0': isLiquiditySufficient,
            })}
          >
            Available to withdraw
            {address ? (
              <DisplayNumber
                state={Stator.map(positionOfAddress, d => d.positionBalanceUsdc)}
                tokenName={balanceUsdc.data?.tokenName}
                className={classNames({ 'font-bold text-xs': true })}
                tokenNameClassName="font-normal"
                millify={{
                  precision: 0,
                  units: ['', 'K', 'M', 'B', 'T', 'P', 'E'],
                }}
                customTooltipDecimal={20}
                withTooltip
              />
            ) : (
              <> 0</>
            )}
          </span> */}
        </div>
        <div>
          {address && withdrawLock.data?.isLocked && (
            <p className="text-xs text-common-lightRed mb-6">
              Withdrawal will be available 24 hours after the last deposit request was processed.
            </p>
          )}
          <div className="w-full">{ShowSumbitButton()}</div>
        </div>

        <div className="text-sm">
          <span>
            <b>Please note:</b> Your withdraw will be processed within a few hours.
          </span>
        </div>
      </div>
    </>
  )
}

export default Withdraw
