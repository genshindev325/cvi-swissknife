/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * is-alive
     * @returns any alive
     * @throws ApiError
     */
    public k8SLivenessCheckControllerSchedule(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public k8SReadinessCheckControllerTest(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/check',
        });
    }

    /**
     * k8s readiness check
     * @returns any readiness
     * @throws ApiError
     */
    public k8SReadinessCheckControllerIsReady(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/readiness',
        });
    }

}
