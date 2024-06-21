import { Container } from 'inversify'
import type {
  ChainId,
  GetContractInversifyService,
  ZapperApiInversifyService,
  IlContractsInversifyService,
  Contracts,
  GasPriceInversifyService,
  ILAdminApiInversifyService,
  ILProtectionInversifyService,
  INVERSIFY_SERVICES,
  BackendInversifyConfig,
} from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
  createIlBackendAndCliModule,
  CoinGeckoInversifyService,
} from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { IlBackendConfig } from '@coti-cvi/common-be'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { FetchUniswapV2PairsInversifyService } from '@coti-cvi/lw-sdk'
import { WorstIlByCoinGeckoDailySwapsInversifyService } from '@coti-cvi/lw-sdk'

export interface GetAsyncOverloads {
  (token: 'ChainId'): Promise<ChainId>
  (token: 'JsonRpcProvider'): Promise<JsonRpcProvider>
  (token: 'ZapperApiKeys'): Promise<string[]>
  (token: 'ZapperProxy'): Promise<BackendInversifyConfig['zapper']['proxy']>
  (token: 'ZapperApiInversifyService'): Promise<ZapperApiInversifyService>
  (token: 'IsTestMode'): Promise<boolean>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'IlContractsInversifyService'): Promise<IlContractsInversifyService>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'ILProtectionInversifyService'): Promise<ILProtectionInversifyService>
  (token: 'GasPriceInversifyService'): Promise<GasPriceInversifyService>
  (token: 'FetchUniswapV2PairsInversifyService'): Promise<FetchUniswapV2PairsInversifyService>
  (token: INVERSIFY_SERVICES.IL_ADMIN_API): Promise<ILAdminApiInversifyService>
  (token: 'CoinGeckoInversifyService'): Promise<CoinGeckoInversifyService>
  (token: 'WorstIlByCoinGeckoDailySwapsInversifyService'): Promise<WorstIlByCoinGeckoDailySwapsInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(config: IlBackendConfig): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('CoinGeckoInversifyService').to(CoinGeckoInversifyService)
  container.bind('WorstIlByCoinGeckoDailySwapsInversifyService').to(WorstIlByCoinGeckoDailySwapsInversifyService)

  container.bind('ZapperApiKeys').toConstantValue(config.zapper.zapperApiKeys)
  container.bind('ZapperProxy').toConstantValue(config.zapper.proxy)
  container.bind('IsTestMode').toConstantValue(config.isTestMode)

  container.bind('ChainId').toConstantValue(config.serviceConfig.chainId)
  container.bind('S3Info').toConstantValue(config.serviceConfig.s3Info)

  container.load(createCommonModule({ chainId: config.serviceConfig.chainId }))
  container.load(createContractsModule({ chainId: config.serviceConfig.chainId }))
  container.load(createIlBackendAndCliModule({ chainId: config.serviceConfig.chainId }))

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

  constructor(@Inject('ConfigToken') readonly config: IlBackendConfig) {
    this.inverseContainer = initInversify(config)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
