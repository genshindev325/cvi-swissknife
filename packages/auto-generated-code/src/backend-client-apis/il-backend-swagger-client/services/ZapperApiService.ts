/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IlLpTokensInfoOfAccountAddressDto } from '../models/IlLpTokensInfoOfAccountAddressDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ZapperApiService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * For given EVM addresses, return all supported il-product pairs and their liquidity providing balances. To get an EVM address that that supplies Liquidity in defi go to one of the CONTRACT_ADDRESSES for the supported pairs, e.g: https://etherscan.io/address/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852 and pick any EVM address in the transactions list
     * @returns IlLpTokensInfoOfAccountAddressDto
     * @throws ApiError
     */
    public zapperApiControllerAccountsLps({
        accountAddresses,
    }: {
        accountAddresses: Array<string>,
    }): CancelablePromise<Array<IlLpTokensInfoOfAccountAddressDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/zapper-api/accounts-lps',
            query: {
                'account-addresses': accountAddresses,
            },
        });
    }

}
