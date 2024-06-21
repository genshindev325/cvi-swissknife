/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArmadilloSupportedTokenNameDto } from './ArmadilloSupportedTokenNameDto';
import type { WorstIlPointInTimeDto } from './WorstIlPointInTimeDto';

export type WorstIlOfTokenByCoinGekoDto = {
    id: string;
    token1Name: ArmadilloSupportedTokenNameDto;
    token2Name: ArmadilloSupportedTokenNameDto;
    coinGeckoToken1Id: string;
    coinGeckoToken2Id: string;
    start: WorstIlPointInTimeDto;
    end: WorstIlPointInTimeDto;
    worstIlPercentage: number;
};

