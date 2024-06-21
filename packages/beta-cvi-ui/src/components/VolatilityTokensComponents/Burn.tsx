import type { State } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import { TokenName } from '@coti-cvi/lw-sdk'
import { Stator, tokenDecimals } from '@coti-cvi/lw-sdk'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import classNames from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import React, { useState } from 'react'
import InputAmount from '../InputAmount/InputAmount'
import Button from '../Button/Button'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import ConnectButton from '../NavbarButtons/ConnectButton'
import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import debounce from 'lodash/debounce'
import TimeToFulfillmentProgressBar from './TimeToFulfillmentProgressBar'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import ReactTooltip from 'react-tooltip'
import { displayNotification } from 'beta-cvi-ui/src/utils/utilities'
import CustomNotification from '../CustomNotification'
import { useAddress } from '../../hooks/use-address'

type Props = {
  amount: number | undefined
  setAmount: React.Dispatch<React.SetStateAction<number | undefined>>
}

type PreBurnType = {
  netBurnAmount: number
  expectedUSDCAmount: number
  closeFee: number
  timeWindowFee: number
  keepersFee: number
}

const Burn: FC<Props> = ({ amount, setAmount }) => {
  const { address } = useAddress()
  const addressCurrentBalance = useAppSelector(state => state.state.cvi.volatilityToken.burnBalance)

  const [approvedCviX2, setApprovedCviX2] = useState<number>()
  const { globalEventsInversifyService, vtInversifyService, vtContractsEventsInversifyService } =
    useTvInversifyServices()
  const [isLoading, setIsLoading] = useState(false)
  const [minutesList, setMinutesList] = useState<number[]>([])
  const [selectedMinute, setSelectedMinute] = useState<number>(0)
  const [isMaxClicked, setIsMaxClicked] = useState<boolean>(false)
  const [preBurn, setPreBurn] = useState<State<PreBurnType>>(Stator.pending())
  const [onProgressBarFocus, setOnProgressBarFocus] = useState(false)

  const checkIsInsufficientBalance = useCallback(
    () => addressCurrentBalance?.data !== undefined && amount !== undefined && amount > addressCurrentBalance.data,
    [addressCurrentBalance?.data, amount],
  )

  const onFetchBurnAmount = useCallback(async () => {
    if (
      vtInversifyService &&
      address &&
      selectedMinute &&
      !checkIsInsufficientBalance() &&
      globalEventsInversifyService &&
      amount !== undefined
    ) {
      try {
        setPreBurn(Stator.pending())

        const preBurnDetails = await vtInversifyService.preBurn(amount, selectedMinute * 60)
        setOnProgressBarFocus(true)
        setPreBurn(
          Stator.resolve({
            netBurnAmount: preBurnDetails.netBurnAmount,
            expectedUSDCAmount: preBurnDetails.expectedUSDCAmount,
            closeFee: preBurnDetails.closeFee,
            timeWindowFee: preBurnDetails.timeWindowFee,
            keepersFee: preBurnDetails.keepersFee,
          }),
        )
      } catch (error) {
        globalEventsInversifyService.eventEmitter.emit('errors', error)
        setPreBurn(Stator.reject(undefined, error))
      }
    }
  }, [address, amount, checkIsInsufficientBalance, globalEventsInversifyService, selectedMinute, vtInversifyService])

  const debouncedNetBurnAmount = useMemo(() => debounce(onFetchBurnAmount, 300), [onFetchBurnAmount])

  useEffect(() => {
    if (onProgressBarFocus === false) {
      setPreBurn(Stator.pending())
    }
  }, [onProgressBarFocus])

  useEffect(() => {
    debouncedNetBurnAmount()
    return () => {
      debouncedNetBurnAmount.cancel()
    }
  }, [address, amount, debouncedNetBurnAmount, checkIsInsufficientBalance, selectedMinute, vtInversifyService])

  useEffect(() => {
    let cleanup = true

    if (vtInversifyService) {
      const getMinMaxPeriod = async () => {
        if (cleanup) {
          const timeWindow = await vtInversifyService.getTimeWindow()
          const minTimeWindow = timeWindow.minTimeWindow / 60
          const maxTimeWindow = timeWindow.maxTimeWindow / 60
          const list = [...new Array(maxTimeWindow + 1 - minTimeWindow)].map((minute, index) => index + minTimeWindow)
          setMinutesList(list)
          setSelectedMinute(list[list.length - 1])
        }
      }

      getMinMaxPeriod()
    }
    return () => {
      cleanup = false
    }
  }, [vtInversifyService])

  useEffect(() => {
    let shouldUpdate = true

    if (address && vtInversifyService) {
      const getCviX2Approved = async () => {
        vtInversifyService
          .getApproveCviX2(address)
          .then(data => {
            if (shouldUpdate) {
              setApprovedCviX2(data)
            }
          })
          .catch(error => {
            throw new Error(error)
          })
      }

      getCviX2Approved()
    }

    return () => {
      shouldUpdate = false
    }
  }, [address, vtInversifyService, isLoading])

  function ShowSumbitButton() {
    if (!address) {
      return <ConnectButton type="form" />
    }

    const approveButton = (
      <Button
        type="approve"
        title="approve cvi"
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (!globalEventsInversifyService || !vtInversifyService) {
            return
          }
          try {
            setIsLoading(true)
            await vtInversifyService.approveCviX2()
          } catch (error) {
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={isLoading || !globalEventsInversifyService || !vtInversifyService}
      />
    )

    const notEnoughFunds =
      addressCurrentBalance.data === undefined ||
      addressCurrentBalance.data === 0 ||
      !amount ||
      amount > addressCurrentBalance.data

    const turnOofNotifications = preBurn.data?.expectedUSDCAmount === undefined || amount === undefined ? false : true

    const submitButton = (
      <Button
        type="submit"
        title={amount === undefined ? 'enter amount' : 'submit'}
        disabled={!onProgressBarFocus || isLoading || notEnoughFunds || minutesList.length === 0}
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (window.gtag) {
            window.gtag('event', 'burn_request-started', {
              page_title: 'burn_request_started',
              burn_title: 'Burn request started',
              description: 'User click on burn button',
              page_path: window.location.pathname,
            })
          }
          if (
            !globalEventsInversifyService ||
            !vtInversifyService ||
            amount === undefined ||
            !vtContractsEventsInversifyService
          ) {
            return
          }
          try {
            setIsLoading(true)
            let tx = undefined
            if (isMaxClicked && addressCurrentBalance.data !== undefined && addressCurrentBalance.data === amount) {
              await vtInversifyService.submitFullBurnRequest(selectedMinute * 60)
            } else {
              tx = await vtInversifyService.submitBurnRequest(amount, selectedMinute * 60)
              if (turnOofNotifications) {
                displayNotification({
                  id: `${tx !== undefined ? `pending-${tx?.receipt.transactionHash}` : 'pending'}`,
                  title: 'pending',
                  type: 'info',
                  message: `Submitting request to burn ${amount} CVI  for ${
                    preBurn.data?.expectedUSDCAmount
                      ? catDecimalsNoRoundUp(preBurn.data?.expectedUSDCAmount, 4)
                      : preBurn.data?.expectedUSDCAmount
                  } USDC`,
                  content: CustomNotification,
                })
              }
            }
            vtContractsEventsInversifyService.emitPendingRequestTableInfoEvents(address)
            if (!isLoading && turnOofNotifications) {
              displayNotification({
                id: `${tx?.receipt.transactionHash}`,
                title: 'completed',
                type: 'success',
                message: `The request to burn ${amount} CVI for ${
                  preBurn.data?.expectedUSDCAmount
                    ? catDecimalsNoRoundUp(preBurn.data?.expectedUSDCAmount, 4)
                    : preBurn.data?.expectedUSDCAmount
                } USDC was submitted successfully`,
                content: CustomNotification,
              })
            }
            vtInversifyService.emitBurnBalanceEvent(address)
            if (window.gtag) {
              window.gtag('event', 'burn_request_successed', {
                page_title: 'burn_request_successed',
                burn_title: 'Successful - Submitting request to burn',
                description: 'The transaction successed',
                page_path: window.location.pathname,
              })
            }
          } catch (error) {
            if (error.message.includes('User denied transaction signature')) {
              if (window.gtag) {
                window.gtag('event', 'burn_transaction_denied', {
                  page_title: 'burn_transaction_denied',
                  burn_denied_title: 'Fail - Denied request to burn',
                  description: 'User denied the transaction on the wallet',
                  page_path: window.location.pathname,
                })
              }
              displayNotification({
                id: 'burnCancelled',
                title: 'failed',
                type: 'danger',
                message: `Transaction was cancelled`,
                content: CustomNotification,
              })
            } else {
              if (window.gtag) {
                window.gtag('event', 'burn_transaction_fail', {
                  page_title: 'burn_transaction_fail',
                  burn_fail_title: 'Fail - Failed to submit request to burn',
                  description: 'The transaction failed',
                  page_path: window.location.pathname,
                })
              }

              if (turnOofNotifications) {
                displayNotification({
                  id: 'burnFailed',
                  title: 'failed',
                  type: 'danger',
                  message: `Failed to submit the request to burn ${amount} CVI for ${
                    preBurn.data?.expectedUSDCAmount
                      ? catDecimalsNoRoundUp(preBurn.data?.expectedUSDCAmount, 4)
                      : preBurn.data?.expectedUSDCAmount
                  } USDC`,
                  content: CustomNotification,
                })
              }
            }
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setAmount(undefined)
            setIsLoading(false)
            vtInversifyService.emitCollateralRatioEvent()
          }
        }}
      />
    )

    if (
      approvedCviX2 !== undefined &&
      ((amount !== undefined && approvedCviX2 < amount) || (amount === undefined && approvedCviX2 === 0))
    ) {
      return approveButton
    }

    return submitButton
  }

  const displayNetBurnAmount = () =>
    amount === undefined || checkIsInsufficientBalance() ? (
      '-'
    ) : (
      <DisplayNumber
        state={preBurn.status === 'rejected' ? Stator.resolve(0) : Stator.map(preBurn, d => d.netBurnAmount)}
        tokenName={TokenName.CVI}
        className="text-sm"
        tokenNameClassName="font-bold"
        millify
        withTooltip
      />
    )

  const tooltipFragment = (fee: State<number | undefined> | State<number | false>, feeTitle: string) => {
    return (
      <span className={classNames({ 'flex flex-row justify-between ': true, hidden: fee.data === 0 })}>
        <span className="whitespace-normal mr-2">{feeTitle}</span>
        <span className="flex flex-row">
          {preBurn.status === 'resolved' && fee.data !== undefined && fee.data > Stator.resolve(0).data ? '-' : ''}
          <DisplayNumber
            state={fee}
            tokenName={TokenName.CVI}
            tokenNameClassName="font-normal"
            minimizeLessThan0_000001={true}
          />
        </span>
      </span>
    )
  }

  const burnFeeTooltipDescription = () => {
    const isAmountEmpty = amount === 0 || amount === undefined ? true : false

    const closeFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preBurn.data !== undefined ? preBurn.data.closeFee : 0)
    const timeWindowFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preBurn.data !== undefined ? preBurn.data.timeWindowFee : 0)
    const keepersFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preBurn.data !== undefined ? preBurn.data.keepersFee : 0)

    return (
      <ReactTooltip
        id="netBurnAmountTip"
        place="top"
        effect="solid"
        data-html={true}
        insecure={true}
        multiline={true}
        className="default-react-tooltip-style "
        delayHide={0}
      >
        <span className="flex flex-col gap-2 py-2 text-sm ">
          <span className="flex flex-row justify-between ">
            <span className="whitespace-normal mr-2">Amount</span>
            <DisplayNumber
              state={Stator.resolve(amount !== undefined ? amount : 0)}
              tokenName={TokenName.CVI}
              tokenNameClassName="font-normal"
            />
          </span>
          {tooltipFragment(closeFee, 'Burn fee')}
          {tooltipFragment(timeWindowFee, 'Expedite fee')}
          {tooltipFragment(keepersFee, 'Keepers fee')}

          <hr className="border border-dark-300 " />
          <span className="flex flex-row justify-between">
            <span className="whitespace-normal mr-2">Net burn amount</span>
            <span>{displayNetBurnAmount()}</span>
          </span>
        </span>
      </ReactTooltip>
    )
  }

  return (
    <>
      <span>
        <InputAmount
          typeOfBalance={TokenName.CVOL}
          userBalance={addressCurrentBalance}
          customDecimalUserBalance={6}
          fromWhereThisPageInput="burn"
          setIsMaxClicked={setIsMaxClicked}
          value={amount}
          setValue={setAmount}
          fractionDigits={tokenDecimals[TokenName.CVI]}
          maxBalanceTitle="Max"
          maxBalance={addressCurrentBalance.data}
          custompPaceholder="Enter amount"
          customTitle="Enter Amount"
          customTitleSize="text-lg"
          className={classNames({
            'outline outline-2 outline-common-lightRed': checkIsInsufficientBalance(),
            // 'opacity-70 pointer-events-none': !address,
          })}
          autoFocus
          type={TokenName.CVI}
        />

        {/* <span
          className={classNames({
            'text-xs mr-1 flex flex-row gap-1 mt-2': true,
            'text-xs text-common-lightRed': checkIsInsufficientBalance(),
          })}
        >
          Your available balance:
          {!address ? (
            ''
          ) : (
            <DisplayNumber
              state={Stator.resolve(addressCurrentBalance.data)}
              tokenName={TokenName.CVI}
              className={classNames({ 'font-bold text-xs': true })}
              tokenNameClassName="font-normal"
              millify
              withTooltip
            />
          )}
        </span> */}
      </span>
      <TimeToFulfillmentProgressBar
        selectedMinute={selectedMinute}
        setSelectedMinute={setSelectedMinute}
        setOnProgressBarFocus={setOnProgressBarFocus}
      />

      <span className="flex flex-col gap-4">
        <span className="flex flex-row justify-between">
          <span className="flex flex-row  gap-1 text-common-lightGray text-xs">
            Net burn amount{' '}
            <span data-tip data-for="netBurnAmountTip">
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>{' '}
            {burnFeeTooltipDescription()}
          </span>
          {displayNetBurnAmount()}
        </span>

        <span className="flex flex-row justify-between">
          <span className="flex flex-row  gap-1 text-common-lightGray  text-xs">
            Expected number of tokens{' '}
            <span data-tip data-for="burnExpectedNumberOfTokensTip">
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>
            <ReactTooltip
              id="burnExpectedNumberOfTokensTip"
              place="bottom"
              effect="solid"
              data-html={true}
              insecure={true}
              multiline={true}
              className="default-react-tooltip-style "
              delayHide={0}
            >
              The number of USDC tokens displayed is an estimated amount you will receive after your request is
              fulfilled. Please note that fulfilling your request prior to the specified target time will incur an early
              fulfillment fee that will reduce the amount of USDC tokens you will receive
            </ReactTooltip>
          </span>
          {amount === undefined || checkIsInsufficientBalance() ? (
            '-'
          ) : (
            <DisplayNumber
              state={preBurn.status === 'rejected' ? Stator.resolve(0) : Stator.map(preBurn, d => d.expectedUSDCAmount)}
              tokenName={TokenName.USDC}
              className="text-sm"
              millify
              withTooltip
            />
          )}
        </span>
      </span>
      <div className="w-full">{!address ? <ConnectButton type="form" /> : <ShowSumbitButton />}</div>
    </>
  )
}

export default Burn
