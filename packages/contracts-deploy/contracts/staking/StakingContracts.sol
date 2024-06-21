// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/staking/Staking.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/StakingVault.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/FeesCollector.sol';
import '@coti-cvi/contracts-cvi/contracts/staking/Treasury.sol';

contract StakingV2 is Staking {
  constructor() Staking() {}
}
