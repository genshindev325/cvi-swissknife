import { BlockchainName } from './types'
import type { Block } from './types'

export const BLOCK_RATE_BY_CHAIN: { [chain in BlockchainName]: number } = {
  [BlockchainName.ETHEREUM]: 13.43,
  [BlockchainName.POLYGON]: 2.3077148437499995,
  [BlockchainName.ARBITRUM]: 3.219,
}

export function getBlockFromTimestamp(chain: BlockchainName, currentBlock: Block, timestamp: number): number {
  const seconds = currentBlock.timestamp - timestamp
  return Math.floor(currentBlock.number - seconds / BLOCK_RATE_BY_CHAIN[chain])
}
