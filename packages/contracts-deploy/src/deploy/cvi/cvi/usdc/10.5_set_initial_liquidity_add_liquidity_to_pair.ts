import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { VOL, TOKEN, POSITION_AMOUNT } from '../../../../state/cvi-state'

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
  const { address: routerAddress } = await get(`UniswapV2Router02`)
  const vol = await Token.fromAddress(volTokenAddress, hre.ethers.provider)
  const usdc = await Token.fromAddress(usdcAddress, hre.ethers.provider)
  const posAmount = usdc.fromNumber(POSITION_AMOUNT)
  const volTokenAmount = await vol.getBalance(liquidityProvider)

  // add liquidity to pair - vol tokens + usdc
  // -----------------------------------------------------------------------

  await execute('USDC', 'approve', { from: liquidityProvider }, routerAddress, posAmount)
  await execute(`${VOL}${TOKEN}VolatilityToken`, 'approve', { from: liquidityProvider }, routerAddress, volTokenAmount)

  const { timestamp } = await hre.ethers.provider.getBlock('latest')
  const deadline = timestamp + 60 * 60

  await execute(
    `UniswapV2Router02`,
    'addLiquidity',
    { from: liquidityProvider },
    usdcAddress,
    volTokenAddress,
    posAmount,
    volTokenAmount,
    posAmount,
    volTokenAmount,
    liquidityProvider,
    deadline,
  )
}

func.tags = ['set-cvi-usdc-initial-liquidity-add-liquidity-to-pair']
func.runAtTheEnd = true
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
