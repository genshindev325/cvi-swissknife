/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TvFulfillWithdrawEventArgsDto } from './TvFulfillWithdrawEventArgsDto';

export type TvFulfillWithdrawEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: TvFulfillWithdrawEventDto.type;
    args: TvFulfillWithdrawEventArgsDto;
};

export namespace TvFulfillWithdrawEventDto {

    export enum type {
        TV_FULFILL_WITHDRAW_EVENT = 'TvFulfillWithdrawEvent',
    }


}

