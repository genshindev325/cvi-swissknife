import type { RedisInfo, S3Info } from '@coti-cvi/lw-sdk'
import { CVI_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { ChainId, IL_SUPPORTED_CHAIN_IDS, TV_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import path from 'path'
import type { StrictOmit } from 'ts-essentials'
import type { ConfigByService, DefineConfigReturnType } from './types'
import { AppEnv } from './types'

export function defineConfig({
  processEnv,
  isTestMode,
}: {
  processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
  isTestMode: boolean
}): DefineConfigReturnType {
  const s3Info: S3Info = {
    bucket: 'cvi-armadillo-bucket',
    region: 'eu-west-1',
    accessKeyId: 'AKIAWR4BNSF64UUEXUEG',
    secretAccessKey: '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',
  }

  const localRedisInfo: RedisInfo = {
    host: 'a85cbc24efcbd428f8c3b4a47d429e1c-b3daa06160408fd4.elb.eu-west-1.amazonaws.com',
    port: 6379,
    password: 'L89R7ZLsjvJk',
  }

  const k8sRedisInfo = {
    host: 'redis-master.redis.svc.cluster.local',
    port: 6379,
    password: 'L89R7ZLsjvJk',
  }
  const adminApiCachingConfig = {
    useRedis: true,
  }

  return {
    services: {
      'chatgpt-server-wrapper': () => ({}),
      'il-backend': () => {
        const chainId = Object.values(IL_SUPPORTED_CHAIN_IDS).find(c => c.toString() === processEnv.CHAIN_ID)
        return {
          k8s: () => {
            if (!chainId) {
              throw new Error(`process.env.CHAIN_ID not supplied`)
            }
            return { calcMaxIlBasedOnXSecondsAgo: 60 * 60 * 24 * 30 * 18, chainId, s3Info, loadAdminPanelEvents: true }
          },
          local: () => ({
            calcMaxIlBasedOnXSecondsAgo: 60 * 60 * 24 * 30 * 18,
            chainId: chainId ?? ChainId.PolygonMainnet,
            s3Info,
            loadAdminPanelEvents: true,
          }),
        }
      },
      'cvi-backend': () => {
        const chainId = Object.values(TV_SUPPORTED_CHAIN_IDS).find(c => c.toString() === processEnv.CHAIN_ID)
        return {
          k8s: () => {
            if (!chainId) {
              throw new Error(`process.env.CHAIN_ID not supplied`)
            }
            return {
              chainId,
              redis: k8sRedisInfo,
              adminApiCachingConfig,
            }
          },
          local: () => {
            const safeChainId = chainId ?? ChainId.ArbitrumLocal
            return {
              chainId: safeChainId,
              redis: localRedisInfo,
              adminApiCachingConfig,
            }
          },
        }
      },
      'cvi-oracle-events-backend': () => {
        const chainId = Object.values(CVI_SUPPORTED_CHAIN_IDS).find(c => c.toString() === processEnv.CHAIN_ID)
        return {
          k8s: () => {
            if (!chainId) {
              throw new Error(`process.env.CHAIN_ID not supplied`)
            }
            return {
              chainId,
              redis: k8sRedisInfo,
            }
          },
          local: () => {
            const safeChainId = chainId ?? ChainId.ArbitrumMainnet
            return {
              chainId: safeChainId,
              redis: localRedisInfo,
            }
          },
        }
      },
      'il-monitor': () => {
        const chainId = IL_SUPPORTED_CHAIN_IDS.find(c => c.toString() === processEnv.CHAIN_ID)
        const recurringPremiumBuyerBotSinger = {
          [ChainId.PolygonStaging]: {
            impersonatedPublicWalletAddress: '0xD324d6A2C1b880065649501AeAC1094d7152D27D',
          },
          [ChainId.PolygonLocal]: {
            impersonatedPublicWalletAddress: '0xD324d6A2C1b880065649501AeAC1094d7152D27D',
          },
          [ChainId.PolygonMainnet]: {
            // public address: 0xD324d6A2C1b880065649501AeAC1094d7152D27D
            privateKey: '9f206145f5b569e1430156f361178fee60809d329e04b8dc531f5cfbcbb28208',
          },
          [ChainId.ArbitrumStaging]: {
            impersonatedPublicWalletAddress: '0xD324d6A2C1b880065649501AeAC1094d7152D27D',
          },
          [ChainId.ArbitrumLocal]: {
            impersonatedPublicWalletAddress: '0xD324d6A2C1b880065649501AeAC1094d7152D27D',
          },
          [ChainId.ArbitrumMainnet]: {
            // public address: 0xD324d6A2C1b880065649501AeAC1094d7152D27D
            privateKey: '9f206145f5b569e1430156f361178fee60809d329e04b8dc531f5cfbcbb28208',
          },
        }
        const coveredAmountUsdc = 0.001 // the actual premium-cost will be much(!) lower!
        const slippagePercentage = 1
        const intervalMinutes = 30
        return {
          k8s: () => {
            if (!chainId) {
              throw new Error(`process.env.CHAIN_ID not supplied`)
            }
            return {
              chainId: chainId ?? ChainId.PolygonLocal,
              performUpkeep: processEnv.PERFORM_UPKEEP === 'true',
              ilSigner: {
                [ChainId.PolygonStaging]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.PolygonLocal]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.PolygonMainnet]: {
                  // 0x26609bf74617015a12656EcFc51112D5a97d9A6c
                  privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
                },
                [ChainId.ArbitrumStaging]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumLocal]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumMainnet]: {
                  // 0x26609bf74617015a12656EcFc51112D5a97d9A6c
                  privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
                },
              },
              recurringPremiumBuyerBot: {
                enabled: false,
                intervalMinutes,
                signer: recurringPremiumBuyerBotSinger,
                coveredAmountUsdc,
                slippagePercentage,
              },
            }
          },
          local: () => ({
            chainId: chainId ?? ChainId.PolygonMainnet,
            performUpkeep: false,
            ilSigner: {
              [ChainId.PolygonStaging]: {
                impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
              },
              [ChainId.PolygonLocal]: {
                impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
              },
              [ChainId.PolygonMainnet]: {
                // 0x26609bf74617015a12656EcFc51112D5a97d9A6c
                privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
              },
              [ChainId.ArbitrumStaging]: {
                impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
              },
              [ChainId.ArbitrumLocal]: {
                impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
              },
              [ChainId.ArbitrumMainnet]: {
                // 0x26609bf74617015a12656EcFc51112D5a97d9A6c
                privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
              },
            },
            recurringPremiumBuyerBot: {
              enabled: false,
              intervalMinutes,
              signer: recurringPremiumBuyerBotSinger,
              coveredAmountUsdc,
              slippagePercentage,
            },
          }),
        }
      },
      'cvi-monitor': () => {
        const chainId = TV_SUPPORTED_CHAIN_IDS.find(c => c.toString() === processEnv.CHAIN_ID)

        const arbitrageBot: StrictOmit<ConfigByService['cvi-monitor']['arbitrageBot'], 'enabled'> = {
          depositUsdcToTv: 0.01,
          withdrawUsdcFromTvWhenAddressUsdcBalanceLessThan: 1,
          intervalMs: 1000 * 60 * 30, // 30m
          singer: {
            [ChainId.ArbitrumStaging]: {
              // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
              impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
            },
            [ChainId.ArbitrumLocal]: {
              // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
              impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
            },
            [ChainId.ArbitrumMainnet]: {
              // Cvi v3 Arbitrage Bot
              // 0x6D5646D8a7536EbA4Ef1fad41A408a603aA0E925
              privateKey: '3ec20a9e65777600159dd3c0e67b626f6c822beb3b774bde7ffdf625cb8379ac',
            },
          },
        }

        const chainLinkKeepersRegistryAddress: ConfigByService['cvi-monitor']['chainLinkKeepersRegistryAddress'] = {
          [ChainId.ArbitrumMainnet]: '0x75c0530885F385721fddA23C539AF3701d6183D4',
          [ChainId.PolygonMainnet]: '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B',
        }

        const chainLinkKeeperIds: ConfigByService['cvi-monitor']['chainLinkKeeperIds'] = {
          [ChainId.ArbitrumMainnet]: [
            '20198168252319728848760903952107283696236297951293825648637958790323057786550',
            '50018013766417637132435096458169271990890860399278336634759091738239353048133',
            '54076871737374261561092539699222305782496286421621941727275875392991188916993',
          ],
          [ChainId.PolygonMainnet]: [],
        }

        return {
          k8s: () => {
            if (!chainId) {
              throw new Error(`process.env.CHAIN_ID not supplied`)
            }
            const selectedChainId = chainId ?? ChainId.ArbitrumMainnet
            return {
              chainId: selectedChainId,
              performUpkeep: true, //selectedChainId !== ChainId.ArbitrumMainnet,
              monitor: selectedChainId === ChainId.ArbitrumMainnet,
              redis: k8sRedisInfo,
              signer: {
                [ChainId.ArbitrumStaging]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumLocal]: {
                  // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumMainnet]: {
                  // 0x26609bf74617015a12656EcFc51112D5a97d9A6c (cvi-and-il-keepers-bot)
                  privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
                },
              },
              arbitrageBot: {
                enabled: selectedChainId === ChainId.ArbitrumMainnet,
                ...arbitrageBot,
              },
              chainLinkKeepersRegistryAddress,
              chainLinkKeeperIds,
            }
          },
          local: () => {
            const selectedChainId = chainId ?? ChainId.ArbitrumMainnet
            return {
              chainId: selectedChainId,
              performUpkeep: true, // selectedChainId !== ChainId.ArbitrumMainnet,
              monitor: selectedChainId === ChainId.ArbitrumMainnet,
              redis: localRedisInfo,
              signer: {
                [ChainId.ArbitrumStaging]: {
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumLocal]: {
                  impersonatedPublicWalletAddress: '0xC44Bd81a08C1E8afcaAa959212FF1887Dd8C572f',
                },
                [ChainId.ArbitrumMainnet]: {
                  // 0x26609bf74617015a12656EcFc51112D5a97d9A6c (cvi-and-il-keepers-bot)
                  privateKey: 'a4e992ee063a084cfb5d66ae7b6c64eacc02ec65cc1d589710a35cc0b40ff075',
                },
              },
              arbitrageBot: {
                enabled: selectedChainId === ChainId.ArbitrumMainnet,
                ...arbitrageBot,
              },
              chainLinkKeepersRegistryAddress,
              chainLinkKeeperIds,
            }
          },
        }
      },
      'data-feed': () => () => ({}),
      'cvi-tweet': () => {
        return {
          k8s: () => ({
            twitter: {
              appKey: 'uOOrbXPUwOqjEwliykA1dGpdM',
              appSecret: 'UzsqwGS7f9uBuBCeAeoS9JZUBLWks1asjcuc7hCOr43GiSjk88',
              accessToken: '1595370375428427777-0bi9jx8MsQCCG20GxnphAXJO6FS6hP',
              accessSecret: 'BpsurzArfEk3LWiZ5FhpF3rdlfxU0oifG2GVmjl0XYNVN',
            },
            maxTweetsIn24hrs: 3,
            minMinutesBetweenTweets: 60,
            enableTweeting: false,
            telegramBot: {
              botToken: '5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo',
            },
            interestingTweets: [
              {
                enableTweetsInform: true,
                telegramChatId: '-845614110', // CVI team gets this in group
                // Tokens and phrases containing punctuation or special characters should be double-quoted (for example, url:"/developer"). Similarly, to match on a specific protocol, enclose in double-quotes
                searchTweets: [
                  { term: '"$CVI"' },
                  { term: '"$GOVI"' },
                  {
                    term: 'cvi volatility',
                    thresholds: {
                      retweet_count: 20,
                      like_count: 7,
                      quote_count: 10,
                    },
                  },
                  {
                    term: 'crypto volatility',
                    thresholds: {
                      retweet_count: 10,
                      like_count: 5,
                      quote_count: 10,
                    },
                  },
                  {
                    term: 'vix crypto',
                    thresholds: {
                      retweet_count: 10,
                      like_count: 20,
                      quote_count: 10,
                    },
                  },
                ],
              },
              {
                enableTweetsInform: true,
                telegramChatId: '-851549434', // Ami ONLY gets this in group
                // Tokens and phrases containing punctuation or special characters should be double-quoted (for example, url:"/developer"). Similarly, to match on a specific protocol, enclose in double-quotes
                searchTweets: [{ term: '"$MMY"' }],
              },
            ],
          }),
          local: () => ({
            twitter: {
              appKey: 'uOOrbXPUwOqjEwliykA1dGpdM',
              appSecret: 'UzsqwGS7f9uBuBCeAeoS9JZUBLWks1asjcuc7hCOr43GiSjk88',
              accessToken: '1595370375428427777-0bi9jx8MsQCCG20GxnphAXJO6FS6hP',
              accessSecret: 'BpsurzArfEk3LWiZ5FhpF3rdlfxU0oifG2GVmjl0XYNVN',
            },
            maxTweetsIn24hrs: 3,
            minMinutesBetweenTweets: 60,
            enableTweeting: true,
            telegramBot: {
              botToken: '5983817417:AAH7PodnASqYoIQC9KuTzWyD_b1ocfB-NIo',
            },
            interestingTweets: [
              {
                enableTweetsInform: false,
                telegramChatId: '212818068', // Only AMI gets this
                // Tokens and phrases containing punctuation or special characters should be double-quoted (for example, url:"/developer"). Similarly, to match on a specific protocol, enclose in double-quotes
                searchTweets: [{ term: '"$UNIDX"' }, { term: '"$MMY"' }, { term: '"$Geist"' }, { term: '"$DEUS"' }],
              },
            ],
          }),
        }
      },
    },
    ports: {
      [AppEnv.K8s]: {
        'data-feed': 80,
        'il-backend': 80,
        'cvi-backend': 80,
        'il-monitor': 80,
        'cvi-monitor': 80,
        'cvi-tweet': 80,
        'cvi-oracle-events-backend': 80,
        'chatgpt-server-wrapper': 80,
      },
      [AppEnv.Local]: {
        'data-feed': 8000,
        'il-backend': 8001,
        'il-monitor': 8002,
        'cvi-monitor': 8003,
        'cvi-backend': 8004,
        'cvi-tweet': 8005,
        'cvi-oracle-events-backend': 8006,
        'chatgpt-server-wrapper': 8007,
      },
    },
    k8sConfigBase64: `YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGNlcnRpZmljYXRlLWF1dGhv
    cml0eS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpRMEZVUlMwdExTMHRDazFKU1VNMWVr
    TkRRV01yWjBGM1NVSkJaMGxDUVVSQlRrSm5hM0ZvYTJsSE9YY3dRa0ZSYzBaQlJFRldUVkpOZDBW
    UldVUldVVkZFUlhkd2NtUlhTbXdLWTIwMWJHUkhWbnBOUWpSWVJGUkplVTFFWjNkT1JFVTFUWHBy
    TVU1R2IxaEVWRTE1VFVSbmQwMVVSVFZOZW1zeFRrWnZkMFpVUlZSTlFrVkhRVEZWUlFwQmVFMUxZ
    VE5XYVZwWVNuVmFXRkpzWTNwRFEwRlRTWGRFVVZsS1MyOWFTV2gyWTA1QlVVVkNRbEZCUkdkblJW
    QkJSRU5EUVZGdlEyZG5SVUpCVFV4UENrODNiemRxZVdOT2NHbG1aVmRtVERKVWNXbFhkbk5EUVVF
    NU9HYzBUbkJGV1dnM1RWSXZWR2hxUW1sRllVMUlUV0pxWVdOUmFsSmhOVEpLUWtSbVMza0tRVUpC
    V1ZKQ1NuZFlhMW81YVhOS2JpOWhaM3AwTVZKS1pFWlJUVzF5Y2xsRmVtbHhUemhQUTBsWFVrMWhS
    MU0yTlhoTVUwZDNaVFZwV2l0S2NVeHVlQXAzZGt0SGNuZElUbFkyY3pSWlkzUnJUVEI0UmtSWllV
    TXZaa2N3U1d4SVdsQlFVbTlVTHpKTGVUSnpjalZrY2poclZrNUZOblF3ZHpKcmIyRTBSSGhhQ25v
    M1JFbFRjR3g2WlZwMFZGbDZhbEUzY0RKbVNXcGthSGd2YzJwSWVUbEhaelV4SzJ4a2ExWXlOVFl6
    VGxGVGJIaENRVzV6UmtodlNsUnlhVzVpU0dZS1dHdFdNMGN6UW1KbVNsWXJXV015U2xSUGVDdFVZ
    VkowTkRjdlVscDNUQzk2V2xSMVVGTnlkMjQwU1V0aE1EbG1aRUZzWm10NFRYZ3dZMjlSWmpOeFNn
    cGtlSGRMYURGSFZYZGhZVlpwVmpCdk1rcHJRMEYzUlVGQllVNURUVVZCZDBSbldVUldVakJRUVZG
    SUwwSkJVVVJCWjB0clRVRTRSMEV4VldSRmQwVkNDaTkzVVVaTlFVMUNRV1k0ZDBoUldVUldVakJQ
    UWtKWlJVWkRiVXRYYzIxTlUySXhNVWRyYzFkV01Vb3dlVkpoYkVVMFdYVk5RVEJIUTFOeFIxTkpZ
    ak1LUkZGRlFrTjNWVUZCTkVsQ1FWRkJRMlpqYUZvdmJUTTFaM0UyYm1KU1VGTnRlQzl5TlVkR2Rt
    dEtOSEphWW1neWNsRldhamhPUVhWeFdGWXlhbkUwZWdwRWEzQjVkbkIxU25WcFkzaGFXbHBxV0hC
    SWJ6ZHVLMDlyV210aWJUVm1SWGxVUmtaRlYyc3dXa2RwZVNzdlMwMXBjMWRKVm1aMlFUUXJObHBY
    VWxSQkNsZHJSM05FVm5sak9IRjBNbVJFVFZweVNIVkZhVFVyVmtWdkswdDNWR1ZJYUN0WVZ6Z3JR
    VlZpTlZvM1MxaEhRazlZZWxaMGNVdG5OemhrV1dOSk5YUUtabWRwZGxsU1oxaDFUbXN6UTBsWE16
    SmxaRUpTZW1GRmNFOUxPRkZRWWxJdkwweHJXR280YkhSMVFqaEZUV1F2VlhOWVZYVTBUMW93WW1s
    UVpXUnpUUXBVY1dORFVXVmhNRU5GZGxrNVVVVjJhVU0xYTA1blVFaDVURUYzUzJScGEzUXljRmhD
    VmxSTFFrSndNeTlpUlhaRmJqVkJTWGxYTjA0eVdVOHlSbkZLQ2toT1dXZG9NakoxY25GeEsyZFli
    a3AzTlZJdlJqWkpZbGgwWkV0Nll6WnFTbUpQUkFvdExTMHRMVVZPUkNCRFJWSlVTVVpKUTBGVVJT
    MHRMUzB0Q2c9PQogICAgc2VydmVyOiBodHRwczovLzMyNTk4MTA1MTZGRTAwM0VGRDk1NjE2RDhC
    MDAxNTIzLmdyNy5ldS13ZXN0LTEuZWtzLmFtYXpvbmF3cy5jb20KICBuYW1lOiBhcm46YXdzOmVr
    czpldS13ZXN0LTE6NDUwNzA2MTE2OTg5OmNsdXN0ZXIvcHJkLTAxLWVrcy1jdmkKLSBjbHVzdGVy
    OgogICAgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGE6IExTMHRMUzFDUlVkSlRpQkRSVkpVU1Va
    SlEwRlVSUzB0TFMwdENrMUpTVU12YWtORFFXVmhaMEYzU1VKQlowbENRVVJCVGtKbmEzRm9hMmxI
    T1hjd1FrRlJjMFpCUkVGV1RWSk5kMFZSV1VSV1VWRkVSWGR3Y21SWFNtd0tZMjAxYkdSSFZucE5R
    alJZUkZSSmVVMUVaM2xPUkVFMFRWUk5kMDlXYjFoRVZFMTVUVVJuZVUxVVFUUk5WRTEzVDFadmQw
    WlVSVlJOUWtWSFFURlZSUXBCZUUxTFlUTldhVnBZU25WYVdGSnNZM3BEUTBGVFNYZEVVVmxLUzI5
    YVNXaDJZMDVCVVVWQ1FsRkJSR2RuUlZCQlJFTkRRVkZ2UTJkblJVSkJUV1Z5Q2tGb1YzWnpSSEZY
    TWxSaWNGaENlV1JHZFc5UGVHRXdNRVZMYW5wbldWUkVSU3RPVGxsVFEwOVdaSGQ1VldndmVEUTRM
    MjVYV2s5RE9VRkNPRWxJVDNZS2EwNVFSRWsxZEROTFRHODNiblZ4UTJaeGRVSktNVEZwWlhKcWJH
    cHViVnByYzBGRk4zUndZVVYzWWl0SllsTk1WRXd5WjNSNk1raG1jbXhGU1RsaFp3cGpiRGxWTXpC
    dVMweHVXVWRRUWpKQ2JUbFlSMlk1UzI0dlJtcERNMFpVYkRRMmRVdFdRM3BRZDFkMEszQTRZME16
    TjA5NmJWZHFWemx6UjB0MGJGZFhDbFpVU1RGeVpTODFWV1ZCTVVaWmN6RnJiVWxFUm0wMU1VdHBN
    MWxLVldWdGVqbHhSWG92TWpWTVZscHdWalpXTkVST2FsbzNURlZxTWxKeVNuUnNNRThLWkc5VlJY
    RkpVbU5UY1VkWU1tdHpPWEkxWjJGRU1WZHdjVzFpYTJJNWJtcHVNMUJyZDB4UVlXWjZWVlJpYW5O
    WVFsUjRkeXN5ZUhGUlNUVkRlRk5HWndwT1JFOHdOMGxuTlRGVGRXMXdlVFEzZDJ0VlEwRjNSVUZC
    WVU1YVRVWmpkMFJuV1VSV1VqQlFRVkZJTDBKQlVVUkJaMHRyVFVFNFIwRXhWV1JGZDBWQ0NpOTNV
    VVpOUVUxQ1FXWTRkMGhSV1VSV1VqQlBRa0paUlVaT1NWbHhaV3R0TDNGTWRrbHBVVnB5Ym1vdlJH
    ZHJWbk5QUkhSTlFsVkhRVEZWWkVWUlVVOEtUVUY1UTBOdGRERlpiVlo1WW0xV01GcFlUWGRFVVZs
    S1MyOWFTV2gyWTA1QlVVVk1RbEZCUkdkblJVSkJURm95Ukdzd1RUQkpSbWR5V21Wc05qRTRiZ3Ax
    Vmxwc2JEaHFRMncyVlhkT2IwbFVhbTFoZGxKTmFWaEtjMFJDUm5OT1dWWnpiemhUYVRaUVZFZGlZ
    V0ZKUld4MlFXaDBlbEF2U2toUlN6SkdZeXRPQ2xGSGJFczFlRGRpYzBZM1EzWkVVWEJTTDJGdFVH
    VldkVkZDY0VwTmRFcG1kRWxIUnpKS1oycHJUMGMwU2tZdmJYQXZhbmRLT1UxU1dFaGpOMWRFVmtR
    S01VUjZTMDFRU2twUGFFd3haa2RxVjJ4RWQyTXZUR3AwYWpNd1NYZEtibkZWTVZvM2NtVjFXbkZF
    U1dkbWNYSnJVVzl2WkU1TWJrUkNTVEp2T1Rsd1ZRcHdiRTlUWkV0WFoxWlpSV3h4WkhkaVduZHBj
    WGhWT0hoT2EzcEVUek5uVnl0SGMxSmxiVk5KVWtaNlZrZzNOVmg0V2pnMVZVVk1SbkJ3VkdkV2J6
    QjRDbGRPVERrMldHTjVMM2Q1Y1cxakt6WjNURll6WldKVlIzVlpNemRSWjJKemJrSTBjWHBHTjBG
    bmRqRjNVV2RhYW04d2JHNVFlVFJPVWtoVGNtbGpjR3dLYXpKclBRb3RMUzB0TFVWT1JDQkRSVkpV
    U1VaSlEwRlVSUzB0TFMwdENnPT0KICAgIHNlcnZlcjogaHR0cHM6Ly9rdWJlcm5ldGVzLmRvY2tl
    ci5pbnRlcm5hbDo2NDQzCiAgbmFtZTogZG9ja2VyLWRlc2t0b3AKY29udGV4dHM6Ci0gY29udGV4
    dDoKICAgIGNsdXN0ZXI6IGFybjphd3M6ZWtzOmV1LXdlc3QtMTo0NTA3MDYxMTY5ODk6Y2x1c3Rl
    ci9wcmQtMDEtZWtzLWN2aQogICAgdXNlcjogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjQ1MDcwNjEx
    Njk4OTpjbHVzdGVyL3ByZC0wMS1la3MtY3ZpCiAgbmFtZTogYXJuOmF3czpla3M6ZXUtd2VzdC0x
    OjQ1MDcwNjExNjk4OTpjbHVzdGVyL3ByZC0wMS1la3MtY3ZpCi0gY29udGV4dDoKICAgIGNsdXN0
    ZXI6IGRvY2tlci1kZXNrdG9wCiAgICB1c2VyOiBkb2NrZXItZGVza3RvcAogIG5hbWU6IGRvY2tl
    ci1kZXNrdG9wCmN1cnJlbnQtY29udGV4dDogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjQ1MDcwNjEx
    Njk4OTpjbHVzdGVyL3ByZC0wMS1la3MtY3ZpCmtpbmQ6IENvbmZpZwpwcmVmZXJlbmNlczoge30K
    dXNlcnM6Ci0gbmFtZTogYXJuOmF3czpla3M6ZXUtd2VzdC0xOjQ1MDcwNjExNjk4OTpjbHVzdGVy
    L3ByZC0wMS1la3MtY3ZpCiAgdXNlcjoKICAgIGV4ZWM6CiAgICAgIGFwaVZlcnNpb246IGNsaWVu
    dC5hdXRoZW50aWNhdGlvbi5rOHMuaW8vdjFiZXRhMQogICAgICBhcmdzOgogICAgICAtIC0tcmVn
    aW9uCiAgICAgIC0gZXUtd2VzdC0xCiAgICAgIC0gZWtzCiAgICAgIC0gZ2V0LXRva2VuCiAgICAg
    IC0gLS1jbHVzdGVyLW5hbWUKICAgICAgLSBwcmQtMDEtZWtzLWN2aQogICAgICBjb21tYW5kOiBh
    d3MKICAgICAgZW52OiBudWxsCiAgICAgIGludGVyYWN0aXZlTW9kZTogSWZBdmFpbGFibGUKICAg
    ICAgcHJvdmlkZUNsdXN0ZXJJbmZvOiBmYWxzZQotIG5hbWU6IGRvY2tlci1kZXNrdG9wCiAgdXNl
    cjoKICAgIGNsaWVudC1jZXJ0aWZpY2F0ZS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpR
    MEZVUlMwdExTMHRDazFKU1VSSmVrTkRRV2QxWjBGM1NVSkJaMGxKUTNOV0t6bEtTa3A2V1UxM1JG
    RlpTa3R2V2tsb2RtTk9RVkZGVEVKUlFYZEdWRVZVVFVKRlIwRXhWVVVLUVhoTlMyRXpWbWxhV0Vw
    MVdsaFNiR042UVdWR2R6QjVUV3BCTkUxcVVYZFBSRVY2VFVSc1lVWjNNSGxOZWtFMFRXcFJkMDlF
    UlRGTlZGSmhUVVJaZUFwR2VrRldRbWRPVmtKQmIxUkViazQxWXpOU2JHSlVjSFJaV0U0d1dsaEtl
    azFTYzNkSFVWbEVWbEZSUkVWNFNtdGlNazV5V2xoSmRGcHRPWGxNVjFKc0NtTXlkREJpTTBGM1oy
    ZEZhVTFCTUVkRFUzRkhVMGxpTTBSUlJVSkJVVlZCUVRSSlFrUjNRWGRuWjBWTFFXOUpRa0ZSUTIw
    NFFpdHlTR2R4WlhkeU9GSUtlR1Y0VkVwc1UwSXlOSHBxVmpWRWNEWnRTR05KZURncmNGRnZlRkZx
    YUV0aU1rbDNjbGRpTmxFclZVMUtTRE0yU0dkTk9HWjVRVFJ4Wm1sYVZHVjBMd3AwWms5UFprOUpX
    a2RaWWtvdk5WUllkemRZTWpoYVpraFhjSGRCUm10QlVtNDFjbGRuWVd0cGRVWnNlbUpHYkdSMFlU
    ZGFZamhTU1dObWRVNWxhMHd3Q2tabFZFWkVhM0ZPTWxWM09VMWpRbVJHWWxVeVpFeDJOWE5OWjJv
    NWNuZFdjMWczTkhnMWNTdDVZM3B3WjJKemNucExiVFJYVlhWVVpIY3ZVemd5UTFVS1ZXTm5WREZq
    Y1hBMFpWTjZaVWRuY0hwa2VIVk1jMGQ0VW1GYVkyUTNWR2h5Y25kVlpWZFBZV2RsTldkb0sxQkhV
    VUpwZVhwU05UQmhibXB5YVRNemVnb3lSREJPV0c1MWJDOVpOa1JrVVRSM2RVVmtMM3BwU25sc1FY
    cExXRXRxVDBOQ2RGRkdPVVJ5TjB4Qk5tRk1OSFZaVWk5R1EzWktNSFpDT1dnclEzSmtDakJTYlZw
    TFpubDZRV2ROUWtGQlIycFdha0pWVFVFMFIwRXhWV1JFZDBWQ0wzZFJSVUYzU1VadlJFRlVRbWRP
    VmtoVFZVVkVSRUZMUW1kbmNrSm5SVVlLUWxGalJFRnFRVTFDWjA1V1NGSk5Ra0ZtT0VWQmFrRkJU
    VUk0UjBFeFZXUkpkMUZaVFVKaFFVWk9TVmx4Wld0dEwzRk1ka2xwVVZweWJtb3ZSR2RyVmdwelQw
    UjBUVUV3UjBOVGNVZFRTV0l6UkZGRlFrTjNWVUZCTkVsQ1FWRkRWMGwzWTNjMlJtMVdhMUZ4Ulc0
    M2QyRjJSak12VGxrd1VUaE1NMncySzFSV0NtbGFVMHRSVjJwSE1raFVVMlowWVVkUFp5dFRXR2hW
    WnpKRmVHcDZlV0U1UmpacWVHeGFVbXhaUzFaTlNIcExTM2RIYnpsNlFVazBSR3N2Y1d4SE5uVUtS
    VEF3TkV4cVpVaE5hVWxRT1RkemJGaFdVbkZJV0VZNWQwbFpRMVJuTVZSQ2VXUTRPQ3RpYjBWNlJI
    aHRObmxyVjJGclVsSnZiblJwZEdVNGJFWm9OUXBMUWtKYU9VRlJjSG93VnpWaWVGZzJjelF3VFdS
    MWIwczJiVVpxTVhrMk5uRXpVVkI0ZW1oWmJVaDJkVUZHS3pOSVJTdGFNblptT0ZNNEwyaDFkbXN3
    Q2xaak9VRlBTbE5LYUZWQk5FMTJkMmxDVmtaS2NUUnJaREJrWlRGVVlUbE9WM1pUYmpSNk1UVlFO
    M0ppUkU5VVpXRnVWMmxwWnpWU2RtWndObGN3U2xNS1RuaFNXRGRUYm1wVU1VZEpWSE5MYjA5VlJU
    WkdNbWQ2UldkeGRIcHhRVmhsYUdka1FsRjZSblZHTm5relNWTTRRWEE1Y1FvdExTMHRMVVZPUkNC
    RFJWSlVTVVpKUTBGVVJTMHRMUzB0Q2c9PQogICAgY2xpZW50LWtleS1kYXRhOiBMUzB0TFMxQ1JV
    ZEpUaUJTVTBFZ1VGSkpWa0ZVUlNCTFJWa3RMUzB0TFFwTlNVbEZiM2RKUWtGQlMwTkJVVVZCY0ha
    QlpuRjRORXR1YzBzdlJXTlljMVY1V2xWblpIVk5OREZsVVRabGNHZ3pRMDFtVUhGVlMwMVZTVFJU
    YlRscENrMUxNVzByYTFCc1JFTlNPU3RvTkVSUVNEaG5UMHR1TkcxVk0zSm1OMWg2YW01NmFVZFNi
    VWQ1Wml0Vk1UaFBNVGwyUjFoNE1YRmpRVUphUVVWYUsyRUtNVzlIY0VseWFGcGpNbmhhV0dKWGRU
    SlhMMFZUU0VnM2FsaHdRemxDV0d0NFVUVkxhbVJzVFZCVVNFRllVbGN4VG01VE55dGlSRWxKTDJF
    NFJtSkdLd29yVFdWaGRuTnVUVFpaUnpkTE9IbHdkVVpzVEdzelkxQXdkazVuYkVaSVNVVTVXRXR4
    WlVocmN6Tm9iMHRqTTJOaWFUZENjMVZYYlZoSVpUQTBZVFk0Q2taSWJHcHRiMGgxV1VsbWFuaHJR
    Vmx6Y3pCbFpFZHdORFkwZERrNE9XYzVSRlkxTjNCbU1rOW5NMVZQVFV4b1NHWTROR2xqY0ZGTmVX
    eDViM3BuWjJJS1ZVSm1VVFlyZVhkUGJXa3JURzFGWm5oUmNubGtUSGRtV1dabmNUTmtSVnB0VTI0
    NGMzZEpSRUZSUVVKQmIwbENRVkZEUkZRdmFYQkpiVEZoUzI1blpncFpPU3RqU0Vaa01pdG9jMlJ5
    VVVOYVlucDBaemRQVDJvMVJFSmlVazl4UVdGd1RVUkdWRTFsWjNjclJtVkxURGRtYlZsMlZGSlJj
    MWhyTjJ4VlEzbENDbVppT1VObmNYUmhPRkZDWTI1clZWaFlObEZtZUdwUlRYQlNTakkwZDIxemEz
    azBOWE41TkRJeVIyNU5ZVUp5TTI5dVZWTktiRGwzVjFCQ01XWm5iSGtLWkVaS1MxTjNOa3dyTjFO
    RWIydElaRTV5YTJaU056Sm9SRGxUZFhKQ016QnZVbmRGUW5kd1QxSm1jbVJvVWtGSlRWRmlURTlQ
    V1hSc1NHbG1hbXRzVkFwNkwzVnlSMWRaZEhOQmEweENjV00zVVRBclNIRTRja1pzT1RCdmNXdG1a
    RzVPT0ZBNWRETmxTWGxDU1RsTFVsUkRTMFpQY2pWM1kxaFJkRkZ2TTJkSkNqWTBjRTlOTmt0bVQz
    RlVUWFZLU0RBNFNtNUdZa0ZtYlhCSVNHOW1URTVZVGpKcmJHTlNWVGhSUzJaM0sySmljazFFU0dk
    aUwzRnFjbW92U2tSNGVUTUtRVmNyYkZKMk9WcEJiMGRDUVUxVWNqRkRaR3c0YUd4V1MyUXpaMmd4
    TTJ0a2NIQlJlSGxvWm5KRmNURnlSR3BLVDFKNk0ybE9hSFpzZWtZM2FEQXJWQW92T1ZZdlVrWkhj
    bkZzWTNJcmRHOVhTbmxqTHpkcVpHSTNZbGxDWTBScWEwdDBlVzByYkRoMWRuTlJZVzlqWlU1S1Iw
    cFpUREJUWTFOdk5YSjZjMU5RQ2tWUE5UYzViSGhQUkZGeVdrSmFka3g1TUdGcVZEaExZV3RYWlM5
    RmExQmFOMGszZGtOTlJWVklhV1pTYUZkNVdsaEJVRkpzWVZsbVFXOUhRa0ZPYTBZS1psSnNRbFJ6
    UTNSYVRYTm5PVVJtTDJWdU4xYzBiVUZqZDNZNVRHNWhSRk4xVUdWVFMzTXpTM2NyY0ZweGMySmtj
    R3RyWVhwMWJpOXllVVY2ZEN0aU13cHNXSFZTZFdsQ01Ha3daVVp5WVZOYVJFbElNMGhHVEdsd1Rr
    aDZPR0ZGSzJsUWFtZHJWSFpvV0RsVFZVMUdOR1JFYUVOcE1YSXZXVGxEWjFVMVMzb3ZDbFYxWTFS
    R1JISXpSRkoxY25VMVdGTmhWVzF4WWtVNVpFVlRVR2hCUjBscVluUnNPVkp2TjNSQmIwZEJSemQy
    VXk4eFJpdFVWVGhRVUVjMU5EUnBTbWdLUTJNM1EyNWpPRXh3ZFVnM1VsZDNhRzVTUkVoMGVWQlJU
    MWR1WVZoeWVreFdWR2M1VjFCMFExaEdRMWhZWTNWek5pOTNNMEZ3YW5neU5scE5UbVJpT0FweGJV
    eG9PVVJJVkUxRE9VbENZVU01VGxKVFUxazJiRmhZYzA5VlRsWTJiekZqTW1wdWRFSnVVMlJZVXpC
    dFVtSldja1k1WkVSNmMzRmFNMmhhY1dvd0NtaG9WRzlQVEd0eGJtaFZSMGswZEdSNVJGQnRWR0ZW
    UTJkWlFqYzVjVzFzYTIxMGEyNWxZbFZNVFdWNlkwOW9UWEZZZGpOblNscFdPRFpDWm1FNU5tZ0tP
    RGhyYkdObGQwVTBhVVYwY0ZKQ1JqZzVNRGRTYjFOSWVEVTBSbVpYYWxObk9GRTBiemR0Ymt0b1Iz
    TXdiM1ZXWkZWNWJHWTNZVGhCYzJORU0zTXJid3B6WTFocU1saEhLelJOVEdORU1tRnZWa0YxY3pO
    RlZta3lPRkptYlZKNVIzZzFkMjV5YkZNM1pVcFpXRVl6UW5reGNtc3haME5wTlZGT00xTk5VVVY0
    Q214SFEwbGFVVXRDWjBjNGRFdE5iSGhtT0RaT1EwbG9iMlJaSzNsVlYwdEdPWGxTV0RSRVRTOU5U
    RlpMUWpOeE1rMUJZV0o0YVdsWFVEWTVkREpKUlRVS2RXeGxWVmw1U25CWUsxbGhWVkZETkdOaFpp
    dEZPVGRMU0drMWRFNUxTV1JqV25sS2MxTkNTMEkyYW5wR1VEaEpOa2h6UmpsU1RXdEJja2RLUlRa
    MFRBcHlNVGxOVDFjeEsyNDFjbVV4TW5aS1IwWndUR3R4YW5aVVFsUk9hM1JYVUVadFRIaExha2RW
    YldkSWFTOUlVSFZYTldoUENpMHRMUzB0UlU1RUlGSlRRU0JRVWtsV1FWUkZJRXRGV1MwdExTMHRD
    Zz09Cg==`,
    mysql: {
      host: 'prd-01-db-cvi.cbeazsamcoyd.eu-west-1.rds.amazonaws.com',
      port: 3306,
      username: 'stav',
      password: 'e061cabef8e7726c7d6',
      database: 'cvi_prod',
      entities: [path.join(__dirname, '..', 'database', 'entities', '**', '*.entity.*')],
    },
    zapper: {
      // 02e is ami@coti.io request for armadillo.is use
      // 520 is from Iva@embed.xyz request for NFT marketing campaign
      zapperApiKeys: ['02e37afb-40e4-4314-9b9e-5b6ce0b99a71', '530203e0-d9c1-4660-84ea-45800bcb8f5c'],
      // using rotating session type, see https://dashboard.smartproxy.com/residential-proxies/endpoints (more info in il-backend README.md)
      // proxy: {
      //   host: 'gate.smartproxy.com',
      //   port: 7000,
      //   auth: { username: 'user-cotiilcvi', password: 'chileK2901!15' },
      // },
    },
    sentry: {
      [AppEnv.K8s]: {
        enabled: true,
        debug: false,
        dsn: {
          'data-feed': 'https://3106fc74c655443b894221630c28d670@o1152131.ingest.sentry.io/6261535',
          'il-backend': 'https://1c075f344a374c8892597f9cbb49a629@o1152131.ingest.sentry.io/6261536',
          'il-monitor': 'https://6eb45703f2f24073aba4304d14498652@o1152131.ingest.sentry.io/6387442',
          'cvi-monitor': 'https://407d302353da4c29b622342f7da34415@o1152131.ingest.sentry.io/6647587',
          'cvi-backend': 'https://c3c1db9ce408458181dd1f38ada87fc7@o1152131.ingest.sentry.io/6695273',
          'cvi-tweet': 'https://068e2b7ae0bf4f63a70f3d402b6bd8ae@o1152131.ingest.sentry.io/4504208708206592',
          'cvi-oracle-events-backend':
            'https://d755fe5362f0443b9e26ee9d1c120b3b@o1152131.ingest.sentry.io/4504214681812992',
          'chatgpt-server-wrapper':
            'https://212c704d8a7443329945735217e65156@o1152131.ingest.sentry.io/4504484657758208',
        },
      },
      [AppEnv.Local]: {
        enabled: false,
        debug: true,
        dsn: {
          'data-feed': 'https://fake@lala.ingest.sentry.io/1',
          'il-backend': 'https://take@lolo.ingest.sentry.io/2',
          'il-monitor': 'https://take@lolo.ingest.sentry.io/3',
          'cvi-monitor': 'https://fake@lala.ingest.sentry.io/4',
          'cvi-backend': 'https://take@lolo.ingest.sentry.io/5',
          'cvi-tweet': 'https://take@lolo.ingest.sentry.io/6',
          'cvi-oracle-events-backend': 'https://take@lolo.ingest.sentry.io/7',
          'chatgpt-server-wrapper': 'https://take@lolo.ingest.sentry.io/8',
        },
      },
    },
  }
}
