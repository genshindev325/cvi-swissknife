import { inject, injectable, postConstruct } from 'inversify'
import { BlockchainName, CHAIN_IDS_INFO, EmbedDiscountName } from '../types'
import type { DiscountTypeInfo, DiscountTypeInfoState, EmbedDiscountForAddress, Address, ChainId } from '../types'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import type { IlContractsInversifyService } from '../il-contracts'
import type { EmbedPolygonMainnet } from '@coti-cvi/auto-generated-code/src/common-abi-types/EmbedPolygonMainnet'

@injectable()
export class EmbedArmadilloDiscountInversifyService {
  public discountTypesInfo: DiscountTypeInfo[] = []

  public readonly embedContract: EmbedPolygonMainnet

  constructor(
    @inject('ChainId') chainId: ChainId,
    @inject('IlContractsInversifyService') readonly ilContractsInversifyService: IlContractsInversifyService,
    @inject('GetContractInversifyService') readonly getContractInversifyService: GetContractInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {
    const chainInfo = CHAIN_IDS_INFO[chainId]
    if (chainInfo.blockchainName === BlockchainName.POLYGON) {
      this.embedContract = getContractInversifyService.getContractFromDeploymentsFile(
        chainInfo.blockchainName,
        'ILProtectionDiscountNFT',
      )
    } else {
      throw new Error(`wrong chain-id for embed-discount`)
    }
  }

  @postConstruct()
  public async init() {
    try {
      this.discountTypesInfo = await this.getPossibleDiscountsDetails()
    } catch (error) {
      this.globalEventsInversifyService.emit('errors', error)
    }
  }

  public isFeatureEnabled(): Promise<boolean> {
    return this.ilContractsInversifyService.ilProtectionDiscountNftController.enabled()
  }

  public async getPossibleDiscountsDetails(): Promise<DiscountTypeInfo[]> {
    const discountTypes = await this.embedContract.getAllTokenTypeIndecies().then(r => r.map(x => x.toNumber()))
    const discountTypesInfo = await Promise.all(discountTypes.map(r => this.embedContract.getTokenTypeInfo(r)))
    return discountTypesInfo.map(r => {
      const name = Object.values(EmbedDiscountName).find(n => n === r.name)
      if (!name) {
        throw new Error(
          `invalid name of embed discount came from contract: ${r.name}. valid names: ${Object.values(
            EmbedDiscountName,
          )}`,
        )
      }
      return {
        typeId: r.index.toNumber(),
        supply: r.supply.toNumber(),
        name,
      }
    })
  }

  public async getStatistics(): Promise<DiscountTypeInfoState[]> {
    const discountTypesInfo = await Promise.all(
      this.discountTypesInfo.map(r => this.embedContract.getTokenTypeInfo(r.typeId)),
    )

    return discountTypesInfo.map(r => {
      const name = Object.values(EmbedDiscountName).find(n => n === r.name)
      if (!name) {
        throw new Error(
          `invalid name of embed discount came from contract: ${r.name}. valid names: ${Object.values(
            EmbedDiscountName,
          )}`,
        )
      }
      return {
        name,
        typeId: r.index.toNumber(),
        supply: r.supply.toNumber(),
        eligibleWalletsCount: r.minted.toNumber(),
        usedWalletsCount: r.used.toNumber(),
      }
    })
  }

  public async getEligiblilityForEmbedDiscount(address: Address): Promise<EmbedDiscountForAddress | undefined> {
    const eligibility = await this.embedContract.getTokenInfo(address)

    if (!eligibility.minted) {
      return undefined
    }

    const discountTypeId = eligibility.index.toNumber()

    const discountTypeInfo = this.discountTypesInfo.find(r => r.typeId === discountTypeId)

    if (!discountTypeInfo) {
      console.log(`embed changed their implementation of discount -  we will take everything again...`)
      this.discountTypesInfo = await this.getPossibleDiscountsDetails()
      return this.getEligiblilityForEmbedDiscount(address)
    }

    return {
      discountTypeId,
      discountTypeName: discountTypeInfo.name,
      isUsed: eligibility.used,
    }
  }
}
