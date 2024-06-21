import { Global, Module } from '@nestjs/common'
import {
  K8SLivenessCheckController,
  createLoggerModule,
  SentryModule,
  ConfigModule,
  SendInversifyErrorsToSentry,
  packagePath,
} from '@coti-cvi/common-be'
import { PrometheusModule } from './prometheus/prometheus.module'
import { InversifyModule } from './inversify/init-inversify.module'
import { K8SReadinessCheckController } from './k8s-readiness-check.controller'
import { CviOracleApiModule } from './cvi-oracle-api/cvi-oracle-api-module'

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
    CviOracleApiModule,
    InversifyModule,
    SendInversifyErrorsToSentry,
    ServiceInfoModule,
    PrometheusModule,
    SentryModule,
    createLoggerModule(),
    ConfigModule,
  ],
  controllers: [K8SLivenessCheckController, K8SReadinessCheckController],
})
export class AppModule {}
