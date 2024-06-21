/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QueryDto } from '../models/QueryDto';
import type { QueryResult } from '../models/QueryResult';
import type { SummarizeTextDto } from '../models/SummarizeTextDto';
import type { SummarizeTextResult } from '../models/SummarizeTextResult';
import type { SummarizeURLDto } from '../models/SummarizeURLDto';

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
     * Chatgptsummarizetext
     * @returns QueryResult Successful Response
     * @throws ApiError
     */
    public chatgptSummarizeTextChatgptQueryPost({
        requestBody,
    }: {
        requestBody: QueryDto,
    }): CancelablePromise<QueryResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/chatgpt-query',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Chatgptsummarizetext
     * @returns SummarizeTextResult Successful Response
     * @throws ApiError
     */
    public chatgptSummarizeTextChatgptSummarizeTextPost({
        requestBody,
    }: {
        requestBody: SummarizeTextDto,
    }): CancelablePromise<SummarizeTextResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/chatgpt-summarize-text',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Chatgptsummarizeurl
     * @returns SummarizeTextResult Successful Response
     * @throws ApiError
     */
    public chatgptSummarizeUrlChatgptSummarizeUrlPost({
        requestBody,
    }: {
        requestBody: SummarizeURLDto,
    }): CancelablePromise<SummarizeTextResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/chatgpt-summarize-url',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
