/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type TvSubmitEventArgsDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    tokenAmountInUsdcTokenName: string;
    tokenAmountName: string;
    tokenAmount: number;
    account: string;
    requestId: number;
    requestType: number;
    tokenAmountInUsdc: number;
    targetTimestamp: number;
    currentThetaVaultUsdcBalance: number;
    totalSupply: number;
    action: TvSubmitEventArgsDto.action;
};

export namespace TvSubmitEventArgsDto {

    export enum action {
        DEPOSIT = 'Deposit',
        WITHDRAW = 'Withdraw',
    }


}

