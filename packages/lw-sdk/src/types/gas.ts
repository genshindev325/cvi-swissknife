import type { BigNumber } from 'ethers'

export interface Gas {
  maxFeePerGas?: BigNumber
  maxPriorityFeePerGas?: BigNumber
  gasPrice?: BigNumber
}
