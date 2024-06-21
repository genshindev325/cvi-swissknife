// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol';
import './BaseController.sol';
import './interfaces/ILiquidityController.sol';

contract LiquidityController is ILiquidityController, BaseController {
  bytes32 public constant LIQUIDITY_PROVIDER_ROLE = keccak256('LIQUIDITY_PROVIDER_ROLE');
  IERC20 public override liquidityToken;
  uint8 public override liquidityTokenDecimals;
  ITreasuryController public override treasuryController;

  function initialize(
    address _owner,
    IERC20 _liquidityToken,
    ITreasuryController _treasuryController
  ) external initializer {
    BaseController.initialize(_owner);

    liquidityToken = _liquidityToken;
    treasuryController = _treasuryController;
    liquidityTokenDecimals = IERC20MetadataUpgradeable(address(_liquidityToken)).decimals();
  }

  function addLiquidity(address _from, uint256 _amount)
    external
    override
    onlyValidAddress(_from)
    onlyRole(LIQUIDITY_PROVIDER_ROLE)
  {
    require(_amount > 0, 'Amount must be larger than 0');
    require(liquidityToken.balanceOf(_from) >= _amount, 'Not enough balance');

    liquidityToken.transferFrom(_from, address(this), _amount);

    emit LiquidityAdded(_from, _amount, liquidity());
  }

  function addLiquidityWithProtectionFee(
    uint256 _protectionId,
    address _from,
    uint256 _amountWithoutFee,
    uint256 _fee,
    uint16 _feeComponent
  ) external override onlyValidAddress(_from) onlyRole(LIQUIDITY_PROVIDER_ROLE) {
    require(_amountWithoutFee > 0, 'AmountWithoutFee must be larger than 0');
    require(_fee > 0, 'Fee must be larger than 0');
    require(_feeComponent > 0, 'Fee component must be larger than 0');
    require(liquidityToken.balanceOf(_from) >= _amountWithoutFee + _fee, 'Not enough balance');

    liquidityToken.transferFrom(_from, address(this), _amountWithoutFee + _fee);
    treasuryController.depositFee(_protectionId, _fee, _feeComponent);

    emit LiquidityAdded(_from, _amountWithoutFee, liquidity());
  }

  function withdrawLiquidity(uint256 _amount, address _to)
    external
    override
    onlyValidAddress(_to)
    onlyRole(LIQUIDITY_PROVIDER_ROLE)
  {
    require(_amount > 0, 'Amount must be larger than 0');

    uint256 ownliquidity = liquidity();

    require(ownliquidity >= _amount, 'Not enough liquidity');

    liquidityToken.transfer(_to, _amount);

    emit LiquidityWithdrawn(_to, _amount, ownliquidity - _amount);
  }

  function approveTreasury(uint256 _amount) external override onlyAdmin {
    require(_amount > 0, 'Amount must be larger than 0');

    liquidityToken.approve(address(treasuryController), _amount);
  }

  function setLiquidityToken(IERC20 _token) external override onlyValidAddress(address(_token)) onlyAdmin {
    require(liquidity() == 0, 'Current liquidity balance is not 0');

    emit LiquidityTokenChanged(liquidityToken, _token);

    liquidityToken = _token;
    liquidityTokenDecimals = IERC20MetadataUpgradeable(address(_token)).decimals();
  }

  function setTreasuryController(ITreasuryController _newInstance)
    external
    override
    onlyValidAddress(address(_newInstance))
    onlyAdmin
  {
    emit TreasuryControllerChanged(treasuryController, _newInstance);

    treasuryController = _newInstance;
  }

  function liquidity() public view override returns (uint256) {
    return liquidityToken.balanceOf(address(this));
  }
}
