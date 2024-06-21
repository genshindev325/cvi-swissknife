// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

struct TokenInfo {
  bool isUsed;
  bool isMinted;
  uint256 index;
}

contract ILProtectionDiscountNFT {
  mapping(address => TokenInfo) tokensInfo;

  function setUsed(address _to) external {
    TokenInfo storage tokenInfo = tokensInfo[_to];

    tokenInfo.isUsed = true;
  }

  function setTokenInfo(address _to, TokenInfo calldata _tokenInfo) external {
    tokensInfo[_to] = _tokenInfo;
  }

  function getTokenInfo(address _to)
    external
    view
    returns (
      uint256,
      bool,
      bool
    )
  {
    TokenInfo storage tokenInfo = tokensInfo[_to];

    return (tokenInfo.index, tokenInfo.isMinted, tokenInfo.isUsed);
  }
}
