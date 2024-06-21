/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PointSummaryDto = {
    /**
     * lowest point in a time-range (day/hour)
     */
    low: number;
    /**
     * highest point in a time-range (day/hour)
     */
    high: number;
    /**
     * start of the time-range (day/hour)
     */
    open: number;
    /**
     * end of the time-range (day/hour)
     */
    close: number;
    /**
     * epoch in seconds
     */
    time: number;
    /**
     * epoch in seconds
     */
    timeUtc: string;
};

