import { AddressZero } from '@ethersproject/constants'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { fromNumber } from '../../../../../../lw-sdk/src/util/big-number'
import { VOL, TOKEN, THETA_TOKEN_NAME, THETA_TOKEN_SYMBOL } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { address: tokenAddress } = await helper.get(TOKEN)
  const { address: platformAddress } = await helper.get(`${VOL}${TOKEN}Platform`)
  const { address: volTokenAddress } = await helper.get(`${VOL}${TOKEN}VolatilityToken`)
  const { address: routerAddress } = await helper.get('UniswapV2Router02')

  const token = await Token.fromAddress(tokenAddress, hre.ethers.provider)
  const initialRate = fromNumber(1, 18 - token.decimals)

  const thetaVault = await helper.deployProxy(`${VOL}${TOKEN}ThetaVault`, {
    args: [
      initialRate,
      platformAddress,
      volTokenAddress,
      AddressZero,
      tokenAddress,
      routerAddress,
      THETA_TOKEN_NAME,
      THETA_TOKEN_SYMBOL,
    ],
  })

  await helper.deployProxy(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, { args: [thetaVault.address] })
}

func.tags = ['deploy-cvi-usdc-theta-vault']
func.dependencies = ['deploy-cvi-usdc-rebaser', 'set-cvi-usdc-rebaser-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
