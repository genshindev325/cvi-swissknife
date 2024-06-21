import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
// import { shouldSkipDeploy } from '../../../skippers'
import { NativeToken, UntypedToken } from '../../../../../lw-sdk/src/token/token'
import { BlockchainName } from '../../../../../lw-sdk/src/types/config-types'
import { printBalances } from '../../../../../lw-sdk/src/contracts-deploy-utils/util'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { privateKey } = await helper.getNamedSigners()

  const feesCollector = await helper.attach('FeesCollector')

  const { address: usdcAddress } = await helper.get('USDC')
  const usdc = await UntypedToken.fromAddress(usdcAddress, hre.ethers.provider)
  const native = NativeToken.create(BlockchainName.ARBITRUM, hre.ethers.provider)

  console.log(`minUSDCForConversion ${await feesCollector.minUSDCForConversion()}`)

  await printBalances([usdc, native], [feesCollector.address], 'balance before...')

  const balance = await native.getBalance(feesCollector.address)

  await helper.execute('FeesCollector', 'setMaxSubmissionFee', { from: privateKey.address }, balance.sub(1))
  await helper.execute('FeesCollector', 'setMinETHForTransfer', { from: privateKey.address }, balance)

  await helper.execute('FeesCollector', 'sendFunds', { from: privateKey.address }, '0')

  await printBalances([usdc, native], [feesCollector.address], 'balance after...')
}

func.tags = ['send-funds']
// func.skip = async (env: HardhatRuntimeEnvironment) =>
//   shouldSkipDeploy(env, func.tags, false, undefined, BlockchainName.ETHEREUM)
func.skip = async (env: HardhatRuntimeEnvironment) => Promise.resolve(true)

export default func
