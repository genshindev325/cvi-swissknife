/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GlobalService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get cryptocurrency global data
     * Get cryptocurrency global data
     *
     * @returns any Get global data - total_volume, total_market_cap, ongoing icos etc
     * @throws ApiError
     */
    public getGlobal(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/global',
        });
    }

    /**
     * Get cryptocurrency global decentralized finance(defi) data
     * Get Top 100 Cryptocurrency Global Eecentralized Finance(defi) data
     *
     * @returns void
     * @throws ApiError
     */
    public getGlobalDecentralizedFinanceDefi(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/global/decentralized_finance_defi',
        });
    }

}
