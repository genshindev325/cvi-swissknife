import { ConfigModule } from '@coti-cvi/common-be'
import type {
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  ILAdminApiInversifyService,
  IlContractsInversifyService,
  ILProtectionInversifyService,
  CoinGeckoInversifyService,
  WorstIlByCoinGeckoDailySwapsInversifyService,
} from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { Global, Module } from '@nestjs/common'
import type { FetchUniswapV2PairsInversifyService } from '@coti-cvi/lw-sdk'
import { InversifyService } from './init-inversify.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    InversifyService,
    {
      provide: 'InversifyContainerNestJsToken',
      useFactory: (inversifyService: InversifyService) => inversifyService.inverseContainer,
      inject: [InversifyService],
    },
  ],
  exports: [InversifyService, 'InversifyContainerNestJsToken'],
})
export class InitInversifyModule {}

@Module({
  imports: [InitInversifyModule],
  providers: [
    {
      provide: 'GlobalEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<GlobalEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('GlobalEventsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'LatestBlockInfoInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<LatestBlockInfoInversifyService> =>
        inversifyService.inverseContainer.getAsync('LatestBlockInfoInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'ILProtectionInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<ILProtectionInversifyService> =>
        inversifyService.inverseContainer.getAsync('ILProtectionInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'EthersJsonRpcBatchProvider',
      useFactory: (inversifyService: InversifyService): Promise<JsonRpcProvider> =>
        inversifyService.inverseContainer.getAsync('EthersJsonRpcBatchProvider'),
      inject: [InversifyService],
    },
    {
      provide: 'IlContractsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<IlContractsInversifyService> =>
        inversifyService.inverseContainer.getAsync('IlContractsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: INVERSIFY_SERVICES.IL_ADMIN_API,
      useFactory: (inversifyService: InversifyService): Promise<ILAdminApiInversifyService> =>
        inversifyService.inverseContainer.getAsync(INVERSIFY_SERVICES.IL_ADMIN_API),
      inject: [InversifyService],
    },
    {
      provide: 'FetchUniswapV2PairsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<FetchUniswapV2PairsInversifyService> =>
        inversifyService.inverseContainer.getAsync('FetchUniswapV2PairsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CoinGeckoInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CoinGeckoInversifyService> =>
        inversifyService.inverseContainer.getAsync('CoinGeckoInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'WorstIlByCoinGeckoDailySwapsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<WorstIlByCoinGeckoDailySwapsInversifyService> =>
        inversifyService.inverseContainer.getAsync('WorstIlByCoinGeckoDailySwapsInversifyService'),
      inject: [InversifyService],
    },
  ],
  exports: [
    INVERSIFY_SERVICES.GLOBAL_EVENTS,
    INVERSIFY_SERVICES.LATEST_BLOCK,
    'ILProtectionInversifyService',
    'EthersJsonRpcBatchProvider',
    'GlobalEventsInversifyService',
    'IlContractsInversifyService',
    INVERSIFY_SERVICES.IL_ADMIN_API,
    'FetchUniswapV2PairsInversifyService',
    'CoinGeckoInversifyService',
    'WorstIlByCoinGeckoDailySwapsInversifyService',
  ],
})
export class InversifyModule {}
