/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TweetService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Tweet now
     * @returns any Tweet now
     * @throws ApiError
     */
    public tweetBotControllerTweetNow(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tweet/tweet-now',
        });
    }

    /**
     * Take screenshot of CVI.finance and return image
     * @returns any Take screenshot of CVI.finance and return image
     * @throws ApiError
     */
    public tweetBotControllerIsReady({
        width,
        height,
        deviceScaleFactor,
    }: {
        /**
         * Screenshot width. Optional
         */
        width?: number,
        /**
         * Screenshot height. Optional
         */
        height?: number,
        /**
         * Screenshot deviceScaleFactor. Optional
         */
        deviceScaleFactor?: number,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tweet/take-screenshot',
            query: {
                'width': width,
                'height': height,
                'deviceScaleFactor': deviceScaleFactor,
            },
        });
    }

}
