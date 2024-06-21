/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type VtUniswapSwapEventArgsDto = {
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddressDto;
    tokenNameAmountIn: VtUniswapSwapEventArgsDto.tokenNameAmountIn;
    tokenAmountIn: number;
    tokenNameAmountOut: VtUniswapSwapEventArgsDto.tokenNameAmountOut;
    tokenAmountOut: number;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddressDto;
    account: string;
};

export namespace VtUniswapSwapEventArgsDto {

    export enum tokenNameAmountIn {
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

    export enum tokenNameAmountOut {
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

