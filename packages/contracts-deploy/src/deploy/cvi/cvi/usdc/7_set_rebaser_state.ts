import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN, upkeepTimeWindow, rebaserWhitelist } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const { address: rebaserAddress } = await helper.get(`${VOL}${TOKEN}Rebaser`)
  const currentRebaserAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'rebaser')
  if (currentRebaserAddress !== rebaserAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setRebaser', {}, rebaserAddress)
  }

  const currentEnableWhitelist = await helper.read(`${VOL}${TOKEN}Rebaser`, 'enableWhitelist')
  if (currentEnableWhitelist !== rebaserWhitelist) {
    await helper.execute(`${VOL}${TOKEN}Rebaser`, 'setEnableWhitelist', {}, rebaserWhitelist)
  }

  const currentAccountRebaserState = await helper.read(`${VOL}${TOKEN}Rebaser`, 'rebasers', {}, owner)
  if (currentAccountRebaserState !== true) {
    await helper.execute(`${VOL}${TOKEN}Rebaser`, 'setRebaserAddress', {}, owner, true)
  }

  const currentUpkeepTimeWindow = await helper.read(`${VOL}${TOKEN}Rebaser`, 'upkeepTimeWindow')
  if (currentUpkeepTimeWindow !== upkeepTimeWindow) {
    await helper.execute(`${VOL}${TOKEN}Rebaser`, 'setUpkeepTimeWindow', {}, upkeepTimeWindow)
  }
}

func.tags = ['set-cvi-usdc-rebaser-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
