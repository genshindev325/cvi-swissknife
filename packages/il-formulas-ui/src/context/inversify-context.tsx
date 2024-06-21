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
} from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import React from 'react'
import { useAppSelector } from '../redux'
import type { InitInversifyReturnType } from '../init-inversify'
import { initInversify } from '../init-inversify'

export type InversifyContext = {
  inversify?: InitInversifyReturnType
  globalEventsInversifyService?: GlobalEventsInversifyService
  getContractInversifyService?: GetContractInversifyService
  latestBlockInfoInversifyService?: LatestBlockInfoInversifyService
  ilContractsInversifyService?: IlContractsInversifyService
  iLProtectionInversifyService?: ILProtectionInversifyService
  cviOracleInversifyService?: CVIOracleInversifyService
  tokenUSDC?: Token<IERC20, TokenName.USDC>
}

export const inversifyContext = createContext<InversifyContext>({})

export const InversifyProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const chainId = useAppSelector(state => state.state.chainId)
  const [inversify, setInversify] = useState<InitInversifyReturnType | undefined>()

  useEffect(() => {
    const i = initInversify(chainId)
    setInversify(i)
    return () => i.closeContainer()
  }, [chainId])

  const [globalEventsInversifyService] = usePromise(
    async () => inversify?.getAsync('GlobalEventsInversifyService'),
    [inversify],
  )
  const [getContractInversifyService] = usePromise(
    async () => inversify?.getAsync('GetContractInversifyService'),
    [inversify],
  )
  const [latestBlockInfoInversifyService] = usePromise(
    async () => inversify?.getAsync('LatestBlockInfoInversifyService'),
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

  return (
    <inversifyContext.Provider
      value={{
        inversify,
        globalEventsInversifyService,
        getContractInversifyService,
        latestBlockInfoInversifyService,
        ilContractsInversifyService,
        iLProtectionInversifyService,
        cviOracleInversifyService,
        tokenUSDC,
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
