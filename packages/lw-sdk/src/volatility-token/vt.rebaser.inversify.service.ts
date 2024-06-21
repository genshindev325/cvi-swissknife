import { inject, injectable, optional } from 'inversify'
import type { ContractReceipt } from 'ethers'
import type { CVIUSDCRebaser } from '@coti-cvi/auto-generated-code/contracts'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import { CHAIN_IDS_INFO } from '../types'
import type { TvSupportedChainIds } from '../types'

@injectable()
export class VtReBaserInversifyService {
  public readonly rebaserContract: CVIUSDCRebaser

  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {
    this.rebaserContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCRebaser',
    )
  }

  public async checkUpkeep() {
    return this.rebaserContract.checkUpkeep([0])
  }

  public async performUpkeep(performData: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    return this.rebaserContract.connect(signer).performUpkeep(performData, await this.overridesService.get())
  }

  public upkeep = async (): Promise<{ upkeepNeeded: false } | { upkeepNeeded: true; receipt: ContractReceipt }> => {
    const { upkeepNeeded, performData } = await this.checkUpkeep()
    if (upkeepNeeded) {
      const receipt = await (await this.performUpkeep(performData)).wait()
      return { upkeepNeeded, receipt }
    }
    return { upkeepNeeded }
  }

  public async rebase() {
    const owner = await this.rebaserContract.owner()
    const ownerSigner = this.getContractService.provider.getSigner(owner)
    return (await this.rebaserContract.connect(ownerSigner).rebase(await this.overridesService.get())).wait()
  }

  public serviceName(): 'rebaser' {
    return 'rebaser'
  }
}
