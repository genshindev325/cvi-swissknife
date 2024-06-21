import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { ChainId } from '@coti-cvi/lw-sdk/src/types/config-types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.proposeUpgrade('ILProtectionController', {})
}

func.tags = ['propose-upgrade']
func.skip = async (env: HardhatRuntimeEnvironment) => {
  return !([ChainId.PolygonMainnet, ChainId.ArbitrumMainnet] as string[]).includes(await env.getChainId())
}

export default func
