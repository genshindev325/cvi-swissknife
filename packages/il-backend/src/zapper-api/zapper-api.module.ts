import { Module } from '@nestjs/common'
import { SendInversifyErrorsToSentry } from '@coti-cvi/common-be'
import { ZapperApiController } from './zapper-api.controller'
import { PrometheusModule } from '../prometheus/prometheus.module'

@Module({
  imports: [SendInversifyErrorsToSentry, PrometheusModule],
  controllers: [ZapperApiController],
})
export class ZapperApiModule {}
