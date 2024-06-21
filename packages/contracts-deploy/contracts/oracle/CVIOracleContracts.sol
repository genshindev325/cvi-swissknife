// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/CVIOracle.sol';

contract ETHVIOracle is CVIOracle {
  constructor(
    AggregatorV3Interface _cviAggregator,
    AggregatorV3Interface _cviDeviationAggregator,
    uint256 _maxCVIValue,
    uint8 leverage
  ) CVIOracle(_cviAggregator, _cviDeviationAggregator, _maxCVIValue, leverage) {}
}

contract CVIOracle2X is CVIOracle {
  constructor(
    AggregatorV3Interface _cviAggregator,
    AggregatorV3Interface _cviDeviationAggregator,
    uint256 _maxCVIValue,
    uint8 leverage
  ) CVIOracle(_cviAggregator, _cviDeviationAggregator, _maxCVIValue, leverage) {}
}
