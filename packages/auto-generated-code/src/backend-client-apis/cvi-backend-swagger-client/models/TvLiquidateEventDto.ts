/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TvLiquidateEventArgsDto } from './TvLiquidateEventArgsDto';

export type TvLiquidateEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: TvLiquidateEventDto.type;
    args: TvLiquidateEventArgsDto;
};

export namespace TvLiquidateEventDto {

    export enum type {
        TV_LIQUIDATE_EVENT = 'TvLiquidateEvent',
    }


}

