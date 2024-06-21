import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const operatorRole = await helper.read('RewardRouter', 'OPERATOR_ROLE')

  const thetaVaultRewardDistributor = await helper.get('ThetaVaultRewardTrackerDistributor')
  const goviRewardDistributor = await helper.get('GOVIRewardTrackerDistributor')
  const esGoviRewardDistributor = await helper.get('EsGOVIRewardTrackerDistributor')
  const thetaVaultRewardTracker = await helper.get('ThetaVaultRewardTracker')
  const goviRewardTracker = await helper.get('GOVIRewardTracker')
  const esGoviRewardTracker = await helper.get('EsGOVIRewardTracker')
  const thetaVaultVester = await helper.get('ThetaVaultVester')
  const goviVester = await helper.get('GOVIVester')
  const rewardRouter = await helper.get('RewardRouter')

  await helper.grantRoleIfNotSet('ThetaVaultRewardTrackerDistributor', thetaVaultRewardTracker.address, operatorRole)
  await helper.grantRoleIfNotSet('GOVIRewardTrackerDistributor', goviRewardTracker.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVIRewardTrackerDistributor', esGoviRewardTracker.address, operatorRole)

  await helper.grantRoleIfNotSet('ThetaVaultRewardTracker', rewardRouter.address, operatorRole)
  await helper.grantRoleIfNotSet('GOVIRewardTracker', rewardRouter.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVIRewardTracker', rewardRouter.address, operatorRole)
  await helper.grantRoleIfNotSet('ThetaVaultRewardTracker', thetaVaultVester.address, operatorRole)
  await helper.grantRoleIfNotSet('GOVIRewardTracker', goviVester.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVIRewardTracker', goviVester.address, operatorRole)

  await helper.grantRoleIfNotSet('ThetaVaultVester', rewardRouter.address, operatorRole)
  await helper.grantRoleIfNotSet('GOVIVester', rewardRouter.address, operatorRole)

  await helper.grantRoleIfNotSet('EsGOVI', thetaVaultRewardDistributor.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', goviRewardDistributor.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', esGoviRewardDistributor.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', thetaVaultRewardTracker.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', goviRewardTracker.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', esGoviRewardTracker.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', thetaVaultVester.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', goviVester.address, operatorRole)
  await helper.grantRoleIfNotSet('EsGOVI', rewardRouter.address, operatorRole)
}

func.tags = ['staking-initial-permissions']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
