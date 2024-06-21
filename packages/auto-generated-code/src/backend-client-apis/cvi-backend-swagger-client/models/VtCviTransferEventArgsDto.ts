/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralInfoOfEventByAddressDto } from './GeneralInfoOfEventByAddressDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';

export type VtCviTransferEventArgsDto = {
    generalInfoOfEvent: GeneralInfoOfEventDto;
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEventDto;
    generalInfoOfEventBySender: GeneralInfoOfEventByAddressDto;
    generalInfoOfEventByReceiver: GeneralInfoOfEventByAddressDto;
    generalInfoOfEventBySenderOneBlockBefore: GeneralInfoOfEventByAddressDto;
    generalInfoOfEventByReceiverOneBlockBefore: GeneralInfoOfEventByAddressDto;
    cviTokenName: VtCviTransferEventArgsDto.cviTokenName;
    fromAccount: string;
    toAccount: string;
    cviAmount: number;
};

export namespace VtCviTransferEventArgsDto {

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

