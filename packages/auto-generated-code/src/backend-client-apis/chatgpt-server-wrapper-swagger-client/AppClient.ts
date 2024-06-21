/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { ChatgptQueryService } from './services/ChatgptQueryService';
import { DefaultService } from './services/DefaultService';
import { PrometheusService } from './services/PrometheusService';
import { SentryService } from './services/SentryService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class AppClient {

    public readonly chatgptQuery: ChatgptQueryService;
    public readonly default: DefaultService;
    public readonly prometheus: PrometheusService;
    public readonly sentry: SentryService;

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

        this.chatgptQuery = new ChatgptQueryService(this.request);
        this.default = new DefaultService(this.request);
        this.prometheus = new PrometheusService(this.request);
        this.sentry = new SentryService(this.request);
    }
}

