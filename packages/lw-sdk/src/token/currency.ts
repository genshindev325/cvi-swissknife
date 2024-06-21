import { NATIVE_TOKEN_BY_CHAIN, tokenAddresses } from '../data'
import type { TokensPerBlockchain } from '../data'
import type { BlockchainName, TokenName } from '../types'
import { tokenDecimals } from '../types'
import { BaseCurrency } from './base'

export class TokenCurrency extends BaseCurrency {
  public isNative = () => false
}

export class NativeCurrency extends BaseCurrency {
  constructor(public readonly wrappedToken: TokenCurrency, symbol: string, decimals: number) {
    super(wrappedToken.address, symbol, decimals)
  }

  public isNative = (): this is NativeCurrency => true
}

export type Currency = TokenCurrency | NativeCurrency

export type CurrencyName<B extends BlockchainName> = TokensPerBlockchain[B]

export type ValidCurrency = CurrencyName<BlockchainName>

export const getTokenCurrencies = <B extends BlockchainName>(
  blockchainName: B,
): Record<CurrencyName<B>, TokenCurrency> => {
  const addresses = tokenAddresses[blockchainName] as Record<TokenName, string>
  const tokenCurrencies: Record<string, TokenCurrency> = {}
  for (const token of Object.keys(addresses) as TokenName[]) {
    const tokenAddress = addresses[token]
    const decimals = tokenDecimals[token]
    tokenCurrencies[token] = new TokenCurrency(tokenAddress, token, decimals)
  }
  return tokenCurrencies
}

export const getNative = <B extends BlockchainName>(
  blockchainName: B,
  tokenCurrencies: Record<string, Currency>,
): NativeCurrency => {
  const { symbol, wrapped } = NATIVE_TOKEN_BY_CHAIN[blockchainName]
  const wrappedCurrency = tokenCurrencies[wrapped]
  if (wrappedCurrency.isNative()) {
    throw new Error(`[${blockchainName}] wrapped currency cannot be native - ${wrappedCurrency}`)
  }
  return new NativeCurrency(wrappedCurrency, symbol, tokenDecimals[symbol])
}

export const getCurrencies = <B extends BlockchainName>(blockchainName: B): Record<CurrencyName<B>, Currency> => {
  const tokenCurrencies: Record<string, Currency> = getTokenCurrencies(blockchainName)
  const native = getNative(blockchainName, tokenCurrencies)
  tokenCurrencies[native.symbol] = native
  return tokenCurrencies
}
