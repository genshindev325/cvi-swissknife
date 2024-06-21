/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import type {
  IERC20,
  ChainId,
  Token,
  TokenName,
  GetChainlinkTokenPriceAggregatorsInversifyService,
  BlockchainName,
} from '@coti-cvi/lw-sdk'
import type { GmxInversifyService } from '@coti-cvi/lw-sdk'
import { CustomError } from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import { GlobalEventsInversifyService } from '@coti-cvi/lw-sdk'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<ChainId>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: BlockchainName,
    token: 'GetChainlinkTokenPriceAggregatorsInversifyService',
  ): Promise<GetChainlinkTokenPriceAggregatorsInversifyService>
  (blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON, token: 'TokenUSDC'): Promise<
    Token<IERC20, TokenName.USDC>
  >
  (blockchainName: BlockchainName.ARBITRUM, token: 'GmxInversifyService'): Promise<GmxInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => void
}

export function initInversify(chainId: ChainId): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('ChainId').toConstantValue(chainId)

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')
  globalEventsInversifyService.eventEmitter.on('errors', error => CustomError.printErrorToConsole(error))

  return inversifyBuilder(container, globalEventsInversifyService)
}
