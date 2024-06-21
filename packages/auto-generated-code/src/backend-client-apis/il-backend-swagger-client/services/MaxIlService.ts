/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorstIlOfTokenByCoinGekoDto } from '../models/WorstIlOfTokenByCoinGekoDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MaxIlService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * For all supported il-product token pairs, return the worst IL seen per each in the last configured time
     * @returns WorstIlOfTokenByCoinGekoDto
     * @throws ApiError
     */
    public calcMaxIlControllerGetWorstIlPerPair(): CancelablePromise<Array<WorstIlOfTokenByCoinGekoDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/max-il/all-pairs',
        });
    }

}
