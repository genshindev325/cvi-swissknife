import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { PrometheusService } from '../prometheus/prometheus.service'
import { CVI_V3_ARBITRAGE_BOT_ADDRESS } from '@coti-cvi/lw-sdk'

import type { ChainLinkKeepersRegistryInversifyService } from '@coti-cvi/lw-sdk'
import { ChainId } from '@coti-cvi/lw-sdk'
import type {
  GlobalEventsInversifyService,
  SignerInversifyService,
  ThetaVaultInversifyService,
  VtInversifyService,
  VtReBaserInversifyService,
  VtContractsEventsInversifyService,
  TvContractsEventsInversifyService,
  CVIOracleInversifyService,
} from '@coti-cvi/lw-sdk'
import { CustomError, ErrorKind, startTimer, toNumber } from '@coti-cvi/lw-sdk'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { SentryService } from '@coti-cvi/common-be'
import type { TvMonitorConfig } from '@coti-cvi/common-be'
import { chain } from 'lodash'

export class KeepersBotService implements OnModuleDestroy {
  private lastTask?: Promise<void>

  private QUERY_CONTRACTS_EVERY_X_MINUTES = 10

  private readonly cleanup: () => Promise<void>

  private readonly reportMetricsTask: NodeJS.Timeout | undefined = undefined

  private lastReportMetricsPromise: Promise<void> = Promise.resolve()

  //
  constructor(
    @Inject('SignerInversifyService') private readonly signerInversifyService: SignerInversifyService,
    @Inject('GlobalEventsInversifyService')
    readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(SentryService) private readonly sentryService: SentryService,
    @Inject('ConfigToken') readonly config: TvMonitorConfig,
    @Inject('ThetaVaultInversifyService') readonly thetaVaultInversifyService: ThetaVaultInversifyService,
    @Inject('VtInversifyService') readonly vtInversifyService: VtInversifyService,
    @Inject('VtReBaserInversifyService') readonly vtReBaserInversifyService: VtReBaserInversifyService,
    @Inject('VtContractsEventsInversifyService')
    private readonly vtContractsEventsInversifyService: VtContractsEventsInversifyService,
    @Inject('TvContractsEventsInversifyService')
    private readonly tvContractsEventsInversifyService: TvContractsEventsInversifyService,
    @Inject('CVIOracleInversifyService') private readonly cviOracleInversifyService: CVIOracleInversifyService,
    @Inject('ChainLinkKeepersRegistryInversifyService')
    public readonly chainLinkKeepersRegistryInversifyService: ChainLinkKeepersRegistryInversifyService,
  ) {
    globalEventsInversifyService.eventEmitter.on('latestBlock', this.runTask)

    this.prometheusService.performUpkeepEnabledTv.set(this.config.serviceConfig.performUpkeep ? 1 : 0)
    this.prometheusService.performUpkeepEnabledVt.set(this.config.serviceConfig.performUpkeep ? 1 : 0)

    this.cleanup = async () => {
      globalEventsInversifyService.eventEmitter.off('latestBlock', this.runTask)
      await this.lastTask
    }

    if (this.config.serviceConfig.monitor) {
      this.reportMetricsTask = setInterval(() => {
        this.lastReportMetricsPromise = this.reportMetrics()
      }, 1_000 * 60 * this.QUERY_CONTRACTS_EVERY_X_MINUTES)
      this.lastReportMetricsPromise = this.reportMetrics()
    }
  }

  private async reportThetaVaultMetrics(): Promise<number | undefined> {
    try {
      const { allEvents } = await this.tvContractsEventsInversifyService.getBaseEvents()

      const tvPendingNonBotDepositsWithdraws = chain(allEvents)
        // @ts-ignore
        .groupBy(e => e.args.requestId)
        .values()
        // @ts-ignore
        .flatMap(r =>
          r.length === 1
            ? r.find(e => e.type === 'TvSubmitEvent' && e.args.account !== CVI_V3_ARBITRAGE_BOT_ADDRESS) || []
            : [],
        )
      // .value().length

      const sumUSDCPendingTVDeposits = tvPendingNonBotDepositsWithdraws
        .filter(e => e.args.action === 'Deposit')
        // @ts-ignore
        .map(e => e.args.tokenAmountInUsdc)
        .reduce((prev, curr) => prev + curr, 0)

      const sumUSDCPendingWithdraws = tvPendingNonBotDepositsWithdraws
        .filter(e => e.args.action === 'Withdraw')
        // @ts-ignore
        .map(e => e.args.tokenAmountInUsdc)
        .reduce((prev, curr) => prev + curr, 0)

      console.log(`sumUSDCPendingTVDeposits: ${sumUSDCPendingTVDeposits}`)
      console.log(`sumUSDCPendingWithdraws: ${sumUSDCPendingWithdraws}`)

      this.prometheusService.statisticsTvDepositOrWithdrawRequestsUSDCTotal
        .labels({ type: 'deposit' })
        .set(Number(sumUSDCPendingTVDeposits))
      this.prometheusService.statisticsTvDepositOrWithdrawRequestsUSDCTotal
        .labels({ type: 'withdraw' })
        .set(Number(sumUSDCPendingWithdraws))
      const cviIndex = await this.cviOracleInversifyService.getCviIndex().then(r => r.cviNumber)
      const tvInfo = await this.thetaVaultInversifyService.info({ cviIndex })

      this.prometheusService.statisticsTvUtilizationPercent.set(
        Number.parseFloat(tvInfo.tvUtilizationPercentage.toFixed(2)),
      )

      this.prometheusService.statisticsCVIIndexValue.set(Number.parseFloat(cviIndex.toFixed(2)))

      this.prometheusService.statisticsDexVolTokenBalance.set(
        Number.parseFloat(tvInfo.dexCviBalanceUsdcByPlatformPrice.toFixed(2)),
      )
      this.prometheusService.statisticsDexVtPooledUsdcBalance.set(
        Number.parseFloat(tvInfo.dexCviBalanceUsdc.toFixed(2)),
      )
      this.prometheusService.statisticsPlatformUsdcLiquidity.set(
        Number.parseFloat(tvInfo.platformUSDCLiquidity.toFixed(2)),
      )
      this.prometheusService.statisticsDexVtPooledCviBalance.set(Number.parseFloat(tvInfo.dexCviBalance.toFixed(2)))

      this.prometheusService.statisticsTvPlatformCviVaultTvlUsdc.set(
        Number.parseFloat(tvInfo.currentThetaVaultUsdcBalance.toFixed(2)),
      )
      this.prometheusService.statisticsTvCollateralRatioPercent.set(
        Number.parseFloat(tvInfo.tvCollateralRatio.toFixed(2)),
      )

      return tvInfo.tvCollateralRatio
      this.prometheusService.statisticsTvPnlUsdc.set(Number.parseFloat(tvInfo.tvPlatformPnl.toFixed(4)))
    } catch (e) {
      this.sentryService.sendErrorToSentry(e as Error)
    }
  }

  // Returns number of seconds (3600 currently = 1 hr) after which VT burn/mints should have been liquidated by now
  private async readAndReportVolatilityTokensParameters(
    tvCollateralRatio: number | undefined,
  ): Promise<{ getAfterTargetMaxTime: number }> {
    const [
      getMaxMintAmount,
      getDexPrice,
      getIntrinsicPrice,
      getHourlyFundingFee,
      getFundingFeeParams,
      getAfterTargetMaxTime,
    ] = await Promise.all([
      this.vtInversifyService.getMaxMintAmount(),
      this.vtInversifyService.getDexPrice(),
      this.vtInversifyService.getIntrinsicPrice(),
      this.vtInversifyService.getHourlyFundingFee(),
      this.vtInversifyService.getFundingFeeParams(),
      this.vtInversifyService.getAfterTargetMaxTime(),
    ])

    if (tvCollateralRatio) {
      const getFundingFeeValues = await this.vtInversifyService.getFundingFeeValues(Math.round(tvCollateralRatio))

      if (getFundingFeeValues) {
        getFundingFeeValues.forEach((maxDailyFundingFeePercent: number, cviIndexValue: number) => {
          this.prometheusService.statisticsVtFundingFeeParams__DailyFundingFeePercentAtCurrentUtilizationRatio
            .labels({
              cvi_index: cviIndexValue,
            })
            .set(maxDailyFundingFeePercent)
        })
      }
    }

    if (getFundingFeeParams) {
      this.prometheusService.statisticsVtFundingFeeParams__DailyMinFundingPercent.set(
        getFundingFeeParams.fundingFeeMinRate,
      )
      this.prometheusService.statisticsVtFundingFeeParams__DailyMaxFundingPercent.set(
        getFundingFeeParams.fundingFeeMaxRate,
      )
      this.prometheusService.statisticsVtFundingFeeParams__minFundingFeeCviThreshold.set(
        getFundingFeeParams.minFundingFeeCviThreshold,
      )
      this.prometheusService.statisticsVtFundingFeeParams__maxFundingFeeCviThreshold.set(
        getFundingFeeParams.maxFundingFeeCviThreshold,
      )

      this.prometheusService.statisticsVtFundingFeeParams__fundingFeeDivisionFactor.set(
        getFundingFeeParams.fundingFeeDivisionFactor,
      )
    }

    this.prometheusService.statisticsVtMaxMintAmountUsdc.set(Number.parseFloat(getMaxMintAmount.toFixed(2)))
    this.prometheusService.statisticsVtDexPriceUsdc.set(Number.parseFloat(getDexPrice.toFixed(2)))
    this.prometheusService.statisticsVtPlatformIntrinsicPriceUsdc.set(Number.parseFloat(getIntrinsicPrice.toFixed(2)))
    this.prometheusService.statisticsVtHourlyFundingFeePercent.set(Number.parseFloat(getHourlyFundingFee.toFixed(6)))

    return { getAfterTargetMaxTime }
  }

  private async reportVolatilityTokensMetrics(tvCollateralRatio: number | undefined) {
    try {
      const { getAfterTargetMaxTime } = await this.readAndReportVolatilityTokensParameters(tvCollateralRatio)

      let { allEvents: allEventsForVolatilityTokens } = await this.vtContractsEventsInversifyService.getBaseEvents()

      allEventsForVolatilityTokens = allEventsForVolatilityTokens.filter(a => a.args.requestId !== 0)

      const mintEventsOver1000USDC = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e => e.type === 'VtSubmitEvent' && e.args.action === 'Mint' && e.args.tokenAmountPaid >= 1_000, // 1000 USD or over
              ) || []
            : [],
        )
        .value().length

      // Report on VT Mint/Burn over 1k USD and more...
      const burnEventsOver1000USDC = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e => e.type === 'VtSubmitEvent' && e.args.action === 'Burn' && e.args.tokenAmountPaid >= 1_000, // 1000 USD or over
              ) || []
            : [],
        )
        .value().length

      this.prometheusService.statisticsVtBurnRequestsOver1K.set(burnEventsOver1000USDC)
      this.prometheusService.statisticsVtMintRequestsOver1K.set(mintEventsOver1000USDC)

      //////////////////////////////////////////////////////////////////////////
      // Calculate per mint/burn the total USDC amount of pending VT
      //////////////////////////////////////////////////////////////////////////

      const VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e =>
                  e.type === 'VtSubmitEvent' &&
                  e.args.useKeepers === true &&
                  (e.args.action === 'Burn' || e.args.action === 'Mint'),
              ) || []
            : [],
        )

      const sumUSDCPendingMints = VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
        e => e.args.action === 'Mint',
      )
        // @ts-ignore
        .map(e => e.args.tokenAmountPaid)
        .reduce((prev, curr) => prev + curr, 0)

      const sumUSDCPendingBurns = VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
        e => e.args.action === 'Burn',
      )
        // @ts-ignore
        .map(e => e.args.tokenAmountPaid)
        .reduce((prev, curr) => prev + curr, 0)

      // this.logger.info(`--> sumUSDCPendingMints: ${sumUSDCPendingMints}`)
      // this.logger.info(`--> sumUSDCPendingBurns: ${sumUSDCPendingBurns}`)

      // Now those over due
      const sumUSDCPendingMintsTargetTimePassed = VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
        // @ts-ignore
        e => e.args.action === 'Mint' && e.args.targetTimestamp * 1_000 - new Date().getTime() < 0,
      )
        // @ts-ignore
        .map(e => e.args.tokenAmountPaid)
        .reduce((prev, curr) => prev + curr, 0)

      const sumUSDCPendingBurnsTargetTimePassed = VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
        // @ts-ignore
        e => e.args.action === 'Burn' && e.args.targetTimestamp * 1_000 - new Date().getTime() < 0,
      )
        // @ts-ignore
        .map(e => e.args.tokenAmountPaid)
        .reduce((prev, curr) => prev + curr, 0)

      // this.logger.info(`--> sumUSDCPendingMintsTargetTimePassed: ${sumUSDCPendingMintsTargetTimePassed}`)
      // this.logger.info(`--> sumUSDCPendingBurnsTargetTimePassed: ${sumUSDCPendingBurnsTargetTimePassed}`)

      // Now those that should have been liquidated by now, u.e: invalid state
      // Now those over due
      const sumUSDCPendingMintsInvalidShouldBeenLiquidated =
        VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
          // @ts-ignore
          e =>
            e.args.action === 'Mint' &&
            // @ts-ignore
            e.args.targetTimestamp * 1_000 + getAfterTargetMaxTime * 1_000 - new Date().getTime() < 0,
        )
          // @ts-ignore
          .map(e => e.args.tokenAmountPaid)
          .reduce((prev, curr) => prev + curr, 0)

      const sumUSDCPendingBurnsInvalidShouldBeenLiquidated =
        VtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal.filter(
          // @ts-ignore
          e =>
            e.args.action === 'Burn' &&
            // @ts-ignore
            e.args.targetTimestamp * 1_000 + getAfterTargetMaxTime * 1_000 - new Date().getTime() < 0,
        )
          // @ts-ignore
          .map(e => e.args.tokenAmountPaid)
          .reduce((prev, curr) => prev + curr, 0)

      //
      // Report to Prometheus
      //
      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'mint', status: 'pending_fulfillment' })
        .set(Number(sumUSDCPendingMints))
      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'burn', status: 'pending_fulfillment' })
        .set(Number(sumUSDCPendingBurns))

      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'mint', status: 'pending_liquidation' })
        .set(Number(sumUSDCPendingMintsTargetTimePassed))

      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'burn', status: 'pending_liquidation' })
        .set(Number(sumUSDCPendingBurnsTargetTimePassed))

      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'mint', status: 'invalid_not_liquidated' })
        .set(Number(sumUSDCPendingMintsInvalidShouldBeenLiquidated))

      this.prometheusService.statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal
        .labels({ type: 'burn', status: 'invalid_not_liquidated' })
        .set(Number(sumUSDCPendingBurnsInvalidShouldBeenLiquidated))

      // Report on VT Pending Requests too long
      const vtPendingRequestsMintsUseKeepersON = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(e => e.type === 'VtSubmitEvent' && e.args.action === 'Mint' && e.args.useKeepers === true) || []
            : [],
        )

      const vtPendingRequestsBurnsUseKeepersON = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(e => e.type === 'VtSubmitEvent' && e.args.action === 'Burn' && e.args.useKeepers === true) || []
            : [],
        )

      const vtPendingRequestsNotYetDueFulfillment = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e => e.type === 'VtSubmitEvent' && e.args.useKeepers === true, // time's isn't up yet
              ) || []
            : [],
        )
        .value().length

      const vtPendingRequestsAlreadyDueFulfillment = chain(allEventsForVolatilityTokens)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1 ? r.find(e => e.type === 'VtSubmitEvent' && e.args.useKeepers === true) || [] : [],
        )
        .value().length

      // Pending for execution Volatility Token actions - only alert those that have useKeepers = true
      const allEventsForVolatilityTokensThatUseKeepers = allEventsForVolatilityTokens.filter(
        // @ts-ignore
        a => a.args.useKeepers === true,
      )

      const vtPendingRequestsOver2H = chain(allEventsForVolatilityTokensThatUseKeepers)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e =>
                  e.type === 'VtSubmitEvent' &&
                  (e.args.targetTimestamp * 1_000 - new Date().getTime()) / 60_000 < 60 * -1, // waiting over 2 hrs (fulfillment happens)
              ) || []
            : [],
        )
        .value().length

      const data12h = chain(allEventsForVolatilityTokensThatUseKeepers)
        .groupBy(e => e.args.requestId)
        .values()
        .flatMap(r =>
          r.length === 1
            ? r.find(
                e =>
                  e.type === 'VtSubmitEvent' &&
                  (e.args.targetTimestamp * 1_000 - new Date().getTime()) / 60_000 < 60 * -11, // waiting over 12 hours
              ) || []
            : [],
        )

      const vtPendingRequestsOver12H = data12h.value().length

      this.prometheusService.statisticsVtRequestsPending
        .labels({ type: 'mint' })
        .set(vtPendingRequestsMintsUseKeepersON.value().length)

      this.prometheusService.statisticsVtRequestsPending
        .labels({ type: 'burn' })
        .set(vtPendingRequestsBurnsUseKeepersON.value().length)

      //
      this.prometheusService.statisticsVtRequestsPendingNotYetDueFulfillment.set(vtPendingRequestsNotYetDueFulfillment)
      this.prometheusService.statisticsVtRequestsPendingAlreadyDueFulfillment.set(
        vtPendingRequestsAlreadyDueFulfillment,
      )
      this.prometheusService.statisticsVtRequestsPendingOver2H.set(vtPendingRequestsOver2H)
      this.prometheusService.statisticsVtRequestsPendingOver12H.set(vtPendingRequestsOver12H)

      return tvCollateralRatio
    } catch (e) {
      this.sentryService.sendErrorToSentry(e as Error)
    }

    return undefined
  }

  private async reportMetrics() {
    if (this.config.isTestMode) {
      return
    }

    const end = startTimer()

    const tvCollateralRatio = await this.reportThetaVaultMetrics()

    await Promise.all([
      this.reportVolatilityTokensMetrics(tvCollateralRatio),
      this.reportKeeperLinkBalance(),
      this.reportSignerBalance(),
    ])

    this.logger.info(`--> reported metrics (took ${end()}s)`)
  }

  private async reportSignerBalance() {
    const balanceRawNativeTokenAmount = await this.signerInversifyService.signer.getBalance()
    const balanceNativeTokenAmount = toNumber(balanceRawNativeTokenAmount, 18)

    this.prometheusService.signerNativeTokenBalance.set(balanceNativeTokenAmount)
  }

  private async reportKeeperLinkBalance() {
    if (this.config.serviceConfig.chainId === ChainId.ArbitrumMainnet) {
      const chainLinkKeepersRegistryAddress =
        this.config.serviceConfig.chainLinkKeepersRegistryAddress[this.config.serviceConfig.chainId]

      const chainLinkKeeperIds = this.config.serviceConfig.chainLinkKeeperIds[this.config.serviceConfig.chainId]

      for (const keeper_id of chainLinkKeeperIds) {
        const minimumBalanceForUpkeepBN =
          await this.chainLinkKeepersRegistryInversifyService.chainLinkKeepersRegistry.getMinBalanceForUpkeep(keeper_id)

        const minimumBalanceForUpkeep = toNumber(minimumBalanceForUpkeepBN, 18)

        const getUpkeepResult = await this.chainLinkKeepersRegistryInversifyService.chainLinkKeepersRegistry.getUpkeep(
          keeper_id,
        )

        const balanceInLink = toNumber(getUpkeepResult[3], 18)
        this.prometheusService.chainLinkKeeperIdsLINKBalance
          .labels({
            keeper_id: keeper_id.toString(),
          })
          .set(balanceInLink)

        this.prometheusService.chainLinkKeeperIdsMinimumBalanceForUpKeep
          .labels({
            keeper_id: keeper_id.toString(),
          })
          .set(minimumBalanceForUpkeep)

        this.logger.debug(
          `${KeepersBotService.name} - On ${
            this.config.serviceConfig.chainId
          } ChainId - ChainLink Keeper Registry address is: ${chainLinkKeepersRegistryAddress}, Will query status of ${
            chainLinkKeeperIds.length
          } keeper Ids: ${chainLinkKeeperIds.join(', ')}`,
        )
      }
    }
  }

  async onModuleDestroy() {
    if (this.reportMetricsTask) {
      clearInterval(this.reportMetricsTask)
    }
    await this.lastReportMetricsPromise
    await this.cleanup()
  }

  private runTask = async () => {
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
    const startOnNewBlock = startTimer()

    const tokens = [this.thetaVaultInversifyService, this.vtInversifyService]

    await Promise.all(
      tokens.map(async token => {
        let checkResult: {
          upkeepNeeded: boolean
          performData: string
        }
        const checkEndTimer = startTimer()
        const _prometheusMetricsByServiceName =
          token.serviceName() === 'thetaVault'
            ? this.prometheusService.getMetricsByServiceName('thetaVault')
            : this.prometheusService.getMetricsByServiceName('volatilityTokens')

        try {
          checkResult = await token.checkUpkeep()
          _prometheusMetricsByServiceName.checkUpkeepResultTotal
            .labels({ upkeep_needed: new Boolean(checkResult.upkeepNeeded).toString() })
            .inc()

          _prometheusMetricsByServiceName.checkUpkeepDurationSeconds
            .labels({ success: 'true' })
            .observe(checkEndTimer())
        } catch (e) {
          _prometheusMetricsByServiceName.checkUpkeepDurationSeconds
            .labels({ success: 'false' })
            .observe(checkEndTimer())

          this.sentryService.sendErrorToSentry(
            new CustomError({
              name: 'CheckUpKeepError',
              message: `[${token.serviceName()}]: failed to check upkeep - cant check which active protections need to be closed`,
              errorKind: ErrorKind.SystemError,
              cause: e,
            }),
          )
          return
        }

        if (checkResult.upkeepNeeded && this.config.serviceConfig.performUpkeep) {
          this.logger.info(`checkUpkeep needed. Performing upkeep for: [${token.serviceName()}]`)

          _prometheusMetricsByServiceName.performUpkeepLatestTimestamp.set(parseInt(String(Date.now() / 1000)))
          _prometheusMetricsByServiceName.performUpkeepOn.set(1)

          const performEndTimer = startTimer()

          try {
            this.logger.info(`checkResult.performData: ${checkResult.performData}`)

            await token.performUpkeep(checkResult.performData)

            _prometheusMetricsByServiceName.performUpkeepDurationSeconds
              .labels({ success: 'true' })
              .observe(performEndTimer())
          } catch (e) {
            _prometheusMetricsByServiceName.performUpkeepDurationSeconds
              .labels({ success: 'false' })
              .observe(performEndTimer())

            const balanceRawNativeTokenAmount = await this.signerInversifyService.signer.getBalance()
            const balanceNativeTokenAmount = toNumber(balanceRawNativeTokenAmount, 18)

            this.sentryService.sendErrorToSentry(
              new CustomError({
                name: 'PerformUpkeepError',
                message: `[${token.serviceName()}]: failed to perform upkeep`,
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
          _prometheusMetricsByServiceName.performUpkeepOn.set(0)
        }
      }),
    )

    this.prometheusService.newBlockProcessingDurationSeconds.observe(startOnNewBlock())
  }
}
