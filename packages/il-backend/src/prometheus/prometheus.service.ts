import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { IlBackendConfig } from '@coti-cvi/common-be'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

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

  public readonly zapperAccountLpRequests = new Counter({
    name: `${this.getMetricsPrefix()}zapper_account_lp_requests_total`,
    help: 'how many requests had been made to get zapper liquidity providers account defi holdings',
    labelNames: ['success', 'http_status_code', 'number_of_accounts'],
    registers: [this.registry],
  })

  public readonly zapperAccountLpRequestDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}zapper_account_lp_request_duration_seconds`,
    help: 'zapper liquidity providers account defi holdings duration in seconds',
    registers: [this.registry],
    labelNames: ['success', 'number_of_accounts'],
    buckets: [0.5, 1, 1.5, 2, 3, 4, 5, 10, 15, 20, 30],
  })

  public readonly maxIlRequestsTotal = new Counter({
    name: `${this.getMetricsPrefix()}maxil_il_per_pair_requests_total`,
    help: 'requests to get worse / max il per pair in total (http_status_code: 200 - OK, 400 - not ready/loading data, 500 - See sentry)',
    labelNames: ['http_status_code'],
    registers: [this.registry],
  })

  public readonly maxIlRequestDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}maxil_il_per_pair_request_duration_seconds`,
    help: 'requests to get worse  / max il per pair duration in seconds',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 1],
  })

  public readonly maxIlPerPairPercent = new Gauge({
    name: `${this.getMetricsPrefix()}maxil_per_pair_percent`,
    help: 'max il per pair token0-token1 (metric exposed only after first client requests getWorstIlPerPair)',
    registers: [this.registry],
    labelNames: ['pair'],
  })

  public readonly maxIlPerPairPeriodStartTimestampSeconds = new Gauge({
    name: `${this.getMetricsPrefix()}maxil_per_pair_period_start_timestamp_seconds`,
    help: 'in epoch seconds when was period start of maxil for pair token0-token1 (metric exposed only after first client requests getWorstIlPerPair)',
    registers: [this.registry],
    labelNames: ['pair'],
  })

  public readonly maxIlPerPairPeriodEndTimestampSeconds = new Gauge({
    name: `${this.getMetricsPrefix()}maxil_per_pair_period_end_timestamp_seconds`,
    help: 'in epoch seconds when  was period end of maxil for pair token0-token1 (metric exposed only after first client requests getWorstIlPerPair)',
    registers: [this.registry],
    labelNames: ['pair'],
  })
}
