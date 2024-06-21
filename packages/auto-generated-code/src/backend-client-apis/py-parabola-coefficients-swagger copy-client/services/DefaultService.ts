/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalcResponseAllPairs } from '../models/CalcResponseAllPairs';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Metrics
     * Endpoint that serves Prometheus metrics.
     * @returns any Successful Response
     * @throws ApiError
     */
    public metricsMetricsGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/metrics',
        });
    }

    /**
     * Home
     * @returns any Successful Response
     * @throws ApiError
     */
    public homeGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }

    /**
     * Readiness
     * @returns any Successful Response
     * @throws ApiError
     */
    public readinessReadinessGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/readiness',
        });
    }

    /**
     * Calc Coefficients All Pairs
     * @returns CalcResponseAllPairs Successful Response
     * @throws ApiError
     */
    public calcCoefficientsAllPairsCalculateCoefficientsAllPairsGet(): CancelablePromise<CalcResponseAllPairs> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/calculate_coefficients_all_pairs',
        });
    }

}
