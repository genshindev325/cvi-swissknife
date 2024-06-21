import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy('FakeGOVI', {
    contractName: 'GOVI',
    args: ['GOVI', 'GOVI', 0, 18],
  })
}

func.tags = ['test-staking-govi']
func.skip = shouldSkipNotTest

export default func
