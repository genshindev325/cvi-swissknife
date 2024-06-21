import type {
  VTEventsByRequestIdEvents,
  FormattedVtCviTransferEventObject,
  FormattedVtUniswapSwapEventObject,
  FormattedVtBurnEventObject,
  FormattedVtCviTransferEvent,
  FormattedVtUniswapSwapEvent,
  GeneralInfoOfEventByAddress,
} from '@coti-cvi/lw-sdk'
import { TokenName } from '@coti-cvi/lw-sdk'
import { ApiProperty } from '@nestjs/swagger'
import {
  VtSubmitRequestEventDto,
  VtMintEventDto,
  VtLiquidateRequestEventDto,
  VtFulfillRequestEventDto,
  VtBurnEventDto,
  GeneralInfoOfEventDto,
  GeneralInfoOfEventByAddressDto,
} from './dtos'

class VTEventsByRequestIdEventsDto implements VTEventsByRequestIdEvents {
  @ApiProperty({
    type: VtSubmitRequestEventDto,
    isArray: true,
  })
  VtSubmitEvent!: VtSubmitRequestEventDto[]

  @ApiProperty({
    type: VtMintEventDto,
    isArray: true,
  })
  VtMintEvent!: VtMintEventDto[]

  @ApiProperty({
    type: VtLiquidateRequestEventDto,
    isArray: true,
  })
  VtLiquidateEvent!: VtLiquidateRequestEventDto[]

  @ApiProperty({
    type: VtFulfillRequestEventDto,
    isArray: true,
  })
  VtFulfillEvent!: VtFulfillRequestEventDto[]

  @ApiProperty({
    type: VtBurnEventDto,
    isArray: true,
  })
  VtBurnEvent!: VtBurnEventDto[]
}

class VtCviTransferEventArgsDto implements FormattedVtCviTransferEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEvent!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEventOneBlockBefore!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventBySender!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByReceiver!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventBySenderOneBlockBefore!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByReceiverOneBlockBefore!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  cviTokenName!: TokenName

  @ApiProperty({
    type: String,
  })
  fromAccount!: string

  @ApiProperty({
    type: String,
  })
  toAccount!: string

  @ApiProperty({
    type: Number,
  })
  cviAmount!: number
}

export class VtCviTransferEventDto implements FormattedVtCviTransferEvent {
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
    enum: ['VtCviTransferEvent'],
  })
  readonly type!: 'VtCviTransferEvent'

  @ApiProperty({
    description: 'CVI Transfer event dto',
    type: VtCviTransferEventArgsDto,
  })
  readonly args!: VtCviTransferEventArgsDto
}

class VtUniswapSwapEventArgsDto implements FormattedVtUniswapSwapEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  readonly tokenNameAmountIn!: TokenName

  @ApiProperty({
    type: Number,
  })
  readonly tokenAmountIn!: number

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  readonly tokenNameAmountOut!: TokenName

  @ApiProperty({
    type: Number,
  })
  readonly tokenAmountOut!: number

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEvent!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEventOneBlockBefore!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddress!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: String,
  })
  account!: string
}

export class VtUniswapSwapEventDto implements FormattedVtUniswapSwapEvent {
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
    enum: ['VtUniswapSwapEvent'],
  })
  readonly type!: 'VtUniswapSwapEvent'

  @ApiProperty({
    description: 'CVI Swap event dto',
    type: VtUniswapSwapEventArgsDto,
  })
  readonly args!: VtUniswapSwapEventArgsDto
}

export class BurnEventDto implements FormattedVtBurnEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: ['Burn'],
  })
  action!: 'Burn'

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEvent!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEventOneBlockBefore!: GeneralInfoOfEventDto

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddress!: GeneralInfoOfEventByAddressDto

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  tokenNameAmountReceivedBeforeFees!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  burnedTokenscviTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  closingPremiumFeeTokenName!: TokenName

  @ApiProperty({
    type: Number,
  })
  usdcReceivedBeforeFees!: number

  @ApiProperty({
    type: Number,
  })
  usdcAmountReceived!: number

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  tokenNameClosePositionFee!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  cviTokenName!: TokenName

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  burnedTokensCvi!: number

  @ApiProperty({
    type: Number,
  })
  closePositionFee!: number

  @ApiProperty({
    type: Number,
  })
  closingPremiumFee!: number
}
