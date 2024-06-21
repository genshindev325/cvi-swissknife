/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ExchangesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all exchanges (Active with trading volumes)
     * List all exchanges
     * @returns any List all exchanges
     * @throws ApiError
     */
    public getExchanges({
        perPage,
        page,
    }: {
        /**
         * Valid values: 1...250
         * Total results per page
         * Default value:: 100
         */
        perPage?: number,
        /**
         * page through results
         */
        page?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/exchanges',
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }

    /**
     * List all supported markets id and name (no pagination required)
     * Use this to obtain all the markets' id in order to make API calls
     * @returns any List all coins with id and name
     * @throws ApiError
     */
    public getExchangesList(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/exchanges/list',
        });
    }

    /**
     * Get exchange volume in BTC and top 100 tickers only
     * Get exchange volume in BTC and tickers<br><br> **IMPORTANT**:
     * Ticker object is limited to 100 items, to get more tickers, use `/exchanges/{id}/tickers`
     * Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker `is_anomaly` is true if ticker's price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     *
     * @returns any Get exchange volume in BTC and top 100 tickers
     * @throws ApiError
     */
    public getExchanges1({
        id,
    }: {
        /**
         * pass the exchange id (can be obtained from /exchanges/list) eg. binance
         */
        id: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/exchanges/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get exchange tickers (paginated, 100 tickers per page)
     * Get exchange tickers (paginated)<br><br> **IMPORTANT**:
     * Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker `is_anomaly` is true if ticker's price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     *
     * @returns any Get exchange tickers
     * @throws ApiError
     */
    public getExchangesTickers({
        id,
        coinIds,
        includeExchangeLogo,
        page,
        depth,
        order,
    }: {
        /**
         * pass the exchange id (can be obtained from /exchanges/list) eg. binance
         */
        id: string,
        /**
         * filter tickers by coin_ids (ref: v3/coins/list)
         */
        coinIds?: string,
        /**
         * flag to show exchange_logo
         */
        includeExchangeLogo?: string,
        /**
         * Page through results
         */
        page?: number,
        /**
         * flag to show 2% orderbook depth i.e., cost_to_move_up_usd and cost_to_move_down_usd
         */
        depth?: string,
        /**
         * valid values: <b>trust_score_desc (default), trust_score_asc and volume_desc</b>
         */
        order?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/exchanges/{id}/tickers',
            path: {
                'id': id,
            },
            query: {
                'coin_ids': coinIds,
                'include_exchange_logo': includeExchangeLogo,
                'page': page,
                'depth': depth,
                'order': order,
            },
        });
    }

    /**
     * Get volume_chart data for a given exchange
     * Get volume_chart data for a given exchange
     * @returns any Get exchange volume_chart data
     * @throws ApiError
     */
    public getExchangesVolumeChart({
        id,
        days,
    }: {
        /**
         * pass the exchange id (can be obtained from /exchanges/list) eg. binance
         */
        id: string,
        /**
         *  Data up to number of days ago (eg. 1,14,30)
         */
        days: number,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/exchanges/{id}/volume_chart',
            path: {
                'id': id,
            },
            query: {
                'days': days,
            },
        });
    }

}
