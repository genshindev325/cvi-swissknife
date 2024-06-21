import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const usdcToken = await helper.get('USDC')
  const treasuryController = await helper.get('TreasuryController')

  await helper.deployProxy('LiquidityController', { args: [owner, usdcToken.address, treasuryController.address] })
}

func.tags = ['il-liquidity-controller']
func.dependencies = ['test-usdc', 'il-treasury-controller']
func.skip = shouldSkipILContractsDeploy

export default func
