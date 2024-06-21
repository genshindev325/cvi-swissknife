import type { CviOracleAdminApiInversifyService } from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

@Controller(`/`)
export class K8SReadinessCheckController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger,
    @Inject(INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API)
    public readonly cviOracleAdminApiInversifyService: CviOracleAdminApiInversifyService,
  ) {}

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
