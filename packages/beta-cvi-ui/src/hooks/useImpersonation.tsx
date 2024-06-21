import type { RequestStatus } from '@coti-cvi/lw-sdk'
import { NetworkName } from '@coti-cvi/lw-sdk'
import { useState, useCallback } from 'react'
import usePromise from 'react-use-promise'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { actions } from '../redux/store'
import { useAddress } from './use-address'
import { useChain } from './use-chain'
import { useWallet } from './useWallet'

export function useImpersonation(onCloseEvent?: Function) {
  const dispatch = useAppDispatch()
  const impersolatedAddress = useAppSelector(state => state.state.impersolatedAddress)
  const { selectedChainInfo } = useChain()
  const { inversifyContainer } = useWallet()
  const { address } = useAddress()

  const [impersonationRequestStatus, setImpersonationRequestStatus] = useState<RequestStatus>('resolved')
  const [hardhatImpersonateAccountInversifyService] = usePromise(async () => {
    if (
      selectedChainInfo.networkName !== NetworkName.Mainnet &&
      inversifyContainer &&
      selectedChainInfo.chainId === inversifyContainer.chainId
    ) {
      return inversifyContainer.getAsync('HardhatImpersonateAccountInversifyService')
    }
  }, [inversifyContainer, selectedChainInfo])
  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const onImpersonation = useCallback(
    async (address: string) => {
      if (hardhatImpersonateAccountInversifyService) {
        setImpersonationRequestStatus('pending')
        await hardhatImpersonateAccountInversifyService.impersonateAccount(address)
        setImpersonationRequestStatus('resolved')
      }
      dispatch(actions.enterImpersolatedAddress(address))
      globalEventsInversifyService?.clearCache()
      if (onCloseEvent) {
        onCloseEvent()
      }
    },
    [dispatch, globalEventsInversifyService, hardhatImpersonateAccountInversifyService, onCloseEvent],
  )

  const onExitImpersonation = () => {
    dispatch(actions.exitImpersolationMode())
    globalEventsInversifyService?.clearCache()
  }

  return {
    onImpersonation,
    onExitImpersonation,
    impersonationRequestStatus,
    address,
    impersolatedAddress,
    hardhatImpersonateAccountInversifyService,
  }
}
