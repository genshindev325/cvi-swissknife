/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import type {
  CVIOracleInversifyService,
  IERC20,
  Token,
  TokenName,
  Contracts,
  ChainsInfo,
  GetContractInversifyService,
  CVISupportedChainIds,
  CviContractsInversifyService,
  CviCacheEventsApiInversifyService,
  VtInversifyService,
} from '@coti-cvi/lw-sdk'
import { createCviModule, LatestBlockInfoInversifyService } from '@coti-cvi/lw-sdk'
import { CustomError } from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import { createContractsModule, GlobalEventsInversifyService, createCommonModule } from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<CVISupportedChainIds>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CviContractsInversifyService',
  ): Promise<CviContractsInversifyService>
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CVIOracleInversifyService',
  ): Promise<CVIOracleInversifyService>
  (blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'], token: 'TokenUSDC'): Promise<
    Token<IERC20, TokenName.USDC>
  >
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CviCacheEventsApiInversifyService',
  ): Promise<CviCacheEventsApiInversifyService>
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CviCacheEventsApiInversifyService',
  ): Promise<CviCacheEventsApiInversifyService>
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'VtInversifyService',
  ): Promise<VtInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => void
}

export function initInversify(chainId: CVISupportedChainIds): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind<CVISupportedChainIds>('ChainId').toConstantValue(chainId)

  container.load(createCommonModule({ chainId }))
  container.load(createContractsModule({ chainId }))
  container.load(createCviModule())

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')
  globalEventsInversifyService.eventEmitter.on('errors', e => CustomError.printErrorToConsole(e))
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  return inversifyBuilder(container, globalEventsInversifyService)
}
