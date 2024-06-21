// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/test/FakePriceProvider.sol';
import '@coti-cvi/contracts-cvi/contracts/test/CVIFeedOracle.sol';

contract ETHUSDOracle is FakePriceProvider {
  constructor(int256 _price) FakePriceProvider(_price) {}
}

contract LINKUSDOracle is FakePriceProvider {
  constructor(int256 _price) FakePriceProvider(_price) {}
}

contract USDUSDOracle is FakePriceProvider {
  constructor(int256 _price) FakePriceProvider(_price) {}
}
