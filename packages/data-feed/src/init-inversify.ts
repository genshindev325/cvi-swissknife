import { Container } from 'inversify'
import { GlobalEventsInversifyService, inversifyBuilder } from '@coti-cvi/lw-sdk'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  return {
    getAsync: inversifyBuilder(container, globalEventsInversifyService).getAsync,
    closeContainer: async () => {
      await container.unbindAllAsync()
    },
  }
}
