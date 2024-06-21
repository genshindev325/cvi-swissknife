/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AssetPlatformsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all asset platforms (Blockchain networks)
     * List all asset platforms
     * @returns any List all asset_platforms
     * @throws ApiError
     */
    public getAssetPlatforms(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/asset_platforms',
        });
    }

}
