import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy('FakeCVIUSDCThetaVault', {
    contractName: 'CVIUSDCThetaVault',
    args: ['ThetaVault', 'ThetaVault', 0, 18],
  })
}

func.tags = ['test-staking-theta-vault']
func.skip = shouldSkipNotTest

export default func
