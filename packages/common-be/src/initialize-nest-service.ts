import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/platform-ws'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import type { ArgumentMetadata } from '@nestjs/common'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import type { Config, ServiceName } from './config'
import { AppEnv } from './config'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import fs from 'fs'
import path from 'path'
// @ts-ignore
import killPort from 'kill-port'
// @ts-ignore
import portUsed from 'port-used'

export async function killUsedPorts(ports: number[]): Promise<void> {
  const usedPorts = await Promise.all(
    ports.map(async port => portUsed.check(port).then((isUsed: boolean) => (isUsed ? port : -1))),
  ).then(r => r.filter(port => port > -1))
  if (usedPorts.length > 0) {
    await Promise.all(usedPorts.map(port => killPort(port)))
    console.log(`killed ports: ${usedPorts.join(',')}`)
  } else {
    console.log(`all of the specified ports (${ports.join(',')}) are already free`)
  }
}

class CustomValidationPipe extends ValidationPipe {
  public async transform(requestBody: unknown, metadata: ArgumentMetadata) {
    try {
      return super.transform(requestBody, metadata)
    } catch (validationError: unknown) {
      if (validationError instanceof BadRequestException) {
        throw new CustomError({
          name: validationError.name,
          errorKind: ErrorKind.UserError,
          httpStatus: validationError.getStatus(),
          message: validationError.message,
          extras: {
            requestBody,
            // @ts-ignore
            requestBodyValidationErrors: validationError.getResponse().message,
          },
        })
      }
      throw validationError
    }
  }
}

export async function initializeNestService(options: { AppModule: unknown } | { app: NestFastifyApplication }) {
  const app =
    'AppModule' in options
      ? await NestFactory.create<NestFastifyApplication>(options.AppModule, new FastifyAdapter())
      : options.app

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER)
  app.enableCors()

  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidUnknownValues: true,
      enableDebugMessages: true,
      // --start--
      // throw an error if we pass params that do not exist in the dto: https://github.com/typestack/class-validator/issues/305#issuecomment-466126314
      whitelist: true,
      forbidNonWhitelisted: true,
      // --end--
    }),
  )
  app.useWebSocketAdapter(new WsAdapter(app))

  app.enableShutdownHooks()

  const config = app.get<Config<ServiceName>>('ConfigToken')

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setDescription(
        config.appEnv == AppEnv.K8s
          ? `The ${config.runningService.runtimeName}@${config.appEnv}@${config.runningService.version} API documentation`
          : `The ${config.runningService.runtimeName}@${config.appEnv} API documentation`,
      )
      .setVersion('1.0')
      .build(),
  )

  await fs.promises.writeFile(
    path.join(
      config.repoPath,
      'packages',
      'auto-generated-code',
      'src',
      'backend-swaggers',
      `${config.runningService.packageJsonName}-swagger.json`,
    ),
    JSON.stringify(document, null, 2),
  )

  const swaggerUrl = `api/docs`
  SwaggerModule.setup(swaggerUrl, app, document)

  logger.info(`swagger-api docs: ${config.runningService.accessibleBaseUrl}/${swaggerUrl}`)

  const port = config.ports[config.runningService.packageJsonName]

  async function listenToPort(): Promise<void> {
    await killUsedPorts([port])
    logger.info(`trying to listen to port: ${port}`)
    await app.listen(port, '0.0.0.0').catch(error => {
      CustomError.printErrorToConsole(error)
      return listenToPort()
    })
  }

  await listenToPort()

  logger.info(`Listening on port ${port} (${process.uptime()}s)`)
}
