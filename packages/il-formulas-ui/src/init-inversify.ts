/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import type {
  BlockchainName,
  GetContractInversifyService,
  IERC20,
  ILProtectionInversifyService,
  IlSupportedChainIds,
  Token,
  TokenName,
  Contracts,
  IlContractsInversifyService,
  ChainsInfo,
  CVIOracleInversifyService,
} from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
  CustomError,
  createIlFrontendsModule,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<IlSupportedChainIds>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'CVIOracleInversifyService',
  ): Promise<CVIOracleInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'IlContractsInversifyService',
  ): Promise<IlContractsInversifyService>
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

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  globalEventsInversifyService.eventEmitter.on('errors', error => {
    CustomError.printErrorToConsole(error)
  })

  container.load(createCommonModule({ chainId }))
  container.load(createContractsModule({ chainId }))
  container.load(createIlFrontendsModule({ chainId }))

  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)
  return inversifyBuilder<BlockchainName>(container, globalEventsInversifyService)
}
