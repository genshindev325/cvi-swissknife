import { inject, injectable } from 'inversify'
import { Logger } from '@nestjs/common'
import IORedis from 'ioredis'
import type { RedisInfo } from '@coti-cvi/lw-sdk'

@injectable()
export class RedisInversifyService {
  public readonly client: IORedis

  constructor(@inject('RedisInfo') private readonly redisInfo: RedisInfo) {
    const logger = new Logger('RedisInversifyService')

    const opt = {
      host: this.redisInfo.host,
      port: this.redisInfo.port,
      username: this.redisInfo.username,
      password: this.redisInfo.password,
    }

    this.client = new IORedis(opt)

    logger.log('Redis client ready (Waiting to connect)...')

    this.client.on('connect', () => {
      logger.log(`Connected to redis on ${this.client.options.host}:${this.client.options.port}`)
    })

    this.client.on('error', e => {
      logger.error(`Redis error`, e, opt)
    })
  }
}
