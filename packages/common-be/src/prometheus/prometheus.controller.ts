import { Controller, Get, Header, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { register } from 'prom-client'

interface IPrometheusService {
  getMetrics: () => Promise<string>
}

@ApiTags(`prometheus`)
@Controller('/')
export class PrometheusController {
  constructor(@Inject('PrometheusServiceToken') private prometheusService: IPrometheusService) {}

  @Get('/metrics')
  // it is ok to check the contentType from the global prometheus-client-registry because all registries uses the same contentType:
  // https://github.com/siimon/prom-client/blob/4e6aacd4921a3791e8f01ac6ab2fd6bb421b0dc0/lib/registry.js#L146
  @Header('Content-Type', register.contentType)
  root(): Promise<string> {
    return this.prometheusService.getMetrics()
  }
}
