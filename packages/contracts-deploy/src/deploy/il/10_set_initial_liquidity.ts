import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { Token } from '../../../../lw-sdk/src/token/token'
import { shouldSkipILDevContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedSigners, get, execute } = DeployHelper.get(hre)
  const { liquidityProvider } = await getNamedSigners()

  const { address: usdcAddress } = await get('USDC')
  const { address: liquidityControllerAddress } = await get('LiquidityController')

  const usdcToken = await Token.fromAddress(usdcAddress, hre.ethers.provider)
  const liquidity = await usdcToken.getBalance(liquidityControllerAddress)

  const minimumLiquidity = usdcToken.fromNumber(1000)
  if (liquidity < minimumLiquidity) {
    await execute('USDC', 'approve', { from: liquidityProvider.address }, liquidityControllerAddress, minimumLiquidity)
    await execute('ILProtectionController', 'addLiquidity', { from: liquidityProvider.address }, minimumLiquidity)
  }
}

func.tags = ['il-contracts-initial-permissions']
func.skip = (env: HardhatRuntimeEnvironment) => shouldSkipILDevContractsDeploy(env, func.tags)

export default func
