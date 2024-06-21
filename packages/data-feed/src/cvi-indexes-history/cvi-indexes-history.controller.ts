import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags, ApiProperty, ApiResponse } from '@nestjs/swagger'
import { BlockchainName } from '@coti-cvi/lw-sdk'
import { CviIndexesHistoryService } from './cvi-indexes-history.service'
import { verifyEnumQueryParamPipe } from '@coti-cvi/common-be'
import type { PointSummary, PointsSummaryResult } from '@coti-cvi/lw-sdk'

enum Index {
  CviIndex = 'cvi-index',
  Ethvol = 'ethvol',
}

export class PointSummaryDto implements PointSummary {
  @ApiProperty({ type: Number, description: 'lowest point in a time-range (day/hour)' })
  low!: number

  @ApiProperty({ type: Number, description: 'highest point in a time-range (day/hour)' })
  high!: number

  @ApiProperty({ type: Number, description: 'start of the time-range (day/hour)' })
  open!: number

  @ApiProperty({ type: Number, description: 'end of the time-range (day/hour)' })
  close!: number

  @ApiProperty({ type: Number, description: 'epoch in seconds' })
  time!: number

  @ApiProperty({ type: String, description: 'epoch in seconds' })
  timeUtc!: string
}

export class PointsSummaryResultDto implements PointsSummaryResult {
  @ApiProperty({
    type: PointSummaryDto,
    isArray: true,
    description: 'data is sorted in asc order by time property',
  })
  data!: PointSummaryDto[]

  @ApiProperty({ type: Number })
  highestTimestampMs!: number
}

export class SummaryCviIndexUsdcBasicDto {
  @ApiProperty({ type: Number })
  value!: number

  @ApiProperty({ type: Number, description: 'epoch in seconds' })
  time!: number

  @ApiProperty({ type: String })
  timeUtc!: string
}

export class SummaryCviIndexResultBasicDto {
  @ApiProperty({
    type: SummaryCviIndexUsdcBasicDto,
    isArray: true,
    description: 'data is sorted in asc order by time property',
  })
  data!: SummaryCviIndexUsdcBasicDto[]

  @ApiProperty({ type: Number })
  highestTimestampMs!: number
}

@ApiTags(`Cvi Index History`)
@Controller('/history')
export class CviIndexesHistoryController {
  constructor(@Inject(CviIndexesHistoryService) private readonly cviIndexHistoryService: CviIndexesHistoryService) {}

  @Get('/basic/per-day')
  @ApiOperation({ description: 'get cvi-indexes per day from the last 3 years. each day contain is a single point' })
  @ApiQuery({
    name: 'fromTimestampMs',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'blockchainName',
    required: true,
    enum: BlockchainName,
  })
  @ApiQuery({
    name: 'index',
    required: true,
    enum: Index,
  })
  @ApiResponse({ type: SummaryCviIndexResultBasicDto })
  public getAllCviIndexesPerDayBasic(
    @Query(verifyEnumQueryParamPipe(BlockchainName, 'blockchainName'), verifyEnumQueryParamPipe(Index, 'index'))
    {
      fromTimestampMs,
      blockchainName,
      index,
    }: {
      blockchainName: BlockchainName
      fromTimestampMs?: string
      index: Index
    },
  ): SummaryCviIndexResultBasicDto {
    const result =
      index === Index.CviIndex
        ? this.cviIndexHistoryService.getAllCviIndexesPerDay({
            fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
            blockchainName,
          })
        : this.cviIndexHistoryService.getAllEthvolPerDay({
            fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
            blockchainName,
          })

    const data = result.data.map<SummaryCviIndexUsdcBasicDto>(r => ({
      time: r.time,
      value: r.close,
      timeUtc: r.timeUtc,
    }))

    return {
      data,
      highestTimestampMs: result.highestTimestampMs,
    }
  }

  @Get('/basic/per-hour')
  @ApiOperation({ description: 'get cvi-indexes per hour in the last <N> days. each hour contain is a single point' })
  @ApiQuery({
    name: 'fromTimestampMs',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'blockchainName',
    required: true,
    enum: BlockchainName,
  })
  @ApiQuery({
    name: 'index',
    required: true,
    enum: Index,
  })
  @ApiResponse({ type: SummaryCviIndexResultBasicDto })
  public getAllCviIndexesPerHourBasic(
    @Query(verifyEnumQueryParamPipe(BlockchainName, 'blockchainName'), verifyEnumQueryParamPipe(Index, 'index'))
    {
      fromTimestampMs,
      blockchainName,
      index,
    }: {
      blockchainName: BlockchainName
      fromTimestampMs?: string
      index: Index
    },
  ): SummaryCviIndexResultBasicDto {
    console.log(
      `fromTimestampMs received @ /basic/per-hour: ${fromTimestampMs} ${new Date(
        Number(fromTimestampMs),
      ).toISOString()}`,
    )
    const result =
      index === Index.CviIndex
        ? this.cviIndexHistoryService.getAllCviIndexesPerHour({
            fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
            blockchainName,
          })
        : this.cviIndexHistoryService.getAllEthvolPerHour({
            fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
            blockchainName,
          })

    const data = result.data.map<SummaryCviIndexUsdcBasicDto>(r => ({
      time: r.time,
      value: r.close,
      timeUtc: r.timeUtc,
    }))

    return {
      data,
      highestTimestampMs: result.highestTimestampMs,
    }
  }

  @Get('/candlestick/per-day')
  @ApiOperation({ description: 'get cvi-indexes per day from the last 3 years. each day contain: min,max,start,end' })
  @ApiQuery({
    name: 'fromTimestampMs',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'blockchainName',
    required: true,
    enum: BlockchainName,
  })
  @ApiQuery({
    name: 'index',
    required: true,
    enum: Index,
  })
  @ApiResponse({ type: PointsSummaryResultDto })
  public getAllCviIndexesPerDayCandlestick(
    @Query(verifyEnumQueryParamPipe(BlockchainName, 'blockchainName'), verifyEnumQueryParamPipe(Index, 'index'))
    {
      fromTimestampMs,
      blockchainName,
      index,
    }: {
      blockchainName: BlockchainName
      fromTimestampMs?: string
      index: Index
    },
  ): PointsSummaryResultDto {
    return index === Index.CviIndex
      ? this.cviIndexHistoryService.getAllCviIndexesPerDay({
          fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
          blockchainName,
        })
      : this.cviIndexHistoryService.getAllEthvolPerDay({
          fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
          blockchainName,
        })
  }

  @Get('/candlestick/per-hour')
  @ApiOperation({ description: 'get cvi-indexes per hour in the last <N> days. each hour contain: min,max,start,end' })
  @ApiQuery({
    name: 'fromTimestampMs',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'blockchainName',
    required: true,
    enum: BlockchainName,
  })
  @ApiQuery({
    name: 'index',
    required: true,
    enum: Index,
  })
  @ApiResponse({ type: PointsSummaryResultDto })
  public getAllCviIndexesPerHourCandlestick(
    @Query(verifyEnumQueryParamPipe(BlockchainName, 'blockchainName'), verifyEnumQueryParamPipe(Index, 'index'))
    {
      fromTimestampMs,
      blockchainName,
      index,
    }: {
      blockchainName: BlockchainName
      fromTimestampMs?: string
      index: Index
    },
  ): PointsSummaryResultDto {
    return index === Index.CviIndex
      ? this.cviIndexHistoryService.getAllCviIndexesPerHour({
          fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
          blockchainName,
        })
      : this.cviIndexHistoryService.getAllEthvolPerHour({
          fromTimestampMs: fromTimestampMs === undefined ? undefined : Number(fromTimestampMs),
          blockchainName,
        })
  }
}
