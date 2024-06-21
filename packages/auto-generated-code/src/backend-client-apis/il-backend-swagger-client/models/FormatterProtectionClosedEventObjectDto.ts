/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArmadilloSupportedTokenNameDto } from './ArmadilloSupportedTokenNameDto';

export type FormatterProtectionClosedEventObjectDto = {
    protectionStartTimestampUtc: string;
    protectionEndTimestampUtc: string;
    policyPeriodSeconds: number;
    policyPeriodDays: number;
    id: string;
    token1EndPriceUSD: number;
    token2EndPriceUSD: number;
    amountPaidUSD: number;
    owner: string;
    protectionStartTimestamp: number;
    protectionEndTimestamp: number;
    premiumCostUSD: number;
    tokenName1: ArmadilloSupportedTokenNameDto;
    tokenName2: ArmadilloSupportedTokenNameDto;
    collateral: number;
};

