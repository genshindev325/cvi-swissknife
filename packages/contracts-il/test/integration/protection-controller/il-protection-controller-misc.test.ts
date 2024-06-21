import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  ETHUSDOracle,
  USDUSDOracle,
  ILProtectionController,
  LiquidityController,
  ILProtectionNFT,
  USDC,
  CVIFeedOracle,
  LINKUSDOracle,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  runContractsFixtures,
  cvi,
  ethInitialPriceBN,
  usdInitialPriceBN,
  initialLiquidityBN,
  lpTokensWorthAtBuyTimeUsdBN,
  policyPeriods,
  expect,
  initialUsdcBalanceBN,
  TestHelper,
  setNextBlockTimestampAndMineWithPolicyPeriod,
} from '../../utils'
import { fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-misc-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let protectionNFT: ILProtectionNFT
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let alice: SignerWithAddress
  let upkeeper: SignerWithAddress

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, liquidityProvider, protectionBuyer, alice, upkeeper } = await helper.getNamedSigners())
    ;({
      ethUsdPriceOracle,
      usdUsdPriceOracle,
      linkUsdPriceOracle,
      ilProtectionController: protectionController,
      liquidityController,
      protectionNFT,
      usdcToken,
      cviFeedOracle,
    } = await runContractsFixtures())

    await usdcToken.mint(liquidityProvider.address, initialUsdcBalanceBN)
    await usdcToken.mint(protectionBuyer.address, initialUsdcBalanceBN)
    await usdcToken.mint(alice.address, initialUsdcBalanceBN)
    await usdcToken.connect(liquidityProvider).approve(liquidityController.address, '200000000000')
    await usdcToken.connect(protectionBuyer).approve(liquidityController.address, '200000000000')
    await usdcToken.connect(alice).approve(liquidityController.address, '200000000000')
    await liquidityController.connect(owner).approveTreasury('200000000000')

    await cviFeedOracle.updateRoundData(0, fromNumber(cvi, 18), 0, 0)

    await ethUsdPriceOracle.setPrice(ethInitialPriceBN)
    await usdUsdPriceOracle.setPrice(usdInitialPriceBN)
    await linkUsdPriceOracle.setPrice(ethInitialPriceBN)

    await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)
  })

  describe('getFinalizedProtectionsIds', () => {
    it('2 protections opened - return no protections ids ', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      const finalizedProtectionsIds = await protectionController.getFinalizedProtectionsIds()

      expect(finalizedProtectionsIds.length).is.equal(0)
    })

    it('2 protections opened - 1 protection expired - return only the expired protection id ', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const finalizedProtectionsIds = await protectionController.getFinalizedProtectionsIds()

      expect(finalizedProtectionsIds.length).is.equal(1)
      expect(finalizedProtectionsIds[0]).is.equal(0)
    })

    it('2 protections opened and expired - return both protections ids', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[1])

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[1])

      const finalizedProtectionsIds = await protectionController.getFinalizedProtectionsIds()

      expect(finalizedProtectionsIds.length).is.equal(2)
      expect(finalizedProtectionsIds[0]).is.equal(0)
      expect(finalizedProtectionsIds[1]).is.equal(1)
    })
  })

  describe('Protection ownership', () => {
    it('Protection bought - ownership transfered, protection closed - protection amount payed to new owner', async () => {
      await protectionController
        .connect(protectionBuyer)
        .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

      const buyerBalanceBeforeProtectionClose = await usdcToken.balanceOf(protectionBuyer.address)

      const newOwner = await helper.getNamedSigner('bob')

      await protectionNFT.connect(protectionBuyer).transferFrom(protectionBuyer.address, newOwner.address, 0)

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

      const { performData } = await protectionController.checkUpkeep([])

      await protectionController.performUpkeep(performData)

      const protectionDetails = await protectionController.closedProtectionsWithMetadata(0)

      expect(await usdcToken.balanceOf(protectionBuyer.address)).is.equal(buyerBalanceBeforeProtectionClose)
      expect(await usdcToken.balanceOf(newOwner.address)).is.equal(protectionDetails.amountPaidOnPolicyClose)
    })
  })

  describe('DDOS protection test - Buy 100 protections of $1', () => {
    const protectionsToBuy = 100
    beforeEach(async () => {
      const amount = fromNumber(1, 6)
      for (let i = 0; i < protectionsToBuy; i++) {
        await protectionController
          .connect(protectionBuyer)
          .buyProtection(TokenName.WETH, TokenName.USDC, amount, amount, policyPeriods[0])
      }

      await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])
    })

    it('Should revert on perform upkeep when maxProtectionsToCloseInUpkeep = 100', async () => {
      const maxProtectionsToCloseInUpkeep = protectionsToBuy
      const controller = protectionController.connect(upkeeper)
      await controller.connect(owner).setMaxProtectionsInUpkeep(maxProtectionsToCloseInUpkeep)

      const protections = await controller.getFinalizedProtectionsIds()
      expect(protections.length).to.be.equal(protectionsToBuy)

      const { performData } = await controller.checkUpkeep([])
      const decoded = helper.eth.utils.defaultAbiCoder.decode(['uint256[]'], performData)[0]
      expect(decoded.length).to.be.equal(maxProtectionsToCloseInUpkeep)

      await expect(controller.performUpkeep(performData)).to.be.reverted
    })

    it('Should perform upkeep successfully when maxProtectionsToCloseInUpkeep = 10', async () => {
      const maxProtectionsToCloseInUpkeep = 10
      const controller = protectionController.connect(upkeeper)
      await controller.connect(owner).setMaxProtectionsInUpkeep(maxProtectionsToCloseInUpkeep)

      const protections = await controller.getFinalizedProtectionsIds()
      expect(protections.length).to.be.equal(protectionsToBuy)

      const { performData } = await controller.checkUpkeep([])
      const decoded = helper.eth.utils.defaultAbiCoder.decode(['uint256[]'], performData)[0]
      expect(decoded.length).to.be.equal(maxProtectionsToCloseInUpkeep)

      await controller.performUpkeep(performData)
      const closed = await controller.queryFilter(controller.filters.ProtectionClosed())
      expect(closed.length).to.be.equal(maxProtectionsToCloseInUpkeep)
    })
  })
})
