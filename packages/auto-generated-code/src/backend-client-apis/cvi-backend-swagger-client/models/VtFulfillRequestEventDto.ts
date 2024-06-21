/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FulfillRequestEventDto } from './FulfillRequestEventDto';

export type VtFulfillRequestEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtFulfillRequestEventDto.type;
    /**
     * Fulfill request event dto
     */
    args: FulfillRequestEventDto;
};

export namespace VtFulfillRequestEventDto {

    export enum type {
        VT_FULFILL_EVENT = 'VtFulfillEvent',
    }


}

