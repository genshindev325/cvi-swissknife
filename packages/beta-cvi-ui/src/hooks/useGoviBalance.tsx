import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import { useCallback } from 'react'
import { useAddress } from './use-address'

import { useEventEmitter } from './useEventEmitter'

export default function useGoviBalance() {
  const { tokenGOVI } = useTvInversifyServices()
  const { address } = useAddress()

  const getBalanceUsdcEventEmitterCallback = useCallback(
    () => address && tokenGOVI?.getBalanceEventEmitter(address),
    [address, tokenGOVI],
  )

  return useEventEmitter({
    getEventEmitter: getBalanceUsdcEventEmitterCallback,
    subscribeTo: 'balance',
  }).balance
}
