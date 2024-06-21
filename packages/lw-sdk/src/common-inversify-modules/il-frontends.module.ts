import { ContainerModule } from 'inversify'
import { IlContractsInversifyService } from '../il-contracts'
import { ILProtectionInversifyService } from '../il-protection.inversify.service'
import { AvailableProtectionsInversifyService } from '../available-protections.inversify.service'
import { ILContractsEventsInversifyService } from '../contracts-events/il-contract-events/il-contracts-events.inversify.service'
import { FormatILContractsEventsInversifyService } from '../contracts-events/il-contract-events/format-il-contract-events.inversify.service'
import { ETHPriceInversifyService } from '../eth-price-oracle.inversify.service'
import { EmbedArmadilloDiscountInversifyService } from '../embed/embed-armadillo-discount.inversify.service'
import type { IlSupportedChainIds } from '../types'
import { BlockchainName } from '../types'
import { CHAIN_IDS_INFO, NetworkName } from '../types'
import { EmbedHardhatImpersonationInversifyService } from '../embed/embed-hardhat-impersonation.inversify.service'
import { ILAdminApiInversifyService } from '../admin-panels/il-admin-panel'

export function createIlFrontendsModule(options: { chainId: IlSupportedChainIds }) {
  return new ContainerModule(bind => {
    bind('ETHPriceInversifyService').to(ETHPriceInversifyService)
    bind('IlContractsInversifyService').to(IlContractsInversifyService)
    bind('FormatILContractsEventsInversifyService').to(FormatILContractsEventsInversifyService)
    bind('ILProtectionInversifyService').to(ILProtectionInversifyService)
    bind('AvailableProtectionsInversifyService').to(AvailableProtectionsInversifyService)
    bind('ILContractsEventsInversifyService').to(ILContractsEventsInversifyService)
    bind('ILAdminApiInversifyService').to(ILAdminApiInversifyService)

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
