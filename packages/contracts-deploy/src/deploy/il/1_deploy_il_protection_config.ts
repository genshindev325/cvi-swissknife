import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'
import { configParams } from '../../state/il-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  await helper.deployProxy('ILProtectionConfig', { args: [owner, ...configParams] })
}

func.tags = ['il-protection-config']
func.skip = shouldSkipILContractsDeploy

export default func
