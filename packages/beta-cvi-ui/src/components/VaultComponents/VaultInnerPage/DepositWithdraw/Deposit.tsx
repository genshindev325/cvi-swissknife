import { tokenDecimals, TokenName } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { useTvInversifyServices } from '../../../../hooks/useTvInversifyServices'
import { selectors } from '../../../../redux'
import { useAppSelector } from '../../../../redux/hooks'
import Button from '../../../Button/Button'
import InputAmount from '../../../InputAmount/InputAmount'
import ConnectButton from '../../../NavbarButtons/ConnectButton'
import { displayNotification } from '../../../../utils/utilities'
import CustomNotification from 'beta-cvi-ui/src/components/CustomNotification'
import { useAddress } from '../../../../hooks/use-address'

type Props = {
  amount: number | undefined
  setAmount: React.Dispatch<React.SetStateAction<number | undefined>>
}
const Deposit: FC<Props> = ({ amount, setAmount }) => {
  const { address } = useAddress()
  const balanceUsdc = useAppSelector(state => state.state.cvi.volatilityToken.Balance)

  const {
    globalEventsInversifyService,
    thetaVaultInversifyService,
    tvContractsEventsInversifyService,
    vtInversifyService,
  } = useTvInversifyServices()
  const [isLoading, setIsLoading] = useState(false)
  const [approvedUsdc, setApprovedUsdc] = useState<number>()
  const [minimumToDeposit, setMinimumToDeposit] = useState<number>()
  const tvProgressBarPersentage = useAppSelector(selectors.tvProgressBarPersentage)

  useEffect(() => {
    let shouldUpdate = true

    if (address && thetaVaultInversifyService) {
      const getUsdcApproved = async () => {
        thetaVaultInversifyService?.getApproveUsdc(address).then(data => {
          if (shouldUpdate) {
            setApprovedUsdc(data)
          }
        })
      }

      getUsdcApproved()
    }

    return () => {
      shouldUpdate = false
    }
  }, [address, thetaVaultInversifyService, isLoading])

  useEffect(() => {
    let shouldUpdate = true

    if (thetaVaultInversifyService) {
      const getMinLimitToDeposit = async () => {
        thetaVaultInversifyService?.getMinDeposit().then(data => {
          if (shouldUpdate) {
            setMinimumToDeposit(data)
          }
        })
      }
      getMinLimitToDeposit()
    }
    return () => {
      shouldUpdate = false
    }
  }, [thetaVaultInversifyService])

  // useEffect(() => {
  //   if (useDebounceToDisplayNotifications !== undefined) {
  //     if (minimumToDeposit !== undefined && minimumToDeposit > useDebounceToDisplayNotifications) {
  //       displayNotification({
  //         id: 'minimum deposit limit',
  //         type: 'danger',
  //         message: `The deposit limit is ${minimumToDeposit}`,
  //       })
  //     }
  //   }
  // }, [minimumToDeposit, useDebounceToDisplayNotifications])

  const insufficientBalance = () => {
    return (
      balanceUsdc.data !== undefined &&
      thetaVaultInversifyService !== undefined &&
      amount !== undefined &&
      amount > balanceUsdc.data
      // balanceUsdc.data.lt(thetaVaultInversifyService.tokenUSDC.fromNumber(amount))
    )
  }

  function ShowSumbitButton() {
    if (!address) {
      return <ConnectButton type="form" />
    }

    const approveButton = (
      <Button
        type="approve"
        title={`Approve USDC`}
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (!globalEventsInversifyService || !thetaVaultInversifyService) {
            return
          }
          try {
            setIsLoading(true)
            await thetaVaultInversifyService.approveUsdc()
          } catch (error) {
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={
          isLoading ||
          !globalEventsInversifyService ||
          !thetaVaultInversifyService ||
          (minimumToDeposit !== undefined && amount !== undefined && minimumToDeposit > amount)
        }
      />
    )

    const notEnoughFunds =
      balanceUsdc.data === undefined ||
      balanceUsdc.data === 0 ||
      !amount ||
      amount > balanceUsdc.data ||
      (minimumToDeposit !== undefined && minimumToDeposit > amount)

    const submitButton = (
      <Button
        type="submit"
        title={amount === undefined ? 'enter amount' : 'deposit'}
        disabled={(tvProgressBarPersentage.data && tvProgressBarPersentage.data >= 100) || isLoading || notEnoughFunds}
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (window.gtag) {
            window.gtag('event', 'deposit_request_started', {
              page_title: 'deposit_request_started',
              deposit_title: 'Deposit request started',
              description: 'User click on deposit button',
              page_path: window.location.pathname,
            })
          }
          if (
            !globalEventsInversifyService ||
            !thetaVaultInversifyService ||
            amount === undefined ||
            !tvContractsEventsInversifyService ||
            !vtInversifyService
          ) {
            return
          }
          try {
            setIsLoading(true)
            const tx = await thetaVaultInversifyService.deposit(amount)
            if (amount !== undefined) {
              displayNotification({
                id: `${tx !== undefined ? `pending-${tx?.transactionHash}` : 'pending'}`,
                title: 'pending',
                type: 'info',
                message: `Submitting request to deposit ${amount} USDC`,
                content: CustomNotification,
              })
            }
            tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
            if (!isLoading && amount !== undefined) {
              displayNotification({
                id: `${tx?.transactionHash}`,
                title: 'completed',
                type: 'success',
                message: `The request to deposit ${amount} USDC was submitted successfully`,
                content: CustomNotification,
              })
            }

            // thetaVaultInversifyService.emitDepositBalanceEvent(address)
            vtInversifyService.emitBalanceEvent(address)

            if (window.gtag) {
              window.gtag('event', 'deposit_request_successed', {
                page_title: 'deposit_request_successed',
                deposit_title: 'Successful - Submitting request to deposit',
                description: 'The transaction successed',
                page_path: window.location.pathname,
              })
            }
            setAmount(undefined)
          } catch (error) {
            if (error.message.includes('User denied transaction signature')) {
              if (window.gtag) {
                window.gtag('event', 'deposit_transaction_denied', {
                  page_title: 'deposit_transaction_denied',
                  deposit_denied_title: 'Fail - Denied request to deposit',
                  description: 'User denied the transaction on the wallet',
                  page_path: window.location.pathname,
                })
              }

              displayNotification({
                id: 'depositCancelled',
                title: 'failed',
                type: 'danger',
                message: `Transaction was cancelled`,
                content: CustomNotification,
              })
            } else {
              if (window.gtag) {
                window.gtag('event', 'deposit_transaction_fail', {
                  page_title: 'deposit_transaction_fail',
                  deposit_fail_title: 'Fail - Failed to submit request to deposit',
                  description: 'The transaction failed',
                  page_path: window.location.pathname,
                })
              }
              if (amount !== undefined) {
                displayNotification({
                  id: 'depositFailed',
                  title: 'failed',
                  type: 'danger',
                  message: `Failed to submit the request to deposit ${amount} USDC`,
                  content: CustomNotification,
                })
              }
            }
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setIsLoading(false)
          }
        }}
      />
    )

    if (
      approvedUsdc !== undefined &&
      ((amount !== undefined && approvedUsdc < amount) || (amount === undefined && approvedUsdc === 0))
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
            typeOfBalance={TokenName.USDC}
            userBalance={balanceUsdc}
            customDecimalUserBalance={2}
            fromWhereThisPageInput="deposit"
            customTitle="Amount"
            value={amount}
            setValue={setAmount}
            fractionDigits={tokenDecimals.USDC}
            maxBalanceTitle="Max"
            maxBalance={balanceUsdc.data}
            custompPaceholder={`Enter deposit amount`}
            type={TokenName.USDC}
            className={classNames({
              'outline outline-2 outline-common-lightRed':
                insufficientBalance() ||
                (minimumToDeposit !== undefined && amount !== undefined && minimumToDeposit > amount),
            })}
            // maxValues={[
            //   {
            //     value: balanceUsdc.data,
            //     errorMessage: <span className="text-common-lightRed text-xs">Not enough balance</span>,
            //   },
            // ]}
          />
        </div>
        <div className="w-full">{ShowSumbitButton()}</div>
        <div className="text-sm">
          <span>
            <b>Please note:</b> Your deposit will be processed within a few hours.
          </span>
        </div>
      </div>
    </>
  )
}

export default Deposit
