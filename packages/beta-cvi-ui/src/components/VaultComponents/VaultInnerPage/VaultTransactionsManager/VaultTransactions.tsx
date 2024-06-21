import classNames from 'classnames'
import { useAppSelector } from '../../../../redux'
import Table from '../../../Table/Table'
import VaultTransactionsRow from './VaultTransactionsRow'

const VaultTransactions = () => {
  const vaultTransactions = useAppSelector(({ state }) => state.cvi.tv.vaultTransactions)

  return (
    <Table
      state={vaultTransactions}
      className="right-auto"
      tableClassName="border-separate  border-spacing-y-2"
      pendingClassName="ml-5"
      resolvedClassName="flex items-center gap-6 w-full  bg-dark-600 justify-center h-32 rounded-2xl"
      type="transactionsTable"
      connectGuard
      name="vault transactions"
    >
      <thead className="text-sm text-white text-opacity-50 font-normal ">
        <tr>
          <th scope="col" className={classNames({ 'pl-6 align-baseline w-4/5 md:w-fit hidden md:table-cell': true })}>
            Submit Date
          </th>

          <th scope="col" className="align-baseline hidden md:table-cell">
            Action
          </th>

          <th scope="col" className="align-baseline hidden md:table-cell">
            Amount
          </th>

          <th scope="col" className="align-baseline hidden md:table-cell">
            <span className="mr-1">Status</span>
          </th>
        </tr>
      </thead>

      {data => (
        <tbody className={classNames({ ' text-white text-sm ': true })}>
          {data.map(vt => (
            <VaultTransactionsRow key={vt.txHash} {...vt} />
          ))}
        </tbody>
      )}
    </Table>
  )
}

export default VaultTransactions
