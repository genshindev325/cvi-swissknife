/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CoinsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all supported coins id, name and symbol (no pagination required)
     * Use this to obtain all the coins' id in order to make API calls
     * @returns any List all coins with id, name, and symbol
     * @throws ApiError
     */
    public getCoinsList({
        includePlatform,
    }: {
        /**
         * flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).
         * valid values: true, false
         */
        includePlatform?: boolean,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/list',
            query: {
                'include_platform': includePlatform,
            },
        });
    }

    /**
     * List all supported coins price, market cap, volume, and market related data
     * Use this to obtain all the coins market data (price, market cap, volume)
     * @returns any List all coins with market data
     * @throws ApiError
     */
    public getCoinsMarkets({
        vsCurrency,
        ids,
        category,
        order = 'market_cap_desc',
        perPage = 100,
        page = 1,
        sparkline = false,
        priceChangePercentage,
    }: {
        /**
         * The target currency of market data (usd, eur, jpy, etc.)
         */
        vsCurrency: string,
        /**
         * The ids of the coin, comma separated crytocurrency symbols (base). refers to `/coins/list`.
         * <b>When left empty, returns numbers the coins observing the params `limit` and `start`</b>
         */
        ids?: string,
        /**
         * filter by coin category. Refer to /coin/categories/list
         */
        category?: string,
        /**
         * valid values: <b>market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc</b>
         * sort results by field.
         */
        order?: string,
        /**
         * valid values: 1..250
         * Total results per page
         */
        perPage?: number,
        /**
         * Page through results
         */
        page?: number,
        /**
         * Include sparkline 7 days data (eg. true, false)
         */
        sparkline?: boolean,
        /**
         * Include price change percentage in <b>1h, 24h, 7d, 14d, 30d, 200d, 1y</b> (eg. '`1h,24h,7d`' comma-separated, invalid values will be discarded)
         */
        priceChangePercentage?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/markets',
            query: {
                'vs_currency': vsCurrency,
                'ids': ids,
                'category': category,
                'order': order,
                'per_page': perPage,
                'page': page,
                'sparkline': sparkline,
                'price_change_percentage': priceChangePercentage,
            },
        });
    }

    /**
     * Get current data (name, price, market, ... including exchange tickers) for a coin
     * Get current data (name, price, market, ... including exchange tickers) for a coin.<br><br> **IMPORTANT**:
     * Ticker object is limited to 100 items, to get more tickers, use `/coins/{id}/tickers`
     * Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker `is_anomaly` is true if ticker's price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     *
     * @returns any Get current data for a coin
     * @throws ApiError
     */
    public getCoins({
        id,
        localization,
        tickers,
        marketData,
        communityData,
        developerData,
        sparkline,
    }: {
        /**
         * pass the coin id (can be obtained from /coins) eg. bitcoin
         */
        id: string,
        /**
         * Include all localized languages in response (true/false) <b>[default: true]</b>
         */
        localization?: string,
        /**
         * Include tickers data (true/false) <b>[default: true]</b>
         */
        tickers?: boolean,
        /**
         * Include market_data (true/false) <b>[default: true]</b>
         */
        marketData?: boolean,
        /**
         * Include community_data data (true/false) <b>[default: true]</b>
         */
        communityData?: boolean,
        /**
         * Include developer_data data (true/false) <b>[default: true]</b>
         */
        developerData?: boolean,
        /**
         * Include sparkline 7 days data (eg. true, false) <b>[default: false]</b>
         */
        sparkline?: boolean,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}',
            path: {
                'id': id,
            },
            query: {
                'localization': localization,
                'tickers': tickers,
                'market_data': marketData,
                'community_data': communityData,
                'developer_data': developerData,
                'sparkline': sparkline,
            },
        });
    }

    /**
     * Get coin tickers (paginated to 100 items)
     * Get coin tickers (paginated to 100 items)<br><br> **IMPORTANT**:
     * Ticker `is_stale` is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker `is_anomaly` is true if ticker's price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     *
     * @returns any Get coin tickers
     * @throws ApiError
     */
    public getCoinsTickers({
        id,
        exchangeIds,
        includeExchangeLogo,
        page,
        order,
        depth,
    }: {
        /**
         * pass the coin id (can be obtained from /coins/list) eg. bitcoin
         */
        id: string,
        /**
         * filter results by exchange_ids (ref: v3/exchanges/list)
         */
        exchangeIds?: string,
        /**
         * flag to show exchange_logo
         */
        includeExchangeLogo?: string,
        /**
         * Page through results
         */
        page?: number,
        /**
         * valid values: <b>trust_score_desc (default), trust_score_asc and volume_desc</b>
         */
        order?: string,
        /**
         * flag to show 2% orderbook depth. valid values: true, false
         */
        depth?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/tickers',
            path: {
                'id': id,
            },
            query: {
                'exchange_ids': exchangeIds,
                'include_exchange_logo': includeExchangeLogo,
                'page': page,
                'order': order,
                'depth': depth,
            },
        });
    }

    /**
     * Get historical data (name, price, market, stats) at a given date for a coin
     * Get historical data (name, price, market, stats) at a given date for a coin
     *
     * @returns any Get historical data at a given date for a coin
     * @throws ApiError
     */
    public getCoinsHistory({
        id,
        date,
        localization,
    }: {
        /**
         * pass the coin id (can be obtained from /coins) eg. bitcoin
         */
        id: string,
        /**
         * The date of data snapshot in dd-mm-yyyy eg. 30-12-2017
         */
        date: string,
        /**
         * Set to false to exclude localized languages in response
         */
        localization?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/history',
            path: {
                'id': id,
            },
            query: {
                'date': date,
                'localization': localization,
            },
        });
    }

    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     * <b><ul><li>Data granularity is automatic (cannot be adjusted)</li><li>1 day from current time = 5 minute interval data</li><li>1 - 90 days from current time = hourly data</li><li>above 90 days from current time = daily data (00:00 UTC)</li></ul> </b>
     * @returns any Get historical market data include price, market cap, and 24h volume
     * @throws ApiError
     */
    public getCoinsMarketChart({
        id,
        vsCurrency,
        days,
        interval,
    }: {
        /**
         * pass the coin id (can be obtained from /coins) eg. bitcoin
         */
        id: string,
        /**
         * The target currency of market data (usd, eur, jpy, etc.)
         */
        vsCurrency: string,
        /**
         * Data up to number of days ago (eg. 1,14,30,max)
         */
        days: string,
        /**
         * Data interval. Possible value: daily
         */
        interval?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/{id}/market_chart',
            path: {
                'id': id,
            },
            query: {
                'vs_currency': vsCurrency,
                'days': days,
                'interval': interval,
            },
        });
    }

    /**
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
     * <b><ul><li>Data granularity is automatic (cannot be adjusted)</li><li>1 day from current time = 5 minute interval data</li><li>1 - 90 days from current time = hourly data</li><li>above 90 days from current time = daily data (00:00 UTC)</li></ul> </b>
     * @returns any Get historical market data include price, market cap, and 24h volume
     * @throws ApiError
     */
    public getCoinsMarketChartRange({
        id,
        vsCurrency,
        from,
        to,
    }: {
        /**
         * pass the coin id (can be obtained from /coins) eg. bitcoin
         */
        id: string,
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
            url: '/coins/{id}/market_chart/range',
            path: {
                'id': id,
            },
            query: {
                'vs_currency': vsCurrency,
                'from': from,
                'to': to,
            },
        });
    }

    /**
     * Get coin's OHLC
     * Candle's body:
     *
     * 1 - 2 days: 30 minutes
     * 3 - 30 days: 4 hours
     * 31 days and beyond: 4 days
     * @returns number successful operation
     *
     * [
         * 1594382400000 (time),
         * 1.1 (open),
         * 2.2 (high),
         * 3.3 (low),
         * 4.4 (close)
         * ]
         * @throws ApiError
         */
        public getCoinsOhlc({
            id,
            vsCurrency,
            days,
        }: {
            /**
             * pass the coin id (can be obtained from /coins/list) eg. bitcoin
             */
            id: string,
            /**
             * The target currency of market data (usd, eur, jpy, etc.)
             */
            vsCurrency: string,
            /**
             *  Data up to number of days ago (1/7/14/30/90/180/365/max)
             */
            days: string,
        }): CancelablePromise<Array<number>> {
            return this.httpRequest.request({
                method: 'GET',
                url: '/coins/{id}/ohlc',
                path: {
                    'id': id,
                },
                query: {
                    'vs_currency': vsCurrency,
                    'days': days,
                },
            });
        }

    }
