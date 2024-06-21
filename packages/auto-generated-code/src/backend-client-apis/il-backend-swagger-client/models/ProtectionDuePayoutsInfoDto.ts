/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DuePayoutPointDto } from './DuePayoutPointDto';
import type { ProtectionInfoDto } from './ProtectionInfoDto';

export type ProtectionDuePayoutsInfoDto = {
    protectionInfo: ProtectionInfoDto;
    points: Array<DuePayoutPointDto>;
};

