import type { BigNumber } from 'ethers'
import { inject, injectable } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'

@injectable()
export class ProviderInversifyService {
  constructor(@inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider) {}

  public getBalance(account: string): Promise<BigNumber> {
    return this.provider.getBalance(account)
  }
}
