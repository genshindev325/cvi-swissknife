import { AddressZero } from '@ethersproject/constants'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
// import { shouldSkipDeploy } from '../../../skippers'
import { UntypedToken, NativeToken } from '../../../../../lw-sdk/src/token/token'
import { BlockchainName } from '../../../../../lw-sdk/src/types/config-types'
import { printBalances } from '../../../../../lw-sdk/src/contracts-deploy-utils/util'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const usdcAmount = process.env.AMOUNT ? +process.env.AMOUNT : 3685

  const { address: feesCollectorAddress } = await helper.get('FeesCollector')
  const { address: vaultAddress } = await helper.get('StakingVault')
  const { address: treasuryAddress } = await helper.get('Treasury')
  const { address: usdcAddress } = await helper.get('USDC')
  const { address: goviAddress } = await helper.get('GOVI')
  const { address: wethAddress } = await helper.get('WETH')

  const usdc = await UntypedToken.fromAddress(usdcAddress, hre.ethers.provider)
  const govi = await UntypedToken.fromAddress(goviAddress, hre.ethers.provider)
  const native = NativeToken.create(BlockchainName.ARBITRUM, hre.ethers.provider)

  await printBalances([usdc, native, govi], [feesCollectorAddress, vaultAddress, treasuryAddress], 'balance before...')

  const pairAddress = await helper.read('UniswapV2Factory', 'getPair', {}, wethAddress, goviAddress)
  if (pairAddress === AddressZero) {
    throw new Error(`no pair exist`)
  }

  const amountsOut = await helper.read('UniswapV2Router02', 'getAmountsOut', {}, native.fromNumber(1), [
    wethAddress,
    goviAddress,
  ])
  const ethGoviPrice = amountsOut[1]
  console.log(`[ETH to GOVI] current price: ${ethGoviPrice}`)

  const ethOut = await helper.read('UniswapV2Router02', 'getAmountsOut', {}, usdc.fromNumber(usdcAmount), [
    usdcAddress,
    wethAddress,
  ])
  const ethAmount = ethOut[1]
  const balance = await native.getBalance(feesCollectorAddress)
  const percent = Math.floor((native.toNumber(ethAmount) / native.toNumber(balance)) * 10000)

  await helper.execute('FeesCollector', 'setSendPercentage', {}, percent)
  // await helper.execute('FeesCollector', 'setMaxSlippage', {}, 200)

  await helper.execute('FeesCollector', 'sendFunds', {}, ethGoviPrice)

  await printBalances([usdc, native, govi], [feesCollectorAddress, vaultAddress, treasuryAddress], 'balance after...')
}

func.tags = ['arbitrum-buyback']
// func.skip = async (env: HardhatRuntimeEnvironment) =>
//   shouldSkipDeploy(env, func.tags, false, undefined, BlockchainName.ARBITRUM)
func.skip = async (env: HardhatRuntimeEnvironment) => Promise.resolve(true)

export default func
