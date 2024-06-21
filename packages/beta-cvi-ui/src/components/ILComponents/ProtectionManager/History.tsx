import type { FC, PropsWithChildren } from 'react'
import Table from '../../Table/Table'
import HistoryRow from './HistoryRow'
import type { ProtectionInfo } from '@coti-cvi/lw-sdk'
import { MODE } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import { useAppSelector } from '../../../redux/hooks'
import { HistoryProtectionsHeaders } from 'beta-cvi-ui/src/types/common.types'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import ReactTooltip from 'react-tooltip'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
type HistoryProps = {}

const History: FC<PropsWithChildren<HistoryProps>> = () => {
  const walletProtections = useAppSelector(state => state.state.walletProtections)
  const [fullMode] = useLocalStorage('fullMode')

  return (
    <Table
      state={Stator.map(walletProtections, array => array.filter(p => p.expiredEvent))}
      connectGuard
      name="history"
    >
      <thead className="text-sm text-white text-opacity-50 ">
        <tr>
          {fullMode === MODE.ON && (
            <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4">
              {HistoryProtectionsHeaders.id}
            </th>
          )}
          <th scope="col" className="pl-4 pb-3 align-baseline">
            {HistoryProtectionsHeaders.pair}
          </th>
          <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4 hidden md:table-cell">
            {HistoryProtectionsHeaders.protected_amount}
          </th>
          <th scope="col" className="pl-4 pb-3 align-baseline whitespace-wrap pr-4 hidden lg:table-cell">
            {HistoryProtectionsHeaders.purchase_date}
          </th>

          <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4 hidden lg:table-cell">
            {HistoryProtectionsHeaders.period}
          </th>

          <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4  hidden sm:table-cell">
            {HistoryProtectionsHeaders.protection_end_date}
          </th>
          <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4 hidden lg:table-cell">
            {HistoryProtectionsHeaders.il}
          </th>

          <th scope="col" className="pb-3 align-baseline hidden lg:table-cell">
            <>
              <span className="flex flex-row gap-1 mr-1">
                {HistoryProtectionsHeaders.payout}
                <span className="flex items-center" data-tip data-for="historyPayoutTip">
                  <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="historyPayoutTip"
                  place="bottom"
                  effect="solid"
                  data-html={true}
                  insecure={true}
                  multiline={true}
                  className="default-react-tooltip-style "
                  delayHide={0}
                >
                  The payment is based on the impermanent loss at a time of protection expiration
                </ReactTooltip>
              </span>
            </>
          </th>
        </tr>
      </thead>
      {data => (
        <tbody className=" text-white text-sm">
          {data
            .filter((protectionInfo): protectionInfo is Required<ProtectionInfo> =>
              Boolean(protectionInfo.expiredEvent),
            )
            .sort((a, b) => b.boughtEvent.args.protectionStartTimestamp - a.boughtEvent.args.protectionStartTimestamp)
            .map(protectionInfo => (
              <HistoryRow key={protectionInfo.boughtEvent.args.id} protectionInfo={protectionInfo} />
            ))}
        </tbody>
      )}
    </Table>
  )
}

export default History
