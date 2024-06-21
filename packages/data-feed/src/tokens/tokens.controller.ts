import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiProperty, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { startTimer, TokenName } from '@coti-cvi/lw-sdk'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type { Point } from './tokens.service'
import { TokensService } from './tokens.service'

export class PointDto implements Point {
  @ApiProperty({ type: Number, description: 'epoch in seconds' })
  x!: number

  @ApiProperty({ type: Number })
  y!: number
}

@ApiTags(`Tokens`)
@Controller('/tokens')
export class TokensController {
  constructor(
    @Inject(TokensService) private readonly tokensService: TokensService,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
  ) {}

  @Get('/daily-price-history')
  @ApiQuery({
    name: 'token',
    required: true,
    enum: ['oldPolygonCvi', TokenName.WBTC, TokenName.ETH],
  })
  @ApiOperation({ description: 'get all prices daily from coingecko of a token' })
  @ApiResponse({ type: PointDto, isArray: true })
  public async tokenDailyPriceHistory(
    @Query()
    { token }: { token: 'oldPolygonCvi' | TokenName.WBTC | TokenName.ETH },
  ): Promise<PointDto[]> {
    this.prometheusService.cviQuickswapGetAllCviPricesRequestsTotal.inc()
    const endTimerGetCviQuickSwapHistory = startTimer()
    const ret = this.tokensService.tokensDailyPriceHistory[token]
    this.prometheusService.cviQuickswapGetAllCviPricesDurationSeconds.observe(endTimerGetCviQuickSwapHistory())
    return ret
  }
}
