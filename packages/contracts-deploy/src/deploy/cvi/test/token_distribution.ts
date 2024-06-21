import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'
import { fromNumber } from '../../../../../lw-sdk/src/util/big-number'
import { initialTokenAmount } from '../../../../test/utils/initial-test-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { attach, getNamedAccounts } = DeployHelper.get(hre)
  const { liquidityProvider, alice, bob } = await getNamedAccounts()

  const usdcToken = await attach('USDC')
  await usdcToken.mint(liquidityProvider, fromNumber(initialTokenAmount, 6))
  await usdcToken.mint(alice, fromNumber(initialTokenAmount, 6))
  await usdcToken.mint(bob, fromNumber(initialTokenAmount, 6))
}

func.tags = ['test-token-distribution']
func.dependencies = ['test-usdc']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
