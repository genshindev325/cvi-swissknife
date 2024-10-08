// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/test/FakeERC20.sol';

contract FakeCVIUSDCThetaVault is FakeERC20 {
  address public rewardRouter;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _supply,
    uint8 _decimals
  ) FakeERC20(_name, _symbol, _supply, _decimals) {}

  function setRewardRouter(address _rewardRouter) external {
    rewardRouter = _rewardRouter;
  }
}
