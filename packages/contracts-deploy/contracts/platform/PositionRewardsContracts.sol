// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/PositionRewards.sol';

contract CVIUSDCPositionRewards is PositionRewards {
  constructor() PositionRewards() {}
}
