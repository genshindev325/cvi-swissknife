import { Container } from 'inversify'
import { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { ChatgptServerWrapperConfig } from '@coti-cvi/common-be'

export interface GetAsyncOverloads {
  (token: 'IsTestMode'): Promise<boolean>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  closeContainer: () => void
}

export function initInversify(config: ChatgptServerWrapperConfig): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('IsTestMode').toConstantValue(config.isTestMode)

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)

  return {
    getAsync: container.getAsync.bind(container),
    closeContainer: async () => {
      await container.unbindAllAsync()
    },
  }
}

export class InversifyService implements OnModuleDestroy {
  public readonly inverseContainer: InitInversifyReturnType

  constructor(@Inject('ConfigToken') readonly config: ChatgptServerWrapperConfig) {
    this.inverseContainer = initInversify(config)
  }

  async onModuleDestroy() {
    await this.inverseContainer.closeContainer()
  }
}
