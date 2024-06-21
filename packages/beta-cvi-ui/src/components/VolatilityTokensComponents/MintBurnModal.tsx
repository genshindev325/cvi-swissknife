import type { State } from '@coti-cvi/lw-sdk/src/state'
import { Stator } from '@coti-cvi/lw-sdk/src/state'
import useOnClickOutside from 'beta-cvi-ui/src/hooks/useOnClickOutside'
import { actions, useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import type {
  FormattedVtSubmitRequestEvent,
  PendingFeeTableRowType,
  PendingFeeTableRowTypeExtraBurn,
  PendingFeeTableRowTypeExtraMint,
} from '../../../../lw-sdk/src'
import { catDecimalsNoRoundUp } from '../../../../lw-sdk/src'
import { TokenName } from '../../../../lw-sdk/src'
import { useAddress } from '../../hooks/use-address'
import { useTvInversifyServices } from '../../hooks/useTvInversifyServices'
import { VolatilityTokensTabsPaths } from '../../types/common.types'
import { displayNotification } from '../../utils/utilities'
import Button from '../Button/Button'
import CustomNotification from '../CustomNotification'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import CommonModal from '../Modals/CommonModal'
import SlippageSelect from '../SlippageSelect/SlippageSelect'

const MintBurnModal = () => {
  const dispatch = useAppDispatch()
  const mintBurnModal = useAppSelector(state => state.state.mintBurnModal)
  const PendingRequestInfo = useAppSelector(state => state.state.cvi.volatilityToken.PendingRequestTable)
  const [isOpen, setIsOpen] = useState(false)
  const [slippage, setSlippage] = useState(0.1)
  const { address } = useAddress()
  const { globalEventsInversifyService, vtInversifyService, vtContractsEventsInversifyService } =
    useTvInversifyServices()
  const [isLoading, setIsLoading] = useState(false)
  const [rowData, setRowData] = useState<State<PendingFeeTableRowType>>(Stator.pending())
  const [submitEvent, setSubmitEvent] = useState<State<FormattedVtSubmitRequestEvent>>(Stator.pending())
  const [isReceiveNow, setIsReceiveNow] = useState(true)
  const [updatedData, setUpdatedData] = useState<
    State<PendingFeeTableRowTypeExtraMint | PendingFeeTableRowTypeExtraBurn>
  >(Stator.pending())

  const modalRef = useRef<HTMLDivElement>(null)
  const handleOutsideModal = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }
  useOnClickOutside(modalRef, handleOutsideModal)

  useEffect(() => {
    const fetchNewData = async () => {
      if (vtInversifyService && address && mintBurnModal.id) {
        let newData = undefined
        if (mintBurnModal.title === VolatilityTokensTabsPaths.mint) {
          newData = await vtInversifyService.checkPendingMint(mintBurnModal.id, false)
          setUpdatedData(Stator.resolve(newData))
        } else {
          newData = await vtInversifyService.checkPendingBurn(mintBurnModal.id, false)
          setUpdatedData(Stator.resolve(newData))
        }
      }
    }
    fetchNewData()
  }, [address, mintBurnModal.id, mintBurnModal.title, vtInversifyService])

  useEffect(() => {
    if (vtInversifyService && address && PendingRequestInfo.data !== undefined) {
      setRowData(Stator.pending())
      setSubmitEvent(Stator.pending())
      const tableRowData = Stator.map(PendingRequestInfo, data => data?.tableRowEvents)
      const submitData = Stator.map(PendingRequestInfo, data => data?.submitEvents)

      if (tableRowData?.data !== undefined && mintBurnModal.id !== undefined) {
        const tableRow = tableRowData.data.filter(tr => tr.requestId === mintBurnModal.id)
        setRowData(Stator.resolve(tableRow[0]))
      } else if (tableRowData.status === 'rejected') {
        setRowData(Stator.reject(undefined, tableRowData.error))
      }

      if (submitData.data !== undefined && mintBurnModal.id !== undefined) {
        const submitedData = submitData.data.filter(subm => subm.args.requestId === mintBurnModal.id)

        setSubmitEvent(Stator.resolve(submitedData[0]))
      } else if (submitData.status === 'rejected') {
        setSubmitEvent(Stator.reject(undefined, submitData.error))
      }
    }
  }, [address, PendingRequestInfo, mintBurnModal.id, vtInversifyService])

  const getMessgaeForTheNotifications = (name: string, typeNote: 'completed' | 'failed' | 'pending') => {
    const usdcInCvi = Stator.map(updatedData, updatedData =>
      'expectedVolTokensAmount' in updatedData ? updatedData.expectedVolTokensAmount : updatedData.expectedUSDCAmount,
    )
    const tokenAmount = Stator.resolve(rowData.data !== undefined ? rowData.data.request.args.tokenAmountPaid : 0)

    if (usdcInCvi.data !== undefined) {
      return `${
        typeNote === 'failed'
          ? 'Failed to submit the request'
          : typeNote === 'completed'
          ? 'The request'
          : 'Submitting request'
      } to ${name} ${
        name === 'mint'
          ? `${catDecimalsNoRoundUp(usdcInCvi.data, 4)} CVI`
          : `${catDecimalsNoRoundUp(tokenAmount.data, 4)} CVI`
      } for ${
        name === 'mint'
          ? `${catDecimalsNoRoundUp(tokenAmount.data, 4)} ${
              typeNote === 'completed' ? 'USDC was submitted successfully' : 'USDC'
            }`
          : `${catDecimalsNoRoundUp(usdcInCvi.data, 4)} ${
              typeNote === 'completed' ? 'USDC was submitted successfully' : 'USDC'
            }`
      }`
    }
  }

  const tooltipFragment = (
    status: string,
    fee: State<number | undefined> | State<number | false>,
    feeTitle: string,
    type?: 'hide',
  ) => (
    <span className={classNames({ 'flex flex-row justify-between ': true, hidden: fee.data === 0 || type === 'hide' })}>
      <span className="whitespace-normal mr-2 ">{feeTitle}</span>
      <span className="flex flex-row">
        {status === 'resolved' && fee.data !== undefined && fee.data > Stator.resolve(0).data ? '-' : ''}
        <DisplayNumber
          state={fee}
          tokenName={mintBurnModal.title === 'burn' ? TokenName.CVI : TokenName.USDC}
          tokenNameClassName="font-normal"
          customDecimal={6}
          minimizeLessThan0_000001={mintBurnModal.title === 'burn' ? true : false}
        />
      </span>
    </span>
  )

  const mintBurnFeeTooltipDescription = () => {
    const tokenAmount = Stator.resolve(rowData.data !== undefined ? rowData.data.request.args.tokenAmountPaid : 0)
    const mintFee = Stator.map(updatedData, data => ('openPositionFee' in data ? data.openPositionFee * 2 : 0))
    const burnFee = Stator.map(updatedData, data => ('closeFee' in data ? data.closeFee : 0))
    const mintOrBurnFee = mintBurnModal.title === 'mint' ? mintFee : burnFee

    const submitFeesAmount = Stator.resolve(submitEvent.data !== undefined ? submitEvent.data.args.submitFeesAmount : 0)
    const buyingPremiumFee = Stator.map(
      updatedData,
      data => ('buyingPremiumFee' in data ? data.buyingPremiumFee - data.openPositionFee : 0), // change to buy preimum fee
    )
    const timePenaltyFee = Stator.resolve(updatedData.data !== undefined ? updatedData.data.timePenaltyFee : 0)
    return (
      <ReactTooltip
        id="netMintBurnAmountModalTip"
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
              state={tokenAmount}
              tokenName={mintBurnModal.title === 'burn' ? TokenName.CVI : TokenName.USDC}
              tokenNameClassName="font-normal"
              customDecimal={6}
            />
          </span>
          {tooltipFragment(
            updatedData.status,
            mintOrBurnFee,
            `${mintBurnModal.title === 'burn' ? 'Burn' : 'Mint'} fee`,
          )}
          {tooltipFragment(submitEvent.status, submitFeesAmount, 'Expedite fee')}
          {tooltipFragment(updatedData.status, buyingPremiumFee, 'Buy premium fee', 'hide')}
          {tooltipFragment(updatedData.status, timePenaltyFee, 'Early fulfillment fee')}

          <hr className="border border-dark-300 " />
          <span className="flex flex-row justify-between">
            <span className="whitespace-normal mr-2">
              <span className="capitalize">{mintBurnModal.title}</span> amount
            </span>
            <DisplayNumber
              state={Stator.map(updatedData, data =>
                'netMintAmount' in data ? data.netMintAmount : data.netBurnAmount,
              )}
              tokenName={mintBurnModal.title === 'burn' ? TokenName.CVI : TokenName.USDC}
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

  return (
    <CommonModal
      type="stakeUnstakeModal"
      showModal={mintBurnModal.modalIsOpen}
      setShowModal={() => {
        dispatch(actions.setMintBurnModal({ ...mintBurnModal, modalIsOpen: false }))
        setIsOpen(false)
      }}
    >
      <div className="p-4 sm:p-0">
        <h1 className="text-lg sm:text-2xl mb-10 sm:mb-8 ">
          Don't want to wait? You can receive your {mintBurnModal.title === 'mint' ? 'CVI' : 'USDC'} tokens now
        </h1>
        <span className="flex flex-col gap-6">
          <span className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
            <span className="text-common-lightGray text-xs">Submitted amount</span>
            {submitEvent !== undefined && (
              <DisplayNumber
                state={Stator.map(submitEvent, data => data.args.tokenAmountPaid)}
                tokenName={mintBurnModal.title === 'burn' ? TokenName.CVI : TokenName.USDC}
                tokenNumberClassName="font-bold"
                tokenNameClassName="font-normal"
              />
            )}
          </span>
          <span className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0">
            <span className="flex flex-row gap-1 text-common-lightGray text-xs">
              Net {mintBurnModal.title} amount{' '}
              <span data-tip data-for="netMintBurnAmountModalTip">
                <GetSvg svgName="tooltip" className=" cursor-pointer" />
              </span>{' '}
              {mintBurnFeeTooltipDescription()}
            </span>
            {updatedData !== undefined && (
              <DisplayNumber
                state={Stator.map(updatedData, data =>
                  'netMintAmount' in data ? data.netMintAmount : data.netBurnAmount,
                )}
                tokenName={mintBurnModal.title === 'burn' ? TokenName.CVI : TokenName.USDC}
                tokenNumberClassName="font-bold"
                tokenNameClassName="font-normal"
              />
            )}
          </span>
          {mintBurnModal.title === 'mint' && (
            <>
              <span className="relative" ref={modalRef}>
                <span className="flex flex-col sm:flex-row justify-between items-center">
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
                  <button onClick={() => setIsOpen(!isOpen)}>
                    <b className="text-sm flex gap-1 items-center">
                      {`${slippage}%`}
                      <GetSvg svgName="editIcon" />
                    </b>
                  </button>
                </span>
                <span className="absolute z-50 w-full -left-8 stiny:left-0 sm:left-6 stiny:top-12 sm:top-8 top-12">
                  {isOpen && (
                    <SlippageSelect
                      slippage={slippage}
                      setSlippage={setSlippage}
                      setIsOpen={setIsOpen}
                      isOpen={isOpen}
                    />
                  )}
                </span>
              </span>
            </>
          )}
          <span className="flex flex-col sm:flex-row sm:justify-between gap-2 items-center sm:gap-0">
            <span className="flex flex-row gap-1 text-common-lightGray text-xs">
              Expected number of tokens{' '}
              <span data-tip data-for="mintExpectedNumberOfTokensModalTip">
                <GetSvg svgName="tooltip" className=" cursor-pointer" />
              </span>
              <ReactTooltip
                id="mintExpectedNumberOfTokensModalTip"
                place="top"
                effect="solid"
                data-html={true}
                insecure={true}
                multiline={true}
                className="default-react-tooltip-style "
                delayHide={0}
              >
                The number of {mintBurnModal.title === 'burn' ? 'USDC' : 'CVI'} tokens displayed is an estimated amount
                you will receive after your request is fulfilled. Please note that fulfilling your request prior to the
                specified target time will incur an early fulfillment fee that will reduce the amount of{' '}
                {mintBurnModal.title === 'burn' ? 'USDC' : 'CVI'} tokens you will receive
              </ReactTooltip>
            </span>

            {address
              ? updatedData !== undefined && (
                  <DisplayNumber
                    state={Stator.map(updatedData, updatedData =>
                      'expectedVolTokensAmount' in updatedData
                        ? updatedData.expectedVolTokensAmount
                        : updatedData.expectedUSDCAmount,
                    )}
                    tokenName={mintBurnModal.title === 'burn' ? TokenName.USDC : TokenName.CVI}
                    tokenNumberClassName="font-bold text-common-turquoise"
                    tokenNameClassName="font-normal text-common-turquoise"
                  />
                )
              : '-'}
          </span>
        </span>
        <span className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4  mt-8">
          <Button
            type="receive"
            title="Receive Now"
            className={classNames({
              'text-base   border rounded-lg': true,
            })}
            status={isLoading ? 'pending' : 'resolved'}
            onClick={async () => {
              if (window.gtag) {
                window.gtag('event', 'receive_now_modal_started', {
                  page_title: 'receive_now_modal_started',
                  receive_now_modal_title: 'Receive now modal started',
                  description: 'User click on receive now on the table and this modal opened',
                  page_path: window.location.pathname,
                })
              }
              if (
                !globalEventsInversifyService ||
                !vtContractsEventsInversifyService ||
                !vtInversifyService ||
                !address
              ) {
                return
              }
              try {
                if (
                  mintBurnModal.id !== undefined &&
                  rowData.data !== undefined &&
                  PendingRequestInfo.data !== undefined
                ) {
                  setIsLoading(true)
                  const fetchData = PendingRequestInfo.data.pendingRequests.filter(
                    pendReq => pendReq.requestId === mintBurnModal.id,
                  )
                  let tx
                  if ('extraMint' in rowData.data) {
                    tx = await vtInversifyService.fulfillMint(fetchData[0], slippage)
                  } else {
                    tx = await vtInversifyService.fulfillBurn(fetchData[0])
                  }

                  displayNotification({
                    id: `${tx !== undefined ? `pending-${tx?.receipt.transactionHash}` : 'pending'}`,
                    title: 'pending',
                    type: 'info',
                    message: getMessgaeForTheNotifications(rowData.data.requestType === 1 ? 'mint' : 'burn', 'pending'),
                    content: CustomNotification,
                  })

                  if (!isLoading) {
                    displayNotification({
                      id: `${tx?.receipt.transactionHash}`,
                      title: 'completed',
                      type: 'success',
                      message: getMessgaeForTheNotifications(
                        rowData.data.requestType === 1 ? 'mint' : 'burn',
                        'completed',
                      ),
                      content: CustomNotification,
                    })
                  }
                }

                if (window.gtag) {
                  window.gtag('event', 'receive_now_modal_successed', {
                    page_title: 'receive_now_modal_successed',
                    receive_now_modal_title: 'receive_now_modal_successed',
                    description: 'The transaction successed',
                    page_path: window.location.pathname,
                  })
                }
                // await onReceiveNow()
                // dispatch(actions.setMintBurnModal({ modalIsOpen: false, clickReceiveFromModal: true }))
              } catch (error) {
                if (rowData.data !== undefined && updatedData !== undefined) {
                  if (error.message.includes('User denied transaction signature')) {
                    if (window.gtag) {
                      window.gtag('event', 'receive_now_modal_denied', {
                        page_title: 'receive_now_modal_denied',
                        receive_now_modal_denied_title: `Fail - Denied receiving now to ${mintBurnModal.title}`,
                        description: 'User denied the transaction on the wallet',
                        page_path: window.location.pathname,
                      })
                    }

                    displayNotification({
                      id: `${rowData.data.requestType === 1 ? 'mint' : 'burn'}Cancelled`,
                      title: 'failed',
                      type: 'danger',
                      message: `Transaction was cancelled`,
                      content: CustomNotification,
                    })
                  } else {
                    if (window.gtag) {
                      window.gtag('event', 'receive_now_modal_fail', {
                        page_title: 'receive_now_modal_fail',
                        receive_now_modal_fail_title: `Fail - Failed to receive now ${mintBurnModal.title}`,
                        description: 'The transaction failed',
                        page_path: window.location.pathname,
                      })
                    }
                    displayNotification({
                      id: `${rowData.data.requestType === 1 ? 'mint' : 'burn'}Failed`,
                      title: 'failed',
                      type: 'danger',
                      message: getMessgaeForTheNotifications(
                        rowData.data.requestType === 1 ? 'mint' : 'burn',
                        'failed',
                      ),
                      content: CustomNotification,
                    })
                  }
                }
                globalEventsInversifyService.eventEmitter.emit('errors', error)
              } finally {
                setIsReceiveNow(true)
                dispatch(actions.setMintBurnModal({ modalIsOpen: false, clickReceiveFromModal: true }))
                vtContractsEventsInversifyService.emitPendingRequestTableInfoEvents(address)
                vtInversifyService.emitBurnBalanceEvent(address)
                vtInversifyService.emitBalanceEvent(address)
                setIsLoading(false)
              }
            }}
            disabled={isLoading || !globalEventsInversifyService || !vtContractsEventsInversifyService || !isReceiveNow}
          />
          <Button
            type="common"
            title="cancel"
            className={classNames({
              'text-base   border rounded-lg ': true,
            })}
            onClick={() => dispatch(actions.setMintBurnModal({ modalIsOpen: false }))}
          />
        </span>
      </div>
    </CommonModal>
  )
}

export default MintBurnModal
//
