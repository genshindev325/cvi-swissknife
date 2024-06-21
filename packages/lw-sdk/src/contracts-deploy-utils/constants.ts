import { BlockchainName, ChainId } from '../types'
import type { MainnetWhale, NamedAccount, USDPriceAggregator } from './types'

export const MIN_DEPLOYER_BALANCE = 0.2
export const HARDHAT_TEST_CHAIN_ID = '10000'
export const DEPLOYMENT_HISTORY_FILE_NAME = 'deployment-history.json'

export const DEPLOYERS_BY_CHAIN: {
  [key in BlockchainName]: string
} = {
  [BlockchainName.ETHEREUM]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
  [BlockchainName.POLYGON]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
  [BlockchainName.ARBITRUM]: '0x70ba42b4594ffff9e843275019fe99fbe0a9a0ff',
}

export const MAINNET_WHALES_BY_CHAIN: {
  [key in BlockchainName]: MainnetWhale[]
} = {
  [BlockchainName.POLYGON]: [
    {
      tokenName: 'USDC',
      tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      whaleAccount: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
    },
    {
      tokenName: 'USDT',
      tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      whaleAccount: '0xba12222222228d8ba445958a75a0704d566bf2c8',
    },
    {
      tokenName: 'GOVI',
      tokenAddress: '0x43df9c0a1156c96cea98737b511ac89d0e2a1f46',
      whaleAccount: '0x93337cce0f3f2e3236772859609d1bdcaeb8f5a9',
    },
    {
      tokenName: 'UNIV2GOVIETH',
      tokenAddress: '0x1dab41a0e410c25857f0f49b2244cd089ab88de6',
      whaleAccount: '0x00c04aa8debc509dec763ec5b32a31d4c72912e8',
    },
    {
      tokenName: 'UNIV2USDCCVOL-USDC-LONG',
      tokenAddress: '0x1dd0095a169e8398448a8e72f15a1868d99d9348',
      whaleAccount: '0xcf95a364b7580d752831b218cce9501ec91e1616',
    },
  ],
  [BlockchainName.ETHEREUM]: [
    {
      tokenName: 'USDC',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      whaleAccount: '0x28c6c06298d514db089934071355e5743bf21d60',
    },
    {
      tokenName: 'USDT',
      tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      whaleAccount: '0x5754284f345afc66a98fbb0a0afe71e0f007b949',
    },
    {
      tokenName: 'GOVI',
      tokenAddress: '0xeeaa40b28a2d1b0b08f6f97bb1dd4b75316c6107',
      whaleAccount: '0xcedad8c0ae5e0a878c01cc8c81e0ca2dba909ded',
    },
    {
      tokenName: 'SLP_COTIETH',
      tokenAddress: '0x717385e1a702f90b6eb8cd23150702ca7217b626',
      whaleAccount: '0xf9418ac29a9b08b5c9ea10f0d2cc8d9d607b67be',
    },
    {
      tokenName: 'SLP_GOVIETH',
      tokenAddress: '0x7e6782e37278994d1e99f1a5d03309b4b249d919',
      whaleAccount: '0x06d9d86b857023dd0b0dd7cf73e6f1aa4f768983',
    },
    {
      tokenName: 'UNIV2USDCETHVOL-USDC-LONG',
      tokenAddress: '0x197e99bd87f98dfde461afe3f706de36c9635a5d',
      whaleAccount: '0xcf95a364b7580d752831b218cce9501ec91e1616',
    },
  ],
  [BlockchainName.ARBITRUM]: [
    {
      tokenName: 'USDC',
      tokenAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      whaleAccount: '0x489ee077994b6658eafa855c308275ead8097c4a',
    },
    {
      tokenName: 'GOVI',
      tokenAddress: '0x07e49d5de43dda6162fa28d24d5935c151875283',
      whaleAccount: '0x628ea12fa98c4731ae8e67294977b1cc8eaf7161',
    },
    {
      tokenName: 'GOVIETH',
      tokenAddress: '0xc73d2191a1dd0a99b377272899a5569ed83f8cd8',
      whaleAccount: '0x70ba42b4594ffff9e843275019fe99fbe0a9a0ff',
    },
  ],
}

// add from here: https://data.chain.link/popular
export const USD_PRICE_AGGREGATORS_BY_CHAIN: {
  [chain in BlockchainName]: USDPriceAggregator<chain>
} = {
  [BlockchainName.POLYGON]: {
    WETH: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    USDC: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
    USDT: '0x0A6513e40db6EB1b165753AD52E80663aeA50545',
    DAI: '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
    WBTC: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
    LINK: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665',
    MATIC: '0xab594600376ec9fd91f8e885dadf0ce036862de0',
    BNB: '0x82a6c4af830caa6c97bb504425f6a66165c2c26e',
  },
  [BlockchainName.ETHEREUM]: {
    WETH: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    USDC: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    USDT: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
    DAI: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
    WBTC: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    LINK: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',
    MATIC: '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676',
    BNB: '0x14e613ac84a31f709eadbdf89c6cc390fdc9540a',
  },
  [BlockchainName.ARBITRUM]: {
    WETH: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
    USDC: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3',
    USDT: '0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7',
    DAI: '0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB',
    WBTC: '0x6ce185860a4963106506C203335A2910413708e9',
    LINK: '0x86E53CF1B870786351Da77A57575e79CB55812CB',
    BNB: '0x6970460aabf80c5be983c6b74e5d06dedca95d4a',
  },
}

const owner = {
  [ChainId.PolygonMainnet]: '0xAF51E83c5090eC95d7399fE0b5A77d59100C31D8',
  [ChainId.PolygonLocal]: '0xAF51E83c5090eC95d7399fE0b5A77d59100C31D8',
  [ChainId.PolygonStaging]: '0xAF51E83c5090eC95d7399fE0b5A77d59100C31D8',
  [ChainId.PolygonMumbai]: '0xc27FE978efCC2552E225E845CbAb8F14AdC1f7b6', // mumbai gnosis safe address
  [ChainId.ArbitrumLocal]: '0xbE32Abcd58272Da5254945031508D4EBFcbe92EF',
  [ChainId.ArbitrumStaging]: '0xbE32Abcd58272Da5254945031508D4EBFcbe92EF',
  [ChainId.ArbitrumMainnet]: `0xbE32Abcd58272Da5254945031508D4EBFcbe92EF`,
  [ChainId.EthereumLocal]: `0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF`,
  [ChainId.EthereumStaging]: `0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF`,
  [ChainId.EthereumMainnet]: `0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF`,
} as const

const oldOwner = '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD'

export const generateNamedAccounts = ({
  privateKey,
  deployerPrivateKey,
}: {
  privateKey?: string
  deployerPrivateKey?: string
}): {
  [account in NamedAccount]:
    | string
    | number
    | {
        [network in ChainId | 'default']?: string | number | null
      }
} => ({
  deployer: {
    default: 0,
    [ChainId.EthereumMainnet]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.EthereumStaging]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.EthereumLocal]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.PolygonMainnet]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.PolygonStaging]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.PolygonLocal]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.ArbitrumMainnet]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.ArbitrumStaging]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.ArbitrumLocal]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
    [ChainId.PolygonMumbai]: deployerPrivateKey ? `privatekey://${deployerPrivateKey}` : oldOwner,
  },
  owner: {
    default: 9,
    ...owner,
  },
  oldDeployer: {
    [ChainId.EthereumMainnet]: `0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD`,
    [ChainId.EthereumStaging]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
    [ChainId.EthereumLocal]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
    [ChainId.PolygonMainnet]: `0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD`,
    [ChainId.PolygonStaging]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
    [ChainId.PolygonLocal]: '0xCedAD8C0Ae5e0a878c01cC8c81E0Ca2DbA909deD',
    [ChainId.ArbitrumMainnet]: '0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF',
    [ChainId.ArbitrumStaging]: '0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF',
    [ChainId.ArbitrumLocal]: '0x70BA42b4594fFfF9e843275019Fe99FBE0A9a0FF',
  },
  oldOwner,
  alice: 1,
  bob: 2,
  mallory: 8,
  liquidityProvider: {
    default: 3,
    [ChainId.PolygonMainnet]: `0x12bb75E5938f3d2F11F0ad46B768a7a1B262674a`,
    [ChainId.PolygonLocal]: `0x12bb75E5938f3d2F11F0ad46B768a7a1B262674a`,
    [ChainId.PolygonStaging]: '0x12bb75E5938f3d2F11F0ad46B768a7a1B262674a',
    [ChainId.ArbitrumLocal]: '0xB7757a307d86537299a5972d363cc2d2ae49394f',
    [ChainId.ArbitrumStaging]: '0xB7757a307d86537299a5972d363cc2d2ae49394f',
    [ChainId.ArbitrumMainnet]: `0xB7757a307d86537299a5972d363cc2d2ae49394f`,
  },
  costa: '0x72B31859c516947cE37A13bf0e6d4AD51d151A8e',
  protectionBuyer: 4,
  liquidityWithdrawnToAccount: 5,
  minter: 6,
  upkeeper: 7,
  treasury: {
    default: 10,
    ...owner,
  },
  privateKey: privateKey ? `privatekey://${privateKey}` : owner,
})
