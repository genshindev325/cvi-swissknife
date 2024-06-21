import { ContainerModule } from 'inversify'
import type { RedisInfo } from '@coti-cvi/lw-sdk'
import { RedisInversifyService } from './redis'

export function createCommonBackendModule(options: { redisInfo?: RedisInfo }) {
  return new ContainerModule(bind => {
    bind('RedisInversifyService').to(RedisInversifyService)
    if (options.redisInfo !== undefined) {
      bind('RedisInfo').toConstantValue(options.redisInfo)
    }
  })
}
