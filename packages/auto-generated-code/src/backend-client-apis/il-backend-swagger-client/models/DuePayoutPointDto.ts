/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtectionStatusDto } from './ProtectionStatusDto';

export type DuePayoutPointDto = {
    /**
     * epoch timestamp in seconds
     */
    pointIndex: number;
    protectionStatus: ProtectionStatusDto;
};

