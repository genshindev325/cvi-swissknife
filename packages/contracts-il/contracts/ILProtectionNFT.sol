// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import './BaseController.sol';
import './interfaces/ILProtectionNFTInterface.sol';

contract ILProtectionNFT is ILProtectionNFTInterface, BaseController, ERC721EnumerableUpgradeable {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  uint256 public override tokenIdCounter;
  mapping(uint256 => ProtectionNFTDetails) private protections;
  string public override protectionMetadataCID;

  function initialize(
    address _owner,
    string calldata _name,
    string calldata _symbol,
    string calldata _protectionMetadataCID
  ) external initializer {
    BaseController.initialize(_owner);

    ERC721Upgradeable.__ERC721_init(_name, _symbol);

    protectionMetadataCID = _protectionMetadataCID;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721EnumerableUpgradeable, AccessControlUpgradeable)
    returns (bool)
  {
    return ERC721Upgradeable.supportsInterface(interfaceId) || AccessControlUpgradeable.supportsInterface(interfaceId);
  }

  function mint(ProtectionNFTCreationDetails calldata _creationDetails) external override onlyRole(MINTER_ROLE) {
    protections[tokenIdCounter] = ProtectionNFTDetails({
      id: tokenIdCounter,
      owner: _creationDetails.owner,
      protectionStartTimestamp: _creationDetails.protectionStartTimestamp,
      protectionEndTimestamp: _creationDetails.protectionEndTimestamp,
      premiumCostUSD: _creationDetails.premiumCostUSD,
      premiumCostDiscountUSD: _creationDetails.premiumCostDiscountUSD,
      discountNFTType: _creationDetails.discountNFTType,
      lpTokensWorthAtBuyTimeUSD: _creationDetails.lpTokensWorthAtBuyTimeUSD,
      token1Symbol: _creationDetails.token1Symbol,
      token2Symbol: _creationDetails.token2Symbol,
      policyPeriod: _creationDetails.policyPeriod
    });

    _mint(_creationDetails.owner, tokenIdCounter);

    emit ProtectionMint(
      tokenIdCounter,
      _creationDetails.owner,
      _creationDetails.protectionStartTimestamp,
      _creationDetails.protectionEndTimestamp,
      _creationDetails.premiumCostUSD,
      _creationDetails.lpTokensWorthAtBuyTimeUSD,
      _creationDetails.token1Symbol,
      _creationDetails.token2Symbol,
      _creationDetails.policyPeriod
    );

    emit ProtectionMintDiscountDetails(
      tokenIdCounter,
      _creationDetails.owner,
      _creationDetails.discountNFTType,
      _creationDetails.premiumCostUSD,
      _creationDetails.premiumCostDiscountUSD
    );

    tokenIdCounter++;
  }

  function setProtectionMetadataCID(string calldata _protectionMetadataCID) external override onlyAdmin {
    emit ProtectionMetadataCIDChanged(protectionMetadataCID, _protectionMetadataCID);

    protectionMetadataCID = _protectionMetadataCID;
  }

  function getProtectionDetailsByOwnerAndIndex(address _owner, uint256 _index)
    public
    view
    override
    returns (ProtectionNFTDetails memory)
  {
    uint256 protectionId = tokenOfOwnerByIndex(_owner, _index);

    return protections[protectionId];
  }

  function getOwnerProtections(address _owner) external view override returns (ProtectionNFTDetails[] memory) {
    uint256 balance = balanceOf(_owner);

    require(balance > 0, 'Owner has no protections');

    ProtectionNFTDetails[] memory retProtections = new ProtectionNFTDetails[](balance);

    for (uint256 i; i < balance; i++) {
      retProtections[i] = getProtectionDetailsByOwnerAndIndex(_owner, i);
    }

    return retProtections;
  }

  function getProtectionDetails(uint256 _id) external view override returns (ProtectionNFTDetails memory) {
    require(_exists(_id), 'Non existing protection id');

    return protections[_id];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');

    return string(abi.encodePacked(_baseURI(), protectionMetadataCID));
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
  }
}
