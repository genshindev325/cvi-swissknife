/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubmitRequestEventDto } from './SubmitRequestEventDto';

export type VtSubmitRequestEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtSubmitRequestEventDto.type;
    /**
     * Submit request event dto
     */
    args: SubmitRequestEventDto;
};

export namespace VtSubmitRequestEventDto {

    export enum type {
        VT_SUBMIT_EVENT = 'VtSubmitEvent',
    }


}

