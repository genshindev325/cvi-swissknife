import { Container } from 'inversify'
import type {
  ChainId,
  GetContractInversifyService,
  Contracts,
  ChainsInfo,
  IlSupportedChainIds,
  HardhatAdvanceTimeInversifyService,
  HardhatImpersonateAccountInversifyService,
} from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import { BlockchainName } from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  ETHPriceInversifyService,
  createCommonModule,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<ChainId>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'HardhatAdvanceTimeInversifyService'): Promise<HardhatAdvanceTimeInversifyService>
  (token: 'HardhatImpersonateAccountInversifyService'): Promise<HardhatImpersonateAccountInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ETHPriceInversifyService',
  ): Promise<ETHPriceInversifyService>
}

export type InitInversifyReturnType = {
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => void
}

export function initInversify(chainId: ChainId): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('ChainId').toConstantValue(chainId)

  container.load(
    createCommonModule({ chainId, impersonatedPublicWalletAddress: '0x1505FB0435dc83e3a0A1f5780a991008382E8262' }),
  )
  container.load(createContractsModule({ chainId }))

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  if (CHAIN_IDS_INFO[chainId].blockchainName === BlockchainName.POLYGON) {
    container.bind('ETHPriceInversifyService').to(ETHPriceInversifyService)
  }

  return inversifyBuilder<BlockchainName>(container, globalEventsInversifyService)
}
