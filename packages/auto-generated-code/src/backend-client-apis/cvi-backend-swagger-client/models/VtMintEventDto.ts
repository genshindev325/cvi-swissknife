/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MintEventDto } from './MintEventDto';

export type VtMintEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtMintEventDto.type;
    /**
     * Mint event dto
     */
    args: MintEventDto;
};

export namespace VtMintEventDto {

    export enum type {
        VT_MINT_EVENT = 'VtMintEvent',
    }


}

