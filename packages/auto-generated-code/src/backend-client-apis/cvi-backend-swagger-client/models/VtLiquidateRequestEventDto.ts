/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LiquidateEventDto } from './LiquidateEventDto';

export type VtLiquidateRequestEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtLiquidateRequestEventDto.type;
    /**
     * Liquidate event dto
     */
    args: LiquidateEventDto;
};

export namespace VtLiquidateRequestEventDto {

    export enum type {
        VT_LIQUIDATE_EVENT = 'VtLiquidateEvent',
    }


}

