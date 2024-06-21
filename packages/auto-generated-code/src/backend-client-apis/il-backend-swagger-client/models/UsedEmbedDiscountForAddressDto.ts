/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UsedEmbedDiscountForAddressDto = {
    discountTypeId: number;
    discountTypeName: UsedEmbedDiscountForAddressDto.discountTypeName;
    discountUsdc: number;
};

export namespace UsedEmbedDiscountForAddressDto {

    export enum discountTypeName {
        GOLD = 'Gold',
        DIAMOND = 'Diamond',
    }


}

