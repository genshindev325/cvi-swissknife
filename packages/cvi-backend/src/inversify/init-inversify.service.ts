import { Container } from 'inversify'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
  createCviModule,
  CviAdminApiInversifyService,
  CviAdminApiStakingInversifyService,
  CviAdminApiThetaVaultsInversifyService,
  CviAdminApiVolatilityTokensInversifyService,
  LatestGeneralInfoOfEventByAddressInversifyService,
} from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { CviBackendConfig } from '@coti-cvi/common-be'
import { createCommonBackendModule } from '@coti-cvi/common-be'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type {
  ChainId,
  GetContractInversifyService,
  Contracts,
  GasPriceInversifyService,
  INVERSIFY_SERVICES,
  FormatStakingContractsEventsInversifyService,
  CviContractsInversifyService,
  UniswapInversifyService,
} from '@coti-cvi/lw-sdk'
import type { StakingContractsEventsInversifyService } from '@coti-cvi/lw-sdk'

export interface GetAsyncOverloads {
  (token: 'ChainId'): Promise<ChainId>
  (token: 'JsonRpcProvider'): Promise<JsonRpcProvider>
  (token: 'IsTestMode'): Promise<boolean>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GasPriceInversifyService'): Promise<GasPriceInversifyService>
  (token: 'CviAdminApiStakingInversifyService'): Promise<CviAdminApiStakingInversifyService>
  (token: 'CviAdminApiThetaVaultsInversifyService'): Promise<CviAdminApiThetaVaultsInversifyService>
  (token: 'CviAdminApiVolatilityTokensInversifyService'): Promise<CviAdminApiVolatilityTokensInversifyService>
  (token: 'CviContractsInversifyService'): Promise<CviContractsInversifyService>
  (token: 'FormatStakingContractsEventsInversifyService'): Promise<FormatStakingContractsEventsInversifyService>
  (token: 'StakingContractsEventsInversifyService'): Promise<StakingContractsEventsInversifyService>
  (token: 'UniswapInversifyService'): Promise<UniswapInversifyService>
  (token: INVERSIFY_SERVICES.CVI_ADMIN_API): Promise<CviAdminApiInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(config: CviBackendConfig): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('IsTestMode').toConstantValue(config.isTestMode)

  container.bind('ChainId').toConstantValue(config.serviceConfig.chainId)

  container.load(createCommonModule({ chainId: config.serviceConfig.chainId }))
  container.load(createContractsModule({ chainId: config.serviceConfig.chainId }))
  container.load(createCommonBackendModule({ redisInfo: config.serviceConfig.redis }))
  container.load(createCviModule())

  container.bind('CviAdminApiStakingInversifyService').to(CviAdminApiStakingInversifyService)
  container.bind('CviAdminApiThetaVaultsInversifyService').to(CviAdminApiThetaVaultsInversifyService)
  container.bind('CviAdminApiVolatilityTokensInversifyService').to(CviAdminApiVolatilityTokensInversifyService)
  container
    .bind('LatestGeneralInfoOfEventByAddressInversifyService')
    .to(LatestGeneralInfoOfEventByAddressInversifyService)
  container.bind('CviAdminApiInversifyService').to(CviAdminApiInversifyService)
  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  return {
    getAsync: container.getAsync.bind(container),
    closeContainer: async () => {
      await container.unbindAllAsync()
    },
  }
}

export class InversifyService implements OnModuleDestroy {
  public readonly inverseContainer: InitInversifyReturnType

  constructor(@Inject('ConfigToken') readonly config: CviBackendConfig) {
    this.inverseContainer = initInversify(config)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
