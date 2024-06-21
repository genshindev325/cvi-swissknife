/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormatterProtectionClosedEventObjectDto } from './FormatterProtectionClosedEventObjectDto';

export type FormattedProtectionClosedEventDto = {
    type: FormattedProtectionClosedEventDto.type;
    args: FormatterProtectionClosedEventObjectDto;
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

export namespace FormattedProtectionClosedEventDto {

    export enum type {
        PROTECTION_CLOSED_EVENT = 'ProtectionClosedEvent',
    }


}

