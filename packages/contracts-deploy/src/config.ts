import { glob } from 'typechain'
import semver from 'semver'
import path from 'path'
import findUp from 'find-up'
import { AppEnv } from '../../common-be/src/config/types'
import type { EnvConfig } from './types'
import type { BlockchainName } from '../../lw-sdk/src/types/config-types'
import { ChainId, CHAIN_IDS_INFO } from '../../lw-sdk/src/types/config-types'
import type { ValidTokenInPairs } from '../../lw-sdk/src/contracts-deploy-utils/types'
import {
  MAINNET_WHALES_BY_CHAIN,
  USD_PRICE_AGGREGATORS_BY_CHAIN,
} from '../../lw-sdk/src/contracts-deploy-utils/constants'

function isSupportedChainId(chainId: string): chainId is ChainId {
  return Object.values(ChainId).some(c => c === chainId)
}

export function getChainInfo(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>, argv: string[]) {
  const { CHAIN_ID } = processEnv

  if (!CHAIN_ID) {
    const networkIndex = argv.findIndex(arg => arg.startsWith('--network'))
    if (networkIndex > -1) {
      const displayName = argv[networkIndex + 1]
      const chainInfo = Object.values(CHAIN_IDS_INFO).find(c => c.hardhatConfigNetworkName === displayName)
      if (chainInfo) {
        return chainInfo
      } else {
        throw new Error(
          `Unsupported network: "hardhat <command> --network ${displayName}". supported networks: ${Object.keys(
            CHAIN_IDS_INFO,
          ).join(', ')}`,
        )
      }
    } else {
      throw new Error(
        `CHAIN_ID is not set and no network is specified using "hardhat <command> --network <netowrk>. please use only one of them. if you want to start a node, use CHAIN_ID. else, use --netowrk`,
      )
    }
  }

  if (argv.includes('--network')) {
    throw new Error(
      `CHAIN_ID is set and network is specified using "hardhat <command> --network <netowrk>. please use only one of them. if you want to start a node, use CHAIN_ID. else, use --netowrk`,
    )
  }

  const chainId = CHAIN_ID

  if (!isSupportedChainId(chainId)) {
    throw new Error(
      `CHAIN_ID is not valid: ${chainId}. Valid values: ${Object.entries(ChainId)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')}`,
    )
  }

  return CHAIN_IDS_INFO[chainId]
}

export function checkIsStartingHardhatNode(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): boolean {
  return Boolean(processEnv.START_HARDHAT_NODE)
}
export function checkIsTestMode(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): boolean {
  return Boolean(processEnv.HARDHAT_TEST)
}
export function checkIsDeployMode(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): boolean {
  return Boolean(processEnv.HARDHAT_DEPLOY)
}
export function checkIsGeneratingTypes(processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): boolean {
  return Boolean(processEnv.GEN_TYPES)
}

export function getEnvConfig(): EnvConfig {
  const processEnv = process.env
  const argv = process.argv.slice(2)

  const repoPath = path.dirname(findUp.sync('yarn.lock', { cwd: __dirname })!)

  const chainInfo = getChainInfo(processEnv, argv)

  const appEnv = (processEnv.APP_ENV || AppEnv.Local) as AppEnv

  if (!Object.values(AppEnv).includes(appEnv)) {
    throw new Error(`APP_ENV is illegal. allowed values are: ${Object.values(AppEnv)}`)
  }

  return {
    repoPath,
    appEnv,
    isStartingHardhatNode: checkIsStartingHardhatNode(processEnv),
    deploymentsFileServerPort: Number(processEnv.ABI_FILE_PORT ?? 6999),
    chainId: chainInfo.chainId,
    mainnetWhales: MAINNET_WHALES_BY_CHAIN[CHAIN_IDS_INFO[chainInfo.chainId].blockchainName],
  }
}

export function getExternalArtifacts({ repoPath, solidity }: { repoPath: string; solidity: string }): string[] {
  return [
    ...glob(path.join(repoPath, 'node_modules', '@openzeppelin'), [path.join('*', 'build', '**', '*.json')], true),
    ...glob(path.join(repoPath, 'node_modules', '@uniswap'), [path.join('*', 'build', 'UniswapV2*.json')], true),
    ...glob(
      path.join(
        repoPath,
        'node_modules',
        '@chainlink',
        'contracts',
        'abi',
        `v${semver.minor(solidity)}.${semver.patch(solidity)}`,
      ),
      [path.join('**', '*.json')],
      true,
    ),
  ].filter(file => !file.includes('.dbg.json'))
}

export function getAddressOfUSDPriceAggregator<B extends BlockchainName>(
  blockchainName: B,
  token: ValidTokenInPairs<B>,
): string {
  return USD_PRICE_AGGREGATORS_BY_CHAIN[blockchainName][token]
}
