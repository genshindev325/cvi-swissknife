import { Module } from '@nestjs/common'
import { SentryModule, SentryService } from './error-handling'
import type { Container } from 'inversify'
import type { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'

@Module({
  imports: [SentryModule],
  providers: [
    {
      provide: 'RegisterToErrorsInInversifyContainer',
      useFactory: async (container: Pick<Container, 'getAsync'>, sentryService: SentryService): Promise<void> => {
        const globalEventsInversifyService = await container.getAsync<GlobalEventsInversifyService>(
          'GlobalEventsInversifyService',
        )
        //@ts-ignore
        globalEventsInversifyService.eventEmitter.on('errors', error => sentryService.sendErrorToSentry(error))
      },
      inject: ['InversifyContainerNestJsToken', SentryService],
    },
  ],
})
export class SendInversifyErrorsToSentry {}
