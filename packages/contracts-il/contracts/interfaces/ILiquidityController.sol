// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import './IBaseController.sol';
import './ITreasuryController.sol';

interface ILiquidityController is IBaseController {
  event LiquidityAdded(address indexed from, uint256 amount, uint256 updatedTotalLiquidity);
  event LiquidityWithdrawn(address indexed to, uint256 amount, uint256 updatedTotalLiquidity);
  event LiquidityTokenChanged(IERC20 prevValue, IERC20 newValue);
  event TreasuryControllerChanged(ITreasuryController prevValue, ITreasuryController newValue);

  function addLiquidity(address _from, uint256 _amount) external;

  function addLiquidityWithProtectionFee(
    uint256 _protectionId,
    address _from,
    uint256 _amountWithoutFee,
    uint256 _fee,
    uint16 _feeComponent
  ) external;

  function withdrawLiquidity(uint256 _amount, address _to) external;

  function approveTreasury(uint256 _amount) external;

  function setLiquidityToken(IERC20 _token) external;

  function setTreasuryController(ITreasuryController _newInstance) external;

  function treasuryController() external view returns (ITreasuryController);

  function liquidityToken() external view returns (IERC20);

  function liquidityTokenDecimals() external view returns (uint8);

  function liquidity() external view returns (uint256);
}
