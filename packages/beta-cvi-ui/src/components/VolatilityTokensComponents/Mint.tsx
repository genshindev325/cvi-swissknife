import type { State } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import { TokenName } from '@coti-cvi/lw-sdk'
import { Stator, tokenDecimals } from '@coti-cvi/lw-sdk'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import classNames from 'classnames'
import type { FC } from 'react'
import { useRef } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import React, { useState } from 'react'
import InputAmount from '../InputAmount/InputAmount'

import Button from '../Button/Button'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import SlippageSelect from '../SlippageSelect/SlippageSelect'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import ConnectButton from '../NavbarButtons/ConnectButton'
import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import debounce from 'lodash/debounce'
import TimeToFulfillmentProgressBar from './TimeToFulfillmentProgressBar'
import ReactTooltip from 'react-tooltip'
import { displayNotification } from 'beta-cvi-ui/src/utils/utilities'
import CustomNotification from '../CustomNotification'
import useOnClickOutside from 'beta-cvi-ui/src/hooks/useOnClickOutside'
import { useAddress } from '../../hooks/use-address'
import usePromise from 'react-use-promise'

type Props = {
  amount: number | undefined
  setAmount: React.Dispatch<React.SetStateAction<number | undefined>>
}

type PreMintType = {
  netMintAmount: number
  expectedVolTokensAmount: number
  openPositionFee: number
  buyingPremiumFee: number
  timeWindowFee: number
  keepersFee: number
}

const MAX_UTILIZATION_ALLOWED = 35

const Mint: FC<Props> = ({ amount, setAmount }) => {
  const { address } = useAddress()

  const maxMintAmountAccordingToFreeLiquidity = useAppSelector(state => state.state.cvi.volatilityToken.maxMintAmount)
  const tvUtilizationPercentage = useAppSelector(state => state.state.cvi.tv.tvUtilizationPercentage)
  const userBalance = useAppSelector(state => state.state.cvi.volatilityToken.Balance)
  const [slippage, setSlippage] = useState(0.1)
  const [isOpen, setIsOpen] = useState(false)
  const [approvedUsdc, setApprovedUsdc] = useState<number>()
  const { globalEventsInversifyService, vtInversifyService, vtContractsEventsInversifyService } =
    useTvInversifyServices()
  const [isLoading, setIsLoading] = useState(false)
  const [minutesList, setMinutesList] = useState<number[]>([])
  const [selectedMinute, setSelectedMinute] = useState<number>(0)
  const [preMint, setPreMint] = useState<State<PreMintType>>(Stator.pending())
  const [onProgressBarFocus, setOnProgressBarFocus] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const handleOutsideModal = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }

  const [estimatedNewUtilization] = usePromise(
    async () => (amount === undefined ? undefined : vtInversifyService?.predictUtilizationPercentageAfterMint(amount)),
    [amount, vtInversifyService],
  )

  const insufficientLiquidity =
    maxMintAmountAccordingToFreeLiquidity.data &&
    amount !== undefined &&
    amount > maxMintAmountAccordingToFreeLiquidity.data

  const utilizationTooHigh =
    (estimatedNewUtilization !== undefined && estimatedNewUtilization >= MAX_UTILIZATION_ALLOWED) ||
    (tvUtilizationPercentage !== undefined &&
      tvUtilizationPercentage.data !== undefined &&
      tvUtilizationPercentage.data >= MAX_UTILIZATION_ALLOWED)

  useOnClickOutside(modalRef, handleOutsideModal)

  const checkIsInsufficientBalance = useCallback(
    () => userBalance.data !== undefined && amount !== undefined && amount > userBalance.data,
    [amount, userBalance.data],
  )

  const onFetchMintAmount = useCallback(async () => {
    if (
      vtInversifyService &&
      address &&
      selectedMinute &&
      !checkIsInsufficientBalance() &&
      globalEventsInversifyService &&
      amount !== undefined
    ) {
      try {
        setPreMint(Stator.pending())

        const preMintDetails = await vtInversifyService.preMint(amount, selectedMinute * 60)
        setOnProgressBarFocus(true)
        setPreMint(
          Stator.resolve({
            netMintAmount: preMintDetails.netMintAmount,
            expectedVolTokensAmount: preMintDetails.expectedVolTokensAmount,
            openPositionFee: preMintDetails.openPositionFee,
            buyingPremiumFee: preMintDetails.buyingPremiumFee,
            timeWindowFee: preMintDetails.timeWindowFee,
            keepersFee: preMintDetails.keepersFee,
          }),
        )
      } catch (error) {
        globalEventsInversifyService.eventEmitter.emit('errors', error)
        setPreMint(Stator.reject(undefined, error))
      }
    }
  }, [address, amount, checkIsInsufficientBalance, globalEventsInversifyService, selectedMinute, vtInversifyService])

  const debouncedNetMintAmount = useMemo(() => debounce(onFetchMintAmount, 300), [onFetchMintAmount])

  useEffect(() => {
    if (onProgressBarFocus === false) {
      setPreMint(Stator.pending())
    }
  }, [onProgressBarFocus])

  useEffect(() => {
    debouncedNetMintAmount()
    return () => {
      debouncedNetMintAmount.cancel()
    }
  }, [address, amount, debouncedNetMintAmount, checkIsInsufficientBalance, selectedMinute, vtInversifyService])

  useEffect(() => {
    let cleanup = true

    if (vtInversifyService) {
      const getMinMaxPeriod = async () => {
        if (cleanup) {
          const timeWindow = await vtInversifyService.getTimeWindow()
          const minTimeWindow = timeWindow.minTimeWindow / 60
          const maxTimeWindow = timeWindow.maxTimeWindow / 60
          const list = [...new Array(maxTimeWindow + 1 - minTimeWindow)].map((_, index) => index + minTimeWindow)

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
      const getUsdcApproved = async () => {
        vtInversifyService?.getApproveUsdc(address).then(data => {
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
  }, [address, vtInversifyService, isLoading])

  useEffect(() => {
    if (!isOpen && slippage === 0) {
      setSlippage(0.1)
    }
  }, [isOpen, slippage])

  function ShowSumbitButton() {
    if (!address) {
      return <ConnectButton type="form" />
    }

    const approveButton = (
      <Button
        type="approve"
        title="approve usdc"
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (!globalEventsInversifyService || !vtInversifyService) {
            return
          }
          try {
            setIsLoading(true)
            await vtInversifyService.approveUsdc()
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
      userBalance.data === undefined || userBalance.data === 0 || !amount || amount > userBalance.data || amount === 0
    const turnOofNotifications =
      preMint.data?.expectedVolTokensAmount === undefined || amount === undefined ? false : true
    const submitButton = (
      <Button
        type="submit"
        title={amount === undefined ? 'enter amount' : 'submit'}
        disabled={
          !onProgressBarFocus ||
          insufficientLiquidity ||
          isLoading ||
          notEnoughFunds ||
          minutesList.length === 0 ||
          utilizationTooHigh ||
          estimatedNewUtilization === undefined
        }
        status={isLoading ? 'pending' : 'resolved'}
        onClick={async () => {
          if (window.gtag) {
            window.gtag('event', 'mint_request_started', {
              page_title: 'mint_request_started',
              mint_title: 'Mint request started',
              description: 'User click on mint button',
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

            const tx = await vtInversifyService.submitMintRequest(amount, selectedMinute * 60, slippage)

            if (turnOofNotifications) {
              displayNotification({
                id: `${tx !== undefined ? `pending-${tx?.receipt.transactionHash}` : 'pending'}`,
                title: 'pending',
                type: 'info',
                message: `Submitting request to mint ${
                  preMint.data?.expectedVolTokensAmount
                    ? catDecimalsNoRoundUp(preMint.data?.expectedVolTokensAmount, 4)
                    : preMint.data?.expectedVolTokensAmount
                } CVI for ${amount} USDC`,
                content: CustomNotification,
              })
            }

            await vtContractsEventsInversifyService.emitPendingRequestTableInfoEvents(address)

            if (!isLoading && turnOofNotifications) {
              displayNotification({
                id: `${tx?.receipt.transactionHash}`,
                title: 'completed',
                type: 'success',
                message: `The request to mint ${
                  preMint.data?.expectedVolTokensAmount
                    ? catDecimalsNoRoundUp(preMint.data?.expectedVolTokensAmount, 4)
                    : preMint.data?.expectedVolTokensAmount
                } CVI for  ${amount} USDC was submitted successfully`,
                content: CustomNotification,
              })
            }
            // update the max amount after minting
            vtInversifyService.emitMaxMintAmountEvent()
            vtInversifyService.emitBalanceEvent(address)

            if (window.gtag) {
              window.gtag('event', 'mint_request_successed', {
                page_title: 'mint_request_successed',
                mint_title: 'Successful - Submitting request to mint',
                description: 'The transaction successed',
                page_path: window.location.pathname,
              })
            }
          } catch (error) {
            if (error.message.includes('User denied transaction signature')) {
              if (window.gtag) {
                window.gtag('event', 'mint_transaction_denied', {
                  page_title: 'mint_transaction_denied',
                  mint_denied_title: 'Fail - Denied request to mint',
                  description: 'User denied the transaction on the wallet',
                  page_path: window.location.pathname,
                })
              }

              displayNotification({
                id: 'mintCancelled',
                title: 'failed',
                type: 'danger',
                message: `Transaction was cancelled`,
                content: CustomNotification,
              })
            } else {
              if (window.gtag) {
                window.gtag('event', 'mint_transaction_fail', {
                  page_title: 'mint_transaction_fail',
                  mint_fail_title: 'Fail - Failed to submit request to mint',
                  description: 'The transaction failed',
                  page_path: window.location.pathname,
                })
              }
              if (turnOofNotifications) {
                displayNotification({
                  id: 'mintFailed',
                  title: 'failed',
                  type: 'danger',
                  message: `Failed to submit the request to mint ${
                    preMint.data?.expectedVolTokensAmount
                      ? catDecimalsNoRoundUp(preMint.data?.expectedVolTokensAmount, 4)
                      : preMint.data?.expectedVolTokensAmount
                  } CVI for ${amount} USDC`,
                  content: CustomNotification,
                })
              }
            }
            globalEventsInversifyService.eventEmitter.emit('errors', error)
          } finally {
            setAmount(undefined)
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

  const displayNetMintAmount = () =>
    amount === undefined || checkIsInsufficientBalance() ? (
      '-'
    ) : (
      <DisplayNumber
        state={Stator.map(preMint, d => d.netMintAmount)}
        tokenName={TokenName.USDC}
        className="text-sm"
        tokenNameClassName="font-bold"
        millify
        withTooltip
      />
    )

  const tooltipFragment = (fee: State<number | undefined> | State<number | false>, feeTitle: string) => (
    <span className={classNames({ 'flex flex-row justify-between ': true, hidden: fee.data === 0 })}>
      <span className="whitespace-normal mr-2">{feeTitle}</span>
      <span className="flex flex-row">
        {preMint.status === 'resolved' && fee.data !== undefined && fee.data > Stator.resolve(0).data ? '-' : ''}
        <DisplayNumber state={fee} tokenName={TokenName.USDC} tokenNameClassName="font-normal" />
      </span>
    </span>
  )

  const mintFeeTooltipDescription = () => {
    const isAmountEmpty = amount === 0 || amount === undefined ? true : false

    const keppersFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preMint.data !== undefined ? preMint.data.keepersFee : 0)
    const openPositionFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preMint.data !== undefined ? preMint.data.openPositionFee * 2 : 0)
    const timeWindowFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preMint.data !== undefined ? preMint.data.timeWindowFee : 0)
    const buyingPremiumFee = isAmountEmpty
      ? Stator.resolve(0)
      : Stator.resolve(preMint.data !== undefined ? preMint.data.buyingPremiumFee - preMint.data.openPositionFee : 0)

    return (
      <ReactTooltip
        id="netMintAmountTip"
        place="top"
        effect="solid"
        multiline={true}
        className="default-react-tooltip-style "
        delayHide={0}
      >
        <span className="flex flex-col gap-2 py-2  text-sm ">
          <span className="flex flex-row justify-between ">
            <span className="whitespace-normal mr-2">Amount</span>
            <DisplayNumber
              state={Stator.resolve(amount !== undefined ? amount : 0)}
              tokenName={TokenName.USDC}
              tokenNameClassName="font-normal"
            />
          </span>

          {tooltipFragment(openPositionFee, 'Mint fee')}
          {tooltipFragment(timeWindowFee, 'Expedite fee')}
          {tooltipFragment(buyingPremiumFee, 'Buy premium fee')}
          {tooltipFragment(keppersFee, 'Keepers fee')}

          <hr className="border border-dark-300 " />
          <span className="flex flex-row justify-between">
            <span className="whitespace-normal mr-2">Net mint amount</span>
            <span>{displayNetMintAmount()}</span>
          </span>
        </span>
      </ReactTooltip>
    )
  }

  return (
    <>
      <span>
        <InputAmount
          typeOfBalance={TokenName.USDC}
          userBalance={userBalance}
          customDecimalUserBalance={2}
          fromWhereThisPageInput="mint"
          value={amount}
          setValue={setAmount}
          fractionDigits={tokenDecimals.USDC}
          maxBalanceTitle="Max"
          maxBalance={userBalance.data}
          custompPaceholder="Enter amount"
          customTitle="Enter Amount"
          customTitleSize="text-lg"
          className={classNames({
            'outline outline-2 outline-common-lightRed ':
              checkIsInsufficientBalance() || insufficientLiquidity || utilizationTooHigh,
            // 'opacity-70 pointer-events-none': !address,
          })}
          maxValues={[
            // {
            //   value: userBalance.data,
            //   errorMessage: <span className="text-common-lightRed text-xs">Not enough balance</span>,
            // },
            {
              value: maxMintAmountAccordingToFreeLiquidity.data,
              errorMessage: (
                <span className="text-common-lightRed text-xs">
                  A maximum of{' '}
                  <b>
                    {maxMintAmountAccordingToFreeLiquidity.data &&
                      catDecimalsNoRoundUp(maxMintAmountAccordingToFreeLiquidity.data, 4)}
                  </b>{' '}
                  USDC can be minted.
                </span>
              ),
            },

            {
              value:
                utilizationTooHigh &&
                amount &&
                maxMintAmountAccordingToFreeLiquidity &&
                maxMintAmountAccordingToFreeLiquidity.data &&
                maxMintAmountAccordingToFreeLiquidity.data > amount
                  ? amount - 0.0001
                  : undefined,
              errorMessage: <span className="text-common-lightRed text-xs">Mint amount is too high</span>,
            },
          ]}
          autoFocus
          type={TokenName.USDC}
        />
      </span>

      <TimeToFulfillmentProgressBar
        selectedMinute={selectedMinute}
        setSelectedMinute={setSelectedMinute}
        setOnProgressBarFocus={setOnProgressBarFocus}
      />

      <span className="flex flex-col gap-4">
        <span className="flex flex-row justify-between">
          <span className="flex flex-row  gap-1 text-common-lightGray text-xs">
            Net mint amount{' '}
            <span data-tip data-for="netMintAmountTip">
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>
            {mintFeeTooltipDescription()}
          </span>
          {displayNetMintAmount()}
        </span>
        <span className="relative" ref={modalRef}>
          <span className="flex flex-row justify-between">
            <span className="flex flex-row  gap-1 text-common-lightGray text-xs">
              Slippage tolerance{' '}
              <span data-tip data-for="SlippageToleranceTip">
                <GetSvg svgName="tooltip" className=" cursor-pointer" />
              </span>
              <ReactTooltip
                id="SlippageToleranceTip"
                place="bottom"
                effect="solid"
                data-html={true}
                insecure={true}
                multiline={true}
                className="default-react-tooltip-style "
                delayHide={0}
              >
                Your transaction will revert if the price of the premium changes unfavorably by more than this
                percentage.
              </ReactTooltip>
            </span>
            <button
              onClick={() => {
                if (window.gtag) {
                  window.gtag('event', 'slippage_started', {
                    page_title: 'slippage_started',
                    slippage_title: 'slippage clicked started',
                    description: 'User click on slippage button',
                    page_path: window.location.pathname,
                  })
                }
                setIsOpen(!isOpen)
              }}
            >
              <b className="text-sm flex gap-1 items-center">
                {`${slippage}%`}
                <GetSvg svgName="editIcon" />
              </b>
            </button>
          </span>
          <span className="absolute z-50 w-full -left-7 stiny:left-16 sm:left-42 md:left-56 lg:left-0 top-8">
            {isOpen && (
              <SlippageSelect slippage={slippage} setSlippage={setSlippage} setIsOpen={setIsOpen} isOpen={isOpen} />
            )}
          </span>
        </span>
        <span className="flex flex-row justify-between">
          <span className="flex flex-row  gap-1 text-common-lightGray text-xs">
            Expected number of tokens{' '}
            <span data-tip data-for="mintExpectedNumberOfTokensTip">
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>
            <ReactTooltip
              id="mintExpectedNumberOfTokensTip"
              place="bottom"
              effect="solid"
              data-html={true}
              insecure={true}
              multiline={true}
              className="default-react-tooltip-style "
              delayHide={0}
            >
              The number of CVI tokens displayed is an estimated amount you will receive after your request is
              fulfilled. Please note that fulfilling your request prior to the specified target time will incur an early
              fulfillment fee that will reduce the amount of CVI tokens you will receive
            </ReactTooltip>
          </span>
          {amount === undefined || checkIsInsufficientBalance() ? (
            '-'
          ) : (
            <DisplayNumber
              state={Stator.map(preMint, d => d.expectedVolTokensAmount)}
              tokenName={TokenName.CVI}
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

export default Mint
