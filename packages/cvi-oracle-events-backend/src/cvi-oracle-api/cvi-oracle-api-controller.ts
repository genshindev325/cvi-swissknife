import type { CviOracleAdminApiInversifyService, CVIOracleInversifyService } from '@coti-cvi/lw-sdk'
import { INVERSIFY_SERVICES } from '@coti-cvi/lw-sdk'
import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { GetCviOracleHistoryDataQueryDto } from './cvi-oracle-dtos'
import { CviOracleLatestDto, MinimalCviOracleEventDto, MinimalCviOracleEventOhlcDto } from './cvi-oracle-dtos'

@ApiTags(`Cvi Oracle`)
@Controller('/cvi-oracle')
export class CviOracleApiController {
  constructor(
    @Inject(INVERSIFY_SERVICES.CVI_ORACLE_ADMIN_API)
    public readonly cviOracleAdminApiInversifyService: CviOracleAdminApiInversifyService,
    @Inject('CVIOracleInversifyService') private readonly cviOracleInversifyService: CVIOracleInversifyService,
  ) {}

  @Post('/all-cvi-indexes')
  @ApiOperation({
    description: `cvi index **events** of all time,the response is the formatted events monitored directly from the smart contract.`,
  })
  @ApiResponse({
    type: MinimalCviOracleEventDto,
  })
  public async getAllCviIndexes(@Body() body: GetCviOracleHistoryDataQueryDto): Promise<MinimalCviOracleEventDto> {
    return this.cviOracleAdminApiInversifyService.getMinimalCviOracleEvents(body)
  }

  @Post('/all-cvi-indexes-ohlc')
  @ApiOperation({
    description: `cvi index **events** of all time,the response is the formatted events monitored directly from the smart contract. by ohlc`,
  })
  @ApiResponse({
    type: MinimalCviOracleEventOhlcDto,
  })
  public async getAllCviIndexesOhlc(
    @Body() body: GetCviOracleHistoryDataQueryDto,
  ): Promise<MinimalCviOracleEventOhlcDto> {
    return this.cviOracleAdminApiInversifyService.getMinimalCviOracleEventsOhlc(body)
  }

  @Get('/latest-cvi-index')
  @ApiOperation({
    description: `Get the latest cvi index`,
  })
  @ApiResponse({
    type: CviOracleLatestDto,
  })
  public async getLatestCviIndex(): Promise<CviOracleLatestDto> {
    return this.cviOracleInversifyService.getCviIndex().then<CviOracleLatestDto>(r => ({
      cviIndex: r.cviNumber,
      timestamp: r.cviRoundTimestamp,
    }))
  }
}
