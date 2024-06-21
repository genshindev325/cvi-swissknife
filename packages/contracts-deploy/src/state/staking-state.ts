import { fromNumber } from '@coti-cvi/lw-sdk/src/util'

export const esGoviDecimals = 18

// Theta-LP
export const thetaLPRewardPerMonth = 50_000 // 50k EsGOVI per month
export const thetaLPTokensPerInterval = fromNumber(thetaLPRewardPerMonth / (30 * 24 * 60 * 60), esGoviDecimals)
export const thetaLPVestingDuration = 365 * 24 * 60 * 60
export const thetaLPDistributorAmount = fromNumber(1_000_000, esGoviDecimals)

// GOVI
export const goviRewardPerMonth = 50_000 // 50k EsGOVI per month
export const goviTokensPerInterval = fromNumber(goviRewardPerMonth / (30 * 24 * 60 * 60), esGoviDecimals)
export const goviVestingDuration = 365 * 24 * 60 * 60
export const goviDistributorAmount = fromNumber(1_000_000, esGoviDecimals)

// EsGOVI
export const esGoviRewardPerMonth = 50_000 // 50k EsGOVI per month
export const esGoviTokensPerInterval = fromNumber(esGoviRewardPerMonth / (30 * 24 * 60 * 60), esGoviDecimals)
export const esGoviDistributorAmount = fromNumber(1_000_000, esGoviDecimals)
