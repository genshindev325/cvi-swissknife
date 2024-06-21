import Table from '../../Table/Table'

import { Stator } from '@coti-cvi/lw-sdk'
import { PendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import { useAppSelector } from '../../../redux'
import PendingRequestRow from './PendingRequestRow'

const PendingRequest = () => {
  const PendingRequestInfo = useAppSelector(state => state.state.cvi.volatilityToken.PendingRequestTable)

  return (
    <Table state={Stator.map(PendingRequestInfo, data => data.tableRowEvents)} connectGuard name="pending requests">
      <thead className="text-sm text-white text-opacity-50 font-normal">
        <tr>
          <th scope="col" className="pl-4 pb-3 align-baseline  ">
            {PendingRequestHeaders.type}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4  ">
            {PendingRequestHeaders.submit_time}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden lg:w-64  xl:table-cell ">
            {PendingRequestHeaders.amount}
          </th>

          <th scope="col" className="pb-3 align-baseline hidden xl:w-40 2xl:w-fit md:table-cell  ">
            {PendingRequestHeaders.expected_no_of_tokens}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 whitespace-nowrap hidden 2xl:table-cell ">
            {PendingRequestHeaders.receive_in}
          </th>

          <th scope="col" className="pr-4 pb-3 align-baseline xl:w-20 2xl:w-fit 2xl:hidden">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>

      {data => {
        return (
          <tbody className=" text-white text-sm">
            {data.map((rowData, i) => (
              <PendingRequestRow key={i} id={rowData.requestId} rowData={rowData} />
            ))}
          </tbody>
        )
      }}
    </Table>
  )
}

export default PendingRequest
