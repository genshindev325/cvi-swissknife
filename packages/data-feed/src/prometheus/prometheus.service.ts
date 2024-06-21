import type { OnModuleDestroy } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  constructor() {
    collectDefaultMetrics({ prefix: 'datafeed__', register: this.registry })
  }

  async onModuleDestroy() {
    // to stop any async operations when prometheus call us to get new metrics
    this.registry.clear()
  }

  public async getMetrics() {
    return this.registry.metrics()
  }

  public readonly cviQuickswapGetAllCviPricesRequestsTotal = new Counter({
    name: 'datafeed__cvol_quickswap_get_all_cvol_prices_requests_total',
    help: 'how many requests had been made to get all cvi prices from quickswap',
    labelNames: ['success'],
    registers: [this.registry],
  })

  public readonly cviQuickswapGetAllCviPricesDurationSeconds = new Histogram({
    name: 'datafeed__cvol_quickswap_get_all_cvol_prices_request_duration_seconds',
    help: 'get all cvi prices from quickswap duration in seconds',
    registers: [this.registry],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1],
  })

  public readonly cviHistoryIndexesRecurringFetchTotal = new Counter({
    name: 'datafeed__cvi_history_indexes_recurring_fetch_total',
    help: 'how many times cvi history indexes recurring fetching had run in total',
    labelNames: ['success', 'index_type'],
    registers: [this.registry],
  })

  public readonly cviHistoryIndexesRecurringFetchDurationSeconds = new Histogram({
    name: 'datafeed__cvi_history_indexes_recurring_fetch_duration_seconds',
    help: 'cvi history indexes recurring fetching duration in seconds',
    labelNames: ['success', 'index_type'],
    registers: [this.registry],
    buckets: [1, 30, 45, 60, 90, 120],
  })
}
