/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BurnEventDto } from './BurnEventDto';

export type VtBurnEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtBurnEventDto.type;
    /**
     * Burn event dto
     */
    args: BurnEventDto;
};

export namespace VtBurnEventDto {

    export enum type {
        VT_BURN_EVENT = 'VtBurnEvent',
    }


}

