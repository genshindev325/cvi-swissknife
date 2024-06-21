/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsedEmbedDiscountForAddressDto } from './UsedEmbedDiscountForAddressDto';

export type ProtectionInfoMetadataDto = {
    lpTokensWorthAtBuyTimeUsdc: number;
    maxAmountToBePaidUsdc: number;
    feeUsdc: number | null;
    feePercentage: number | null;
    embedDiscount: UsedEmbedDiscountForAddressDto | null;
};

