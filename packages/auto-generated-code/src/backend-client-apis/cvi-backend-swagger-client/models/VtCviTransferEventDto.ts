/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VtCviTransferEventArgsDto } from './VtCviTransferEventArgsDto';

export type VtCviTransferEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtCviTransferEventDto.type;
    /**
     * CVI Transfer event dto
     */
    args: VtCviTransferEventArgsDto;
};

export namespace VtCviTransferEventDto {

    export enum type {
        VT_CVI_TRANSFER_EVENT = 'VtCviTransferEvent',
    }


}

