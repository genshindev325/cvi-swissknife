/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TvSubmitEventArgsDto } from './TvSubmitEventArgsDto';

export type TvSubmitEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: TvSubmitEventDto.type;
    args: TvSubmitEventArgsDto;
};

export namespace TvSubmitEventDto {

    export enum type {
        TV_SUBMIT_EVENT = 'TvSubmitEvent',
    }


}

