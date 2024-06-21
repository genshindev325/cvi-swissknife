/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import type {
  BlockchainName,
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
} from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
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
  (token: 'IlContractsInversifyService'): Promise<IlContractsInversifyService>
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
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  return inversifyBuilder<BlockchainName>(container, globalEventsInversifyService)
}
