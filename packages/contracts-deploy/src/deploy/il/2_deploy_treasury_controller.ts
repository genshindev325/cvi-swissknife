import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner, treasury } = await helper.getNamedAccounts()

  const usdcToken = await helper.get('USDC')

  await helper.deployProxy('TreasuryController', { args: [owner, treasury, usdcToken.address] })
}

func.tags = ['il-treasury-controller']
func.dependencies = ['test-usdc']
func.skip = shouldSkipILContractsDeploy

export default func
