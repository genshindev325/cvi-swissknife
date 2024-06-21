import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { Module } from '@nestjs/common'
import { InversifyModule } from '../inversify/init-inversify.module'
import { WrapperController } from './wrapper-controller'

@Module({
  imports: [InversifyModule, ConfigModule, SentryModule],
  controllers: [WrapperController],
})
export class WrapperModule {}
