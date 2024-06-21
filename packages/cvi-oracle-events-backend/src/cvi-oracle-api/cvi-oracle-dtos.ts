import type {
  FormattedCviOracleAnswerUpdateObject,
  CviOracleIndexValueArgsType,
  MinimalCviOracleEvent,
  GetCviOracleHistoryDataQuery,
  MinimalCviOracleOhlcEvent,
  FormattedCviOracleAnswerUpdateEvent,
  CviHistoryGroupBy,
} from '@coti-cvi/lw-sdk'
import { ApiProperty } from '@nestjs/swagger'
import { cviHistoryGroupBy } from '@coti-cvi/lw-sdk'
import { IsOptional, IsNumber, IsString } from 'class-validator'

class CviOracleEventArgsDto implements FormattedCviOracleAnswerUpdateObject {
  @ApiProperty({
    type: Number,
  })
  cviIndex!: number

  @ApiProperty({
    type: Number,
  })
  cviRoundId!: number
}

export class CviOracleEventDto implements FormattedCviOracleAnswerUpdateEvent {
  @ApiProperty({
    type: Number,
  })
  readonly blockNumber!: number

  @ApiProperty({
    type: Number,
  })
  readonly logIndex!: number

  @ApiProperty({
    type: String,
  })
  readonly transactionHash!: string

  @ApiProperty({
    type: Number,
  })
  readonly transactionIndex!: number

  @ApiProperty({
    type: Number,
  })
  readonly blockTimestamp!: number

  @ApiProperty({
    type: String,
    enum: ['AnswerUpdateEvent'],
  })
  readonly type!: 'AnswerUpdateEvent'

  @ApiProperty({
    description: 'Cvi oracle event dto',
    type: CviOracleEventArgsDto,
  })
  readonly args!: CviOracleEventArgsDto
}

export class CviOracleLatestDto {
  @ApiProperty({
    type: Number,
  })
  readonly cviIndex!: Number

  @ApiProperty({
    type: Number,
  })
  readonly timestamp!: number
}

export class CviOracleIndexValueArgsTypeDto implements CviOracleIndexValueArgsType {
  @ApiProperty({
    type: Number,
  })
  timestamp!: number

  @ApiProperty({
    type: Number,
  })
  value!: number
}

export class MinimalCviOracleEventDto implements MinimalCviOracleEvent {
  @ApiProperty({
    type: CviOracleIndexValueArgsTypeDto,
    isArray: true,
  })
  events!: CviOracleIndexValueArgsTypeDto[]

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  lastBlockTimestamp?: number
}

export class MinimalCviOracleEventOhlcDto implements MinimalCviOracleOhlcEvent {
  @ApiProperty({
    isArray: true,
    items: {
      type: 'array',
      items: {
        type: 'number',
        minItems: 6,
        maxItems: 6,
      },
    },
  })
  events!: [timestamp: number, open: number, high: number, low: number, close: number, volumeUsdc: number][]

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  lastBlockTimestamp?: number
}

export class GetCviOracleHistoryDataQueryDto implements GetCviOracleHistoryDataQuery {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly fromBlockTimestamp?: number

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly toBlockTimestamp?: number

  @ApiProperty({
    type: String,
    enum: cviHistoryGroupBy,
  })
  @IsString()
  readonly groupBy!: CviHistoryGroupBy
}
