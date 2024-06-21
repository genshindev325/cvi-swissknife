// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import './interfaces/ITokenPairRepository.sol';
import './BaseController.sol';

contract TokenPairRepository is ITokenPairRepository, BaseController {
  error TokenPairDoesNotExist();
  uint8 public override priceTokenDecimals;
  ILProtectionConfigInterface public override protectionConfig;
  mapping(string => mapping(string => TokenPair)) public tokensPairs;
  mapping(string => mapping(string => mapping(uint256 => PremiumParams))) public tokensPairsPremiumParams;
  TokenPair[] public tokensPairsList;
  mapping(string => mapping(string => uint16)) public tokensPairsCollateralCapComponents;

  function initialize(
    address _owner,
    uint8 _priceTokenDecimals,
    ILProtectionConfigInterface _protectionConfig
  ) external initializer {
    BaseController.initialize(_owner);

    priceTokenDecimals = _priceTokenDecimals;
    protectionConfig = _protectionConfig;
  }

  function setPair(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    AggregatorV3Interface _token1PriceAggregator,
    AggregatorV3Interface _token2PriceAggregator
  ) external override onlyAdmin {
    require(bytes(_token1Symbol).length > 0 && bytes(_token2Symbol).length > 0, 'Empty token symbol');
    require(
      address(_token1PriceAggregator) != address(0) && address(_token2PriceAggregator) != address(0),
      'Invalid price aggregator address'
    );

    TokenPair memory newPair = createOrderedTokenPairStruct(
      _token1Symbol,
      _token2Symbol,
      _token1PriceAggregator,
      _token2PriceAggregator
    );

    emit PairSet(tokensPairs[newPair.token1Symbol][newPair.token2Symbol], newPair);

    tokensPairs[newPair.token1Symbol][newPair.token2Symbol] = newPair;

    updateTokensPairsArray(newPair);
  }

  function setPremiumsParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256[] calldata _policyPeriods,
    PremiumParams[] calldata _premiumsParams
  ) external override onlyAdmin {
    require(_policyPeriods.length > 0, 'Empty policy periods array');
    require(_policyPeriods.length == _premiumsParams.length, 'Policy periods and premium params length mismatch');

    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    for (uint256 i; i < _policyPeriods.length; i++) {
      require(protectionConfig.policyPeriodExists(_policyPeriods[i]), 'Invalid policy period');

      emit PremiumParamsChanged(
        pair.token1Symbol,
        pair.token2Symbol,
        _policyPeriods[i],
        tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriods[i]],
        _premiumsParams[i]
      );

      delete tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriods[i]];
      tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriods[i]] = _premiumsParams[i];
    }
  }

  function deletePremiumsParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256[] calldata _policyPeriods
  ) external override onlyAdmin {
    require(_policyPeriods.length > 0, 'Empty policy periods array');

    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    for (uint256 i; i < _policyPeriods.length; i++) {
      require(protectionConfig.policyPeriodExists(_policyPeriods[i]), 'Invalid policy period');

      emit PremiumParamsDeleted(
        pair.token1Symbol,
        pair.token2Symbol,
        _policyPeriods[i],
        tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriods[i]]
      );

      delete tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriods[i]];
    }
  }

  function setCollateralCapComponent(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint16 _collateralCapComponent
  ) external override onlyAdmin {
    require(_collateralCapComponent <= MAX_PRECISION, 'collateralCapComponent is out of range');

    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    emit CollateralCapComponentChanged(
      pair.token1Symbol,
      pair.token2Symbol,
      tokensPairsCollateralCapComponents[pair.token1Symbol][pair.token2Symbol],
      _collateralCapComponent
    );

    tokensPairsCollateralCapComponents[pair.token1Symbol][pair.token2Symbol] = _collateralCapComponent;
  }

  function setPriceTokenDecimals(uint8 _priceTokenDecimals) external override onlyAdmin {
    require(tokensPairsList.length > 0, 'No existing tokens pairs');

    for (uint256 i; i < tokensPairsList.length; i++) {
      require(
        tokensPairsList[i].token1PriceAggregator.decimals() == _priceTokenDecimals &&
          tokensPairsList[i].token2PriceAggregator.decimals() == _priceTokenDecimals,
        'Decimals mismatch with current aggregators'
      );
    }

    emit PriceTokenDecimalsChanged(priceTokenDecimals, _priceTokenDecimals);

    priceTokenDecimals = _priceTokenDecimals;
  }

  function setILProtectionConfig(ILProtectionConfigInterface _newInstance)
    external
    override
    onlyAdmin
    onlyValidAddress(address(_newInstance))
  {
    emit ILProtectionConfigChanged(protectionConfig, _newInstance);

    protectionConfig = _newInstance;
  }

  function getPair(string calldata _token1Symbol, string calldata _token2Symbol)
    external
    view
    override
    returns (TokenPair memory)
  {
    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    return tokensPairs[pair.token1Symbol][pair.token2Symbol];
  }

  function getPairs() external view override returns (TokenPair[] memory) {
    return tokensPairsList;
  }

  function getPremiumParams(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256 _policyPeriod
  ) external view override returns (PremiumParams memory) {
    require(protectionConfig.policyPeriodExists(_policyPeriod), 'Invalid policy period');

    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    return tokensPairsPremiumParams[pair.token1Symbol][pair.token2Symbol][_policyPeriod];
  }

  function getCollateralCapComponent(string calldata _token1Symbol, string calldata _token2Symbol)
    external
    view
    override
    returns (uint16)
  {
    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    return tokensPairsCollateralCapComponents[pair.token1Symbol][pair.token2Symbol];
  }

  function getOrderedTokenPairIfExists(string calldata _token1Symbol, string calldata _token2Symbol)
    public
    view
    override
    returns (TokenPair memory)
  {
    if (tokensPairs[_token2Symbol][_token1Symbol].exists) {
      return tokensPairs[_token2Symbol][_token1Symbol];
    } else if (tokensPairs[_token1Symbol][_token2Symbol].exists) {
      return tokensPairs[_token1Symbol][_token2Symbol];
    }

    revert TokenPairDoesNotExist();
  }

  function getTokenPrice(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    bool _isFirstTokenPrice
  ) external view override returns (uint256) {
    TokenPair memory pair = getOrderedTokenPairIfExists(_token1Symbol, _token2Symbol);

    if (_isFirstTokenPrice) {
      return _getTokenPrice(pair.token1PriceAggregator);
    } else {
      return _getTokenPrice(pair.token2PriceAggregator);
    }
  }

  function _getTokenPrice(AggregatorV3Interface priceAggregator) private view returns (uint256) {
    (, int256 price, , , ) = priceAggregator.latestRoundData();

    require(price >= 0, 'Invalid price - negative');

    return uint256(price);
  }

  function updateTokensPairsArray(TokenPair memory _pair) private {
    for (uint256 i; i < tokensPairsList.length; i++) {
      if (
        keccak256(abi.encodePacked(tokensPairsList[i].token1Symbol)) ==
        keccak256(abi.encodePacked(_pair.token1Symbol)) &&
        keccak256(abi.encodePacked(tokensPairsList[i].token2Symbol)) == keccak256(abi.encodePacked(_pair.token2Symbol))
      ) {
        tokensPairsList[i].token1PriceAggregator = _pair.token1PriceAggregator;
        tokensPairsList[i].token2PriceAggregator = _pair.token2PriceAggregator;

        return;
      }
    }

    tokensPairsList.push(_pair);
  }

  function createOrderedTokenPairStruct(
    string memory _token1Symbol,
    string memory _token2Symbol,
    AggregatorV3Interface _token1PriceAggregator,
    AggregatorV3Interface _token2PriceAggregator
  ) private view returns (TokenPair memory) {
    if (tokensPairs[_token2Symbol][_token1Symbol].exists) {
      return
        TokenPair({
          token1Symbol: _token2Symbol,
          token2Symbol: _token1Symbol,
          token1PriceAggregator: _token2PriceAggregator,
          token2PriceAggregator: _token1PriceAggregator,
          exists: true
        });
    }

    return
      TokenPair({
        token1Symbol: _token1Symbol,
        token2Symbol: _token2Symbol,
        token1PriceAggregator: _token1PriceAggregator,
        token2PriceAggregator: _token2PriceAggregator,
        exists: true
      });
  }
}
