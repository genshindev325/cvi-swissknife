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
import { MonitorModule } from './monitor/monitor.module'
import { RecurringPremiumBuyerBotModule } from './recurring-premium-buyer-bot/recurring-premium-buyer-bot.module'

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
    RecurringPremiumBuyerBotModule,
    InversifyModule,
    ServiceInfoModule,
    PrometheusModule,
    SendInversifyErrorsToSentry,
    SentryModule,
    createLoggerModule(),
    ConfigModule,
    MonitorModule,
    KeepersBotModule,
  ],
  controllers: [K8SLivenessCheckController, K8SReadinessCheckController],
})
export class AppModule {}
