// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import './IBaseController.sol';
import './ILProtectionDiscountNFTInterface.sol';

enum DiscountNFTType {
  NONE,
  GOLD,
  DIAMOND
}

struct DiscountNFTDetails {
  DiscountNFTType discountType;
  bool isUsed;
  uint16 premiumDiscountComponent;
  uint256 freeOfChargeTokensWorth;
}

interface ILProtectionDiscountNFTControllerInterface is IBaseController {
  event ProtectionDiscountNFTChanged(
    ILProtectionDiscountNFTInterface prevValue,
    ILProtectionDiscountNFTInterface newValue
  );
  event PremiumDiscountComponentChanged(uint16 prevValue, uint16 newValue);
  event FreeOfChargeTokensWorthChanged(uint256 prevValue, uint256 newValue);
  event DiscountMarkedAsUsed(address indexed owner);

  function markDiscountAsUsed(address _owner) external;

  function setProtectionDiscountNFT(ILProtectionDiscountNFTInterface _newInstance) external;

  function setPremiumDiscountComponent(uint16 _premiumDiscountComponent) external;

  function setFreeOfChargeTokensWorth(uint256 _freeOfChargeTokensWorth) external;

  function setEnabled(bool _enabled) external;

  function premiumDiscountComponent() external view returns (uint16);

  function freeOfChargeTokensWorth() external view returns (uint256);

  function enabled() external view returns (bool);

  function getDiscountDetails(address _owner) external view returns (DiscountNFTDetails memory);
}
