// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import './interfaces/IBaseController.sol';

abstract contract BaseController is IBaseController, OwnableUpgradeable, AccessControlUpgradeable {
  uint16 public constant MAX_PRECISION = 10000;

  modifier onlyAdmin() {
    _checkRole(DEFAULT_ADMIN_ROLE, msg.sender);

    _;
  }

  modifier onlyValidAddress(address addr) {
    require(addr != address(0), 'Invalid address');

    _;
  }

  function initialize(address _owner) internal onlyInitializing {
    OwnableUpgradeable.__Ownable_init();
    AccessControlUpgradeable.__AccessControl_init();

    _setupRole(DEFAULT_ADMIN_ROLE, _owner);

    _transferOwnership(_owner);
  }
}
