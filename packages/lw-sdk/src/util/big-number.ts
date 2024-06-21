import { formatFixed } from '@ethersproject/bignumber'
import { BigNumber, ethers } from 'ethers'
import type { BigNumberish } from 'ethers'
// @ts-ignore
import kConvert from 'k-convert'

const toKNumber = (num: number): string => (num >= 0 ? kConvert.convertTo(num) : `-${kConvert.convertTo(-1 * num)}`)

export function toSignificantDigits(number: string, significantDigits: number): string {
  const [whole, fraction] = number.split('.')
  if (fraction.length <= significantDigits) {
    return number
  }
  return `${whole}.${fraction.substring(0, significantDigits)}`
}

export type BigNumberCovertOptionalOptions = {
  significantDigits?: number // how much digits to keep after the decimal point
} & (
  | {
      commify: true // should transform 1000000 to 1,000,000
    }
  | {
      kCovert: true // should transform 1000 to 1k, 1000000 to 1000k, -1000 to -1k
    }
  | {}
)

export const bigNumberToString = (
  amount: BigNumberish,
  options: {
    magnitude: number // how much to devide the BigNumber when converting to Number (example: 6 ==> BigNumber/1,000,000)
  } & BigNumberCovertOptionalOptions,
): string => {
  const n = ethers.utils.formatUnits(amount, options.magnitude)
  const numberAsString = toSignificantDigits(n, options.significantDigits ?? 2)
  if ('commify' in options) {
    return ethers.utils.commify(numberAsString)
  } else if ('kCovert' in options) {
    return toKNumber(Number(numberAsString))
  }

  return Number(numberAsString).toString()
}

export const toCviIndexNumber = (contractEventCviValue: BigNumber, options?: BigNumberCovertOptionalOptions): string =>
  bigNumberToString(contractEventCviValue, {
    ...options,
    magnitude: 2,
  })

export const toUsdcNumber = (contractEventUsdcValue: BigNumber, options?: BigNumberCovertOptionalOptions): string =>
  bigNumberToString(contractEventUsdcValue, {
    ...options,
    magnitude: 6,
  })

export const toPositionUnitsAmountNumber = (
  contractEventPositionUnitsAmountValue: BigNumber,
  options?: BigNumberCovertOptionalOptions,
): string =>
  bigNumberToString(contractEventPositionUnitsAmountValue, {
    ...options,
    magnitude: 6,
  })

export function sumBigNumber(args: BigNumberish[]): BigNumber {
  return args.reduce((acc: BigNumber, curr: BigNumberish) => acc.add(curr), BigNumber.from(0))
}

export function toPlainString(numberString: string): string {
  return numberString.replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/, function (a, b, c, d, e) {
    return e < 0 ? b + '0.' + Array(1 - e - c.length).join('0') + c + d : b + c + d + Array(e - d.length + 1).join('0')
  })
}

export function roundCryptoValueString(
  str: string,
  decimalPlaces = 18,
  options?: {
    useToFixed?: boolean
  },
) {
  if (options?.useToFixed) {
    // this is not accurate at all. pls don't use it for production use.
    // we use it only for calculating worst-il-percentage for each supported pair
    return Number(str).toFixed(2)
  }
  str = toPlainString(str)
  if (!str.includes('.')) {
    return str
  }
  const [whole, fraction] = str.split('.')
  return `${whole}.${fraction.substring(0, decimalPlaces)}`.replace(/(\.\d*[1-9])0+$|\.0*$/, '$1') // remove trailing zeros
}

export function formatFixedAndRoundValue(value: BigNumber, formatFixedDecimals: number, roundValueDecimals: number) {
  return roundCryptoValueString(formatFixed(value, formatFixedDecimals), roundValueDecimals)
}

function numberToString(num: number | string): string {
  if (typeof num === 'number') {
    return num.toFixed(20)
  }
  return num.startsWith('0x') ? BigNumber.from(num).toString() : num
}

export const fromNumber = (amount: number | string, decimals: number): BigNumber => {
  return ethers.utils.parseUnits(roundCryptoValueString(numberToString(amount), decimals), decimals)
}

export const toNumber = (amount: BigNumber, decimals: number): number => {
  return +ethers.utils.formatUnits(amount, decimals)
}

export const toHex = (amount: number, decimals: number): string => {
  const amountString = amount.toString().startsWith('0x') ? BigNumber.from(amount).toString() : amount.toString()
  const result = ethers.utils.parseUnits(roundCryptoValueString(amountString, decimals), decimals)
  return result.toHexString().replace(/0x0+/, '0x')
}

export const bitNumberToHex = (bn: BigNumber): string => {
  return bn.toHexString().replace(/0x0+/, '0x')
}

export const isNum = (num: number | string | undefined): num is string => {
  return typeof num == 'number' || (num !== null && num !== undefined && num.length > 0 && !isNaN(+num))
}

export function addPercentToBN(bn: BigNumber, percent: number) {
  return bn.mul(percent + 100).div(100)
}
