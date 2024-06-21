import { Module } from '@nestjs/common'
import { ConfigModule, PrometheusController } from '@coti-cvi/common-be'
import { PrometheusService } from './prometheus.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PrometheusServiceToken',
      useClass: PrometheusService,
    },
  ],
  exports: ['PrometheusServiceToken'],
  controllers: [PrometheusController],
})
export class PrometheusModule {}
