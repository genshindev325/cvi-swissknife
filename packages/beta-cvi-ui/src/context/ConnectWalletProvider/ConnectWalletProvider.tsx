import type { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'

import { CVI_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'

import type { FC, PropsWithChildren } from 'react'
import { createContext, useState, useEffect } from 'react'
import CommonModal from '../../components/Modals/CommonModal'
import type { InitInversifyReturnType } from '../../services/init-inversify'
import { cviUiInitInversify } from '../../services/init-inversify'
import { useAppDispatch } from '../../redux/hooks'
import { actions } from 'beta-cvi-ui/src/redux'

import { useDisconnect, useNetwork, useSigner } from 'wagmi'

import usePromise from 'react-use-promise'
import { useChain } from '../../hooks/use-chain'
import { useAddress } from '../../hooks/use-address'
import type { MemoryHistory, Update } from 'history'
import { createMemoryHistory } from 'history'

export enum WebSite {
  Cvi = 'CVI',
  Armadillo = 'ARMADILLO',
}

export interface IWeb3Api {
  inversifyContainer?: InitInversifyReturnType
  globalEventsInversifyService?: GlobalEventsInversifyService
}

const defaultChainContext: IWeb3Api = {}

export const walletContext = createContext<IWeb3Api>(defaultChainContext)
//
const ConnectWalletProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useAppDispatch()

  const { walletChainId, selectedChainInfo, isSupported, setDefaultChainInfo } = useChain()

  const [inversifyContainer, setInversifyContainer] = useState<InitInversifyReturnType>()
  const [wrongNetworkModalIsOpen, setWrongNetworkModalIsOpen] = useState<boolean>(false)
  const { data: signer } = useSigner()
  const { disconnect } = useDisconnect()
  const [signerAddress] = usePromise(async () => signer?.getAddress(), [signer])

  const { chain, chains } = useNetwork()
  const { address, impersonatedMode } = useAddress()

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const onConnect = () => {
    dispatch(actions.setConnectWalletModal({ modalIsOpen: true }))
  }

  useEffect(() => {
    dispatch(actions.setProviderAddress(signerAddress))
  }, [dispatch, signerAddress])

  useEffect(() => {
    const inversify = cviUiInitInversify(selectedChainInfo.chainId, signer ?? undefined)
    setInversifyContainer(inversify)
    return () => {
      inversify.closeContainer()
    }
  }, [selectedChainInfo.chainId, signer])

  const [history, setHistory] = useState<MemoryHistory>()
  const [historyPaths, setHisotryPaths] = useState<Update[]>([])

  useEffect(() => {
    const h = createMemoryHistory()
    setHistory(h)
    const stop = h.listen(update => setHisotryPaths(prev => [...prev, update]))
    return () => {
      stop()
    }
  }, [])

  useEffect(() => {
    if (inversifyContainer) {
      inversifyContainer.sentryExtras['connected-address'] = address
      inversifyContainer.sentryExtras['impersonate-mode-enabled'] = impersonatedMode
      inversifyContainer.sentryExtras['wallet-chain-id'] = walletChainId
      inversifyContainer.sentryExtras['is-wallet-chain-id-supported'] = isSupported
      inversifyContainer.sentryExtras[
        'selected-chain'
      ] = `${selectedChainInfo.hardhatConfigNetworkName} (${selectedChainInfo.chainId})`
      inversifyContainer.sentryExtras['history-in-application'] = historyPaths.map(h => `${h.action} -> ${h.location}`)
    }
  }, [
    address,
    historyPaths,
    impersonatedMode,
    inversifyContainer,
    isSupported,
    selectedChainInfo.chainId,
    selectedChainInfo.hardhatConfigNetworkName,
    walletChainId,
  ])

  useEffect(() => {
    if (chain?.id && isSupported && address) {
      const wagmiChainId = chain?.id

      const findChain = CVI_SUPPORTED_CHAIN_IDS.map(c => CHAIN_IDS_INFO[c]).find(
        c => c.chainId === String(wagmiChainId),
      )

      if (findChain !== undefined) {
        if (findChain.chainId !== selectedChainInfo.chainId) {
          setDefaultChainInfo(findChain)
        }
      }
    }
  }, [chain?.id, address, isSupported, selectedChainInfo.chainId, setDefaultChainInfo])

  useEffect(() => {
    if (chain?.unsupported) {
      disconnect()
      setWrongNetworkModalIsOpen(true)
    }
  }, [chain?.name, chain?.unsupported, chains, disconnect])

  if (!inversifyContainer) {
    return null
  }

  return (
    <>
      <CommonModal title="Wrong network" showModal={wrongNetworkModalIsOpen} setShowModal={setWrongNetworkModalIsOpen}>
        <span className="flex flex-col gap-3">
          <span className="flex flex-row gap-4 mt-4">
            <p className="">
              Your wallet is not connected to <span className="capitalize">{selectedChainInfo.blockchainName}</span>.
            </p>

            <span className="underline underline-offset-4 text-common-turquoise cursor-pointer" onClick={onConnect}>
              Connect to <span className="capitalize">{selectedChainInfo.blockchainName}</span>
            </span>
          </span>
          <span>
            To access CVI v2{' '}
            <a className="underline underline-offset-4 text-common-turquoise" href="https://v2.cvi.finance/">
              click here
            </a>{' '}
          </span>
        </span>
      </CommonModal>
      <walletContext.Provider value={{ globalEventsInversifyService, inversifyContainer }}>
        {children}
      </walletContext.Provider>
    </>
  )
}

export default ConnectWalletProvider
