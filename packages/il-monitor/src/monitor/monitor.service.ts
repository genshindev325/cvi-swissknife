import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { IlMonitorConfig } from '@coti-cvi/common-be'
import { SentryService } from '@coti-cvi/common-be'
import { ArmadilloSupportedTokenName, ChainId, getIlBackendClient, NUMBER_OF_SECONDS_IN_1_DAY } from '@coti-cvi/lw-sdk'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type {
  PeriodSeconds,
  AntonPremiumParamsByPeriod,
  ArmadilloSupportedPair,
  EmbedArmadilloDiscountInversifyService,
  IlContractsInversifyService,
} from '@coti-cvi/lw-sdk'
import type { ILProtectionInversifyService } from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'
import { formatFixed } from '@ethersproject/bignumber'
import { sum } from 'lodash'

export class MonitorService implements OnModuleDestroy {
  private readonly myTask: NodeJS.Timeout | undefined = undefined

  private lastPromise: Promise<void> = Promise.resolve()

  private usdcDecimals = 6

  constructor(
    @Inject('ConfigToken') private readonly config: IlMonitorConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(SentryService) private readonly sentryService: SentryService,
    @Inject('ILProtectionInversifyService') private readonly iLProtectionInversifyService: ILProtectionInversifyService,
    @Inject('IlContractsInversifyService') private readonly ilContractsInversifyService: IlContractsInversifyService,
    @Inject('EmbedArmadilloDiscountInversifyService')
    private readonly embedArmadilloDiscountInversifyService: EmbedArmadilloDiscountInversifyService,
  ) {
    this.myTask = setInterval(() => {
      this.lastPromise = this.reportMetrics()
    }, 1000 * 60)
    this.lastPromise = this.reportMetrics()
  }

  async onModuleDestroy() {
    if (this.myTask) {
      clearInterval(this.myTask)
    }
    await this.lastPromise
  }

  // Check the parabola coefficients by querying py-parabola-coefficients service and checking the coefficients in the contract
  private async checkParabolaCoefficientsOnContractsVsPyCalcService(
    forWhichPairs: ArmadilloSupportedPair[],
    forWhichPeriodDays: PeriodSeconds[],
  ) {
    let pyCalculateParabolaCoefficientsResults: AntonPremiumParamsByPeriod[] = []

    this.prometheusService.pyCalculationsRequestsTotal.inc()

    try {
      pyCalculateParabolaCoefficientsResults = await this.iLProtectionInversifyService.getAntonCurrentPremiumParams()
    } catch (e) {
      this.sentryService.sendErrorToSentry(e as Error)
    }

    if (pyCalculateParabolaCoefficientsResults) {
      pyCalculateParabolaCoefficientsResults.forEach(value => {
        const token0Symbol = value.pair.tokenName1
        const token1Symbol = value.pair.tokenName2

        const pairChecked = `${token0Symbol}${token1Symbol}`

        this.prometheusService.pyCalculateParabolaCoefficients
          .labels({
            pair: pairChecked,
            coefficient_type: 'a',
            period_days: value.period.periodSeconds / (24 * 60 * 60),
          })
          .set(value.premiumParams.A)
        this.prometheusService.pyCalculateParabolaCoefficients
          .labels({ coefficient_type: 'x0', period_days: value.period.periodSeconds / (24 * 60 * 60) })
          .set(value.premiumParams.X0)
        this.prometheusService.pyCalculateParabolaCoefficients
          .labels({ coefficient_type: 'c', period_days: value.period.periodSeconds / (24 * 60 * 60) })
          .set(value.premiumParams.C)
      })
    }

    const tokenName1 = forWhichPairs[0].tokenName1
    const tokenName2 = forWhichPairs[0].tokenName2
    // Now get the data from the contract
    const premiumParams = await Promise.all(
      forWhichPeriodDays.map(pd => {
        return this.iLProtectionInversifyService.getPremiumParamsForPairAndProtectionPeriod(
          tokenName1,
          tokenName2,
          pd.periodSeconds,
        )
      }),
    )
    //
    // report to Prometheus the a, x0, c parameter values
    //
    const arrPeriodDays = forWhichPeriodDays.map(r => r.periodSeconds / NUMBER_OF_SECONDS_IN_1_DAY)

    for (let i = 0; i < premiumParams.length; i++) {
      this.prometheusService.ilCurrentContractValueParabolaCoefficients
        .labels({ period_days: arrPeriodDays[i], coefficient_type: 'a' })
        .set(premiumParams[i].A)

      this.prometheusService.ilCurrentContractValueParabolaCoefficients
        .labels({ period_days: arrPeriodDays[i], coefficient_type: 'x0' })
        .set(premiumParams[i].X0)

      this.prometheusService.ilCurrentContractValueParabolaCoefficients
        .labels({ period_days: arrPeriodDays[i], coefficient_type: 'c' })
        .set(premiumParams[i].C)
    }
  }

  // for each PAIRS and Period - run on various protected amounts: 100, 1000, 10000 and report Premium costs
  private async reportMetricsPremiumCost(forWhichPairs: ArmadilloSupportedPair[], forWhichPeriodDays: PeriodSeconds[]) {
    const protectedAmountUSDC = 100

    await Promise.all(
      forWhichPairs.map(async pair => {
        const listPromises = []
        const token0Symbol = Object.values(ArmadilloSupportedTokenName).find(r => r === pair.tokenName1)
        const token1Symbol = Object.values(ArmadilloSupportedTokenName).find(r => r === pair.tokenName2)
        const selectedPeriodDays: number[] = forWhichPeriodDays.map(r => r.periodSeconds)

        const pairChecked = `${token0Symbol}${token1Symbol}`

        for (let indx = 0; indx < selectedPeriodDays.length; indx++) {
          if (token0Symbol && token1Symbol) {
            listPromises.push(
              this.iLProtectionInversifyService.calculatePremiumUsdc({
                pair: {
                  tokenName1: token0Symbol,
                  tokenName2: token1Symbol,
                },
                lpTokensWorthAtBuyTimeUSD: this.iLProtectionInversifyService.tokenUSDC.fromNumber(protectedAmountUSDC),
                policyPeriod: selectedPeriodDays[indx],
              }),
            )
          }
        }

        const premiumsCost: {
          premium: BigNumber
          maxAmountToBePaid: BigNumber
        }[] = await Promise.all(listPromises)
        //

        const premiumsCostResults: string[] = premiumsCost.map<string>(r => {
          return formatFixed(r.premium, this.usdcDecimals)
        })

        selectedPeriodDays.forEach((period_days_in_seconds, index) => {
          this.prometheusService.ilSimulatedPremiumCost
            .labels({
              pair: pairChecked,
              protected_amount_usdc: protectedAmountUSDC,
              period_days: period_days_in_seconds / NUMBER_OF_SECONDS_IN_1_DAY,
            })
            .set(Number(premiumsCostResults[index]))
        })
      }),
    )
  }

  private async reportEmbedMetrics() {
    const stats = await this.embedArmadilloDiscountInversifyService.getStatistics()
    for (const stat of stats) {
      this.prometheusService.embedDiscountEligiblesStats
        .labels({ discount_type_name: stat.name })
        .set(stat.eligibleWalletsCount)

      this.prometheusService.embedDiscountUsedStats.labels({ discount_type_name: stat.name }).set(stat.usedWalletsCount)

      this.prometheusService.embedDiscountTotalSupplyStats.labels({ discount_type_name: stat.name }).set(stat.supply)
    }
  }

  private async reportMetrics() {
    if (this.config.isTestMode) {
      return
    }
    try {
      await this.reportEmbedMetrics()

      // collateral used for the protections (made by external accounts - non Oded)
      const walletsProtections = await getIlBackendClient(
        ChainId.PolygonMainnet,
      ).accounts.adminApiControllerProtections()

      const arrExternalProtectionsMaxToBePaid: number[] = walletsProtections
        .filter(w => !w.isInternalWallet)
        .flatMap(p => p.protections)
        .filter(p => !p.protectionInfo.expiredEvent)
        .map(p => p.protectionInfo.metadata.maxAmountToBePaidUsdc)

      const collateralUsedByExternalAccountsProtectionsUSDC = sum(arrExternalProtectionsMaxToBePaid)
      const collateralUsedByExternalAccountsProtectionsCount = arrExternalProtectionsMaxToBePaid.length

      this.prometheusService.ilCollateralUsedForExternalAccountsUSDC.set(
        collateralUsedByExternalAccountsProtectionsUSDC,
      )
      this.prometheusService.ilCollateralUsedForExternalAccountsCount.set(
        collateralUsedByExternalAccountsProtectionsCount,
      )

      // collateral used for the protections (made by internal accounts - Oded)
      const collateralUsedByInternalAccountsProtections = sum(
        walletsProtections
          .filter(w => w.isInternalWallet)
          .flatMap(w => w.protections)
          .filter(p => !p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.metadata.maxAmountToBePaidUsdc),
      )
      this.prometheusService.ilCollateralUsedForInternalAccounts.set(collateralUsedByInternalAccountsProtections)

      // Current total TVP (not per pair)
      const currentTVPInUsdc = await this.iLProtectionInversifyService.getCurrentTvpUsdc()
      this.prometheusService.ilCurrentTotalValueProtected.set(currentTVPInUsdc)

      // Cumulative - Current total TVP (not per pair)
      const cumulativeTVP = formatFixed(
        await this.ilContractsInversifyService.controller.cumulativeSumLPTokensWorthAtBuyTimeUSD(),
        this.usdcDecimals,
      )
      this.prometheusService.ilCurrentCumulativeTotalValueProtected.set(Number(cumulativeTVP))

      await Promise.all(
        (
          await this.iLProtectionInversifyService.getPairs()
        ).map(async pair => {
          const pairToString = `${pair.tokenName1}-${pair.tokenName2}`

          // Get the left amount to protect - getLeftTvpUsdcAvailable
          const leftToProtectForPairUSDC = this.iLProtectionInversifyService.tokenUSDC.toNumber(
            await this.iLProtectionInversifyService.getLeftTvpUsdcAvailable(pair),
          )

          this.prometheusService.ilLeftTVPinUSDC.labels({ pair: pairToString }).set(leftToProtectForPairUSDC)

          // Report - Liquidity amount
          const liquidityAmount = await this.iLProtectionInversifyService.getLiquidity()
          const liquidityAmountUSDC = this.iLProtectionInversifyService.tokenUSDC.toNumber(liquidityAmount)
          this.prometheusService.ilProtectionLiquidityAmountUSDC.set(liquidityAmountUSDC)

          // ratio between total tvp to liquidity
          this.prometheusService.ilSumLeftPlusCurrentTVPToLiquidityRatio
            .labels({ pair: pairToString })
            .set((currentTVPInUsdc + leftToProtectForPairUSDC) / liquidityAmountUSDC)

          // Collateral cap. percent per pair
          const ColCap = await this.ilContractsInversifyService.tokenPairRepository.getCollateralCapComponent(
            pair.tokenName1,
            pair.tokenName2,
          )
          this.prometheusService.ilCollateralCapComponentPercent.labels({ pair: pairToString }).set(ColCap / 100)
        }),
      )

      // Report - Max IL protected %
      const maxILProtectedPercentage = await this.iLProtectionInversifyService.getMaxILProtectedPercentage()
      this.prometheusService.ilProtectionMaxILProtectedPercentage.set(maxILProtectedPercentage.number)
      // Report - Supported Pairs
      const pairs = await this.iLProtectionInversifyService.getPairs()
      const periodSeconds = await this.iLProtectionInversifyService.getPeriodsSeconds()
      this.prometheusService.ilProtectionPairsTotal.set(pairs.length)
      // For the supported pairs and periods - read per each the 3 coefficients
      await this.checkParabolaCoefficientsOnContractsVsPyCalcService(pairs, periodSeconds)

      await this.reportMetricsPremiumCost(pairs, periodSeconds)

      // const tokenCounter = await this.iLProtectionInversifyService.nft.tokenIdCounter()
      // Report - Protection periods + active NFTs
      const totalSupplyNFT = await this.iLProtectionInversifyService.ilContractsInversifyService.nft.totalSupply()
      const periodsListInDays: number[] = periodSeconds.map(period => period.periodSeconds / NUMBER_OF_SECONDS_IN_1_DAY)

      this.prometheusService.ilProtectionPeriodsTotal.set(periodsListInDays.length)

      periodsListInDays.forEach((period, index) => {
        this.prometheusService.ilProtectionPeriodDays.labels({ index }).set(period)
      })
      this.prometheusService.ilProtectionNFTTotalSupply.set(Number(totalSupplyNFT.toString()))
    } catch (e) {
      this.sentryService.sendErrorToSentry(e as Error)
    }
  }
}
