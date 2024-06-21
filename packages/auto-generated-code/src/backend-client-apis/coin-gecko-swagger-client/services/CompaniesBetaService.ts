/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CompaniesBetaService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get public companies data
     * Get public companies bitcoin or ethereum holdings (Ordered by total holdings descending)
     * @returns any Get public companies bitcoin or ethereum holdings
     * @throws ApiError
     */
    public getCompaniesPublicTreasury({
        coinId,
    }: {
        /**
         * bitcoin or ethereum
         */
        coinId?: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/companies/public_treasury/{coin_id}',
            path: {
                'coin_id': coinId,
            },
        });
    }

}
