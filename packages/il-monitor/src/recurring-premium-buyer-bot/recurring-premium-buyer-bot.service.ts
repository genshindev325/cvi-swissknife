import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type { PeriodSeconds, ArmadilloSupportedPair } from '@coti-cvi/lw-sdk'
import { getSinger } from '@coti-cvi/lw-sdk'
import type { GlobalEventsInversifyService, ILProtectionInversifyService } from '@coti-cvi/lw-sdk'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { IlMonitorConfig } from '@coti-cvi/common-be'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { Signer } from 'ethers'

export class RecurringPremiumBuyerBotService implements OnModuleDestroy {
  private lastTask?: Promise<void>

  private readonly cleanup?: () => Promise<void>

  private readonly botSigner: Signer = getSinger({
    provider: this.ethersJsonRpcBatchProvider,
    ...this.config.serviceConfig.recurringPremiumBuyerBot.signer[this.config.serviceConfig.chainId],
  })

  constructor(
    @Inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
    @Inject('ILProtectionInversifyService') private readonly iLProtectionInversifyService: ILProtectionInversifyService,
    @Inject('GlobalEventsInversifyService')
    readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('ConfigToken') readonly config: IlMonitorConfig,
  ) {
    this.prometheusService.recurringPremiumBuyerBotEnabled.set(
      this.config.serviceConfig.recurringPremiumBuyerBot.enabled ? 1 : 0,
    )

    if (this.config.serviceConfig.recurringPremiumBuyerBot.enabled) {
      const id = setInterval(async () => {
        this.logger.info(`${RecurringPremiumBuyerBotService.name} started`)
        if (this.lastTask) {
          return
        }
        try {
          this.lastTask = this.buyProtections()
          await this.lastTask
        } catch (error) {
          this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        } finally {
          this.lastTask = undefined
        }
      }, config.serviceConfig.recurringPremiumBuyerBot.intervalMinutes * 60 * 1000)

      this.cleanup = async () => {
        clearInterval(id)
        await this.lastTask
      }
    }
  }

  async onModuleDestroy() {
    if (this.cleanup) {
      await this.cleanup()
    }
  }

  private async buyProtection(period: PeriodSeconds, pair: ArmadilloSupportedPair): Promise<void> {
    const { premium } = await this.iLProtectionInversifyService.calculatePremiumUsdc({
      pair,
      lpTokensWorthAtBuyTimeUSD: this.iLProtectionInversifyService.tokenUSDC.fromNumber(
        this.config.serviceConfig.recurringPremiumBuyerBot.coveredAmountUsdc,
      ),
      policyPeriod: period.periodSeconds,
    })

    const premiumCostUsdc = this.iLProtectionInversifyService.tokenUSDC.toNumber(premium)
    const withSlippage =
      (premiumCostUsdc * (100 + this.config.serviceConfig.recurringPremiumBuyerBot.slippagePercentage)) / 100

    await this.iLProtectionInversifyService.buyProtection({
      pair,
      periodSeconds: period.periodSeconds,
      amountUSD: this.config.serviceConfig.recurringPremiumBuyerBot.coveredAmountUsdc,
      maxPremiumCostUsdc: this.iLProtectionInversifyService.tokenUSDC.fromNumber(withSlippage),
      signer: this.botSigner,
    })
  }

  private buyProtections = async (): Promise<void> => {
    const address = await this.botSigner.getAddress()

    const [periods, pairs, balance] = await Promise.all([
      this.iLProtectionInversifyService.getPeriodsSeconds(),
      this.iLProtectionInversifyService.getPairs(),

      this.iLProtectionInversifyService.tokenUSDC
        .getBalance(address)
        .then(balanceBn => this.iLProtectionInversifyService.tokenUSDC.toNumber(balanceBn)),
    ])

    const premiumCostAvgUsdc = (this.config.serviceConfig.recurringPremiumBuyerBot.coveredAmountUsdc * 2) / 100

    if (balance < premiumCostAvgUsdc * periods.length * pairs.length) {
      this.logger.error(
        `need more USDC in wallet of recurring-premium-buyer-bot: ${address} to buy protections. skipping buying protections...`,
      )
      return
    }

    await Promise.all(periods.map(period => Promise.all(pairs.map(pair => this.buyProtection(period, pair)))))
  }
}
