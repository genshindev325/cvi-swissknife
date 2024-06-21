import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
// import { MODE } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { PendingRequestKeys } from 'beta-cvi-ui/src/types/common.types'
import { PendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import { FullTableSizeTr } from '../../FullTableSizeTr/FullTableSizeTr'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import '../../../styles/globals.scss'
import { actions, useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux'
import type { PendingFeeTableRowType } from '../../../../../lw-sdk/src'
import { Stator, TokenName } from '../../../../../lw-sdk/src'
import { format } from 'date-fns'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import { useTvInversifyServices } from '../../../hooks/useTvInversifyServices'
import Button from '../../Button/Button'
import CountDownTimer from '../../CountDownTimer'
import ReactTooltip from 'react-tooltip'

type Props = {
  id: number

  rowData: PendingFeeTableRowType
}

const PendingRequestRow: FC<Props> = ({ id, rowData }) => {
  const dispatch = useAppDispatch()
  const mintBurnModal = useAppSelector(state => state.state.mintBurnModal)
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { vtInversifyService } = useTvInversifyServices()
  const [minWaitTime, setMinWaitTime] = useState<number | undefined>()
  const latestBlock = useAppSelector(state => state.state.latestBlock)
  const [lockReceiveButton, setLockReceivebutton] = useState(true)

  const onMintOrBurn = (id: number, title: 'mint' | 'burn') => {
    if (window.gtag) {
      window.gtag('event', 'receive_now_table', {
        page_title: 'receive_now_table',
        pending_request_title: `Click on receive now - ${title}`,
        description: `The user clicked on the receive now button on the table to receive ${title} `,
        page_path: window.location.pathname,
      })
    }
    dispatch(
      actions.setMintBurnModal({
        modalIsOpen: true,
        title: title,
        id: id,
      }),
    )
  }

  useEffect(() => {
    if (latestBlock.data !== undefined && rowData.request.args.targetTimestamp < latestBlock.data?.timestamp) {
      dispatch(
        actions.setMintBurnModal({
          modalIsOpen: false,
        }),
      )
    }
  }, [dispatch, latestBlock.data, rowData.request.args.targetTimestamp])

  useEffect(() => {
    let shouldUpdate = true

    if (vtInversifyService) {
      const getMinTimeToWait = async () => {
        vtInversifyService
          ?.getMinWaitTime()
          .then(data => {
            if (shouldUpdate) {
              setMinWaitTime(data)
            }
          })
          .catch(error => {
            throw new Error(`${error} - from getMinTimeToWait function`)
          })
      }
      getMinTimeToWait()
    }
    return () => {
      shouldUpdate = false
    }
  }, [vtInversifyService])

  useEffect(() => {
    if (
      mintBurnModal !== undefined &&
      mintBurnModal.modalIsOpen === false &&
      mintBurnModal.clickReceiveFromModal === true
    ) {
      setLockReceivebutton(true)
      dispatch(
        actions.setMintBurnModal({
          modalIsOpen: false,
          clickReceiveFromModal: false,
        }),
      )
    }
  }, [dispatch, mintBurnModal])

  useEffect(() => {
    if (
      (minWaitTime !== undefined &&
        latestBlock.data !== undefined &&
        latestBlock.data?.timestamp <= rowData.request.args.requestTimestamp + minWaitTime) ||
      ('extraMint' in rowData && (rowData.extraMint.insufficientLiquidity || rowData.extraMint.insufficientSlippage))
    ) {
      setLockReceivebutton(true)
    } else if (
      minWaitTime !== undefined &&
      latestBlock.data !== undefined &&
      latestBlock.data?.timestamp > rowData.request.args.requestTimestamp + minWaitTime
    ) {
      setLockReceivebutton(false)
    }
  }, [latestBlock.data, latestBlock.data?.timestamp, minWaitTime, rowData, rowData.request.args.requestTimestamp])

  const mintBurnFeeTooltipDescription = () => {
    const submitAmount = Stator.resolve(rowData.request.args.tokenAmountPaid)

    const submitFee = Stator.resolve(rowData.request.args.submitFeesAmount)

    const mintFee = Stator.resolve('extraMint' in rowData ? rowData.extraMint.openPositionFee * 2 : 0)
    const burnFee = Stator.resolve('extraBurn' in rowData ? rowData.extraBurn.closeFee : 0)
    const mintOrBurnFee = rowData.requestType === 2 ? burnFee : mintFee

    const buyPremiumFee = Stator.resolve(
      'extraMint' in rowData ? rowData.extraMint.buyingPremiumFee - rowData.extraMint.openPositionFee : 0,
    )

    const mintPenaltyFee = Stator.resolve('extraMint' in rowData ? rowData.extraMint.timePenaltyFee : 0)
    const burnPenaltyFee = Stator.resolve('extraBurn' in rowData ? rowData.extraBurn.timePenaltyFee : 0)
    const timePenaltyFee = rowData.requestType === 2 ? burnPenaltyFee : mintPenaltyFee

    const mintKeepersFee = Stator.resolve('extraMint' in rowData ? rowData.extraMint.keepersFee : 0)
    const burnKeepersFee = Stator.resolve('extraBurn' in rowData ? rowData.extraBurn.keepersFee : 0)
    const keepersFee = rowData.requestType === 2 ? burnKeepersFee : mintKeepersFee

    const netAmount = Stator.resolve(
      'extraMint' in rowData ? rowData.extraMint.netMintAmount : rowData.extraBurn.netBurnAmount,
    )
    return (
      <ReactTooltip
        id={`${id}netPendingAmountTip`}
        place="top"
        effect="solid"
        data-html={true}
        insecure={true}
        multiline={true}
        className="default-react-tooltip-style "
        delayHide={0}
      >
        <span className="flex flex-col gap-2  py-2 text-sm ">
          <span className="flex flex-row justify-between ">
            <span className="whitespace-normal mr-2">Amount</span>
            <DisplayNumber
              state={submitAmount}
              tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
              tokenNameClassName="font-normal"
              customDecimal={6}
            />
          </span>
          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: submitFee.data === 0 })}>
            <span className="whitespace-normal mr-2">Expedite fee</span>
            <span className="flex flex-row">
              {submitFee.data !== undefined && submitFee.data > Stator.resolve(0).data ? '-' : ''}
              <DisplayNumber
                state={submitFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>
          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: mintOrBurnFee.data === 0 })}>
            <span>{rowData.requestType === 1 ? 'Mint ' : 'Burn '}fee</span>
            <span className="flex flex-row">
              {mintOrBurnFee.data !== undefined && mintOrBurnFee.data > Stator.resolve(0).data ? '-' : ''}
              <DisplayNumber
                state={mintOrBurnFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>

          <span
            className={classNames({
              'flex flex-row justify-between ': true,
              hidden: buyPremiumFee.data === 0 || rowData.requestType === 2,
            })}
          >
            <span className="whitespace-normal mr-2">Buy premium fee</span>
            <span className="flex flex-row">
              {buyPremiumFee.data !== undefined && buyPremiumFee.data > Stator.resolve(0).data ? '-' : ''}
              <DisplayNumber
                state={buyPremiumFee}
                tokenName={TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>

          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: timePenaltyFee.data === 0 })}>
            <span className="whitespace-normal mr-2">Early fulfillment fee</span>
            <span className="flex flex-row">
              {timePenaltyFee.data !== undefined && timePenaltyFee.data > Stator.resolve(0).data ? '-' : ''}
              <DisplayNumber
                state={timePenaltyFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>

          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: keepersFee.data === 0 })}>
            <span className="whitespace-normal mr-2">Keepers fee</span>
            <span className="flex flex-row">
              {keepersFee.data !== undefined && keepersFee.data > Stator.resolve(0).data ? '-' : ''}
              <DisplayNumber
                state={keepersFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>

          <hr className="border border-dark-300 " />
          <span className="flex flex-row justify-between">
            <span className="whitespace-normal mr-2 ">{rowData.requestType === 1 ? 'Mint ' : 'Burn '} amount</span>
            <DisplayNumber
              state={netAmount}
              tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
              className="text-sm"
              tokenNameClassName="font-normal"
              millify
              withTooltip
            />
          </span>
        </span>
      </ReactTooltip>
    )
  }

  const getTd = (type: PendingRequestKeys | 'button') => {
    switch (type) {
      case 'type': {
        return <span>{rowData.requestType === 1 ? 'Mint' : 'Burn'}</span>
      }

      case 'submit_time': {
        return (
          <span className="flex flex-wrap">
            {format(new Date(rowData.request.args.requestTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
          </span>
        )
      }

      case 'amount': {
        return (
          <span className="flex flex-col ">
            <span className="flex  justify-between sm:justify-start flex-row gap-6  items-center">
              <span className="text-11 text-common-lightGray w-14 ">Submitted</span>
              <span className="text-sm w-28 sm:w-fit ">
                <DisplayNumber
                  state={Stator.resolve(rowData.request.args.tokenAmountPaid)}
                  tokenName={rowData.request.args.requestType === 1 ? TokenName.USDC : TokenName.CVI}
                  tokenNumberClassName="font-bold"
                  tokenNameClassName="font-normal"
                  className={classNames({ '': true })}
                />
              </span>
            </span>
            <span className="flex  justify-between sm:justify-start  flex-row gap-6 items-center">
              <span className="text-11 text-common-lightGray w-14">Net</span>
              <span className="text-sm w-28 sm:w-fit flex flex-row gap-1 items-center">
                <DisplayNumber
                  state={Stator.resolve(
                    'extraMint' in rowData ? rowData.extraMint.netMintAmount : rowData.extraBurn.netBurnAmount,
                  )}
                  tokenName={rowData.request.args.requestType === 1 ? TokenName.USDC : TokenName.CVI}
                  tokenNumberClassName="font-bold"
                  tokenNameClassName="font-normal"
                  className={classNames({ '': true })}
                />
                <span data-tip data-for={`${id}netPendingAmountTip`}>
                  <GetSvg svgName="tooltip" className=" cursor-pointer" />
                </span>
                {mintBurnFeeTooltipDescription()}
              </span>
            </span>
          </span>
        )
      }

      case 'expected_no_of_tokens': {
        return (
          <>
            <DisplayNumber
              state={Stator.resolve(
                'extraMint' in rowData
                  ? rowData.extraMint.expectedVolTokensAmount
                  : rowData.extraBurn.expectedUSDCAmount,
              )}
              tokenName={rowData.request.args.requestType === 1 ? TokenName.CVI : TokenName.USDC}
              tokenNumberClassName="font-bold"
              tokenNameClassName="font-normal"
              className={classNames({ '': true })}
            />
          </>
        )
      }

      case 'receive_in': {
        return (
          <>
            <span className="flex flex-col ">
              <CountDownTimer targetTimestamp={rowData.request.args.targetTimestamp} />
              {'extraMint' in rowData && rowData.extraMint.insufficientLiquidity && (
                <span className="flex flex-row gap-1 text-common-lightRed text-tiny">
                  Insufficient liquidity
                  <span className="flex items-center" data-tip data-for="insufficientLiquidityTip">
                    <GetSvg svgName="tooltip" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="insufficientLiquidityTip"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    There is not enough liquidity in the theta vault to cover the requested minting amount. The system
                    will try to fulfill your request within an hour from your selected "receive in" time. If it is
                    unsuccessful, a full refund will be issued to your address.
                  </ReactTooltip>
                </span>
              )}
              {'extraMint' in rowData &&
                rowData.extraMint.insufficientSlippage &&
                !rowData.extraMint.insufficientLiquidity && (
                  <>
                    <span className="flex flex-row gap-1 text-common-lightRed text-tiny">
                      Insufficient slippage
                      <span className="flex items-center" data-tip data-for="insufficientSlippageTip">
                        <GetSvg svgName="tooltip" className=" cursor-pointer" />
                      </span>
                      <ReactTooltip
                        id="insufficientSlippageTip"
                        place="bottom"
                        effect="solid"
                        data-html={true}
                        insecure={true}
                        multiline={true}
                        className="default-react-tooltip-style default-react-small-tooltip-style"
                        delayHide={0}
                      >
                        Your transaction will revert if the price of the premium changes unfavorably by more than this
                        percentage.
                      </ReactTooltip>
                    </span>
                  </>
                )}
            </span>
          </>
        )
      }

      case 'button': {
        return (
          <>
            {latestBlock.data !== undefined && rowData.request.args.targetTimestamp >= latestBlock.data?.timestamp && (
              <Button
                type="receive"
                title="Receive Now"
                className={classNames({
                  'h-10 w-full md:w-56  2xl:w-38 text-sm  font-normal normal-case ': true,
                  'rounded-lg': true,
                })}
                onClick={() => {
                  onMintOrBurn(rowData.requestId, rowData.request.args.requestType === 1 ? 'mint' : 'burn')
                }}
                disabled={lockReceiveButton || mintBurnModal.clickReceiveFromModal}
              />
            )}
          </>
        )
      }
    }
  }

  return (
    <>
      <tr
        className={classNames({
          'hover:bg-dark-100 even:bg-dark-300 h-16 ': true,
          'bg-custom-400 hover:bg-custom-400': isOpen,
        })}
      >
        {/* {fullMode === MODE.ON && <td className="pl-4 py-4 pr-4">{protectionInfo.boughtEvent.args.id}</td>} */}
        <td className="pl-4 py-4 pr-4 table-cell">{getTd('type')}</td>

        <td className="py-4 table-cell pr-4">{getTd('submit_time')}</td>

        <td scope="row" className="py-4 font-medium pr-4 hidden xl:table-cell">
          {' '}
          {getTd('amount')}
        </td>

        <td className="py-4 hidden md:table-cell text-common-turquoise" hidden>
          {getTd('expected_no_of_tokens')}
        </td>

        <td className="py-4 pr-4 lg:pr-2 hidden 2xl:table-cell">{getTd('receive_in')}</td>

        {true ? (
          <td className="py-4 pr-4 text-right  hidden 2xl:table-cell ">{getTd('button')}</td>
        ) : (
          <td className=" py-4 pr-4 text-right hidden 2xl:table-cell "></td>
        )}

        <td className="pr-8 2xl:hidden" onClick={() => setIsOpen(prev => !prev)}>
          <GetSvg
            svgName="chevron"
            className={classNames({
              'block ml-auto transition duration-200 fill-common-orange': true,
              'rotate-180': isOpen,
            })}
          />
        </td>
      </tr>

      {/* isOpen - used for small screens */}
      {isOpen && (
        <>
          <FullTableSizeTr className="bg-custom-400 flex min-h-full">
            <div className="w-full px-4 pb-6 flex flex-wrap">
              <div className="flex-col gap-2 mt-4 xl:hidden flex xl:w-auto w-full md:w-1/3 ">
                <span className="mr-1 text-white text-opacity-50 block">{PendingRequestHeaders.amount}</span>
                {getTd('amount')}
              </div>

              <div className="flex  flex-col mt-4 gap-2 md:hidden  w-full xl:w-1/4 md:w-1/4">
                <span className="mr-4 text-white text-opacity-50 block">
                  {PendingRequestHeaders.expected_no_of_tokens}
                </span>
                {getTd('expected_no_of_tokens')}
              </div>

              <div className="flex flex-col mt-4 xl:w-auto w-full gap-2 md:w-1/4 sm:w-1/3  ">
                <span className="mr-1 text-white text-opacity-50 block">{PendingRequestHeaders.receive_in}</span>
                {getTd('receive_in')}
              </div>
              {<div className="mt-8 xl:mt-4 w-full md:w-fit 2xl:hidden ml-auto  md:mt-auto ">{getTd('button')}</div>}
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default PendingRequestRow
