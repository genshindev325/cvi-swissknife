import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type {
  GlobalEventsInversifyService,
  ILProtectionInversifyService,
  SignerInversifyService,
} from '@coti-cvi/lw-sdk'
import { CustomError, ErrorKind, startTimer, toNumber } from '@coti-cvi/lw-sdk'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { SentryService } from '@coti-cvi/common-be'
import type { IlMonitorConfig } from '@coti-cvi/common-be'

export class KeepersBotService implements OnModuleDestroy {
  private lastTask?: Promise<void>

  private readonly cleanup: () => Promise<void>

  constructor(
    @Inject('SignerInversifyService') private readonly signerInversifyService: SignerInversifyService,
    @Inject('ILProtectionInversifyService') private readonly iLProtectionInversifyService: ILProtectionInversifyService,
    @Inject('GlobalEventsInversifyService')
    readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(SentryService) private readonly sentryService: SentryService,
    @Inject('ConfigToken') readonly config: IlMonitorConfig,
  ) {
    globalEventsInversifyService.eventEmitter.on('latestBlock', this.runTask)

    this.prometheusService.performUpkeepEnabled.set(this.config.serviceConfig.performUpkeep ? 1 : 0)

    this.cleanup = async () => {
      globalEventsInversifyService.eventEmitter.off('latestBlock', this.runTask)
      await this.lastTask
    }
  }

  async onModuleDestroy() {
    await this.cleanup()
  }

  private runTask = async () => {
    this.logger.info(`Il-KeepersBot started`)
    if (this.lastTask) {
      return
    }
    try {
      this.lastTask = this.onNewBlock()
      await this.lastTask
    } finally {
      this.lastTask = undefined
    }
  }

  private onNewBlock = async (): Promise<void> => {
    let checkResult: {
      upkeepNeeded: boolean
      performData: string
    }

    const checkEndTimer = startTimer()

    try {
      this.logger.info(`Checking UpKeep - onNewBlock`)
      checkResult = await this.iLProtectionInversifyService.checkUpkeep()
      this.prometheusService.checkUpkeepResultTotal
        .labels({ upkeep_needed: new Boolean(checkResult.upkeepNeeded).toString() })
        .inc()

      this.logger.info(`Result: ${new Boolean(checkResult.upkeepNeeded).toString()}`)

      this.prometheusService.checkUpkeepDurationSeconds.labels({ success: 'true' }).observe(checkEndTimer())
    } catch (e) {
      this.prometheusService.checkUpkeepDurationSeconds.labels({ success: 'false' }).observe(checkEndTimer())

      this.sentryService.sendErrorToSentry(
        new CustomError({
          name: 'CheckUpKeepError',
          message: 'failed to check upkeep - cant check which active protections need to be closed',
          errorKind: ErrorKind.SystemError,
          cause: e,
        }),
      )
      return
    }

    if (checkResult.upkeepNeeded && this.config.serviceConfig.performUpkeep) {
      this.prometheusService.performUpkeepOn.set(1)
      const performEndTimer = startTimer()
      try {
        this.logger.info(`checkResult.performData: ${checkResult.performData}`)

        await this.iLProtectionInversifyService.performUpkeep(checkResult.performData)
        this.prometheusService.performUpkeepDurationSeconds.labels({ success: 'true' }).observe(performEndTimer())
      } catch (e) {
        this.prometheusService.performUpkeepDurationSeconds.labels({ success: 'false' }).observe(performEndTimer())
        const balanceRawNativeTokenAmount = await this.signerInversifyService.signer.getBalance()
        const balanceNativeTokenAmount = toNumber(balanceRawNativeTokenAmount, 18)

        this.sentryService.sendErrorToSentry(
          new CustomError({
            name: 'PerformUpkeepError',
            message: 'failed to perform upkeep - active protections cant be closed',
            errorKind: ErrorKind.SystemError,
            cause: e,
            extras: {
              signer: {
                address: this.signerInversifyService.address,
                balanceNativeTokenAmount,
              },
              checkResult,
            },
          }),
        )
        return
      }
    } else {
      this.prometheusService.performUpkeepOn.set(0)
    }
  }
}
