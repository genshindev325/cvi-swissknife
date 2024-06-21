/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type TvLiquidateEventArgsDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    action: TvLiquidateEventArgsDto.action;
    tokenAmountName: string;
    account: string;
    requestId: number;
    requestType: number;
    liquidator: string;
    tokenAmount: number;
};

export namespace TvLiquidateEventArgsDto {

    export enum action {
        DEPOSIT = 'Deposit',
        WITHDRAW = 'Withdraw',
    }


}

