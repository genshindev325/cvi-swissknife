import { Container } from 'inversify'
import {
  createCommonModule,
  createContractsModule,
  GasPriceInversifyService,
  GlobalEventsInversifyService,
  inversifyBuilder,
  LatestBlockInfoInversifyService,
  ChainLinkKeepersRegistryInversifyService,
} from '@coti-cvi/lw-sdk'
import type {
  SignerInversifyService,
  Contracts,
  TvSupportedChainIds,
  GetContractInversifyService,
  ThetaVaultInversifyService,
  VtInversifyService,
  CviContractsInversifyService,
  VtReBaserInversifyService,
  VtContractsEventsInversifyService,
  TvContractsEventsInversifyService,
  UniswapInversifyService,
  RedisInfo,
  CVIOracleInversifyService,
  IERC20,
  Token,
  TokenName,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { createCviModule } from '@coti-cvi/lw-sdk'
import type { TvMonitorConfig } from '@coti-cvi/common-be'
import { createCommonBackendModule } from '@coti-cvi/common-be'

export type InitInversifyReturnType = {
  getAsync: {
    (token: 'ChainId'): Promise<TvSupportedChainIds>
    (token: 'SingleDeploymentsFile'): Promise<Contracts>
    (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
    (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
    (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
    (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
    (token: 'SignerInversifyService'): Promise<SignerInversifyService>
    (token: 'GasPriceInversifyService'): Promise<GasPriceInversifyService>
    (token: 'ThetaVaultInversifyService'): Promise<ThetaVaultInversifyService>
    (token: 'VtInversifyService'): Promise<VtInversifyService>
    (token: 'VtReBaserInversifyService'): Promise<VtReBaserInversifyService>
    (token: 'VtContractsEventsInversifyService'): Promise<VtContractsEventsInversifyService>
    (token: 'CviContractsInversifyService'): Promise<CviContractsInversifyService>
    (token: 'TvContractsEventsInversifyService'): Promise<TvContractsEventsInversifyService>
    (token: 'UniswapInversifyService'): Promise<UniswapInversifyService>
    (token: 'CVIOracleInversifyService'): Promise<CVIOracleInversifyService>
    (token: 'TokenUSDC'): Promise<Token<IERC20, TokenName.USDC>>
    (token: 'ChainLinkKeepersRegistryInversifyService'): Promise<ChainLinkKeepersRegistryInversifyService>
  }
  closeContainer: () => void
}

export function initInversify(
  chainId: TvSupportedChainIds,
  signerInfo:
    | {
        privateKey: string
      }
    | { impersonatedPublicWalletAddress: string },
  redisInfo: RedisInfo,
): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('ChainId').toConstantValue(chainId)
  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)
  container.bind('GasPriceInversifyService').to(GasPriceInversifyService)
  container.bind('ChainLinkKeepersRegistryInversifyService').to(ChainLinkKeepersRegistryInversifyService)

  container.load(createCommonModule({ chainId, ...signerInfo }))
  container.load(createContractsModule({ chainId }))
  container.load(createCviModule())
  container.load(createCommonBackendModule({ redisInfo }))

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  const builder = inversifyBuilder(container, globalEventsInversifyService)
  return {
    getAsync: builder.getAsync,
    closeContainer: builder.closeContainer,
  }
}

export class InversifyService implements OnModuleDestroy {
  public readonly inverseContainer: InitInversifyReturnType

  constructor(@Inject('ConfigToken') readonly config: TvMonitorConfig) {
    const signerInfo = config.serviceConfig.signer[config.serviceConfig.chainId]
    this.inverseContainer = initInversify(config.serviceConfig.chainId, signerInfo, config.serviceConfig.redis)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
