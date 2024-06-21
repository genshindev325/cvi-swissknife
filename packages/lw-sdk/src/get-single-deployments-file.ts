import axios from 'axios'
import type { ChainId, Contracts, HardhatSupportedChainIds } from './types'
import { BlockchainName, CHAIN_IDS_INFO, NetworkName } from './types'

export const getHardhatAPIURL = (chainId: HardhatSupportedChainIds) => {
  const { blockchainName, networkName } = CHAIN_IDS_INFO[chainId]
  switch (networkName) {
    case NetworkName.Staging:
      return `https://hardhat-${blockchainName}-deployments-file.cvi-team.com`
    case NetworkName.Local:
      const ports = {
        [BlockchainName.ETHEREUM]: 7002,
        [BlockchainName.POLYGON]: 7001,
        [BlockchainName.ARBITRUM]: 7003,
      } as const
      return `http://localhost:${ports[blockchainName]}`
  }
}

export async function getSingleDeploymentsFile(chainId: ChainId): Promise<Contracts> {
  const { blockchainName, networkName } = CHAIN_IDS_INFO[chainId]
  switch (blockchainName) {
    case BlockchainName.ETHEREUM:
      switch (networkName) {
        case NetworkName.Staging:
          return axios
            .get(`https://hardhat-ethereum-deployments-file.cvi-team.com/deployments`)
            .then(res => res.data.contracts)
        case NetworkName.Mainnet:
          return import(
            '../../auto-generated-code/src/single-live-deployment-files/chain_id_1__blockchain_ethereum__network_live.json'
          ).then(r => r.contracts)
        case NetworkName.Local:
          return axios.get(`http://localhost:7002/deployments`).then(res => res.data.contracts)
      }
    case BlockchainName.POLYGON:
      switch (networkName) {
        case NetworkName.Staging:
          return axios
            .get(`https://hardhat-polygon-deployments-file.cvi-team.com/deployments`)
            .then(res => res.data.contracts)
        case NetworkName.Mainnet:
          return import(
            '../../auto-generated-code/src/single-live-deployment-files/chain_id_137__blockchain_polygon__network_live.json'
          ).then(r => r.contracts)
        case NetworkName.Local: {
          return axios.get(`http://localhost:7001/deployments`).then(res => res.data.contracts)
        }
      }
    case BlockchainName.ARBITRUM:
      switch (networkName) {
        case NetworkName.Staging:
          return axios
            .get(`https://hardhat-arbitrum-deployments-file.cvi-team.com/deployments`)
            .then(res => res.data.contracts)
        case NetworkName.Mainnet:
          return import(
            '../../auto-generated-code/src/single-live-deployment-files/chain_id_42161__blockchain_arbitrum__network_live.json'
          ).then(r => r.contracts)
        case NetworkName.Local:
          return axios.get(`http://localhost:7003/deployments`).then(res => res.data.contracts)
      }
    default:
      throw new Error('Blockchain not supported')
  }
}
