import type { Signer } from 'ethers'
import type { Contract } from 'ethers'
import { inject, injectable } from 'inversify'

@injectable()
export class SignerInversifyService {
  constructor(
    @inject('Signer') public readonly signer: Signer,
    @inject('SignerAddress') public readonly address: string,
  ) {}

  public with<T extends Contract>(contract: T): T {
    return contract.connect(this.signer) as T
  }
}
