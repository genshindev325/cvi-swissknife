import { ConfigModule } from '@coti-cvi/common-be'
import type {
  CviAdminApiInversifyService,
  CviAdminApiStakingInversifyService,
  CviAdminApiThetaVaultsInversifyService,
  CviAdminApiVolatilityTokensInversifyService,
  CviContractsInversifyService,
  FormatStakingContractsEventsInversifyService,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  StakingContractsEventsInversifyService,
} from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { Global, Module } from '@nestjs/common'
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
      provide: 'EthersJsonRpcBatchProvider',
      useFactory: (inversifyService: InversifyService): Promise<JsonRpcProvider> =>
        inversifyService.inverseContainer.getAsync('EthersJsonRpcBatchProvider'),
      inject: [InversifyService],
    },
    {
      provide: INVERSIFY_SERVICES.CVI_ADMIN_API,
      useFactory: (inversifyService: InversifyService): Promise<CviAdminApiInversifyService> =>
        inversifyService.inverseContainer.getAsync(INVERSIFY_SERVICES.CVI_ADMIN_API),
      inject: [InversifyService],
    },
    {
      provide: 'CviAdminApiStakingInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CviAdminApiStakingInversifyService> =>
        inversifyService.inverseContainer.getAsync('CviAdminApiStakingInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CviAdminApiThetaVaultsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CviAdminApiThetaVaultsInversifyService> =>
        inversifyService.inverseContainer.getAsync('CviAdminApiThetaVaultsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CviAdminApiVolatilityTokensInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CviAdminApiVolatilityTokensInversifyService> =>
        inversifyService.inverseContainer.getAsync('CviAdminApiVolatilityTokensInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CviContractsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CviContractsInversifyService> =>
        inversifyService.inverseContainer.getAsync('CviContractsInversifyService'),
      inject: [InversifyService],
    },

    {
      provide: 'FormatStakingContractsEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<FormatStakingContractsEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('FormatStakingContractsEventsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'StakingContractsEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<StakingContractsEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('StakingContractsEventsInversifyService'),
      inject: [InversifyService],
    },
  ],
  exports: [
    INVERSIFY_SERVICES.GLOBAL_EVENTS,
    INVERSIFY_SERVICES.LATEST_BLOCK,
    INVERSIFY_SERVICES.CVI_ADMIN_API,
    'EthersJsonRpcBatchProvider',
    'GlobalEventsInversifyService',
    'CviAdminApiStakingInversifyService',
    'CviAdminApiThetaVaultsInversifyService',
    'CviAdminApiVolatilityTokensInversifyService',
  ],
})
export class InversifyModule {}
