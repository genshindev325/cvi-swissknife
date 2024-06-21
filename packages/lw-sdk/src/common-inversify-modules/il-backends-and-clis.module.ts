import { ContainerModule } from 'inversify'
import { IlContractsInversifyService } from '../il-contracts'
import { ILProtectionInversifyService } from '../il-protection.inversify.service'
import { AvailableProtectionsInversifyService } from '../available-protections.inversify.service'
import { ILContractsEventsInversifyService } from '../contracts-events/il-contract-events/il-contracts-events.inversify.service'
import { ZapperApiInversifyService } from '../zapper-api'
import { FormatILContractsEventsInversifyService } from '../contracts-events/il-contract-events/format-il-contract-events.inversify.service'
import { FetchUniswapV2PairsInversifyService } from '../thegraph/fetch-uniswap-v2-pairs.inversify.service'
import { S3InversifyService } from '../s3.inversify.service'
import { EmbedArmadilloDiscountInversifyService } from '../embed/embed-armadillo-discount.inversify.service'
import type { IlSupportedChainIds } from '../types'
import { BlockchainName } from '../types'
import { CHAIN_IDS_INFO, NetworkName } from '../types'
import { EmbedHardhatImpersonationInversifyService } from '../embed/embed-hardhat-impersonation.inversify.service'
import { ILAdminApiInversifyService } from '../admin-panels/il-admin-panel'

export function createIlBackendAndCliModule(options: { chainId: IlSupportedChainIds }) {
  return new ContainerModule(bind => {
    bind('S3InversifyService').to(S3InversifyService)
    bind('FetchUniswapV2PairsInversifyService').to(FetchUniswapV2PairsInversifyService)
    bind('IlContractsInversifyService').to(IlContractsInversifyService)
    bind('FormatILContractsEventsInversifyService').to(FormatILContractsEventsInversifyService)
    bind('ILProtectionInversifyService').to(ILProtectionInversifyService)
    bind('AvailableProtectionsInversifyService').to(AvailableProtectionsInversifyService)
    bind('ILContractsEventsInversifyService').to(ILContractsEventsInversifyService)
    bind('ILAdminApiInversifyService').to(ILAdminApiInversifyService)
    bind('ZapperApiInversifyService').to(ZapperApiInversifyService)

    if (CHAIN_IDS_INFO[options.chainId].blockchainName === BlockchainName.POLYGON) {
      bind('EmbedArmadilloDiscountInversifyService').to(EmbedArmadilloDiscountInversifyService)
    }
    if (
      CHAIN_IDS_INFO[options.chainId].networkName === NetworkName.Staging ||
      CHAIN_IDS_INFO[options.chainId].networkName === NetworkName.Local
    ) {
      bind('EmbedHardhatImpersonationInversifyService').to(EmbedHardhatImpersonationInversifyService)
    }
  })
}
