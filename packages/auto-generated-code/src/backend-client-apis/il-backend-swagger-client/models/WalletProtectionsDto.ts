/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtectionIdWithInfoDto } from './ProtectionIdWithInfoDto';

export type WalletProtectionsDto = {
    wallet: string;
    isInternalWallet: boolean;
    protections: Array<ProtectionIdWithInfoDto>;
};

