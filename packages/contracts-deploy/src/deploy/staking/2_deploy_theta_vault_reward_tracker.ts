import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const thetaVaultToken = await helper.get('CVIUSDCThetaVault')
  const rewardDistributor = await helper.get('ThetaVaultRewardTrackerDistributor')

  await helper.deployProxy('ThetaVaultRewardTracker', {
    args: [
      owner,
      'Staked ThetaVault',
      'stThetaVault',
      [thetaVaultToken.address],
      rewardDistributor.address,
      true,
      true,
    ],
  })
}

func.dependencies = ['test-staking-theta-vault']
func.tags = ['staking-reward-trackers']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
