/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JsonRpcProvider } from '@ethersproject/providers'
import axios from 'axios'
import hrtime from 'browser-hrtime'
import type { BigNumber, Signer } from 'ethers'
import { Wallet } from 'ethers'
import humanizeDuration from 'humanize-duration'
import type { Token } from '../token'
import type { TokenName, IERC20, CalculateCustomPremiumValues } from '../types'
import { BlockchainName } from '../types'
import { fromNumber, isNum, toNumber } from './big-number'

export const getFromTimestampForLeaderBoardTimeRangeString = (
  range: '24h' | '2d' | '1w' | 'all' | 'select',
): number | undefined => {
  switch (range) {
    case '24h':
      return Math.floor(new Date(Date.now() - 1000 * 60 * 60 * 24).setHours(0, 0, 0, 0) / 1000)
      break

    case '2d':
      return Math.floor(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).setHours(0, 0, 0, 0) / 1000)
      break

    case '1w':
      return Math.floor(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).setHours(0, 0, 0, 0) / 1000)
      break

    case 'all':
      return undefined
      break

    case 'select':
    default:
      throw new Error(`Unsupported range in getFromTimestampForRange ${range}`)
  }
}

export function getSinger(
  options: { provider: JsonRpcProvider } & (
    | {
        privateKey: string
      }
    | { impersonatedPublicWalletAddress: string }
    | { signer: Signer }
  ),
): Signer {
  return 'privateKey' in options
    ? (new Wallet(options.privateKey, options.provider) as Signer)
    : 'impersonatedPublicWalletAddress' in options
    ? options.provider.getSigner(options.impersonatedPublicWalletAddress)
    : options.signer
}

// timer in seconds with a precision of nano-seconds. output example: 0.000168734 seconds
export const startTimer = () => {
  const start = hrtime()
  return () => {
    const end = hrtime(start)
    return end[0] + end[1] / 1e9
  }
}

export function getPercentageDifference(numA: number, numB: number) {
  const absDiffPercent = ((numA - numB) / numB) * 100
  return Math.abs(absDiffPercent).toFixed(2)
}

export function secondsToString(seconds: number): string {
  return humanizeDuration(seconds * 1000, { largest: 1, units: ['d', 'h', 'm'], round: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractSolidityContractErrorReason(error: any): string {
  const msgs = [
    error?.data?.message,
    // polygon-mainnet
    error?.reason,
    // polygon-hardhat
    error?.error?.message,
  ].filter(Boolean)

  for (const msg of msgs) {
    const result = msg?.match(/Error: VM Exception while processing transaction: reverted with reason string '(.*)'/)
    if (result?.[1]) {
      return result[1]
    }
  }
  return JSON.stringify(error)
}

export const theGraphUrls = {
  cvi: {
    polygon: {
      platform: 'https://api.thegraph.com/subgraphs/name/vladi-coti/polygon-platforms',
    },
  },
  uniswapV2: {
    [BlockchainName.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
  },
  uniswapV3: {
    [BlockchainName.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
}

// https://stackoverflow.com/a/175787/806963
export function isNumeric(str?: unknown): boolean {
  return (
    str !== null &&
    str !== undefined &&
    // @ts-expect-error
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str as string)) // ...and ensure strings of whitespace fail
  )
}

export function getDateNowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function tokenToPositionUnitsAmount({ tokens, index }: { tokens: number; index: number }): number {
  return tokens * (200 / index)
}

export function positionUnitsAmountToToken({
  positionUnitsAmount,
  index,
}: {
  positionUnitsAmount: number
  index: number
}): number {
  return positionUnitsAmount * (index / 200)
}

export async function getCurrentCviIndex(): Promise<number> {
  const result = await axios.get<{
    status: 'Success' | string
    data: {
      CVI: {
        timestamp: number
        index: number
        oneDayChange: number
        oneDayChangePercent: number
        oneHourAgo: number
        oneWeekHigh: number
        oneWeekLow: number
      }
      ETHVOL: {
        timestamp: number
        index: number
        oneDayChange: number
        oneDayChangePercent: number
        oneHourAgo: number
        oneWeekHigh: number
        oneWeekLow: number
      }
    }
  }>('https://api-v2.cvi.finance/latest')

  return result.data.data.CVI.index
}

export type AllowedPropertiesOfCalculateCustomPremiumUsdcParams = Exclude<
  keyof CalculateCustomPremiumValues,
  'premiumParams'
>

export function transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
  tokenUSDC,
  propertyName,
  propertyValue,
}: {
  tokenUSDC: Token<IERC20, TokenName.USDC>
  propertyName:
    | AllowedPropertiesOfCalculateCustomPremiumUsdcParams
    | keyof CalculateCustomPremiumValues['premiumParams']
  propertyValue: BigNumber
}): number {
  switch (propertyName) {
    case 'premiumGrowthStart':
    case 'premiumSlope':
    case 'cvi':
      return toNumber(propertyValue, 18)
    case 'expectedLPTokensValueGrowth':
      return toNumber(propertyValue, 4)
    case 'liquidityUsdc':
    case 'lpTokensWorthAtBuyTimeUsdc':
    case 'totalLPTokensWorthAtBuyTimeUsdc':
      return tokenUSDC.toNumber(propertyValue)
    case 'maxILProtectedPercentage':
      return toNumber(propertyValue, 2)
    case 'A':
      return Number(toNumber(propertyValue, 18).toFixed(10))
    case 'X0':
      return Number(toNumber(propertyValue, 18).toFixed(4))
    case 'C':
      return Number(toNumber(propertyValue, 18).toFixed(10))
  }
}

export function transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
  tokenUSDC,
  propertyName,
  propertyValue,
}: {
  tokenUSDC: Token<IERC20, TokenName.USDC>
  propertyName:
    | AllowedPropertiesOfCalculateCustomPremiumUsdcParams
    | keyof CalculateCustomPremiumValues['premiumParams']
  propertyValue: number | string
}): BigNumber {
  switch (propertyName) {
    case 'premiumGrowthStart':
    case 'premiumSlope':
    case 'cvi':
      return fromNumber(propertyValue, 18)
    case 'expectedLPTokensValueGrowth':
      return fromNumber(propertyValue, 4)
    case 'liquidityUsdc':
    case 'lpTokensWorthAtBuyTimeUsdc':
    case 'totalLPTokensWorthAtBuyTimeUsdc':
      return tokenUSDC.fromNumber(propertyValue)
    case 'maxILProtectedPercentage':
      return fromNumber(propertyValue, 2)
    case 'A':
    case 'X0':
    case 'C':
      return fromNumber(propertyValue, 18)
  }
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export function safeObjectEntries<T>(obj?: T) {
  if (obj === undefined) {
    return [] as Entries<T>
  }
  // @ts-ignore
  return Object.entries(obj) as Entries<T>
}

export function strictObjectKeys<T>(obj: T) {
  return safeObjectEntries(obj).map(e => e[0])
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
type Cast<X, Y> = X extends Y ? X : Y
type FromEntries<T> = T extends [infer Key, any][]
  ? { [K in Cast<Key, string>]: Extract<ArrayElement<T>, [K, any]>[1] }
  : { [key in string]: any }

export function strictObjectFromEntries<T, Arr extends Iterable<readonly [PropertyKey, T]>>(
  arr: Arr,
): FromEntries<Arr> {
  return Object.fromEntries(arr) as FromEntries<Arr>
}

export function catDecimalsBase(
  number: number,
  decimalsToCat: number,
  options?: {
    useToFixed?: boolean
  },
): string {
  if (options?.useToFixed) {
    return Number(number).toFixed(decimalsToCat)
  }
  return Number(number).toLocaleString('en-US', { maximumFractionDigits: decimalsToCat, useGrouping: false })
}

export function catDecimalsWithRound(number: number, decimalsToCat: number): number {
  return Number(catDecimalsBase(number, decimalsToCat))
}

export function catDecimalsNoRoundUp(number: number, decimalsToCat: number) {
  let i = 0
  let s = '1'
  while (i < decimalsToCat) {
    s += '0'
    i++
  }
  const numOfDeci = Number(s)
  const r = Math.trunc(number * numOfDeci) / numOfDeci
  return r === 0 ? 0 : r // replace -0 -> 0
}

export const aprToAPY = (apr: number, n = 365): number => {
  return ((1 + apr / 100 / n) ** n - 1) * 100
}

export const enumKeys = <TEnumKey extends string, TEnumValue extends string | number>(enumVariable: {
  [key in TEnumKey]: TEnumValue
}) => {
  return (Object.keys(enumVariable) as TEnumKey[]).filter(e => !isNum(e))
}

export const enumValues = <TEnumKey extends string, TEnumValue extends string | number>(enumVariable: {
  [key in TEnumKey]: TEnumValue
}) => {
  return enumKeys(enumVariable).map(k => enumVariable[k]) as TEnumValue[]
}

export function getScore<T extends { blockNumber: number; transactionIndex?: number; logIndex?: number }>({
  blockNumber,
  transactionIndex,
  logIndex,
}: T): number {
  return blockNumber * 1_000_000 + (transactionIndex ?? 0) * 1000 + (logIndex ?? 0)
}

export const sortEventsAsc = (
  a: { blockNumber: number; transactionIndex: number; logIndex: number },
  b: { blockNumber: number; transactionIndex: number; logIndex: number },
) => getScore(a) - getScore(b)
