import { Inject } from '@nestjs/common'
import type { WorstIlOfTokenByCoinGeko } from '@coti-cvi/lw-sdk'
import type { WorstIlByCoinGeckoDailySwapsInversifyService } from '@coti-cvi/lw-sdk'
import type { PrometheusService } from '../prometheus/prometheus.service'
import { startTimer } from '@coti-cvi/lw-sdk'
import type { IlBackendConfig } from '@coti-cvi/common-be'

export class CalcMaxIlService {
  constructor(
    @Inject('ConfigToken') readonly config: IlBackendConfig,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject('WorstIlByCoinGeckoDailySwapsInversifyService')
    private readonly worstIlByCoinGeckoDailySwapsInversifyService: WorstIlByCoinGeckoDailySwapsInversifyService,
  ) {}

  public getWorstIlPerPair(): WorstIlOfTokenByCoinGeko[] {
    const endTimerGetWorstIlPerPair = startTimer()

    const worstIls = this.worstIlByCoinGeckoDailySwapsInversifyService.worstIls
    for (const worstIl of worstIls) {
      const pair = `${worstIl.token1Name.ArmadilloSupportedTokenName}-${worstIl.token2Name.ArmadilloSupportedTokenName}`
      this.prometheusService.maxIlPerPairPercent.labels({ pair }).set(worstIl.worstIlPercentage)
      this.prometheusService.maxIlPerPairPeriodStartTimestampSeconds.labels({ pair }).set(worstIl.start.dateMs / 1000)
      this.prometheusService.maxIlPerPairPeriodEndTimestampSeconds.labels({ pair }).set(worstIl.end.dateMs / 1000)
    }
    this.prometheusService.maxIlRequestDurationSeconds.labels({ success: 'true' }).observe(endTimerGetWorstIlPerPair())

    this.prometheusService.maxIlRequestsTotal.labels({ http_status_code: 200 }).inc()

    return worstIls
  }
}
