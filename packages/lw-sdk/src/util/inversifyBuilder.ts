/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Container } from 'inversify'
import { CustomError, ErrorKind } from '../custom-error'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'

export const inversifyBuilder = <T>(
  container: Container,
  globalEventsInversifyService: GlobalEventsInversifyService,
) => {
  const onError = (tryedToLoad: string, error: Error) => {
    globalEventsInversifyService.eventEmitter.emit(
      'errors',
      new CustomError({
        name: 'inversify-error',
        errorKind: ErrorKind.SystemError,
        message: 'failed to load inversify service',
        cause: error,
        extras: {
          tryedToLoad,
        },
      }),
    )
    throw error
  }
  return {
    getAsync: ((token: any) => {
      return container.getAsync(token).catch(e => onError(token, e))
    }) as any,
    getByBlockchain: ((_blockchainName: T, token: any) => {
      return container.getAsync(token).catch(e => onError(token, e))
    }) as any,
    closeContainer: async () => {
      globalEventsInversifyService.eventEmitter.removeAllListeners()
      globalEventsInversifyService.eventEmitterTVault.removeAllListeners()
      globalEventsInversifyService.eventEmitterVolatility.removeAllListeners()
      globalEventsInversifyService.eventEmitterWithAddress.removeAllListeners()
      globalEventsInversifyService.eventEmitterWithAddressVT.removeAllListeners()
      await container.unbindAllAsync()
    },
  }
}
