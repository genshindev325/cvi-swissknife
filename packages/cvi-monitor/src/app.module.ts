import { Global, Module } from '@nestjs/common'
import {
  K8SLivenessCheckController,
  createLoggerModule,
  SentryModule,
  ConfigModule,
  packagePath,
  SendInversifyErrorsToSentry,
} from '@coti-cvi/common-be'
import { K8SReadinessCheckController } from './k8s-readiness-check.controller'
import { PrometheusModule } from './prometheus/prometheus.module'
import { InversifyModule } from './inversify/inversify.module'
import { KeepersBotModule } from './keepers-bot/keepers-bot.module'
import { ArbitrageBotModule } from './arbitrage-bot/arbitrage-bot.module'

@Global()
@Module({
  providers: [
    {
      provide: 'ServiceDirPathToken',
      useFactory: () => packagePath(__dirname),
    },
  ],
  exports: ['ServiceDirPathToken'],
})
export class ServiceInfoModule {}

@Module({
  imports: [
    ArbitrageBotModule,
    InversifyModule,
    ServiceInfoModule,
    PrometheusModule,
    SendInversifyErrorsToSentry,
    SentryModule,
    createLoggerModule(),
    ConfigModule,
    KeepersBotModule,
  ],
  controllers: [K8SLivenessCheckController, K8SReadinessCheckController],
})
export class AppModule {}
