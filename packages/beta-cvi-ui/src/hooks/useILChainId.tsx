import { IL_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk/src'
import { useChain } from './use-chain'

export function useILChainId() {
  const { selectedChainInfo } = useChain()

  const ilChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === selectedChainInfo.chainId)

  if (!ilChainId) {
    throw new Error(`ChainId: ${selectedChainInfo.chainId} is not supported in IL Components`)
  }

  return ilChainId
}
