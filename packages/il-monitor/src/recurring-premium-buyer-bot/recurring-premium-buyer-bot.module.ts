import { Module } from '@nestjs/common'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { RecurringPremiumBuyerBotService } from './recurring-premium-buyer-bot.service'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { InversifyModule } from '../inversify/inversify.module'

@Module({
  imports: [InversifyModule, ConfigModule, PrometheusModule, SentryModule],
  providers: [RecurringPremiumBuyerBotService],
  exports: [RecurringPremiumBuyerBotService],
})
export class RecurringPremiumBuyerBotModule {}
