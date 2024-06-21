import type {
  FormattedVtBurnEventObject,
  FormattedVtFulfillRequestEventObject,
  FormattedVtMintEventObject,
  FormattedVtSubmitRequestEventObject,
  Block,
  FormattedVtLiquidateEventObject,
  TvInfo,
  UpdateGeneralInfoOfEventAndAddresses,
  UpdateGeneralInfoOfEventOfAddress,
  GeneralInfoOfEvent,
  TradingCompetitionInfoAddress,
  FormattedVtBurnEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtMintEvent,
  FormattedVtSubmitRequestEvent,
} from '@coti-cvi/lw-sdk'
import { VtRequestType, TokenName } from '@coti-cvi/lw-sdk'
import type { GeneralInfoOfEventByAddress } from '@coti-cvi/lw-sdk'
import { ApiProperty } from '@nestjs/swagger'

export class TradingCompetitionInfoAddressDto implements TradingCompetitionInfoAddress {
  @ApiProperty({
    type: String,
  })
  address!: string

  @ApiProperty({
    type: Number,
  })
  pnlUsdc!: number

  @ApiProperty({
    type: Number,
  })
  maxTradeUsdc!: number

  @ApiProperty({
    type: Number,
  })
  trades!: number

  @ApiProperty({
    type: Number,
  })
  tvCvix1BalanceInUsdc!: number
}

// ============ theta vaults ==== //

export class TvInfoDto implements TvInfo {
  @ApiProperty({
    type: Number,
  })
  tvLockedUsdc!: number

  @ApiProperty({
    type: Number,
  })
  tvLockedPercentageOfTvCurrentBalance!: number

  @ApiProperty({
    type: Number,
  })
  dexCviBalanceUsdcByPlatformPrice!: number

  @ApiProperty({
    type: Number,
  })
  dexCviBalanceUsdc!: number

  @ApiProperty({
    type: Number,
  })
  currentThetaVaultUsdcBalance!: number

  @ApiProperty({
    type: Number,
  })
  platformUSDCLiquidity!: number

  @ApiProperty({
    type: Number,
  })
  platformVtBalanceUsdcByPlatformPrice!: number

  @ApiProperty({
    type: Number,
  })
  dexCviBalance!: number

  @ApiProperty({
    type: Number,
  })
  tvCollateralRatio!: number

  @ApiProperty({
    type: Number,
  })
  tvUtilizationPercentage!: number

  @ApiProperty({
    type: Number,
  })
  tvPlatformPnl!: number
}

export class GeneralInfoOfEventDto implements GeneralInfoOfEvent {
  @ApiProperty({
    type: Number,
  })
  totalSupplyOfCviUsdcLpTokens!: number

  @ApiProperty({
    type: Number,
  })
  vtCviUsdcLpTokenWorthInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  tvAprByLast30Days!: number

  @ApiProperty({
    type: Number,
  })
  readonly cviIndex!: number

  @ApiProperty({
    type: Number,
  })
  readonly vtCviPriceInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly vtCviPriceDexInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly tvCvix1PriceInUsdc!: number

  @ApiProperty({
    type: TvInfoDto,
  })
  readonly tvInfo!: TvInfoDto
}

export class GeneralInfoOfEventByAddressDto implements GeneralInfoOfEventByAddress {
  @ApiProperty({
    type: Number,
  })
  vtCviUsdcLpTokensInCvi!: number

  @ApiProperty({
    type: Number,
  })
  vtCviUsdcLpTokensInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  vtCviUsdcLpTokens!: number

  @ApiProperty({
    type: Number,
  })
  readonly usdcBalance!: number

  @ApiProperty({
    type: Number,
  })
  readonly vtCviBalance!: number

  @ApiProperty({
    type: Number,
  })
  readonly vtCvix1BalanceInUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly vtCvix1BalanceInUsdcInDex!: number

  @ApiProperty({
    type: Number,
  })
  readonly tvCvix1Balance!: number

  @ApiProperty({
    type: Number,
  })
  readonly tvCvix1BalanceInUsdc!: number
}

class SubmitRequestEventDto implements FormattedVtSubmitRequestEventObject {
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
    enum: TokenName,
  })
  tokenNameSubmitFeesAmount!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  tokenNameAmountPaid!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
  })
  cviTokenName!: TokenName

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
    type: String,
    enum: VtRequestType,
  })
  action!: keyof typeof VtRequestType

  @ApiProperty({
    type: Number,
  })
  submitFeesAmount!: number

  @ApiProperty({
    type: Number,
  })
  requestTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  targetTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  tokenAmountPaid!: number

  @ApiProperty({
    type: Boolean,
  })
  useKeepers!: boolean

  @ApiProperty({
    type: Number,
  })
  maxBuyingPremiumFeePercentage!: number
}

export class VtSubmitRequestEventDto implements FormattedVtSubmitRequestEvent {
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
    enum: ['VtSubmitEvent'],
  })
  readonly type!: 'VtSubmitEvent'

  @ApiProperty({
    description: 'Submit request event dto',
    type: SubmitRequestEventDto,
  })
  readonly args!: SubmitRequestEventDto
}

class MintEventDto implements FormattedVtMintEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: ['Mint'],
  })
  action!: 'Mint'

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
  positionedTokenNameAmount!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  mintedTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  openPositionFeeTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  buyingPremiumFeeTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
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
  usdcPaidAfterTimeDelayFee!: number

  @ApiProperty({
    type: Number,
  })
  positionedTokenAmount!: number

  @ApiProperty({
    type: Number,
  })
  mintedTokens!: number

  @ApiProperty({
    type: Number,
  })
  openPositionFee!: number

  @ApiProperty({
    type: Number,
  })
  buyingPremiumFee!: number
}

export class VtMintEventDto implements FormattedVtMintEvent {
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
    enum: ['VtMintEvent'],
  })
  readonly type!: 'VtMintEvent'

  @ApiProperty({
    description: 'Mint event dto',
    type: MintEventDto,
  })
  readonly args!: MintEventDto
}

class LiquidateEventDto implements FormattedVtLiquidateEventObject {
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
    enum: TokenName,
  })
  findersFeeAmountTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
  })
  cviTokenName!: TokenName

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  requestType!: number

  @ApiProperty({
    type: String,
    enum: VtRequestType,
  })
  action!: keyof typeof VtRequestType

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: String,
  })
  liquidator!: string

  @ApiProperty({
    type: Number,
  })
  findersFeeAmount!: number

  @ApiProperty({
    type: Boolean,
  })
  useKeepers!: boolean

  @ApiProperty({
    type: Number,
  })
  liquidateTimestamp!: number

  @ApiProperty({
    type: String,
  })
  liquidateTimestampString!: string
}

export class VtLiquidateRequestEventDto implements FormattedVtLiquidateRequestEvent {
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
    enum: ['VtLiquidateEvent'],
  })
  readonly type!: 'VtLiquidateEvent'

  @ApiProperty({
    description: 'Liquidate event dto',
    type: LiquidateEventDto,
  })
  readonly args!: LiquidateEventDto
}
class FulfillRequestEventDto implements FormattedVtFulfillRequestEventObject {
  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddressFromOneBlockBefore!: GeneralInfoOfEventByAddress

  @ApiProperty({
    type: String,
    enum: ['Mint', 'Burn'],
  })
  action!: 'Mint' | 'Burn'

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
  tokenNameFulfillFeesAmount!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
  })
  cviTokenName!: TokenName

  @ApiProperty({
    type: Number,
  })
  requestId!: number

  @ApiProperty({
    type: Number,
  })
  requestType!: number

  @ApiProperty({
    type: String,
  })
  account!: string

  @ApiProperty({
    type: Number,
  })
  fulfillFeesAmount!: number

  @ApiProperty({
    type: Boolean,
  })
  isAborted!: boolean

  @ApiProperty({
    type: Boolean,
  })
  useKeepers!: boolean

  @ApiProperty({
    type: Boolean,
  })
  keepersCalled!: boolean

  @ApiProperty({
    type: String,
  })
  fulfiller!: string

  @ApiProperty({
    type: Number,
  })
  fulfillTimestamp!: number
}

export class VtFulfillRequestEventDto implements FormattedVtFulfillRequestEvent {
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
    enum: ['VtFulfillEvent'],
  })
  readonly type!: 'VtFulfillEvent'

  @ApiProperty({
    description: 'Fulfill request event dto',
    type: FulfillRequestEventDto,
  })
  readonly args!: FulfillRequestEventDto
}

class BurnEventDto implements FormattedVtBurnEventObject {
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
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
  })
  burnedTokenscviTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  closingPremiumFeeTokenName!: TokenName

  @ApiProperty({
    type: String,
    enum: TokenName,
  })
  tokenNameClosePositionFee!: TokenName

  @ApiProperty({
    type: Number,
  })
  usdcAmountReceived!: number

  @ApiProperty({
    type: String,
    enum: TokenName,
    description: 'the event can be in the context of cvi or cvix2, etc... this property tells us the correct context',
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
  usdcReceivedBeforeFees!: number

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

export class VtBurnEventDto implements FormattedVtBurnEvent {
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
    enum: ['VtBurnEvent'],
  })
  readonly type!: 'VtBurnEvent'

  @ApiProperty({
    description: 'Burn event dto',
    type: BurnEventDto,
  })
  readonly args!: BurnEventDto
}

export class BlockDto implements Block {
  @ApiProperty({
    type: Number,
  })
  readonly number!: number

  @ApiProperty({
    type: Number,
  })
  readonly timestamp!: number
}

export class UpdateGeneralInfoOfEventOfAddressDto implements UpdateGeneralInfoOfEventOfAddress {
  @ApiProperty({
    type: String,
  })
  readonly address!: string

  @ApiProperty({
    type: GeneralInfoOfEventByAddressDto,
  })
  readonly generalInfoOfEventByAddress!: GeneralInfoOfEventByAddressDto
}

export class UpdateGeneralInfoOfEventAndAddressesDto implements UpdateGeneralInfoOfEventAndAddresses {
  @ApiProperty({
    type: BlockDto,
  })
  readonly block!: BlockDto

  @ApiProperty({
    type: GeneralInfoOfEventDto,
  })
  readonly generalInfoOfEvent!: GeneralInfoOfEventDto

  @ApiProperty({
    type: UpdateGeneralInfoOfEventOfAddressDto,
    isArray: true,
  })
  readonly updatedGeneralInfoOfEventByAddress!: UpdateGeneralInfoOfEventOfAddressDto[]
}
