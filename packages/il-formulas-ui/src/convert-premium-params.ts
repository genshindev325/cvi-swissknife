import type { PremiumValues, IERC20, Token, TokenName } from '@coti-cvi/lw-sdk'
import {
  transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber,
  transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber,
} from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'

export function convertPremiumParams(options: {
  from: 'number'
  to: 'string'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<number>['premiumParams']
}): PremiumValues<string>['premiumParams']

export function convertPremiumParams(options: {
  from: 'number'
  to: 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<number>['premiumParams']
}): PremiumValues<BigNumber>['premiumParams']

export function convertPremiumParams(options: {
  from: 'string'
  to: 'number'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<string>['premiumParams']
}): PremiumValues<number>['premiumParams']

export function convertPremiumParams(options: {
  from: 'string'
  to: 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<string>['premiumParams']
}): PremiumValues<BigNumber>['premiumParams']

export function convertPremiumParams(options: {
  from: 'BigNumber'
  to: 'number'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<BigNumber>['premiumParams']
}): PremiumValues<number>['premiumParams']

export function convertPremiumParams(options: {
  from: 'BigNumber'
  to: 'string'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values: PremiumValues<BigNumber>['premiumParams']
}): PremiumValues<string>['premiumParams']

export function convertPremiumParams(options: {
  from: 'number' | 'string' | 'BigNumber'
  to: 'number' | 'string' | 'BigNumber'
  tokenUSDC: Token<IERC20, TokenName.USDC>
  values:
    | PremiumValues<number>['premiumParams']
    | PremiumValues<string>['premiumParams']
    | PremiumValues<BigNumber>['premiumParams']
}):
  | PremiumValues<number>['premiumParams']
  | PremiumValues<string>['premiumParams']
  | PremiumValues<BigNumber>['premiumParams'] {
  switch (options.from) {
    case 'number':
      switch (options.to) {
        case 'string': {
          const values = options.values as PremiumValues<number>['premiumParams']
          return {
            A: values.A.toFixed(10),
            X0: values.X0.toFixed(4),
            C: values.C.toFixed(10),
          }
        }
        case 'BigNumber': {
          const values = options.values as PremiumValues<number>['premiumParams']
          return {
            A: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'A',
              propertyValue: values.A.toFixed(10),
            }),
            X0: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'X0',
              propertyValue: values.X0.toFixed(4),
            }),
            C: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'C',
              propertyValue: values.C.toFixed(10),
            }),
          }
        }
      }
    case 'string':
      switch (options.to) {
        case 'number': {
          const values = options.values as PremiumValues<string>['premiumParams']
          return {
            A: Number(Number(values.A).toFixed(10)),
            X0: Number(Number(values.X0).toFixed(4)),
            C: Number(Number(values.C).toFixed(10)),
          }
        }
        case 'BigNumber': {
          const values = options.values as PremiumValues<string>['premiumParams']
          return {
            A: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'A',
              propertyValue: values.A,
            }),
            X0: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'X0',
              propertyValue: values.X0,
            }),
            C: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'C',
              propertyValue: values.C,
            }),
          }
        }
      }
    case 'BigNumber':
      switch (options.to) {
        case 'number': {
          const values = options.values as PremiumValues<BigNumber>['premiumParams']
          return {
            A: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'A',
              propertyValue: values.A,
            }),
            X0: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'X0',
              propertyValue: values.X0,
            }),
            C: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'C',
              propertyValue: values.C,
            }),
          }
        }
        case 'string': {
          const values = options.values as PremiumValues<BigNumber>['premiumParams']
          return {
            A: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'A',
              propertyValue: values.A,
            }).toFixed(10),
            X0: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'X0',
              propertyValue: values.X0,
            }).toFixed(4),
            C: transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
              tokenUSDC: options.tokenUSDC,
              propertyName: 'C',
              propertyValue: values.C,
            }).toFixed(10),
          }
        }
      }
  }

  throw new Error(`can't be here`)
}
