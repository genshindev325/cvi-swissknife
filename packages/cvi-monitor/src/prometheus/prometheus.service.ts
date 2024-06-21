import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client'
import type { TvMonitorConfig } from '@coti-cvi/common-be'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  constructor(
    @Inject('ConfigToken') readonly config: TvMonitorConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    collectDefaultMetrics({ prefix: this.getMetricsPrefix(), register: this.registry })
    logger.info(`this.config.runningService.runtimeName: ${this.config.runningService.runtimeName}`)
  }

  async onModuleDestroy() {
    // to stop any async operations when prometheus call us to get new metrics
    this.registry.clear()
  }

  private getMetricsPrefix() {
    return `${this.config.runningService.runtimeName.replaceAll('-', '_').replaceAll('.', '_')}__`
  }

  public async getMetrics() {
    return this.registry.metrics()
  }

  public readonly statisticsCVIIndexValue = new Gauge({
    name: `${this.getMetricsPrefix()}stats_cvi_index_value`,
    help: 'the cvi index value',
    registers: [this.registry],
  })

  // ThetaVault performUpKeep - On Mainnet we set this to Disabled (or enabled, if we want to spare the LINK costs of using ChainLink Keepers)
  public readonly performUpkeepEnabledTv = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_enabled_tv`,
    help: 'do we perform upkeep ourselves every block for theta vault (if 0, we probably use only ChainLink keepers)',
    registers: [this.registry],
  })

  // ThetaVault performUpKeep - 0 = false, 1 = true (momentarily on/off)
  public readonly performUpkeepOnTv = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_on_tv`,
    help: 'did we just perform an upkeep on theta vault (momentarily. turns 1 then to 0 following upkeep)',
    registers: [this.registry],
  })

  // ThetaVault performUpKeep - latest TV upkeep in timestamp seconds
  public readonly performUpkeepOnTvLatestTimestamp = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_on_tv_latest_timestamp_seconds`,
    help: 'in epoch seconds when was latest upkeep on theta vault',
    registers: [this.registry],
  })

  // Volatility Tokens performUpKeep - On Mainnet we set this to Disabled, because we use ChainLink Keepers to trigger it
  public readonly performUpkeepEnabledVt = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_enabled_vt`,
    help: 'do we perform upkeep ourselves every block for volatility tokens (if 0, we probably use only ChainLink keepers)',
    registers: [this.registry],
  })

  // Volatility Tokens performUpKeep - 0 = false, 1 = true (momentarily on/off)
  public readonly performUpkeepOnVt = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_on_vt`,
    help: 'did we just perform an upkeep on volatility tokens (momentarily. turns 1 then to 0 following upkeep)',
    registers: [this.registry],
  })

  // Volatility Tokens performUpKeep - latest VT upkeep in timestamp seconds
  public readonly performUpkeepOnVtLatestTimestamp = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_on_vt_latest_timestamp_seconds`,
    help: 'in epoch seconds when was latest upkeep on volatility tokens',
    registers: [this.registry],
  })

  public readonly newBlockProcessingDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}new_block_processing_duration_seconds`,
    help: 'how long it takes to process a new received block',
    registers: [this.registry],
    buckets: [0.25, 0.5, 0.75, 1, 2, 3, 5],
  })

  // theta vault metrics
  public readonly checkUpkeepResultTotalTv = new Counter({
    name: `${this.getMetricsPrefix()}check_up_keep_result_total_tv`,
    help: 'check up keep results total on theta vault',
    labelNames: ['upkeep_needed'],
    registers: [this.registry],
  })

  public readonly checkUpkeepDurationSecondsTv = new Histogram({
    name: `${this.getMetricsPrefix()}check_up_keep_duration_seconds_tv`,
    help: 'check up keep duration seconds on theta vault',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  public readonly performUpkeepDurationSecondsTv = new Histogram({
    name: `${this.getMetricsPrefix()}perform_up_keep_duration_seconds_tv`,
    help: 'perform up keep duration seconds on theta vault',
    registers: [this.registry],
    labelNames: ['success'], // was performUpkeep successful or not
    buckets: [0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  public readonly statisticsTvPnlUsdc = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_pnl_usdc`,
    help: 'statistics quoting the pnl (profit and loss) of theta vault (usdc)',
    registers: [this.registry],
  })

  // aka on https://www.sushi.com/swap?token0=0x8096aD3107715747361acefE685943bFB427C722&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161
  public readonly statisticsDexVtPooledUsdcBalance = new Gauge({
    name: `${this.getMetricsPrefix()}stats_dex_vt_pooled_usdc_balance`,
    help: 'statistics showing the amount of usdc pooled for volatility tokens on dex (in USDC value)',
    registers: [this.registry],
  })

  // units of CVI- aka on https://www.sushi.com/swap?token0=0x8096aD3107715747361acefE685943bFB427C722&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161
  public readonly statisticsDexVtPooledCviBalance = new Gauge({
    name: `${this.getMetricsPrefix()}stats_dex_vt_pooled_cvol_balance`,
    help: 'statistics showing the amount of cvi pooled for volatility tokens on dex (in CVI units)',
    registers: [this.registry],
  })

  // shown on https://theta.cvi.finance/vaults for cvi x1
  public readonly statisticsTvPlatformCviVaultTvlUsdc = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_platform_cvolx1_vault_tvl`,
    help: 'statistics showing cvi platform vault tvl',
    registers: [this.registry],
  })

  public readonly statisticsPlatformUsdcLiquidity = new Gauge({
    name: `${this.getMetricsPrefix()}stats_platform_usdc_liquidity`,
    help: 'when depositing liquidity to platform, part goes into minting and dex offering the minted tokens and part stays as platform liquidity',
    registers: [this.registry],
  })

  public readonly statisticsVtRequestsPending = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_requests_pending`,
    help: 'volatility tokens requests (mint or burn) pending to be fulfilled',
    registers: [this.registry],
    labelNames: ['type'], // mint/burn
  })

  public readonly statisticsVtRequestsPendingNotYetDueFulfillment = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_requests_pending_not_yet_due_fulfillment`,
    help: 'volatility tokens requests (mint or burn) pending not yet due fulfillment',
    registers: [this.registry],
  })

  public readonly statisticsVtRequestsPendingAlreadyDueFulfillment = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_requests_pending_already_due_fulfillment`,
    help: 'volatility tokens requests (mint or burn) pending when they already should have been fulfilled',
    registers: [this.registry],
  })

  public readonly statisticsVtRequestsPendingOver2H = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_requests_pending_over_2h`,
    help: 'volatility tokens requests (mint or burn) pending over more than 2 hours to be fulfilled',
    registers: [this.registry],
  })

  public readonly statisticsVtRequestsPendingOver12H = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_requests_pending_over_12h`,
    help: 'volatility tokens requests (mint or burn) pending over more than 12 hours to be fulfilled',
    registers: [this.registry],
  })

  public readonly statisticsVtMaxMintAmountUsdc = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_max_mint_amount_usdc`,
    help: 'volatility tokens maximum mint amount in usdc',
    registers: [this.registry],
  })

  public readonly statisticsVtDexPriceUsdc = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_dex_price_usdc`,
    help: 'vt dex price in usdc',
    registers: [this.registry],
  })

  public readonly statisticsVtPlatformIntrinsicPriceUsdc = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_platform_intrinsic_price_usdc`,
    help: 'vt platform (intrinsic) price in usdc',
    registers: [this.registry],
  })

  public readonly statisticsVtHourlyFundingFeePercent = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_hourly_funding_fee_percent`,
    help: 'vt hourly funding fee in percent (since jan2023, 2d, also based on utilization percent)',
    registers: [this.registry],
  })

  public readonly statisticsTvDepositOrWithdrawRequestsUSDCTotal = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_deposit_or_withdraw_requests_usdc_total`,
    help: 'theta vault deposit/withdraw requests (in processing) usdc total',
    registers: [this.registry],
    labelNames: ['type'], // deposit/withdraw
  })

  // TBD: also add volTokenPositionBalance
  public readonly statisticsTvCollateralRatioPercent = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_collateral_ratio_percent`,
    help: 'statistics showing theta vault collateral ratio (percentage)',
    registers: [this.registry],
  })

  public readonly statisticsVtFundingFeeParams__DailyFundingFeePercentAtCurrentUtilizationRatio = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__daily_funding_fee_percent_at_current_utilization_ratio`,
    help: 'the daily funding fee for cvi values based on the current utilization ratio (and the daily funding fee params)',
    registers: [this.registry],
    labelNames: ['cvi_index'],
  })

  public readonly statisticsVtFundingFeeParams__DailyMinFundingPercent = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__daily_min_percent`,
    help: 'vt funding parameters for 2d funding fee (index val+utilization) - daily minimum funding fee percent',
    registers: [this.registry],
  })

  public readonly statisticsVtFundingFeeParams__DailyMaxFundingPercent = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__daily_max_percent`,
    help: 'vt funding parameters for 2d funding fee (index val+utilization) - daily maximum funding fee percent',
    registers: [this.registry],
  })

  public readonly statisticsVtFundingFeeParams__minFundingFeeCviThreshold = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__min_funding_fee_cvi_threshold`,
    help: 'vt funding parameters for 2d funding fee (index val+utilization) - minimum funding fee cvi threshold',
    registers: [this.registry],
  })

  public readonly statisticsVtFundingFeeParams__maxFundingFeeCviThreshold = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__max_funding_fee_cvi_threshold`,
    help: 'vt funding parameters for 2d funding fee (index val+utilization) - maximum funding fee cvi threshold',
    registers: [this.registry],
  })

  public readonly statisticsVtFundingFeeParams__fundingFeeDivisionFactor = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_funding_fee_params__funding_fee_division_factor`,
    help: 'vt funding parameters for 2d funding fee (index val+utilization) - funding fee division factor',
    registers: [this.registry],
  })

  public readonly statisticsDexVolTokenBalance = new Gauge({
    name: `${this.getMetricsPrefix()}stats_dex_vol_token_balance`,
    help: 'dex vol token balance',
    registers: [this.registry],
  })

  public readonly statisticsTvRequestsPending = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_requests_pending`,
    help: 'Theta Vault requests (deposit or withdraw) pending to be fulfilled',
    registers: [this.registry],
  })

  public readonly statisticsTvUtilizationPercent = new Gauge({
    name: `${this.getMetricsPrefix()}stats_tv_utilization_percent`,
    help: 'tv utilization in percent',
    registers: [this.registry],
  })

  // volatility tokens metrics
  public readonly checkUpkeepResultTotalVt = new Counter({
    name: `${this.getMetricsPrefix()}check_up_keep_result_total_vt`,
    help: 'check up keep results total on volatility tokens',
    labelNames: ['upkeep_needed'],
    registers: [this.registry],
  })

  public readonly statisticsVtBurnOrMintNonBotOnlySubmittedEventRequestsUSDCTotal = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_burn_or_mint_requests_usdc_total`,
    help: 'volatility tokens burn or mint requests, non-bot (i.e: useKeepers=true), in processing (different statuses) usdc total',
    registers: [this.registry],
    labelNames: ['type', 'status'], // type: mint/burn, status: pending_fulfillment, pending_liquidation
  })

  public readonly statisticsVtBurnRequestsOver1K = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_burn_requests_over_1k`,
    help: 'volatility tokens burn requests (in processing) over 1000 usd',
    registers: [this.registry],
  })

  public readonly statisticsVtMintRequestsOver1K = new Gauge({
    name: `${this.getMetricsPrefix()}stats_vt_mint_requests_over_1k`,
    help: 'volatility tokens mint requests (in processing) over 1000 usd',
    registers: [this.registry],
  })

  public readonly checkUpkeepDurationSecondsVt = new Histogram({
    name: `${this.getMetricsPrefix()}check_up_keep_duration_seconds_vt`,
    help: 'check up keep duration seconds on volatility tokens',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  public readonly performUpkeepDurationSecondsVt = new Histogram({
    name: `${this.getMetricsPrefix()}perform_up_keep_duration_seconds_vt`,
    help: 'perform up keep duration seconds on volatility tokens',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  // For each and every chainlink keeper that we configured, see main README.md, track the balance of Keeper Id LINK token
  public readonly chainLinkKeeperIdsLINKBalance = new Gauge({
    name: `${this.getMetricsPrefix()}chainlink_keeper_id_link_balance`,
    help: 'for each and every ChainLink keeper that we have configured track the keeper LINK balance (see readme swissknife for keepers list)',
    registers: [this.registry],
    labelNames: ['keeper_id'],
  })

  public readonly chainLinkKeeperIdsMinimumBalanceForUpKeep = new Gauge({
    name: `${this.getMetricsPrefix()}chainlink_keeper_id_minimum_link_balance_for_upkeep`,
    help: 'for each and every ChainLink keeper that we have configured track the minimum keeper LINK balance',
    registers: [this.registry],
    labelNames: ['keeper_id'],
  })

  public readonly signerNativeTokenBalance = new Gauge({
    name: `${this.getMetricsPrefix()}signer_native_token_balance`,
    help: 'native token balance, i.e: on Ethereum its ETH, Arbitrum its Arb=ETH, Polygon its matic',
    registers: [this.registry],
  })

  public readonly arbitrageBotRunsTotal = new Counter({
    name: `${this.getMetricsPrefix()}arbitrage_bot_runs_total`,
    help: 'how many times the arbitrage bot had run',
    registers: [this.registry],
  })

  public readonly arbitrageBotUSDCBalance = new Gauge({
    name: `${this.getMetricsPrefix()}arbitrage_bot_usdc_balance`,
    help: 'arbitrage bot USDC balance (does small 0.01 USDC deposits to vault every so often)',
    registers: [this.registry],
  })

  public getMetricsByServiceName(serviceName: 'thetaVault' | 'volatilityTokens') {
    if (serviceName === 'thetaVault') {
      return {
        checkUpkeepResultTotal: this.checkUpkeepResultTotalTv,
        checkUpkeepDurationSeconds: this.checkUpkeepDurationSecondsTv,
        performUpkeepDurationSeconds: this.performUpkeepDurationSecondsTv,
        performUpkeepEnabled: this.performUpkeepEnabledTv,
        performUpkeepOn: this.performUpkeepOnTv,
        performUpkeepLatestTimestamp: this.performUpkeepOnTvLatestTimestamp,
      }
    }

    return {
      checkUpkeepResultTotal: this.checkUpkeepResultTotalVt,
      checkUpkeepDurationSeconds: this.checkUpkeepDurationSecondsVt,
      performUpkeepDurationSeconds: this.performUpkeepDurationSecondsVt,
      performUpkeepEnabled: this.performUpkeepEnabledVt,
      performUpkeepOn: this.performUpkeepOnVt,
      performUpkeepLatestTimestamp: this.performUpkeepOnVtLatestTimestamp,
    }
  }
}
