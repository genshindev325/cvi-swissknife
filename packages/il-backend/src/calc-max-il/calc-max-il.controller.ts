import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiProperty, ApiResponse } from '@nestjs/swagger'
import type { IArmadilloSupportedTokenName, WorstIlOfTokenByCoinGeko, WorstIlPointInTime } from '@coti-cvi/lw-sdk'
import { ArmadilloSupportedTokenName } from '@coti-cvi/lw-sdk'
import { CalcMaxIlService } from './calc-max-il.service'

class ArmadilloSupportedTokenNameDto implements IArmadilloSupportedTokenName {
  @ApiProperty({ type: String, enum: Object.values(ArmadilloSupportedTokenName) })
  ArmadilloSupportedTokenName!: ArmadilloSupportedTokenName
}

class WorstIlPointInTimeDto implements WorstIlPointInTime {
  @ApiProperty({ type: String })
  dateUtc!: string

  @ApiProperty({ type: Number })
  dateMs!: number

  @ApiProperty({ type: Number })
  token1PriceUsd!: number

  @ApiProperty({ type: Number })
  token2PriceUsd!: number
}
class WorstIlOfTokenByCoinGekoDto implements WorstIlOfTokenByCoinGeko {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: ArmadilloSupportedTokenNameDto })
  token1Name!: ArmadilloSupportedTokenNameDto

  @ApiProperty({ type: ArmadilloSupportedTokenNameDto })
  token2Name!: ArmadilloSupportedTokenNameDto

  @ApiProperty({ type: String })
  coinGeckoToken1Id!: string

  @ApiProperty({ type: String })
  coinGeckoToken2Id!: string

  @ApiProperty({ type: WorstIlPointInTimeDto })
  start!: WorstIlPointInTimeDto

  @ApiProperty({ type: WorstIlPointInTimeDto })
  end!: WorstIlPointInTimeDto

  @ApiProperty({ type: Number })
  worstIlPercentage!: number
}

@ApiTags(`Max IL`)
@Controller('/max-il')
export class CalcMaxIlController {
  constructor(@Inject(CalcMaxIlService) private readonly calcMaxIlService: CalcMaxIlService) {}

  @Get('/all-pairs')
  @ApiOperation({
    description: `For all supported il-product token pairs, return the worst IL seen per each in the last configured time`,
  })
  @ApiResponse({ type: WorstIlOfTokenByCoinGekoDto, isArray: true })
  public getWorstIlPerPair(): WorstIlOfTokenByCoinGekoDto[] {
    return this.calcMaxIlService.getWorstIlPerPair()
  }
}
