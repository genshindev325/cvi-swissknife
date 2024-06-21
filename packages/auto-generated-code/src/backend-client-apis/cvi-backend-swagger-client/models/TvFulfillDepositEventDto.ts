/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TvFulfillDepositEventArgsDto } from './TvFulfillDepositEventArgsDto';

export type TvFulfillDepositEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: TvFulfillDepositEventDto.type;
    args: TvFulfillDepositEventArgsDto;
};

export namespace TvFulfillDepositEventDto {

    export enum type {
        TV_FULFILL_DEPOSIT_EVENT = 'TvFulfillDepositEvent',
    }


}

