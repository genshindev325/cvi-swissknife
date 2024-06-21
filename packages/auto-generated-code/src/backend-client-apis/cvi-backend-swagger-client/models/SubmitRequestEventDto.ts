/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type SubmitRequestEventDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    tokenNameSubmitFeesAmount: SubmitRequestEventDto.tokenNameSubmitFeesAmount;
    tokenNameAmountPaid: SubmitRequestEventDto.tokenNameAmountPaid;
    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    cviTokenName: SubmitRequestEventDto.cviTokenName;
    account: string;
    requestId: number;
    requestType: number;
    action: SubmitRequestEventDto.action;
    submitFeesAmount: number;
    requestTimestamp: number;
    targetTimestamp: number;
    tokenAmountPaid: number;
    useKeepers: boolean;
    maxBuyingPremiumFeePercentage: number;
};

export namespace SubmitRequestEventDto {

    export enum tokenNameSubmitFeesAmount {
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

    export enum tokenNameAmountPaid {
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

    export enum action {
        MINT = 'Mint',
        BURN = 'Burn',
    }


}

