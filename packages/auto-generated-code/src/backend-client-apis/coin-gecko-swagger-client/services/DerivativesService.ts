/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DerivativesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all derivative tickers
     * List all derivative tickers
     * @returns any List all derivative tickers
     * @throws ApiError
     */
    public getDerivatives({
        includeTickers,
    }: {
        /**
         * ['all', 'unexpired'] - expired to show unexpired tickers, all to list all tickers, defaults to unexpired
         */
        includeTickers?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/derivatives',
            query: {
                'include_tickers': includeTickers,
            },
        });
    }

    /**
     * List all derivative exchanges
     * List all derivative exchanges
     * @returns any List all derivative exchanges
     * @throws ApiError
     */
    public getDerivativesExchanges({
        order,
        perPage,
        page,
    }: {
        /**
         * order results using following params name_asc，name_desc，open_interest_btc_asc，open_interest_btc_desc，trade_volume_24h_btc_asc，trade_volume_24h_btc_desc
         */
        order?: string,
        /**
         * Total results per page
         */
        perPage?: number,
        /**
         * Page through results
         */
        page?: number,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/derivatives/exchanges',
            query: {
                'order': order,
                'per_page': perPage,
                'page': page,
            },
        });
    }

    /**
     * show derivative exchange data
     * show derivative exchange data
     * @returns any show derivative exchange data
     * @throws ApiError
     */
    public getDerivativesExchanges1({
        id,
        includeTickers,
    }: {
        /**
         * pass the exchange id (can be obtained from derivatives/exchanges/list) eg. bitmex
         */
        id: string,
        /**
         * ['all', 'unexpired'] - expired to show unexpired tickers, all to list all tickers, leave blank to omit tickers data in response
         */
        includeTickers?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/derivatives/exchanges/{id}',
            path: {
                'id': id,
            },
            query: {
                'include_tickers': includeTickers,
            },
        });
    }

    /**
     * List all derivative exchanges name and identifier
     * List all derivative exchanges name and identifier
     * @returns any List all derivative exchanges name and identifier
     * @throws ApiError
     */
    public getDerivativesExchangesList(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/derivatives/exchanges/list',
        });
    }

}
