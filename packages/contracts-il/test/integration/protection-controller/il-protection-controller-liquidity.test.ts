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
  TreasuryController,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  runContractsFixtures,
  cvi,
  ethInitialPriceBN,
  usdInitialPriceBN,
  initialLiquidityBN,
  lpTokensWorthAtBuyTimeUsdBN,
  policyPeriods,
  usdcDecimals,
  expect,
  initialUsdcBalanceBN,
  TestHelper,
  setNextBlockTimestampAndMineWithPolicyPeriod,
  address1,
} from '../../utils'
import { fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('ILProtectionController-liquidity-tests', () => {
  let ethUsdPriceOracle: ETHUSDOracle
  let usdUsdPriceOracle: USDUSDOracle
  let linkUsdPriceOracle: LINKUSDOracle
  let protectionController: ILProtectionController
  let liquidityController: LiquidityController
  let treasuryController: TreasuryController
  let protectionNFT: ILProtectionNFT
  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle

  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let protectionBuyer: SignerWithAddress
  let alice: SignerWithAddress
  let liquidityWithdrawnToAccount: SignerWithAddress
  let treasury: SignerWithAddress

  const amountToWithdraw = fromNumber(100, usdcDecimals)

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, liquidityProvider, protectionBuyer, alice, liquidityWithdrawnToAccount, treasury } =
      await helper.getNamedSigners())
    ;({
      ethUsdPriceOracle,
      usdUsdPriceOracle,
      linkUsdPriceOracle,
      ilProtectionController: protectionController,
      liquidityController,
      treasuryController,
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

  it('Liquidity added, 0 < collateral < liquidity, Liquidity withdrawn', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await protectionController
      .connect(liquidityProvider)
      .withdrawLiquidity(amountToWithdraw, liquidityWithdrawnToAccount.address)

    const treasuryBalance = await usdcToken.balanceOf(treasury.address)

    const protectionDetails = await protectionNFT.getProtectionDetails(0)

    expect(await protectionController.collateral()).above(0)
    expect(await usdcToken.balanceOf(liquidityWithdrawnToAccount.address)).is.equal(amountToWithdraw)
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(
      initialLiquidityBN.add(protectionDetails.premiumCostUSD).sub(amountToWithdraw).sub(treasuryBalance),
    )
  })

  it('Liquidity added, collateral == 0,collateral < liquidity, Liquidity withdrawn', async () => {
    await protectionController
      .connect(liquidityProvider)
      .withdrawLiquidity(amountToWithdraw, liquidityWithdrawnToAccount.address)

    expect(await protectionController.collateral()).is.equal(0)
    expect(await usdcToken.balanceOf(liquidityController.address)).is.equal(initialLiquidityBN.sub(amountToWithdraw))
  })

  it('Liquidity added, 0 < collateral < liquidity, withdrawing too much liquidity (collateral > liquidity), should revert', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await expect(
      protectionController
        .connect(liquidityProvider)
        .withdrawLiquidity(await usdcToken.balanceOf(liquidityController.address), liquidityWithdrawnToAccount.address),
    ).to.be.revertedWith('Not enough collateral')
  })

  it('Adding liquidity, buying and closing protection, withdrawing all liquidity, changing to new liquidity token and buying and closing another protection', async () => {
    const newLiquidityToken = await helper.deploy('USDC', 'USD Coin2', 'USDC2', fromNumber(100000, 6), 6)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData1 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData1)

    await protectionController
      .connect(liquidityProvider)
      .withdrawLiquidity(await usdcToken.balanceOf(liquidityController.address), liquidityWithdrawnToAccount.address)

    const treasuryBalanceBeforeTokenChange = await usdcToken.balanceOf(treasury.address)

    await usdcToken.connect(treasury).transfer(alice.address, treasuryBalanceBeforeTokenChange)

    await liquidityController.connect(owner).setLiquidityToken(newLiquidityToken.address)
    await treasuryController.connect(owner).setTreasuryToken(newLiquidityToken.address)
    await liquidityController.connect(owner).approveTreasury('200000000000')

    await newLiquidityToken.mint(liquidityProvider.address, '200000000000')
    await newLiquidityToken.mint(protectionBuyer.address, '200000000000')
    await newLiquidityToken.connect(liquidityProvider).approve(liquidityController.address, '200000000000')
    await newLiquidityToken.connect(protectionBuyer).approve(liquidityController.address, '200000000000')

    await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)

    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await setNextBlockTimestampAndMineWithPolicyPeriod(policyPeriods[0])

    const { performData: performData2 } = await protectionController.checkUpkeep([])

    await protectionController.performUpkeep(performData2)

    await protectionController
      .connect(liquidityProvider)
      .withdrawLiquidity(
        await newLiquidityToken.balanceOf(liquidityController.address),
        liquidityWithdrawnToAccount.address,
      )

    const protection1WithMetadata = await protectionController.closedProtectionsWithMetadata(0)
    const protection2WithMetadata = await protectionController.closedProtectionsWithMetadata(1)
    const protectionDetails1 = await protectionNFT.getProtectionDetails(0)
    const protectionDetails2 = await protectionNFT.getProtectionDetails(1)

    const treasuryBalanceAfterTokenChange = await newLiquidityToken.balanceOf(treasury.address)

    expect(await usdcToken.balanceOf(liquidityWithdrawnToAccount.address)).is.equal(
      initialLiquidityBN
        .add(protectionDetails1.premiumCostUSD)
        .sub(treasuryBalanceBeforeTokenChange)
        .sub(protection1WithMetadata.amountPaidOnPolicyClose),
    )
    expect(await newLiquidityToken.balanceOf(liquidityWithdrawnToAccount.address)).is.equal(
      initialLiquidityBN
        .add(protectionDetails2.premiumCostUSD)
        .sub(treasuryBalanceAfterTokenChange)
        .sub(protection2WithMetadata.amountPaidOnPolicyClose),
    )
  })

  it('Buying protection - trying to replace liquidity token - should revert', async () => {
    await protectionController
      .connect(protectionBuyer)
      .buyProtection(TokenName.WETH, TokenName.USDC, lpTokensWorthAtBuyTimeUsdBN, '100000000000', policyPeriods[0])

    await expect(liquidityController.connect(owner).setLiquidityToken(address1)).to.be.revertedWith(
      'Current liquidity balance is not 0',
    )
  })
})
