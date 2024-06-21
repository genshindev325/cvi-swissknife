interface PremiumParamsFeed {
  input: PremiumParamsInput
  expectedPremium: number
}

interface PremiumParamsInput {
  lpTokensWorthAtBuyTimeUSD: number
  totalLPTokensWorthAtBuyTimeUSD: number
  expectedLPTokensValueGrowth: number
  liquidity: number
  impermanentLoss: number
  A: number
  X0: number
  C: number
  cvi: number
  premiumGrowthStart: number
  premiumSlope: number
}

export const premiumParamsFeed: PremiumParamsFeed[] = [
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 0,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 3.1,
      premiumSlope: 2,
    },
    expectedPremium: 54.32838,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 10000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 54.36699,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 50000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 54.67716,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 150000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 56.85801,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 300000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 64.45005,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 420000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 3.1,
      premiumSlope: 1,
    },
    expectedPremium: 64.92998,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 450000, // Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.0000000587,
      X0: 119.0353983,
      C: 0.005411564825,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 79.14043,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 360000, // 30 Days, medium CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.000000374,
      X0: 116.5444497,
      C: 0.009630158786,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 124.14332,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 715000, // 30 Days, Higher CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: 0.000000374,
      X0: 116.5444497,
      C: 0.009630158786,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 247.77061,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 10000,
      totalLPTokensWorthAtBuyTimeUSD: 0, // 60 Days, Zero CR
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 212.85621, // 2.12%
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 500000,
      totalLPTokensWorthAtBuyTimeUSD: 1000000, // 60 Days, TVP goes above Liquidity
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 100,
      premiumGrowthStart: 2.212,
      premiumSlope: 1,
    },
    expectedPremium: 10949.78128,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 100, // 60 Days, premium should be ~equivalent to the above test since the cr is ~ the same
      totalLPTokensWorthAtBuyTimeUSD: 1500000,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 2.21543, // 2.21%
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 100, // 60 Days, High CVI
      totalLPTokensWorthAtBuyTimeUSD: 1500000,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 140,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 2.12146,
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 100, // 60 Days, Low CVI
      totalLPTokensWorthAtBuyTimeUSD: 1500000,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 63,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 2.42364, // 2.42%
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 100, // 60 Days, High CVI
      totalLPTokensWorthAtBuyTimeUSD: 1500000,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 1000000,
      impermanentLoss: 0.1,
      A: 0.000000409,
      X0: 147.594197,
      C: 0.02035911371,
      cvi: 173,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 2.14648, // 2.146%
  },
  {
    input: {
      lpTokensWorthAtBuyTimeUSD: 20000,
      totalLPTokensWorthAtBuyTimeUSD: 0,
      expectedLPTokensValueGrowth: 1.2,
      liquidity: 100000,
      impermanentLoss: 0.1,
      A: -0.000001418161440423,
      X0: 75.92350121470723,
      C: 0.007358826350734583,
      cvi: 100,
      premiumGrowthStart: 2,
      premiumSlope: 1,
    },
    expectedPremium: 130.82799,
  },
]
