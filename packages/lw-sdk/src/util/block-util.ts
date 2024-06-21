import type { State } from '../state'
import type { Block } from '../types/block-types'

export class BlockUtil {
  constructor(public readonly latestBlock: State<Block>) {}

  public blockTimestamp() {
    return this.latestBlock.data?.timestamp ?? 0
  }

  public blockNumber() {
    return this.latestBlock.data?.number ?? 0
  }
}
