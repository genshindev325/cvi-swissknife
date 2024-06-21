import { Module } from '@nestjs/common'
import { ConfigModule, SendInversifyErrorsToSentry } from '@coti-cvi/common-be'
import { CalcMaxIlController } from './calc-max-il.controller'
import { CalcMaxIlService } from './calc-max-il.service'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { InversifyModule } from '../inversify/init-inversify.module'

@Module({
  imports: [InversifyModule, ConfigModule, SendInversifyErrorsToSentry, PrometheusModule],
  providers: [CalcMaxIlService],
  controllers: [CalcMaxIlController],
  exports: [CalcMaxIlService],
})
export class CalcMaxIlModule {}
