// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/interfaces/AggregatorV3Interface.sol';
import './IBaseController.sol';
import './ILProtectionConfigInterface.sol';
import '../libraries/PremiumCalculator.sol';

struct TokenPair {
  string token1Symbol;
  string token2Symbol;
  AggregatorV3Interface token1PriceAggregator;
  AggregatorV3Interface token2PriceAggregator;
  bool exists;
}

interface ITokenPairRepository is IBaseController {
  event PairSet(TokenPair prevValue, TokenPair newValue);
  event PremiumParamsChanged(
    string token1Symbol,
    string token2Symbol,
    uint256 policyPeriod,
    PremiumParams prevValue,
    PremiumParams newValue
  );
  event PremiumParamsDeleted(
    string token1Symbol,
    string token2Symbol,
    uint256 policyPeriod,
    PremiumParams deletedParams
  );
  event CollateralCapComponentChanged(string token1Symbol, string token2Symbol, uint16 prevValue, uint16 newValue);
  event PriceTokenDecimalsChanged(uint8 prevValue, uint8 newValue);
  event ILProtectionConfigChanged(ILProtectionConfigInterface prevValue, ILProtectionConfigInterface newValue);

  function setPair(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    AggregatorV3Interface _token1PriceAggregator,
    AggregatorV3Interface _token2PriceAggregator
  ) external;

  function setPremiumsParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256[] calldata _policyPeriods,
    PremiumParams[] calldata _premiumsParams
  ) external;

  function setCollateralCapComponent(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint16 _collateralCapComponent
  ) external;

  function setPriceTokenDecimals(uint8 _priceTokenDecimals) external;

  function setILProtectionConfig(ILProtectionConfigInterface _newInstance) external;

  function deletePremiumsParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256[] calldata _policyPeriods
  ) external;

  function priceTokenDecimals() external view returns (uint8);

  function getPair(string calldata _token1Symbol, string calldata _token2Symbol)
    external
    view
    returns (TokenPair memory);

  function getPairs() external view returns (TokenPair[] memory);

  function getPremiumParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256 _policyPeriod
  ) external view returns (PremiumParams memory);

  function getCollateralCapComponent(string calldata _token1Symbol, string calldata _token2Symbol)
    external
    view
    returns (uint16);

  function getTokenPrice(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    bool _isFirstTokenPrice
  ) external view returns (uint256);

  function protectionConfig() external view returns (ILProtectionConfigInterface);

  function getOrderedTokenPairIfExists(string calldata _token1Symbol, string calldata _token2Symbol)
    external
    view
    returns (TokenPair memory);
}
