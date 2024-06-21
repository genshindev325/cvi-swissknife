import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type {
  IERC20,
  GlobalEventsInversifyService,
  ThetaVaultInversifyService,
  VtInversifyService,
  VtReBaserInversifyService,
  Token,
} from '@coti-cvi/lw-sdk'
import { TokenName } from '@coti-cvi/lw-sdk'
import { toNumber } from '@coti-cvi/lw-sdk'
import { startTimer, getSinger } from '@coti-cvi/lw-sdk'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { TvMonitorConfig } from '@coti-cvi/common-be'
import type { JsonRpcProvider } from '@ethersproject/providers'

export class ArbitrageBotService implements OnModuleDestroy, OnModuleInit {
  private lastTask?: Promise<void>

  private intervalId?: NodeJS.Timeout

  private lastReportMetricsPromise: Promise<void> = Promise.resolve()

  private signerAddress: string | undefined

  private readonly signer = getSinger({
    provider: this.ethersJsonRpcBatchProvider,
    ...this.config.serviceConfig.arbitrageBot.singer[this.config.serviceConfig.chainId],
  })

  constructor(
    @Inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
    @Inject('GlobalEventsInversifyService')
    readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('ConfigToken') readonly config: TvMonitorConfig,
    @Inject('ThetaVaultInversifyService') readonly thetaVaultInversifyService: ThetaVaultInversifyService,
    @Inject('VtInversifyService') readonly vtInversifyService: VtInversifyService,
    @Inject('VtReBaserInversifyService') readonly vtReBaserInversifyService: VtReBaserInversifyService,
    @Inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
  ) {}

  async onModuleInit() {
    this.signerAddress = await this.signer.getAddress()

    this.logger.info(
      `${ArbitrageBotService.name} address: ${this.signerAddress}, eth-balance: ${toNumber(
        await this.signer.getBalance(),
        18,
      )}, usdc-balance: $${await this.tokenUSDC.balanceToString(
        this.signerAddress,
      )}, approved-usdc: $${await this.tokenUSDC.balanceToString(this.signerAddress)}`,
    )

    const approvedUsdc = await this.thetaVaultInversifyService.getApproveUsdc(this.signerAddress)

    if (approvedUsdc === 0) {
      this.logger.info(`${ArbitrageBotService.name} - approving usdc`)
      await this.thetaVaultInversifyService.approveUsdc()
      this.logger.info(
        `${ArbitrageBotService.name} - approved usdc: $${await this.tokenUSDC.balanceToString(this.signerAddress)}`,
      )
    }

    if (this.config.serviceConfig.arbitrageBot.enabled) {
      this.intervalId = setInterval(() => {
        this.lastReportMetricsPromise = this.runTask()
      }, this.config.serviceConfig.arbitrageBot.intervalMs)
      this.lastReportMetricsPromise = this.runTask()
    }
  }

  async onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    await this.lastReportMetricsPromise
  }

  private runTask = async () => {
    if (this.lastTask) {
      return
    }
    try {
      this.lastTask = this.runArbitrageBot()
      await this.lastTask
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
    } finally {
      this.lastTask = undefined
    }
  }

  private async runArbitrageBot() {
    const end = startTimer()

    if (!this.signerAddress) {
      throw new Error(`singer-address is undefined`)
    }

    this.prometheusService.arbitrageBotRunsTotal.inc()

    const usdcBalance = this.tokenUSDC.toNumber(await this.tokenUSDC.getBalance(this.signerAddress))

    this.logger.info(
      `${ArbitrageBotService.name} started. address: ${this.signerAddress}, usdc-balance: $${usdcBalance}, trying to deposit: ${this.config.serviceConfig.arbitrageBot.depositUsdcToTv} ${TokenName.USDC}`,
    )

    this.prometheusService.arbitrageBotUSDCBalance.set(usdcBalance)

    if (usdcBalance < this.config.serviceConfig.arbitrageBot.withdrawUsdcFromTvWhenAddressUsdcBalanceLessThan) {
      const addressTvBalanceInUsdc = await this.thetaVaultInversifyService
        .accountBalance(this.signerAddress)
        .then(r => r.balanceUSDCNumber)
      if (addressTvBalanceInUsdc > 0) {
        this.logger.info(
          `${ArbitrageBotService.name} usdc-balance: $${usdcBalance} less than $${this.config.serviceConfig.arbitrageBot.withdrawUsdcFromTvWhenAddressUsdcBalanceLessThan} -> trying to withraw all address ${TokenName.USDC} from tv ($${addressTvBalanceInUsdc})`,
        )
        await this.thetaVaultInversifyService.withdrawFull()
        this.logger.info(`${ArbitrageBotService.name} withdraw will happen 1h from now`)
      } else {
        throw new Error(
          `${ArbitrageBotService.name} - nothing to withdraw from tv and the arbitrage-bot doesn't have usdc. pls add more usdc manually`,
        )
      }
    }

    await this.thetaVaultInversifyService.deposit(this.config.serviceConfig.arbitrageBot.depositUsdcToTv, this.signer)

    this.logger.info(`${ArbitrageBotService.name} finished successfully (${end().toFixed(2)}s)`)
  }
}
