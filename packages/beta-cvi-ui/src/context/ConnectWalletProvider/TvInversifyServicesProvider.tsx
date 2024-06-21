import type {
  CVIOracleInversifyService,
  GlobalEventsInversifyService,
  IERC20,
  StakingInversifyService,
  ThetaVaultInversifyService,
  Token,
  TokenName,
  TvContractsEventsInversifyService,
  VtInversifyService,
  VtContractsEventsInversifyService,
} from '@coti-cvi/lw-sdk/src'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk/src'
import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'
import usePromise from 'react-use-promise'
import { useWallet } from '../../hooks/useWallet'
import { useTvChainId } from '../../hooks/useTvChainId'
import React from 'react'
export interface CviInversifyServicesProviderApi {
  thetaVaultInversifyService?: ThetaVaultInversifyService
  tvContractsEventsInversifyService?: TvContractsEventsInversifyService
  stakingInversifyService?: StakingInversifyService
  globalEventsInversifyService?: GlobalEventsInversifyService
  cviOracleInversifyService?: CVIOracleInversifyService
  tokenUSDC?: Token<IERC20, TokenName.USDC>
  tokenGOVI?: Token<IERC20, TokenName.GOVI>
  vtInversifyService?: VtInversifyService
  vtContractsEventsInversifyService?: VtContractsEventsInversifyService
}

const defaultChainContext: CviInversifyServicesProviderApi = {}

export const cviInversifyServicesContext = createContext(defaultChainContext)

export const TvInversifyServicesProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { inversifyContainer } = useWallet()
  const chainId = useTvChainId()

  const [thetaVaultInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ThetaVaultInversifyService'),
    [chainId, inversifyContainer],
  )

  const [stakingInversifyService] = usePromise(
    async () => inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'StakingInversifyService'),
    [chainId, inversifyContainer],
  )

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const [tokenUSDC] = usePromise(
    async () => inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC'),
    [chainId, inversifyContainer],
  )
  const [tokenGOVI] = usePromise(
    async () => inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenGOVI'),
    [chainId, inversifyContainer],
  )

  const [cviOracleInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIOracleInversifyService'),
    [chainId, inversifyContainer],
  )

  const [tvContractsEventsInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TvContractsEventsInversifyService'),
    [chainId, inversifyContainer],
  )

  const [vtInversifyService] = usePromise(
    async () => inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'VtInversifyService'),
    [chainId, inversifyContainer],
  )

  const [vtContractsEventsInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'VtContractsEventsInversifyService'),
    [chainId, inversifyContainer],
  )

  return (
    <cviInversifyServicesContext.Provider
      value={{
        thetaVaultInversifyService,
        stakingInversifyService,
        globalEventsInversifyService,
        tokenUSDC,
        tokenGOVI,
        cviOracleInversifyService,
        tvContractsEventsInversifyService,
        vtInversifyService,
        vtContractsEventsInversifyService,
      }}
    >
      {children}
    </cviInversifyServicesContext.Provider>
  )
}
