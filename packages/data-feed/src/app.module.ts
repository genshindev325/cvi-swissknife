import { Global, Module } from '@nestjs/common'
import {
  K8SLivenessCheckController,
  createLoggerModule,
  SentryModule,
  ConfigModule,
  DatabaseConnectionModule,
  packagePath,
} from '@coti-cvi/common-be'
import { TokensModule } from './tokens/tokens.module'
import { K8sModule } from './k8s/k8s.module'
import { CviIndexesHistoryModule } from './cvi-indexes-history/cvi-indexes-history.module'
import { K8SReadinessCheckController } from './k8s-readiness-check.controller'
import { PrometheusModule } from './prometheus/prometheus.module'
import type { InitInversifyReturnType } from './init-inversify'
import { initInversify } from './init-inversify'

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

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'InversifyContainerNestJsToken',
      useFactory: (): InitInversifyReturnType => initInversify(),
      inject: [],
    },
  ],
  exports: ['InversifyContainerNestJsToken'],
})
export class InitInversifyModule {}

@Module({
  imports: [
    InitInversifyModule,
    DatabaseConnectionModule,
    CviIndexesHistoryModule,
    TokensModule,
    K8sModule,
    ServiceInfoModule,
    PrometheusModule,
    SentryModule,
    createLoggerModule(),
    ConfigModule,
  ],
  controllers: [K8SLivenessCheckController, K8SReadinessCheckController],
})
export class AppModule {}
