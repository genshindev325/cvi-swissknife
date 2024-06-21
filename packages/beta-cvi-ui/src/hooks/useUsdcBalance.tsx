import { useCallback } from 'react'

import { useAddress } from './use-address'

import { useUsdcToken } from './use-usdc-token'
import { useEventEmitter } from './useEventEmitter'

export default function useUsdcBalance() {
  const tokenUSDC = useUsdcToken()

  const { address } = useAddress()

  const getBalanceUsdcEventEmitterCallback = useCallback(
    () => address && tokenUSDC?.getBalanceEventEmitter(address),
    [address, tokenUSDC],
  )

  return useEventEmitter({
    getEventEmitter: getBalanceUsdcEventEmitterCallback,
    subscribeTo: 'balance',
  }).balance
}
