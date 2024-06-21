/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PointSummaryDto } from './PointSummaryDto';

export type PointsSummaryResultDto = {
    /**
     * data is sorted in asc order by time property
     */
    data: Array<PointSummaryDto>;
    highestTimestampMs: number;
};

