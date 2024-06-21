import type { OnModuleDestroy } from '@nestjs/common'
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { ServiceName } from '@coti-cvi/common-be'
import type { Config } from '@coti-cvi/common-be'

@Controller(`/`)
export class K8SLivenessCheckController implements OnModuleDestroy {
  private readonly id: NodeJS.Timeout

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('ConfigToken') private readonly config: Config<ServiceName>,
  ) {
    const intervalMs = 100
    let lastTrigger = Date.now()
    this.id = setInterval(() => {
      const delay = Date.now() - (lastTrigger + intervalMs)
      if (delay > 10) {
        this.logger.warn(`detected event-loop delay of ${delay}ms`)
      }
      lastTrigger = Date.now()
    }, intervalMs)
  }

  onModuleDestroy() {
    clearInterval(this.id)
  }

  @Get('/')
  @ApiOperation({ description: 'is-alive' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'alive',
  })
  async schedule() {
    return `${this.config.runningService.runtimeName}@${this.config.runningService.version}: alive - replica-id: ${
      this.config.runningService.replicaId
    } - date: ${new Date().toISOString()}`
  }
}
