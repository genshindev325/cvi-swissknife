import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import { CviIndexesHistoryService } from './cvi-indexes-history/cvi-indexes-history.service'

@Controller(`/`)
export class K8SReadinessCheckController {
  private readyDate?: Date

  constructor(
    @Inject(CviIndexesHistoryService) private readonly cviIndexHistoryService: CviIndexesHistoryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/readiness')
  @ApiOperation({ description: 'k8s readiness check' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'readiness',
  })
  isReady(@Res() res: FastifyReply) {
    return res.status(HttpStatus.OK).send()
    if (Boolean(this.cviIndexHistoryService.didFetchedInitialData())) {
      if (!this.readyDate) {
        this.readyDate = new Date()
        this.logger.info(`k8s readiness check: ready`)
      }
      res.status(HttpStatus.OK).send()
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send()
    }
  }
}
