/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BlockDto } from './BlockDto';
import type { GeneralInfoOfEventDto } from './GeneralInfoOfEventDto';
import type { UpdateGeneralInfoOfEventOfAddressDto } from './UpdateGeneralInfoOfEventOfAddressDto';

export type UpdateGeneralInfoOfEventAndAddressesDto = {
    block: BlockDto;
    generalInfoOfEvent: GeneralInfoOfEventDto;
    updatedGeneralInfoOfEventByAddress: Array<UpdateGeneralInfoOfEventOfAddressDto>;
};

