import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import { AdminApiService } from './admin-api/admin-api.service'

@Controller(`/`)
export class K8SReadinessCheckController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) readonly logger: Logger,
    @Inject(AdminApiService) private readonly adminApiService: AdminApiService,
  ) {}

  @Get('/check')
  test() {
    return {
      ilAdminServiceIsReady: this.adminApiService.isReady(),
    }
  }

  @Get('/readiness')
  @ApiOperation({ description: 'k8s readiness check' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'readiness',
  })
  isReady(@Res() res: FastifyReply) {
    if (Boolean(this.adminApiService.isReady())) {
      //} && this.armadilloEligibleDiscountInversifyService.isReady())) {
      res.status(HttpStatus.OK).send()
    } else {
      this.logger.info(`status: not-ready. adminApiService: ${Boolean(this.adminApiService.isReady())}`)
      res.status(HttpStatus.SERVICE_UNAVAILABLE).send()
    }
  }
}
