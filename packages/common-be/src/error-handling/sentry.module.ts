import type { NestModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '../config'
import { SentryController } from './sentry.controller'
import { SentryInterceptor } from './sentry.interceptor'
import { SentryService } from './sentry.service'

@Module({
  imports: [ConfigModule],
  providers: [
    SentryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  controllers: [SentryController],
  exports: [SentryService],
})
export class SentryModule implements NestModule {
  configure() {
    //
  }
}
