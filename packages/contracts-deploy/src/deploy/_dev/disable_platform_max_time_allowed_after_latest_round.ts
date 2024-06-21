import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipDevThetaVaultContractsDeploy } from '../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { execute } = DeployHelper.get(hre)

  await execute('CVIUSDCPlatform', 'setMaxTimeAllowedAfterLatestRound', {}, 10 * 356 * 24 * 60 * 60)
}

func.tags = ['disable-platform-max-time-allowed-after-latest-round']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevThetaVaultContractsDeploy(env, func.tags)

export default func
