import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'

@Controller(`/`)
export class K8SReadinessCheckController {
  @Get('/readiness')
  @ApiOperation({ description: 'k8s readiness check' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'readiness',
  })
  isReady(@Res() res: FastifyReply) {
    res.status(HttpStatus.OK).send()
  }
}
