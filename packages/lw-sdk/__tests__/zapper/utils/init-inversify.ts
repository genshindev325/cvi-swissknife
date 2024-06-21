import { Container } from 'inversify'
import { GlobalEventsInversifyService, ZapperApiInversifyService } from '../../../src'

export interface GetAsyncOverloads {
  (token: 'ZapperApiInversifyService'): Promise<ZapperApiInversifyService>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('ZapperApiInversifyService').to(ZapperApiInversifyService)
  container.bind('ZapperApiKeys').toConstantValue(['fake-api-key'])

  return {
    getAsync: container.getAsync.bind(container),
    closeContainer: async () => {
      await container.unbindAllAsync()
    },
  }
}
