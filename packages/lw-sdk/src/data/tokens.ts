import { BlockchainName, tokenDecimals, TokenName } from '../types'

export type InteractableTokenName = TokenName.USDC | TokenName.GOVI | TokenName.CVI | TokenName.LINK

export type TokenData<T extends TokenName> = {
  name: InteractableTokenName
  symbol: T
  decimals: number
}

export const interactableTokens: { [tokenName in InteractableTokenName]: TokenData<tokenName> } = {
  [TokenName.USDC]: {
    name: TokenName.USDC,
    symbol: TokenName.USDC,
    decimals: tokenDecimals[TokenName.USDC],
  },
  [TokenName.GOVI]: {
    name: TokenName.GOVI,
    symbol: TokenName.GOVI,
    decimals: tokenDecimals[TokenName.GOVI],
  },
  [TokenName.CVI]: {
    name: TokenName.CVI,
    symbol: TokenName.CVI,
    decimals: tokenDecimals[TokenName.CVI],
  },
  [TokenName.LINK]: {
    name: TokenName.LINK,
    symbol: TokenName.LINK,
    decimals: tokenDecimals[TokenName.LINK],
  },
}

export const tokenAddresses = {
  [BlockchainName.ETHEREUM]: {
    [TokenName.WETH]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [TokenName.USDC]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [TokenName.DAI]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    [TokenName.USDT]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    [TokenName.GOVI]: '0xeEAA40B28A2d1b0B08f6f97bB1DD4B75316c6107',
    [TokenName.LINK]: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    [TokenName.WBTC]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  [BlockchainName.POLYGON]: {
    [TokenName.WMATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    [TokenName.USDC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    [TokenName.DAI]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    [TokenName.USDT]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    [TokenName.GOVI]: '0x43Df9c0a1156c96cEa98737b511ac89D0e2A1F46',
    [TokenName.LINK]: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
    [TokenName.WBTC]: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    [TokenName.WETH]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  [BlockchainName.ARBITRUM]: {
    [TokenName.WETH]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    [TokenName.USDC]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    [TokenName.DAI]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    [TokenName.USDT]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    [TokenName.GOVI]: '0x07E49d5dE43DDA6162Fa28D24d5935C151875283',
    [TokenName.LINK]: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    [TokenName.WBTC]: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  },
} as const

export const NATIVE_TOKEN_BY_CHAIN = {
  [BlockchainName.ETHEREUM]: { symbol: TokenName.ETH, wrapped: TokenName.WETH },
  [BlockchainName.POLYGON]: { symbol: TokenName.MATIC, wrapped: TokenName.WMATIC },
  [BlockchainName.ARBITRUM]: { symbol: TokenName.ETH, wrapped: TokenName.WETH },
} as const

export type TokensPerBlockchain = {
  [chain in BlockchainName]: keyof typeof tokenAddresses[chain] | typeof NATIVE_TOKEN_BY_CHAIN[chain]['symbol']
}
