// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

interface ILProtectionDiscountNFTInterface {
  function setUsed(address _to) external;

  function getTokenInfo(address _to)
    external
    view
    returns (
      uint256 index,
      bool minted,
      bool used
    );
}
