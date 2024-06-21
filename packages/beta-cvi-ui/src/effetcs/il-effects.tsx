import { useEffect } from 'react'
import usePromise from 'react-use-promise'
import type { IlBackendClientApi } from '../../../auto-generated-code/src'
import type { ProtectionId, ProtectionInfo, State } from '../../../lw-sdk/src'
import { Stator } from '../../../lw-sdk/src'
import { useAddress } from '../hooks/use-address'
import { useILInversifyServices } from '../hooks/useILInversifyServices'

import { useAppDispatch } from '../redux/hooks'
import { actions } from '../redux/store'

export function IlEffects() {
  const dispatch = useAppDispatch()
  const { address } = useAddress()
  const {
    embedArmadilloDiscountInversifyService,
    availableProtectionsInversifyService,
    iLAdminApiInversifyService,
    iLProtectionInversifyService,
    globalEventsInversifyService,
  } = useILInversifyServices()

  const [isEmbedDiscountFeatureEnabled] = usePromise(
    async () => embedArmadilloDiscountInversifyService?.isFeatureEnabled(),
    [embedArmadilloDiscountInversifyService],
  )

  useEffect(() => {
    if (isEmbedDiscountFeatureEnabled !== undefined) {
      dispatch(actions.setIsEmbedDiscountFeatureEnabled(isEmbedDiscountFeatureEnabled))
    }
  }, [dispatch, isEmbedDiscountFeatureEnabled])

  const [userEmbedInfo] = usePromise(
    async () => address && embedArmadilloDiscountInversifyService?.getEligiblilityForEmbedDiscount(address),
    [address, embedArmadilloDiscountInversifyService],
  )

  useEffect(() => {
    if (isEmbedDiscountFeatureEnabled && userEmbedInfo) {
      if (userEmbedInfo.isUsed === false) {
        dispatch(actions.setEmbedDiscountInfo(userEmbedInfo))
        dispatch(actions.setNftModal({ modalIsOpen: true }))
      }
    }
  }, [dispatch, isEmbedDiscountFeatureEnabled, userEmbedInfo])

  useEffect(() => {
    if (!availableProtectionsInversifyService || !address || !globalEventsInversifyService) {
      return
    }

    function save(state: State<IlBackendClientApi.IlLpTokensInfoOfAccountAddressDto>) {
      dispatch(actions.setLiquiditiesFromZapper(state))
    }

    globalEventsInversifyService.eventEmitter.on('ilLiquiditiesFromZapper', save)

    const cleanup = availableProtectionsInversifyService.listenToLiquiditiesFromZapper(address)

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitter.off('ilLiquiditiesFromZapper', save)
    }
  }, [address, availableProtectionsInversifyService, dispatch, globalEventsInversifyService])

  useEffect(() => {
    if (!availableProtectionsInversifyService || !globalEventsInversifyService) {
      return
    }

    function save(state: State<IlBackendClientApi.WorstIlOfTokenByCoinGekoDto[]>) {
      dispatch(actions.setPairsWorstIl(state))
    }

    globalEventsInversifyService.eventEmitter.on('ilPairsWorstIl', save)

    const cleanup = availableProtectionsInversifyService.listenToPairsWorstIl()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitter.off('ilPairsWorstIl', save)
    }
  }, [availableProtectionsInversifyService, dispatch, globalEventsInversifyService])

  useEffect(() => {
    if (!iLAdminApiInversifyService || !globalEventsInversifyService || !address) {
      return
    }

    function save(options: { address: string; protections: Map<ProtectionId, ProtectionInfo> }) {
      if (address === options.address) {
        dispatch(actions.setWalletProtections(Stator.resolve(Array.from(options.protections.values()))))
      }
    }

    globalEventsInversifyService.eventEmitter.on('ilWalletProtections', save)

    const result = iLAdminApiInversifyService.listenToProtectionEvents({ address })

    return () => {
      result.cleanup()
      globalEventsInversifyService.eventEmitter.off('ilWalletProtections', save)
    }
  }, [address, dispatch, globalEventsInversifyService, iLAdminApiInversifyService])

  useEffect(() => {
    if (!iLProtectionInversifyService || !globalEventsInversifyService) {
      return
    }

    function save(state: State<number>) {
      dispatch(actions.setAccumulatedTvpUsdc(state))
    }

    globalEventsInversifyService.eventEmitter.on('ilAccumulatedTvpUsdc', save)

    const cleanup = iLProtectionInversifyService.listenToAccumulatedTvpUsdc()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitter.off('ilAccumulatedTvpUsdc', save)
    }
  }, [dispatch, globalEventsInversifyService, iLProtectionInversifyService])

  useEffect(() => {
    if (!iLProtectionInversifyService || !globalEventsInversifyService) {
      return
    }

    function save(state: State<number>) {
      dispatch(actions.setTvpUsdc(state))
    }

    globalEventsInversifyService.eventEmitter.on('ilTvpUsdc', save)

    const cleanup = iLProtectionInversifyService.listenToTvpUsdc()

    return () => {
      cleanup()
      globalEventsInversifyService.eventEmitter.off('ilTvpUsdc', save)
    }
  }, [dispatch, globalEventsInversifyService, iLProtectionInversifyService])

  return null
}
