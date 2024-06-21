import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const promises = [
    helper.verifyContract(`PlatformHelper`, '@coti-cvi/contracts-cvi/contracts/PlatformHelper.sol:PlatformHelper'),
    helper.verifyContract(`StakingV2`, 'contracts/staking/StakingContracts.sol:StakingV2'),
    helper.verifyContract(`KeepersFeeVault`, '@coti-cvi/contracts-cvi/contracts/KeepersFeeVault.sol:KeepersFeeVault'),
    helper.verifyContract(`CVIUSDCLiquidation`, 'contracts/platform/LiquiditationContracts.sol:CVIUSDCLiquidation'),
    helper.verifyContract(
      `CVIUSDCFeesCalculator`,
      'contracts/platform/FeesCalculatorContracts.sol:CVIUSDCFeesCalculator',
    ),
    helper.verifyContract(`CVIUSDCPlatform`, 'contracts/platform/PlatformContracts.sol:CVIUSDCPlatform'),
    helper.verifyContract(
      `CVIUSDCRequestFeesCalculator`,
      'contracts/volatility-token/RequestFeesCalculatorContracts.sol:CVIUSDCRequestFeesCalculator',
    ),
    helper.verifyContract(
      `CVIUSDCVolatilityToken`,
      'contracts/volatility-token/VolatilityTokenContracts.sol:CVIUSDCVolatilityToken',
    ),
    helper.verifyContract(
      `CVIUSDCVolTokenRequestFulfiller`,
      'contracts/volatility-token/VolatilityTokenRequestFulfillerContracts.sol:CVIUSDCVolTokenRequestFulfiller',
    ),
    helper.verifyContract(`CVIUSDCRebaser`, 'contracts/volatility-token/RebaserContracts.sol:CVIUSDCRebaser'),
    helper.verifyContract(`CVIUSDCThetaVault`, 'contracts/theta-vault/ThetaVaultContracts.sol:CVIUSDCThetaVault'),
    helper.verifyContract(
      `CVIUSDCThetaVaultRequestFulfiller`,
      'contracts/theta-vault/ThetaVaultRequestFulfillerContracts.sol:CVIUSDCThetaVaultRequestFulfiller',
    ),
  ]

  await Promise.allSettled(promises)
}

func.tags = ['verify-contracts']

export default func
