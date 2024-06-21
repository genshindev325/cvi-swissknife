/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryResultDebugChunkDto } from './QueryResultDebugChunkDto';
import type { TextReducedInfoDto } from './TextReducedInfoDto';

export type QueryResultDebugDto = {
    chunks: Array<QueryResultDebugChunkDto>;
    textReducedInfoDto: TextReducedInfoDto;
};

