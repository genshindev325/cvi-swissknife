import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const esGovi = await helper.get('EsGOVI')
  const rewardDistributor = await helper.get('EsGOVIRewardTrackerDistributor')

  await helper.deployProxy('EsGOVIRewardTracker', {
    args: [owner, 'Staked EsGOVI', 'stEsGOVI', [esGovi.address], rewardDistributor.address, true, true],
  })
}

func.dependencies = ['staking-es-govi', 'test-staking-govi']
func.tags = ['staking-reward-trackers']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
