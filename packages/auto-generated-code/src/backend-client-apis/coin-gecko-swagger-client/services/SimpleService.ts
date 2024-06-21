/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SimpleService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get the current price of any cryptocurrencies in any other supported currencies that you need.
     * @returns any price(s) of cryptocurrency
     * @throws ApiError
     */
    public getSimplePrice({
        ids,
        vsCurrencies,
        includeMarketCap,
        include24HrVol,
        include24HrChange,
        includeLastUpdatedAt,
    }: {
        /**
         * id of coins, comma-separated if querying more than 1 coin
         * *refers to <b>`coins/list`</b>
         */
        ids: string,
        /**
         * vs_currency of coins, comma-separated if querying more than 1 vs_currency
         * *refers to <b>`simple/supported_vs_currencies`</b>
         */
        vsCurrencies: string,
        /**
         * <b>true/false</b> to include market_cap, <b>default: false</b>
         */
        includeMarketCap?: string,
        /**
         * <b>true/false</b> to include 24hr_vol, <b>default: false</b>
         */
        include24HrVol?: string,
        /**
         * <b>true/false</b> to include 24hr_change, <b>default: false</b>
         */
        include24HrChange?: string,
        /**
         * <b>true/false</b> to include last_updated_at of price, <b>default: false</b>
         */
        includeLastUpdatedAt?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/simple/price',
            query: {
                'ids': ids,
                'vs_currencies': vsCurrencies,
                'include_market_cap': includeMarketCap,
                'include_24hr_vol': include24HrVol,
                'include_24hr_change': include24HrChange,
                'include_last_updated_at': includeLastUpdatedAt,
            },
        });
    }

    /**
     * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
     * @returns any price(s) of cryptocurrency
     * @throws ApiError
     */
    public getSimpleTokenPrice({
        id,
        contractAddresses,
        vsCurrencies,
        includeMarketCap,
        include24HrVol,
        include24HrChange,
        includeLastUpdatedAt,
    }: {
        /**
         * The id of the platform issuing tokens (See asset_platforms endpoint for list of options)
         */
        id: string,
        /**
         * The contract address of tokens, comma separated
         */
        contractAddresses: string,
        /**
         * vs_currency of coins, comma-separated if querying more than 1 vs_currency
         * *refers to <b>`simple/supported_vs_currencies`</b>
         */
        vsCurrencies: string,
        /**
         * <b>true/false</b> to include market_cap, <b>default: false</b>
         */
        includeMarketCap?: string,
        /**
         * <b>true/false</b> to include 24hr_vol, <b>default: false</b>
         */
        include24HrVol?: string,
        /**
         * <b>true/false</b> to include 24hr_change, <b>default: false</b>
         */
        include24HrChange?: string,
        /**
         * <b>true/false</b> to include last_updated_at of price, <b>default: false</b>
         */
        includeLastUpdatedAt?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/simple/token_price/{id}',
            path: {
                'id': id,
            },
            query: {
                'contract_addresses': contractAddresses,
                'vs_currencies': vsCurrencies,
                'include_market_cap': includeMarketCap,
                'include_24hr_vol': include24HrVol,
                'include_24hr_change': include24HrChange,
                'include_last_updated_at': includeLastUpdatedAt,
            },
        });
    }

    /**
     * Get list of supported_vs_currencies.
     * @returns any list of supported_vs_currencies
     * @throws ApiError
     */
    public getSimpleSupportedVsCurrencies(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/simple/supported_vs_currencies',
        });
    }

}
