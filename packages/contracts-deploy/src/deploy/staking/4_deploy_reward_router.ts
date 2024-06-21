import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'
import { StakedTokenName } from '@coti-cvi/lw-sdk/src'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const esGovi = await helper.get('EsGOVI')
  const govi = await helper.get('GOVI')
  const thetaVaultToken = await helper.get('CVIUSDCThetaVault')
  const thetaVaultRewardTracker = await helper.get('ThetaVaultRewardTracker')
  const goviRewardTracker = await helper.get('GOVIRewardTracker')
  const esGoviRewardTracker = await helper.get('EsGOVIRewardTracker')
  const thetaVaultVester = await helper.get('ThetaVaultVester')
  const goviVester = await helper.get('GOVIVester')

  await helper.deployProxy('RewardRouter', {
    args: [
      owner,
      [StakedTokenName.THETA_VAULT, StakedTokenName.ES_GOVI, StakedTokenName.GOVI],
      [thetaVaultRewardTracker.address, esGoviRewardTracker.address, goviRewardTracker.address],
      [thetaVaultVester.address, goviVester.address, goviVester.address],
      [thetaVaultToken.address, esGovi.address, govi.address],
    ],
  })
}

func.dependencies = [
  'test-staking-theta-vault',
  'staking-es-govi',
  'test-staking-govi',
  'staking-reward-trackers',
  'staking-vesters',
]
func.tags = ['staking-reward-router']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipVestingContractsDeploy(env, func.tags)

export default func
