/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProtectionDuePayoutPointsDto } from '../models/ProtectionDuePayoutPointsDto';
import type { ProtectionStatusDto } from '../models/ProtectionStatusDto';
import type { WalletProtectionsDto } from '../models/WalletProtectionsDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AccountsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get all protections exist in the smart contract
     * @returns WalletProtectionsDto
     * @throws ApiError
     */
    public adminApiControllerProtections(): CancelablePromise<Array<WalletProtectionsDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/protections',
        });
    }

    /**
     * For a protection-id, get all its due-payouts and il-percentage lifecycle per protection (inc. specifying number of points in lifecycle)
     * @returns ProtectionDuePayoutPointsDto
     * @throws ApiError
     */
    public adminApiControllerGetDuePayoutsForProtectionId({
        protectionId,
        pointsToCalculate,
    }: {
        protectionId: string,
        pointsToCalculate: number,
    }): CancelablePromise<ProtectionDuePayoutPointsDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/due-payouts-for-a-protection-id',
            query: {
                'protection-id': protectionId,
                'points-to-calculate': pointsToCalculate,
            },
        });
    }

    /**
     * get protection status
     * @returns ProtectionStatusDto
     * @throws ApiError
     */
    public adminApiControllerGetProtectionStatusById({
        protectionId,
        useCache,
        blockNumber,
    }: {
        protectionId: string,
        useCache: boolean,
        blockNumber?: number,
    }): CancelablePromise<ProtectionStatusDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/protection-status',
            query: {
                'protection-id': protectionId,
                'use-cache': useCache,
                'block-number': blockNumber,
            },
        });
    }

}
