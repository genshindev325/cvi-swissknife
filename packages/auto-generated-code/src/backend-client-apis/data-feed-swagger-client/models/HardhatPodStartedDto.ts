/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HardhatPodStartedDto = {
    BlockchainName: HardhatPodStartedDto.BlockchainName;
    dateUtc: string;
};

export namespace HardhatPodStartedDto {

    export enum BlockchainName {
        ETHEREUM = 'ethereum',
        POLYGON = 'polygon',
        ARBITRUM = 'arbitrum',
    }


}

