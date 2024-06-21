import { inject, injectable } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'

@injectable()
export class HardhatImpersonateAccountInversifyService {
  constructor(@inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider) {}

  public async impersonateAccount(account: string): Promise<void> {
    await this.ethersJsonRpcBatchProvider.send('hardhat_impersonateAccount', [account])
  }
}
