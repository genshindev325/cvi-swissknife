/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CategoriesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all categories
     * List all categories
     * @returns any List all categories
     * @throws ApiError
     */
    public getCoinsCategoriesList(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/categories/list',
        });
    }

    /**
     * List all categories with market data
     * List all categories with market data
     * @returns any List all categories with market data
     * @throws ApiError
     */
    public getCoinsCategories({
        order,
    }: {
        /**
         * valid values: <b>market_cap_desc (default), market_cap_asc, name_desc, name_asc, market_cap_change_24h_desc and market_cap_change_24h_asc</b>
         */
        order?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/coins/categories',
            query: {
                'order': order,
            },
        });
    }

}
