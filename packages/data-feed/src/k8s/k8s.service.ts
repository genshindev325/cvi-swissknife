import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { DataFeedConfig } from '@coti-cvi/common-be'
import { SentryService } from '@coti-cvi/common-be'
import * as k8s from '@kubernetes/client-node'
import { BlockchainName, CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import type { HardhatPodStarted } from '@coti-cvi/lw-sdk'

export class K8sService implements OnModuleDestroy {
  private readonly kc = new k8s.KubeConfig()

  private readonly coreV1Api: k8s.CoreV1Api

  private readonly intervalId: NodeJS.Timeout

  private pods: k8s.V1Pod[] = []

  constructor(
    @Inject('ConfigToken') readonly config: DataFeedConfig,
    @Inject(SentryService) private readonly sentryService: SentryService,
  ) {
    this.kc.loadFromString(Buffer.from(config.k8sConfigBase64, 'base64').toString())
    this.coreV1Api = this.kc.makeApiClient(k8s.CoreV1Api)

    this.getPods()
    this.intervalId = setInterval(async () => this.getPods(), 20_000)
  }

  onModuleDestroy() {
    clearInterval(this.intervalId)
  }

  private async getPods() {
    try {
      const r = await this.coreV1Api.listNamespacedPod('default')
      this.pods = r.body.items
    } catch (e) {
      this.sentryService.sendErrorToSentry(
        new CustomError({
          name: 'K8sGetPodsError',
          message: `can't get pods state from k8s`,
          errorKind: ErrorKind.SystemError,
          cause: e,
        }),
      )
    }
  }

  public getWhenHardhatPodsStarted(): HardhatPodStarted[] {
    return this.pods
      .filter(p => Object.values(BlockchainName).find(b => p.metadata?.name?.includes(`hardhat-${b}`)))
      .filter(p => p.status?.containerStatuses?.some(c => c.state?.running?.startedAt))
      .map<HardhatPodStarted>(p => ({
        BlockchainName: Object.values(BlockchainName).find(b => p.metadata!.name?.includes(`hardhat-${b}`))!,
        dateUtc: new Date(p.status!.containerStatuses![0].state!.running!.startedAt!).toISOString(),
      }))
  }
}

// https://data-feed.cvi-team.com/tokens/cvi/quickswap?fromTimestampMs=0
// http://localhost:8000/                       /tokens/cvi/quickswap?fromTimestampMs=0
