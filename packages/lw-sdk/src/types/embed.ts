export enum EmbedDiscountName {
  GOLD = 'Gold',
  DIAMON = 'Diamond',
}

export type DiscountTypeInfo = {
  typeId: number
  supply: number
  name: EmbedDiscountName
}

export type DiscountTypeInfoState = DiscountTypeInfo & {
  eligibleWalletsCount: number
  usedWalletsCount: number
}

export type EmbedDiscountForAddress = {
  discountTypeId: number
  discountTypeName: EmbedDiscountName
  isUsed: boolean
}
export type UsedEmbedDiscountForAddress = {
  discountTypeId: number
  discountTypeName: EmbedDiscountName
  discountUsdc: number
}
