import { Module } from '@nestjs/common'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { ArbitrageBotService } from './arbitrage-bot.service'
import { InversifyModule } from '../inversify/inversify.module'
import { PrometheusModule } from '../prometheus/prometheus.module'

@Module({
  imports: [InversifyModule, ConfigModule, PrometheusModule, SentryModule],
  providers: [ArbitrageBotService],
  exports: [ArbitrageBotService],
})
export class ArbitrageBotModule {}
