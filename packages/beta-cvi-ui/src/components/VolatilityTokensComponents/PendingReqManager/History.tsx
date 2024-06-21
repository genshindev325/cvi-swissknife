import Table from '../../Table/Table'

import { Stator } from '@coti-cvi/lw-sdk'
import { HistoryPendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import HistoryRow from './HistoryRow'
import { useAppSelector } from '../../../redux'

const History = () => {
  const PendingRequestInfo = useAppSelector(state => state.state.cvi.volatilityToken.PendingRequestTable)
  return (
    <Table state={Stator.map(PendingRequestInfo, data => data.completedTableRowEvents)} connectGuard name="history">
      {/* <Table state={mockPendingReq} connectGuard name="volatility tokens"> */}
      <thead className="text-sm text-white text-opacity-50 font-normal">
        <tr>
          <th scope="col" className="pl-4 pb-3 xl:w-24 3xl:w-fit align-baseline text-center">
            {HistoryPendingRequestHeaders.type}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4  xl:w-38 2xl:w-fit text-center">
            {HistoryPendingRequestHeaders.submit_time}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden xl:table-cell lg:w-56 2xl:w-fit text-center">
            {HistoryPendingRequestHeaders.amount}
          </th>

          <th
            scope="col"
            className="pb-3 align-baseline pr-4 whitespace-nowrap hidden xl:w-38 2xl:w-fit xl:table-cell text-center"
          >
            {HistoryPendingRequestHeaders.received_tokens}
          </th>
          <th
            scope="col"
            className="pb-3 align-baseline pr-4 whitespace-nowrap hidden xl:w-38 2xl:w-fit xl:table-cell text-center"
          >
            {HistoryPendingRequestHeaders.status}
          </th>
          {/* <th scope="col" className="pr-4 pb-3 align-baseline xl:w-20 2xl:w-fit 2xl:hidden">
            <span className="sr-only">Edit</span>
          </th> */}
        </tr>
      </thead>

      {data => {
        return (
          <tbody className=" text-white text-sm">
            {data.map((rowData, i) => (
              <HistoryRow key={i} id={rowData.requestId} rowData={rowData} />
            ))}
          </tbody>
        )
      }}
    </Table>
  )
}

export default History
