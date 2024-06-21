import { JsonRpcProvider } from '@ethersproject/providers'
import { Container, ContainerModule } from 'inversify'
import type { ChainId, Contracts } from '@coti-cvi/lw-sdk'
import {
  CHAIN_IDS_INFO,
  GlobalEventsInversifyService,
  GetContractInversifyService,
  getSingleDeploymentsFile,
  LatestBlockInfoInversifyService,
  PolygonContractsInversifyService,
  PolygonPositionsTheGraphInversifyService,
} from '@coti-cvi/lw-sdk'

export type InitInversifyReturnType = Pick<Container, 'get' | 'getAsync'> & {
  closeContainer: () => void
}

export function initInversify(chainId: ChainId): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind<ChainId>('ChainId').toConstantValue(chainId)

  container.bind('EthersJsonRpcBatchProvider').toConstantValue(new JsonRpcProvider(CHAIN_IDS_INFO[chainId].cviRpcUrl))

  container.bind<Contracts>('SingleDeploymentsFile').toDynamicValue(() => getSingleDeploymentsFile(chainId))

  container.bind('GetContractInversifyService').to(GetContractInversifyService)

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  const polygonModule = new ContainerModule(bind => {
    bind('PolygonPositionsTheGraphInversifyService').to(PolygonPositionsTheGraphInversifyService)
    bind('PolygonContractsInversifyService').to(PolygonContractsInversifyService)
    // bind more polygon services here...
  })

  const ethereumModule = new ContainerModule(bind => {
    // bind more ethereum services here...
  })

  switch (CHAIN_IDS_INFO[chainId].blockchainName) {
    case 'polygon':
      container.load(polygonModule)
      break
    case 'ethereum':
      container.load(ethereumModule)
      break
  }

  return {
    get: container.get.bind(container),
    getAsync: container.getAsync.bind(container),
    closeContainer: () => {
      switch (CHAIN_IDS_INFO[chainId].blockchainName) {
        case 'polygon':
          container.unload(polygonModule)
          break
        case 'ethereum':
          container.unload(ethereumModule)
          break
      }
    },
  }
}
