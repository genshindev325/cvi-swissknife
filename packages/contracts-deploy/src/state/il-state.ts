import type { PolicyPeriod, PolicyPeriodParams } from '../../../lw-sdk/src/contracts-deploy-utils/types'
import { BlockchainName } from '../../../lw-sdk/src/types/config-types'
import { fromNumber } from '../../../lw-sdk/src/util/big-number'
import { TokenName } from '../../../lw-sdk/src/types/token-types'

const policyPeriodsMap: Record<PolicyPeriod, number> = {
  MINUTE: 60,
  TWOWEEKS: 60 * 60 * 24 * 14,
  MONTH: 60 * 60 * 24 * 30,
  TWOMONTHS: 60 * 60 * 24 * 60,
}

export const policyPeriods: number[] = Object.values(policyPeriodsMap)

const fromCollateralCapPercentToComponent = (percent: number) => {
  if (percent < 0 || percent > 100) {
    throw new Error(`Error in fromCollateralCapPercentToComponent. Value is percent, must be between 0 to 100.`)
  }
  return percent * 100
}

const toBigNumber = (num: number) => fromNumber(num, 18).toString()
const DISCOUNT_RATE = 0.5

export const policyPeriodParamsBNBUSD: PolicyPeriodParams = {
  MINUTE: {
    A: toBigNumber(0.0000040956143),
    X0: toBigNumber(37.229291357240626),
    C: toBigNumber(-0.002244592131854348 * DISCOUNT_RATE),
  },
  TWOWEEKS: {
    A: toBigNumber(0.0000040956143),
    X0: toBigNumber(37.229291357240626),
    C: toBigNumber(-0.002244592131854348 * DISCOUNT_RATE),
  },
  MONTH: {
    A: toBigNumber(0.00004161875465),
    X0: toBigNumber(69.2772762341846),
    C: toBigNumber(0.0011601548840879383 * DISCOUNT_RATE),
  },
  TWOMONTHS: {
    A: toBigNumber(0.00010067609920348513),
    X0: toBigNumber(68.31176942107672),
    C: toBigNumber(0.015438914262925041 * DISCOUNT_RATE),
  },
}

export const policyPeriodParamsETHUSD: PolicyPeriodParams = {
  MINUTE: {
    A: toBigNumber(0.000000454),
    X0: toBigNumber(114.5643269101),
    C: toBigNumber(0.0048735824 * DISCOUNT_RATE),
  },
  TWOWEEKS: {
    A: toBigNumber(0.000000454),
    X0: toBigNumber(114.5643269101),
    C: toBigNumber(0.0048735824 * DISCOUNT_RATE),
  },
  MONTH: {
    A: toBigNumber(0.0000034506),
    X0: toBigNumber(114.0236859725),
    C: toBigNumber(0.0095548711 * DISCOUNT_RATE),
  },
  TWOMONTHS: {
    A: toBigNumber(0.0000022266),
    X0: toBigNumber(162.6297557664),
    C: toBigNumber(0.0200086311 * DISCOUNT_RATE),
  },
}

export const policyPeriodParamsBTCUSD: PolicyPeriodParams = {
  MINUTE: {
    A: toBigNumber(0.0000001996),
    X0: toBigNumber(77.7691),
    C: toBigNumber(0.002876168 * DISCOUNT_RATE),
  },
  TWOWEEKS: {
    A: toBigNumber(0.0000001996),
    X0: toBigNumber(77.7691),
    C: toBigNumber(0.002876168 * DISCOUNT_RATE),
  },
  MONTH: {
    A: toBigNumber(0.000000889),
    X0: toBigNumber(114.7877),
    C: toBigNumber(0.0064603857 * DISCOUNT_RATE),
  },
  TWOMONTHS: {
    A: toBigNumber(0.0000070374),
    X0: toBigNumber(107.3184),
    C: toBigNumber(0.0141510147 * DISCOUNT_RATE),
  },
}
export const policyPeriodParamsLINKUSD: PolicyPeriodParams = {
  MINUTE: {
    A: toBigNumber(0.000002992),
    X0: toBigNumber(107.72552931620443),
    C: toBigNumber(0.005320266500480231 * DISCOUNT_RATE),
  },
  TWOWEEKS: {
    A: toBigNumber(0.000002992),
    X0: toBigNumber(107.72552931620443),
    C: toBigNumber(0.005320266500480231 * DISCOUNT_RATE),
  },
  MONTH: {
    A: toBigNumber(0.000012862),
    X0: toBigNumber(102.8235320578366),
    C: toBigNumber(0.009474556822118785 * DISCOUNT_RATE),
  },
  TWOMONTHS: {
    A: toBigNumber(0.0000151475),
    X0: toBigNumber(110.57899770922843),
    C: toBigNumber(0.02322862543472573 * DISCOUNT_RATE),
  },
}
export const policyPeriodParamsMATICUSD: PolicyPeriodParams = {
  MINUTE: {
    A: toBigNumber(0.000004713260251979119),
    X0: toBigNumber(90.49042687535437),
    C: toBigNumber(0.0059072488798821085 * DISCOUNT_RATE),
  },
  TWOWEEKS: {
    A: toBigNumber(0.000004713260251979119),
    X0: toBigNumber(90.49042687535437),
    C: toBigNumber(0.0059072488798821085 * DISCOUNT_RATE),
  },
  MONTH: {
    A: toBigNumber(0.000038446948173281505),
    X0: toBigNumber(84.06883702347164),
    C: toBigNumber(0.010538153965373498 * DISCOUNT_RATE),
  },
  TWOMONTHS: {
    A: toBigNumber(0.00005122315364968796),
    X0: toBigNumber(96.99402606773448),
    C: toBigNumber(0.00938858277642829 * DISCOUNT_RATE),
  },
}

const commonPairs = [
  {
    token0: TokenName.WETH,
    token1: TokenName.USDC,
    policyPeriodParams: policyPeriodParamsETHUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.WETH,
    token1: TokenName.USDT,
    policyPeriodParams: policyPeriodParamsETHUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.WETH,
    token1: TokenName.DAI,
    policyPeriodParams: policyPeriodParamsETHUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.WETH,
    token1: TokenName.WBTC,
    policyPeriodParams: {
      MINUTE: {
        A: toBigNumber(0.000000373431082),
        X0: toBigNumber(82.10048012004158),
        C: toBigNumber(((0.001496225754776 * 130) / 100) * DISCOUNT_RATE),
      },
      TWOWEEKS: {
        A: toBigNumber(0.000000373431082),
        X0: toBigNumber(82.10048012004158),
        C: toBigNumber(((0.001496225754776 * 130) / 100) * DISCOUNT_RATE),
      },
      MONTH: {
        A: toBigNumber(0.000000178104928),
        X0: toBigNumber(119.6586835707416),
        C: toBigNumber(((0.003634566027425 * 130) / 100) * DISCOUNT_RATE),
      },
      TWOMONTHS: {
        A: toBigNumber(-0.000001458299796),
        X0: toBigNumber(91.18260924690122),
        C: toBigNumber(((0.006901895038379 * 130) / 100) * DISCOUNT_RATE),
      },
    },
    collateralCapComponent: fromCollateralCapPercentToComponent(20),
  },
  {
    token0: TokenName.WETH,
    token1: TokenName.LINK,
    policyPeriodParams: {
      MINUTE: {
        A: toBigNumber(0.0000013095),
        X0: toBigNumber(116.9793),
        C: toBigNumber(0.0019717745 * DISCOUNT_RATE),
      },
      TWOWEEKS: {
        A: toBigNumber(0.0000013095),
        X0: toBigNumber(116.9793),
        C: toBigNumber(0.0019717745 * DISCOUNT_RATE),
      },
      MONTH: {
        A: toBigNumber(0.0000014221),
        X0: toBigNumber(76.1252),
        C: toBigNumber(0.0073670731 * DISCOUNT_RATE),
      },
      TWOMONTHS: {
        A: toBigNumber(0.0000010486),
        X0: toBigNumber(175.5241),
        C: toBigNumber(0.0024912961 * DISCOUNT_RATE),
      },
    },
    collateralCapComponent: fromCollateralCapPercentToComponent(6),
  },
  {
    token0: TokenName.LINK,
    token1: TokenName.USDC,
    policyPeriodParams: policyPeriodParamsLINKUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
  {
    token0: TokenName.LINK,
    token1: TokenName.USDT,
    policyPeriodParams: policyPeriodParamsLINKUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
  {
    token0: TokenName.LINK,
    token1: TokenName.DAI,
    policyPeriodParams: policyPeriodParamsLINKUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
  {
    token0: TokenName.WBTC,
    token1: TokenName.USDC,
    policyPeriodParams: policyPeriodParamsBTCUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.WBTC,
    token1: TokenName.USDT,
    policyPeriodParams: policyPeriodParamsBTCUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.WBTC,
    token1: TokenName.DAI,
    policyPeriodParams: policyPeriodParamsBTCUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(100),
  },
  {
    token0: TokenName.BNB,
    token1: TokenName.USDC,
    policyPeriodParams: policyPeriodParamsBNBUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
  {
    token0: TokenName.BNB,
    token1: TokenName.USDT,
    policyPeriodParams: policyPeriodParamsBNBUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
  {
    token0: TokenName.BNB,
    token1: TokenName.DAI,
    policyPeriodParams: policyPeriodParamsBNBUSD,
    collateralCapComponent: fromCollateralCapPercentToComponent(2),
  },
] as const

export const pairs = {
  [BlockchainName.POLYGON]: [
    ...commonPairs,
    {
      token0: TokenName.WETH,
      token1: TokenName.MATIC,
      policyPeriodParams: {
        MINUTE: {
          A: toBigNumber(0.000003612),
          X0: toBigNumber(73.8223),
          C: toBigNumber(0.0014404717 * DISCOUNT_RATE),
        },
        TWOWEEKS: {
          A: toBigNumber(0.000003612),
          X0: toBigNumber(73.8223),
          C: toBigNumber(0.0014404717 * DISCOUNT_RATE),
        },
        MONTH: {
          A: toBigNumber(0.0000101128),
          X0: toBigNumber(77.943),
          C: toBigNumber(0.0041859395 * DISCOUNT_RATE),
        },
        TWOMONTHS: {
          A: toBigNumber(0.0000119802),
          X0: toBigNumber(92.0415),
          C: toBigNumber(0.0149452348 * DISCOUNT_RATE),
        },
      },
      collateralCapComponent: fromCollateralCapPercentToComponent(5),
    },
    {
      token0: TokenName.MATIC,
      token1: TokenName.USDC,
      policyPeriodParams: policyPeriodParamsMATICUSD,
      collateralCapComponent: fromCollateralCapPercentToComponent(2),
    },
    {
      token0: TokenName.MATIC,
      token1: TokenName.USDT,
      policyPeriodParams: policyPeriodParamsMATICUSD,
      collateralCapComponent: fromCollateralCapPercentToComponent(2),
    },
    {
      token0: TokenName.MATIC,
      token1: TokenName.DAI,
      policyPeriodParams: policyPeriodParamsMATICUSD,
      collateralCapComponent: fromCollateralCapPercentToComponent(2),
    },
  ],
  [BlockchainName.ARBITRUM]: commonPairs,
  [BlockchainName.ETHEREUM]: [],
} as const

export const maxProtectionsInUpkeep = 10
export const minAmountToBePaid = 10000
export const maxILProtected = 1500
export const buyILProtectionEnabled = true
export const ilProtectionFee = 5
export const expectedLPTokensValueGrowth = 12000
export const treasuryAllowance = fromNumber(1_000_000, 6)
export const minTreasuryAllowance = treasuryAllowance.div(2)
export const premiumGrowthStart = fromNumber(8, 18)
export const premiumSlope = fromNumber(2, 18)
export const protectionMetadataCID = 'QmYHmBhDj9L5VYMPrrzgCxhtpLHmnG1mHVMz99X4UNzrDd'
export const configParams = [
  minAmountToBePaid,
  maxILProtected,
  buyILProtectionEnabled,
  ilProtectionFee,
  expectedLPTokensValueGrowth,
  policyPeriods,
  premiumGrowthStart,
  premiumSlope,
] as const

export const priceTokenDecimals = 8

// Protection discount NFT
export const premiumDiscountComponent = 1000
export const freeOfChargeTokensWorth = fromNumber(1000, 6)
export const isDiscountEnabled = true
