import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy('GOVI', { args: [] })
}

func.tags = ['test-govi']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
