import { Module } from '@nestjs/common'
import { DatabaseConnectionModule, SentryModule } from '@coti-cvi/common-be'
import { CviIndexesHistoryController } from './cvi-indexes-history.controller'
import { CviIndexesHistoryService } from './cvi-indexes-history.service'
import { PrometheusModule } from '../prometheus/prometheus.module'

@Module({
  imports: [DatabaseConnectionModule, SentryModule, PrometheusModule],
  providers: [CviIndexesHistoryService],
  controllers: [CviIndexesHistoryController],
  exports: [CviIndexesHistoryService],
})
export class CviIndexesHistoryModule {}
