import type {
  GlobalEventsInversifyService,
  GetContractInversifyService,
  IlSupportedChainIds,
  TvSupportedChainIds,
  VestingSupportedChainIds,
  LatestBlockInfoInversifyService,
  SignerInversifyService,
  HardhatAdvanceTimeInversifyService,
  HardhatCommandsInversifyService,
  ProviderInversifyService,
  UniswapInversifyService,
  CVISupportedChainIds,
  GenericContractInteractionInversifyService,
  OverridesInversifyService,
  HardhatSupportedChainIds,
} from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import {
  ChainId,
  IL_SUPPORTED_CHAIN_IDS,
  TV_SUPPORTED_CHAIN_IDS,
  CVI_SUPPORTED_CHAIN_IDS,
  VESTING_SUPPORTED_CHAIN_IDS,
  HARDHAT_SUPPORTED_CHAIN_IDS,
} from '@coti-cvi/lw-sdk'
import type { Signer } from 'ethers'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import type { InversifyContainer } from '../init-inversify'
import { initInversify } from '../init-inversify'
import React from 'react'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { Chain } from 'wagmi'
import { configureChains, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export interface InverifyContext {
  inversifyContainer?: InversifyContainer
  chainId: ChainId
  setChainId?: Dispatch<SetStateAction<ChainId>>
  useCVIChainId?: () => CVISupportedChainIds
  useILChainId?: () => IlSupportedChainIds
  useTVChainId?: () => TvSupportedChainIds
  useVestingChainId?: () => VestingSupportedChainIds
  useHardhatChainId?: () => HardhatSupportedChainIds
  useEthChainId?: () => ChainId.EthereumLocal | ChainId.EthereumMainnet | ChainId.EthereumStaging
  useWagmiClient?: () => ReturnType<typeof useWagmiClient>
  globalEventsInversifyService?: GlobalEventsInversifyService
  getContractInversifyService?: GetContractInversifyService
  latestBlockInfoInversifyService?: LatestBlockInfoInversifyService
  signerInversifyService?: SignerInversifyService
  ethersJsonRpcBatchProvider?: JsonRpcProvider
  HardhatAdvanceTimeInversifyService?: HardhatAdvanceTimeInversifyService
  hardhatCommandsInversifyService?: HardhatCommandsInversifyService
  providerInversifyService?: ProviderInversifyService
  overridesInversifyService?: OverridesInversifyService
  uniswapInversifyService?: UniswapInversifyService
  genericContractInteractionInversifyService?: GenericContractInteractionInversifyService
  setSigner?: (
    options:
      | {
          privateKey: string
        }
      | { impersonatedPublicWalletAddress: string }
      | { signer: Signer },
  ) => void
}

export const DEFAULT_CHAIN_ID: ChainId = (localStorage.getItem('chainId') as ChainId) || ChainId.PolygonMainnet

export const DEFAULT_ACCOUNT = localStorage.getItem('account') || '0x72B31859c516947cE37A13bf0e6d4AD51d151A8e'

export const inversifyContext = createContext<InverifyContext>({
  chainId: DEFAULT_CHAIN_ID,
})

export function useCVIChainId(chainId: ChainId) {
  const cviChainId = CVI_SUPPORTED_CHAIN_IDS.find(c => c === chainId)

  if (!cviChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in CVI Components`)
  }

  return cviChainId
}

export function useILChainId(chainId: ChainId) {
  const ilChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === chainId)

  if (!ilChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in IL Components`)
  }

  return ilChainId
}

export function useTVChainId(chainId: ChainId) {
  const tvChainId = TV_SUPPORTED_CHAIN_IDS.find(c => c === chainId)

  if (!tvChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in TV Components`)
  }

  return tvChainId
}

export function useVestingChainId(chainId: ChainId) {
  const vestingChainId = VESTING_SUPPORTED_CHAIN_IDS.find(c => c === chainId)

  if (!vestingChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in Vesting Components`)
  }

  return vestingChainId
}

export function useHardhatChainId(chainId: ChainId) {
  const hardhatChainId = HARDHAT_SUPPORTED_CHAIN_IDS.find(c => c === chainId)

  if (!hardhatChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in hardhat functions`)
  }

  return hardhatChainId
}

export function useEthChainId(chainId: ChainId) {
  const ethChainId =
    (chainId === ChainId.EthereumLocal || chainId === ChainId.EthereumMainnet || chainId === ChainId.EthereumStaging) &&
    chainId

  if (!ethChainId) {
    throw new Error(`ChainId: ${chainId} is not supported in Eth Components`)
  }

  return ethChainId
}

// @ts-ignore
export function useWagmiClient(): ReturnType<typeof useWagmiClient> {
  const chainsInfo = Object.values(ChainId)
    .map(chainId => CHAIN_IDS_INFO[chainId])
    .map<Chain>(chainInfo => ({
      id: Number(chainInfo.chainId),
      name: chainInfo.hardhatConfigNetworkName,
      network: chainInfo.networkName,
      nativeCurrency: chainInfo.nativeCurrency,
      blockExplorers:
        chainInfo.blockExplorerUrl === undefined
          ? undefined
          : {
              default: {
                name: 'Block Explorer',
                url: chainInfo.blockExplorerUrl,
              },
            },
      rpcUrls: {
        default: chainInfo.cviRpcUrl,
      },
    }))

  const { chains, provider, webSocketProvider } = configureChains(chainsInfo, [
    jsonRpcProvider({
      priority: 0,
      rpc: chain => ({
        http: chain.rpcUrls.default,
      }),
      static: false,
    }),
  ])

  return createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'cli',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
}

export const InversifyProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [chainId, setChainId] = useState<ChainId>(DEFAULT_CHAIN_ID)

  const [inversifyContainer, setInversifyContainer] = useState<InversifyContainer>()

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const [getContractInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GetContractInversifyService'),
    [inversifyContainer],
  )

  const [latestBlockInfoInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('LatestBlockInfoInversifyService'),
    [inversifyContainer],
  )

  const [signerInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('SignerInversifyService'),
    [inversifyContainer],
  )

  const [ethersJsonRpcBatchProvider] = usePromise(
    async () => inversifyContainer?.getAsync('EthersJsonRpcBatchProvider'),
    [inversifyContainer],
  )

  const [hardhatCommandsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('HardhatCommandsInversifyService'),
    [inversifyContainer],
  )

  const [HardhatAdvanceTimeInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('HardhatAdvanceTimeInversifyService'),
    [inversifyContainer],
  )

  const [providerInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('ProviderInversifyService'),
    [inversifyContainer],
  )

  const [overridesInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('OverridesInversifyService'),
    [inversifyContainer],
  )

  const [uniswapInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('UniswapInversifyService'),
    [inversifyContainer],
  )

  const [genericContractInteractionInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GenericContractInteractionInversifyService'),
    [inversifyContainer],
  )

  const [impersonatedAddress, setImpersonatedAddress] = useState<string | undefined>(DEFAULT_ACCOUNT)

  const [privateKey, setPrivateKey] = useState<string | undefined>()

  const [signer, setSignerData] = useState<Signer | undefined>()

  useEffect(() => {
    if (chainId) {
      const con = initInversify({
        chainId,
        ...(signer
          ? { signer }
          : privateKey
          ? { privateKey }
          : { impersonatedPublicWalletAddress: impersonatedAddress }),
      })

      setInversifyContainer(con)

      return () => {
        setInversifyContainer(undefined)
        con.closeContainer()
      }
    }
  }, [chainId, impersonatedAddress, privateKey, signer])

  const setSigner = useCallback(
    (
      options:
        | {
            privateKey: string
          }
        | { impersonatedPublicWalletAddress: string }
        | { signer: Signer },
    ) => {
      if ('privateKey' in options) {
        setPrivateKey(options.privateKey)
      } else if ('impersonatedPublicWalletAddress' in options) {
        setImpersonatedAddress(options.impersonatedPublicWalletAddress)
      } else {
        setSignerData(options.signer)
      }
    },
    [],
  )

  return (
    <inversifyContext.Provider
      value={{
        setSigner,
        chainId,
        useCVIChainId: () => useCVIChainId(chainId),
        useILChainId: () => useILChainId(chainId),
        useTVChainId: () => useTVChainId(chainId),
        useVestingChainId: () => useVestingChainId(chainId),
        useHardhatChainId: () => useHardhatChainId(chainId),
        useEthChainId: () => useEthChainId(chainId),
        useWagmiClient: () => useWagmiClient(),
        inversifyContainer,
        setChainId,
        getContractInversifyService,
        providerInversifyService,
        hardhatCommandsInversifyService,
        HardhatAdvanceTimeInversifyService,
        ethersJsonRpcBatchProvider,
        globalEventsInversifyService,
        latestBlockInfoInversifyService,
        signerInversifyService,
        overridesInversifyService,
        uniswapInversifyService,
        genericContractInteractionInversifyService,
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
