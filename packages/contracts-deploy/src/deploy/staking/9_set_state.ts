import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'
import { goviDistributorAmount, thetaLPDistributorAmount, esGoviDistributorAmount } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const thetaVaultRewardDistributor = await helper.get('ThetaVaultRewardTrackerDistributor')
  const goviRewardDistributor = await helper.get('GOVIRewardTrackerDistributor')
  const esGoviRewardDistributor = await helper.get('EsGOVIRewardTrackerDistributor')
  const thetaVaultRewardTracker = await helper.get('ThetaVaultRewardTracker')
  const goviRewardTracker = await helper.get('GOVIRewardTracker')
  const esGoviRewardTracker = await helper.get('EsGOVIRewardTracker')
  const rewardRouter = await helper.get('RewardRouter')

  const currentRewardRewardRouter = await helper.read('CVIUSDCThetaVault', 'rewardRouter')
  if (currentRewardRewardRouter !== rewardRouter.address) {
    await helper.execute('CVIUSDCThetaVault', 'setRewardRouter', {}, rewardRouter.address)
  }

  let currentRewardTracker = await helper.read('ThetaVaultRewardTrackerDistributor', 'rewardTracker')

  if (currentRewardTracker !== thetaVaultRewardTracker.address) {
    await helper.execute('ThetaVaultRewardTrackerDistributor', 'setRewardTracker', {}, thetaVaultRewardTracker.address)
  }

  currentRewardTracker = await helper.read('GOVIRewardTrackerDistributor', 'rewardTracker')

  if (currentRewardTracker !== goviRewardTracker.address) {
    await helper.execute('GOVIRewardTrackerDistributor', 'setRewardTracker', {}, goviRewardTracker.address)
  }

  currentRewardTracker = await helper.read('EsGOVIRewardTrackerDistributor', 'rewardTracker')

  if (currentRewardTracker !== esGoviRewardTracker.address) {
    await helper.execute('EsGOVIRewardTrackerDistributor', 'setRewardTracker', {}, esGoviRewardTracker.address)
  }

  let esGoviBalance = await helper.read('EsGOVI', 'balanceOf', {}, thetaVaultRewardDistributor.address)

  if (esGoviBalance.eq(0)) {
    await helper.execute('EsGOVI', 'mint', {}, thetaVaultRewardDistributor.address, thetaLPDistributorAmount)
  }

  esGoviBalance = await helper.read('EsGOVI', 'balanceOf', {}, goviRewardDistributor.address)

  if (esGoviBalance.eq(0)) {
    await helper.execute('EsGOVI', 'mint', {}, goviRewardDistributor.address, goviDistributorAmount)
  }

  esGoviBalance = await helper.read('EsGOVI', 'balanceOf', {}, esGoviRewardDistributor.address)

  if (esGoviBalance.eq(0)) {
    await helper.execute('EsGOVI', 'mint', {}, esGoviRewardDistributor.address, esGoviDistributorAmount)
  }
}

func.tags = ['staking-set-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
