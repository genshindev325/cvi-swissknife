import type {
  AvailableProtectionsInversifyService,
  CVIOracleInversifyService,
  EmbedArmadilloDiscountInversifyService,
  GlobalEventsInversifyService,
  IERC20,
  ILAdminApiInversifyService,
  ILContractsEventsInversifyService,
  ILProtectionInversifyService,
  Token,
  TokenName,
} from '@coti-cvi/lw-sdk/src'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk/src'
import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'
import usePromise from 'react-use-promise'
import { useWallet } from '../../hooks/useWallet'
import { useILChainId } from '../../hooks/useILChainId'
import React from 'react'
export interface ILInversifyServicesProviderApi {
  availableProtectionsInversifyService?: AvailableProtectionsInversifyService
  iLAdminApiInversifyService?: ILAdminApiInversifyService
  iLContractsEventsInversifyService?: ILContractsEventsInversifyService
  iLProtectionInversifyService?: ILProtectionInversifyService
  cviOracleInversifyService?: CVIOracleInversifyService
  embedArmadilloDiscountInversifyService?: EmbedArmadilloDiscountInversifyService
  globalEventsInversifyService?: GlobalEventsInversifyService
  tokenUSDC?: Token<IERC20, TokenName.USDC>
}

const defaultChainContext: ILInversifyServicesProviderApi = {}

export const ilInversifyServicesContext = createContext(defaultChainContext)

export const ILInversifyServicesProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { inversifyContainer, globalEventsInversifyService } = useWallet()
  const chainId = useILChainId()

  const [availableProtectionsInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(
        CHAIN_IDS_INFO[chainId].blockchainName,
        'AvailableProtectionsInversifyService',
      ),
    [chainId, inversifyContainer],
  )
  const [iLAdminApiInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILAdminApiInversifyService'),
    [chainId, inversifyContainer],
  )
  const [iLContractsEventsInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILContractsEventsInversifyService'),
    [chainId, inversifyContainer],
  )
  const [iLProtectionInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILProtectionInversifyService'),
    [chainId, inversifyContainer],
  )

  const [tokenUSDC] = usePromise(
    async () => inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC'),
    [chainId, inversifyContainer],
  )

  const [cviOracleInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIOracleInversifyService'),
    [chainId, inversifyContainer],
  )
  const [embedArmadilloDiscountInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(
        CHAIN_IDS_INFO[chainId].blockchainName,
        'EmbedArmadilloDiscountInversifyService',
      ),
    [chainId, inversifyContainer],
  )

  return (
    <ilInversifyServicesContext.Provider
      value={{
        availableProtectionsInversifyService,
        iLAdminApiInversifyService,
        iLContractsEventsInversifyService,
        iLProtectionInversifyService,
        tokenUSDC,
        cviOracleInversifyService,
        embedArmadilloDiscountInversifyService,
        globalEventsInversifyService,
      }}
    >
      {children}
    </ilInversifyServicesContext.Provider>
  )
}
