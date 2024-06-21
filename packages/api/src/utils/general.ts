/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from 'util'

export type ChainName = 'Ethereum' | 'Polygon' | 'Arbitrum'
export type Index = 'CVI' | 'ETHVOL'
export type DataSource = 'Anton' | 'Chainlink'

export const SECONDS_IN_MINUTE = 60
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

export const stringify = (varToStringify: any, depth = 3): string =>
  inspect(varToStringify, false /* showHidden */, depth)

export const fromDateStringToTimestampInSeconds = (dateString: string) => new Date(dateString).getTime() / 1000

export const getPercentageChange = (oldNumber: number, newNumber: number) => {
  const decreaseValue = oldNumber - newNumber
  return -1 * ((decreaseValue / oldNumber) * 100)
}

export const getClosestValueInObject = (data: unknown[], value: string, target: number) =>
  // @ts-ignore
  data.reduce((acc, obj) => (Math.abs(target - obj[`${value}`]) < Math.abs(target - acc[`${value}`]) ? obj : acc))

export const getClosestValueInArray = (data: unknown[], index: number, target: number) =>
  // @ts-ignore
  data.reduce((acc, arr) => (Math.abs(target - arr[index]) < Math.abs(target - acc[index]) ? arr : acc))
