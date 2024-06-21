import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy('MathUtils', { args: [] })
  await helper.deploy('ILUtils', { args: [] })
  await helper.deploy('PremiumCalculator', { args: [] })
}

func.tags = ['il-libraries']
func.skip = shouldSkipILContractsDeploy

export default func
