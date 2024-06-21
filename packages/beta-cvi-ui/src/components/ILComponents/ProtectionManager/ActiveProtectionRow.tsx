import type { FC } from 'react'
import { useState } from 'react'
import type { ProtectionInfo } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import { MODE } from '@coti-cvi/lw-sdk'
import { secondsToString, Stator, TokenName } from '@coti-cvi/lw-sdk'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import DisplayDate from '../../DisplayDate/DisplayDate'
import PoolPair from '../../PoolPair/PoolPair'
import classNames from 'classnames'
import type { ActiveProtectionsKeys } from 'beta-cvi-ui/src/types/common.types'
import { ActiveProtectionsHeaders } from 'beta-cvi-ui/src/types/common.types'
import { FullTableSizeTr } from '../../FullTableSizeTr/FullTableSizeTr'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import ReactTooltip from 'react-tooltip'

type Props = {
  protectionInfo: ProtectionInfo
}

const ActiveProtectionRow: FC<Props> = ({ protectionInfo }) => {
  const [fullMode] = useLocalStorage('fullMode')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const getTd = (type: ActiveProtectionsKeys) => {
    switch (type) {
      case 'pair': {
        return (
          <PoolPair
            tokenName1={protectionInfo.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName}
            tokenName2={protectionInfo.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName}
          />
        )
      }

      case 'protected_amount': {
        return (
          <DisplayNumber
            state={Stator.resolve(protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc)}
            tokenNameClassName="text-white font-bold"
            tokenNumberClassName="text-white font-bold"
            dollar={true}
          />
        )
      }

      case 'purchase_date': {
        return <DisplayDate timestamp={protectionInfo.boughtEvent.args.protectionStartTimestamp} />
      }

      case 'period': {
        return secondsToString(protectionInfo.boughtEvent.args.policyPeriodSeconds)
      }

      case 'protection_end_date': {
        return <DisplayDate timestamp={protectionInfo.boughtEvent.args.protectionEndTimestamp} useTooltip={true} />
      }

      case 'current_il': {
        return protectionInfo.status.ilPercentage !== undefined
          ? `${catDecimalsNoRoundUp(protectionInfo.status.ilPercentage, 2)}%`
          : 'Not Avialable'
      }

      case 'payout': {
        return (
          <DisplayNumber
            state={Stator.resolve(protectionInfo.status.payoutOrDuePayoutUsdc)}
            tokenName={TokenName.USDC}
            tokenNameClassName="text-white "
            tokenNumberClassName="text-common-turquoise"
          />
        )
      }
    }
  }

  return (
    <>
      <tr
        className={classNames({
          'hover:bg-dark-100 even:bg-dark-300 h-16': true,
          'bg-custom-400 hover:bg-custom-400': isOpen,
        })}
      >
        {fullMode === MODE.ON && <td className="pl-4 py-4 pr-4">{protectionInfo.boughtEvent.args.id}</td>}
        <td className="pl-4 py-4 pr-4">{getTd('pair')}</td>

        <td className="py-4 hidden md:table-cell">{getTd('protected_amount')}</td>

        <td scope="row" className="py-4 font-medium pr-4 hidden lg:table-cell">
          {getTd('purchase_date')}
        </td>

        <td className="py-4 hidden lg:table-cell" hidden>
          {getTd('period')}
        </td>

        <td className="py-4 pr-4 hidden sm:table-cell">{getTd('protection_end_date')}</td>

        <td className="py-4 text-common-turquoise hidden lg:table-cell">{getTd('current_il')}</td>

        <td className="py-4 hidden lg:table-cell">{getTd('payout')}</td>

        <td className="pr-8 lg:hidden" onClick={() => setIsOpen(prev => !prev)}>
          <GetSvg
            svgName="chevron"
            className={classNames({
              'block ml-auto transition duration-200': true,
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
              <div className="flex flex-col mt-4 md:hidden lg:flex lg:w-auto w-full sm:w-1/3">
                <span className="mr-1 text-white text-opacity-50 block">
                  {ActiveProtectionsHeaders.protected_amount}
                </span>
                {getTd('protected_amount')}
              </div>

              <div className="flex flex-col mt-4 lg:w-auto w-full md:w-1/4 sm:w-2/3">
                <span className="mr-1 text-white text-opacity-50 block">{ActiveProtectionsHeaders.purchase_date}</span>
                {getTd('purchase_date')}
              </div>

              <div className="flex flex-col mt-4 lg:w-auto w-full md:w-1/4 sm:w-1/3">
                <span className="mr-1 text-white text-opacity-50 block">{ActiveProtectionsHeaders.period}</span>
                {getTd('period')}
              </div>

              <div className="flex flex-col mt-4 lg:w-auto w-full md:w-2/4 sm:w-2/3">
                <span className="mr-1 text-white text-opacity-50 block">{ActiveProtectionsHeaders.current_il}</span>
                <span className="text-common-turquoise">{getTd('current_il')}</span>
              </div>

              <div className="flex flex-col mt-4 md:hidden sm:hidden lg:w-auto w-full">
                <span className="mr-1 text-white text-opacity-50 block">
                  {ActiveProtectionsHeaders.protection_end_date}
                </span>
                {getTd('protection_end_date')}
              </div>

              <div className="flex flex-col mt-4 lg:w-auto w-full md:w-1/4 sm:w-1/3">
                <span className="flex flex-row gap-1 mr-1 text-white text-opacity-50 ">
                  {ActiveProtectionsHeaders.payout}
                  <span className="flex items-center" data-tip data-for="activeProtectionPayoutTip">
                    <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="activeProtectionPayoutTip"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    The amount due payment at the end of the protection period based on the current impermanent loss
                    (updated once a minute)
                  </ReactTooltip>
                </span>
                {getTd('payout')}
              </div>
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default ActiveProtectionRow
