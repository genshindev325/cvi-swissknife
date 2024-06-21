/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GetCviOracleHistoryDataQueryDto = {
    fromBlockTimestamp?: number;
    toBlockTimestamp?: number;
    groupBy: GetCviOracleHistoryDataQueryDto.groupBy;
};

export namespace GetCviOracleHistoryDataQueryDto {

    export enum groupBy {
        DAY = 'day',
        HOUR = 'hour',
        MINUTES = 'minutes',
    }


}

