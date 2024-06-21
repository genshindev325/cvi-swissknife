import type { ArmadilloSupportedPair } from '../types'
import { IL_TOKEN_NAME_ORDER, ArmadilloSupportedTokenName } from '../types'
import { TokenName } from '../types'

export function fixTokenName(tokenName: Exclude<TokenName, TokenName.CVI>): ArmadilloSupportedTokenName {
  if (tokenName === TokenName.WMATIC) {
    return ArmadilloSupportedTokenName.MATIC
  }
  if (tokenName === TokenName.ETH) {
    return ArmadilloSupportedTokenName.WETH
  }
  const r = Object.values(ArmadilloSupportedTokenName).find(t => t.toString() === tokenName.toString())
  if (r) {
    return r
  }
  throw new Error(`Unsupported token name in Armadillo: ${tokenName}`)
}

export function sortTokens({ tokenName1, tokenName2 }: ArmadilloSupportedPair): ArmadilloSupportedPair {
  if (
    tokenName2 === ArmadilloSupportedTokenName.WBTC ||
    tokenName2 === ArmadilloSupportedTokenName.WETH ||
    tokenName1 === ArmadilloSupportedTokenName.USDC ||
    tokenName1 === ArmadilloSupportedTokenName.USDT ||
    tokenName1 === ArmadilloSupportedTokenName.DAI
  ) {
    return {
      tokenName1: tokenName2,
      tokenName2: tokenName1,
    }
  }

  return {
    tokenName1,
    tokenName2,
  }
}

export function sortPairs(pairs: ArmadilloSupportedPair[]): ArmadilloSupportedPair[] {
  return pairs
    .map(sortTokens)
    .sort(
      (p1, p2) =>
        Math.max(IL_TOKEN_NAME_ORDER[p2.tokenName1], IL_TOKEN_NAME_ORDER[p2.tokenName2]) -
        Math.max(IL_TOKEN_NAME_ORDER[p1.tokenName1], IL_TOKEN_NAME_ORDER[p1.tokenName2]),
    )
}
