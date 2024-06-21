import type { State, PendingRequestTableType } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'

import { useEffect } from 'react'
import { useAddress } from '../hooks/use-address'
import { useTvInversifyServices } from '../hooks/useTvInversifyServices'
import { useAppDispatch, actions } from '../redux'

export function VtEffects() {
  const dispatch = useAppDispatch()
  const { address } = useAddress()
  const { globalEventsInversifyService, vtInversifyService, vtContractsEventsInversifyService } =
    useTvInversifyServices()

  useEffect(() => {
    if (!globalEventsInversifyService || !address || !vtContractsEventsInversifyService) {
      return
    }

    const saveWithAddress = (_address: string, state: State<PendingRequestTableType>) => {
      if (address === _address) {
        dispatch(actions.setPendingRequestTable(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddressVT.on('vtPendingRequestTableWithAddress', saveWithAddress)

    vtContractsEventsInversifyService.registerNewPendingRequestTableEvents(address)

    return () => {
      globalEventsInversifyService.eventEmitterWithAddressVT.off('vtPendingRequestTableWithAddress', saveWithAddress)
    }
  }, [address, dispatch, globalEventsInversifyService, vtContractsEventsInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setPlatformUsdc(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterVolatility.on('vtPlatformUsdc', save)

    const cleanup = vtInversifyService.registerNewPlatformUsdcEvent()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterVolatility.off('vtPlatformUsdc', save)
    }
  }, [dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setMaxMintAmount(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterVolatility.on('vtMaxMintAmount', save)

    vtInversifyService.emitMaxMintAmountEvent()

    return () => {
      globalEventsInversifyService.eventEmitterVolatility.off('vtMaxMintAmount', save)
    }
  }, [dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setDexPrice(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterVolatility.on('vtDexPrice', save)

    const cleanup = vtInversifyService.registerNewDexPriceEvent()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterVolatility.off('vtDexPrice', save)
    }
  }, [dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setDailyFundingFee(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterVolatility.on('vtDailyFundingFee', save)

    const cleanup = vtInversifyService.registerNewDailyFundingFeeEvent()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterVolatility.off('vtDailyFundingFee', save)
    }
  }, [dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService) {
      return
    }

    const save = (state: State<number>) => {
      dispatch(actions.setCollateralRatio(Stator.cloneSerializable(state)))
    }

    globalEventsInversifyService.eventEmitterVolatility.on('vtCollateralRatio', save)

    const cleanup = vtInversifyService.registerNewCollateralRatioEvent()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterVolatility.off('vtCollateralRatio', save)
    }
  }, [dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService || !address) {
      return
    }

    const save = (_address: string, state: State<number>) => {
      if (address === _address) {
        dispatch(actions.setBurnBalance(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddressVT.on('vtBurnBalance', save)

    const cleanup = vtInversifyService.registerNewBurnBalanceEvent(address)

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitterWithAddressVT.off('vtBurnBalance', save)
    }
  }, [address, dispatch, globalEventsInversifyService, vtInversifyService])

  useEffect(() => {
    if (!globalEventsInversifyService || !vtInversifyService || !address) {
      return
    }

    const save = (_address: string, state: State<number>) => {
      if (address === _address) {
        dispatch(actions.setBalance(Stator.cloneSerializable(state)))
      }
    }

    globalEventsInversifyService.eventEmitterWithAddressVT.on('vtBalance', save)

    vtInversifyService.emitBalanceEvent(address)

    return () => {
      globalEventsInversifyService.eventEmitterWithAddressVT.off('vtBalance', save)
    }
  }, [address, dispatch, globalEventsInversifyService, vtInversifyService])

  return null
}
