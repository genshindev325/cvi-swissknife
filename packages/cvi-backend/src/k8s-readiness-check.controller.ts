import type { CviAdminApiInversifyService } from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

@Controller(`/`)
export class K8SReadinessCheckController implements OnModuleDestroy {
  private readonly id: NodeJS.Timeout

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger,
    @Inject(INVERSIFY_SERVICES.CVI_ADMIN_API) public readonly cviAdminInversifyService: CviAdminApiInversifyService,
  ) {
    let isReady = false
    this.id = setInterval(() => {
      const updatedIsReady = this._isReady()
      if (!updatedIsReady) {
        this.logger.warn(`server-status: not-ready: ${JSON.stringify(this.readinessDescription(), null, 2)}`)
      }
      if (!isReady && updatedIsReady) {
        this.logger.info(`
----------------------------
----------------------------
server-status: ready
----------------------------
----------------------------\
`)
      }
      isReady = updatedIsReady
    }, 5_000)
  }

  onModuleDestroy() {
    clearInterval(this.id)
  }

  private _isReady() {
    return Boolean(this.cviAdminInversifyService.isReady())
  }

  @Get('/readiness-description')
  readinessDescription() {
    return {
      cviAdminInversifyService: this.cviAdminInversifyService.isReadyDescription(),
    }
  }

  @Get('/readiness')
  @ApiOperation({ description: 'k8s readiness check' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'readiness',
  })
  isReady(@Res() res: FastifyReply) {
    if (Boolean(this._isReady())) {
      res.status(HttpStatus.OK).send()
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send()
    }
  }
}
