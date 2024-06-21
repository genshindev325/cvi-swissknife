import Table from '../../Table/Table'

import { BalancesPendingRequestHeaders } from 'beta-cvi-ui/src/types/common.types'
import BalancesRow from './BalancesRow'
import type { FC } from 'react'
import type { ResolvedState, State } from '@coti-cvi/lw-sdk/src'

type Props = {
  newBalancState: ResolvedState<
    {
      amount: State<number>
      platform_price: State<number>
    }[]
  >
}
const Balances: FC<Props> = ({ newBalancState }) => {
  return (
    <Table state={newBalancState} connectGuard name="balances">
      <thead className="text-sm text-white text-opacity-50 font-normal">
        <tr>
          <th scope="col" className="pl-4 pb-3  align-baseline ">
            {BalancesPendingRequestHeaders.token}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4  ">
            {BalancesPendingRequestHeaders.amount}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 hidden xl:table-cell lg:w-56 2xl:w-fit">
            {BalancesPendingRequestHeaders.platform_price}
          </th>

          <th scope="col" className="pb-3 align-baseline pr-4 whitespace-nowrap hidden xl:w-38 2xl:w-fit xl:table-cell">
            {BalancesPendingRequestHeaders.total_value}
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
              <BalancesRow key={i} rowData={rowData} />
            ))}
          </tbody>
        )
      }}
    </Table>
  )
}

export default Balances
