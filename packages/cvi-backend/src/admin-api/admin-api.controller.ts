import type { TradingCompetitionInfoParameters, CviAdminApiInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import { BackendEnvironment, getCviBackendClient, startTimer } from '@coti-cvi/lw-sdk'
import { sortEventsAsc } from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import type { OnModuleDestroy } from '@nestjs/common'
import { CacheInterceptor, Controller, Get, Inject, Query, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'
import type { CviBackendConfig } from '@coti-cvi/common-be'
import {
  TradingCompetitionInfoAddressDto,
  UpdateGeneralInfoOfEventAndAddressesDto,
  VtBurnEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
} from './dtos'
import { TvFulfillDepositEventDto, TvFulfillWithdrawEventDto, TvLiquidateEventDto, TvSubmitEventDto } from './tv-dto'
import { VtCviTransferEventDto, VtUniswapSwapEventDto } from './vt-dto'
import type { PrometheusService } from '../prometheus/prometheus.service'
import type { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

enum Resource {
  Vt = 'vt',
  Tv = 'tv',
}

export const TTL_MINUTES_REFRESH_CACHE = 5

@ApiTags(`Accounts`)
@Controller('/accounts')
export class AdminApiController implements OnModuleDestroy {
  private lastPromise: Promise<void> = Promise.resolve()

  private cacheCreateTriggerEveryXSeconds: number | undefined

  private readonly myTask: NodeJS.Timeout | undefined = undefined

  constructor(
    @Inject(INVERSIFY_SERVICES.CVI_ADMIN_API) public readonly cviAdminInversifyService: CviAdminApiInversifyService,
    @Inject('ConfigToken') readonly config: CviBackendConfig,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.cacheCreateTriggerEveryXSeconds = 60 * TTL_MINUTES_REFRESH_CACHE - 20
    this.logger.info(
      `Disable --> AdminApiController [vt-trading-competition Redis Cache - TTL is ${
        TTL_MINUTES_REFRESH_CACHE * 60
      }s (${TTL_MINUTES_REFRESH_CACHE}m), Cache creation triggered every ${this.cacheCreateTriggerEveryXSeconds}s]`,
    )
    this.myTask = setInterval(() => {
      this.lastPromise = this.triggerCacheCreation()
    }, this.cacheCreateTriggerEveryXSeconds * 1_000)
  }

  private async triggerCacheCreation() {
    this.logger.info(`ami - triggerCacheCreation running now (every ${this.cacheCreateTriggerEveryXSeconds} sec/s)`)
    this.retriggerOurOwnController({ fromTimestamp: undefined, debug: undefined })
      .then(p => {
        this.logger.info(`ami - NO-PARAMS took ${p}s (own check)`)
      })
      .catch(e => this.logger.error(`ami - error in retrigger NO-PARAMS`))
  }

  async onModuleDestroy() {
    if (this.myTask) {
      clearInterval(this.myTask)
    }
    await this.lastPromise
  }

  private async retriggerOurOwnController(params: TradingCompetitionInfoParameters): Promise<number | undefined> {
    const end = startTimer()
    this.logger.info(`ami - retriggerOurOwnController running now with\n${JSON.stringify(params, null, 2)}:\n\n`)

    try {
      const res = await getCviBackendClient({
        backendEnvironment: BackendEnvironment.Local,
        network: CHAIN_IDS_INFO[this.config.serviceConfig.chainId].networkName,
      }).accounts.adminApiControllerGetVtTradingCompetition(params)
      if (res) {
        const timeTook = end()
        const val = res
        this.prometheusService.triggerCacheCreateForTradingCompetitionTotal.labels({ error: 'false' }).inc()
        return Promise.resolve(timeTook)
      }
    } catch (e) {
      this.prometheusService.triggerCacheCreateForTradingCompetitionTotal.labels({ error: 'true' }).inc()
      return Promise.reject()
    }
  }

  @Get('/all-tv-events-asc')
  @ApiQuery({
    name: 'fromTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'fromBlockNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toBlockNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'requestId',
    required: false,
    type: Number,
  })
  @ApiOperation({
    description: 'Get all TV events',
  })
  @ApiExtraModels(TvSubmitEventDto, TvFulfillDepositEventDto, TvFulfillWithdrawEventDto, TvLiquidateEventDto)
  @ApiResponse({
    isArray: true,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(TvSubmitEventDto) },
          { $ref: getSchemaPath(TvFulfillDepositEventDto) },
          { $ref: getSchemaPath(TvFulfillWithdrawEventDto) },
          { $ref: getSchemaPath(TvLiquidateEventDto) },
        ],
      },
    },
  })
  public getAllTvEventsAsc(
    @Query('fromTimestamp') fromTimestampStr?: string,
    @Query('toTimestamp') toTimestampStr?: string,
    @Query('fromBlockNumber') fromBlockNumberStr?: string,
    @Query('toBlockNumber') toBlockNumberStr?: string,
    @Query('requestId') requestIdStr?: string,
  ): (TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)[] {
    const fromTimestamp = fromTimestampStr ? Number(fromTimestampStr) : undefined
    const toTimestamp = toTimestampStr ? Number(toTimestampStr) : undefined
    const fromBlockNumber = fromBlockNumberStr ? Number(fromBlockNumberStr) : undefined
    const toBlockNumber = toBlockNumberStr ? Number(toBlockNumberStr) : undefined
    const requestId = requestIdStr ? Number(requestIdStr) : undefined
    return [...this.cviAdminInversifyService.cviAdminApiThetaVaultsInversifyService.data.values()]
      .filter(
        e =>
          (!fromTimestamp || fromTimestamp <= e.blockTimestamp) &&
          (!toTimestamp || e.blockTimestamp <= toTimestamp) &&
          (!fromBlockNumber || fromBlockNumber <= e.blockNumber) &&
          (!toBlockNumber || e.blockNumber <= toBlockNumber) &&
          (requestId === undefined || e.args.requestId === requestId),
      )
      .sort(sortEventsAsc)
  }

  @Get('/all-vt-events-asc')
  @ApiQuery({
    name: 'fromTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'fromBlockNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toBlockNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'requestId',
    required: false,
    type: Number,
  })
  @ApiOperation({
    description: 'Get all VT events',
  })
  @ApiExtraModels(
    VtSubmitRequestEventDto,
    VtLiquidateRequestEventDto,
    VtFulfillRequestEventDto,
    VtMintEventDto,
    VtBurnEventDto,
    VtCviTransferEventDto,
    VtUniswapSwapEventDto,
  )
  @ApiResponse({
    isArray: true,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(VtSubmitRequestEventDto) },
          { $ref: getSchemaPath(VtLiquidateRequestEventDto) },
          { $ref: getSchemaPath(VtFulfillRequestEventDto) },
          { $ref: getSchemaPath(VtMintEventDto) },
          { $ref: getSchemaPath(VtBurnEventDto) },
          { $ref: getSchemaPath(VtCviTransferEventDto) },
          { $ref: getSchemaPath(VtUniswapSwapEventDto) },
        ],
      },
    },
  })
  public getAllVtEventsAsc(
    @Query('fromTimestamp') fromTimestampStr?: string,
    @Query('toTimestamp') toTimestampStr?: string,
    @Query('fromBlockNumber') fromBlockNumberStr?: string,
    @Query('toBlockNumber') toBlockNumberStr?: string,
    @Query('requestId') requestIdStr?: string,
  ): (
    | VtSubmitRequestEventDto
    | VtLiquidateRequestEventDto
    | VtFulfillRequestEventDto
    | VtMintEventDto
    | VtBurnEventDto
    | VtCviTransferEventDto
    | VtUniswapSwapEventDto
  )[] {
    const fromTimestamp = fromTimestampStr ? Number(fromTimestampStr) : undefined
    const toTimestamp = toTimestampStr ? Number(toTimestampStr) : undefined
    const fromBlockNumber = fromBlockNumberStr ? Number(fromBlockNumberStr) : undefined
    const toBlockNumber = toBlockNumberStr ? Number(toBlockNumberStr) : undefined
    const requestId = requestIdStr ? Number(requestIdStr) : undefined
    return [...this.cviAdminInversifyService.cviAdminApiVolatilityTokensInversifyService.data.values()]
      .filter(
        e =>
          (!fromTimestamp || fromTimestamp <= e.blockTimestamp) &&
          (!toTimestamp || e.blockTimestamp <= toTimestamp) &&
          (!fromBlockNumber || fromBlockNumber <= e.blockNumber) &&
          (!toBlockNumber || e.blockNumber <= toBlockNumber) &&
          (requestId === undefined ||
            (e.type !== 'VtCviTransferEvent' && e.type !== 'VtUniswapSwapEvent' && e.args.requestId === requestId)),
      )
      .sort(sortEventsAsc)
  }

  @Get('/updated-general-info-Of-event-and-addresses')
  @ApiResponse({ type: UpdateGeneralInfoOfEventAndAddressesDto })
  public getUpdateGeneralInfoOfEventAndAddressesDto(): UpdateGeneralInfoOfEventAndAddressesDto {
    return this.cviAdminInversifyService.latestGeneralInfoOfEventByAddressInversifyService.getUpdateGeneralInfoOfEventAndAddresses()
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/vt-trading-competition')
  @ApiOperation({
    description: `Get trading competition info`,
  })
  @ApiQuery({
    name: 'from-timestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'debug',
    required: false,
    type: Boolean,
  })
  @ApiResponse({ type: TradingCompetitionInfoAddressDto, isArray: true })
  public getVtTradingCompetition(
    @Query('from-timestamp')
    fromTimestamp?: string,
    @Query('debug')
    debug?: string,
  ): TradingCompetitionInfoAddressDto[] {
    const paramsInRequest = !(fromTimestamp === undefined && debug === undefined)
    const isDebug = debug === 'true'
    const options: TradingCompetitionInfoParameters = {
      fromTimestamp: fromTimestamp ? Number(fromTimestamp) : undefined,
      debug: isDebug,
    }
    this.logger.info(
      `ami - getVtTradingCompetition controller request [paramsInRequest: ${paramsInRequest} - fromTimestamp: ${fromTimestamp}, debug: ${debug}]`,
    )
    const end = startTimer()
    const retVal = this.cviAdminInversifyService.getTradingCompetitionInfo(options).map(r => ({
      ...r,
      replicaId: this.config.runningService.replicaId,
    }))

    const timeTook = end()
    this.prometheusService.VTTradingCompetitionInfoProcessingDurationSeconds.labels({
      from_timestamp: fromTimestamp,
    }).observe(timeTook)
    this.logger.info(
      `call to controller ep took paramsInRequest: ${paramsInRequest}; fromTimestamp: ${fromTimestamp} - ${timeTook}s`,
    )
    return retVal
  }

  @Get('/events-in-range')
  @ApiOperation({
    description: `return amount of events in the specified from-to range`,
  })
  @ApiQuery({
    name: 'resource',
    required: true,
    enum: Resource,
  })
  @ApiQuery({
    name: 'fromTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toTimestamp',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'fromBlockNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'toBlockNumber',
    required: false,
    type: Number,
  })
  @ApiResponse({ type: Number })
  public eventsInRange(
    @Query('resource') resourceStr: string,
    @Query('fromTimestamp') fromTimestampStr?: string,
    @Query('toTimestamp') toTimestampStr?: string,
    @Query('fromBlockNumber') fromBlockNumberStr?: string,
    @Query('toBlockNumber') toBlockNumberStr?: string,
  ): number {
    const resource = Object.values(Resource).find(r => r === resourceStr)
    if (!resource) {
      throw new Error(`resource must of one of: ${Object.values(Resource)}`)
    }
    const fromTimestamp = fromTimestampStr ? Number(fromTimestampStr) : undefined
    const toTimestamp = toTimestampStr ? Number(toTimestampStr) : undefined
    const fromBlockNumber = fromBlockNumberStr ? Number(fromBlockNumberStr) : undefined
    const toBlockNumber = toBlockNumberStr ? Number(toBlockNumberStr) : undefined
    return (
      resource === Resource.Vt
        ? [...this.cviAdminInversifyService.cviAdminApiVolatilityTokensInversifyService.data.values()]
        : [...this.cviAdminInversifyService.cviAdminApiThetaVaultsInversifyService.data.values()]
    )
      .flat()
      .filter(
        e =>
          (!fromTimestamp || fromTimestamp <= e.blockTimestamp) &&
          (!toTimestamp || e.blockTimestamp <= toTimestamp) &&
          (!fromBlockNumber || fromBlockNumber <= e.blockNumber) &&
          (!toBlockNumber || e.blockNumber <= toBlockNumber),
      ).length
  }
}
