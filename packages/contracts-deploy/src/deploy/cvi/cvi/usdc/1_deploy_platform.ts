import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { Token } from '../../../../../../lw-sdk/src/token/token'
import { fromNumber } from '../../../../../../lw-sdk/src/util/big-number'
import {
  VOL,
  TOKEN,
  MAX_INDEX_VALUE,
  PLATFORM_LP_TOKEN_NAME,
  PLATFORM_LP_TOKEN_SYMBOL,
} from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const { address: tokenAddress } = await helper.get(TOKEN)
  const { address: goviAddress } = await helper.get('GOVI')
  const { address: oracleAddress } = await helper.get(`${VOL}Oracle`)
  const { address: stakingV2Address } = await helper.get('StakingV2')
  const { address: liquidationAddress } = await helper.get(`${VOL}${TOKEN}Liquidation`)
  const { address: feesCalculatorAddress } = await helper.get(`${VOL}${TOKEN}FeesCalculator`)

  const token = await Token.fromAddress(tokenAddress, await helper.getDeployerSigner())
  const initialRate = fromNumber(1, 18 - token.decimals)

  const platform = await helper.deployProxy(`${VOL}${TOKEN}Platform`, {
    args: [
      tokenAddress,
      PLATFORM_LP_TOKEN_NAME,
      PLATFORM_LP_TOKEN_SYMBOL,
      initialRate,
      MAX_INDEX_VALUE,
      feesCalculatorAddress,
      oracleAddress,
      liquidationAddress,
    ],
  })

  // await helper.deployProxy(`${VOL}${TOKEN}PositionRewards`, {
  //   args: [goviAddress],
  // })

  // await helper.deploy(`${VOL}${TOKEN}LPStakingRewards`, {
  //   args: [owner, owner, goviAddress, platform.address],
  // })

  await helper.deployProxy(`PlatformHelper`, {
    args: [goviAddress, stakingV2Address],
  })
}

func.tags = ['deploy-cvi-usdc-platform']
func.dependencies = ['deploy-cvi-usdc-platform-dependencies', 'test-staking', 'fake-cvi-oracle', 'deploy-cvi-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
