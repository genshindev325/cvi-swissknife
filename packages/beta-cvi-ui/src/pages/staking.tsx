import React, { useEffect, useState } from 'react'
import CommonModal from '../components/Modals/CommonModal'
import StakeUnstake from '../components/StakingComponents/StakeUnstake'
import StakingMainPage from '../components/StakingComponents/StakingMainPage'
import { useAddress } from '../hooks/use-address'
import { useTvInversifyServices } from '../hooks/useTvInversifyServices'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { actions } from '../redux/store'
const StakingPage = () => {
  const dispatch = useAppDispatch()
  const { stakingInversifyService } = useTvInversifyServices()
  const stakeUnstakeModal = useAppSelector(state => state.state.stakeUnstakeModal)
  const latestBlock = useAppSelector(state => state.state.latestBlock)
  const unstakeLock = useAppSelector(state => state.state.cvi.stack.unstakeLock)
  const { address } = useAddress()
  const [isUpdateOnce, setIsUpdateOnce] = useState(true)

  useEffect(() => {
    if (!isUpdateOnce && latestBlock.data && unstakeLock.data && unstakeLock.data.isLocked) {
      const secondsLeft = unstakeLock.data.lockEndTimestamp - latestBlock.data.timestamp
      if (secondsLeft > 0 && !isUpdateOnce) {
        setIsUpdateOnce(true)
      }
    }
  }, [isUpdateOnce, latestBlock.data, unstakeLock.data])

  useEffect(() => {
    if (stakingInversifyService && address && latestBlock.data && unstakeLock.data && unstakeLock.data?.isLocked) {
      // we dont use unstakeLock.data.timeLeftSeconds  because we want to be able to manipulate the time using hardhat for tests
      const secondsLeft = unstakeLock.data.lockEndTimestamp - latestBlock.data.timestamp

      if (secondsLeft <= 0 && isUpdateOnce) {
        stakingInversifyService.emitLockUstakeEvents(address)
        setIsUpdateOnce(false)
      }
    }
  }, [address, isUpdateOnce, latestBlock.data, stakingInversifyService, unstakeLock.data])

  return (
    <>
      <CommonModal
        type="stakeUnstakeModal"
        showModal={stakeUnstakeModal.modalIsOpen}
        setShowModal={() => dispatch(actions.setStakeUnstakeModal({ ...stakeUnstakeModal, modalIsOpen: false }))}
      >
        <StakeUnstake
          type={stakeUnstakeModal.title}
          setShowStakeUnstakeModal={() =>
            dispatch(actions.setStakeUnstakeModal({ ...stakeUnstakeModal, modalIsOpen: false }))
          }
        />
      </CommonModal>
      <div className="flex flex-col justify-center items-center h-full w-full mt-4 md:mt-16 px-6">
        <StakingMainPage />
      </div>
    </>
  )
}
export default StakingPage
