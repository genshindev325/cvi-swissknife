import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { Module } from '@nestjs/common'
import { InversifyModule } from '../inversify/init-inversify.module'
import { AdminApiController } from './admin-api.controller'
import { AdminApiService } from './admin-api.service'

@Module({
  imports: [InversifyModule, ConfigModule, SentryModule],
  controllers: [AdminApiController],
  providers: [AdminApiService],
  exports: [AdminApiService],
})
export class AdminApiModule {}
