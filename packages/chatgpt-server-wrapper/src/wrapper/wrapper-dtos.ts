import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class QueryDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  readonly query!: string

  @ApiProperty({
    type: String,
  })
  @IsString()
  readonly longText?: string
}

export class TextReducedInfoDto {
  @ApiProperty({
    type: Number,
  })
  readonly requestLength!: number

  @ApiProperty({
    type: Number,
  })
  readonly responseLength!: number

  @ApiProperty({
    type: Number,
  })
  readonly textReducedPercentage!: number
}

export class QueryResultDebugChunkDto {
  @ApiProperty({
    type: String,
  })
  readonly request!: string

  @ApiProperty({
    type: String,
  })
  readonly response!: string

  @ApiProperty({
    type: TextReducedInfoDto,
  })
  readonly textReducedInfoDto!: TextReducedInfoDto
}

export class QueryResultDebugDto {
  @ApiProperty({
    type: QueryResultDebugChunkDto,
    isArray: true,
  })
  readonly chunks!: QueryResultDebugChunkDto[]

  @ApiProperty({
    type: TextReducedInfoDto,
  })
  readonly textReducedInfoDto!: TextReducedInfoDto
}

export class QueryResultDto {
  @ApiProperty({
    type: String,
  })
  readonly result!: string

  @ApiProperty({
    type: QueryResultDebugDto,
  })
  readonly debug!: QueryResultDebugDto
}
