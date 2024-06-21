/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CviOracleLatestDto } from '../models/CviOracleLatestDto';
import type { GetCviOracleHistoryDataQueryDto } from '../models/GetCviOracleHistoryDataQueryDto';
import type { MinimalCviOracleEventDto } from '../models/MinimalCviOracleEventDto';
import type { MinimalCviOracleEventOhlcDto } from '../models/MinimalCviOracleEventOhlcDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CviOracleService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * cvi index **events** of all time,the response is the formatted events monitored directly from the smart contract.
     * @returns MinimalCviOracleEventDto
     * @throws ApiError
     */
    public cviOracleApiControllerGetAllCviIndexes({
        requestBody,
    }: {
        requestBody: GetCviOracleHistoryDataQueryDto,
    }): CancelablePromise<MinimalCviOracleEventDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cvi-oracle/all-cvi-indexes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * cvi index **events** of all time,the response is the formatted events monitored directly from the smart contract. by ohlc
     * @returns MinimalCviOracleEventOhlcDto
     * @throws ApiError
     */
    public cviOracleApiControllerGetAllCviIndexesOhlc({
        requestBody,
    }: {
        requestBody: GetCviOracleHistoryDataQueryDto,
    }): CancelablePromise<MinimalCviOracleEventOhlcDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cvi-oracle/all-cvi-indexes-ohlc',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get the latest cvi index
     * @returns CviOracleLatestDto
     * @throws ApiError
     */
    public cviOracleApiControllerGetLatestCviIndex(): CancelablePromise<CviOracleLatestDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cvi-oracle/latest-cvi-index',
        });
    }

}
