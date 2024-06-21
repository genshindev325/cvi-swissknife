import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { collectDefaultMetrics, Registry } from 'prom-client'
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
}
