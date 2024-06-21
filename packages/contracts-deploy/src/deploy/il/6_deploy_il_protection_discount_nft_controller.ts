import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'
import { premiumDiscountComponent, freeOfChargeTokensWorth, isDiscountEnabled } from '../../state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const protectionDiscountNFT = await helper.get('ILProtectionDiscountNFT')

  await helper.deployProxy('ILProtectionDiscountNFTController', {
    args: [owner, protectionDiscountNFT.address, premiumDiscountComponent, freeOfChargeTokensWorth, isDiscountEnabled],
  })
}

func.tags = ['il-protection-discount-nft-controller']
func.dependencies = ['test-il-protection-discount-nft']
func.skip = shouldSkipILContractsDeploy

export default func
