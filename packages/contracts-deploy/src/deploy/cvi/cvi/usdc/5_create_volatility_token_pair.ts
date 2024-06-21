import { AddressZero } from '@ethersproject/constants'
import UniswapV2Pair from '@uniswap/v2-core/build/UniswapV2Pair.json'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { deployer } = await helper.getNamedAccounts()
  const { address: tokenAddress } = await helper.get(TOKEN)
  const { address: volTokenAddress } = await helper.get(`${VOL}${TOKEN}VolatilityToken`)

  const pairAddress = await helper.read('UniswapV2Factory', 'getPair', {}, tokenAddress, volTokenAddress)
  if (pairAddress === AddressZero) {
    const receipt = await helper.execute(
      'UniswapV2Factory',
      'createPair',
      { from: deployer },
      tokenAddress,
      volTokenAddress,
    )
    if (receipt) {
      const block = receipt.blockNumber
      const factory = await helper.attach('UniswapV2Factory')
      const filter = factory.filters.PairCreated()
      const events = await factory.queryFilter(filter, block, block)
      if (events.length === 1) {
        const event = events[0]
        const pairAddress = event.args.pair
        await hre.deployments.save(`${VOL}${TOKEN}VolatilityToken${TOKEN}UNIV2Pair`, {
          address: pairAddress,
          transactionHash: receipt.transactionHash,
          abi: UniswapV2Pair.abi,
        })
      }
    }
  }
}

func.tags = ['create-cvi-usdc-volatility-token-pair']
func.dependencies = ['deploy-cvi-usdc-volatility-token', 'set-cvi-usdc-volatility-token-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
