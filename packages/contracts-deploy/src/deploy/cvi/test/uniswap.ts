import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'
import { enableUniswapLiquidityFee } from '../../../../test/utils/initial-test-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const { address: wethAddress } = await helper.get('WETH')

  const factory = await helper.deploy('UniswapV2Factory', { args: [owner] })
  await helper.deploy('UniswapV2Router02', { args: [factory.address, wethAddress] })

  if (enableUniswapLiquidityFee) {
    await helper.execute('UniswapV2Factory', 'setFeeTo', { from: owner }, owner)
  }
}

func.tags = ['test-uniswap']
func.dependencies = ['test-weth']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
