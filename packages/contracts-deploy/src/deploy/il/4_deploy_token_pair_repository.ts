import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'
import { priceTokenDecimals } from '../../state/il-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const protectionConfig = await helper.get('ILProtectionConfig')

  await helper.deployProxy('TokenPairRepository', { args: [owner, priceTokenDecimals, protectionConfig.address] })
}

func.tags = ['il-token-pair-repository']
func.dependencies = ['il-protection-config']
func.skip = shouldSkipILContractsDeploy

export default func
