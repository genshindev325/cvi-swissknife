// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@chainlink/contracts/src/v0.8/KeeperCompatible.sol';
import '@coti-cvi/contracts-cvi/contracts/CVIOracle.sol';
import './ILProtectionNFTInterface.sol';
import './ITokenPairRepository.sol';
import './ILiquidityController.sol';
import './IBaseController.sol';
import '../libraries/PremiumCalculator.sol';
import './ILProtectionDiscountNFTControllerInterface.sol';

interface ILProtectionControllerInterface is IBaseController, KeeperCompatibleInterface {
  event ProtectionBought(
    uint256 indexed id,
    address indexed owner,
    uint256 protectionStartTimestamp,
    uint256 protectionEndTimestamp,
    uint256 premiumCostUSD,
    string token1Symbol,
    string token2Symbol,
    uint256 policyPeriod,
    uint256 token1EntryPriceUSD,
    uint256 token2EntryPriceUSD,
    uint256 collateral
  );
  event ProtectionClosed(
    uint256 amountPaidUSD,
    uint256 indexed id,
    address indexed owner,
    uint256 protectionStartTimestamp,
    uint256 protectionEndTimestamp,
    uint256 premiumCostUSD,
    string token1Symbol,
    string token2Symbol,
    uint256 policyPeriod,
    uint256 token1EndPriceUSD,
    uint256 token2EndPriceUSD,
    uint256 collateral
  );
  event MaxProtectionsInUpkeepChanged(uint256 prevValue, uint256 newValue);
  event CollateralUpdated(
    string token1Symbol,
    string token2Symbol,
    uint256 protectionId,
    uint256 prevPairCollateral,
    uint256 newPairCollateral,
    uint256 prevCollateral,
    uint256 newCollateral,
    uint256 prevLiquidity,
    uint256 newLiquidity
  );
  event ILProtectionDiscountNFTControllerChanged(
    ILProtectionDiscountNFTControllerInterface prevValue,
    ILProtectionDiscountNFTControllerInterface newValue
  );

  function addLiquidity(uint256 _amount) external;

  function withdrawLiquidity(uint256 _amount, address _to) external;

  function buyProtection(
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256 _lpTokensWorthAtBuyTimeUSD,
    uint256 _maxPremiumCostUSD,
    uint256 _policyPeriod
  ) external;

  function closeProtections(uint256[] calldata _protectionsIds) external;

  function checkUpkeep(bytes calldata _checkData)
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory performData);

  function performUpkeep(bytes calldata _performData) external override;

  function setMaxILProtected(uint16 _maxILProtected) external;

  function setMaxProtectionsInUpkeep(uint8 _maxProtectionsInUpkeep) external;

  function setILProtectionDiscountNFTController(ILProtectionDiscountNFTControllerInterface _newInstance) external;

  function collateral() external view returns (uint256);

  function totalLPTokensWorthAtBuyTimeUSD() external view returns (uint256);

  function cumulativeSumLPTokensWorthAtBuyTimeUSD() external view returns (uint256);

  function protectionNFT() external view returns (ILProtectionNFTInterface);

  function protectionDiscountNFTController() external view returns (ILProtectionDiscountNFTControllerInterface);

  function protectionConfig() external view returns (ILProtectionConfigInterface);

  function tokenPairRepository() external view returns (ITokenPairRepository);

  function liquidityController() external view returns (ILiquidityController);

  function cviOracle() external view returns (CVIOracle);

  function getFinalizedProtectionsIds() external view returns (uint256[] memory);

  function calculatePremiumDetailsAndMaxAmountToBePaid(
    address _buyer,
    string calldata _token1Symbol,
    string calldata _token2Symbol,
    uint256 _lpTokensWorthAtBuyTimeUSD,
    uint256 _policyPeriod
  )
    external
    view
    returns (
      uint256,
      uint256,
      uint256,
      uint256,
      uint256,
      DiscountNFTType
    );

  function calculateParameterizedPremium(
    uint256 _lpTokensWorthAtBuyTimeUSD,
    uint256 _totalLPTokensWorthAtBuyTimeUSD,
    uint16 _expectedLPTokensValueGrowth,
    uint256 _liquidity,
    uint16 _impermanentLoss,
    PremiumParams calldata _premiumParams,
    uint256 _cvi,
    uint256 _initialGlobalPremiumParam,
    uint256 _maxGlobalPremiumParam
  ) external pure returns (uint256);

  function calcEstimatedAmountToBePaid(
    uint256 _lpTokensWorthAtBuyTimeUSD,
    uint16 _expectedLPTokensValueGrowth,
    uint16 _impermanentLoss
  ) external pure returns (uint256);

  function calculateIL(
    uint256 _token1EntryPriceUSD,
    uint256 _token2EntryPriceUSD,
    uint256 _token1EndPriceUSD,
    uint256 _token2EndPriceUSD
  ) external pure returns (uint16);

  function calculateOpenProtectionIL(uint256 _protectionId) external view returns (uint16);

  function calcAmountToBePaid(
    uint256 _lpTokensWorthAtBuyTimeUSD,
    uint256 _token1EntryPrice,
    uint256 _token2EntryPrice,
    uint256 _token1EndPrice,
    uint256 _token2EndPrice
  ) external view returns (uint256);

  function calcMaxValueOfTokensWorthToProtect(string memory _token1Symbol, string memory _token2Symbol)
    external
    view
    returns (uint256);

  function calcAmountToBePaidWithProtectionId(uint256 _protectionId) external view returns (uint256);

  function calculateFee(uint256 _lpTokensWorthAtBuyTimeUSD, uint16 _feeComponent) external pure returns (uint256);
}
