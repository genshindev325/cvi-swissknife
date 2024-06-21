/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DiscountService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * is address eligible for a discount in armadillo
     * @returns boolean
     * @throws ApiError
     */
    public armadilloEligibleDiscountControllerIsEligible({
        address,
    }: {
        address: string,
    }): CancelablePromise<boolean> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/discount/first-campaign/is-eligible',
            query: {
                'address': address,
            },
        });
    }

}
