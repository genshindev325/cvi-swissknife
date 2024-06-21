import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { address: volTokenAddress } = await helper.get(`${VOL}${TOKEN}VolatilityToken`)
  const { address: pairAddress } = await hre.deployments.get(`${VOL}${TOKEN}VolatilityToken${TOKEN}UNIV2Pair`)

  await helper.deploy(`${VOL}${TOKEN}Rebaser`, { args: [volTokenAddress, [pairAddress]] })
}

func.tags = ['deploy-cvi-usdc-rebaser']
func.dependencies = ['create-cvi-usdc-volatility-token-pair']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
