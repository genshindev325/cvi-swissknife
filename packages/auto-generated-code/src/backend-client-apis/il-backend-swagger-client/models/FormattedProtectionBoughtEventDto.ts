/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormatterProtectionBoughtEventObjectDto } from './FormatterProtectionBoughtEventObjectDto';

export type FormattedProtectionBoughtEventDto = {
    type: FormattedProtectionBoughtEventDto.type;
    args: FormatterProtectionBoughtEventObjectDto;
    event: string | null;
    eventSignature: string | null;
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;
    removed: boolean;
    address: string;
    data: string;
    topics: Array<string>;
    transactionHash: string;
    logIndex: number;
};

export namespace FormattedProtectionBoughtEventDto {

    export enum type {
        PROTECTION_BOUGHT_EVENT = 'ProtectionBoughtEvent',
    }


}

