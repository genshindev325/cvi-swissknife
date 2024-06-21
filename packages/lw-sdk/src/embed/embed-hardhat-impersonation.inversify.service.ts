import { inject, injectable, postConstruct } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { getSinger } from '../util'
import type { HardhatCommandsInversifyService, HardhatImpersonateAccountInversifyService } from '../hardhat'
import type { IlContractsInversifyService } from '../il-contracts'
import type { EmbedArmadilloDiscountInversifyService } from './embed-armadillo-discount.inversify.service'

@injectable()
export class EmbedHardhatImpersonationInversifyService {
  constructor(
    @inject('EthersJsonRpcBatchProvider') private readonly provider: JsonRpcProvider,
    @inject('HardhatImpersonateAccountInversifyService')
    private readonly hardhatImpersonateAccountInversifyService: HardhatImpersonateAccountInversifyService,
    @inject('HardhatCommandsInversifyService')
    private readonly hardhatCommandsInversifyService: HardhatCommandsInversifyService,
    @inject('IlContractsInversifyService')
    private readonly ilContractsInversifyService: IlContractsInversifyService,
    @inject('EmbedArmadilloDiscountInversifyService')
    private readonly embedArmadilloDiscountInversifyService: EmbedArmadilloDiscountInversifyService,
  ) {}

  @postConstruct()
  public async init() {
    await this.whitelistIlContract()
  }

  private async whitelistIlContract(): Promise<void> {
    const ownerAddress = await this.embedArmadilloDiscountInversifyService.embedContract.owner()
    await Promise.all([
      this.hardhatImpersonateAccountInversifyService.impersonateAccount(ownerAddress),
      // give 1M matics to the owner to do singed transactions
      this.hardhatCommandsInversifyService.setBalance(ownerAddress, 1_000_000),
    ])
    const ownerSinger = getSinger({
      provider: this.provider,
      impersonatedPublicWalletAddress: ownerAddress,
    })
    const signEdembedContract = this.embedArmadilloDiscountInversifyService.embedContract.connect(ownerSinger)

    await Promise.all([
      signEdembedContract.setAllowed(ownerAddress, 5), // to allow mint nfts
      signEdembedContract.setAllowed(this.ilContractsInversifyService.ilProtectionDiscountNftController.address, 2), // to whitelist armadillo to determine nft as used
    ])
  }

  public async mintNft(mintToAddress: string, discountTypeId: number): Promise<void> {
    const ownerAddress = await this.embedArmadilloDiscountInversifyService.embedContract.owner()
    const ownerSinger = getSinger({
      provider: this.provider,
      impersonatedPublicWalletAddress: ownerAddress,
    })
    const signEdembedContract = this.embedArmadilloDiscountInversifyService.embedContract.connect(ownerSinger)
    await signEdembedContract.mint(mintToAddress, 1, discountTypeId)
  }
}
