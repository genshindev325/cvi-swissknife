import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import type { ETHUSDOracle } from '@coti-cvi/auto-generated-code/contracts'
import { TokenName } from '../../../../lw-sdk/src/types/token-types'
import { chainlinkTokensPriceAggregatorAbi } from '../../../../lw-sdk/src/common-abis/chainlink-tokens-price-aggregator.abi'
import { DeployHelper } from '../../helpers'
import { shouldSkipDevDeploy } from '../../skippers'
import { getAddressOfUSDPriceAggregator } from '../../config'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const ethAggregatorAddress = getAddressOfUSDPriceAggregator(helper.blockchainName, TokenName.WETH)
  const aggregator = helper.connect<ETHUSDOracle>(ethAggregatorAddress, chainlinkTokensPriceAggregatorAbi)
  const [latestAnswer] = await Promise.all([aggregator.latestAnswer(), hre.deployments.delete('ETHUSDOracle')])
  await helper.deploy('ETHUSDOracle', { args: [latestAnswer] })
}

func.tags = ['fake-price-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevDeploy(env, func.tags)

export default func
