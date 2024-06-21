/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { AppClient } from './AppClient';

export { ApiError } from './core/ApiError';
export { BaseHttpRequest } from './core/BaseHttpRequest';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export { ArmadilloSupportedTokenNameDto } from './models/ArmadilloSupportedTokenNameDto';
export type { DuePayoutPointDto } from './models/DuePayoutPointDto';
export { FormattedProtectionBoughtEventDto } from './models/FormattedProtectionBoughtEventDto';
export { FormattedProtectionClosedEventDto } from './models/FormattedProtectionClosedEventDto';
export type { FormatterProtectionBoughtEventObjectDto } from './models/FormatterProtectionBoughtEventObjectDto';
export type { FormatterProtectionClosedEventObjectDto } from './models/FormatterProtectionClosedEventObjectDto';
export type { IlLpTokensInfoOfAccountAddressDto } from './models/IlLpTokensInfoOfAccountAddressDto';
export { LpTokensInfoDto } from './models/LpTokensInfoDto';
export type { ProtectionDuePayoutPointsDto } from './models/ProtectionDuePayoutPointsDto';
export type { ProtectionDuePayoutsInfoDto } from './models/ProtectionDuePayoutsInfoDto';
export type { ProtectionIdWithInfoDto } from './models/ProtectionIdWithInfoDto';
export type { ProtectionInfoDto } from './models/ProtectionInfoDto';
export type { ProtectionInfoMetadataDto } from './models/ProtectionInfoMetadataDto';
export type { ProtectionStatusDto } from './models/ProtectionStatusDto';
export type { ProtectionStatusProfitDto } from './models/ProtectionStatusProfitDto';
export { UsedEmbedDiscountForAddressDto } from './models/UsedEmbedDiscountForAddressDto';
export type { WalletProtectionsDto } from './models/WalletProtectionsDto';
export type { WorstIlOfTokenByCoinGekoDto } from './models/WorstIlOfTokenByCoinGekoDto';
export type { WorstIlPointInTimeDto } from './models/WorstIlPointInTimeDto';

export { AccountsService } from './services/AccountsService';
export { DefaultService } from './services/DefaultService';
export { DiscountService } from './services/DiscountService';
export { MaxIlService } from './services/MaxIlService';
export { PrometheusService } from './services/PrometheusService';
export { SentryService } from './services/SentryService';
export { ZapperApiService } from './services/ZapperApiService';
