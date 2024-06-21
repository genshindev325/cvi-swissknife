import type { BigNumber } from 'ethers'
import { toNumber, fromNumber, bigNumberToString } from '../util'
import type { BigNumberCovertOptionalOptions } from '../util'
import { TokenName } from '../types'

const DEFAULT_SIGNIFICANT_DIGITS = 6

export abstract class BaseCurrency {
  constructor(public readonly address: string, public readonly symbol: string, public readonly decimals: number) {}

  public abstract isNative(): boolean

  public sortsBefore(other: BaseCurrency): boolean {
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  public getTokenName(): TokenName {
    const t = Object.values(TokenName).find(r => r === this.symbol)
    if (!t) {
      throw new Error(`symbol (${this.symbol}) is not a valid TokenName. please add it to the enum`)
    }
    return t
  }

  public fromNumber(num: number | string): BigNumber {
    return fromNumber(num, this.decimals)
  }

  public toNumber(bn: BigNumber): number {
    return toNumber(bn, this.decimals)
  }

  public toString(): string
  public toString(amount: BigNumber): string
  public toString(amount: number): string
  public toString(amount?: BigNumber | number): string {
    if (amount === undefined) {
      return `${this.symbol}`
    }
    if (typeof amount === 'number') {
      return `${amount.toFixed(DEFAULT_SIGNIFICANT_DIGITS)} ${this.symbol}`
    }
    const options: BigNumberCovertOptionalOptions = {
      commify: true,
      significantDigits: DEFAULT_SIGNIFICANT_DIGITS,
    }
    return `${bigNumberToString(amount, { magnitude: this.decimals, ...options })} ${this.symbol}`
  }
}
