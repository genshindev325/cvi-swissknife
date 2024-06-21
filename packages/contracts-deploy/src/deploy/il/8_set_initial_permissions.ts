import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const protectionControllerRole = await helper.read('ILProtectionConfig', 'PROTECTION_CONTROLLER_ROLE')
  const minterRole = await helper.read('ILProtectionNFT', 'MINTER_ROLE')
  const liquidityProviderRole = await helper.read('LiquidityController', 'LIQUIDITY_PROVIDER_ROLE')
  const depositorRole = await helper.read('TreasuryController', 'DEPOSITOR_ROLE')
  const discountOperationsRole = await helper.read('ILProtectionDiscountNFTController', 'DISCOUNT_OPERATIONS_ROLE')

  const { address: protectionControllerAddress } = await helper.get('ILProtectionController')
  const { address: liquidityControllerAddress } = await helper.get('LiquidityController')

  if (
    !(await helper.read('ILProtectionConfig', 'hasRole', {}, protectionControllerRole, protectionControllerAddress))
  ) {
    await helper.execute('ILProtectionConfig', 'grantRole', {}, protectionControllerRole, protectionControllerAddress)
  }

  if (!(await helper.read('ILProtectionNFT', 'hasRole', {}, minterRole, protectionControllerAddress))) {
    await helper.execute('ILProtectionNFT', 'grantRole', {}, minterRole, protectionControllerAddress)
  }

  if (!(await helper.read('LiquidityController', 'hasRole', {}, liquidityProviderRole, protectionControllerAddress))) {
    await helper.execute('LiquidityController', 'grantRole', {}, liquidityProviderRole, protectionControllerAddress)
  }

  if (!(await helper.read('TreasuryController', 'hasRole', {}, depositorRole, liquidityControllerAddress))) {
    await helper.execute('TreasuryController', 'grantRole', {}, depositorRole, liquidityControllerAddress)
  }

  if (
    !(await helper.read(
      'ILProtectionDiscountNFTController',
      'hasRole',
      {},
      discountOperationsRole,
      protectionControllerAddress,
    ))
  ) {
    await helper.execute(
      'ILProtectionDiscountNFTController',
      'grantRole',
      {},
      discountOperationsRole,
      protectionControllerAddress,
    )
  }
}

func.tags = ['il-contracts-initial-permissions']
func.skip = shouldSkipILContractsDeploy

export default func
