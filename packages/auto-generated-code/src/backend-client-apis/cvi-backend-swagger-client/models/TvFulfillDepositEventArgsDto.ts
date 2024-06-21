/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type TvFulfillDepositEventArgsDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    action: TvFulfillDepositEventArgsDto.action;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    tokenName: string;
    account: string;
    requestId: number;
    submitRequestTokenAmountUsdc: number;
    platformLiquidityAmountUsdc: number;
    dexVolTokenUSDCAmount: number;
    dexVolTokenAmount: number;
    dexUSDCAmount: number;
    mintedThetaTokens: number;
};

export namespace TvFulfillDepositEventArgsDto {

    export enum action {
        DEPOSIT = 'Deposit',
    }


}

