import type { ChainId, ITokenName, TokenName } from '../types'

export const MAX_THE_GRAPH_RESPONSE_LENGTH = 1000

export type UniswapSwapRawResult = {
  id: string
  pairAddress: string
  date: number // epoch seconds
  reserve0: string // it's number
  reserve1: string // it's number
  token0: {
    id: string
    symbol: TokenName
  }
  token1: {
    id: string
    symbol: TokenName
  }
}

export type TokenInfo = {
  id: string
  symbol: ITokenName
}

export type UniswapToken = {
  symbol: TokenName
}

export type UniswapPair = {
  id: string
  token0: UniswapToken
  token1: UniswapToken
}

export type UniswapResponse = {
  data: {
    pairs: UniswapPair[]
  }
}

export type ParsedUniswapV2TokenData = {
  id: string
  symbol: string
  // name: string
  decimals: number
  // totalSupply: number
  // tradeVolume: number
  // tradeVolumeUSD: number
  // untrackedVolumeUSD: number
  // txCount: number
  // totalLiquidity: number
  // derivedETH: number
}

export type ParsedUniswapV2PairData = {
  dex: 'uniswap-v2'
  chainId: ChainId
  id: string
  token0: ParsedUniswapV2TokenData
  token1: ParsedUniswapV2TokenData
  reserve0: number
  reserve1: number
  // totalSupply: number
  // reserveETH: number
  reserveUSD: number
  // trackedReserveETH: number
  token0Price: number
  token1Price: number
  // volumeToken0: number
  // volumeToken1: number
  volumeUSD: number
  // untrackedVolumeUSD: number
  txCount: number
  createdAtTimestamp: number
  createdAtTimestampUtc: string
  // createdAtBlockNumber: number
  liquidityProviderCount: number
}

export type ParsedUniswapV3TokenData = {
  id: string
  symbol: string
  decimals: number
}

export type ParsedUniswapV3PairData = {
  dex: 'uniswap-v3'
  chainId: ChainId
  id: string
  token0: ParsedUniswapV3TokenData
  token1: ParsedUniswapV3TokenData
  createdAtTimestamp: number
  createdAtTimestampUtc: string
  createdAtBlockNumber: number
  liquidity: number
  token0Price: number
  token1Price: number
  tick: number
  observationIndex: number
  volumeToken0: number
  volumeToken1: number
  volumeUSD: number
  feesUSD: number
  collectedFeesToken0: number
  collectedFeesToken1: number
  collectedFeesUSD: number
  totalValueLockedToken0: number
  totalValueLockedToken1: number
  totalValueLockedUSD: number
  liquidityProviderCount: number
}

export type PairFromDex = ParsedUniswapV2PairData | ParsedUniswapV3PairData
