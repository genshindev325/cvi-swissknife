import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { fromNumber, toNumber } from '@coti-cvi/lw-sdk/src/util/big-number'
import { ChainId } from '@coti-cvi/lw-sdk/src/types/config-types'
import { tokenDecimals, TokenName } from '@coti-cvi/lw-sdk/src/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { liquidityProvider } = await helper.getNamedAccounts()

  const balance = await helper.read('USDC', 'balanceOf', {}, liquidityProvider)
  console.log(`current USDC balance: ${toNumber(balance, tokenDecimals[TokenName.USDC])} USDC`)
  const amount = fromNumber(100, tokenDecimals[TokenName.USDC])
  console.log(`adding liquidity: ${amount} ${toNumber(amount, tokenDecimals[TokenName.USDC])} USDC`)

  const liquidityController = await helper.attach('LiquidityController')
  await helper.execute('USDC', 'approve', { from: liquidityProvider }, liquidityController.address, amount)

  await helper.execute('ILProtectionController', 'addLiquidity', { from: liquidityProvider }, amount)
}

func.tags = ['propose-add-liquidity']
func.skip = async (env: HardhatRuntimeEnvironment) => {
  return !([ChainId.PolygonMainnet, ChainId.ArbitrumMainnet] as string[]).includes(await env.getChainId())
}

export default func
