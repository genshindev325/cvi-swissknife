import type { PremiumValues, IERC20, Token, TokenName } from '@coti-cvi/lw-sdk'
import {
  transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber,
  transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber,
} from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'

export function convertPremiumValuesWithoutParams(options: {
  from: 'number'
  to: 'string'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<number>, 'premiumParams'>
}): Omit<PremiumValues<string>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'number'
  to: 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<number>, 'premiumParams'>
}): Omit<PremiumValues<BigNumber>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'string'
  to: 'number'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<string>, 'premiumParams'>
}): Omit<PremiumValues<number>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'string'
  to: 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<string>, 'premiumParams'>
}): Omit<PremiumValues<BigNumber>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'BigNumber'
  to: 'number'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<BigNumber>, 'premiumParams'>
}): Omit<PremiumValues<number>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'BigNumber'
  to: 'string'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: Omit<PremiumValues<BigNumber>, 'premiumParams'>
}): Omit<PremiumValues<string>, 'premiumParams'>

export function convertPremiumValuesWithoutParams(options: {
  from: 'number' | 'string' | 'BigNumber'
  to: 'number' | 'string' | 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values:
    | Omit<PremiumValues<number>, 'premiumParams'>
    | Omit<PremiumValues<string>, 'premiumParams'>
    | Omit<PremiumValues<BigNumber>, 'premiumParams'>
}):
  | Omit<PremiumValues<number>, 'premiumParams'>
  | Omit<PremiumValues<string>, 'premiumParams'>
  | Omit<PremiumValues<BigNumber>, 'premiumParams'> {
  switch (options.from) {
    case 'number':
      switch (options.to) {
        case 'string': {
          const values = options.values as Omit<PremiumValues<number>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: values.lpTokensWorthAtBuyTimeUsdc.toString(),
            expectedLPTokensValueGrowth: values.expectedLPTokensValueGrowth.toString(),
            totalLPTokensWorthAtBuyTimeUsdc: values.totalLPTokensWorthAtBuyTimeUsdc.toString(),
            cvi: values.cvi.toString(),
            liquidityUsdc: values.liquidityUsdc.toString(),
            maxILProtectedPercentage: values.maxILProtectedPercentage.toString(),
            premiumGrowthStart: values.premiumGrowthStart.toString(),
            premiumSlope: values.premiumSlope.toString(),
          }
        }
        case 'BigNumber': {
          const values = options.values as Omit<PremiumValues<number>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'lpTokensWorthAtBuyTimeUsdc',
              propertyValue: values.lpTokensWorthAtBuyTimeUsdc,
            }),
            expectedLPTokensValueGrowth: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'expectedLPTokensValueGrowth',
              propertyValue: values.expectedLPTokensValueGrowth,
            }),
            totalLPTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'totalLPTokensWorthAtBuyTimeUsdc',
              propertyValue: values.totalLPTokensWorthAtBuyTimeUsdc,
            }),
            cvi: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'cvi',
              propertyValue: values.cvi,
            }),
            liquidityUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'liquidityUsdc',
              propertyValue: values.liquidityUsdc,
            }),
            maxILProtectedPercentage: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'maxILProtectedPercentage',
              propertyValue: values.maxILProtectedPercentage,
            }),
            premiumGrowthStart: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumGrowthStart',
              propertyValue: values.premiumGrowthStart,
            }),
            premiumSlope: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumSlope',
              propertyValue: values.premiumSlope,
            }),
          }
        }
      }
    case 'string':
      switch (options.to) {
        case 'number': {
          const values = options.values as Omit<PremiumValues<string>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: Number(values.lpTokensWorthAtBuyTimeUsdc),
            expectedLPTokensValueGrowth: Number(values.expectedLPTokensValueGrowth),
            totalLPTokensWorthAtBuyTimeUsdc: Number(values.totalLPTokensWorthAtBuyTimeUsdc),
            cvi: Number(values.cvi),
            liquidityUsdc: Number(values.liquidityUsdc),
            maxILProtectedPercentage: Number(values.maxILProtectedPercentage),
            premiumGrowthStart: Number(values.premiumGrowthStart),
            premiumSlope: Number(values.premiumSlope),
          }
        }
        case 'BigNumber': {
          const values = options.values as Omit<PremiumValues<string>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'lpTokensWorthAtBuyTimeUsdc',
              propertyValue: values.lpTokensWorthAtBuyTimeUsdc,
            }),
            expectedLPTokensValueGrowth: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'expectedLPTokensValueGrowth',
              propertyValue: values.expectedLPTokensValueGrowth,
            }),
            totalLPTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'totalLPTokensWorthAtBuyTimeUsdc',
              propertyValue: values.totalLPTokensWorthAtBuyTimeUsdc,
            }),
            cvi: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'cvi',
              propertyValue: values.cvi,
            }),
            liquidityUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'liquidityUsdc',
              propertyValue: values.liquidityUsdc,
            }),
            maxILProtectedPercentage: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'maxILProtectedPercentage',
              propertyValue: values.maxILProtectedPercentage,
            }),
            premiumGrowthStart: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumGrowthStart',
              propertyValue: values.premiumGrowthStart,
            }),
            premiumSlope: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumSlope',
              propertyValue: values.premiumSlope,
            }),
          }
        }
      }
    case 'BigNumber':
      switch (options.to) {
        case 'number': {
          const values = options.values as Omit<PremiumValues<BigNumber>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'lpTokensWorthAtBuyTimeUsdc',
              propertyValue: values.lpTokensWorthAtBuyTimeUsdc,
            }),
            expectedLPTokensValueGrowth: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'expectedLPTokensValueGrowth',
              propertyValue: values.expectedLPTokensValueGrowth,
            }),
            totalLPTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'totalLPTokensWorthAtBuyTimeUsdc',
              propertyValue: values.totalLPTokensWorthAtBuyTimeUsdc,
            }),
            cvi: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'cvi',
              propertyValue: values.cvi,
            }),
            liquidityUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'liquidityUsdc',
              propertyValue: values.liquidityUsdc,
            }),
            maxILProtectedPercentage: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'maxILProtectedPercentage',
              propertyValue: values.maxILProtectedPercentage,
            }),
            premiumGrowthStart: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumGrowthStart',
              propertyValue: values.premiumGrowthStart,
            }),
            premiumSlope: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumSlope',
              propertyValue: values.premiumSlope,
            }),
          }
        }
        case 'string': {
          const values = options.values as Omit<PremiumValues<BigNumber>, 'premiumParams'>
          return {
            lpTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'lpTokensWorthAtBuyTimeUsdc',
              propertyValue: values.lpTokensWorthAtBuyTimeUsdc,
            }).toString(),
            expectedLPTokensValueGrowth: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'expectedLPTokensValueGrowth',
              propertyValue: values.expectedLPTokensValueGrowth,
            }).toString(),
            totalLPTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'totalLPTokensWorthAtBuyTimeUsdc',
              propertyValue: values.totalLPTokensWorthAtBuyTimeUsdc,
            }).toString(),
            cvi: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'cvi',
              propertyValue: values.cvi,
            }).toString(),
            liquidityUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'liquidityUsdc',
              propertyValue: values.liquidityUsdc,
            }).toString(),
            maxILProtectedPercentage: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'maxILProtectedPercentage',
              propertyValue: values.maxILProtectedPercentage,
            }).toString(),
            premiumGrowthStart: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumGrowthStart',
              propertyValue: values.premiumGrowthStart,
            }).toString(),
            premiumSlope: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'premiumSlope',
              propertyValue: values.premiumSlope,
            }).toString(),
          }
        }
      }
  }
  throw new Error(`can't be here`)
}
