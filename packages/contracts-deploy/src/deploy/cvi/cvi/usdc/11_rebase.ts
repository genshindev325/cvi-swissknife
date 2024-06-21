import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipNotTest } from '../../../../skippers'
import { DeployHelper } from '../../../../helpers'
import { VOL, TOKEN, cappedRebase } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCappedRebase', {}, false)
  await helper.execute(`${VOL}${TOKEN}Rebaser`, 'rebase', {})
  await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCappedRebase', {}, cappedRebase)

  // const { upkeepNeeded } = await helper.read(`${VOL}${TOKEN}Rebaser`, 'checkUpkeep', {}, [0])
  // if (upkeepNeeded) {
  //   await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCappedRebase', {}, false)
  //   await helper.execute(`${VOL}${TOKEN}Rebaser`, 'performUpkeep', {}, [0])
  //   await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCappedRebase', {}, cappedRebase)
  // }
}

func.tags = ['cvi-usdc-rebase']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags) // shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
