import { inject, injectable } from 'inversify'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { Contracts, VestingSupportedChainIds } from './types'
import { VESTING_SUPPORTED_CHAIN_IDS } from './types'
import { CHAIN_IDS_INFO } from './types'
import type {
  EsGOVIRewardTrackerDistributor,
  EsGOVIRewardTracker,
  GOVIRewardTrackerDistributor,
  GOVIRewardTracker,
  GOVIVester,
  ThetaVaultRewardTrackerDistributor,
  ThetaVaultRewardTracker,
  ThetaVaultVester,
  RewardRouter,
} from '@coti-cvi/auto-generated-code/src/git-contract-types'

@injectable()
export class VestingContractsInversifyService {
  public readonly chainId: VestingSupportedChainIds

  public readonly esGoviRewardTrackerDistributor: EsGOVIRewardTrackerDistributor

  public readonly esGoviRewardTracker: EsGOVIRewardTracker

  public readonly goviRewardTrackerDistributor: GOVIRewardTrackerDistributor

  public readonly goviRewardTracker: GOVIRewardTracker

  public readonly goviVester: GOVIVester

  public readonly thetaVaultRewardTrackerDistributor: ThetaVaultRewardTrackerDistributor

  public readonly thetaVaultRewardTracker: ThetaVaultRewardTracker

  public readonly thetaVaultVester: ThetaVaultVester

  public readonly rewardRouter: RewardRouter

  constructor(
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') chainId: VestingSupportedChainIds,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('SingleDeploymentsFile') private readonly singleDeploymentsFile: Contracts,
  ) {
    const cviChainId = VESTING_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (cviChainId) {
      this.chainId = cviChainId
    } else {
      throw new Error(`ChainId ${chainId} is not supported for staking-vesting`)
    }

    this.esGoviRewardTrackerDistributor = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'EsGOVIRewardTrackerDistributor',
    )

    this.esGoviRewardTracker = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'EsGOVIRewardTracker',
    )

    this.goviRewardTrackerDistributor = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'GOVIRewardTrackerDistributor',
    )

    this.goviRewardTracker = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'GOVIRewardTracker',
    )

    this.goviVester = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'GOVIVester',
    )

    this.thetaVaultRewardTrackerDistributor = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ThetaVaultRewardTrackerDistributor',
    )

    this.thetaVaultRewardTracker = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ThetaVaultRewardTracker',
    )

    this.thetaVaultVester = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ThetaVaultVester',
    )

    this.rewardRouter = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'RewardRouter',
    )
  }
}
