import path from 'path'
import fs from 'fs'
import execa from 'execa'
import os from 'os'
import { Module } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import findUp from 'find-up'
import type { Config, ConfigByService, ManuallyDefinedCommonConfig, ServiceName } from './types'
import { AppEnv } from './types'
import { CHAIN_IDS_INFO, safeObjectEntries, SERVICE_NAMES } from '@coti-cvi/lw-sdk'
import { defineConfig } from './define-config'

export async function getBranchName({
  repoPath,
  env,
}: {
  repoPath: string
  env: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
}): Promise<string> {
  if (env.GITHUB_REF_NAME === 'main') {
    return 'main'
  }
  const branch = env.CODEBUILD_WEBHOOK_TRIGGER?.replace('branch/', '')
  if (branch) {
    return branch
  }
  return execa
    .command('git branch --show-current', {
      stdio: 'pipe',
      cwd: repoPath,
    })
    .then(r => r.stdout)
}

export async function createConfig({
  packageJsonName,
  processEnv,
  overrideConfig,
}: {
  packageJsonName: ServiceName
  processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
  overrideConfig?: (config: Config<ServiceName>) => void | Promise<void>
}): Promise<Config<ServiceName>> {
  const isTestMode = Boolean(processEnv.IS_TEST_MODE)
  const repoPath = await path.dirname((await findUp('yarn.lock', { cwd: __dirname }))!)

  const dockerImageVersionPath = path.join(repoPath, 'image_version')
  const isDockerImageVersionExist = fs.existsSync(dockerImageVersionPath)

  const serviceVersion = isDockerImageVersionExist
    ? await fs.promises.readFile(dockerImageVersionPath, 'utf8')
    : await Promise.all([
        getBranchName({ repoPath, env: processEnv }).then(r => r.replace('/', '_')),
        execa.command(`git log -1 --pretty=%H`).then(r => r.stdout),
      ]).then(r => `${r[0]}-${r[1]}`)

  const appEnv = Object.values(AppEnv).find(v => v === processEnv.APP_ENV) ?? AppEnv.Local

  if (!appEnv) {
    throw new Error(`APP_ENV is illegal. allowed values are: ${Object.values(AppEnv)}`)
  }

  const replicaId = os.hostname()

  const runMode = replicaId.startsWith(packageJsonName) ? 'inside-k8s' : 'local-developer-machine'

  const manuallyDefinedConfig = defineConfig({ processEnv, isTestMode })

  const manuallyDefinedCommonConfig = {} as ManuallyDefinedCommonConfig

  for (const entry of safeObjectEntries(manuallyDefinedConfig)) {
    if (entry[0] !== 'services') {
      const valueOrFunctionToUse =
        typeof entry[1] !== 'object' || !(AppEnv.K8s in entry[1]) ? entry[1] : entry[1][appEnv]
      Object.defineProperty(manuallyDefinedCommonConfig, entry[0], {
        value: typeof valueOrFunctionToUse === 'function' ? valueOrFunctionToUse() : valueOrFunctionToUse,
        enumerable: true,
      })
    }
  }

  const serviceConfig = manuallyDefinedConfig.services[packageJsonName]()

  const manuallyDefinedServiceConfig: ConfigByService[ServiceName] = {
    ...(appEnv in serviceConfig
      ? // @ts-ignore
        serviceConfig[appEnv]()
      : serviceConfig),
    serviceName: packageJsonName,
  }

  let runtimeName: string
  let accessibleBaseUrl: string

  switch (appEnv) {
    case AppEnv.Local:
      runtimeName = packageJsonName
      accessibleBaseUrl = `http://localhost:${manuallyDefinedCommonConfig.ports[packageJsonName]}`
      break
    case AppEnv.K8s: {
      switch (runMode) {
        case 'local-developer-machine':
          runtimeName = `${packageJsonName}----developer-machine----${replicaId}`
          accessibleBaseUrl = `http://localhost:${manuallyDefinedCommonConfig.ports[packageJsonName]}`
          break
        case 'inside-k8s':
          const split = replicaId.split('-')
          const isStatefulSet = split.length >= 2 && split[split.length - 1].length === 1
          const isDeployment =
            split.length >= 3 && split[split.length - 2].length > 1 && split[split.length - 1].length > 1
          if (isStatefulSet) {
            runtimeName = split.slice(0, split.length - 1).join('-')
          } else {
            if (isDeployment) {
              runtimeName = split.slice(0, split.length - 2).join('-')
            } else {
              throw new Error(
                `unsupported runtime. can't identify if it's a statefulset or a deployment. are you running AppEnv.K8s locally?`,
              )
            }
          }
          accessibleBaseUrl = `https://${runtimeName}.cvi-team.com`
          break
      }
      break
    }
    default:
      throw new Error(`APP_ENV is illegal. allowed values are: ${Object.values(AppEnv)}`)
  }

  const config: Config<ServiceName> = {
    ...manuallyDefinedCommonConfig,
    repoPath,
    appEnv,
    processEnv,
    isTestMode,
    runningService: {
      runtimeName: runtimeName,
      packageJsonName,
      replicaId,
      accessibleBaseUrl,
      version: serviceVersion,
    },
    serviceConfig: manuallyDefinedServiceConfig,
  }

  if (overrideConfig) {
    await overrideConfig(config)
  }

  return config
}

@Module({
  providers: [
    {
      provide: 'ProcessEnvToken',
      useFactory: () => process.env,
    },
    {
      provide: 'PackageJsonNameToken',
      useFactory: async (serviceDirPath: string) => {
        const packageJson = JSON.parse(await fs.promises.readFile(path.join(serviceDirPath, 'package.json'), 'utf-8'))
        const packageJsonName = SERVICE_NAMES.find(s => s === packageJson.name)
        if (!packageJsonName) {
          throw new Error(`package.json name must be one of ${SERVICE_NAMES.join(', ')}`)
        }
        return packageJsonName
      },
      inject: ['ServiceDirPathToken'],
    },
    {
      provide: 'ConfigToken',
      useFactory: async (packageJsonName: ServiceName, processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>) => {
        return await createConfig({ packageJsonName, processEnv })
      },
      inject: ['PackageJsonNameToken', 'ProcessEnvToken'],
    },
    {
      provide: 'logToken',
      useFactory: (config: Config<ServiceName>, logger: Logger) => {
        logger.info(
          `${config.runningService.runtimeName}@${config.runningService.version} - appEnv=${config.appEnv} - ${config.runningService.accessibleBaseUrl} - replica-id: ${config.runningService.replicaId}`,
        )
        switch (config.serviceConfig.serviceName) {
          case 'il-monitor':
          case 'il-backend':
          case 'cvi-backend':
            logger.info(
              `chain: ${CHAIN_IDS_INFO[config.serviceConfig.chainId].hardhatConfigNetworkName} (${
                config.serviceConfig.chainId
              })`,
            )
            break
        }
      },
      inject: ['ConfigToken', WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: ['ConfigToken'],
})
export class ConfigModule {}
