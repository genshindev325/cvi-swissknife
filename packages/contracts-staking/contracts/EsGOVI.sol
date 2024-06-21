// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract EsGOVI is ERC20, Ownable, AccessControl {
  bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

  modifier onlyAdminOrOperator() {
    require(hasRole(OPERATOR_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'EsGOVI: forbidden');

    _;
  }

  constructor(address _owner) ERC20('Escrowed GOVI', 'esGOVI') {
    _transferOwnership(_owner);
    _setupRole(DEFAULT_ADMIN_ROLE, _owner);
  }

  function transfer(address _recipient, uint256 _amount) public override onlyRole(OPERATOR_ROLE) returns (bool) {
    _transfer(msg.sender, _recipient, _amount);
    return true;
  }

  function transferFrom(
    address _sender,
    address _recipient,
    uint256 _amount
  ) public override onlyRole(OPERATOR_ROLE) returns (bool) {
    _transfer(_sender, _recipient, _amount);
    return true;
  }

  function mint(address _account, uint256 _amount) public onlyAdminOrOperator {
    _mint(_account, _amount);
  }

  function burn(address _account, uint256 _amount) public onlyAdminOrOperator {
    _burn(_account, _amount);
  }
}
