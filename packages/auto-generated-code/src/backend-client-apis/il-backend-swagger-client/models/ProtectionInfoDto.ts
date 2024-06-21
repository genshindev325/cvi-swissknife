/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormattedProtectionBoughtEventDto } from './FormattedProtectionBoughtEventDto';
import type { FormattedProtectionClosedEventDto } from './FormattedProtectionClosedEventDto';
import type { ProtectionInfoMetadataDto } from './ProtectionInfoMetadataDto';
import type { ProtectionStatusDto } from './ProtectionStatusDto';

export type ProtectionInfoDto = {
    metadata: ProtectionInfoMetadataDto;
    status: ProtectionStatusDto;
    boughtEvent: FormattedProtectionBoughtEventDto;
    expiredEvent: FormattedProtectionClosedEventDto | null;
};

