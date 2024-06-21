import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SentryCachedError } from './sentry.service'
import { SentryService } from './sentry.service'

@ApiTags(`sentry`)
@Controller('/sentry')
export class SentryController {
  constructor(@Inject(SentryService) private sentryService: SentryService) {}

  @Get('errors')
  root(): Record<string, SentryCachedError> {
    return this.sentryService.sentryErrors
  }
}
