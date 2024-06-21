import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner, deployer } = await helper.getNamedAccounts()

  // platform
  const currentLiquidationOwner = await helper.read(`${VOL}${TOKEN}Liquidation`, 'owner')
  if (currentLiquidationOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}Liquidation`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentFeesCalculatorOwner = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'owner')
  if (currentFeesCalculatorOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentPlatformOwner = await helper.read(`${VOL}${TOKEN}Platform`, 'owner')
  if (currentPlatformOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}Platform`, 'transferOwnership', { from: deployer }, owner)
  }

  // const currentPositionRewardsOwner = await helper.read(`${VOL}${TOKEN}PositionRewards`, 'owner')
  // if (currentPositionRewardsOwner !== owner) {
  //   await helper.execute(`${VOL}${TOKEN}PositionRewards`, 'transferOwnership', { from: deployer }, owner)
  // }

  // vol token
  const currentKeepersFeeVaultOwner = await helper.read(`KeepersFeeVault`, 'owner')
  if (currentKeepersFeeVaultOwner !== owner) {
    await helper.execute(`KeepersFeeVault`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentRequestFeesCalculatorOwner = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'owner')
  if (currentRequestFeesCalculatorOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}RequestFeesCalculator`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentVolatilityTokenOwner = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'owner')
  if (currentVolatilityTokenOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentRequestFulfillerOwner = await helper.read(`${VOL}${TOKEN}VolTokenRequestFulfiller`, 'owner')
  if (currentRequestFulfillerOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}VolTokenRequestFulfiller`, 'transferOwnership', { from: deployer }, owner)
  }

  // rebaser
  const currentRebaserOwner = await helper.read(`${VOL}${TOKEN}Rebaser`, 'owner')
  if (currentRebaserOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}Rebaser`, 'transferOwnership', { from: deployer }, owner)
  }

  // theta vault
  const currentVaultOwner = await helper.read(`${VOL}${TOKEN}ThetaVault`, 'owner')
  if (currentVaultOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}ThetaVault`, 'transferOwnership', { from: deployer }, owner)
  }

  const currentThetaRequestFulfillerOwner = await helper.read(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, 'owner')
  if (currentThetaRequestFulfillerOwner !== owner) {
    await helper.execute(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, 'transferOwnership', { from: deployer }, owner)
  }
}

func.tags = ['cvi-usdc-transfer-ownership']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
