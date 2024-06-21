import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client'
import type { IlMonitorConfig } from '@coti-cvi/common-be'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  constructor(
    @Inject('ConfigToken') readonly config: IlMonitorConfig,
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

  public readonly checkUpkeepResultTotal = new Counter({
    name: `${this.getMetricsPrefix()}check_up_keep_result_total`,
    help: 'check up keep results total',
    labelNames: ['upkeep_needed'],
    registers: [this.registry],
  })

  public readonly checkUpkeepDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}check_up_keep_duration_seconds`,
    help: 'check up keep duration seconds',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.01, 0.05, 0.1, 0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  public readonly performUpkeepDurationSeconds = new Histogram({
    name: `${this.getMetricsPrefix()}perform_up_keep_duration_seconds`,
    help: 'perform up keep duration seconds',
    registers: [this.registry],
    labelNames: ['success'],
    buckets: [0.5, 0.75, 1, 1.5, 2, 3, 5],
  })

  // On Mainnet we set this to Disabled, because we use ChainLink Keepers to trigger it
  public readonly performUpkeepEnabled = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_enabled`,
    help: 'is service configured to also perform UpKeep',
    registers: [this.registry],
  })

  public readonly recurringPremiumBuyerBotEnabled = new Gauge({
    name: `${this.getMetricsPrefix()}recurring_premium_buyer_bot_enabled`,
    help: 'is service configured to also perform recurring premium buying',
    registers: [this.registry],
  })

  // 0 = false, 1 = true
  public readonly performUpkeepOn = new Gauge({
    name: `${this.getMetricsPrefix()}perform_up_keep_on`,
    help: 'did we just perform an upkeep',
    registers: [this.registry],
  })

  public readonly ilProtectionLiquidityAmountUSDC = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_liquidity_amount_usdc`,
    help: 'liquidity amount of IL Protection contract in USDC',
    registers: [this.registry],
  })

  public readonly ilLeftTVPinUSDC = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_left_tvp_in_usdc`,
    help: 'how much more in USDC terms we can add to TVP (i.e: left to protect) based on liquidity and collateral, cvi index etc',
    labelNames: ['pair'],
    registers: [this.registry],
  })

  public readonly ilCollateralUsedForInternalAccounts = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_collateral_usage_by_internal_accounts_usdc`,
    help: 'the collateral in USDC used for the sole purpose of internal accounts',
    registers: [this.registry],
  })

  public readonly ilCollateralUsedForExternalAccountsUSDC = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_collateral_usage_by_external_accounts_usdc`,
    help: 'the collateral in USDC used for the sole purpose of external accounts',
    registers: [this.registry],
  })

  public readonly ilCollateralUsedForExternalAccountsCount = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_collateral_usage_by_external_accounts_count`,
    help: 'the collateral (count of protections) used for the sole purpose of external accounts',
    registers: [this.registry],
  })

  public readonly ilCollateralCapComponentPercent = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_collateral_cap_component_percent`,
    help: 'the collateral cap component percent per pair to protect against IL',
    labelNames: ['pair'],
    registers: [this.registry],
  })

  public readonly ilCurrentTotalValueProtected = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_current_tvp_usdc`,
    help: 'how much total USDC we currently have in TVP or protection',
    registers: [this.registry],
  })

  public readonly ilCurrentCumulativeTotalValueProtected = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_cumulative_tvp_usdc`,
    help: 'how much cumulative (all-time) total USDC we currently have in TVP or protection',
    registers: [this.registry],
  })

  public readonly ilSumLeftPlusCurrentTVPToLiquidityRatio = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_current_plus_left_tvp_to_liquidity_ratio`,
    help: 'the ratio between the IL product liquidity to (current TVP + left TVP)',
    labelNames: ['pair'],
    registers: [this.registry],
  })

  public readonly ilProtectionNFTTotalSupply = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_nft_total_supply`,
    help: 'number of NFTs for IL protections (total supply)',
    registers: [this.registry],
  })

  public readonly ilProtectionPeriodsTotal = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_period_total`,
    help: 'total count of protection periods available in IL Protection contract',
    registers: [this.registry],
  })

  public readonly ilProtectionPeriodDays = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_period_days`,
    help: 'protection periods (in days) per each available period for insurance in IL Protection contract',
    labelNames: ['index'],
    registers: [this.registry],
  })

  public readonly ilProtectionMaxILProtectedPercentage = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_max_protection_percentage`,
    help: 'max percent of impermanent loss to pay to IL protection buyer',
    labelNames: ['index'],
    registers: [this.registry],
  })

  public readonly ilProtectionPairsTotal = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_pairs_total`,
    help: 'how many pairs are supported in IL product',
    registers: [this.registry],
  })

  public readonly ilCurrentContractValueParabolaCoefficients = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_current_contract_value_parabola_coefficients`,
    help: 'per protection period metric reports the current value on the contract of the different a,xo,c parabola coefficient',
    registers: [this.registry],
    labelNames: ['period_days', 'coefficient_type'],
  })

  public readonly pyCalculationsRequestsTotal = new Counter({
    name: `${this.getMetricsPrefix()}py_calculations_requests_total`,
    help: 'check up keep results total',
    registers: [this.registry],
  })

  public readonly pyCalculateParabolaCoefficients = new Gauge({
    name: `${this.getMetricsPrefix()}py_calculated_value_parabola_coefficients`,
    help: 'per protection period (and pair, in the future) metric reports the current value the python parabola coefficients service calculated for a,x0,c parabola coefficient',
    registers: [this.registry],
    labelNames: ['pair', 'period_days', 'coefficient_type'], // in the future when diff pair have diff a,x0,c then use it , 'pair'],
  })

  public readonly ilSimulatedPremiumCost = new Gauge({
    name: `${this.getMetricsPrefix()}armadillo_simulated_premium_cost_usdc`,
    help: 'metric that simulates premium cost of insurance based for various protected amounts (without platform fee)',
    registers: [this.registry],
    labelNames: ['protected_amount_usdc', 'period_days', 'pair'],
  })

  public readonly embedDiscountTotalSupplyStats = new Gauge({
    name: `${this.getMetricsPrefix()}embed_discount_total_supply_stats`,
    help: 'metric that tracks the total supply of the embed discounts per discount-type',
    registers: [this.registry],
    labelNames: ['discount_type_name'],
  })

  public readonly embedDiscountEligiblesStats = new Gauge({
    name: `${this.getMetricsPrefix()}embed_discount_eligibles_stats`,
    help: 'metric that tracks how many different addresses are eligible for embed discount per discount-type',
    registers: [this.registry],
    labelNames: ['discount_type_name'],
  })

  public readonly embedDiscountUsedStats = new Gauge({
    name: `${this.getMetricsPrefix()}embed_discount_used_stats`,
    help: 'metric that tracks how many embed discounts were used per discount-type',
    registers: [this.registry],
    labelNames: ['discount_type_name'],
  })
}
