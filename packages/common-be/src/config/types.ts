import type {
  ChainId,
  ChainsInfo,
  CVISupportedChainIds,
  IlSupportedChainIds,
  NetworkName,
  RedisInfo,
  S3Info,
  SERVICE_NAMES,
  TvSupportedChainIds,
} from '@coti-cvi/lw-sdk'
import type { DataSourceOptions } from 'typeorm'
import type { BigNumberish } from 'ethers'

export type ServiceName = typeof SERVICE_NAMES[number]

export type DataFeedConfig = Config<'data-feed'>
export type IlBackendConfig = Config<'il-backend'>
export type CviBackendConfig = Config<'cvi-backend'>
export type IlMonitorConfig = Config<'il-monitor'>
export type TvMonitorConfig = Config<'cvi-monitor'>
export type CviTweetConfig = Config<'cvi-tweet'>
export type CommonBlockchainEventsMonitorConfig = Config<'cvi-oracle-events-backend'>
export type ChatgptServerWrapperConfig = Config<'chatgpt-server-wrapper'>

export type CviSigner = {
  [_ChainId in TvSupportedChainIds]: ChainsInfo[_ChainId]['networkName'] extends NetworkName.Staging | NetworkName.Local
    ? {
        impersonatedPublicWalletAddress: string
      }
    : ChainsInfo[_ChainId]['networkName'] extends NetworkName.Mainnet
    ? {
        privateKey: string
      }
    : never
}

export type IlSigner = {
  [_ChainId in IlSupportedChainIds]: ChainsInfo[_ChainId]['networkName'] extends NetworkName.Staging | NetworkName.Local
    ? {
        impersonatedPublicWalletAddress: string
      }
    : ChainsInfo[_ChainId]['networkName'] extends NetworkName.Mainnet
    ? {
        privateKey: string
      }
    : never
}

export type TwitterSearch = {
  term: string
  thresholds?: {
    // these are OR thresholds (not AND)
    retweet_count: number
    like_count: number
    quote_count: number
  }
}
export enum AppEnv {
  Local = 'local',
  K8s = 'k8s',
}

export type ConfigByService = {
  'data-feed': {
    serviceName: 'data-feed'
  }
  'il-backend': {
    serviceName: 'il-backend'
    chainId: IlSupportedChainIds
    calcMaxIlBasedOnXSecondsAgo: number
    s3Info: S3Info
    loadAdminPanelEvents: boolean
  }
  'cvi-backend': {
    serviceName: 'cvi-backend'
    chainId: TvSupportedChainIds
    redis: RedisInfo
    adminApiCachingConfig: {
      useRedis: boolean
    }
  }
  'cvi-oracle-events-backend': {
    serviceName: 'cvi-backend'
    chainId: CVISupportedChainIds
    redis: RedisInfo
  }
  'cvi-tweet': {
    serviceName: 'cvi-tweet'
    twitter: {
      appKey: string
      appSecret: string
      accessToken: string
      accessSecret: string
    }
    maxTweetsIn24hrs: number
    minMinutesBetweenTweets: number
    enableTweeting: boolean
    telegramBot: {
      botToken: string
    }
    interestingTweets: {
      enableTweetsInform: boolean
      searchTweets: TwitterSearch[]
      telegramChatId: string
    }[]
  }
  'il-monitor': {
    serviceName: 'il-monitor'
    chainId: IlSupportedChainIds
    performUpkeep: boolean
    ilSigner: IlSigner
    recurringPremiumBuyerBot: {
      enabled: boolean
      intervalMinutes: number
      coveredAmountUsdc: number
      slippagePercentage: number
      signer: IlSigner
    }
  }
  'cvi-monitor': {
    serviceName: 'cvi-monitor'
    chainId: TvSupportedChainIds
    performUpkeep: boolean
    monitor: boolean
    redis: RedisInfo
    signer: CviSigner
    chainLinkKeepersRegistryAddress: Record<ChainId.ArbitrumMainnet | ChainId.PolygonMainnet, string>
    chainLinkKeeperIds: Record<ChainId.ArbitrumMainnet | ChainId.PolygonMainnet, BigNumberish[]>
    arbitrageBot: {
      enabled: boolean
      intervalMs: number
      singer: CviSigner
      depositUsdcToTv: number
      withdrawUsdcFromTvWhenAddressUsdcBalanceLessThan: number
    }
  }
  'chatgpt-server-wrapper': {
    serviceName: 'chatgpt-server-wrapper'
  }
}

export type Config<_ServiceName extends ServiceName> = {
  serviceConfig: ConfigByService[_ServiceName]
  repoPath: string
  processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
  runningService: {
    runtimeName: string // it can be `${packageJsonName}` or `${packageJsonName}_${NetworkName}` or something else
    packageJsonName: _ServiceName
    version: string
    replicaId: string
    accessibleBaseUrl: string
  }
  k8sConfigBase64: string
  appEnv: AppEnv
  isTestMode: boolean
  ports: Record<ServiceName, number>
  sentry: {
    enabled: boolean
    debug: boolean
    dsn: Record<ServiceName, string>
  }
  mysql: {
    username: string
    password: string
    host: string
    port: number
    database: string
  } & Required<Pick<DataSourceOptions, 'entities'>> &
    Partial<Pick<DataSourceOptions, 'migrations'>>
  zapper: {
    zapperApiKeys: string[]
    proxy?: { host: string; port: number; auth?: { username: string; password: string } }
  }
}

export type ManuallyDefinedCommonConfig = Omit<
  Config<ServiceName>,
  'serviceConfig' | 'repoPath' | 'processEnv' | 'isTestMode' | 'runningService' | 'appEnv'
>

export type DefineConfigReturnType = {
  [ConfigKey in keyof ManuallyDefinedCommonConfig]:
    | ManuallyDefinedCommonConfig[ConfigKey]
    | {
        [AppEnv.K8s]: ManuallyDefinedCommonConfig[ConfigKey] | (() => ManuallyDefinedCommonConfig[ConfigKey])
        [AppEnv.Local]: ManuallyDefinedCommonConfig[ConfigKey] | (() => ManuallyDefinedCommonConfig[ConfigKey])
      }
} & {
  services: {
    [ConfigKey in keyof ConfigByService]:
      | (() => Omit<ConfigByService[ConfigKey], 'serviceName'>)
      | (() => {
          [AppEnv.K8s]: () => Omit<ConfigByService[ConfigKey], 'serviceName'>
          [AppEnv.Local]: () => Omit<ConfigByService[ConfigKey], 'serviceName'>
        })
  }
}
