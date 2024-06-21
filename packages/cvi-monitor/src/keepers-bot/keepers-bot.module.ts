import { Module } from '@nestjs/common'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { KeepersBotService } from './keepers-bot.service'
import { InversifyModule } from '../inversify/inversify.module'
import { PrometheusModule } from '../prometheus/prometheus.module'

@Module({
  imports: [InversifyModule, ConfigModule, PrometheusModule, SentryModule],
  providers: [KeepersBotService],
  exports: [KeepersBotService],
})
export class KeepersBotModule {}
