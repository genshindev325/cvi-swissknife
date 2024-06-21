import type { ServiceName } from '@coti-cvi/common-be'
import { AppEnv, createConfig, initializeNestService, packagePath } from '@coti-cvi/common-be'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import ErrorStackParser from 'error-stack-parser'
import fs from 'fs'
import { deserializeError } from 'serialize-error'
import type { CleanupFunction, StartNestAppOptions, TestApp } from '../types'
import { initializeSentryMockService } from './sentry-mock-server'
import getPort from 'get-port'
import path from 'path'
import omit from 'lodash/omit'

export class StartNestAppGenerator {
  constructor(private readonly appCleanups: CleanupFunction[]) {}

  public async start(options: StartNestAppOptions): Promise<TestApp> {
    const sentryMockService = await initializeSentryMockService()

    const serviceDirPath = ((): string => {
      const stackrtrace = ErrorStackParser.parse(new Error())
      const packageTested = stackrtrace.map(s => s.fileName).find(s => s?.includes('.spec.ts'))
      if (!packageTested) {
        throw new Error('package tested not found in stack trace')
      }
      return packagePath(packageTested)
    })()

    const packageJsonName: ServiceName = JSON.parse(
      await fs.promises.readFile(path.join(serviceDirPath, 'package.json'), 'utf-8'),
    ).name

    const config = await createConfig({
      processEnv: {
        APP_ENV: AppEnv.Local,
      },
      packageJsonName,
      overrideConfig: async config => {
        config.isTestMode = true
        config.sentry.enabled = true
        config.sentry.dsn[config.runningService.packageJsonName] = sentryMockService.sentryDsn
        config.ports[config.runningService.packageJsonName] = await getPort()
        config.mysql = {
          username: 'root',
          password: 'my-secret-pw',
          host: 'localhost',
          port: 3306,
          database: 'db1',
          entities: config.mysql.entities,
          migrations: [path.join(__dirname, '../resources/mysql-migrations/**/*')],
        }
        if (options.overrideConfig) {
          await options.overrideConfig(config)
        }
      },
    })

    if (options.beforeStart) {
      await options.beforeStart({ config })
    }

    const testingModuleBuilder = Test.createTestingModule({
      imports: [options.mainNestModule],
    })
      .overrideProvider('ProcessEnvToken')
      .useValue(config.processEnv)
      .overrideProvider('ConfigToken')
      .useValue(config)

    const withMocks = options.replaceWithMock ? options.replaceWithMock(testingModuleBuilder) : testingModuleBuilder

    const moduleRef = await withMocks.compile()

    const app = await moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await initializeNestService({ app })

    let isAppOpen = true
    let isSentryMockOpen = true

    this.appCleanups.push(async () => {
      if (isAppOpen) {
        isAppOpen = false
        await app.close()
      }
      if (isSentryMockOpen) {
        isSentryMockOpen = false
        await sentryMockService.closeService()
        if (!options.dontFailOnSentryErrors && sentryMockService.errorsUntilNow.length > 0) {
          console.group('sentry-errors')
          console.error(`during the test, the app sent errors to sentry - fix them to make your test pass:`)
          for (const report of sentryMockService.errorsUntilNow) {
            console.error(deserializeError(omit(report.error, 'stacktrace')))
          }
          console.groupEnd()

          throw new Error(`test failed due to sentry errors`)
        }
      }
    })

    return {
      app,
      moduleRef,
      httpServer: app.getHttpServer(),
      config,
      closeApp: async () => {
        if (isAppOpen) {
          isAppOpen = false
          await app.close()
        } else {
          throw new Error("app already closed. can't close it. you have a bug in your test")
        }
      },
    }
  }
}
