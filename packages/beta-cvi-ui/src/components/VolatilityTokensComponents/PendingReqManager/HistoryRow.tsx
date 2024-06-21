import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
// import { MODE } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { HistoryPendingRequestKeys } from 'beta-cvi-ui/src/types/common.types'
import { HistoryPendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import { FullTableSizeTr } from '../../FullTableSizeTr/FullTableSizeTr'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import '../../../styles/globals.scss'
import type {
  CompletedMintVolTokenEvent,
  CompletedBurnVolTokenEvent,
  FailedVolTokenEvent,
} from '@coti-cvi/lw-sdk/src/types/vol-token-common-types'
import { VtRequestType } from '@coti-cvi/lw-sdk/src/types/vol-token-common-types'
import { TokenName } from '@coti-cvi/lw-sdk/src/types'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import { format } from 'date-fns'
import { useTvInversifyServices } from '../../../hooks/useTvInversifyServices'
import ReactTooltip from 'react-tooltip'

type Props = {
  rowData: (CompletedMintVolTokenEvent | CompletedBurnVolTokenEvent | FailedVolTokenEvent) & { net: number }
  id: number
}

const HistoryRow: FC<Props> = ({ id, rowData }) => {
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [intrinsicePricePerBlockNumber, SetIntrinsicePricePerBlockNumber] = useState(0)
  const { vtInversifyService } = useTvInversifyServices()

  useEffect(() => {
    const cviPrice = async (burnFulfillBlockNumber: number) => {
      if (burnFulfillBlockNumber !== undefined) {
        vtInversifyService
          ?.getIntrinsicPrice(burnFulfillBlockNumber)
          .then(data => SetIntrinsicePricePerBlockNumber(data))
          .catch(error => {
            throw new Error(`${error} - Error from cviPrice function`)
          })
      }
    }
    if ('burn' in rowData && rowData.burn !== undefined) {
      cviPrice(rowData.fulfill.blockNumber)
    }
  }, [rowData, vtInversifyService])

  const mintBurnFeeTooltipDescription = () => {
    const isUsedKeeper = rowData.status !== 'failure' && rowData.fulfill.args.keepersCalled
    const submitAmount = rowData.request.args.tokenAmountPaid

    const submitFee = rowData.request.args.submitFeesAmount

    const fulfillFee = rowData.status !== 'failure' ? rowData.fulfill.args.fulfillFeesAmount : 0

    const mintFee =
      rowData.status !== 'failure' && 'mint' in rowData && rowData.mint ? rowData.mint.args.openPositionFee * 2 : 0
    const buyPremiumFee =
      'mint' in rowData && rowData.mint ? rowData.mint.args.buyingPremiumFee - rowData.mint.args.openPositionFee : 0
    const burnFee =
      rowData.status !== 'failure' && 'burn' in rowData && rowData.burn ? rowData.burn.args.closePositionFee : 0

    const mintOrBurnFee = rowData.requestType === 2 ? burnFee : mintFee

    const netAmount = rowData.net

    return (
      <ReactTooltip
        id={`${id}netHistoryAmountTip`}
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

          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: mintOrBurnFee === 0 })}>
            <span className="whitespace-normal mr-2">{rowData.requestType === 2 ? 'Burn ' : 'Mint '}fee</span>
            <span className="flex flex-row">
              {mintOrBurnFee !== undefined && mintOrBurnFee > 0 ? '-' : ''}
              <DisplayNumber
                state={mintOrBurnFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>
          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: submitFee === 0 })}>
            <span className="whitespace-normal mr-2">Expedite fee</span>
            <span className="flex flex-row">
              {submitFee !== undefined && submitFee > 0 ? '-' : ''}
              <DisplayNumber
                state={submitFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>
          <span
            className={classNames({
              'flex flex-row justify-between ': true,
              hidden: buyPremiumFee === 0 || rowData.requestType === 2,
            })}
          >
            <span className="whitespace-normal mr-2">Buy premium fee</span>
            <span className="flex flex-row">
              {buyPremiumFee !== undefined && buyPremiumFee > 0 ? '-' : ''}
              <DisplayNumber
                state={buyPremiumFee}
                tokenName={rowData.requestType === 2 ? TokenName.CVI : TokenName.USDC}
                tokenNameClassName="font-normal"
                customDecimal={6}
              />
            </span>
          </span>
          <span className={classNames({ 'flex flex-row justify-between ': true, hidden: fulfillFee === 0 })}>
            <span className="whitespace-normal mr-2">{isUsedKeeper ? 'Keepers fee' : 'Fulfill fee'}</span>
            <span className="flex flex-row">
              {fulfillFee !== undefined && fulfillFee > 0 ? '-' : ''}
              <DisplayNumber
                state={fulfillFee}
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

  const getTd = (type: HistoryPendingRequestKeys) => {
    switch (type) {
      case 'type': {
        return <span className="flex flex-row justify-center pl-4">{rowData.requestType === 1 ? 'Mint' : 'Burn'}</span>
      }

      case 'submit_time': {
        return (
          <span className="flex flex-row justify-center">
            {format(new Date(rowData.request.blockTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
          </span>
        )
      }

      case 'amount': {
        return (
          <span className={classNames({ 'flex flex-row ': true, 'justify-center': !isOpen, 'justify-start': isOpen })}>
            <span className="flex flex-col  sm:w-full">
              <span className="flex  justify-between  flex-row   items-center">
                <span className="text-11 text-common-lightGray w-14 ">Submitted</span>
                <span className="text-sm w-7/12    ">
                  <DisplayNumber
                    state={rowData.request.args.tokenAmountPaid}
                    tokenName={rowData.request.args.tokenNameAmountPaid}
                    tokenNumberClassName="font-bold"
                    tokenNameClassName="font-normal"
                    className={classNames({ '': true })}
                  />
                </span>
              </span>
              <span className="flex  justify-between   flex-row gap-6 items-center">
                <span className="text-11 text-common-lightGray w-14">Net</span>
                <span className="text-sm w-7/12  flex flex-row gap-1 items-center">
                  <DisplayNumber
                    state={rowData.net}
                    tokenName={rowData.request.args.requestType === 1 ? TokenName.USDC : TokenName.CVI}
                    tokenNumberClassName="font-bold"
                    tokenNameClassName="font-normal"
                    className={classNames({ '': true })}
                  />
                  <span data-tip data-for={`${id}netHistoryAmountTip`}>
                    <GetSvg svgName="tooltip" className=" cursor-pointer" />
                  </span>
                  {mintBurnFeeTooltipDescription()}
                </span>
              </span>
            </span>
          </span>
        )
      }

      case 'received_tokens': {
        return (
          <span className={classNames({ 'flex flex-row ': true, 'justify-center': !isOpen, 'justify-start': isOpen })}>
            <DisplayNumber
              state={
                rowData.status === 'failure'
                  ? 0
                  : rowData.requestType === VtRequestType.Mint
                  ? rowData.mint.args.mintedTokens
                  : rowData.burn.args.usdcAmountReceived
              }
              tokenName={rowData.request.args.requestType === 1 ? TokenName.CVI : TokenName.USDC}
              tokenNumberClassName="font-bold"
              tokenNameClassName="font-normal"
              className={classNames({ '': true })}
            />
          </span>
        )
      }
      case 'status': {
        return (
          <span className={classNames({ 'flex flex-row ': true, 'justify-center': !isOpen, 'justify-start': isOpen })}>
            {rowData.status === 'failure' ? 'Failed' : 'Succeeded'}
          </span>
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

        <td className="py-4 table-cell">{getTd('submit_time')}</td>

        <td scope="row" className="py-4 font-medium pr-4 hidden xl:table-cell">
          {' '}
          {getTd('amount')}
        </td>

        <td className="py-4 pr-4 lg:pr-2 hidden xl:table-cell">{getTd('received_tokens')}</td>
        <td className="py-4 pr-4 lg:pr-2 hidden xl:table-cell">{getTd('status')}</td>

        <td className="pr-8 xl:hidden" onClick={() => setIsOpen(prev => !prev)}>
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
              <div className="flex-col gap-2 mt-4 xl:hidden flex xl:w-auto w-full  md:w-1/3 lg:w-1/3 ">
                <span className="mr-4 text-white text-opacity-50 block">{HistoryPendingRequestHeaders.amount}</span>
                {getTd('amount')}
              </div>
              <div
                className={classNames({
                  'flex flex-row md:justify-end mt-4  xl:w-auto w-full  md:w-1/3 lg:w-1/3': true,
                })}
              >
                <div className="flex flex-col  gap-2 ">
                  <span className="mr-1 text-white text-opacity-50 block">
                    {HistoryPendingRequestHeaders.received_tokens}
                  </span>
                  {getTd('received_tokens')}
                </div>
              </div>
              <div
                className={classNames({
                  'flex flex-row md:justify-end mt-4 xl:w-auto w-full  md:w-1/3 lg:w-1/3': true,
                })}
              >
                <div className="flex flex-col  gap-2 ">
                  <span className="mr-1 text-white text-opacity-50 block">{HistoryPendingRequestHeaders.status}</span>
                  {getTd('status')}
                </div>
              </div>
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default HistoryRow
