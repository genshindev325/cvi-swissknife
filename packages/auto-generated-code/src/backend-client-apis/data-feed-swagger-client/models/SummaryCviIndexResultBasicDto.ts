/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SummaryCviIndexUsdcBasicDto } from './SummaryCviIndexUsdcBasicDto';

export type SummaryCviIndexResultBasicDto = {
    /**
     * data is sorted in asc order by time property
     */
    data: Array<SummaryCviIndexUsdcBasicDto>;
    highestTimestampMs: number;
};

