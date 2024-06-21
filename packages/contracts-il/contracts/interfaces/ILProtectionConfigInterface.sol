// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

interface ILProtectionConfigInterface {
  event MinAmountToBePaidChanged(uint256 prevValue, uint256 newValue);
  event MaxILProtectedChanged(uint16 prevValue, uint16 newValue);
  event BuyILProtectionEnabledChanged(bool prevValue, bool newValue);
  event PolicyPeriodChanged(uint256[] prevValue, uint256[] newValue);
  event FeeComponentChanged(uint16 prevValue, uint16 newValue);
  event ExpectedLPTokensValueGrowthChanged(uint16 prevValue, uint16 newValue);
  event PremiumGrowthStartChanged(uint256 prevValue, uint256 newValue);
  event PremiumSlopeChanged(uint256 prevValue, uint256 newValue);

  function setMinAmountToBePaid(uint256 _minAmountToBePaid) external;

  function setMaxILProtected(uint16 _maxILProtected) external;

  function setBuyILProtectionEnabled(bool _isEnabled) external;

  function setFeeComponent(uint16 _feeComponent) external;

  function setPolicyPeriodsInSeconds(uint256[] calldata _policyPeriods) external;

  function setExpectedLPTokensValueGrowth(uint16 _expectedLPTokensValueGrowth) external;

  function minAmountToBePaid() external view returns (uint256);

  function maxILProtected() external view returns (uint16);

  function buyILProtectionEnabled() external view returns (bool);

  function feeComponent() external view returns (uint16);

  function expectedLPTokensValueGrowth() external view returns (uint16);

  function getPolicyPeriodsInSeconds() external view returns (uint256[] memory);

  function policyPeriodExists(uint256 _policyPeriod) external view returns (bool);

  function premiumGrowthStart() external view returns (uint256);

  function premiumSlope() external view returns (uint256);

  function setPremiumGrowthStart(uint256 _premiumGrowthStart) external;

  function setPremiumSlope(uint256 _premiumSlope) external;
}
