import type { FC } from 'react'
import { useState } from 'react'
// import { MODE } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { BalancesPendingRequestKeys } from 'beta-cvi-ui/src/types/common.types'
import { BalancesPendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import { FullTableSizeTr } from '../../FullTableSizeTr/FullTableSizeTr'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import '../../../styles/globals.scss'

import { TokenName } from '@coti-cvi/lw-sdk/src/types'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import type { State } from '@coti-cvi/lw-sdk/src/state'
import { Stator } from '@coti-cvi/lw-sdk/src/state'
import { useTvInversifyServices } from '../../../hooks/useTvInversifyServices'

type Props = {
  rowData: {
    amount: State<number>
    platform_price: State<number>
  }
}

const BalancesRow: FC<Props> = ({ rowData }) => {
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [intrinsicePricePerBlockNumber, SetIntrinsicePricePerBlockNumber] = useState(0)
  const { vtInversifyService } = useTvInversifyServices()

  const getTd = (type: BalancesPendingRequestKeys) => {
    switch (type) {
      case 'token': {
        return (
          <span className="flex flex-row items-center gap-1">
            {<GetSvg svgName={'cvi'} className="w-8 h-8" />} <span>CVI</span>{' '}
          </span>
        )
      }

      case 'amount': {
        return (
          <span className="flex flex-col ">
            <span className="flex  justify-between sm:justify-start flex-row gap-6  items-center">
              <span className="text-sm w-28 sm:w-fit ">
                <DisplayNumber
                  state={rowData.amount}
                  tokenNumberClassName="font-bold"
                  tokenNameClassName="font-normal"
                  className={classNames({ '': true })}
                />
              </span>
            </span>
          </span>
        )
      }

      case 'platform_price': {
        return (
          <>
            <DisplayNumber
              state={rowData.platform_price}
              tokenName={TokenName.USDC}
              tokenNumberClassName="font-bold"
              tokenNameClassName="font-normal"
              className={classNames({ '': true })}
            />
          </>
        )
      }
      case 'total_value': {
        return (
          <>
            <DisplayNumber
              state={Stator.deriveState(
                [rowData.amount, rowData.platform_price],
                ([amount, platform_price]) => amount * platform_price,
              )}
              tokenName={TokenName.USDC}
              tokenNumberClassName="font-bold"
              tokenNameClassName="font-normal"
              className={classNames({ '': true })}
            />
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
        <td className="pl-4 py-4 pr-4 table-cell">{getTd('token')}</td>
        <td scope="row" className="py-4 font-medium pr-4 ">
          {getTd('amount')}
        </td>

        <td className="py-4 hidden xl:table-cell">{getTd('platform_price')}</td>

        <td className="py-4 pr-4 lg:pr-2 hidden xl:table-cell">{getTd('total_value')}</td>

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
                <span className="mr-4 text-white text-opacity-50 block">
                  {BalancesPendingRequestHeaders.platform_price}
                </span>
                {getTd('platform_price')}
              </div>

              <div className="flex flex-col mt-4 xl:w-auto w-full gap-2 md:w-1/3 lg:w-1/3 ">
                <span className="mr-1 text-white text-opacity-50 block">
                  {BalancesPendingRequestHeaders.total_value}
                </span>
                {getTd('total_value')}
              </div>
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default BalancesRow
