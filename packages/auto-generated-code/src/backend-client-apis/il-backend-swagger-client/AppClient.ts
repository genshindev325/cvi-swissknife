/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AccountsService } from './services/AccountsService';
import { DefaultService } from './services/DefaultService';
import { DiscountService } from './services/DiscountService';
import { MaxIlService } from './services/MaxIlService';
import { PrometheusService } from './services/PrometheusService';
import { SentryService } from './services/SentryService';
import { ZapperApiService } from './services/ZapperApiService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class AppClient {

    public readonly accounts: AccountsService;
    public readonly default: DefaultService;
    public readonly discount: DiscountService;
    public readonly maxIl: MaxIlService;
    public readonly prometheus: PrometheusService;
    public readonly sentry: SentryService;
    public readonly zapperApi: ZapperApiService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.accounts = new AccountsService(this.request);
        this.default = new DefaultService(this.request);
        this.discount = new DiscountService(this.request);
        this.maxIl = new MaxIlService(this.request);
        this.prometheus = new PrometheusService(this.request);
        this.sentry = new SentryService(this.request);
        this.zapperApi = new ZapperApiService(this.request);
    }
}

