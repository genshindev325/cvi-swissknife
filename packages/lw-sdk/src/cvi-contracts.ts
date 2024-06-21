import { inject, injectable, postConstruct } from 'inversify'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { Contracts, TvSupportedChainIds } from './types'
import { TV_SUPPORTED_CHAIN_IDS } from './types'
import { CHAIN_IDS_INFO } from './types'
import type {
  CVIUSDCThetaVault,
  CVIUSDCVolatilityToken,
  CVIUSDCPlatform,
  PlatformHelper,
  StakingV2,
  StakingVault,
  CVIUSDCThetaVaultRequestFulfiller,
} from '@coti-cvi/auto-generated-code/src/git-contract-types'

@injectable()
export class CviContractsInversifyService {
  public readonly chainId: TvSupportedChainIds

  public readonly stakingV2: StakingV2

  public readonly stakingVault: StakingVault

  public readonly volTokenContract: CVIUSDCVolatilityToken

  public readonly platformContract: CVIUSDCPlatform

  public readonly helper: PlatformHelper

  private readonly contractNames = new Map<string, string>()

  public readonly vaultCvi: CVIUSDCThetaVault

  public readonly requestFulfiller: CVIUSDCThetaVaultRequestFulfiller

  constructor(
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') chainId: TvSupportedChainIds,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('SingleDeploymentsFile') private readonly singleDeploymentsFile: Contracts,
  ) {
    const cviChainId = TV_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (cviChainId) {
      this.chainId = cviChainId
    } else {
      throw new Error(`ChainId ${chainId} is not supported for CVI`)
    }

    this.stakingV2 = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'StakingV2',
    )

    this.stakingVault = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'StakingVault',
    )

    this.volTokenContract = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCVolatilityToken',
    )

    this.platformContract = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCPlatform',
    )

    this.helper = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'PlatformHelper',
    )

    this.vaultCvi = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCThetaVault',
    )

    this.requestFulfiller = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCThetaVaultRequestFulfiller',
    )
  }

  @postConstruct()
  public async init() {
    for (const { address, name } of [
      { address: this.stakingVault.address.toLowerCase(), name: 'Staking Vault Contract' },
      { address: this.vaultCvi.address.toLowerCase(), name: `LP TV CVI Contract` },
      { address: this.helper.address.toLowerCase(), name: 'Helper' },
    ]) {
      this.contractNames.set(address, name)
    }
    const names = await Promise.all([
      this.stakingV2.name().then(name => ({ address: this.stakingV2.address, name })),
      this.volTokenContract.name().then(name => ({ address: this.volTokenContract.address, name })),
      this.platformContract.name().then(name => ({ address: this.platformContract.address, name })),
    ])

    for (const { address, name } of names) {
      this.contractNames.set(address, name)
    }
  }

  public getContractName(address: string): string | undefined {
    return (
      this.contractNames.get(address) ??
      Object.entries(this.singleDeploymentsFile).find(
        ([_contractName, info]) => info.address.toLowerCase() === address.toLowerCase(),
      )?.[0]
    )
  }
}
