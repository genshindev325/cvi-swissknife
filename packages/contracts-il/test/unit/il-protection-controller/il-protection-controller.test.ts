import { ethers } from 'hardhat'
import { AddressZero } from '@ethersproject/constants'
import { formatFixed } from '@ethersproject/bignumber'
import type { MockContract } from '@defi-wonderland/smock'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  CVIOracle,
  ILProtectionConfig,
  ILProtectionController,
  ILProtectionNFT,
  LiquidityController,
  TokenPairRepository,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  initialLiquidityBN,
  mock,
  TestHelper,
  expect,
  getAccessControlRevertStr,
  lpTokensWorthAtBuyTimeUsdBN,
  policyPeriods,
  ethInitialPrice,
  usdInitialPrice,
  usdcDecimals,
  priceOracleUsdPairDecimals,
  calcAmountToBePaid,
  lpTokensWorthAtBuyTimeUsd,
  ethInitialPriceBN,
  usdInitialPriceBN,
  maxImpermanentLossBN,
  maxPrecisionDecimals,
  growthFactorBN,
  growthFactor,
  maxImpermanentLoss,
  adminRole,
  premiumParams1BN,
  cviBN,
  calcEstimatedAmountToBePaidTruncated,
  premiumGrowthStartBN,
  premiumSlopeBN,
  address1,
  queryEvents,
} from '../../utils'
import { formatFixedAndRoundValue, fromNumber, roundCryptoValueString } from '../../../../lw-sdk/src/util/big-number'
import { calculateIL, TokenName } from '@coti-cvi/lw-sdk'
import type { ILProtectionDiscountNFTController } from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionDiscountNFTController'

describe('ILProtectionController', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let alice: SignerWithAddress

  let protectionController: ILProtectionController
  let protectionConfig: MockContract<ILProtectionConfig>
  let liquidityController: MockContract<LiquidityController>
  let tokenPairRepository: MockContract<TokenPairRepository>
  let protectionNFT: MockContract<ILProtectionNFT>
  let protectionDiscountNFTController: MockContract<ILProtectionDiscountNFTController>
  let cviOracle: MockContract<CVIOracle>

  let liquidityProviderRole: string
  let accessControlRevertStr: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, liquidityProvider, alice } = await helper.getNamedSigners())

    protectionConfig = await mock('ILProtectionConfig')
    liquidityController = await mock('LiquidityController')
    tokenPairRepository = await mock('TokenPairRepository')
    protectionNFT = await mock('ILProtectionNFT')
    protectionDiscountNFTController = await mock('ILProtectionDiscountNFTController')
    cviOracle = await mock('CVIOracle', AddressZero, AddressZero, 0, 1)
  })

  beforeEach(async () => {
    const mathUtils = await helper.deploy('MathUtils')
    const ilUtils = await helper.deploy('ILUtils')
    const premiumCalculator = await helper.deploy('PremiumCalculator')

    protectionController = (
      await helper.deployProxy(
        'ILProtectionController',
        {
          ILUtils: ilUtils.address,
          MathUtils: mathUtils.address,
          PremiumCalculator: premiumCalculator.address,
        },
        owner.address,
        protectionConfig.address,
        liquidityController.address,
        tokenPairRepository.address,
        protectionNFT.address,
        protectionDiscountNFTController.address,
        cviOracle.address,
        10,
      )
    ).connect(owner)

    liquidityProviderRole = await protectionController.LIQUIDITY_PROVIDER_ROLE()

    getAccessControlRevertStr(alice.address.toLowerCase(), liquidityProviderRole)

    await protectionController.grantRole(liquidityProviderRole, liquidityProvider.address)
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await protectionController.owner()).is.equal(owner.address)
      expect(await protectionController.protectionConfig()).is.equal(protectionConfig.address)
      expect(await protectionController.liquidityController()).is.equal(liquidityController.address)
      expect(await protectionController.tokenPairRepository()).is.equal(tokenPairRepository.address)
      expect(await protectionController.protectionNFT()).is.equal(protectionNFT.address)
      expect(await protectionController.protectionDiscountNFTController()).is.equal(
        protectionDiscountNFTController.address,
      )
      expect(await protectionController.cviOracle()).is.equal(cviOracle.address)
      expect(await protectionController.maxProtectionsInUpkeep()).is.equal(10)
      expect(await protectionController.hasRole(adminRole, owner.address)).is.equal(true)
      expect(await protectionController.hasRole(liquidityProviderRole, liquidityProvider.address)).is.equal(true)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(
        protectionController.initialize(
          AddressZero,
          AddressZero,
          AddressZero,
          AddressZero,
          AddressZero,
          AddressZero,
          AddressZero,
          5,
        ),
      ).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('addLiquidity', () => {
    it('Should add liquidity', async () => {
      liquidityController.addLiquidity.returns(0)
      await protectionController.connect(liquidityProvider).addLiquidity(initialLiquidityBN)

      expect(liquidityController.addLiquidity.getCall(0).args[0]).is.equal(liquidityProvider.address)
      expect(liquidityController.addLiquidity.getCall(0).args[1]).is.equal(initialLiquidityBN)
    })

    it('Should revert on invalid amount', async () => {
      await expect(protectionController.connect(liquidityProvider).addLiquidity(0)).to.be.revertedWith(
        'Invalid liquidity amount',
      )
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionController.connect(alice).addLiquidity(initialLiquidityBN)).to.be.revertedWith(
        accessControlRevertStr,
      )
    })
  })

  describe('withdrawLiquidity', () => {
    it('Should withdraw liquidity', async () => {
      liquidityController.liquidity.returns(initialLiquidityBN)
      liquidityController.withdrawLiquidity.returns(0)

      await protectionController
        .connect(liquidityProvider)
        .withdrawLiquidity(initialLiquidityBN, liquidityProvider.address)

      expect(liquidityController.withdrawLiquidity.getCall(0).args[0]).is.equal(initialLiquidityBN)
      expect(liquidityController.withdrawLiquidity.getCall(0).args[1]).is.equal(liquidityProvider.address)
    })

    it('Should revert if amount is 0', async () => {
      await expect(
        protectionController.connect(liquidityProvider).withdrawLiquidity(0, liquidityProvider.address),
      ).to.be.revertedWith('Invalid amount to withdraw')
    })

    it('Should revert if amount larger then total liquidity', async () => {
      liquidityController.liquidity.returns(initialLiquidityBN)

      await expect(
        protectionController
          .connect(liquidityProvider)
          .withdrawLiquidity(initialLiquidityBN.mul(2), liquidityProvider.address),
      ).to.be.revertedWith('Invalid amount to withdraw')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        protectionController.connect(alice).withdrawLiquidity(initialLiquidityBN, liquidityProvider.address),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it("Should revert if 'to' address is invalid", async () => {
      await expect(
        protectionController.connect(liquidityProvider).withdrawLiquidity(initialLiquidityBN, AddressZero),
      ).to.be.revertedWith('Invalid address')
    })
  })

  describe('buyProtection', () => {
    it('Should revert if policy period does not exist', async () => {
      protectionConfig.policyPeriodExists.returns(false)

      await expect(
        protectionController.buyProtection(
          TokenName.WETH,
          TokenName.USDC,
          lpTokensWorthAtBuyTimeUsdBN,
          '100000000',
          policyPeriods[0],
        ),
      ).to.be.revertedWith('Invalid policy period')
    })

    it('Should revert if lpTokensWorthAtBuyTimeUSD is 0', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      await expect(
        protectionController.buyProtection(TokenName.WETH, TokenName.USDC, 0, '100000000', policyPeriods[0]),
      ).to.be.revertedWith('lpTokensWorthAtBuyTimeUSD value must be larger than 0')
    })

    it('Should revert if buying protection is disabled', async () => {
      protectionConfig.policyPeriodExists.returns(true)
      protectionConfig.buyILProtectionEnabled.returns(false)

      await expect(
        protectionController.buyProtection(
          TokenName.WETH,
          TokenName.USDC,
          lpTokensWorthAtBuyTimeUsdBN,
          '100000000',
          policyPeriods[0],
        ),
      ).to.be.revertedWith('Buying protection is disabled')
    })

    it('Should revert if there is no liquidity', async () => {
      protectionConfig.policyPeriodExists.returns(true)
      protectionConfig.buyILProtectionEnabled.returns(true)
      liquidityController.liquidity.returns(0)

      await expect(
        protectionController.buyProtection(
          TokenName.WETH,
          TokenName.USDC,
          lpTokensWorthAtBuyTimeUsdBN,
          '100000000',
          policyPeriods[0],
        ),
      ).to.be.revertedWith('No liquidity')
    })

    it('Should revert if token pair does not exist', async () => {
      protectionConfig.policyPeriodExists.returns(true)
      protectionConfig.buyILProtectionEnabled.returns(true)
      liquidityController.liquidity.returns(initialLiquidityBN)
      tokenPairRepository.getOrderedTokenPairIfExists.reverts()

      await expect(
        protectionController.buyProtection(
          TokenName.WETH,
          TokenName.USDC,
          lpTokensWorthAtBuyTimeUsdBN,
          '100000000',
          policyPeriods[0],
        ),
      ).to.be.reverted
    })
  })

  describe('closeProtections', () => {
    it('Should revert if protection ids array is empty', async () => {
      await expect(protectionController.closeProtections([])).to.be.revertedWith('Protections Ids array is empty')
    })
  })

  describe('setMaxILProtected', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(protectionController.connect(alice).setMaxILProtected(5)).to.be.revertedWith(accessControlRevertStr)
    })
  })

  describe('setMaxProtectionsInUpkeep', () => {
    it('Should set the max protections in upkeep value', async () => {
      const tx = await protectionController.setMaxProtectionsInUpkeep(5)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionController.filters.MaxProtectionsInUpkeepChanged()],
          },
        ])
      )[0].args

      expect(await protectionController.maxProtectionsInUpkeep()).is.equal(5)
      expect(eventArgs!.prevValue).is.equal(10)
      expect(eventArgs!.newValue).is.equal(5)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(protectionController.connect(alice).setMaxProtectionsInUpkeep(5)).to.be.revertedWith(
        accessControlRevertStr,
      )
    })

    it('Should revert if maxProtectionsInUpkeep param is 0', async () => {
      await expect(protectionController.setMaxProtectionsInUpkeep(0)).to.be.revertedWith(
        'invalid maxProtectionsInUpkeep value',
      )
    })
  })

  describe('setILProtectionDiscountNFTController', () => {
    it('Should set a new instance', async () => {
      const tx = await protectionController.connect(owner).setILProtectionDiscountNFTController(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: protectionController,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [protectionController.filters.ILProtectionDiscountNFTControllerChanged()],
          },
        ])
      )[0].args

      expect(await protectionController.protectionDiscountNFTController()).is.equal(address1)

      expect(eventArgs!.prevValue).is.equal(protectionDiscountNFTController.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        protectionController.connect(alice).setILProtectionDiscountNFTController(address1),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert on invalid address', async () => {
      await expect(protectionController.setILProtectionDiscountNFTController(AddressZero)).to.be.revertedWith(
        'Invalid address',
      )
    })
  })

  describe('calcAmountToBePaidWithProtectionId', () => {
    it('Should revert if protection does not exist', async () => {
      await expect(protectionController.calcAmountToBePaidWithProtectionId(15)).to.be.revertedWith(
        "Protection is either closed or doesn't exist",
      )
    })
  })

  describe('calcAmountToBePaid', () => {
    it('Should calculate amount to be paid', async () => {
      const ethEndPrice = 8874
      const usdEndPrice = 1

      tokenPairRepository.priceTokenDecimals.returns(priceOracleUsdPairDecimals)

      const amountToBePaid = await protectionController.calcAmountToBePaid(
        lpTokensWorthAtBuyTimeUsdBN,
        ethInitialPriceBN,
        usdInitialPriceBN,
        fromNumber(ethEndPrice, priceOracleUsdPairDecimals),
        fromNumber(usdEndPrice, priceOracleUsdPairDecimals),
      )

      const expectedAmountToBePaid = calcAmountToBePaid(
        lpTokensWorthAtBuyTimeUsd,
        ethInitialPrice,
        usdInitialPrice,
        ethEndPrice,
        usdEndPrice,
      )

      expect(formatFixedAndRoundValue(amountToBePaid, usdcDecimals, 4)).is.equal(
        roundCryptoValueString(expectedAmountToBePaid.toString(), 4),
      )
    })
  })

  describe('calculateIL', () => {
    it('Should calculate IL', async () => {
      const ethEndPrice = 3000
      const usdEndPrice = 1

      const impermanentLoss = await protectionController.calculateIL(
        ethInitialPriceBN,
        usdInitialPriceBN,
        fromNumber(ethEndPrice, priceOracleUsdPairDecimals),
        fromNumber(usdEndPrice, priceOracleUsdPairDecimals),
      )

      const expectedIL = calculateIL(ethInitialPrice, usdInitialPrice, ethEndPrice, usdEndPrice)

      expect(formatFixed(impermanentLoss, maxPrecisionDecimals)).is.equal(expectedIL.toString())
    })
  })

  describe('calculateOpenProtectionIL', () => {
    it('Should revert if protection does not exist', async () => {
      await expect(protectionController.calculateOpenProtectionIL(15)).to.be.revertedWith(
        "Protection is either closed or doesn't exist",
      )
    })
  })

  describe('calculateParameterizedPremium', () => {
    it('Should revert if liquidity param is 0', async () => {
      await expect(
        protectionController.calculateParameterizedPremium(
          lpTokensWorthAtBuyTimeUsd,
          0,
          growthFactorBN,
          0,
          maxImpermanentLossBN,
          premiumParams1BN,
          cviBN,
          premiumGrowthStartBN,
          premiumSlopeBN,
        ),
      ).to.be.revertedWith('Liquidity must be larger than 0')
    })

    it('Should revert if collateral is larger then liquidity', async () => {
      await expect(
        protectionController.calculateParameterizedPremium(
          lpTokensWorthAtBuyTimeUsdBN,
          lpTokensWorthAtBuyTimeUsdBN.mul(1000),
          growthFactorBN,
          initialLiquidityBN,
          maxImpermanentLossBN,
          premiumParams1BN,
          cviBN,
          premiumGrowthStartBN,
          premiumSlopeBN,
        ),
      ).to.be.revertedWith('Collateral must be smaller than liquidity')
    })
  })

  describe('calcEstimatedAmountToBePaid', () => {
    it('Should estimated amount to be paid', async () => {
      const estimatedAmountToBePaid = await protectionController.calcEstimatedAmountToBePaid(
        lpTokensWorthAtBuyTimeUsdBN,
        growthFactorBN,
        maxImpermanentLossBN,
      )

      const expectedEstimatedAmountToBePaid = calcEstimatedAmountToBePaidTruncated(
        lpTokensWorthAtBuyTimeUsd,
        growthFactor,
        maxImpermanentLoss,
        4,
      )

      expect(formatFixedAndRoundValue(estimatedAmountToBePaid, usdcDecimals, 4)).is.equal(
        expectedEstimatedAmountToBePaid,
      )
    })
  })
})
