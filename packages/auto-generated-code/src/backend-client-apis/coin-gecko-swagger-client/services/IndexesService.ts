/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class IndexesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all market indexes
     * List all market indexes
     * @returns any List all market indexes
     * @throws ApiError
     */
    public getIndexes({
        perPage,
        page,
    }: {
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
            url: '/indexes',
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }

    /**
     * get market index by market id and index id
     * get market index by market id and index id
     * @returns any get market index by market id and index id
     * @throws ApiError
     */
    public getIndexes1({
        marketId,
        id,
    }: {
        /**
         * pass the market id (can be obtained from /exchanges/list)
         */
        marketId: string,
        /**
         * pass the index id (can be obtained from /indexes/list)
         */
        id: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/indexes/{market_id}/{id}',
            path: {
                'market_id': marketId,
                'id': id,
            },
        });
    }

    /**
     * list market indexes id and name
     * list market indexes id and name
     * @returns any list market indexes id and name
     * @throws ApiError
     */
    public getIndexesList(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/indexes/list',
        });
    }

}
