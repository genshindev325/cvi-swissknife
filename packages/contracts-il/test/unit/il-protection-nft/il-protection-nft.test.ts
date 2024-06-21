import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { ILProtectionNFT } from '@coti-cvi/auto-generated-code/contracts'
import {
  usdcDecimals,
  policyPeriods,
  lpTokensWorthAtBuyTimeUsdBN,
  assertProtectionDetails,
  getAccessControlRevertStr,
  expect,
  adminRole,
  TestHelper,
  protectionMetadataCID,
  queryEvents,
} from '../../utils'
import { fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'
import { DiscountNFTType } from '../../utils/types'

describe('ILProtectionNFT', () => {
  let deployer: SignerWithAddress
  let owner: SignerWithAddress
  let minter: SignerWithAddress
  let minterRole: string
  let protectionNFT: ILProtectionNFT
  let accessControlRevertStr: string

  const protectionStartTimestamp = 1653394546
  const protectionEndTimestamp = 1684930546
  const premiumCostUSD = fromNumber(1000, usdcDecimals)
  const premiumDiscountUSD = fromNumber(3, usdcDecimals)

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)
    ;({ owner, deployer, minter } = await helper.getNamedSigners())

    protectionNFT = await helper.deployProxy(
      'ILProtectionNFT',
      {},
      owner.address,
      'Impermanent Loss Protector',
      'ILProtector',
      protectionMetadataCID,
    )

    minterRole = await protectionNFT.MINTER_ROLE()

    accessControlRevertStr = getAccessControlRevertStr(deployer.address.toLowerCase(), minterRole)

    await protectionNFT.connect(owner).grantRole(minterRole, minter.address)
  })

  describe('initialize', () => {
    it('Init params should match', async () => {
      expect(await protectionNFT.owner()).is.equal(owner.address)
      expect(await protectionNFT.hasRole(adminRole, owner.address))
      expect(await protectionNFT.hasRole(minterRole, minter.address))
      expect(await protectionNFT.name()).is.equal('Impermanent Loss Protector')
      expect(await protectionNFT.symbol()).is.equal('ILProtector')
      expect(await protectionNFT.protectionMetadataCID()).is.equal(protectionMetadataCID)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(protectionNFT.initialize(owner.address, '', '', '')).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('mint', () => {
    it('Should mint an NFT', async () => {
      const expectedProtectionDetails = {
        id: BigNumber.from(0),
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.GOLD,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      }

      const tx = await protectionNFT.connect(minter).mint({
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.GOLD,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      })

      const events = await queryEvents([
        {
          contract: protectionNFT,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [protectionNFT.filters.ProtectionMint(), protectionNFT.filters.ProtectionMintDiscountDetails()],
        },
      ])

      const protectionMintEventArgs = events[0].args
      const protectionMintDiscountArgs = events[1].args

      const protectionDetails = await protectionNFT.getProtectionDetails(0)

      expect(events.length).is.equal(2)
      assertProtectionDetails(protectionDetails, expectedProtectionDetails)
      assertProtectionDetails(protectionDetails, protectionMintEventArgs!, false)

      expect(protectionMintDiscountArgs!.id).is.equal(0)
      expect(protectionMintDiscountArgs!.owner).is.equal(owner.address)
      expect(protectionMintDiscountArgs!.discountNFTType).is.equal(DiscountNFTType.GOLD)
      expect(protectionMintDiscountArgs!.premiumCostBeforeDiscount).is.equal(protectionDetails.premiumCostUSD)
      expect(protectionMintDiscountArgs!.premiumCostDiscount).is.equal(premiumDiscountUSD)

      expect(await protectionNFT.tokenIdCounter()).to.equal(1)
      await expect(protectionNFT.getProtectionDetails(1)).to.be.revertedWith('Non existing protection id')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        protectionNFT.mint({
          owner: owner.address,
          protectionStartTimestamp: protectionStartTimestamp,
          protectionEndTimestamp: protectionEndTimestamp,
          premiumCostUSD: premiumCostUSD,
          premiumCostDiscountUSD: 0,
          discountNFTType: DiscountNFTType.NONE,
          lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
          token1Symbol: TokenName.WETH,
          token2Symbol: TokenName.USDC,
          policyPeriod: policyPeriods[0],
        }),
      ).to.be.revertedWith(accessControlRevertStr)
    })
  })

  describe('setProtectionMetadataCID', () => {
    it('Should set protection metadata CID', async () => {
      const newProtectionMetadataCID = 'QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb'

      const tx = await protectionNFT.connect(owner).setProtectionMetadataCID(newProtectionMetadataCID)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionNFT,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionNFT.filters.ProtectionMetadataCIDChanged()],
          },
        ])
      )[0].args

      expect(eventArgs!.prevValue).is.equal(protectionMetadataCID)
      expect(eventArgs!.newValue).is.equal(newProtectionMetadataCID)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionNFT.setProtectionMetadataCID('Some CID')).to.be.revertedWith(
        getAccessControlRevertStr(deployer.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('tokenURI', () => {
    it('Should get tokenURI', async () => {
      await protectionNFT.connect(minter).mint({
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: 0,
        discountNFTType: DiscountNFTType.NONE,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      })

      const tokenURI = await protectionNFT.tokenURI(0)

      expect(tokenURI).is.equal(`ipfs://${protectionMetadataCID}`)
    })

    it('Should revert if token id does not exist', async () => {
      await expect(protectionNFT.tokenURI(0)).to.be.reverted
    })
  })

  describe('getOwnerProtections', () => {
    it('Should get owner protections', async () => {
      await protectionNFT.connect(minter).mint({
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.DIAMOND,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      })

      await protectionNFT.connect(minter).mint({
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.DIAMOND,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[1],
      })

      const protections = await protectionNFT.getOwnerProtections(owner.address)

      for (let i = 0; i < protections.length; i++) {
        assertProtectionDetails(protections[i], {
          id: BigNumber.from(i),
          owner: owner.address,
          protectionStartTimestamp: protectionStartTimestamp,
          protectionEndTimestamp: protectionEndTimestamp,
          premiumCostUSD: premiumCostUSD,
          premiumCostDiscountUSD: premiumDiscountUSD,
          discountNFTType: DiscountNFTType.DIAMOND,
          lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
          token1Symbol: TokenName.WETH,
          token2Symbol: TokenName.USDC,
          policyPeriod: policyPeriods[i],
        })
      }
    })

    it('Should revert if owner has no protections', async () => {
      await expect(protectionNFT.getOwnerProtections(owner.address)).to.be.revertedWith('Owner has no protections')
    })
  })

  describe('getProtectionDetailsByOwnerAndIndex', () => {
    it('Should get protection details by owner and index', async () => {
      const expectedProtectionDetails = {
        id: BigNumber.from(0),
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.GOLD,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      }

      await protectionNFT.connect(minter).mint({
        owner: owner.address,
        protectionStartTimestamp: protectionStartTimestamp,
        protectionEndTimestamp: protectionEndTimestamp,
        premiumCostUSD: premiumCostUSD,
        premiumCostDiscountUSD: premiumDiscountUSD,
        discountNFTType: DiscountNFTType.GOLD,
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUsdBN,
        token1Symbol: TokenName.WETH,
        token2Symbol: TokenName.USDC,
        policyPeriod: policyPeriods[0],
      })

      const protectionDetails = await protectionNFT.getProtectionDetailsByOwnerAndIndex(owner.address, 0)

      assertProtectionDetails(protectionDetails, expectedProtectionDetails)
    })

    it('Should revert if owner has no protections', async () => {
      await expect(protectionNFT.getProtectionDetailsByOwnerAndIndex(owner.address, 0)).to.be.reverted
    })
  })

  describe('supportsInterface', () => {
    it('Should support IERC721Upgradeable interface', async () => {
      expect(await protectionNFT.supportsInterface('0x80ac58cd')).to.equal(true)
    })

    it('Should support IAccessControlUpgradeable interface', async () => {
      expect(await protectionNFT.supportsInterface('0x7965db0b')).to.equal(true)
    })
  })
})
