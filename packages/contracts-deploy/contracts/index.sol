// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

// il contracts
import '@coti-cvi/contracts-il/contracts/ILProtectionConfig.sol';
import '@coti-cvi/contracts-il/contracts/ILProtectionController.sol';
import '@coti-cvi/contracts-il/contracts/ILProtectionNFT.sol';
import '@coti-cvi/contracts-il/contracts/LiquidityController.sol';
import '@coti-cvi/contracts-il/contracts/TokenPairRepository.sol';
import '@coti-cvi/contracts-il/contracts/TreasuryController.sol';
import '@coti-cvi/contracts-il/contracts/ILProtectionDiscountNFTController.sol';

// il test contracts
import '@coti-cvi/contracts-il/contracts/test/PriceOracleContracts.sol';
import '@coti-cvi/contracts-il/contracts/test/USDC.sol';
import '@coti-cvi/contracts-il/contracts/test/ILProtectionDiscountNFT.sol';

// cvi contracts
import '@coti-cvi/contracts-cvi/contracts/staking/StakingVault.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/Treasury.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/StakingContracts.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/Staking.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/FeesCollector.sol';
import '@coti-cvi/contracts-cvi/contracts/KeepersFeeVault.sol';
import '@coti-cvi/contracts-cvi/contracts/PlatformHelper.sol';

// staking/vesting contracts
import '@coti-cvi/contracts-staking/contracts/RewardRouter.sol';
import '@coti-cvi/contracts-staking/contracts/RewardTracker.sol';
import '@coti-cvi/contracts-staking/contracts/RewardDistributor.sol';
import '@coti-cvi/contracts-staking/contracts/Vester.sol';
import '@coti-cvi/contracts-staking/contracts/EsGOVI.sol';
import '@coti-cvi/contracts-staking/contracts/instances/RewardDistributorContracts.sol';
import '@coti-cvi/contracts-staking/contracts/instances/RewardTrackerContracts.sol';
import '@coti-cvi/contracts-staking/contracts/instances/VestingContracts.sol';

// staking/vesting test contracts
import '@coti-cvi/contracts-staking/contracts/test/FakeCVIUSDCThetaVault.sol';
import '@coti-cvi/contracts-staking/contracts/test/FakeGOVI.sol';
