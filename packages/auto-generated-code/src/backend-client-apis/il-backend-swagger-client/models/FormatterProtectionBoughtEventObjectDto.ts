/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArmadilloSupportedTokenNameDto } from './ArmadilloSupportedTokenNameDto';

export type FormatterProtectionBoughtEventObjectDto = {
    protectionStartTimestampUtc: string;
    protectionEndTimestampUtc: string;
    policyPeriodSeconds: number;
    policyPeriodDays: number;
    id: string;
    owner: string;
    protectionStartTimestamp: number;
    protectionEndTimestamp: number;
    premiumCostUSD: number;
    tokenName1: ArmadilloSupportedTokenNameDto;
    tokenName2: ArmadilloSupportedTokenNameDto;
    token1EntryPriceUSD: number;
    token2EntryPriceUSD: number;
    collateral: number;
};

