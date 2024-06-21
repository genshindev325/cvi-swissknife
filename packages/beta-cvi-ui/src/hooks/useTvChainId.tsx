import { TV_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk/src'
import { useChain } from './use-chain'

export function useTvChainId() {
  const { selectedChainInfo } = useChain()

  const tvChainId = TV_SUPPORTED_CHAIN_IDS.find(c => c === selectedChainInfo.chainId)

  if (!tvChainId) {
    throw new Error(`ChainId: ${selectedChainInfo.chainId} is not supported in Theta-Vault Components`)
  }

  return tvChainId
}
