import { roundCryptoValueString } from './util'

/* 
 
  calculateIL returns the IL based on the 2 tokens entry/exit prices. Returns exactly as https://dailydefi.org/tools/impermanent-loss-calculator/
  but it returns ratio instead of percent. i.e: 5.43% IL percent is returned as ratio - e.g: 0.0543

  token1EntryPrice 1964
  token2EntryPrice 1
  token1EndPrice 1000
  token2EndPrice 1
  ------------------------
  calculateIL - 0.0543 
*/
export function calculateIL(
  token1EntryPrice: number,
  token2EntryPrice: number,
  token1EndPrice: number,
  token2EndPrice: number,
  options?: {
    useToFixed?: boolean
  },
) {
  const rt1 = token1EntryPrice / token2EntryPrice
  const rt2 = token1EndPrice / token2EndPrice
  const p = rt1 / rt2

  return parseFloat(roundCryptoValueString((1 - 2 * (Math.sqrt(p) / (p + 1))).toString(), 4, options))
}

export function calcEstimatedAmountToBePaid(
  lpTokensWorthAtBuyTimeUSD: number,
  expectedLPTokensValueGrowth: number,
  impermanentLoss: number,
) {
  const estimatedTokensWorthAtEnd = lpTokensWorthAtBuyTimeUSD * expectedLPTokensValueGrowth

  return estimatedTokensWorthAtEnd / (1 - impermanentLoss) - estimatedTokensWorthAtEnd
}
