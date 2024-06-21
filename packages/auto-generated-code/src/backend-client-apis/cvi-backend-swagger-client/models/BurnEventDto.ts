/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type BurnEventDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    action: BurnEventDto.action;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    burnedTokenscviTokenName: BurnEventDto.burnedTokenscviTokenName;
    closingPremiumFeeTokenName: BurnEventDto.closingPremiumFeeTokenName;
    tokenNameClosePositionFee: BurnEventDto.tokenNameClosePositionFee;
    usdcAmountReceived: number;
    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    cviTokenName: BurnEventDto.cviTokenName;
    requestId: number;
    account: string;
    usdcReceivedBeforeFees: number;
    burnedTokensCvi: number;
    closePositionFee: number;
    closingPremiumFee: number;
};

export namespace BurnEventDto {

    export enum action {
        BURN = 'Burn',
    }

    /**
     * the event can be in the context of cvi or cvix2, etc... this property tells us the correct context
     */
    export enum burnedTokenscviTokenName {
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

    export enum closingPremiumFeeTokenName {
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

    export enum tokenNameClosePositionFee {
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

