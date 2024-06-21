/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QueryDto } from '../models/QueryDto';
import type { QueryResultDto } from '../models/QueryResultDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ChatgptQueryService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns QueryResultDto
     * @throws ApiError
     */
    public wrapperControllerQueryChatGpt({
        requestBody,
    }: {
        requestBody: QueryDto,
    }): CancelablePromise<QueryResultDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/chatgpt-query',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
