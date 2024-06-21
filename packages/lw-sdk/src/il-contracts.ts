import { inject, injectable } from 'inversify'
import type {
  ILProtectionConfig,
  ILProtectionController,
  ILProtectionDiscountNFTController,
  ILProtectionNFT,
  LiquidityController,
  TokenPairRepository,
} from '@coti-cvi/auto-generated-code/contracts'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { IlSupportedChainIds, ChainId } from './types'
import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS } from './types'

@injectable()
export class IlContractsInversifyService {
  public readonly chainId: IlSupportedChainIds

  public readonly controller: ILProtectionController

  public readonly liquidity: LiquidityController

  public readonly config: ILProtectionConfig

  public readonly nft: ILProtectionNFT

  public readonly tokenPairRepository: TokenPairRepository

  public readonly ilProtectionDiscountNftController: ILProtectionDiscountNFTController

  constructor(
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') chainId: ChainId,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
  ) {
    const ilChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (ilChainId) {
      this.chainId = ilChainId
    } else {
      throw new Error(`ChainId ${chainId} is not supported for IL`)
    }
    this.controller = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ILProtectionController',
    )

    this.liquidity = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'LiquidityController',
    )

    this.config = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ILProtectionConfig',
    )

    this.nft = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ILProtectionNFT',
    )

    this.tokenPairRepository = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'TokenPairRepository',
    )

    this.ilProtectionDiscountNftController = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'ILProtectionDiscountNFTController',
    )
  }
}
