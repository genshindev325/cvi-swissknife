import type { pairs } from '@coti-cvi/contracts-deploy/src/state/il-state'
import type { BlockchainName } from '../types/config-types'

export type NamedAccount =
  | 'deployer'
  | 'owner'
  | 'oldDeployer'
  | 'oldOwner'
  | 'alice'
  | 'bob'
  | 'mallory'
  | 'liquidityProvider'
  | 'costa'
  | 'protectionBuyer'
  | 'liquidityWithdrawnToAccount'
  | 'minter'
  | 'upkeeper'
  | 'treasury'
  | 'privateKey'

export type MainnetWhale = {
  tokenName: string
  tokenAddress: string
  whaleAccount: string
}

export type PremiumParams = {
  A: string
  X0: string
  C: string
}

export type PolicyPeriod = 'MINUTE' | 'TWOWEEKS' | 'MONTH' | 'TWOMONTHS'

export type PolicyPeriodParams = Record<PolicyPeriod, PremiumParams>

export type ValidTokenPair<B extends BlockchainName = BlockchainName> = {
  token0: typeof pairs[B][number]['token0']
  token1: typeof pairs[B][number]['token1']
}

export type ValidTokenInPairs<B extends BlockchainName = BlockchainName> =
  | ValidTokenPair<B>['token0']
  | ValidTokenPair<B>['token1']

export interface PairData<B extends BlockchainName = BlockchainName> extends ValidTokenPair<B> {
  policyPeriodParams: PolicyPeriodParams
  collateralCapComponent: number
}

export type USDPriceAggregator<B extends BlockchainName = BlockchainName> = Record<ValidTokenInPairs<B>, string>

export type DeployHelperOptions = {
  gasPriceIncreasePercentage?: number
}

export type HistoryHelperOptions = {
  repoPath: string
  blockchainName: string
  description?: string
}

export type DeployHistoryItem = {
  topic: string
  contractName: string
  contractAddress: string
  contractABI?: unknown[]
  hash: string
  block?: number
}

export interface FullDeployHistoryItem extends DeployHistoryItem {
  block: number
  timestamp: number
  blockchain: string
  description: string
}
