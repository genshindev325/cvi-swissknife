/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TradingCompetitionInfoAddressDto } from '../models/TradingCompetitionInfoAddressDto';
import type { TvFulfillDepositEventDto } from '../models/TvFulfillDepositEventDto';
import type { TvFulfillWithdrawEventDto } from '../models/TvFulfillWithdrawEventDto';
import type { TvLiquidateEventDto } from '../models/TvLiquidateEventDto';
import type { TvSubmitEventDto } from '../models/TvSubmitEventDto';
import type { UpdateGeneralInfoOfEventAndAddressesDto } from '../models/UpdateGeneralInfoOfEventAndAddressesDto';
import type { VtBurnEventDto } from '../models/VtBurnEventDto';
import type { VtCviTransferEventDto } from '../models/VtCviTransferEventDto';
import type { VtFulfillRequestEventDto } from '../models/VtFulfillRequestEventDto';
import type { VtLiquidateRequestEventDto } from '../models/VtLiquidateRequestEventDto';
import type { VtMintEventDto } from '../models/VtMintEventDto';
import type { VtSubmitRequestEventDto } from '../models/VtSubmitRequestEventDto';
import type { VtUniswapSwapEventDto } from '../models/VtUniswapSwapEventDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AccountsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get all TV events
     * @returns any
     * @throws ApiError
     */
    public adminApiControllerGetAllTvEventsAsc({
        fromTimestamp,
        toTimestamp,
        fromBlockNumber,
        toBlockNumber,
        requestId,
    }: {
        fromTimestamp?: number,
        toTimestamp?: number,
        fromBlockNumber?: number,
        toBlockNumber?: number,
        requestId?: number,
    }): CancelablePromise<Array<(TvSubmitEventDto | TvFulfillDepositEventDto | TvFulfillWithdrawEventDto | TvLiquidateEventDto)>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/all-tv-events-asc',
            query: {
                'fromTimestamp': fromTimestamp,
                'toTimestamp': toTimestamp,
                'fromBlockNumber': fromBlockNumber,
                'toBlockNumber': toBlockNumber,
                'requestId': requestId,
            },
        });
    }

    /**
     * Get all VT events
     * @returns any
     * @throws ApiError
     */
    public adminApiControllerGetAllVtEventsAsc({
        fromTimestamp,
        toTimestamp,
        fromBlockNumber,
        toBlockNumber,
        requestId,
    }: {
        fromTimestamp?: number,
        toTimestamp?: number,
        fromBlockNumber?: number,
        toBlockNumber?: number,
        requestId?: number,
    }): CancelablePromise<Array<(VtSubmitRequestEventDto | VtLiquidateRequestEventDto | VtFulfillRequestEventDto | VtMintEventDto | VtBurnEventDto | VtCviTransferEventDto | VtUniswapSwapEventDto)>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/all-vt-events-asc',
            query: {
                'fromTimestamp': fromTimestamp,
                'toTimestamp': toTimestamp,
                'fromBlockNumber': fromBlockNumber,
                'toBlockNumber': toBlockNumber,
                'requestId': requestId,
            },
        });
    }

    /**
     * @returns UpdateGeneralInfoOfEventAndAddressesDto
     * @throws ApiError
     */
    public adminApiControllerGetUpdateGeneralInfoOfEventAndAddressesDto(): CancelablePromise<UpdateGeneralInfoOfEventAndAddressesDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/updated-general-info-Of-event-and-addresses',
        });
    }

    /**
     * Get trading competition info
     * @returns TradingCompetitionInfoAddressDto
     * @throws ApiError
     */
    public adminApiControllerGetVtTradingCompetition({
        fromTimestamp,
        debug,
    }: {
        fromTimestamp?: number,
        debug?: boolean,
    }): CancelablePromise<Array<TradingCompetitionInfoAddressDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/vt-trading-competition',
            query: {
                'from-timestamp': fromTimestamp,
                'debug': debug,
            },
        });
    }

    /**
     * return amount of events in the specified from-to range
     * @returns number
     * @throws ApiError
     */
    public adminApiControllerEventsInRange({
        resource,
        fromTimestamp,
        toTimestamp,
        fromBlockNumber,
        toBlockNumber,
    }: {
        resource: 'vt' | 'tv',
        fromTimestamp?: number,
        toTimestamp?: number,
        fromBlockNumber?: number,
        toBlockNumber?: number,
    }): CancelablePromise<number> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/events-in-range',
            query: {
                'resource': resource,
                'fromTimestamp': fromTimestamp,
                'toTimestamp': toTimestamp,
                'fromBlockNumber': fromBlockNumber,
                'toBlockNumber': toBlockNumber,
            },
        });
    }

}
