import { useParams, Navigate } from 'react-router-dom'
import DepositWithdraw from './DepositWithdraw/DepositWithdraw'
import PositionStakingDetails from './PositionStakingDetails'
import VaultInnerPageHeader from './VaultInnerPageHeader/VaultInnerPageHeader'
import VaultTransactionsManager from './VaultTransactionsManager/VaultTransactionsManager'
import { CviName, PathName } from '../../../types/common.types'

const VaultInnerPage = () => {
  const param = useParams()
  return (
    <>
      {param.id === CviName['1x'] ? (
        <div className="m-auto px-6 rounded-xl md:px-0 md:w-[45rem] lg:w-[52rem] mt-4 md:mt-16 flex flex-col gap-4 md:gap-6">
          <div className="relative gap-2">
            <VaultInnerPageHeader vaultName={param.id === CviName['1x'] ? '1x' : '2x'} />
          </div>
          <div className=" flex flex-col md:flex-row  justify-between gap-4 md:gap-8">
            <DepositWithdraw />
            <PositionStakingDetails />
          </div>
          <div className="md:mt-10">
            <VaultTransactionsManager />
          </div>
        </div>
      ) : param.id === PathName.dashboard ? (
        <Navigate to="/dashboard" replace={true} />
      ) : (
        <Navigate to="/vaults" replace={true} />
      )}
    </>
  )
}

export default VaultInnerPage
