/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VtUniswapSwapEventArgsDto } from './VtUniswapSwapEventArgsDto';

export type VtUniswapSwapEventDto = {
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockTimestamp: number;
    type: VtUniswapSwapEventDto.type;
    /**
     * CVI Swap event dto
     */
    args: VtUniswapSwapEventArgsDto;
};

export namespace VtUniswapSwapEventDto {

    export enum type {
        VT_UNISWAP_SWAP_EVENT = 'VtUniswapSwapEvent',
    }


}

