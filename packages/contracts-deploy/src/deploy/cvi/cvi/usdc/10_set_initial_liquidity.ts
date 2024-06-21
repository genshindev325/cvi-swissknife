import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // add liquidity using theta vault deposit - $100
  // mint vol tokens using request fulfill - $1
  // add liquidity to pair - 1 vol tokens + 1 usdc
}

func.tags = ['set-cvi-usdc-initial-liquidity']
func.dependencies = [
  'test-token-distribution',
  'set-cvi-usdc-initial-liquidity-submit-deposit',
  'set-cvi-usdc-initial-liquidity-deposit-upkeep',
  'set-cvi-usdc-initial-liquidity-submit-mint',
  'set-cvi-usdc-initial-liquidity-mint-upkeep',
  'set-cvi-usdc-initial-liquidity-add-liquidity-to-pair',
]
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
