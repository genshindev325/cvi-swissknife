import type { BlockchainEvent } from './types'

/** GENRAL NOTES:
 * For longs, the collateralToken must be the same as the indexToken
 * For shorts, the collateralToken can be any stablecoin token
 */

export type FormattedExecuteIncreasePositionEventObject = {
  account: string
  path: [tokenIn: string, collateralToken: string] | [tokenIn: string]
  tokenToLongOrShort: string
  amountIn: number
  minOut: number
  sizeDeltaUsd: number
  isLong: boolean
  acceptablePrice: number
  executionFee: number
  blockGap: number
  timeGap: number
}

export type FormattedExecuteIncreasePositionEvent = BlockchainEvent<
  'ExecuteIncreasePositionEvent',
  FormattedExecuteIncreasePositionEventObject
>

export type FormattedExecuteDecreasePositionEventObject = {
  account: string
  path: [tokenIn: string, collateralToken: string] | [tokenIn: string]
  tokenToLongOrShort: string
  minOut: number
  sizeDeltaUsd: number
  isLong: boolean
  acceptablePrice: number
  executionFee: number
  blockGap: number
  timeGap: number
  collateralDelta: number
  receiver: string
}

export type FormattedExecuteDecreasePositionEvent = BlockchainEvent<
  'ExecuteDecreasePositionEvent',
  FormattedExecuteDecreasePositionEventObject
>
