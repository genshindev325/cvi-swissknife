import { Module } from '@nestjs/common'
import { ConfigModule, SendInversifyErrorsToSentry, SentryModule } from '@coti-cvi/common-be'
import { MonitorService } from './monitor.service'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { InversifyModule } from '../inversify/inversify.module'

@Module({
  imports: [InversifyModule, ConfigModule, SendInversifyErrorsToSentry, PrometheusModule, SentryModule],
  providers: [MonitorService],
  exports: [MonitorService],
})
export class MonitorModule {}
