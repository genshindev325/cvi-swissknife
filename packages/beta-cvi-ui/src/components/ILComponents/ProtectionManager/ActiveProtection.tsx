import type { FC, PropsWithChildren } from 'react'
import Table from '../../Table/Table'
import ActiveProtectionRow from './ActiveProtectionRow'
import { MODE, Stator } from '@coti-cvi/lw-sdk'
import { useAppSelector } from '../../../redux/hooks'
import { ActiveProtectionsHeaders } from 'beta-cvi-ui/src/types/common.types'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import ReactTooltip from 'react-tooltip'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

type ActiveProtectionProps = {}

const ActiveProtection: FC<PropsWithChildren<ActiveProtectionProps>> = () => {
  const walletProtections = useAppSelector(state => state.state.walletProtections)
  const [fullMode] = useLocalStorage('fullMode')

  return (
    <Table
      state={Stator.map(walletProtections, array => array.filter(p => !p.expiredEvent))}
      connectGuard
      resolvedClassName="mt-2"
      name="active protections"
    >
      <thead className="text-sm text-white text-opacity-50  font-normal ">
        <tr>
          {fullMode === MODE.ON && (
            <th scope="col" className="pl-4 pb-3 align-baseline">
              {ActiveProtectionsHeaders.id}
            </th>
          )}

          <th scope="col" className="pl-4 pb-3 align-baseline">
            {ActiveProtectionsHeaders.pair}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden md:table-cell">
            {ActiveProtectionsHeaders.protected_amount}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden lg:table-cell">
            {ActiveProtectionsHeaders.purchase_date}
          </th>

          <th scope="col" className="pb-3 align-baseline hidden lg:table-cell">
            {ActiveProtectionsHeaders.period}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 whitespace-nowrap hidden sm:table-cell">
            {ActiveProtectionsHeaders.protection_end_date}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden lg:table-cell">
            {ActiveProtectionsHeaders.current_il}
          </th>

          <th scope="col" className="pb-3 align-baseline hidden lg:table-cell">
            <span className="flex flex-row gap-1 mr-1">
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
          </th>

          <th scope="col" className="pb-3 align-baseline lg:hidden"></th>
        </tr>
      </thead>
      {data => (
        <tbody className=" text-white text-sm">
          {data
            .sort((a, b) => b.boughtEvent.args.protectionStartTimestamp - a.boughtEvent.args.protectionStartTimestamp)
            .map(protectionInfo => (
              <ActiveProtectionRow key={protectionInfo.boughtEvent.args.id} protectionInfo={protectionInfo} />
            ))}
        </tbody>
      )}
    </Table>
  )
}

export default ActiveProtection
