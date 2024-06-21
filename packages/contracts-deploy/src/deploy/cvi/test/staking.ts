import { AddressZero } from '@ethersproject/constants'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipNotTest } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const { address: usdcAddress } = await helper.get('USDC')
  const { address: goviAddress } = await helper.get('GOVI')
  const { address: wethAddress } = await helper.get('WETH')
  const { address: routerAddress } = await helper.get('UniswapV2Router02')
  const { address: aggrgatorAddress } = await helper.get('ETHUSDOracle')

  const stakingVault = await helper.deploy('StakingVault', { args: [goviAddress] })
  const treasury = await helper.deploy('Treasury', { args: [] })

  const staking = await helper.deployProxy('StakingV2', { args: [goviAddress, stakingVault.address, wethAddress] })

  await helper.deployProxy('FeesCollector', {
    args: [
      usdcAddress,
      goviAddress,
      staking.address,
      stakingVault.address,
      AddressZero,
      routerAddress,
      aggrgatorAddress,
      AddressZero,
      treasury.address,
      wethAddress,
    ],
  })
}

func.tags = ['test-staking']
func.dependencies = ['test-usdc', 'test-govi', 'test-weth', 'test-uniswap', 'test-price-oracles']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
