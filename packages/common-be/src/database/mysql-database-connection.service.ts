import type { OnApplicationShutdown } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import type { DataSource } from 'typeorm'

export class MysqlDatabaseConnectionService implements OnApplicationShutdown {
  constructor(@Inject('MysqlTypeormConnectionToken') public readonly dataSource: DataSource) {}

  async onApplicationShutdown() {
    await this.dataSource.destroy()
  }
}
