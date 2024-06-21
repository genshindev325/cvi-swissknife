import { ConfigModule } from '@coti-cvi/common-be'
import type { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'
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
  ],
  exports: ['GlobalEventsInversifyService'],
})
export class InversifyModule {}
