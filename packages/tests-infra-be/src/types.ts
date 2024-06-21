import type { Config, ServiceName } from '@coti-cvi/common-be'
import type { DynamicModule, ForwardReference, INestApplication, Type } from '@nestjs/common'
import type { TestingModule, TestingModuleBuilder } from '@nestjs/testing'
import type { Server } from 'http'

export type CleanupFunction = () => Promise<unknown>

export type StartNestAppOptions = {
  mysql?: boolean
  replaceWithMock?: (app: TestingModuleBuilder) => TestingModuleBuilder
  beforeStart?: (app: Pick<TestApp, 'config'>) => unknown | Promise<unknown>
  dontFailOnSentryErrors?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainNestModule: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  overrideConfig?: (config: Config<ServiceName>) => void | Promise<void>
}

export type TestApp = {
  app: INestApplication
  moduleRef: TestingModule
  httpServer: Server
  config: Config<ServiceName>
  closeApp: () => Promise<void>
}

export type StartNestApp = (options: StartNestAppOptions) => Promise<TestApp>
