import { fromNumber, toNumber } from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'
import type { PayoutParams } from './types'

export function transformPayoutParamsPropertyValueToBigNumber({
  propertyName,
  value,
}: {
  propertyName: keyof PayoutParams<number>
  value: number
}): BigNumber {
  switch (propertyName) {
    case 'lpTokensWorthAtBuyTimeUSD':
      return fromNumber(value, 6)
    case 'token0EndPriceUSD':
      return fromNumber(value, 8)
    case 'token0EntryPriceUSD':
      return fromNumber(value, 8)
    case 'token1EndPriceUSD':
      return fromNumber(value, 8)
    case 'token1EntryPriceUSD':
      return fromNumber(value, 8)
  }
}

export function transformPayoutParamsPropertyValueToNumber({
  propertyName,
  value,
}: {
  propertyName: keyof PayoutParams<BigNumber>
  value: BigNumber
}): number {
  switch (propertyName) {
    case 'lpTokensWorthAtBuyTimeUSD':
      return toNumber(value, 6)
    case 'token0EndPriceUSD':
      return toNumber(value, 8)
    case 'token0EntryPriceUSD':
      return toNumber(value, 8)
    case 'token1EndPriceUSD':
      return toNumber(value, 8)
    case 'token1EntryPriceUSD':
      return toNumber(value, 8)
  }
}

export function convertPayoutParams(options: {
  from: 'number'
  to: 'string'
  values: PayoutParams<number>
}): PayoutParams<string>

export function convertPayoutParams(options: {
  from: 'number'
  to: 'BigNumber'
  values: PayoutParams<number>
}): PayoutParams<BigNumber>

export function convertPayoutParams(options: {
  from: 'string'
  to: 'number'
  values: PayoutParams<string>
}): PayoutParams<number>

export function convertPayoutParams(options: {
  from: 'string'
  to: 'BigNumber'
  values: PayoutParams<string>
}): PayoutParams<BigNumber>

export function convertPayoutParams(options: {
  from: 'BigNumber'
  to: 'number'
  values: PayoutParams<BigNumber>
}): PayoutParams<number>

export function convertPayoutParams(options: {
  from: 'BigNumber'
  to: 'string'
  values: PayoutParams<BigNumber>
}): PayoutParams<string>

export function convertPayoutParams(options: {
  from: 'number' | 'string' | 'BigNumber'
  to: 'number' | 'string' | 'BigNumber'
  values: PayoutParams<number> | PayoutParams<string> | PayoutParams<BigNumber>
}): PayoutParams<number> | PayoutParams<string> | PayoutParams<BigNumber> {
  switch (options.from) {
    case 'number':
      switch (options.to) {
        case 'string': {
          const values = options.values as PayoutParams<number>
          return {
            lpTokensWorthAtBuyTimeUSD: values.lpTokensWorthAtBuyTimeUSD.toString(),
            token0EntryPriceUSD: values.token0EntryPriceUSD.toString(),
            token0EndPriceUSD: values.token0EndPriceUSD.toString(),
            token1EntryPriceUSD: values.token1EntryPriceUSD.toString(),
            token1EndPriceUSD: values.token1EndPriceUSD.toString(),
          }
        }
        case 'BigNumber': {
          const values = options.values as PayoutParams<number>
          return {
            lpTokensWorthAtBuyTimeUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'lpTokensWorthAtBuyTimeUSD',
              value: values.lpTokensWorthAtBuyTimeUSD,
            }),
            token0EntryPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token0EntryPriceUSD',
              value: values.token0EntryPriceUSD,
            }),
            token0EndPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token0EndPriceUSD',
              value: values.token0EndPriceUSD,
            }),
            token1EntryPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token1EntryPriceUSD',
              value: values.token1EntryPriceUSD,
            }),
            token1EndPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token1EndPriceUSD',
              value: values.token1EndPriceUSD,
            }),
          }
        }
      }
    case 'string':
      switch (options.to) {
        case 'number': {
          const values = options.values as PayoutParams<string>
          return {
            lpTokensWorthAtBuyTimeUSD: Number(values.lpTokensWorthAtBuyTimeUSD),
            token0EntryPriceUSD: Number(values.token0EntryPriceUSD),
            token0EndPriceUSD: Number(values.token0EndPriceUSD),
            token1EntryPriceUSD: Number(values.token1EntryPriceUSD),
            token1EndPriceUSD: Number(values.token1EndPriceUSD),
          }
        }
        case 'BigNumber': {
          const values = options.values as PayoutParams<string>
          return {
            lpTokensWorthAtBuyTimeUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'lpTokensWorthAtBuyTimeUSD',
              value: Number(values.lpTokensWorthAtBuyTimeUSD),
            }),
            token0EntryPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token0EntryPriceUSD',
              value: Number(values.token0EntryPriceUSD),
            }),
            token0EndPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token0EndPriceUSD',
              value: Number(values.token0EndPriceUSD),
            }),
            token1EntryPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token1EntryPriceUSD',
              value: Number(values.token1EntryPriceUSD),
            }),
            token1EndPriceUSD: transformPayoutParamsPropertyValueToBigNumber({
              propertyName: 'token1EndPriceUSD',
              value: Number(values.token1EndPriceUSD),
            }),
          }
        }
      }
    case 'BigNumber':
      switch (options.to) {
        case 'number': {
          const values = options.values as PayoutParams<BigNumber>
          return {
            lpTokensWorthAtBuyTimeUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'lpTokensWorthAtBuyTimeUSD',
              value: values.lpTokensWorthAtBuyTimeUSD,
            }),
            token0EntryPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token0EntryPriceUSD',
              value: values.token0EntryPriceUSD,
            }),
            token0EndPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token0EndPriceUSD',
              value: values.token0EndPriceUSD,
            }),
            token1EntryPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token1EntryPriceUSD',
              value: values.token1EntryPriceUSD,
            }),
            token1EndPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token1EndPriceUSD',
              value: values.token1EndPriceUSD,
            }),
          }
        }
        case 'string': {
          const values = options.values as PayoutParams<BigNumber>
          return {
            lpTokensWorthAtBuyTimeUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'lpTokensWorthAtBuyTimeUSD',
              value: values.lpTokensWorthAtBuyTimeUSD,
            }).toString(),
            token0EntryPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token0EntryPriceUSD',
              value: values.token0EntryPriceUSD,
            }).toString(),
            token0EndPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token0EndPriceUSD',
              value: values.token0EndPriceUSD,
            }).toString(),
            token1EntryPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token1EntryPriceUSD',
              value: values.token1EntryPriceUSD,
            }).toString(),
            token1EndPriceUSD: transformPayoutParamsPropertyValueToNumber({
              propertyName: 'token1EndPriceUSD',
              value: values.token1EndPriceUSD,
            }).toString(),
          }
        }
      }
  }
  throw new Error(`can't be here`)
}
