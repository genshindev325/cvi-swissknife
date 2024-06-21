import type {
  CVIOracleInversifyService,
  GlobalEventsInversifyService,
  GetContractInversifyService,
  ILProtectionInversifyService,
  LatestBlockInfoInversifyService,
  IlContractsInversifyService,
  Token,
  IERC20,
  TokenName,
  GetChainlinkTokenPriceAggregatorsInversifyService,
  ILContractsEventsInversifyService,
  EmbedArmadilloDiscountInversifyService,
} from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import React from 'react'
import { useAppSelector } from './redux'
import type { InitInversifyReturnType } from './init-inversify'
import { initInversify } from './init-inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { AsyncQueueInversifyService } from '@coti-cvi/lw-sdk/src/async-queue.inversify.service'

export interface InversifyContext {
  inversify?: InitInversifyReturnType
  ethersJsonRpcBatchProvider?: JsonRpcProvider
  globalEventsInversifyService?: GlobalEventsInversifyService
  ilContractsEventsInversifyService?: ILContractsEventsInversifyService
  getContractInversifyService?: GetContractInversifyService
  latestBlockInfoInversifyService?: LatestBlockInfoInversifyService
  ilContractsInversifyService?: IlContractsInversifyService
  iLProtectionInversifyService?: ILProtectionInversifyService
  cviOracleInversifyService?: CVIOracleInversifyService
  getChainlinkTokenPriceAggregatorsInversifyService?: GetChainlinkTokenPriceAggregatorsInversifyService
  embedArmadilloDiscountInversifyService?: EmbedArmadilloDiscountInversifyService
  asyncQueueInversifyService?: AsyncQueueInversifyService
  tokenUSDC?: Token<IERC20, TokenName.USDC>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inversifyContext = createContext<InversifyContext>({})

export const InversifyProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const chainId = useAppSelector(state => state.chainId)
  const [inversify, setInversify] = useState<InitInversifyReturnType | undefined>()

  useEffect(() => {
    const i = initInversify(chainId)
    setInversify(i)
    return () => i.closeContainer()
  }, [chainId])

  const [globalEventsInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('GlobalEventsInversifyService'),
    [inversify],
  )
  const [getContractInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('GetContractInversifyService'),
    [inversify],
  )
  const [latestBlockInfoInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('LatestBlockInfoInversifyService'),
    [inversify],
  )
  const [getChainlinkTokenPriceAggregatorsInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('GetChainlinkTokenPriceAggregatorsInversifyService'),
    [inversify],
  )
  const [ethersJsonRpcBatchProvider] = usePromise(
    async () => inversify && inversify.getAsync('EthersJsonRpcBatchProvider'),
    [inversify],
  )
  const [ilContractsInversifyService] = usePromise(
    async () =>
      inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'IlContractsInversifyService'),
    [chainId, inversify],
  )
  const [iLProtectionInversifyService] = usePromise(
    async () =>
      inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILProtectionInversifyService'),
    [chainId, inversify],
  )
  const [cviOracleInversifyService] = usePromise(
    async () =>
      inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIOracleInversifyService'),
    [chainId, inversify],
  )
  const [tokenUSDC] = usePromise(
    async () => inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC'),
    [chainId, inversify],
  )
  const [ilContractsEventsInversifyService] = usePromise(
    async () =>
      inversify &&
      inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILContractsEventsInversifyService'),
    [chainId, inversify],
  )
  const [embedArmadilloDiscountInversifyService] = usePromise(
    async () =>
      inversify &&
      inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'EmbedArmadilloDiscountInversifyService'),
    [chainId, inversify],
  )
  const [asyncQueueInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('AsyncQueueInversifyService'),
    [inversify],
  )

  return (
    <inversifyContext.Provider
      value={{
        inversify,
        globalEventsInversifyService,
        getContractInversifyService,
        latestBlockInfoInversifyService,
        ilContractsInversifyService,
        getChainlinkTokenPriceAggregatorsInversifyService,
        iLProtectionInversifyService,
        cviOracleInversifyService,
        tokenUSDC,
        ilContractsEventsInversifyService,
        ethersJsonRpcBatchProvider,
        embedArmadilloDiscountInversifyService,
        asyncQueueInversifyService,
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
