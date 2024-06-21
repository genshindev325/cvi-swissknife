import type {
  CVIOracleInversifyService,
  GlobalEventsInversifyService,
  GetContractInversifyService,
  LatestBlockInfoInversifyService,
  Token,
  IERC20,
  TokenName,
  CviContractsInversifyService,
  CviCacheEventsApiInversifyService,
  VtInversifyService,
} from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'

import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import React from 'react'
import { useAppSelector } from '../redux'
import type { InitInversifyReturnType } from '../init-inversify'
import { initInversify } from '../init-inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'

export interface InversifyContext {
  inversify?: InitInversifyReturnType
  ethersJsonRpcBatchProvider?: JsonRpcProvider
  globalEventsInversifyService?: GlobalEventsInversifyService
  getContractInversifyService?: GetContractInversifyService
  latestBlockInfoInversifyService?: LatestBlockInfoInversifyService
  cviOracleInversifyService?: CVIOracleInversifyService
  cviContractsInversifyService?: CviContractsInversifyService
  tokenUSDC?: Token<IERC20, TokenName.USDC>
  cviCacheEventsApiInversifyService?: CviCacheEventsApiInversifyService
  vtInversifyService?: VtInversifyService
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

  const [ethersJsonRpcBatchProvider] = usePromise(
    async () => inversify && inversify.getAsync('EthersJsonRpcBatchProvider'),
    [inversify],
  )

  const [cviOracleInversifyService] = usePromise(
    async () =>
      inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIOracleInversifyService'),
    [chainId, inversify],
  )

  const [cviContractsInversifyService] = usePromise(
    async () =>
      inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CviContractsInversifyService'),
    [chainId, inversify],
  )

  const [tokenUSDC] = usePromise(
    async () => inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC'),
    [chainId, inversify],
  )

  const [cviCacheEventsApiInversifyService] = usePromise(
    async () =>
      inversify &&
      inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CviCacheEventsApiInversifyService'),
    [chainId, inversify],
  )

  const [vtInversifyService] = usePromise(
    async () => inversify && inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'VtInversifyService'),
    [chainId, inversify],
  )

  return (
    <inversifyContext.Provider
      value={{
        inversify,
        cviContractsInversifyService,
        globalEventsInversifyService,
        getContractInversifyService,
        latestBlockInfoInversifyService,
        cviOracleInversifyService,
        tokenUSDC,
        ethersJsonRpcBatchProvider,
        cviCacheEventsApiInversifyService,
        vtInversifyService,
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
