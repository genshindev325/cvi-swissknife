/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type TvFulfillWithdrawEventArgsDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    action: TvFulfillWithdrawEventArgsDto.action;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    tokenName: string;
    account: string;
    requestId: number;
    usdcAmountReceived: number;
    platformLiquidityAmountUsdc: number;
    dexVolTokenAmount: number;
    dexUSDCviTokenAmount: number;
    dexUSDCAmount: number;
    burnedThetaTokens: number;
};

export namespace TvFulfillWithdrawEventArgsDto {

    export enum action {
        WITHDRAW = 'Withdraw',
    }


}

