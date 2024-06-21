import type { JsonRpcProvider } from '@ethersproject/providers'
import { inject, injectable } from 'inversify'
import { GasHelper } from './gas-helper'
import type { ChainId } from './types'
import type { Gas } from './types'

@injectable()
export class GasPriceInversifyService {
  public gasHelper: GasHelper

  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('ChainId') readonly chainId: ChainId,
  ) {
    this.gasHelper = new GasHelper(chainId, provider)
  }

  public getGas = async (txType = 2): Promise<Gas> => {
    return this.gasHelper.getGas(txType)
  }
}
