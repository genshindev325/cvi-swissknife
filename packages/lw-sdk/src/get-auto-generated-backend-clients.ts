import {
  ChatGptServerClientApi,
  chatgptServerWrapperClientApi,
  CoinGeckoClientApi,
  CviBackendClientApi,
  CviOracleEventsBackend,
  DataFeedClientApi,
  IlBackendClientApi,
  PyParabolaCoefficientsClientApi,
} from '@coti-cvi/auto-generated-code'
import { CHAIN_IDS_INFO, NetworkName } from './types'
import type { IlSupportedChainIds } from './types'

export enum BackendEnvironment {
  Local = 'local',
  K8s = 'k8s',
}

export enum CviBackendBaseUrl {
  Local = 'http://localhost:8004',
  K8sStaging = 'https://cvi-backend-arbitrum-staging.cvi-team.com',
  K8sMainnet = 'https://cvi-backend-arbitrum-mainnet.cvi-team.com',
}

export enum CviOracleEventsBackendBaseUrl {
  Local = 'http://localhost:8004',
  K8sStaging = 'https://cvi-oracle-events-backend-arbitrum-staging.cvi-team.com',
  K8sMainnet = 'https://cvi-oracle-events-backend-arbitrum-mainnet.cvi-team.com',
}

export const getIlBackendClient = (
  chainId: IlSupportedChainIds,
  overrides?: {
    baseUrl?: string
  },
) => new IlBackendClientApi.AppClient({ BASE: overrides?.baseUrl ?? CHAIN_IDS_INFO[chainId].backendUrls.ilBackend })

export const getDataFeedClient = ({ backendEnvironment }: { backendEnvironment: BackendEnvironment }) => {
  switch (backendEnvironment) {
    case BackendEnvironment.K8s:
      return new DataFeedClientApi.AppClient({ BASE: 'https://data-feed.cvi-team.com' })
    case BackendEnvironment.Local:
      return new DataFeedClientApi.AppClient({ BASE: 'http://localhost:8000' })
  }
}

export const getChatGptClient = ({ backendEnvironment }: { backendEnvironment: BackendEnvironment }) => {
  switch (backendEnvironment) {
    case BackendEnvironment.K8s:
      return new ChatGptServerClientApi.AppClient({ BASE: 'https://chatgpt-server.cvi-team.com' })
    case BackendEnvironment.Local:
      return new ChatGptServerClientApi.AppClient({ BASE: 'http://localhost:8003' })
  }
}

export const getChatgptServerWrapperClient = ({ backendEnvironment }: { backendEnvironment: BackendEnvironment }) => {
  switch (backendEnvironment) {
    case BackendEnvironment.K8s:
      return new chatgptServerWrapperClientApi.AppClient({ BASE: 'https://chatgpt-server-wrapper.cvi-team.com' })
    case BackendEnvironment.Local:
      return new chatgptServerWrapperClientApi.AppClient({ BASE: 'http://localhost:8007' })
  }
}

export const getPyParabolaCoefficientsClient = (overrides?: { baseUrl?: string }) =>
  new PyParabolaCoefficientsClientApi.AppClient({
    BASE: overrides?.baseUrl ?? 'https://py-parabola-coefficients.cvi-team.com',
  })

export const getCoinGeckoClient = () => new CoinGeckoClientApi.AppClient()

export const getCviBackendClient = ({
  network,
  backendEnvironment,
}: {
  network: NetworkName
  backendEnvironment: BackendEnvironment
}) => {
  switch (network) {
    case NetworkName.Testnet:
      throw new Error(`network: ${network} not supported`)
    case NetworkName.Staging:
      switch (backendEnvironment) {
        case BackendEnvironment.K8s:
          return new CviBackendClientApi.AppClient({ BASE: CviBackendBaseUrl.K8sStaging })
        case BackendEnvironment.Local:
          return new CviBackendClientApi.AppClient({ BASE: CviBackendBaseUrl.Local })
      }
    case NetworkName.Local:
    case NetworkName.Mainnet:
      switch (backendEnvironment) {
        case BackendEnvironment.K8s:
          return new CviBackendClientApi.AppClient({ BASE: CviBackendBaseUrl.K8sMainnet })
        case BackendEnvironment.Local:
          return new CviBackendClientApi.AppClient({ BASE: CviBackendBaseUrl.Local })
      }
  }
}

export const getCviOracleEventsBackend = ({
  network,
  backendEnvironment,
}: {
  network: NetworkName
  backendEnvironment: BackendEnvironment
}) => {
  switch (network) {
    case NetworkName.Testnet:
      throw new Error(`network: ${network} not supported`)
    case NetworkName.Staging:
      switch (backendEnvironment) {
        case BackendEnvironment.K8s:
          return new CviOracleEventsBackend.AppClient({ BASE: CviOracleEventsBackendBaseUrl.K8sStaging })
        case BackendEnvironment.Local:
          return new CviOracleEventsBackend.AppClient({ BASE: CviOracleEventsBackendBaseUrl.Local })
      }
    case NetworkName.Local:
    case NetworkName.Mainnet:
      switch (backendEnvironment) {
        case BackendEnvironment.K8s:
          return new CviOracleEventsBackend.AppClient({ BASE: CviOracleEventsBackendBaseUrl.K8sMainnet })
        case BackendEnvironment.Local:
          return new CviOracleEventsBackend.AppClient({ BASE: CviOracleEventsBackendBaseUrl.Local })
      }
  }
}
