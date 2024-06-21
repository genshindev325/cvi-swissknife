import { ContainerModule } from 'inversify'
import type { ChainId } from '../types'
import { BlockchainName } from '../types'
import { CHAIN_IDS_INFO, TokenName } from '../types'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import { CviOldPlatformContractsEventsInversifyService } from '../contracts-events'
import { GetChainlinkTokenPriceAggregatorsInversifyService } from '../get-chainlink-token-price-aggregators.inversify.service'
import { UniswapInversifyService } from '../uniswap'
import { GenericContractInteractionInversifyService } from '../generic-contract-interaction.inversify.service'

const SUPPORTED = [BlockchainName.ARBITRUM, BlockchainName.POLYGON] as const

export function createContractsModule(options: { chainId: ChainId }): ContainerModule {
  return new ContainerModule(bind => {
    const supportedBlockchainName = SUPPORTED.find(b => b === CHAIN_IDS_INFO[options.chainId].blockchainName)
    if (supportedBlockchainName) {
      bind('TokenUSDC').toDynamicValue(async ({ container }) => {
        const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
          'GetContractInversifyService',
        )
        return getContractInversifyService.getToken(supportedBlockchainName, TokenName.USDC)
      })
      bind('TokenGOVI').toDynamicValue(async ({ container }) => {
        const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
          'GetContractInversifyService',
        )
        return getContractInversifyService.getToken(supportedBlockchainName, TokenName.GOVI)
      })
    }
    bind('GetChainlinkTokenPriceAggregatorsInversifyService').to(GetChainlinkTokenPriceAggregatorsInversifyService)
    bind('CviOldPlatformContractsEventsInversifyService').to(CviOldPlatformContractsEventsInversifyService)
    bind('UniswapInversifyService').to(UniswapInversifyService)
    bind('GenericContractInteractionInversifyService').to(GenericContractInteractionInversifyService)
  })
}
