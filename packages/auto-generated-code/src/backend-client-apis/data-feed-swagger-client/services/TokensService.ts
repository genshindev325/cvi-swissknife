/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PointDto } from '../models/PointDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TokensService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * get all prices daily from coingecko of a token
     * @returns PointDto
     * @throws ApiError
     */
    public tokensControllerTokenDailyPriceHistory({
        token,
    }: {
        token: 'oldPolygonCvi' | 'WBTC' | 'ETH',
    }): CancelablePromise<Array<PointDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tokens/daily-price-history',
            query: {
                'token': token,
            },
        });
    }

}
