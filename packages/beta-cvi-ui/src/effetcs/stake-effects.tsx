import type { State, UserStaking } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import { useEffect } from 'react'
import { useAddress } from '../hooks/use-address'
import { useTvInversifyServices } from '../hooks/useTvInversifyServices'
import type { ReduxState } from '../redux'
import { actions, useAppDispatch } from '../redux'

export function StakeEffects() {
  const dispatch = useAppDispatch()
  const { address } = useAddress()
  const { stakingInversifyService, globalEventsInversifyService } = useTvInversifyServices()

  useEffect(() => {
    if (!globalEventsInversifyService || !stakingInversifyService) {
      return
    }

    const save = (state: ReduxState['cvi']['stack']['platformStaking']) => {
      dispatch(actions.setPlatformStakingData(Stator.cloneSerializable(state)))
    }
    globalEventsInversifyService.eventEmitter.on('stakePlatformStakingInfo', save)

    stakingInversifyService.emitPlatformStakingEvents()

    return () => {
      globalEventsInversifyService.eventEmitter.off('stakePlatformStakingInfo', save)
    }
  }, [dispatch, globalEventsInversifyService, stakingInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !address || !stakingInversifyService) {
      return
    }

    const saveWithAddress = (
      _address: string,
      state: State<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }>,
    ) => {
      if (address === _address) {
        dispatch(actions.setUnstakeLock(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('stakeUnstakeLockWithAddress', saveWithAddress)

    stakingInversifyService.emitLockUstakeEvents(address)

    return () => {
      globalEventsInversifyService.eventEmitterWithAddress.off('stakeUnstakeLockWithAddress', saveWithAddress)
    }
  }, [address, dispatch, globalEventsInversifyService, stakingInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !address || !stakingInversifyService) {
      return
    }

    const saveWithAddress = (_address: string, state: State<UserStaking>) => {
      if (address === _address) {
        dispatch(actions.setStakingData(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('stakeStakingInfo', saveWithAddress)

    stakingInversifyService.emitUserStakingEvents(address)
    return () => {
      globalEventsInversifyService.eventEmitterWithAddress.off('stakeStakingInfo', saveWithAddress)
    }
  }, [address, dispatch, globalEventsInversifyService, stakingInversifyService])

  return null
}
