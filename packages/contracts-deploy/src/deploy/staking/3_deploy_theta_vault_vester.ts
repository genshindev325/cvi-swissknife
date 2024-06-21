import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipVestingContractsDeploy } from '../../skippers'
import { thetaLPVestingDuration } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const esGovi = await helper.get('EsGOVI')
  const govi = await helper.get('GOVI')
  const thetaVaultToken = await helper.get('CVIUSDCThetaVault')
  const rewardTracker = await helper.get('ThetaVaultRewardTracker')

  await helper.deployProxy('ThetaVaultVester', {
    args: [
      owner,
      'Vested ThetaVault',
      'vThetaVault',
      thetaLPVestingDuration,
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
