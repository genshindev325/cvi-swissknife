// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import './BaseController.sol';
import './interfaces/ILProtectionDiscountNFTControllerInterface.sol';

contract ILProtectionDiscountNFTController is BaseController, ILProtectionDiscountNFTControllerInterface {
  bytes32 public constant DISCOUNT_OPERATIONS_ROLE = keccak256('DISCOUNT_OPERATIONS_ROLE');

  ILProtectionDiscountNFTInterface private protectionDiscountNFT;
  uint16 public override premiumDiscountComponent;
  bool public override enabled;
  uint256 public override freeOfChargeTokensWorth;

  modifier isEnabled() {
    require(enabled, 'Discount feature is disabled');

    _;
  }

  function initialize(
    address _owner,
    ILProtectionDiscountNFTInterface _protectionDiscountNFT,
    uint16 _premiumDiscountComponent,
    uint256 _freeOfChargeTokensWorth,
    bool _enabled
  ) external initializer {
    validatePremiumDiscountComponent(_premiumDiscountComponent);

    BaseController.initialize(_owner);

    protectionDiscountNFT = _protectionDiscountNFT;
    premiumDiscountComponent = _premiumDiscountComponent;
    freeOfChargeTokensWorth = _freeOfChargeTokensWorth;
    enabled = _enabled;
  }

  function markDiscountAsUsed(address _owner) external override onlyRole(DISCOUNT_OPERATIONS_ROLE) isEnabled {
    protectionDiscountNFT.setUsed(_owner);

    emit DiscountMarkedAsUsed(_owner);
  }

  function setProtectionDiscountNFT(ILProtectionDiscountNFTInterface _newInstance) external override onlyAdmin {
    emit ProtectionDiscountNFTChanged(protectionDiscountNFT, _newInstance);

    protectionDiscountNFT = _newInstance;
  }

  function setPremiumDiscountComponent(uint16 _premiumDiscountComponent) external override onlyAdmin {
    validatePremiumDiscountComponent(_premiumDiscountComponent);

    emit PremiumDiscountComponentChanged(premiumDiscountComponent, _premiumDiscountComponent);

    premiumDiscountComponent = _premiumDiscountComponent;
  }

  function setFreeOfChargeTokensWorth(uint256 _freeOfChargeTokensWorth) external override onlyAdmin {
    emit FreeOfChargeTokensWorthChanged(freeOfChargeTokensWorth, _freeOfChargeTokensWorth);

    freeOfChargeTokensWorth = _freeOfChargeTokensWorth;
  }

  function setEnabled(bool _enabled) external override onlyAdmin {
    enabled = _enabled;
  }

  function getDiscountDetails(address _owner) external view override returns (DiscountNFTDetails memory) {
    if (!enabled || address(0) == address(protectionDiscountNFT)) {
      return
        DiscountNFTDetails({
          discountType: DiscountNFTType.NONE,
          isUsed: false,
          premiumDiscountComponent: 0,
          freeOfChargeTokensWorth: 0
        });
    }

    (uint256 index, bool minted, bool used) = protectionDiscountNFT.getTokenInfo(_owner);

    require(index == 0 || index == 1, 'Invalid discount nft index');

    DiscountNFTType discountType;

    if (minted == false) {
      discountType = DiscountNFTType.NONE;
    } else if (index == 0) {
      discountType = DiscountNFTType.GOLD;
    } else {
      discountType = DiscountNFTType.DIAMOND;
    }

    return
      DiscountNFTDetails({
        discountType: discountType,
        isUsed: used,
        premiumDiscountComponent: premiumDiscountComponent,
        freeOfChargeTokensWorth: freeOfChargeTokensWorth
      });
  }

  function validatePremiumDiscountComponent(uint16 _premiumDiscountComponent) private pure {
    require(_premiumDiscountComponent <= MAX_PRECISION, 'premiumDiscountComponent out of range');
  }
}
