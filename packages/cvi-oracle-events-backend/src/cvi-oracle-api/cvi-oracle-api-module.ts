import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { Module } from '@nestjs/common'
import { InversifyModule } from '../inversify/init-inversify.module'
import { CviOracleApiController } from './cvi-oracle-api-controller'

@Module({
  imports: [InversifyModule, ConfigModule, SentryModule],
  controllers: [CviOracleApiController],
})
export class CviOracleApiModule {}
