// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/test/CVIFeedOracle.sol';

contract CVIDeviationOracle is CVIFeedOracle {
  constructor(uint8 _decimals, int256 _initialAnswer) CVIFeedOracle(_decimals, _initialAnswer) {}
}

contract CVIFakeFeedOracle is CVIFeedOracle {
  constructor(uint8 _decimals, int256 _initialAnswer) CVIFeedOracle(_decimals, _initialAnswer) {}
}
