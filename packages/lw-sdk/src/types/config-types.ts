export enum NetworkName {
  Staging = 'staging',
  Mainnet = 'live',
  Local = 'dev',
  Testnet = 'testnet',
}

export enum BlockchainName {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
}

export const cviHistoryGroupBy = ['day', 'hour', 'minutes'] as const
export type CviHistoryGroupBy = typeof cviHistoryGroupBy[number]

export const cviChartType = ['normal', 'ohlc'] as const
export type CviChartType = typeof cviChartType[number]

export type TheGraphGraph = 'platformGraph'

export type BackendInversifyConfig = {
  zapper: {
    zapperApiKeys: string[]
    proxy?: { host: string; port: number; auth?: { username: string; password: string } }
  }
}

export enum ChainId {
  EthereumMainnet = '1',
  PolygonMainnet = '137',
  ArbitrumMainnet = '42161',
  EthereumStaging = '31337',
  PolygonStaging = '31338',
  ArbitrumStaging = '31339',
  EthereumLocal = '31137',
  PolygonLocal = '31138',
  ArbitrumLocal = '31139',
  PolygonMumbai = '80001',
}

export type ChainsInfo = {
  [ChainId.PolygonMumbai]: {
    hardhatConfigNetworkName: 'PolygonMumbai'
    networkName: NetworkName.Testnet
    chainId: ChainId.PolygonMumbai
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
  }
  [ChainId.EthereumMainnet]: {
    hardhatConfigNetworkName: 'EthereumMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.EthereumMainnet
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
    wssUrl: string
  }
  [ChainId.PolygonMainnet]: {
    hardhatConfigNetworkName: 'PolygonMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.PolygonMainnet
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
    backendUrls: {
      ilBackend: string
    }
    wssUrl: string
  }
  [ChainId.ArbitrumMainnet]: {
    hardhatConfigNetworkName: 'ArbitrumMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.ArbitrumMainnet
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
    backendUrls: {
      ilBackend: string
    }
    wssUrl: string
  }
  [ChainId.EthereumStaging]: {
    hardhatConfigNetworkName: 'EthereumStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.EthereumStaging
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'EthereumMainnet'
  }
  [ChainId.PolygonStaging]: {
    hardhatConfigNetworkName: 'PolygonStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.PolygonStaging
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName: 'PolygonMainnet'
    backendUrls: {
      ilBackend: string
    }
  }
  [ChainId.ArbitrumStaging]: {
    hardhatConfigNetworkName: 'ArbitrumStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.ArbitrumStaging
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName: 'ArbitrumMainnet'
    backendUrls: {
      ilBackend: string
    }
  }
  [ChainId.EthereumLocal]: {
    hardhatConfigNetworkName: 'EthereumLocal'
    networkName: NetworkName.Local
    chainId: ChainId.EthereumLocal
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'EthereumMainnet'
  }
  [ChainId.PolygonLocal]: {
    hardhatConfigNetworkName: 'PolygonLocal'
    networkName: NetworkName.Local
    chainId: ChainId.PolygonLocal
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'PolygonMainnet'
    backendUrls: {
      ilBackend: string
    }
  }
  [ChainId.ArbitrumLocal]: {
    hardhatConfigNetworkName: 'ArbitrumLocal'
    networkName: NetworkName.Local
    chainId: ChainId.ArbitrumLocal
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'ArbitrumMainnet'
    backendUrls: {
      ilBackend: string
    }
  }
}

export type ChainInfo = ChainsInfo[ChainId]

export const CHAIN_IDS_INFO: ChainsInfo = {
  [ChainId.PolygonMumbai]: {
    hardhatConfigNetworkName: 'PolygonMumbai',
    networkName: NetworkName.Testnet,
    chainId: ChainId.PolygonMumbai,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/k9EduLRWPNpVoKY-P_PZ4MBHx3804WHj',
    deployAndForkRpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/k9EduLRWPNpVoKY-P_PZ4MBHx3804WHj',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
  },
  [ChainId.EthereumMainnet]: {
    hardhatConfigNetworkName: 'EthereumMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.EthereumMainnet,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/2o-x6REiw96Bw1noK6KFJbMZKkKWLf8t',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/2o-x6REiw96Bw1noK6KFJbMZKkKWLf8t',
    blockExplorerUrl: 'https://etherscan.com',
    wssUrl: 'wss://polygon-mainnet.g.alchemy.com/v2/2o-x6REiw96Bw1noK6KFJbMZKkKWLf8t',
  },
  [ChainId.PolygonMainnet]: {
    hardhatConfigNetworkName: 'PolygonMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.PolygonMainnet,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    // https://dashboard.alchemyapi.io/apps/t2xirbr9i39lk2dx
    cviRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/92NxyTyKRdmDaXT61GaVbcDBpkRpLOPc',
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/92NxyTyKRdmDaXT61GaVbcDBpkRpLOPc',
    blockExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
    backendUrls: {
      ilBackend: 'https://il-backend-polygon-mainnet.cvi-team.com',
      // ilBackend: 'http://localhost:8001',
    },
    wssUrl: 'wss://polygon-mainnet.g.alchemy.com/v2/92NxyTyKRdmDaXT61GaVbcDBpkRpLOPc',
  },
  [ChainId.ArbitrumMainnet]: {
    hardhatConfigNetworkName: 'ArbitrumMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.ArbitrumMainnet,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    // cviRpcUrl: 'https://arbitrum-mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
    cviRpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/UOKZ89ZJLc1k-VKPVWZtTPgWPNDa9xbB',
    deployAndForkRpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
    backendUrls: {
      ilBackend: 'il-backend-arbitrum-staging.cvi-team.com',
    },
    wssUrl: 'wss://arb-mainnet.g.alchemy.com/v2/UOKZ89ZJLc1k-VKPVWZtTPgWPNDa9xbB',
  },
  [ChainId.EthereumStaging]: {
    hardhatConfigNetworkName: 'EthereumStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.EthereumStaging,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-ethereum.cvi-team.com',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/2o-x6REiw96Bw1noK6KFJbMZKkKWLf8t',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'EthereumMainnet',
  },
  [ChainId.PolygonStaging]: {
    hardhatConfigNetworkName: 'PolygonStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.PolygonStaging,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-polygon.cvi-team.com',
    // https://dashboard.alchemyapi.io/apps/2j8v2prx4rgy8uth
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/ZzUIah9CzJBkgXQDDnZcJT_1UFdVvnVR',
    blockExplorerUrl: 'https://matic.network',
    forkContractsNetworkName: 'PolygonMainnet',
    backendUrls: {
      ilBackend: 'https://il-backend-polygon-mainnet.cvi-team.com',
    },
  },
  [ChainId.ArbitrumStaging]: {
    hardhatConfigNetworkName: 'ArbitrumStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.ArbitrumStaging,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-arbitrum.cvi-team.com',
    deployAndForkRpcUrl: 'https://arbitrum-mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
    blockExplorerUrl: 'https://arbiscan.io',
    forkContractsNetworkName: 'ArbitrumMainnet',
    backendUrls: {
      ilBackend: 'il-backend-arbitrum-staging.cvi-team.com',
    },
  },
  [ChainId.EthereumLocal]: {
    hardhatConfigNetworkName: 'EthereumLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.EthereumLocal,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8545',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/2o-x6REiw96Bw1noK6KFJbMZKkKWLf8t',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'EthereumMainnet',
  },
  [ChainId.PolygonLocal]: {
    hardhatConfigNetworkName: 'PolygonLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.PolygonLocal,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8546',
    // https://dashboard.alchemyapi.io/apps/2j8v2prx4rgy8uth
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/D_9R5nmJbhOlPsCRh5_WsL5vRqVcb73r',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'PolygonMainnet',
    backendUrls: {
      ilBackend: 'https://il-backend-polygon-mainnet.cvi-team.com',
      // ilBackend: 'http://localhost:8001', // il-backend localy
    },
  },
  [ChainId.ArbitrumLocal]: {
    hardhatConfigNetworkName: 'ArbitrumLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.ArbitrumLocal,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8547',
    deployAndForkRpcUrl: 'https://arbitrum-mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'ArbitrumMainnet',
    backendUrls: {
      ilBackend: 'il-backend-arbitrum-staging.cvi-team.com',
    },
  },
}

// chain ids that are supported by the infrastructure
export const IL_SUPPORTED_CHAIN_IDS = [ChainId.PolygonStaging, ChainId.PolygonLocal, ChainId.PolygonMainnet] as const
export type IlSupportedChainIds = typeof IL_SUPPORTED_CHAIN_IDS[number]

export const TV_SUPPORTED_CHAIN_IDS = [ChainId.ArbitrumStaging, ChainId.ArbitrumLocal, ChainId.ArbitrumMainnet] as const
export type TvSupportedChainIds = typeof TV_SUPPORTED_CHAIN_IDS[number]

export const VESTING_SUPPORTED_CHAIN_IDS = [ChainId.ArbitrumStaging, ChainId.ArbitrumLocal] as const
export type VestingSupportedChainIds = typeof VESTING_SUPPORTED_CHAIN_IDS[number]

export const CVI_SUPPORTED_CHAIN_IDS = [...new Set([...IL_SUPPORTED_CHAIN_IDS, ...TV_SUPPORTED_CHAIN_IDS])] as const
export type CVISupportedChainIds = IlSupportedChainIds | TvSupportedChainIds

// blockchain names that are supported by the infrastructure
export const IL_SUPPORTED_BLOCKCHAIN_NAMES = [BlockchainName.POLYGON] as const
export type IlSupportedBlockchainNames = typeof IL_SUPPORTED_BLOCKCHAIN_NAMES[number]

export const TV_SUPPORTED_BLOCKCHAIN_NAMES = [BlockchainName.ARBITRUM] as const
export type TvSupportedBlockchainNames = typeof TV_SUPPORTED_BLOCKCHAIN_NAMES[number]

export const VESTING_SUPPORTED_BLOCKCHAIN_NAMES = [BlockchainName.ARBITRUM] as const
export type VestingSupportedBlockchainNames = typeof VESTING_SUPPORTED_BLOCKCHAIN_NAMES[number]

export const CVI_SUPPORTED_BLOCKCHAIN_NAMES = [
  ...new Set([...IL_SUPPORTED_BLOCKCHAIN_NAMES, ...TV_SUPPORTED_BLOCKCHAIN_NAMES]),
] as const
export type CVISupportedBlockchainNames = IlSupportedBlockchainNames | TvSupportedBlockchainNames

export const HARDHAT_SUPPORTED_NETWORK_NAMES = [NetworkName.Local, NetworkName.Staging] as const
export type HardhatSupportedNetworkNames = typeof HARDHAT_SUPPORTED_NETWORK_NAMES[number]

export const HARDHAT_SUPPORTED_CHAIN_IDS = [
  ChainId.PolygonStaging,
  ChainId.PolygonLocal,
  ChainId.ArbitrumStaging,
  ChainId.ArbitrumLocal,
  ChainId.EthereumStaging,
  ChainId.EthereumLocal,
] as const
export type HardhatSupportedChainIds = typeof HARDHAT_SUPPORTED_CHAIN_IDS[number]

type INVALIDATION_KEY_SCHEME = {
  [chainId in ChainId]: {
    'cvi-oracle-events-group': `cvi-oracle-events-group::${chainId}::${typeof CHAIN_IDS_INFO[chainId]['blockchainName']}::0`
    'latest-block-number': `latest-block-number::${chainId}::${typeof CHAIN_IDS_INFO[chainId]['blockchainName']}::0`
    'general-info-of-event-from-block': `general-info-of-event-from-block::${chainId}::${typeof CHAIN_IDS_INFO[chainId]['blockchainName']}::0`
    'general-info-of-event-by-address': `general-info-of-event-by-address::${chainId}::${typeof CHAIN_IDS_INFO[chainId]['blockchainName']}::0`
  }
}

export type RedisInvalidationKeysName = keyof INVALIDATION_KEY_SCHEME[ChainId]
export type RedisInvalidationKeysValue = INVALIDATION_KEY_SCHEME[ChainId][RedisInvalidationKeysName]

export const REDIS_INVALIDATION_KEY_BY_CHAIN_ID = CVI_SUPPORTED_CHAIN_IDS.reduce((acc, curr) => {
  return {
    ...acc,
    [curr]: {
      'cvi-oracle-events-group': `cvi-oracle-events-group::${CHAIN_IDS_INFO[curr].chainId}::${CHAIN_IDS_INFO[curr].blockchainName}::0`,
      'latest-block-number': `latest-block-number::${CHAIN_IDS_INFO[curr].chainId}::${CHAIN_IDS_INFO[curr].blockchainName}::0`,
      'general-info-of-event-from-block': `general-info-of-event-from-block::${CHAIN_IDS_INFO[curr].chainId}::${CHAIN_IDS_INFO[curr].blockchainName}::0`,
      'general-info-of-event-by-address': `general-info-of-event-by-address::${CHAIN_IDS_INFO[curr].chainId}::${CHAIN_IDS_INFO[curr].blockchainName}::0`,
    },
  }
}, {} as Record<ChainId, Record<RedisInvalidationKeysName, RedisInvalidationKeysValue>>)
