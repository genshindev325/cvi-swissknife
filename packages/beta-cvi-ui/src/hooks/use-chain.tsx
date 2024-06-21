import type { CVISupportedChainIds } from '@coti-cvi/lw-sdk/src'
import { CHAIN_IDS_INFO, CVI_SUPPORTED_CHAIN_IDS, NetworkName } from '@coti-cvi/lw-sdk/src'
import { useNetwork } from 'wagmi'

import { useLocalStorage } from './use-local-storage-state'

export type UseChainResult =
  | {
      isSupported: false
      walletChainId?: string
      selectedChainInfo: typeof CHAIN_IDS_INFO[CVISupportedChainIds]
      setDefaultChainInfo: React.Dispatch<React.SetStateAction<typeof CHAIN_IDS_INFO[CVISupportedChainIds]>>
      reason: string
    }
  | {
      isSupported: true
      walletChainId: string
      selectedChainInfo: typeof CHAIN_IDS_INFO[CVISupportedChainIds]
      setDefaultChainInfo: React.Dispatch<React.SetStateAction<typeof CHAIN_IDS_INFO[CVISupportedChainIds]>>
    }

export function useChain(): UseChainResult {
  const { chain } = useNetwork()
  const [fullMode] = useLocalStorage('fullMode')

  const [defaultChain, setDefaultChainInfo] = useLocalStorage('defaultChain')

  if (!chain) {
    return {
      isSupported: false,
      walletChainId: undefined,

      selectedChainInfo: defaultChain,
      reason: 'no chain to connect to',
      setDefaultChainInfo,
    }
  }

  if (chain.unsupported) {
    return {
      isSupported: false,
      walletChainId: chain.id.toString(),

      selectedChainInfo: defaultChain,
      reason: 'User is connected to unsupported chain-id',
      setDefaultChainInfo,
    }
  }

  const selectedChainInfo = CVI_SUPPORTED_CHAIN_IDS.map(chainId => CHAIN_IDS_INFO[chainId]).find(
    c => c.chainId.toString() === chain.id.toString(),
  )

  if (!selectedChainInfo) {
    throw new Error(`can't be here. the wallet-chain-id (${chain.id}) is supported!`)
  }

  if (!fullMode && selectedChainInfo.networkName !== NetworkName.Mainnet) {
    return {
      isSupported: false,

      selectedChainInfo: defaultChain,
      reason: 'local/staging is supported only in full-mode',
      setDefaultChainInfo,
    }
  }

  return {
    isSupported: true,
    walletChainId: chain.id.toString(),
    selectedChainInfo,

    setDefaultChainInfo,
  }
}
