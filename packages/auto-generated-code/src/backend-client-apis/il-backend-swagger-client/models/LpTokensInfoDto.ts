/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArmadilloSupportedTokenNameDto } from './ArmadilloSupportedTokenNameDto';

export type LpTokensInfoDto = {
    id: string;
    symbol0: ArmadilloSupportedTokenNameDto;
    symbol1: ArmadilloSupportedTokenNameDto;
    balanceUSD0: number;
    balanceUSD1: number;
    balanceUnits0: number;
    balanceUnits1: number;
    balanceUSDTotal: number;
    BlockchainName: LpTokensInfoDto.BlockchainName;
    SupportedZapperProtocolNames: LpTokensInfoDto.SupportedZapperProtocolNames;
};

export namespace LpTokensInfoDto {

    export enum BlockchainName {
        ETHEREUM = 'ethereum',
        POLYGON = 'polygon',
        ARBITRUM = 'arbitrum',
    }

    export enum SupportedZapperProtocolNames {
        UNISWAP_V2 = 'uniswap-v2',
        DODO = 'dodo',
        SUSHISWAP = 'sushiswap',
        QUICKSWAP = 'quickswap',
    }


}

