import { Global, Module } from '@nestjs/common'
import { ConfigModule, SendInversifyErrorsToSentry } from '@coti-cvi/common-be'
import { InversifyService } from './inversify.service'
import type {
  EmbedArmadilloDiscountInversifyService,
  GlobalEventsInversifyService,
  IlContractsInversifyService,
  ILProtectionInversifyService,
  LatestBlockInfoInversifyService,
  SignerInversifyService,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

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
  imports: [InitInversifyModule, SendInversifyErrorsToSentry],
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
      provide: 'SignerInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<SignerInversifyService> =>
        inversifyService.inverseContainer.getAsync('SignerInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'IlContractsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<IlContractsInversifyService> =>
        inversifyService.inverseContainer.getAsync('IlContractsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'EmbedArmadilloDiscountInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<EmbedArmadilloDiscountInversifyService> =>
        inversifyService.inverseContainer.getAsync('EmbedArmadilloDiscountInversifyService'),
      inject: [InversifyService],
    },
  ],
  exports: [
    'LatestBlockInfoInversifyService',
    'ILProtectionInversifyService',
    'EthersJsonRpcBatchProvider',
    'GlobalEventsInversifyService',
    'SignerInversifyService',
    'IlContractsInversifyService',
    'EmbedArmadilloDiscountInversifyService',
  ],
})
export class InversifyModule {}
