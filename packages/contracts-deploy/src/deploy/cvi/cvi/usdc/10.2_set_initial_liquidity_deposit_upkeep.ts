import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN, requestDelay } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { execute, read, getNamedAccounts, advanceTime } = DeployHelper.get(hre)
  const { deployer } = await getNamedAccounts()

  const { balance, dexUSDCAmount } = await read(`${VOL}${TOKEN}ThetaVault`, 'totalBalance')
  if (!balance.isZero() && !dexUSDCAmount.isZero()) {
    console.log('skipping initial theta vault liquidity')
    return
  }

  // wait 30 minutes or advance time (staging)
  await advanceTime(requestDelay)

  await execute(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, 'performUpkeep', { from: deployer }, [0])
}

func.tags = ['set-cvi-usdc-initial-liquidity-deposit-upkeep']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
