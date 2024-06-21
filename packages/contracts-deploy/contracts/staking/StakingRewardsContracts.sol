// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/staking/StakingRewards.sol';

contract CVIUSDCLPStakingRewards is StakingRewards {
  constructor(
    address _owner,
    address _rewardsDistribution,
    address _rewardsToken,
    address _stakingToken
  ) StakingRewards(_owner, _rewardsDistribution, _rewardsToken, _stakingToken) {}
}
