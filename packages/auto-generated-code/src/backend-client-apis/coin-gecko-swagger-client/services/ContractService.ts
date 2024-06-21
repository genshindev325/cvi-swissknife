/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContractService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get coin info from contract address
     * Get coin info from contract address
     * @returns any Get current data for a coin
     * @throws ApiError
     */
    public getCoinsContract({
        id,
        contractAddress,
    }: {
        /**
         * Asset platform (See asset_platforms endpoint for list of options)
         */
        id: string,
        /**
         * Token's contract address
         */
        contractAddress: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/contract/{contract_address}',
            path: {
                'id': id,
                'contract_address': contractAddress,
            },
        });
    }

    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto) from a contract address
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     *
     * @returns any Get historical market data include price, market cap, and 24h volume
     * @throws ApiError
     */
    public getCoinsContractMarketChart({
        id,
        contractAddress,
        vsCurrency,
        days,
    }: {
        /**
         * The id of the platform issuing tokens (See asset_platforms endpoint for list of options)
         */
        id: string,
        /**
         * Token's contract address
         */
        contractAddress: string,
        /**
         * The target currency of market data (usd, eur, jpy, etc.)
         */
        vsCurrency: string,
        /**
         * Data up to number of days ago (eg. 1,14,30,max)
         */
        days: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/contract/{contract_address}/market_chart/',
            path: {
                'id': id,
                'contract_address': contractAddress,
            },
            query: {
                'vs_currency': vsCurrency,
                'days': days,
            },
        });
    }

    /**
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto) from a contract address
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
     *
     * @returns any Get historical market data include price, market cap, and 24h volume
     * @throws ApiError
     */
    public getCoinsContractMarketChartRange({
        id,
        contractAddress,
        vsCurrency,
        from,
        to,
    }: {
        /**
         * The id of the platform issuing tokens (See asset_platforms endpoint for list of options)
         */
        id: string,
        /**
         * Token's contract address
         */
        contractAddress: string,
        /**
         * The target currency of market data (usd, eur, jpy, etc.)
         */
        vsCurrency: string,
        /**
         * From date in UNIX Timestamp (eg. 1392577232)
         */
        from: string,
        /**
         * To date in UNIX Timestamp (eg. 1422577232)
         */
        to: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/contract/{contract_address}/market_chart/range',
            path: {
                'id': id,
                'contract_address': contractAddress,
            },
            query: {
                'vs_currency': vsCurrency,
                'from': from,
                'to': to,
            },
        });
    }

}
