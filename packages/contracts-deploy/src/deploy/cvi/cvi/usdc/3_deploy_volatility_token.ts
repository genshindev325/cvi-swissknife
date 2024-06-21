import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { fromNumber } from '../../../../../../lw-sdk/src/util/big-number'
import { VOL, TOKEN, VOL_TOKEN_NAME, VOL_TOKEN_SYMBOL } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const { address: tokenAddress } = await helper.get(TOKEN)

  await helper.deploy(`KeepersFeeVault`, { args: [tokenAddress] })
  const requestFeesCalculator = await helper.deploy(`${VOL}${TOKEN}RequestFeesCalculator`, { args: [] })

  const { address: feesCollectorAddress } = await helper.get(`FeesCollector`)
  const { address: oracleAddress } = await helper.get(`${VOL}Oracle`)
  const { address: feesCalculatorAddress } = await helper.get(`${VOL}${TOKEN}FeesCalculator`)
  const { address: platformAddress } = await helper.get(`${VOL}${TOKEN}Platform`)
  const token = await Token.fromAddress(tokenAddress, await helper.getDeployerSigner())
  const initialRate = fromNumber(1, 18 - token.decimals)
  const volatilityToken = await helper.deployProxy(`${VOL}${TOKEN}VolatilityToken`, {
    args: [
      tokenAddress,
      VOL_TOKEN_NAME,
      VOL_TOKEN_SYMBOL,
      1,
      initialRate,
      platformAddress,
      feesCollectorAddress,
      feesCalculatorAddress,
      requestFeesCalculator.address,
      oracleAddress,
    ],
  })

  await helper.deployProxy(`${VOL}${TOKEN}VolTokenRequestFulfiller`, {
    args: [volatilityToken.address],
  })
}

func.tags = ['deploy-cvi-usdc-volatility-token']
func.dependencies = ['deploy-cvi-usdc-platform', 'set-cvi-usdc-platform-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
