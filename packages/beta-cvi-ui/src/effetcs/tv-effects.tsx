import type { State } from '@coti-cvi/lw-sdk/src/state'
import { Stator } from '@coti-cvi/lw-sdk/src/state'
import type { PositionOfAddress } from '@coti-cvi/lw-sdk/src/theta-vault'
import type { VaultTransaction } from '@coti-cvi/lw-sdk/src/types'
import { useEffect } from 'react'
import { useAddress } from '../hooks/use-address'
import { useTvInversifyServices } from '../hooks/useTvInversifyServices'
import { useAppDispatch, actions } from '../redux'

export function TvEffects() {
  const dispatch = useAppDispatch()
  const { address } = useAddress()
  const { thetaVaultInversifyService, globalEventsInversifyService, tvContractsEventsInversifyService } =
    useTvInversifyServices()

  useEffect(() => {
    if (!globalEventsInversifyService || !tvContractsEventsInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setTvTvlUsdc(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterTVault.on('tvTvlUsdc', save)

    const cleanup = tvContractsEventsInversifyService.registerNewTvlUsdcEvent()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterTVault.off('tvTvlUsdc', save)
    }
  }, [dispatch, globalEventsInversifyService, tvContractsEventsInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !tvContractsEventsInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.seTvUtilizationPercentage(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterTVault.on('tvUtilizationPercentage', save)

    const cleanup = tvContractsEventsInversifyService.registerNewTvUtilizationPercentage()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterTVault.off('tvUtilizationPercentage', save)
    }
  }, [dispatch, globalEventsInversifyService, tvContractsEventsInversifyService])

  useEffect(
    function listenToCollateralRatio() {
      if (!globalEventsInversifyService || !tvContractsEventsInversifyService) {
        return
      }

      const save = (state: State<number>) => {
        dispatch(actions.setTvCollateralRatio(Stator.cloneSerializable(state)))
      }

      globalEventsInversifyService.eventEmitterTVault.on('tvCollateralRatio', save)

      const cleanup = tvContractsEventsInversifyService.registerNewCollateralRatioEvent()

      return () => {
        cleanup()
        globalEventsInversifyService.eventEmitterTVault.off('tvCollateralRatio', save)
      }
    },
    [dispatch, globalEventsInversifyService, tvContractsEventsInversifyService],
  )

  useEffect(
    function listenToCollateralRatio() {
      if (!globalEventsInversifyService || !tvContractsEventsInversifyService) {
        return
      }

      const save = (state: State<number>) => {
        dispatch(actions.setTvMaxCapacityUsdc(Stator.cloneSerializable(state)))
      }

      globalEventsInversifyService.eventEmitterTVault.on('tvMaxCapacityUsdc', save)

      const cleanup = tvContractsEventsInversifyService.registerNewMaxCapacityUsdcEvent()

      return () => {
        cleanup()
        globalEventsInversifyService.eventEmitterTVault.off('tvMaxCapacityUsdc', save)
      }
    },
    [dispatch, globalEventsInversifyService, tvContractsEventsInversifyService],
  )

  useEffect(() => {
    if (!globalEventsInversifyService || !tvContractsEventsInversifyService || !address) {
      return
    }

    const save = (_address: string, state: State<PositionOfAddress>) => {
      if (address === _address) {
        dispatch(actions.setPositionOfAddress(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('tvPositionOfAddress', save)

    const cleanup = tvContractsEventsInversifyService.registerNewPositionOfAddressEvent(address)

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterWithAddress.off('tvPositionOfAddress', save)
    }
  }, [address, dispatch, globalEventsInversifyService, tvContractsEventsInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !tvContractsEventsInversifyService || !address) {
      return
    }

    const save = (_address: string, state: State<VaultTransaction[]>) => {
      if (address === _address) {
        dispatch(actions.setTvVaultTransactions(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('tvTransactionsOfAddress', save)

    const cleanup = tvContractsEventsInversifyService.registerNewTransactionsOfAddressEvent(address)

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterWithAddress.off('tvTransactionsOfAddress', save)
    }
  }, [address, dispatch, globalEventsInversifyService, tvContractsEventsInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !address || !thetaVaultInversifyService) {
      return
    }

    const saveWithAddress = (
      _address: string,
      state: State<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }>,
    ) => {
      if (address === _address) {
        dispatch(actions.setWithrawLock(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('tvWithdrawLockWithAddress', saveWithAddress)

    thetaVaultInversifyService.emitLockWithdrawEvents(address)

    return () => {
      globalEventsInversifyService.eventEmitterWithAddress.off('tvWithdrawLockWithAddress', saveWithAddress)
    }
  }, [address, dispatch, globalEventsInversifyService, thetaVaultInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !thetaVaultInversifyService || !address) {
      return
    }

    const save = (_address: string, state: State<{ pnl: number; percent: number }>) => {
      if (_address === address) {
        dispatch(actions.setPnl(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddress.on('tvPnl', save)

    thetaVaultInversifyService.emitPnlEvents(address)
    return () => {
      globalEventsInversifyService.eventEmitterWithAddress.off('tvPnl', save)
    }
  }, [address, dispatch, globalEventsInversifyService, thetaVaultInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !thetaVaultInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setAPR(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterTVault.on('tvAPR', save)

    thetaVaultInversifyService.emitAPREvents()
    return () => {
      globalEventsInversifyService.eventEmitterTVault.off('tvAPR', save)
    }
  }, [address, dispatch, globalEventsInversifyService, thetaVaultInversifyService])

  return null
}
