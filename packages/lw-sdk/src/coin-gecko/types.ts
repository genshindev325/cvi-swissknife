import type { IArmadilloSupportedTokenName } from '../types'

export type CoinGeckoDailyTokenPrice = {
  dateMs: number
  priceUsd: number
}

export type WorstIlPointInTime = { dateUtc: string; dateMs: number; token1PriceUsd: number; token2PriceUsd: number }

export type WorstIlOfTokenByCoinGeko = {
  id: string
  coinGeckoToken1Id: string
  token1Name: IArmadilloSupportedTokenName
  coinGeckoToken2Id: string
  token2Name: IArmadilloSupportedTokenName
  start: WorstIlPointInTime
  end: WorstIlPointInTime
  worstIlPercentage: number
}
