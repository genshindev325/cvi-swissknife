import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { MockContract } from '@defi-wonderland/smock'
import type { USDC, TreasuryController } from '@coti-cvi/auto-generated-code/contracts'
import {
  TestHelper,
  mock,
  expect,
  usdcDecimals,
  feeComponentBN,
  getAccessControlRevertStr,
  address1,
  adminRole,
  queryEvents,
} from '../../utils'
import { fromNumber } from '@coti-cvi/lw-sdk'
import { AddressZero } from '@ethersproject/constants'

describe('TreasuryController', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let treasury: SignerWithAddress
  let alice: SignerWithAddress

  let treasuryController: TreasuryController
  let usdcToken: MockContract<USDC>
  let depositorRole: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, treasury, alice } = await helper.getNamedSigners())

    usdcToken = await mock('USDC', 'USD Coin', 'USDC', 10000, 6)
  })

  beforeEach(async () => {
    usdcToken.balanceOf.returns(0)

    treasuryController = await helper.deployProxy(
      'TreasuryController',
      {},
      owner.address,
      treasury.address,
      usdcToken.address,
    )

    depositorRole = await treasuryController.DEPOSITOR_ROLE()

    await treasuryController.connect(owner).grantRole(depositorRole, alice.address)
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await treasuryController.owner()).is.equal(owner.address)
      expect(await treasuryController.treasury()).is.equal(treasury.address)
      expect(await treasuryController.treasuryToken()).is.equal(usdcToken.address)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(treasuryController.initialize(owner.address, AddressZero, AddressZero)).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('depositFee', () => {
    const fee = fromNumber(10, usdcDecimals)

    it('Should deposit fee', async () => {
      usdcToken.transferFrom.returns(0)

      const tx = await treasuryController.connect(alice).depositFee(1, fee, feeComponentBN)

      const eventArgs = (
        await queryEvents([
          {
            contract: treasuryController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [treasuryController.filters.DepositFee()],
          },
        ])
      )[0].args

      const transferFromCall = usdcToken.transferFrom.getCall(0)

      expect(eventArgs!.protectionId).is.equal(1)
      expect(eventArgs!.from).is.equal(alice.address)
      expect(eventArgs!.fee).is.equal(fee)
      expect(eventArgs!.feeComponent).is.equal(feeComponentBN)
      expect(eventArgs!.treasury).is.equal(treasury.address)
      expect(eventArgs!.treasuryToken).is.equal(usdcToken.address)

      expect(transferFromCall.args[0]).is.equal(alice.address)
      expect(transferFromCall.args[1]).is.equal(treasury.address)
      expect(transferFromCall.args[2]).is.equal(fee)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(treasuryController.connect(owner).depositFee(1, fee, feeComponentBN)).to.be.revertedWith(
        getAccessControlRevertStr(owner.address.toLowerCase(), depositorRole),
      )
    })

    it('Should revert if fee is 0', async () => {
      await expect(treasuryController.connect(alice).depositFee(1, 0, feeComponentBN)).to.be.revertedWith(
        'Fee must be larger than 0',
      )
    })

    it('Should revert if fee component is 0', async () => {
      await expect(treasuryController.connect(alice).depositFee(1, fee, 0)).to.be.revertedWith(
        'Fee component must be larger than 0',
      )
    })
  })

  describe('setTreasury', () => {
    it('Should set treasury', async () => {
      const tx = await treasuryController.connect(owner).setTreasury(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: treasuryController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [treasuryController.filters.TreasuryChanged()],
          },
        ])
      )[0].args

      expect(await treasuryController.treasury()).is.equal(address1)
      expect(eventArgs!.prevValue).is.equal(treasury.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert if existing treasury balance is not 0', async () => {
      usdcToken.balanceOf.returns(10000)

      await expect(treasuryController.connect(owner).setTreasury(address1)).to.be.revertedWith(
        'Existing treasury balance must be 0',
      )
    })

    it('Should revert on invalid permissions', async () => {
      await expect(treasuryController.connect(alice).setTreasury(address1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })

    it('Should revert on invalid treasury address', async () => {
      await expect(treasuryController.connect(owner).setTreasury(AddressZero)).to.be.revertedWith('Invalid address')
    })
  })

  describe('setTreasuryToken', () => {
    it('Should set treasury token', async () => {
      const tx = await treasuryController.connect(owner).setTreasuryToken(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: treasuryController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [treasuryController.filters.TreasuryTokenChanged()],
          },
        ])
      )[0].args

      expect(await treasuryController.treasuryToken()).is.equal(address1)
      expect(eventArgs!.prevValue).is.equal(usdcToken.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert if existing treasury balance is not 0', async () => {
      usdcToken.balanceOf.returns(10000)

      await expect(treasuryController.connect(owner).setTreasuryToken(address1)).to.be.revertedWith(
        'Existing treasury balance must be 0',
      )
    })

    it('Should revert on invalid permissions', async () => {
      await expect(treasuryController.connect(alice).setTreasuryToken(address1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })

    it('Should revert on invalid treasury token address', async () => {
      await expect(treasuryController.connect(owner).setTreasuryToken(AddressZero)).to.be.revertedWith(
        'Invalid address',
      )
    })
  })
})
