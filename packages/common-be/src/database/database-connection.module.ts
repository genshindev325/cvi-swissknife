import { Module } from '@nestjs/common'
import chance from 'chance'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { DataSource } from 'typeorm'
import type { Logger } from 'winston'
import { MysqlDatabaseConnectionService } from './mysql-database-connection.service'
import type { Config, ServiceName } from '../config'
import { ConfigModule } from '../config'

export async function createMysqlConnection({
  mysqlConfig,
  logger,
}: {
  mysqlConfig: Config<ServiceName>['mysql']
  logger?: Logger
}) {
  const dataSource = new DataSource({
    ...mysqlConfig,
    type: 'mysql',
    name: `connection${chance().hash()}`,
  })

  await dataSource.initialize()

  const log = logger ? logger.info : console.log
  log(
    `database address: mysql://${mysqlConfig.username}:${mysqlConfig.password}@${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database}`,
  )

  return dataSource
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MysqlTypeormConnectionToken',
      useFactory: async (config: Config<ServiceName>, logger: Logger): Promise<DataSource> => {
        return createMysqlConnection({ mysqlConfig: config.mysql, logger })
      },
      inject: ['ConfigToken', WINSTON_MODULE_PROVIDER],
    },
    MysqlDatabaseConnectionService,
  ],
  exports: [MysqlDatabaseConnectionService],
})
export class DatabaseConnectionModule {}
