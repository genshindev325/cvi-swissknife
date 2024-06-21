import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'
import { goviTokensPerInterval } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const esGovi = await helper.get('EsGOVI')

  await helper.deployProxy('GOVIRewardTrackerDistributor', { args: [owner, esGovi.address, goviTokensPerInterval] })
}

func.dependencies = ['staking-es-govi']
func.tags = ['staking-reward-distributors']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
