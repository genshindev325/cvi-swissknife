// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import './ILProtectionDiscountNFTControllerInterface.sol';

struct ProtectionNFTDetails {
  uint256 id;
  address owner;
  uint256 protectionStartTimestamp;
  uint256 protectionEndTimestamp;
  uint256 premiumCostUSD;
  uint256 lpTokensWorthAtBuyTimeUSD;
  string token1Symbol;
  string token2Symbol;
  uint256 policyPeriod;
  DiscountNFTType discountNFTType;
  uint256 premiumCostDiscountUSD;
}

struct ProtectionNFTCreationDetails {
  address owner;
  uint256 protectionStartTimestamp;
  uint256 protectionEndTimestamp;
  uint256 premiumCostUSD;
  uint256 lpTokensWorthAtBuyTimeUSD;
  string token1Symbol;
  string token2Symbol;
  uint256 policyPeriod;
  DiscountNFTType discountNFTType;
  uint256 premiumCostDiscountUSD;
}

interface ILProtectionNFTInterface {
  event ProtectionMint(
    uint256 indexed id,
    address indexed owner,
    uint256 protectionStartTimestamp,
    uint256 protectionEndTimestamp,
    uint256 premiumCostUSD,
    uint256 lpTokensWorthAtBuyTimeUSD,
    string token1Symbol,
    string token2Symbol,
    uint256 policyPeriod
  );
  event ProtectionMetadataCIDChanged(string prevValue, string newValue);
  event ProtectionMintDiscountDetails(
    uint256 indexed id,
    address indexed owner,
    DiscountNFTType indexed discountNFTType,
    uint256 premiumCostBeforeDiscount,
    uint256 premiumCostDiscount
  );

  function mint(ProtectionNFTCreationDetails calldata _creationDetails) external;

  function setProtectionMetadataCID(string calldata _protectionMetadataCID) external;

  function tokenIdCounter() external returns (uint256);

  function protectionMetadataCID() external returns (string memory);

  function getProtectionDetailsByOwnerAndIndex(address _owner, uint256 _index)
    external
    view
    returns (ProtectionNFTDetails memory);

  function getOwnerProtections(address _owner) external view returns (ProtectionNFTDetails[] memory);

  function getProtectionDetails(uint256 _id) external view returns (ProtectionNFTDetails memory);
}
