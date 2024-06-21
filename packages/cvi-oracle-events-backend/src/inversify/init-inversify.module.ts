import { ConfigModule } from '@coti-cvi/common-be'
import type {
  CviOracleAdminApiInversifyService,
  CVIOracleInversifyService,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
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
      provide: 'EthersJsonRpcBatchProvider',
      useFactory: (inversifyService: InversifyService): Promise<JsonRpcProvider> =>
        inversifyService.inverseContainer.getAsync('EthersJsonRpcBatchProvider'),
      inject: [InversifyService],
    },
    {
      provide: INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API,
      useFactory: (inversifyService: InversifyService): Promise<CviOracleAdminApiInversifyService> =>
        inversifyService.inverseContainer.getAsync(INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API),
      inject: [InversifyService],
    },
    {
      provide: 'LatestBlockInfoInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<LatestBlockInfoInversifyService> =>
        inversifyService.inverseContainer.getAsync('LatestBlockInfoInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CVIOracleInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CVIOracleInversifyService> =>
        inversifyService.inverseContainer.getAsync('CVIOracleInversifyService'),
      inject: [InversifyService],
    },
  ],
  exports: [
    INVERSIFY_SERVICES.GLOBAL_EVENTS,
    INVERSIFY_SERVICES.LATEST_BLOCK,
    INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API,
    'EthersJsonRpcBatchProvider',
    'LatestBlockInfoInversifyService',
    'GlobalEventsInversifyService',
    'CVIOracleInversifyService',
  ],
})
export class InversifyModule {}
