import type { BlockchainName, HardhatSupportedChainIds } from '../types'
import { NetworkName, ChainId, CHAIN_IDS_INFO } from '../types'

export function getChainId(chainId: string | number): ChainId | undefined {
  return Object.values(ChainId).find(c => c.toString() === chainId.toString())
}

export function toChainId(chainId: string | number): ChainId {
  const chainIdOrUndefined = getChainId(chainId)
  if (!chainIdOrUndefined) {
    throw new Error('unsupported chainId')
  }
  return chainIdOrUndefined
}

export function chainIdToBlockchainName(chainId: ChainId): BlockchainName {
  return CHAIN_IDS_INFO[chainId].blockchainName
}

export function isDev(chainId: ChainId): chainId is HardhatSupportedChainIds {
  return [NetworkName.Local, NetworkName.Staging].includes(CHAIN_IDS_INFO[chainId].networkName)
}
