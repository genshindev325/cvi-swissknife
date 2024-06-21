import { TvRequestType } from '@coti-cvi/lw-sdk'
import type {
  FormattedTvSubmitEventObject,
  TVEventsByRequestIdEvents,
  FormattedTvFulfillDepositEventObject,
  FormattedTvFulfillWithdrawEventObject,
  FormattedTvLiquidateEventObject,
  FormattedTvFulfillDepositEvent,
  FormattedTvFulfillWithdrawEvent,
  FormattedTvLiquidateEvent,
  FormattedTvSubmitEvent,
  GeneralInfoOfEventByAddress,
} from '@coti-cvi/lw-sdk'
import { ApiProperty } from '@nestjs/swagger'
import { GeneralInfoOfEventByAddressDto, GeneralInfoOfEventDto } from './dtos'

export class TvSubmitEventArgsDto implements FormattedTvSubmitEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

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
  tokenAmountInUsdcTokenName!: string

  @ApiProperty({
    type: String,
  })
  tokenAmountName!: string

  @ApiProperty({
    type: Number,
  })
  tokenAmount!: number

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  requestType!: number

  @ApiProperty({
    type: Number,
  })
  tokenAmountInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  targetTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  currentThetaVaultUsdcBalance!: number

  @ApiProperty({
    type: Number,
  })
  totalSupply!: number

  @ApiProperty({
    type: String,
    enum: TvRequestType,
  })
  action!: 'Deposit' | 'Withdraw'
}

export class TvFulfillDepositEventArgsDto implements FormattedTvFulfillDepositEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: ['Deposit'],
  })
  action!: 'Deposit'

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
  tokenName!: string

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  submitRequestTokenAmountUsdc!: number

  @ApiProperty({
    type: Number,
  })
  platformLiquidityAmountUsdc!: number

  @ApiProperty({
    type: Number,
  })
  dexVolTokenUSDCAmount!: number

  @ApiProperty({
    type: Number,
  })
  dexVolTokenAmount!: number

  @ApiProperty({
    type: Number,
  })
  dexUSDCAmount!: number

  @ApiProperty({
    type: Number,
  })
  mintedThetaTokens!: number
}

export class TvFulfillWithdrawEventArgsDto implements FormattedTvFulfillWithdrawEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: ['Withdraw'],
  })
  action!: 'Withdraw'

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
  tokenName!: string

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  usdcAmountReceived!: number

  @ApiProperty({
    type: Number,
  })
  platformLiquidityAmountUsdc!: number

  @ApiProperty({
    type: Number,
  })
  dexVolTokenAmount!: number

  @ApiProperty({
    type: Number,
  })
  dexUSDCviTokenAmount!: number

  @ApiProperty({
    type: Number,
  })
  dexUSDCAmount!: number

  @ApiProperty({
    type: Number,
  })
  burnedThetaTokens!: number
}

export class TvLiquidateEventArgsDto implements FormattedTvLiquidateEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

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
    enum: TvRequestType,
  })
  action!: 'Deposit' | 'Withdraw'

  @ApiProperty({
    type: String,
  })
  tokenAmountName!: string

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  requestType!: TvRequestType

  @ApiProperty({
    type: String,
  })
  liquidator!: string

  @ApiProperty({
    type: Number,
  })
  tokenAmount!: number
}

export class TvSubmitEventDto implements FormattedTvSubmitEvent {
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
    enum: ['TvSubmitEvent'],
  })
  type!: 'TvSubmitEvent'

  @ApiProperty({
    type: TvSubmitEventArgsDto,
  })
  args!: TvSubmitEventArgsDto
}

export class TvFulfillDepositEventDto implements FormattedTvFulfillDepositEvent {
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
    enum: ['TvFulfillDepositEvent'],
  })
  type!: 'TvFulfillDepositEvent'

  @ApiProperty({
    type: TvFulfillDepositEventArgsDto,
  })
  args!: TvFulfillDepositEventArgsDto
}

export class TvFulfillWithdrawEventDto implements FormattedTvFulfillWithdrawEvent {
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
    enum: ['TvFulfillWithdrawEvent'],
  })
  type!: 'TvFulfillWithdrawEvent'

  @ApiProperty({
    type: TvFulfillWithdrawEventArgsDto,
  })
  args!: TvFulfillWithdrawEventArgsDto
}

export class TvLiquidateEventDto implements FormattedTvLiquidateEvent {
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
    enum: ['TvLiquidateEvent'],
  })
  type!: 'TvLiquidateEvent'

  @ApiProperty({
    type: TvLiquidateEventArgsDto,
  })
  args!: TvLiquidateEventArgsDto
}

export class TVEventsByRequestIdEventsDto implements TVEventsByRequestIdEvents {
  @ApiProperty({
    type: TvSubmitEventDto,
    nullable: true,
  })
  TvSubmitEvent?: TvSubmitEventDto

  @ApiProperty({
    type: TvFulfillDepositEventDto,
    nullable: true,
  })
  TvFulfillDepositEvent?: TvFulfillDepositEventDto

  @ApiProperty({
    type: TvFulfillWithdrawEventDto,
    nullable: true,
  })
  TvFulfillWithdrawEvent?: TvFulfillWithdrawEventDto

  @ApiProperty({
    type: TvLiquidateEventDto,
    nullable: true,
  })
  TvLiquidateEvent?: TvLiquidateEventDto
}
