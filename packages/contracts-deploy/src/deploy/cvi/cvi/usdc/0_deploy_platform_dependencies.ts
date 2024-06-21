import { AddressZero } from '@ethersproject/constants'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import { VOL, TOKEN, MAX_INDEX_VALUE, leverage } from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  await helper.deploy(`${VOL}${TOKEN}Liquidation`, { args: [MAX_INDEX_VALUE] })

  await helper.deploy(`${VOL}${TOKEN}FeesCalculator`, { args: [AddressZero, MAX_INDEX_VALUE, leverage] })
}

func.tags = ['deploy-cvi-usdc-platform-dependencies']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
