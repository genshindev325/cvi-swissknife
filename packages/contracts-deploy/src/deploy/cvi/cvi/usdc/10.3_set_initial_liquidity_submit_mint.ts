import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { VOL, TOKEN, POSITION_AMOUNT, maxTimeWindow } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { read, execute, get, getNamedAccounts } = DeployHelper.get(hre)
  const { liquidityProvider } = await getNamedAccounts()

  const { balance, dexUSDCAmount } = await read(`${VOL}${TOKEN}ThetaVault`, 'totalBalance')
  if (!balance.isZero() && !dexUSDCAmount.isZero()) {
    console.log('skipping initial theta vault liquidity')
    return
  }

  const { address: usdcAddress } = await get('USDC')
  const { address: volTokenAddress } = await get(`${VOL}${TOKEN}VolatilityToken`)
  const usdc = await Token.fromAddress(usdcAddress, hre.ethers.provider)
  const posAmount = usdc.fromNumber(POSITION_AMOUNT)

  // mint vol tokens using request fulfill
  // -----------------------------------------------------------------------

  await execute('USDC', 'approve', { from: liquidityProvider }, volTokenAddress, posAmount)

  await execute(
    `${VOL}${TOKEN}VolatilityToken`,
    'submitKeepersMintRequest',
    { from: liquidityProvider },
    posAmount,
    maxTimeWindow,
    100,
  )
}

func.tags = ['set-cvi-usdc-initial-liquidity-submit-mint']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
