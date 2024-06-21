import { injectable } from 'inversify'
import type { BlockchainEventBase } from '../types'
import type { Event } from 'ethers'

import type {
  ExecuteDecreasePositionEvent,
  ExecuteIncreasePositionEvent,
} from '../../../../auto-generated-code/src/common-abi-types/GmxPositionRouter'
import type { FormattedExecuteDecreasePositionEvent, FormattedExecuteIncreasePositionEvent } from '../gmx-types'
import { toNumber } from '../../util'

@injectable()
export class FormatGmxContractsEventsInversifyService {
  public formatBaseProtectionBoughtEvent(e: Event): BlockchainEventBase {
    return {
      blockNumber: e.blockNumber,
      logIndex: e.logIndex,
      transactionHash: e.transactionHash,
      transactionIndex: e.transactionIndex,
    }
  }

  public toFormattedExecuteIncreasePosition({
    e,
    decimals,
  }: {
    e: ExecuteIncreasePositionEvent
    decimals: {
      acceptablePrice: number
      amountIn: number
      executionFee: number
      minOut: number
      sizeDeltaUsd: number
    }
  }): FormattedExecuteIncreasePositionEvent {
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'ExecuteIncreasePositionEvent',
      args: {
        acceptablePrice: toNumber(e.args.acceptablePrice, decimals.acceptablePrice),
        account: e.args.account,
        amountIn: toNumber(e.args.amountIn, decimals.amountIn),
        blockGap: e.args.blockGap.toNumber(),
        executionFee: toNumber(e.args.executionFee, decimals.executionFee),
        tokenToLongOrShort: e.args.indexToken,
        isLong: e.args.isLong,
        minOut: toNumber(e.args.minOut, decimals.minOut),
        path: e.args.path.length === 1 ? [e.args.path[0]] : [e.args.path[0], e.args.path[1]],
        sizeDeltaUsd: toNumber(e.args.sizeDelta, decimals.sizeDeltaUsd),
        timeGap: e.args.timeGap.toNumber(),
      },
    }
  }

  public toFormattedExecuteDecreasePosition({
    e,
    decimals,
  }: {
    e: ExecuteDecreasePositionEvent
    decimals: {
      acceptablePrice: number
      collateralDelta: number
      executionFee: number
      minOut: number
      sizeDeltaUsd: number
      blockGap: number
    }
  }): FormattedExecuteDecreasePositionEvent {
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'ExecuteDecreasePositionEvent',
      args: {
        collateralDelta: toNumber(e.args.collateralDelta, decimals.collateralDelta),
        receiver: e.args.receiver,
        acceptablePrice: toNumber(e.args.acceptablePrice, decimals.acceptablePrice),
        account: e.args.account,
        blockGap: toNumber(e.args.blockGap, decimals.blockGap),
        executionFee: toNumber(e.args.executionFee, decimals.executionFee),
        tokenToLongOrShort: e.args.indexToken,
        isLong: e.args.isLong,
        minOut: toNumber(e.args.minOut, decimals.minOut),
        path: e.args.path.length === 1 ? [e.args.path[0]] : [e.args.path[0], e.args.path[1]],
        sizeDeltaUsd: toNumber(e.args.sizeDelta, decimals.sizeDeltaUsd), // verified
        timeGap: e.args.timeGap.toNumber(),
      },
    }
  }
}
