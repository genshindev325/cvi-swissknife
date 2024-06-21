import { Container } from 'inversify'
import {
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
  createContractsModule,
  createCviOracleEventsBackendModule,
} from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { CommonBlockchainEventsMonitorConfig } from '@coti-cvi/common-be'
import { createCommonBackendModule } from '@coti-cvi/common-be'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type {
  ChainId,
  GetContractInversifyService,
  Contracts,
  INVERSIFY_SERVICES,
  BlockchainContractEventsCacheUtils,
  CviOracleAdminApiInversifyService,
  CVIOracleInversifyService,
} from '@coti-cvi/lw-sdk'

export interface GetAsyncOverloads {
  (token: 'ChainId'): Promise<ChainId>
  (token: 'IsTestMode'): Promise<boolean>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'BlockchainContractEventsCacheUtils'): Promise<BlockchainContractEventsCacheUtils>
  (token: 'CVIOracleInversifyService'): Promise<CVIOracleInversifyService>
  (token: INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API): Promise<CviOracleAdminApiInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(config: CommonBlockchainEventsMonitorConfig): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('IsTestMode').toConstantValue(config.isTestMode)

  container.bind('ChainId').toConstantValue(config.serviceConfig.chainId)
  container.load(createCommonModule({ chainId: config.serviceConfig.chainId }))
  container.load(createContractsModule({ chainId: config.serviceConfig.chainId }))
  container.load(createCommonBackendModule({ redisInfo: config.serviceConfig.redis }))
  container.load(createCviOracleEventsBackendModule())

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

  constructor(@Inject('ConfigToken') readonly config: CommonBlockchainEventsMonitorConfig) {
    this.inverseContainer = initInversify(config)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
