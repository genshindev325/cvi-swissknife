import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  await helper.deploy('EsGOVI', { args: [owner] })
}

func.tags = ['staking-es-govi']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
