/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtectionStatusProfitDto } from './ProtectionStatusProfitDto';

export type ProtectionStatusDto = {
    blockNumber: number;
    blockTimestamp: number;
    blockTimestampUtc: string;
    withoutMinPayout: ProtectionStatusProfitDto;
    lpRevenueUsdc: number;
    lpProfitPercentage: number;
    userRevenueUsdc: number;
    userProfitPercentage: number;
    payoutOrDuePayoutUsdc: number;
    ilPercentage: number;
};

