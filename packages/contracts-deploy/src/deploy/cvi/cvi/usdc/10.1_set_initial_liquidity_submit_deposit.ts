import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { VOL, TOKEN, LIQUIDITY_AMOUNT } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { execute, read, get, getNamedAccounts } = DeployHelper.get(hre)
  const { liquidityProvider } = await getNamedAccounts()

  const { balance, dexUSDCAmount } = await read(`${VOL}${TOKEN}ThetaVault`, 'totalBalance')
  if (!balance.isZero() && !dexUSDCAmount.isZero()) {
    console.log('skipping initial theta vault liquidity')
    return
  }

  const { address: usdcAddress } = await get('USDC')
  const { address: thetaVaultAddress } = await get(`${VOL}${TOKEN}ThetaVault`)
  const usdc = await Token.fromAddress(usdcAddress, hre.ethers.provider)
  const usdcAmount = usdc.fromNumber(LIQUIDITY_AMOUNT)

  // add liquidity using theta vault - deposit
  // -----------------------------------------------------------------------

  await execute('USDC', 'approve', { from: liquidityProvider }, thetaVaultAddress, usdcAmount)

  await execute(
    `${VOL}${TOKEN}ThetaVault`,
    'submitDepositRequest',
    { from: liquidityProvider },
    usdcAmount /* , false */,
  )
}

func.tags = ['set-cvi-usdc-initial-liquidity-submit-deposit']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
