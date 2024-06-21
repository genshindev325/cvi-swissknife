import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'
import { maxProtectionsInUpkeep } from '../../state/il-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()

  const cviOracle = await helper.get('CVIOracle')
  const protectionConfig = await helper.get('ILProtectionConfig')
  const liquidityController = await helper.get('LiquidityController')
  const tokenPairRepository = await helper.get('TokenPairRepository')
  const protectionNFT = await helper.get('ILProtectionNFT')
  const protectionDiscountNFTController = await helper.get('ILProtectionDiscountNFTController')

  const mathUtils = await helper.get('MathUtils')
  const ilUtils = await helper.get('ILUtils')
  const premiumCalculator = await helper.get('PremiumCalculator')

  await helper.deployProxy('ILProtectionController', {
    args: [
      owner,
      protectionConfig.address,
      liquidityController.address,
      tokenPairRepository.address,
      protectionNFT.address,
      protectionDiscountNFTController.address,
      cviOracle.address,
      maxProtectionsInUpkeep,
    ],
    libraries: {
      ILUtils: ilUtils.address,
      MathUtils: mathUtils.address,
      PremiumCalculator: premiumCalculator.address,
    },
  })
}

func.tags = ['il-contracts']
func.dependencies = [
  'deploy-cvi-oracle',
  'il-protection-config',
  'il-liquidity-controller',
  'il-token-pair-repository',
  'il-protection-nft',
  'il-protection-discount-nft-controller',
  'il-libraries',
]
func.skip = shouldSkipILContractsDeploy

export default func
