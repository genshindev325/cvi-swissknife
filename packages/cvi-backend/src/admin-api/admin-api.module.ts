import type { CviBackendConfig } from '@coti-cvi/common-be'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { CacheModule, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { InversifyModule } from '../inversify/init-inversify.module'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { AdminApiController, TTL_MINUTES_REFRESH_CACHE } from './admin-api.controller'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { AdminApiInterceptor } from './admin-api.interceptor'

@Module({
  imports: [
    InversifyModule,
    ConfigModule,
    SentryModule,
    PrometheusModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: CviBackendConfig, logger: Logger) => {
        const adminApiCachingConfig = config.serviceConfig.adminApiCachingConfig

        const ttl = TTL_MINUTES_REFRESH_CACHE * 60_000
        let store = 'memory'
        let host: string | undefined = undefined
        let port: number | undefined = undefined

        if (adminApiCachingConfig.useRedis) {
          store = 'redis'
          host = config.serviceConfig.redis.host
          port = config.serviceConfig.redis.port
        }
        logger.info(
          `Admin-Api-Controller Cache using: ${store == 'redis' ? `redis [${host}:${port}]` : `in-memory`} (ttl: ${
            ttl / 60_000
          } min/s)`,
        )

        return {
          store,
          host,
          port,
          ttl: TTL_MINUTES_REFRESH_CACHE * 60_000,
        }
      },
      inject: ['ConfigToken', WINSTON_MODULE_PROVIDER],
    }),
  ],
  controllers: [AdminApiController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminApiInterceptor,
    },
  ],
})
export class AdminApiModule {}
