/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HardhatPodStartedDto } from '../models/HardhatPodStartedDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class K8SService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * get time of when hardhat pods started
     * @returns HardhatPodStartedDto
     * @throws ApiError
     */
    public k8SControllerGetWhenHardhatPodsStarted(): CancelablePromise<Array<HardhatPodStartedDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/k8s/hardhats-pods-started',
        });
    }

}
