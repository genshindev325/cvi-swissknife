import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { MockContract } from '@defi-wonderland/smock'
import {
  TestHelper,
  mock,
  premiumDiscountCompBN,
  freeOfChargeTokensBN,
  expect,
  queryEvents,
  getAccessControlRevertStr,
  address1,
  adminRole,
} from '../../utils'
import type {
  ILProtectionDiscountNFT,
  ILProtectionDiscountNFTController,
} from '@coti-cvi/auto-generated-code/contracts'
import { AddressZero } from '@ethersproject/constants'
import { DiscountNFTType } from '../../utils/types'

describe('ILProtectionDiscountNFTController tests', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress

  let protectionDiscountNFTController: ILProtectionDiscountNFTController
  let protectionDiscountNFT: MockContract<ILProtectionDiscountNFT>
  let discountOperationsRole: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice } = await helper.getNamedSigners())

    protectionDiscountNFT = await mock('ILProtectionDiscountNFT')
  })

  beforeEach(async () => {
    protectionDiscountNFTController = await helper.deployProxy(
      'ILProtectionDiscountNFTController',
      {},
      owner.address,
      protectionDiscountNFT.address,
      premiumDiscountCompBN,
      freeOfChargeTokensBN,
      true,
    )

    discountOperationsRole = await protectionDiscountNFTController.DISCOUNT_OPERATIONS_ROLE()

    await protectionDiscountNFTController.connect(owner).grantRole(discountOperationsRole, alice.address)
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await protectionDiscountNFTController.premiumDiscountComponent()).is.equal(premiumDiscountCompBN)
      expect(await protectionDiscountNFTController.freeOfChargeTokensWorth()).is.equal(freeOfChargeTokensBN)
      expect(await protectionDiscountNFTController.enabled()).is.equal(true)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(
        protectionDiscountNFTController.initialize(owner.address, protectionDiscountNFT.address, 0, 0, true),
      ).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('markDiscountAsUsed', () => {
    it('Should mark discount as used', async () => {
      const tx = await protectionDiscountNFTController.connect(alice).markDiscountAsUsed(alice.address)

      const setUsedCall = protectionDiscountNFT.setUsed.getCall(0)
      const eventArgs = (
        await queryEvents([
          {
            contract: protectionDiscountNFTController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionDiscountNFTController.filters.DiscountMarkedAsUsed()],
          },
        ])
      )[0].args

      expect(setUsedCall.args[0]).is.equal(alice.address)
      expect(eventArgs!.owner).is.equal(alice.address)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionDiscountNFTController.connect(owner).markDiscountAsUsed(alice.address)).to.be.revertedWith(
        getAccessControlRevertStr(owner.address.toLowerCase(), discountOperationsRole),
      )
    })
  })

  describe('setProtectionDiscountNFT', () => {
    it('Should set new instance', async () => {
      const tx = await protectionDiscountNFTController.connect(owner).setProtectionDiscountNFT(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionDiscountNFTController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionDiscountNFTController.filters.ProtectionDiscountNFTChanged()],
          },
        ])
      )[0].args

      expect(eventArgs!.prevValue).is.equal(protectionDiscountNFT.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        protectionDiscountNFTController.connect(alice).setProtectionDiscountNFT(address1),
      ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), adminRole))
    })
  })

  describe('setPremiumDiscountComponent', () => {
    it('Should set a new value', async () => {
      const tx = await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(5)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionDiscountNFTController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionDiscountNFTController.filters.PremiumDiscountComponentChanged()],
          },
        ])
      )[0].args

      expect(await protectionDiscountNFTController.premiumDiscountComponent()).is.equal(5)
      expect(eventArgs!.prevValue).is.equal(premiumDiscountCompBN)
      expect(eventArgs!.newValue).is.equal(5)
    })

    it('Should revert on invalid value', async () => {
      await expect(
        protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(10001),
      ).to.be.revertedWith('premiumDiscountComponent out of range')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionDiscountNFTController.connect(alice).setPremiumDiscountComponent(5)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setFreeOfChargeTokensWorth', () => {
    it('Should set a new value', async () => {
      const tx = await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(7)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionDiscountNFTController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionDiscountNFTController.filters.FreeOfChargeTokensWorthChanged()],
          },
        ])
      )[0].args

      expect(await protectionDiscountNFTController.freeOfChargeTokensWorth()).is.equal(7)
      expect(eventArgs!.prevValue).is.equal(freeOfChargeTokensBN)
      expect(eventArgs!.newValue).is.equal(7)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionDiscountNFTController.connect(alice).setFreeOfChargeTokensWorth(7)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setEnabled', () => {
    it('Should enable', async () => {
      await protectionDiscountNFTController.connect(owner).setEnabled(true)

      expect(await protectionDiscountNFTController.enabled()).is.equal(true)
    })

    it('Should disable', async () => {
      await protectionDiscountNFTController.connect(owner).setEnabled(false)

      expect(await protectionDiscountNFTController.enabled()).is.equal(false)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionDiscountNFTController.connect(alice).setEnabled(true)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('getDiscountDetails', () => {
    it('protectionDiscountNFT is zero address - Should return no discount', async () => {
      await protectionDiscountNFTController.connect(owner).setProtectionDiscountNFT(AddressZero)

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.discountType).is.equal(DiscountNFTType.NONE)
      expect(discountInfo.isUsed).is.equal(false)
      expect(discountInfo.premiumDiscountComponent).is.equal(0)
      expect(discountInfo.freeOfChargeTokensWorth).is.equal(0)
    })

    it('Discount feature is disabled - Should return no discount', async () => {
      await protectionDiscountNFTController.connect(owner).setEnabled(false)

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.discountType).is.equal(DiscountNFTType.NONE)
      expect(discountInfo.isUsed).is.equal(false)
      expect(discountInfo.premiumDiscountComponent).is.equal(0)
      expect(discountInfo.freeOfChargeTokensWorth).is.equal(0)
    })

    it(`'minted' flag = false - should return 'none' discount type`, async () => {
      protectionDiscountNFT.getTokenInfo.returns([0, false, false])

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.discountType).is.equal(DiscountNFTType.NONE)
    })

    it(`'minted' flag = true, token index = 0 - discount type should be 'GOLD'`, async () => {
      protectionDiscountNFT.getTokenInfo.returns([0, true, false])

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.discountType).is.equal(DiscountNFTType.GOLD)
    })

    it(`'minted' flag = true, token index = 1 - discount type should be 'DIAMOND'`, async () => {
      protectionDiscountNFT.getTokenInfo.returns([1, true, false])

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.discountType).is.equal(DiscountNFTType.DIAMOND)
    })

    it(`'used' flag = true - discount should be used`, async () => {
      protectionDiscountNFT.getTokenInfo.returns([0, true, true])

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.isUsed).is.equal(true)
    })

    it(`'used' flag = false - discount should be unused`, async () => {
      protectionDiscountNFT.getTokenInfo.returns([0, true, false])

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.isUsed).is.equal(false)
    })

    it('Should return correct discount config data', async () => {
      await protectionDiscountNFTController.connect(owner).setFreeOfChargeTokensWorth(10)
      await protectionDiscountNFTController.connect(owner).setPremiumDiscountComponent(11)

      const discountInfo = await protectionDiscountNFTController.getDiscountDetails(alice.address)

      expect(discountInfo.freeOfChargeTokensWorth).is.equal(10)
      expect(discountInfo.premiumDiscountComponent).is.equal(11)
    })

    it('Should revert if token index is out of range', async () => {
      protectionDiscountNFT.getTokenInfo.returns([3, true, false])

      await expect(protectionDiscountNFTController.getDiscountDetails(alice.address)).to.be.revertedWith(
        'Invalid discount nft index',
      )
    })
  })
})
