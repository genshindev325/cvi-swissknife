// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import './BaseController.sol';
import './interfaces/ITreasuryController.sol';

contract TreasuryController is BaseController, ITreasuryController {
  bytes32 public constant DEPOSITOR_ROLE = keccak256('DEPOSITOR_ROLE');

  address public override treasury;
  IERC20 public override treasuryToken;

  function initialize(
    address _owner,
    address _treasury,
    IERC20 _treasuryToken
  ) external initializer {
    BaseController.initialize(_owner);

    treasury = _treasury;
    treasuryToken = _treasuryToken;
  }

  function depositFee(
    uint256 _protectionId,
    uint256 _fee,
    uint16 _feeComponent
  ) external override onlyRole(DEPOSITOR_ROLE) {
    require(_fee > 0, 'Fee must be larger than 0');
    require(_feeComponent > 0, 'Fee component must be larger than 0');

    treasuryToken.transferFrom(msg.sender, treasury, _fee);

    emit DepositFee(_protectionId, msg.sender, _fee, _feeComponent, treasury, treasuryToken);
  }

  function setTreasury(address _treasury) external override onlyAdmin onlyValidAddress(_treasury) {
    checkTreasuryZeroBalance();

    emit TreasuryChanged(treasury, _treasury);

    treasury = _treasury;
  }

  function setTreasuryToken(IERC20 _treasuryToken)
    external
    override
    onlyAdmin
    onlyValidAddress(address(_treasuryToken))
  {
    checkTreasuryZeroBalance();

    emit TreasuryTokenChanged(treasuryToken, _treasuryToken);

    treasuryToken = _treasuryToken;
  }

  function checkTreasuryZeroBalance() private view {
    require(treasuryToken.balanceOf(treasury) == 0, 'Existing treasury balance must be 0');
  }
}
