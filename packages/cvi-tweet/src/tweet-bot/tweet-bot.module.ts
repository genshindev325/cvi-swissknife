import { ScheduleModule } from '@nestjs/schedule'
import { Module } from '@nestjs/common'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { TweetBotService } from './tweet-bot.service'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { TweetBotController } from './tweet-bot.controller'

@Module({
  imports: [ConfigModule, PrometheusModule, SentryModule, ScheduleModule.forRoot()],
  providers: [TweetBotService],
  exports: [TweetBotService],
  controllers: [TweetBotController],
})
export class TweetBotModule {}
