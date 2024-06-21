import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { fromNumber } from '../../../../../lw-sdk/src/util/big-number'
import { shouldSkipNotTest } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy('USDC', { args: ['USD Coin', 'USDC', fromNumber(100000, 6), 6] })
}

func.tags = ['test-usdc']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
