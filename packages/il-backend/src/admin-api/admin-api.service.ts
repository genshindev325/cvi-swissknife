import type { ILAdminApiInversifyService } from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { IlBackendConfig } from '@coti-cvi/common-be'

export class AdminApiService implements OnModuleDestroy {
  private readonly subscription: {
    isReady: () => boolean
    cleanup: () => Promise<void>
  }

  constructor(
    @Inject('ConfigToken') readonly config: IlBackendConfig,
    @Inject(INVERSIFY_SERVICES.IL_ADMIN_API) public readonly ilAdminInversifyService: ILAdminApiInversifyService,
  ) {
    if (this.config.isTestMode || !this.config.serviceConfig.loadAdminPanelEvents) {
      this.subscription = {
        cleanup: () => Promise.resolve(),
        isReady: () => false,
      }
    } else {
      this.subscription = this.ilAdminInversifyService.listenToProtectionEvents({
        loadChartsData: true,
      })
    }
  }

  public isReady(): boolean {
    if (this.config.serviceConfig.loadAdminPanelEvents) {
      return this.subscription.isReady()
    } else {
      return true
    }
  }

  async onModuleDestroy() {
    await this.subscription.cleanup()
  }
}
