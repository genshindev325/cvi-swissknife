// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import './interfaces/IRewardRouter.sol';

contract RewardRouter is IRewardRouter, OwnableUpgradeable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
  bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

  mapping(StakedTokenName => IRewardTracker) public override rewardTrackers;
  mapping(StakedTokenName => address) public override tokens;
  mapping(StakedTokenName => IVester) public override vesters;

  mapping(address => address) public pendingReceivers;

  function initialize(
    address _owner,
    StakedTokenName[] calldata _tokenNames,
    IRewardTracker[] calldata _rewardTrackers,
    IVester[] calldata _vesters,
    address[] calldata _tokens
  ) external initializer {
    require(_tokenNames.length == uint256(StakedTokenName.LENGTH), 'RewardRouter: invalid _tokenNames length');

    OwnableUpgradeable.__Ownable_init();
    AccessControlUpgradeable.__AccessControl_init();
    ReentrancyGuardUpgradeable.__ReentrancyGuard_init();

    _transferOwnership(_owner);
    _setupRole(DEFAULT_ADMIN_ROLE, _owner);

    _setRewardTrackers(_tokenNames, _rewardTrackers);
    _setVesters(_tokenNames, _vesters);
    _setTokens(_tokenNames, _tokens);
  }

  function stake(StakedTokenName _tokenName, uint256 _amount) external override nonReentrant {
    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);
    address token = _getToken(_tokenName);

    _stake(msg.sender, msg.sender, rewardTracker, token, _amount);
  }

  function stakeForAccount(
    StakedTokenName _tokenName,
    address _account,
    uint256 _amount
  ) external override onlyRole(OPERATOR_ROLE) nonReentrant {
    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);
    address token = _getToken(_tokenName);

    _stake(msg.sender, _account, rewardTracker, token, _amount);
  }

  function batchStakeForAccount(
    StakedTokenName _tokenName,
    address[] memory _accounts,
    uint256[] memory _amounts
  ) external override onlyRole(OPERATOR_ROLE) nonReentrant {
    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);
    address token = _getToken(_tokenName);

    for (uint256 i = 0; i < _accounts.length; i++) {
      _stake(msg.sender, _accounts[i], rewardTracker, token, _amounts[i]);
    }
  }

  function unstake(StakedTokenName _tokenName, uint256 _amount) external override nonReentrant {
    require(_amount > 0, 'RewardRouter: invalid _amount');

    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);
    address token = _getToken(_tokenName);
    address account = msg.sender;

    _unstake(account, rewardTracker, token, _amount);
  }

  function claim(StakedTokenName _tokenName) external override nonReentrant {
    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);
    address account = msg.sender;

    rewardTracker.claimForAccount(account, account);
  }

  function compound(StakedTokenName _tokenName) external override nonReentrant {
    _compound(msg.sender, _tokenName);
  }

  function compoundForAccount(address _account, StakedTokenName _tokenName)
    external
    override
    onlyRole(OPERATOR_ROLE)
    nonReentrant
  {
    _compound(_account, _tokenName);
  }

  function batchCompoundForAccounts(address[] memory _accounts, StakedTokenName _tokenName)
    external
    override
    onlyRole(OPERATOR_ROLE)
    nonReentrant
  {
    for (uint256 i = 0; i < _accounts.length; i++) {
      _compound(_accounts[i], _tokenName);
    }
  }

  function signalTransfer(address _receiver) external nonReentrant {
    _validateVestedAccountZeroBalance(msg.sender);
    _validateReceiver(_receiver);
    pendingReceivers[msg.sender] = _receiver;
  }

  function acceptTransfer(address _sender) external nonReentrant {
    _validateVestedAccountZeroBalance(_sender);

    address receiver = msg.sender;

    require(pendingReceivers[_sender] == receiver, 'RewardRouter: transfer not signaled');
    delete pendingReceivers[_sender];

    _validateReceiver(receiver);

    _compoundAllTokens(_sender);

    for (uint256 i = 0; i < uint256(StakedTokenName.LENGTH); i++) {      
      StakedTokenName tokenName = StakedTokenName(i);
      IRewardTracker rewardTracker = _getRewardTracker(tokenName);
      address token = _getToken(tokenName);

      uint256 depositBalance = rewardTracker.depositBalances(_sender, token);

      if (depositBalance > 0) {
        _unstake(_sender, rewardTracker, token, depositBalance);
        _stake(_sender, receiver, rewardTracker, token, depositBalance);
      }

      if(tokenName == StakedTokenName.ES_GOVI) {
        continue;
      }

      IVester vester = _getVester(tokenName);

      vester.transferStakeValues(_sender, receiver);
    }

    uint256 esGoviBalance = IERC20(tokens[StakedTokenName.ES_GOVI]).balanceOf(_sender);

    if (esGoviBalance > 0) {
      IERC20(tokens[StakedTokenName.ES_GOVI]).transferFrom(_sender, receiver, esGoviBalance);
    }
  }

  function setRewardTrackers(StakedTokenName[] calldata _tokenNames, IRewardTracker[] calldata _rewardTrackers)
    external
    override
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _setRewardTrackers(_tokenNames, _rewardTrackers);
  }

  function setVesters(StakedTokenName[] calldata _tokenNames, IVester[] calldata _vesters)
    external
    override
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _setVesters(_tokenNames, _vesters);
  }

  function setTokens(StakedTokenName[] calldata _tokenNames, address[] calldata _tokens)
    external
    override
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _setTokens(_tokenNames, _tokens);
  }

  function _stake(
    address _fundingAccount,
    address _account,
    IRewardTracker _rewardTracker,
    address _token,
    uint256 _amount
  ) private {
    require(_amount > 0, 'RewardRouter: invalid _amount');

    _rewardTracker.stakeForAccount(_fundingAccount, _account, _token, _amount);

    emit StakeToken(_account, _token, _amount);
  }

  function _unstake(
    address _account,
    IRewardTracker _rewardTracker,
    address _token,
    uint256 _amount
  ) private {
    _rewardTracker.unstakeForAccount(_account, _token, _amount, _account);

    emit UnstakeToken(_account, _token, _amount);
  }

  function _compoundAllTokens(address _account) private {
    for (uint256 i = 0; i < uint256(StakedTokenName.LENGTH); i++) {      
      StakedTokenName tokenName = StakedTokenName(i);

      _compound(_account, tokenName);
    }
  }

  function _compound(address _account, StakedTokenName _tokenName) private {
    IRewardTracker rewardTracker = _getRewardTracker(_tokenName);

    uint256 amount = rewardTracker.claimForAccount(_account, _account);

    if (amount > 0) {
      IRewardTracker esGoviRewardTracker = _getRewardTracker(StakedTokenName.ES_GOVI);
      address esGovi = _getToken(StakedTokenName.ES_GOVI);
      _stake(_account, _account, esGoviRewardTracker, esGovi, amount);
    }
  }

  function _setRewardTrackers(StakedTokenName[] calldata _tokenNames, IRewardTracker[] calldata _rewardTrackers)
    private
  {
    require(
      _tokenNames.length > 0 && _tokenNames.length == _rewardTrackers.length,
      'RewardRouter: Invalid input params length'
    );

    for (uint256 i = 0; i < _tokenNames.length; i++) {
      rewardTrackers[_tokenNames[i]] = _rewardTrackers[i];
    }
  }

  function _setVesters(StakedTokenName[] calldata _tokenNames, IVester[] calldata _vesters) private {
    require(
      _tokenNames.length > 0 && _tokenNames.length == _vesters.length,
      'RewardRouter: Invalid input params length'
    );

    for (uint256 i = 0; i < _tokenNames.length; i++) {
      vesters[_tokenNames[i]] = _vesters[i];
    }
  }

  function _setTokens(StakedTokenName[] calldata _tokenNames, address[] calldata _tokens) private {
    require(
      _tokenNames.length > 0 && _tokenNames.length == _tokens.length,
      'RewardRouter: Invalid input params length'
    );

    for (uint256 i = 0; i < _tokenNames.length; i++) {
      tokens[_tokenNames[i]] = _tokens[i];
    }
  }

  function _validateReceiver(address _receiver) private view {
    for (uint256 i = 0; i < uint256(StakedTokenName.LENGTH); i++) {
      StakedTokenName tokenName = StakedTokenName(i);
      IRewardTracker rewardTracker = _getRewardTracker(tokenName);
      IVester vester = _getVester(tokenName);

      require(
        rewardTracker.averageStakedAmounts(_receiver) == 0,
        'RewardRouter: rewardTracker.averageStakedAmounts > 0'
      );

      require(rewardTracker.cumulativeRewards(_receiver) == 0, 'RewardRouter: rewardTracker.cumulativeRewards > 0');

      require(
        vester.transferredAverageStakedAmounts(_receiver) == 0,
        'RewardRouter: vester.transferredAverageStakedAmounts > 0'
      );

      require(
        vester.transferredCumulativeRewards(_receiver) == 0,
        'RewardRouter: vester.transferredCumulativeRewards > 0'
      );

      require(IERC20(address(vester)).balanceOf(_receiver) == 0, 'RewardRouter: vester.balanceOf > 0');
    }
  }

  function _validateVestedAccountZeroBalance(address _account) private view {
    for (uint256 i = 0; i < uint256(StakedTokenName.LENGTH); i++) {
      StakedTokenName tokenName = StakedTokenName(i);

      require(IERC20(address(vesters[tokenName])).balanceOf(_account) == 0, 'RewardRouter: account has vested tokens');
    }
  }

  function _getRewardTracker(StakedTokenName _tokenName) private view returns (IRewardTracker) {
    require(address(rewardTrackers[_tokenName]) != address(0), 'RewardRouter: no reward tracker defined');

    return rewardTrackers[_tokenName];
  }

  function _getVester(StakedTokenName _tokenName) private view returns (IVester) {
    require(address(vesters[_tokenName]) != address(0), 'RewardRouter: no vester defined');

    return vesters[_tokenName];
  }

  function _getToken(StakedTokenName _tokenName) private view returns (address) {
    require(tokens[_tokenName] != address(0), 'RewardRouter: no token defined');

    return tokens[_tokenName];
  }
}
