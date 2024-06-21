import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'
import { protectionMetadataCID } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  await helper.deployProxy('ILProtectionNFT', {
    args: [owner, 'Impermanent Loss Protector', 'ILProtector', protectionMetadataCID],
  })
}

func.tags = ['il-protection-nft']
func.skip = shouldSkipILContractsDeploy

export default func
