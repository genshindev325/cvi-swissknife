/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import type {
  CVIOracleInversifyService,
  GetContractInversifyService,
  IERC20,
  ILProtectionInversifyService,
  IlSupportedChainIds,
  Token,
  TokenName,
  Contracts,
  IlContractsInversifyService,
  ChainsInfo,
  GetChainlinkTokenPriceAggregatorsInversifyService,
  ILContractsEventsInversifyService,
  EmbedArmadilloDiscountInversifyService,
} from '@coti-cvi/lw-sdk'
import { CustomError } from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import { createIlFrontendsModule } from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { AsyncQueueInversifyService } from '@coti-cvi/lw-sdk/src/async-queue.inversify.service'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<IlSupportedChainIds>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'AsyncQueueInversifyService'): Promise<AsyncQueueInversifyService>
  (
    token: 'GetChainlinkTokenPriceAggregatorsInversifyService',
  ): Promise<GetChainlinkTokenPriceAggregatorsInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'CVIOracleInversifyService',
  ): Promise<CVIOracleInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'EmbedArmadilloDiscountInversifyService',
  ): Promise<EmbedArmadilloDiscountInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'IlContractsInversifyService',
  ): Promise<IlContractsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILContractsEventsInversifyService',
  ): Promise<ILContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILProtectionInversifyService',
  ): Promise<ILProtectionInversifyService>
  (blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'], token: 'TokenUSDC'): Promise<
    Token<IERC20, TokenName.USDC>
  >
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => void
}

export function initInversify(chainId: IlSupportedChainIds): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind<IlSupportedChainIds>('ChainId').toConstantValue(chainId)

  container.load(createCommonModule({ chainId }))
  container.load(createContractsModule({ chainId }))
  container.load(createIlFrontendsModule({ chainId }))

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')
  globalEventsInversifyService.eventEmitter.on('errors', e => CustomError.printErrorToConsole(e))
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  return inversifyBuilder(container, globalEventsInversifyService)
}
