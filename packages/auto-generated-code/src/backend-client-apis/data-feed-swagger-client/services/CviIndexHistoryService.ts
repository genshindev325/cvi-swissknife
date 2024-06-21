/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PointsSummaryResultDto } from '../models/PointsSummaryResultDto';
import type { SummaryCviIndexResultBasicDto } from '../models/SummaryCviIndexResultBasicDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CviIndexHistoryService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * get cvi-indexes per day from the last 3 years. each day contain is a single point
     * @returns SummaryCviIndexResultBasicDto
     * @throws ApiError
     */
    public cviIndexesHistoryControllerGetAllCviIndexesPerDayBasic({
        index,
        blockchainName,
        fromTimestampMs,
    }: {
        index: 'cvi-index' | 'ethvol',
        blockchainName: 'ethereum' | 'polygon' | 'arbitrum',
        fromTimestampMs?: number,
    }): CancelablePromise<SummaryCviIndexResultBasicDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/history/basic/per-day',
            query: {
                'index': index,
                'blockchainName': blockchainName,
                'fromTimestampMs': fromTimestampMs,
            },
        });
    }

    /**
     * get cvi-indexes per hour in the last <N> days. each hour contain is a single point
     * @returns SummaryCviIndexResultBasicDto
     * @throws ApiError
     */
    public cviIndexesHistoryControllerGetAllCviIndexesPerHourBasic({
        index,
        blockchainName,
        fromTimestampMs,
    }: {
        index: 'cvi-index' | 'ethvol',
        blockchainName: 'ethereum' | 'polygon' | 'arbitrum',
        fromTimestampMs?: number,
    }): CancelablePromise<SummaryCviIndexResultBasicDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/history/basic/per-hour',
            query: {
                'index': index,
                'blockchainName': blockchainName,
                'fromTimestampMs': fromTimestampMs,
            },
        });
    }

    /**
     * get cvi-indexes per day from the last 3 years. each day contain: min,max,start,end
     * @returns PointsSummaryResultDto
     * @throws ApiError
     */
    public cviIndexesHistoryControllerGetAllCviIndexesPerDayCandlestick({
        index,
        blockchainName,
        fromTimestampMs,
    }: {
        index: 'cvi-index' | 'ethvol',
        blockchainName: 'ethereum' | 'polygon' | 'arbitrum',
        fromTimestampMs?: number,
    }): CancelablePromise<PointsSummaryResultDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/history/candlestick/per-day',
            query: {
                'index': index,
                'blockchainName': blockchainName,
                'fromTimestampMs': fromTimestampMs,
            },
        });
    }

    /**
     * get cvi-indexes per hour in the last <N> days. each hour contain: min,max,start,end
     * @returns PointsSummaryResultDto
     * @throws ApiError
     */
    public cviIndexesHistoryControllerGetAllCviIndexesPerHourCandlestick({
        index,
        blockchainName,
        fromTimestampMs,
    }: {
        index: 'cvi-index' | 'ethvol',
        blockchainName: 'ethereum' | 'polygon' | 'arbitrum',
        fromTimestampMs?: number,
    }): CancelablePromise<PointsSummaryResultDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/history/candlestick/per-hour',
            query: {
                'index': index,
                'blockchainName': blockchainName,
                'fromTimestampMs': fromTimestampMs,
            },
        });
    }

}
