import { Module } from '@nestjs/common'
import { SentryModule } from '@coti-cvi/common-be'
import { CviIndexesHistoryModule } from '../cvi-indexes-history/cvi-indexes-history.module'
import { PrometheusModule } from '../prometheus/prometheus.module'
import { TokensController } from './tokens.controller'
import { TokensService } from './tokens.service'

@Module({
  imports: [PrometheusModule, CviIndexesHistoryModule, SentryModule],
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}
