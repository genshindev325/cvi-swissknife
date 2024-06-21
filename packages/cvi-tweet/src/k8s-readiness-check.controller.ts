import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

@Controller(`/`)
export class K8SReadinessCheckController {
  private readyDate?: Date

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  @Get('/readiness')
  @ApiOperation({ description: 'k8s readiness check' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'readiness',
  })
  isReady(@Res() res: FastifyReply) {
    if (true) {
      res.status(HttpStatus.OK).send()
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send()
    }
  }
}
