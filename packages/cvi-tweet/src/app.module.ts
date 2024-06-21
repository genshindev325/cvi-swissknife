import { Global, Module } from '@nestjs/common'
import {
  K8SLivenessCheckController,
  createLoggerModule,
  SentryModule,
  ConfigModule,
  packagePath,
} from '@coti-cvi/common-be'
import { K8SReadinessCheckController } from './k8s-readiness-check.controller'
import { PrometheusModule } from './prometheus/prometheus.module'
import { TweetBotModule } from './tweet-bot/tweet-bot.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // <-- path to the static files
    }),
    ServiceInfoModule,
    PrometheusModule,
    SentryModule,
    createLoggerModule(),
    TweetBotModule,
    ConfigModule,
  ],
  controllers: [K8SLivenessCheckController, K8SReadinessCheckController],
})
export class AppModule {}
