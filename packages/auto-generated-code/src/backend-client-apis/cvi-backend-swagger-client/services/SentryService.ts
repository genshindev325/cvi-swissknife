/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SentryService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns any
     * @throws ApiError
     */
    public sentryControllerRoot(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/sentry/errors',
        });
    }

}
