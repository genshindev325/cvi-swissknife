import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'
import { goviVestingDuration } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const esGovi = await helper.get('EsGOVI')
  const govi = await helper.get('GOVI')
  const rewardTracker = await helper.get('GOVIRewardTracker')

  await helper.deployProxy('GOVIVester', {
    args: [
      owner,
      'Vested GOVI',
      'veGOVI',
      goviVestingDuration,
      esGovi.address,
      rewardTracker.address,
      govi.address,
      rewardTracker.address,
    ],
  })
}

func.dependencies = ['staking-es-govi', 'test-staking-govi', 'test-staking-theta-vault']
func.tags = ['staking-vesters']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
