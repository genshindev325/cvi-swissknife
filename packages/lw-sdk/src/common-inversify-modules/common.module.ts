import { ContainerModule } from 'inversify'
import { CHAIN_IDS_INFO } from '../types'
import type { Contracts, ChainId } from '../types'
import { GetContractInversifyService } from '../get-contract.inversify.service'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { getSingleDeploymentsFile } from '../get-single-deployments-file'
import type { Signer } from 'ethers'
import { SignerInversifyService } from '../signer.inversify.service'
import { ProviderInversifyService } from '../provider.inversify.service'
import { OverridesInversifyService } from '../overrides.inversify.service'
import { GetForkNumberInversifyService, getSinger, isDev } from '../util'
import {
  HardhatAdvanceTimeInversifyService,
  HardhatImpersonateAccountInversifyService,
  HardhatCommandsInversifyService,
} from '../hardhat'
import { AsyncQueueInversifyService } from '../async-queue.inversify.service'
import { IpGeoLocationInversifyService } from '../ip-geo-location.inversify.service'
import { BlockchainContractEventsCacheUtils } from '../contracts-events'
import { CVIOracleInversifyService } from '../cvi-oracle.inversify.service'
import { CacheInversifyService } from '../cache.inversify.service'

export function createCommonModule(
  options: { chainId: ChainId } & (
    | {
        privateKey: string
      }
    | { impersonatedPublicWalletAddress: string }
    | { signer: Signer }
    | {}
  ),
): ContainerModule {
  return new ContainerModule((bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation) => {
    bind('CacheInversifyService').to(CacheInversifyService)
    bind('AsyncQueueInversifyService').to(AsyncQueueInversifyService)
    bind<Contracts>('SingleDeploymentsFile').toDynamicValue(() => getSingleDeploymentsFile(options.chainId))
    const provider = new JsonRpcBatchProvider(CHAIN_IDS_INFO[options.chainId].cviRpcUrl)
    bind('EthersJsonRpcBatchProvider').toConstantValue(provider)
    onDeactivation('EthersJsonRpcBatchProvider', (provider: JsonRpcProvider) => {
      provider.removeAllListeners()
    })
    bind('ProviderInversifyService').to(ProviderInversifyService)
    bind('OverridesInversifyService').to(OverridesInversifyService)
    bind('GetContractInversifyService').to(GetContractInversifyService)
    bind('IpGeoLocationInversifyService').to(IpGeoLocationInversifyService)
    bind('BlockchainContractEventsCacheUtils').to(BlockchainContractEventsCacheUtils)
    bind('CVIOracleInversifyService').to(CVIOracleInversifyService)

    const signer =
      'privateKey' in options || 'impersonatedPublicWalletAddress' in options || 'signer' in options
        ? getSinger({ provider, ...options })
        : undefined

    if (signer) {
      bind('Signer').toConstantValue(signer)
      bind('SignerAddress').toDynamicValue(() => signer.getAddress())
      bind('SignerInversifyService').to(SignerInversifyService)
    }

    if (isDev(options.chainId)) {
      bind('GetForkNumberInversifyService').to(GetForkNumberInversifyService)
      bind('HardhatAdvanceTimeInversifyService').to(HardhatAdvanceTimeInversifyService)
      bind('HardhatImpersonateAccountInversifyService').to(HardhatImpersonateAccountInversifyService)
      bind('HardhatCommandsInversifyService').to(HardhatCommandsInversifyService)
    }
  })
}
