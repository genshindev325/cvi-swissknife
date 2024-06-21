import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipDevVestingContractsDeploy } from '../../../skippers'
import { Token } from '@coti-cvi/lw-sdk/src/token/token'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { liquidityProvider } = await helper.getNamedAccounts()

  const { GOVIVester, ThetaVaultVester } = await helper.getAll()

  const { address: goviAddress } = await helper.get('GOVI')
  const govi = await Token.fromAddress(goviAddress, hre.ethers.provider)
  const balance = await govi.getBalance(liquidityProvider)
  const amount = balance.div(2)

  // transfer GOVI to vesters
  if (GOVIVester) {
    await helper.execute('GOVI', 'transfer', { from: liquidityProvider }, GOVIVester.address, amount)
  }

  if (ThetaVaultVester) {
    await helper.execute('GOVI', 'transfer', { from: liquidityProvider }, ThetaVaultVester.address, amount)
  }
}

func.tags = ['initial-govi-transfer']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevVestingContractsDeploy(env, func.tags)

export default func
