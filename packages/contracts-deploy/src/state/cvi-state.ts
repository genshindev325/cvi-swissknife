import { fromNumber } from '../../../lw-sdk/src/util/big-number'

export const VOL = 'CVI'
export const TOKEN = 'USDC'

export const LEVERAGES = [1] as const
export type ValidLeverage = typeof LEVERAGES[number]

export const leverage: ValidLeverage = 1

export const MAX_INDEX = 200 * leverage
export const MAX_INDEX_PLATFORM_DECIMALS = 2
export const MAX_INDEX_ORECLE_DECIMALS = 18
export const MAX_INDEX_VALUE = fromNumber(MAX_INDEX, MAX_INDEX_PLATFORM_DECIMALS)
export const MAX_INDEX_ORACLE_VALUE = fromNumber(MAX_INDEX, MAX_INDEX_ORECLE_DECIMALS)

export const tokenDecimals = 6
export const volTokenDecimals = 18
export const thetaTokenDecimals = 18

// fees calculator
export const fundingFeeConstantRate = 0.25 * 10000 // 0.25%
export const fundingFeeMinRate = 0.2 * 10000 // 0.2%
export const fundingFeeMaxRate = 8 * 10000 // 8%
export const maxFundingFeeCviThreshold = 48
export const minFundingFeeCviThreshold = 150
export const fundingFeeDivisionFactor = 5

export const fundingFeeCoefficients = [125000, 143587, 164938, 189464, 217637]

// platform
export const PLATFORM_LP_TOKEN_NAME = `CVI LP`
export const PLATFORM_LP_TOKEN_SYMBOL = `CVI-LP`

export const buyersLockupPeriod = 6 * 60 * 60
export const lpsLockupPeriod = 0

export const maxAllowedLeverage = Math.max(...LEVERAGES)

// vol token
export const VOL_TOKEN_NAME = 'Crypto Volatility Token'
export const VOL_TOKEN_SYMBOL = 'CVI'

export const maxMinRequestIncrements = 5

export const beforeTargetTimeMaxPenaltyFeePercent = 200
export const afterTargetMidTime = 20 * 60 // mid fee time after target time
export const afterTargetMidTimePenaltyFeePercent = 200
export const afterTargetMaxTime = 60 * 60 // liquidate 60 min after target time
export const afterTargetMaxTimePenaltyFeePercent = 300

export const minWaitTime = 60 * 15

export const minTimeWindow = 20 * 60 // min target time
export const maxTimeWindow = 60 * 60 // max target time

export const deviationPerSingleRebaseLag = 10 * 100 // 10%
export const minDeviationPercentage = 0.1 * 100 // 0.1%
export const maxDeviationPercentage = 50 * 100 // 50%

export const verifyTotalRequestsAmount = true

export const maxTotalRequestsAmount = fromNumber(100_000, tokenDecimals)

export const cappedRebase = true

export const minKeepersMintAmount = fromNumber(0, tokenDecimals)
export const minKeepersBurnAmount = fromNumber(0, volTokenDecimals)

export const keepersFeePercent = 0.1 * 100 // keepers fee percent: 0.1%
export const keepersFeeMax = fromNumber(0.1, tokenDecimals) // up to max fee: 0.1 USDC

// rebaser
export const upkeepTimeWindow = 60 * 60 * 24

export const rebaserWhitelist = false

// theta vault
export const THETA_TOKEN_NAME = `Theta CVI LP`
export const THETA_TOKEN_SYMBOL = `T-CVI-LP`

export const enableWhitelist = false

export const maxCapacity = fromNumber(4_000_000, tokenDecimals)
export const minDepositAmount = fromNumber(0.01, tokenDecimals)
export const minWithdrawAmount = fromNumber(0.01, thetaTokenDecimals)

export const minPoolSkewPercentage = 3 * 100 // 3% skew
export const extraLiqidityPercentage = 25 * 100 // 25% extra liquidity - to calculate final CR: 100 / 125 * 100 = 80%
export const minDexPercentageAllowed = 15 * 100 // 15%

export const depositHoldingsPercentage = 15 * 100 // 15%

export const requestDelay = 30 * 60 // 30 minutes
export const lockupPeriod = 60 * 60 * 24 // 24 hours withdraw lockup
export const liquidationPeriod = 60 * 60 * 24 // 24 hours after submit request - expire period

// fees calculator
export const collateralToBuyingPremiumMapping = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

export const collateralToExtraFundingFeeMapping = [
  0, 142, 214, 285, 357, 428, 500, 571, 642, 714, 785, 857, 928, 1000, 1071, 1142, 1214, 1285, 1357, 1428, 1500, 1571,
  1642, 1714, 1785, 1857, 1928, 2000, 2071, 2142, 2214, 2285, 2357, 2428, 2500, 2571, 2642, 2714, 2785, 2857, 2928,
  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
  3000, 3000, 3000,
]

// initial liquidity state in USDC
export const LIQUIDITY_AMOUNT = 100 // initial theta vault deposit ($100)
export const POSITION_AMOUNT = 1 // initial volatility token mint and add liquidity to uniswap pair ($2 and $2)
