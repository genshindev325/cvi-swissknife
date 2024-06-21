/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type FulfillRequestEventDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    action: FulfillRequestEventDto.action;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    tokenNameFulfillFeesAmount: FulfillRequestEventDto.tokenNameFulfillFeesAmount;
    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    cviTokenName: FulfillRequestEventDto.cviTokenName;
    requestId: number;
    requestType: number;
    account: string;
    fulfillFeesAmount: number;
    isAborted: boolean;
    useKeepers: boolean;
    keepersCalled: boolean;
    fulfiller: string;
    fulfillTimestamp: number;
};

export namespace FulfillRequestEventDto {

    export enum action {
        MINT = 'Mint',
        BURN = 'Burn',
    }

    export enum tokenNameFulfillFeesAmount {
        USDC = 'USDC',
        USDT = 'USDT',
        ETH = 'ETH',
        WETH = 'WETH',
        DAI = 'DAI',
        LINK = 'LINK',
        WBTC = 'WBTC',
        MATIC = 'MATIC',
        WMATIC = 'WMATIC',
        UNI = 'UNI',
        SAND = 'SAND',
        DOGE = 'DOGE',
        SHIB = 'SHIB',
        BAT = 'BAT',
        GOVI = 'GOVI',
        ADA = 'ADA',
        BNB = 'BNB',
        CVI = 'CVI',
        CVOL = 'CVOL',
        T_CVI_LP = 'T-CVI-LP',
        T_CVOL_LP = 'T-CVOL-LP',
    }

    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    export enum cviTokenName {
        USDC = 'USDC',
        USDT = 'USDT',
        ETH = 'ETH',
        WETH = 'WETH',
        DAI = 'DAI',
        LINK = 'LINK',
        WBTC = 'WBTC',
        MATIC = 'MATIC',
        WMATIC = 'WMATIC',
        UNI = 'UNI',
        SAND = 'SAND',
        DOGE = 'DOGE',
        SHIB = 'SHIB',
        BAT = 'BAT',
        GOVI = 'GOVI',
        ADA = 'ADA',
        BNB = 'BNB',
        CVI = 'CVI',
        CVOL = 'CVOL',
        T_CVI_LP = 'T-CVI-LP',
        T_CVOL_LP = 'T-CVOL-LP',
    }


}

