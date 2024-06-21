/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { CviIndexHistoryService } from './services/CviIndexHistoryService';
import { DefaultService } from './services/DefaultService';
import { K8SService } from './services/K8SService';
import { PrometheusService } from './services/PrometheusService';
import { SentryService } from './services/SentryService';
import { TokensService } from './services/TokensService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class AppClient {

    public readonly cviIndexHistory: CviIndexHistoryService;
    public readonly default: DefaultService;
    public readonly k8S: K8SService;
    public readonly prometheus: PrometheusService;
    public readonly sentry: SentryService;
    public readonly tokens: TokensService;

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

        this.cviIndexHistory = new CviIndexHistoryService(this.request);
        this.default = new DefaultService(this.request);
        this.k8S = new K8SService(this.request);
        this.prometheus = new PrometheusService(this.request);
        this.sentry = new SentryService(this.request);
        this.tokens = new TokensService(this.request);
    }
}

