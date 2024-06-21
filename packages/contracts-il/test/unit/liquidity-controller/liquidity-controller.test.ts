import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { MockContract } from '@defi-wonderland/smock'
import { AddressZero } from '@ethersproject/constants'
import type { USDC, LiquidityController, TreasuryController } from '@coti-cvi/auto-generated-code/contracts'
import {
  runFixture,
  TestHelper,
  mock,
  initialLiquidityBN,
  expect,
  getAccessControlRevertStr,
  address1,
  adminRole,
  usdcDecimals,
  feeComponentBN,
  queryEvents,
} from '../../utils'
import { fromNumber } from '@coti-cvi/lw-sdk'

describe('LiquidityController', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let alice: SignerWithAddress

  let liquidityController: LiquidityController
  let usdcToken: MockContract<USDC>
  let treasuryController: MockContract<TreasuryController>
  let liquidityProviderRole: string
  let accessControlRevertStr: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice, liquidityProvider } = await helper.getNamedSigners())

    usdcToken = await mock('USDC', 'USD Coin', 'USDC', 10000, 6)
    treasuryController = await mock('TreasuryController')
  })

  beforeEach(async () => {
    usdcToken.balanceOf.reset()
    usdcToken.transferFrom.reset()

    await runFixture('il-liquidity-controller')

    liquidityController = await helper.connect('LiquidityController')

    liquidityProviderRole = await liquidityController.LIQUIDITY_PROVIDER_ROLE()

    accessControlRevertStr = getAccessControlRevertStr(owner.address.toLowerCase(), liquidityProviderRole)

    await liquidityController.connect(owner).grantRole(liquidityProviderRole, liquidityProvider.address)

    await liquidityController.connect(owner).setTreasuryController(treasuryController.address)

    await liquidityController.connect(owner).setLiquidityToken(usdcToken.address)
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await liquidityController.liquidityToken()).is.equal(usdcToken.address)
      expect(await liquidityController.liquidityTokenDecimals()).is.equal(usdcDecimals)
      expect(await liquidityController.treasuryController()).is.equal(treasuryController.address)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(liquidityController.initialize(owner.address, AddressZero, AddressZero)).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('addLiquidity', () => {
    it('Should add liquidity', async () => {
      usdcToken.balanceOf.returns(initialLiquidityBN)
      usdcToken.transferFrom.returns(0)

      const tx = await liquidityController
        .connect(liquidityProvider)
        .addLiquidity(liquidityProvider.address, initialLiquidityBN)

      const eventArgs = (
        await queryEvents([
          {
            contract: liquidityController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [liquidityController.filters.LiquidityAdded()],
          },
        ])
      )[0].args
      const transferFromCall = usdcToken.transferFrom.getCall(0)

      expect(eventArgs!.from).is.equal(liquidityProvider.address)
      expect(eventArgs!.amount).is.equal(initialLiquidityBN)
      expect(eventArgs!.updatedTotalLiquidity).is.equal(initialLiquidityBN)

      expect(transferFromCall.args[0]).is.equal(liquidityProvider.address)
      expect(transferFromCall.args[1]).is.equal(liquidityController.address)
      expect(transferFromCall.args[2]).is.equal(initialLiquidityBN)
    })

    it("Should revert on not enough 'from' balance", async () => {
      usdcToken.balanceOf.returns(2000)

      await expect(
        liquidityController.connect(liquidityProvider).addLiquidity(liquidityProvider.address, 3000),
      ).to.be.revertedWith('Not enough balance')
    })

    it('Should revert if amount is 0', async () => {
      await expect(
        liquidityController.connect(liquidityProvider).addLiquidity(liquidityProvider.address, 0),
      ).to.be.revertedWith('Amount must be larger than 0')
    })

    it("Should revert on invalid 'from' address", async () => {
      await expect(
        liquidityController.connect(liquidityProvider).addLiquidity(AddressZero, initialLiquidityBN),
      ).to.be.revertedWith('Invalid address')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        liquidityController.connect(owner).addLiquidity(liquidityProvider.address, initialLiquidityBN),
      ).to.be.revertedWith(accessControlRevertStr)
    })
  })

  describe('addLiquidityWithProtectionFee', () => {
    const amountWithoutFee = fromNumber(1000, usdcDecimals)
    const fee = fromNumber(15, usdcDecimals)

    it('Should add liquidity and deposit protection fee', async () => {
      usdcToken.balanceOf.returns(initialLiquidityBN)
      usdcToken.transferFrom.returns(0)
      treasuryController.depositFee.returns(0)

      const tx = await liquidityController
        .connect(liquidityProvider)
        .addLiquidityWithProtectionFee(10, liquidityProvider.address, amountWithoutFee, fee, feeComponentBN)

      const eventArgs = (
        await queryEvents([
          {
            contract: liquidityController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [liquidityController.filters.LiquidityAdded()],
          },
        ])
      )[0].args
      const transferFromCall = usdcToken.transferFrom.getCall(0)
      const depositFeeCall = treasuryController.depositFee.getCall(0)

      expect(eventArgs!.from).is.equal(liquidityProvider.address)
      expect(eventArgs!.amount).is.equal(amountWithoutFee)
      expect(eventArgs!.updatedTotalLiquidity).is.equal(initialLiquidityBN)

      expect(transferFromCall.args[0]).is.equal(liquidityProvider.address)
      expect(transferFromCall.args[1]).is.equal(liquidityController.address)
      expect(transferFromCall.args[2]).is.equal(amountWithoutFee.add(fee))

      expect(depositFeeCall.args[0]).is.equal(10)
      expect(depositFeeCall.args[1]).is.equal(fee)
      expect(depositFeeCall.args[2]).is.equal(feeComponentBN)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        liquidityController
          .connect(owner)
          .addLiquidityWithProtectionFee(10, liquidityProvider.address, amountWithoutFee, fee, feeComponentBN),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert if amountWithoutFee is 0', async () => {
      await expect(
        liquidityController
          .connect(liquidityProvider)
          .addLiquidityWithProtectionFee(10, liquidityProvider.address, 0, fee, feeComponentBN),
      ).to.be.revertedWith('AmountWithoutFee must be larger than 0')
    })

    it('Should revert if fee is 0', async () => {
      await expect(
        liquidityController
          .connect(liquidityProvider)
          .addLiquidityWithProtectionFee(10, liquidityProvider.address, amountWithoutFee, 0, feeComponentBN),
      ).to.be.revertedWith('Fee must be larger than 0')
    })

    it('Should revert if fee component is 0', async () => {
      await expect(
        liquidityController
          .connect(liquidityProvider)
          .addLiquidityWithProtectionFee(10, liquidityProvider.address, amountWithoutFee, fee, 0),
      ).to.be.revertedWith('Fee component must be larger than 0')
    })

    it("Should revert if 'from' balance is smaller than (amountWithoutFee + fee)", async () => {
      usdcToken.balanceOf.returns(10000000)

      await expect(
        liquidityController
          .connect(liquidityProvider)
          .addLiquidityWithProtectionFee(10, liquidityProvider.address, amountWithoutFee, fee, feeComponentBN),
      ).to.be.revertedWith('Not enough balance')
    })

    it("Should revert on invalid 'from' address", async () => {
      await expect(
        liquidityController
          .connect(liquidityProvider)
          .addLiquidityWithProtectionFee(10, AddressZero, amountWithoutFee, fee, feeComponentBN),
      ).to.be.revertedWith('Invalid address')
    })
  })

  describe('withdrawLiquidity', () => {
    it('Should withdraw liquidity', async () => {
      usdcToken.transfer.returns(0)
      usdcToken.balanceOf.returns(initialLiquidityBN.mul(2))

      const tx = await liquidityController
        .connect(liquidityProvider)
        .withdrawLiquidity(initialLiquidityBN, alice.address)

      const eventArgs = (
        await queryEvents([
          {
            contract: liquidityController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [liquidityController.filters.LiquidityWithdrawn()],
          },
        ])
      )[0].args
      const transferCall = usdcToken.transfer.getCall(0)

      expect(eventArgs!.to).is.equal(alice.address)
      expect(eventArgs!.amount).is.equal(initialLiquidityBN)
      expect(eventArgs!.updatedTotalLiquidity).is.equal(initialLiquidityBN)

      expect(transferCall.args[0]).is.equal(alice.address)
      expect(transferCall.args[1]).is.equal(initialLiquidityBN)
    })

    it('Should revert if amount is 0', async () => {
      await expect(
        liquidityController.connect(liquidityProvider).withdrawLiquidity(0, alice.address),
      ).to.be.revertedWith('Amount must be larger than 0')
    })

    it('Should revert if not enough liquidity', async () => {
      usdcToken.balanceOf.returns(0)

      await expect(
        liquidityController.connect(liquidityProvider).withdrawLiquidity(initialLiquidityBN, alice.address),
      ).to.be.revertedWith('Not enough liquidity')
    })

    it("Should revert on invalid 'from' address", async () => {
      await expect(
        liquidityController.connect(liquidityProvider).withdrawLiquidity(initialLiquidityBN, AddressZero),
      ).to.be.revertedWith('Invalid address')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        liquidityController.connect(owner).withdrawLiquidity(initialLiquidityBN, alice.address),
      ).to.be.revertedWith(accessControlRevertStr)
    })
  })

  describe('approveTreasury', () => {
    it('Should approve amount', async () => {
      usdcToken.approve.returns(0)

      await liquidityController.connect(owner).approveTreasury(initialLiquidityBN)

      const approveCall = usdcToken.approve.getCall(0)

      expect(approveCall.args[0]).is.equal(treasuryController.address)
      expect(approveCall.args[1]).is.equal(initialLiquidityBN)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(liquidityController.connect(alice).approveTreasury(initialLiquidityBN)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })

    it('Should revert if amount is 0', async () => {
      await expect(liquidityController.connect(owner).approveTreasury(0)).to.be.revertedWith(
        'Amount must be larger than 0',
      )
    })
  })

  describe('setLiquidityToken', () => {
    it('Should set new liquidity token and decimals', async () => {
      const newLiquidityToken = await mock('USDC', 'USD Coin', 'USDC', 10000, 6)

      newLiquidityToken.decimals.returns(10)
      treasuryController.treasuryToken.returns(newLiquidityToken.address)

      const tx = await liquidityController.connect(owner).setLiquidityToken(newLiquidityToken.address)

      const eventArgs = (
        await queryEvents([
          {
            contract: liquidityController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [liquidityController.filters.LiquidityTokenChanged()],
          },
        ])
      )[0].args

      expect(await liquidityController.liquidityToken()).is.equal(newLiquidityToken.address)
      expect(await liquidityController.liquidityTokenDecimals()).is.equal(10)

      expect(eventArgs!.prevValue).is.equal(usdcToken.address)
      expect(eventArgs!.newValue).is.equal(newLiquidityToken.address)
    })

    it('Should revert if balance of previous liquidity token is not 0', async () => {
      usdcToken.balanceOf.returns(1000)

      await expect(liquidityController.connect(owner).setLiquidityToken(address1)).to.be.revertedWith(
        'Current liquidity balance is not 0',
      )
    })

    it('Should revert on invalid permissions', async () => {
      await expect(liquidityController.connect(liquidityProvider).setLiquidityToken(address1)).to.be.revertedWith(
        getAccessControlRevertStr(liquidityProvider.address.toLowerCase(), adminRole),
      )
    })

    it('Should revert on invalid token address', async () => {
      await expect(liquidityController.connect(liquidityProvider).setLiquidityToken(AddressZero)).to.be.revertedWith(
        'Invalid address',
      )
    })
  })

  describe('setTreasuryController', () => {
    it('Should set treasury controller', async () => {
      const tx = await liquidityController.connect(owner).setTreasuryController(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: liquidityController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [liquidityController.filters.TreasuryControllerChanged()],
          },
        ])
      )[0].args

      expect(await liquidityController.treasuryController()).is.equal(address1)
      expect(eventArgs!.prevValue).is.equal(treasuryController.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(liquidityController.connect(alice).setTreasuryController(address1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })

    it('Should revert on invalid treasury controller address', async () => {
      await expect(liquidityController.connect(owner).setTreasuryController(AddressZero)).to.be.revertedWith(
        'Invalid address',
      )
    })
  })
})
