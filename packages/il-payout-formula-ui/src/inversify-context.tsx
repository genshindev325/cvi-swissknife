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
} from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import React from 'react'
import { useAppSelector } from './redux'
import type { InitInversifyReturnType } from './init-inversify'
import { initInversify } from './init-inversify'

export interface InversifyContext {
  inversify: InitInversifyReturnType
  globalEventsInversifyService: GlobalEventsInversifyService
  getContractInversifyService: GetContractInversifyService
  latestBlockInfoInversifyService: LatestBlockInfoInversifyService
  ilContractsInversifyService: IlContractsInversifyService
  iLProtectionInversifyService: ILProtectionInversifyService
  cviOracleInversifyService: CVIOracleInversifyService
  getChainlinkTokenPriceAggregatorsInversifyService: GetChainlinkTokenPriceAggregatorsInversifyService
  tokenUSDC: Token<IERC20, TokenName.USDC>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inversifyContext = createContext<InversifyContext>(null as any)

export const InversifyProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { chainId } = useAppSelector(state => state.state)

  const [inversify, setInversify] = useState<InitInversifyReturnType | undefined>()

  useEffect(() => {
    const i = initInversify(chainId)
    setInversify(i)
    return () => i.closeContainer()
  }, [chainId])

  const [results] = usePromise(
    async () =>
      inversify &&
      Promise.all([
        inversify.getAsync('GlobalEventsInversifyService'),
        inversify.getAsync('GetContractInversifyService'),
        inversify.getAsync('LatestBlockInfoInversifyService'),
        inversify.getAsync('IlContractsInversifyService'),
        inversify.getAsync('GetChainlinkTokenPriceAggregatorsInversifyService'),
        inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILProtectionInversifyService'),
        inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIOracleInversifyService'),
        inversify.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC'),
      ]),
    [inversify, chainId],
  )

  if (!inversify || !results) {
    return null
  }

  return (
    <inversifyContext.Provider
      value={{
        inversify,
        globalEventsInversifyService: results[0],
        getContractInversifyService: results[1],
        latestBlockInfoInversifyService: results[2],
        ilContractsInversifyService: results[3],
        getChainlinkTokenPriceAggregatorsInversifyService: results[4],
        iLProtectionInversifyService: results[5],
        cviOracleInversifyService: results[6],
        tokenUSDC: results[7],
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
