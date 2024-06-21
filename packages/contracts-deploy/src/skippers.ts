import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DRY_RUN, VERBOSE } from './constants'
import {
  CHAIN_IDS_INFO,
  NetworkName,
  IL_SUPPORTED_BLOCKCHAIN_NAMES,
  TV_SUPPORTED_BLOCKCHAIN_NAMES,
  VESTING_SUPPORTED_BLOCKCHAIN_NAMES,
} from '../../lw-sdk/src/types/config-types'
import type { ChainInfo, BlockchainName } from '../../lw-sdk/src/types/config-types'
import { HARDHAT_TEST_CHAIN_ID } from '@coti-cvi/lw-sdk/src/contracts-deploy-utils/constants'

async function getChain(env: HardhatRuntimeEnvironment) {
  const chainId = await env.getChainId()
  const chain = Object.values(CHAIN_IDS_INFO).find(c => c.chainId === chainId)
  return { chainId, chain }
}

function networkFilter(chain: ChainInfo, supportedNetworks: NetworkName[]) {
  return supportedNetworks.length > 0 && !supportedNetworks.includes(chain.networkName)
}

function blockchainFilter(chain: ChainInfo, supportedBlockchains: BlockchainName[]) {
  return supportedBlockchains.length > 0 && !supportedBlockchains.includes(chain.blockchainName)
}

export async function shouldSkipDeploy(
  env: HardhatRuntimeEnvironment,
  tags?: string[],
  runInTests = false,
  supportedNetworks: NetworkName[] = [],
  ...supportedBlockchains: BlockchainName[]
): Promise<boolean> {
  const { chainId, chain } = await getChain(env)
  if (runInTests && chainId === HARDHAT_TEST_CHAIN_ID) {
    if (VERBOSE) {
      console.log(`Running [${tags?.join()}] deploy - only in test`)
    }
    return false
  }
  if (!chain) {
    if (VERBOSE) {
      console.log(`Skipping [${tags?.join()}] deploy - chain id ${chainId} is not supported`)
    }
    return true
  }

  if (networkFilter(chain, supportedNetworks)) {
    if (VERBOSE) {
      console.log(`Skipping [${tags?.join()}] deploy - network ${chain.networkName} is not supported`)
    }
    return true
  }

  if (blockchainFilter(chain, supportedBlockchains)) {
    if (VERBOSE) {
      console.log(`Skipping [${tags?.join()}] deploy - blockchain ${chain.blockchainName} is not supported`)
    }
    return true
  }
  if (VERBOSE) {
    console.log(`Running [${tags?.join()}] deploy - network ${chain.networkName} blockchain ${chain.blockchainName}`)
  }
  return false
}

export async function shouldSkipDevDeploy(
  env: HardhatRuntimeEnvironment,
  tags?: string[],
  ...supportedBlockchains: BlockchainName[]
): Promise<boolean> {
  if (DRY_RUN) {
    return true
  }
  return shouldSkipDeploy(env, tags, false, [NetworkName.Local, NetworkName.Staging], ...supportedBlockchains)
}

export async function shouldSkipILContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDeploy(env, tags, true, [], ...IL_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipILDevContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDevDeploy(env, tags, ...IL_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipThetaVaultContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDeploy(env, tags, true, [], ...TV_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipDevThetaVaultContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDevDeploy(env, tags, ...TV_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipVestingContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDeploy(env, tags, true, [], ...VESTING_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipDevVestingContractsDeploy(env: HardhatRuntimeEnvironment, tags?: string[]) {
  return shouldSkipDevDeploy(env, tags, ...VESTING_SUPPORTED_BLOCKCHAIN_NAMES)
}

export async function shouldSkipNotTest(env: HardhatRuntimeEnvironment, tags?: string[]) {
  const skip = (await env.getChainId()) !== HARDHAT_TEST_CHAIN_ID
  if (VERBOSE) {
    console.log(`${skip ? 'Skipping' : 'Running'} [${tags?.join()}] deploy - in test`)
  }
  return skip
}
