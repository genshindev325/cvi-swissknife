import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { IlBackendConfig } from '@coti-cvi/common-be'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  public readonly triggerCacheCreateForTradingCompetitionTotal = new Counter({
    name: `${this.getMetricsPrefix()}trigger_cache_create_for_trading_competition_total`,
    help: 'how many times we triggered cache creation for trading competition info',
    labelNames: ['error'],
    registers: [this.registry],
  })

  public readonly VTTradingCompetitionInfoProcessingDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}vt_trading_competition_info_processing_duration_seconds`,
    help: 'how long it takes to return vt trading competition info',
    registers: [this.registry],
    labelNames: ['from_timestamp'],
    buckets: [0.1, 0.5, 1, 3, 5, 10, 30, 45, 60, 90, 180],
  })

  constructor(
    @Inject('ConfigToken') readonly config: IlBackendConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    collectDefaultMetrics({ prefix: this.getMetricsPrefix(), register: this.registry })
    logger.info(`this.config.runningService.runtimeName: ${this.config.runningService.runtimeName}`)
  }

  async onModuleDestroy() {
    // to stop any async operations when prometheus call us to get new metrics
    this.registry.clear()
  }

  private getMetricsPrefix() {
    return `${this.config.runningService.runtimeName.replaceAll('-', '_').replaceAll('.', '_')}__`
  }

  public async getMetrics() {
    return this.registry.metrics()
  }
}
