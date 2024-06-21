import { Container } from 'inversify'
import {
  createIlBackendAndCliModule,
  createCommonModule,
  createContractsModule,
  GasPriceInversifyService,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
} from '@coti-cvi/lw-sdk'
import type {
  GetContractInversifyService,
  ILProtectionInversifyService,
  SignerInversifyService,
  Contracts,
  IlContractsInversifyService,
  IlSupportedChainIds,
  EmbedArmadilloDiscountInversifyService,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { IlMonitorConfig } from '@coti-cvi/common-be'

export type InitInversifyReturnType = {
  getAsync: {
    (token: 'ChainId'): Promise<IlSupportedChainIds>
    (token: 'SingleDeploymentsFile'): Promise<Contracts>
    (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
    (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
    (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
    (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
    (token: 'ILProtectionInversifyService'): Promise<ILProtectionInversifyService>
    (token: 'SignerInversifyService'): Promise<SignerInversifyService>
    (token: 'GasPriceInversifyService'): Promise<GasPriceInversifyService>
    (token: 'IlContractsInversifyService'): Promise<IlContractsInversifyService>
    (token: 'EmbedArmadilloDiscountInversifyService'): Promise<EmbedArmadilloDiscountInversifyService>
  }
  closeContainer: () => void
}

export function initInversify(
  chainId: IlSupportedChainIds,
  signerInfo:
    | {
        privateKey: string
      }
    | { impersonatedPublicWalletAddress: string },
): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('ChainId').toConstantValue(chainId)
  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)
  container.bind('GasPriceInversifyService').to(GasPriceInversifyService)

  container.load(createCommonModule({ chainId, ...signerInfo }))
  container.load(createContractsModule({ chainId }))
  container.load(createIlBackendAndCliModule({ chainId }))

  return {
    getAsync: container.getAsync.bind(container),
    closeContainer: async () => {
      await container.unbindAllAsync()
    },
  }
}

export class InversifyService implements OnModuleDestroy {
  public readonly inverseContainer: InitInversifyReturnType

  constructor(@Inject('ConfigToken') readonly config: IlMonitorConfig) {
    const signerInfo = config.serviceConfig.ilSigner[config.serviceConfig.chainId]
    this.inverseContainer = initInversify(config.serviceConfig.chainId, signerInfo)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
