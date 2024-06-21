import { ApiProperty } from '@nestjs/swagger'
import type {
  DuePayoutPoint,
  IArmadilloSupportedTokenName,
  ProtectionDuePayoutPoints,
  ProtectionDuePayoutsInfo,
  ProtectionInfoMetadata,
  ProtectionStatusProfit,
  UsedEmbedDiscountForAddress,
  ProtectionStatus,
} from '@coti-cvi/lw-sdk'
import { ArmadilloSupportedTokenName, EmbedDiscountName } from '@coti-cvi/lw-sdk'
import type {
  WalletProtections,
  ProtectionIdWithInfo,
  ProtectionInfo,
  FormattedProtectionBoughtEvent,
  FormattedProtectionClosedEvent,
  FormattedProtectionClosedEventObject,
  FormattedProtectionBoughtEventObject,
} from '@coti-cvi/lw-sdk'

class ArmadilloSupportedTokenNameDto implements IArmadilloSupportedTokenName {
  @ApiProperty({ type: String, enum: Object.values(ArmadilloSupportedTokenName) })
  ArmadilloSupportedTokenName!: ArmadilloSupportedTokenName
}

class FormatterProtectionClosedEventObjectDto implements FormattedProtectionClosedEventObject {
  @ApiProperty({
    type: String,
  })
  readonly protectionStartTimestampUtc!: string

  @ApiProperty({
    type: String,
  })
  readonly protectionEndTimestampUtc!: string

  @ApiProperty({
    type: Number,
  })
  readonly policyPeriodSeconds!: number

  @ApiProperty({
    type: Number,
  })
  readonly policyPeriodDays!: number

  @ApiProperty({
    type: String,
  })
  readonly id!: string

  @ApiProperty({
    type: Number,
  })
  readonly token1EndPriceUSD!: number

  @ApiProperty({
    type: Number,
  })
  readonly token2EndPriceUSD!: number

  @ApiProperty({
    type: Number,
  })
  readonly amountPaidUSD!: number

  @ApiProperty({
    type: String,
  })
  readonly owner!: string

  @ApiProperty({
    type: Number,
  })
  readonly protectionStartTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  readonly protectionEndTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  readonly premiumCostUSD!: number

  @ApiProperty({
    type: ArmadilloSupportedTokenNameDto,
  })
  readonly tokenName1!: ArmadilloSupportedTokenNameDto

  @ApiProperty({
    type: ArmadilloSupportedTokenNameDto,
  })
  readonly tokenName2!: ArmadilloSupportedTokenNameDto

  @ApiProperty({
    type: Number,
  })
  readonly collateral!: number
}

class FormatterProtectionBoughtEventObjectDto implements FormattedProtectionBoughtEventObject {
  @ApiProperty({
    type: String,
  })
  readonly protectionStartTimestampUtc!: string

  @ApiProperty({
    type: String,
  })
  readonly protectionEndTimestampUtc!: string

  @ApiProperty({
    type: Number,
  })
  readonly policyPeriodSeconds!: number

  @ApiProperty({
    type: Number,
  })
  readonly policyPeriodDays!: number

  @ApiProperty({
    type: String,
  })
  readonly id!: string

  @ApiProperty({
    type: String,
  })
  readonly owner!: string

  @ApiProperty({
    type: Number,
  })
  readonly protectionStartTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  readonly protectionEndTimestamp!: number

  @ApiProperty({
    type: Number,
  })
  readonly premiumCostUSD!: number

  @ApiProperty({
    type: ArmadilloSupportedTokenNameDto,
  })
  readonly tokenName1!: ArmadilloSupportedTokenNameDto

  @ApiProperty({
    type: ArmadilloSupportedTokenNameDto,
  })
  readonly tokenName2!: ArmadilloSupportedTokenNameDto

  @ApiProperty({
    type: Number,
  })
  readonly token1EntryPriceUSD!: number

  @ApiProperty({
    type: Number,
  })
  readonly token2EntryPriceUSD!: number

  @ApiProperty({
    type: Number,
  })
  readonly collateral!: number
}

class FormattedProtectionClosedEventDto implements FormattedProtectionClosedEvent {
  @ApiProperty({
    type: String,
    enum: ['ProtectionClosedEvent'],
  })
  readonly type!: 'ProtectionClosedEvent'

  @ApiProperty({
    type: FormatterProtectionClosedEventObjectDto,
  })
  readonly args!: FormatterProtectionClosedEventObjectDto

  @ApiProperty({
    type: Number,
  })
  readonly blockNumber!: number

  @ApiProperty({
    type: Number,
  })
  readonly transactionIndex!: number

  @ApiProperty({
    type: String,
  })
  readonly transactionHash!: string

  @ApiProperty({
    type: Number,
  })
  readonly logIndex!: number
}

class FormattedProtectionBoughtEventDto implements FormattedProtectionBoughtEvent {
  @ApiProperty({
    type: String,
    enum: ['ProtectionBoughtEvent'],
  })
  readonly type!: 'ProtectionBoughtEvent'

  @ApiProperty({
    type: FormatterProtectionBoughtEventObjectDto,
  })
  readonly args!: FormatterProtectionBoughtEventObjectDto

  @ApiProperty({
    type: Number,
  })
  readonly blockNumber!: number

  @ApiProperty({
    type: Number,
  })
  readonly transactionIndex!: number

  @ApiProperty({
    type: String,
  })
  readonly transactionHash!: string

  @ApiProperty({
    type: Number,
  })
  readonly logIndex!: number
}

class ProtectionStatusProfitDto implements ProtectionStatusProfit {
  @ApiProperty({
    type: Number,
  })
  readonly payoutOrDuePayoutUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly lpRevenueUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly lpProfitPercentage!: number

  @ApiProperty({
    type: Number,
  })
  readonly userRevenueUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly userProfitPercentage!: number
}

export class ProtectionStatusDto implements ProtectionStatus {
  @ApiProperty({
    type: Number,
  })
  readonly blockNumber!: number

  @ApiProperty({
    type: Number,
  })
  readonly blockTimestamp!: number

  @ApiProperty({
    type: String,
  })
  readonly blockTimestampUtc!: string

  @ApiProperty({
    type: ProtectionStatusProfitDto,
  })
  readonly withoutMinPayout!: ProtectionStatusProfitDto

  @ApiProperty({
    type: Number,
  })
  readonly lpRevenueUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly lpProfitPercentage!: number

  @ApiProperty({
    type: Number,
  })
  readonly userRevenueUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly userProfitPercentage!: number

  @ApiProperty({
    type: Number,
  })
  readonly payoutOrDuePayoutUsdc!: number

  @ApiProperty({
    type: Number,
  })
  readonly ilPercentage!: number
}

class UsedEmbedDiscountForAddressDto implements UsedEmbedDiscountForAddress {
  @ApiProperty({
    type: Number,
  })
  discountTypeId!: number

  @ApiProperty({
    type: String,
    enum: EmbedDiscountName,
  })
  discountTypeName!: EmbedDiscountName

  @ApiProperty({
    type: Number,
  })
  discountUsdc!: number
}

class ProtectionInfoMetadataDto implements ProtectionInfoMetadata {
  @ApiProperty({
    type: Number,
  })
  lpTokensWorthAtBuyTimeUsdc!: number

  @ApiProperty({
    type: Number,
  })
  maxAmountToBePaidUsdc!: number

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  feeUsdc?: number

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  feePercentage?: number

  @ApiProperty({
    type: UsedEmbedDiscountForAddressDto,
    nullable: true,
  })
  embedDiscount?: UsedEmbedDiscountForAddressDto
}

class ProtectionInfoDto implements ProtectionInfo {
  @ApiProperty({
    type: ProtectionInfoMetadataDto,
  })
  readonly metadata!: ProtectionInfoMetadataDto

  @ApiProperty({
    type: ProtectionStatusDto,
  })
  status!: ProtectionStatusDto

  @ApiProperty({
    type: FormattedProtectionBoughtEventDto,
  })
  boughtEvent!: FormattedProtectionBoughtEventDto

  @ApiProperty({
    type: FormattedProtectionClosedEventDto,
    nullable: true,
  })
  expiredEvent?: FormattedProtectionClosedEventDto
}

class ProtectionIdWithInfoDto implements ProtectionIdWithInfo {
  @ApiProperty({
    type: String,
  })
  readonly protectionId!: string

  @ApiProperty({
    type: ProtectionInfoDto,
  })
  readonly protectionInfo!: ProtectionInfoDto
}

export class WalletProtectionsDto implements WalletProtections {
  @ApiProperty({
    type: String,
  })
  readonly wallet!: string

  @ApiProperty({
    type: Boolean,
  })
  readonly isInternalWallet!: boolean

  @ApiProperty({
    type: ProtectionIdWithInfoDto,
    isArray: true,
  })
  readonly protections!: ProtectionIdWithInfoDto[]
}

export class DuePayoutPointDto implements DuePayoutPoint {
  @ApiProperty({
    type: Number,
    description: 'epoch timestamp in seconds',
  })
  readonly pointIndex!: number

  @ApiProperty({
    type: ProtectionStatusDto,
  })
  readonly protectionStatus!: ProtectionStatusDto
}

export class ProtectionDuePayoutsInfoDto implements ProtectionDuePayoutsInfo {
  @ApiProperty({
    type: ProtectionInfoDto,
  })
  readonly protectionInfo!: ProtectionInfoDto

  @ApiProperty({
    type: DuePayoutPointDto,
    isArray: true,
  })
  readonly points!: DuePayoutPointDto[]
}

export class ProtectionDuePayoutPointsDto implements ProtectionDuePayoutPoints {
  @ApiProperty({
    type: String,
  })
  readonly protectionId!: string

  @ApiProperty({
    type: ProtectionDuePayoutsInfoDto,
  })
  readonly protectionDuePayoutsInfo!: ProtectionDuePayoutsInfoDto
}
