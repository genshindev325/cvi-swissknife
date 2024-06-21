// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IBaseController.sol';

interface ITreasuryController is IBaseController {
  event DepositFee(
    uint256 indexed protectionId,
    address indexed from,
    uint256 fee,
    uint16 feeComponent,
    address indexed treasury,
    IERC20 treasuryToken
  );
  event TreasuryChanged(address prevValue, address newValue);
  event TreasuryTokenChanged(IERC20 prevValue, IERC20 newValue);

  function depositFee(
    uint256 _protectionId,
    uint256 _fee,
    uint16 _feeComponent
  ) external;

  function setTreasury(address _treasury) external;

  function setTreasuryToken(IERC20 _treasuryToken) external;

  function treasury() external view returns (address);

  function treasuryToken() external view returns (IERC20);
}
