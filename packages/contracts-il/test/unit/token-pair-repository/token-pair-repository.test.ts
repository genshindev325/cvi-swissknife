import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { AddressZero } from '@ethersproject/constants'
import type { MockContract } from '@defi-wonderland/smock'
import type { PremiumParamsStruct } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionController'
import type {
  ETHUSDOracle,
  ILProtectionConfig,
  TokenPairRepository,
  USDUSDOracle,
} from '@coti-cvi/auto-generated-code/contracts'
import {
  priceOracleUsdPairDecimals,
  expect,
  address1,
  address2,
  policyPeriods,
  getAccessControlRevertStr,
  adminRole,
  ethInitialPriceBN,
  usdInitialPriceBN,
  TestHelper,
  assertPair,
  assertPremiumParams,
  mock,
  usdcDecimals,
  ethUsdcCollateralCapComponentBN,
  queryEvents,
} from '../../utils'
import { fromNumber } from '../../../../lw-sdk/src/util/big-number'
import { TokenName } from '@coti-cvi/lw-sdk'

describe('TokenPairRepository', () => {
  let tokenPairRepository: TokenPairRepository
  let protectionConfig: MockContract<ILProtectionConfig>
  let ethUSDOracle: MockContract<ETHUSDOracle>
  let usdUsdOracle: MockContract<USDUSDOracle>
  let owner: SignerWithAddress

  const premiumsParams: PremiumParamsStruct[] = [
    {
      A: '1000000',
      X0: '200000000',
      C: '300000000000',
    },
    {
      A: '4000000',
      X0: '500000000',
      C: '600000000000',
    },
    {
      A: '7000000',
      X0: '800000000',
      C: '900000000000',
    },
  ]

  const premiumsParamsUpdated: PremiumParamsStruct[] = [
    {
      A: '123000000',
      X0: '23400000000',
      C: '35600000000000',
    },
    {
      A: '4110000',
      X0: '5323200000',
      C: '603243000000',
    },
    {
      A: '74242420000',
      X0: '800567547000',
      C: '90000042322200',
    },
  ]

  let accessControlRevertStr: string

  before(async () => {
    const helper = TestHelper.get(ethers)
    const deployer = await helper.getDeployerSigner()

    accessControlRevertStr = getAccessControlRevertStr(deployer.address.toLowerCase(), adminRole)

    protectionConfig = await mock('ILProtectionConfig')
    ethUSDOracle = await mock('ETHUSDOracle', 0)
    usdUsdOracle = await mock('USDUSDOracle', 0)
  })

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)
    owner = await helper.getOwnerSigner()

    tokenPairRepository = await helper.deployProxy(
      'TokenPairRepository',
      {},
      owner.address,
      priceOracleUsdPairDecimals,
      protectionConfig.address,
    )
  })

  describe('initialize', () => {
    it('Should revert if initialize is called a second time', async () => {
      await expect(tokenPairRepository.initialize(owner.address, 1, AddressZero)).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('setPair', () => {
    it('Should set a new pair', async () => {
      const tx = await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.PairSet()],
          },
        ])
      )[0].args

      const pair = await tokenPairRepository.getPair(TokenName.WETH, TokenName.USDC)
      const pairFromList = await tokenPairRepository.tokensPairsList(0)

      assertPair(pair, TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)
      assertPair(pairFromList, TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)
      assertPair(eventArgs!.prevValue, '', '', AddressZero, AddressZero, false)
      assertPair(eventArgs!.newValue, TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)

      await expect(tokenPairRepository.tokensPairsList(1)).to.be.reverted
    })

    it('Should update pair', async () => {
      //Set initial pair
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      //Update pair
      const tx = await tokenPairRepository.connect(owner).setPair(TokenName.WETH, TokenName.USDC, address1, address2)

      const pair = await tokenPairRepository.getPair(TokenName.WETH, TokenName.USDC)
      const pairFromList = await tokenPairRepository.tokensPairsList(0)
      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.PairSet()],
          },
        ])
      )[0].args

      assertPair(pair, TokenName.WETH, TokenName.USDC, address1, address2, true)
      assertPair(pairFromList, TokenName.WETH, TokenName.USDC, address1, address2, true)
      assertPair(eventArgs!.prevValue, TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)
      assertPair(eventArgs!.newValue, TokenName.WETH, TokenName.USDC, address1, address2, true)

      await expect(tokenPairRepository.tokensPairsList(1)).to.be.reverted
    })

    it('Should update pair when pair symbols are reversed', async () => {
      //Set initial pair
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      //Update pair
      const tx = await tokenPairRepository.connect(owner).setPair(TokenName.USDC, TokenName.WETH, address2, address1)

      const pair = await tokenPairRepository.getPair(TokenName.WETH, TokenName.USDC)
      const pairFromList = await tokenPairRepository.tokensPairsList(0)
      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.PairSet()],
          },
        ])
      )[0].args

      assertPair(pair, TokenName.WETH, TokenName.USDC, address1, address2, true)
      assertPair(pairFromList, TokenName.WETH, TokenName.USDC, address1, address2, true)
      assertPair(eventArgs!.prevValue, TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)
      assertPair(eventArgs!.newValue, TokenName.WETH, TokenName.USDC, address1, address2, true)

      await expect(tokenPairRepository.tokensPairsList(1)).to.be.reverted
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        tokenPairRepository.setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert of tokenSymbol1 is an empty string', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPair('', TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address),
      ).to.be.revertedWith('Empty token symbol')
    })

    it('Should revert of tokenSymbol2 is an empty string', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPair(TokenName.WETH, '', ethUSDOracle.address, usdUsdOracle.address),
      ).to.be.revertedWith('Empty token symbol')
    })

    it('Should revert of priceAggregator 1 is a zero address', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPair(TokenName.WETH, TokenName.USDC, AddressZero, usdUsdOracle.address),
      ).to.be.revertedWith('Invalid price aggregator address')
    })

    it('Should revert of priceAggregator 2 is a zero address', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, AddressZero),
      ).to.be.revertedWith('Invalid price aggregator address')
    })
  })

  describe('setPremiumParams', () => {
    beforeEach(async () => {
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)
    })

    it('Should set premium params', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      const tx = await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, premiumsParams)

      const events = await queryEvents([
        {
          contract: tokenPairRepository,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [tokenPairRepository.filters.PremiumParamsChanged()],
        },
      ])

      for (let i = 0; i < policyPeriods.length; i++) {
        const retPremiumsParamsPeriod = await tokenPairRepository.getPremiumParams(
          TokenName.WETH,
          TokenName.USDC,
          policyPeriods[i],
        )

        assertPremiumParams(retPremiumsParamsPeriod, premiumsParams[i])
        assertPremiumParams(events![i].args!.prevValue, { A: 0, X0: 0, C: 0 })
        assertPremiumParams(events![i].args!.newValue, premiumsParams[i])

        expect(events![i].args!.token1Symbol).is.equal(TokenName.WETH)
        expect(events![i].args!.token2Symbol).is.equal(TokenName.USDC)
        expect(events![i].args!.policyPeriod).is.equal(policyPeriods[i])
      }
    })

    it('Should update premium params', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, premiumsParams)

      const tx = await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, premiumsParamsUpdated)

      const events = await queryEvents([
        {
          contract: tokenPairRepository,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [tokenPairRepository.filters.PremiumParamsChanged()],
        },
      ])

      for (let i = 0; i < policyPeriods.length; i++) {
        const retPremiumsParamsPeriod = await tokenPairRepository.getPremiumParams(
          TokenName.WETH,
          TokenName.USDC,
          policyPeriods[i],
        )

        assertPremiumParams(retPremiumsParamsPeriod, premiumsParamsUpdated[i])
        assertPremiumParams(events![i].args!.prevValue, premiumsParams[i])
        assertPremiumParams(events![i].args!.newValue, premiumsParamsUpdated[i])

        expect(events![i].args!.token1Symbol).is.equal(TokenName.WETH)
        expect(events![i].args!.token2Symbol).is.equal(TokenName.USDC)
        expect(events![i].args!.policyPeriod).is.equal(policyPeriods[i])
      }
    })

    it('Should update premium params when pair symbols are reversed', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods, premiumsParams)

      const tx = await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods, premiumsParamsUpdated)

      const events = await queryEvents([
        {
          contract: tokenPairRepository,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [tokenPairRepository.filters.PremiumParamsChanged()],
        },
      ])

      for (let i = 0; i < policyPeriods.length; i++) {
        const retPremiumsParamsPeriod = await tokenPairRepository.getPremiumParams(
          TokenName.USDC,
          TokenName.WETH,
          policyPeriods[i],
        )

        assertPremiumParams(retPremiumsParamsPeriod, premiumsParamsUpdated[i])
        assertPremiumParams(events![i].args!.prevValue, premiumsParams[i])
        assertPremiumParams(events![i].args!.newValue, premiumsParamsUpdated[i])

        expect(events![i].args!.token1Symbol).is.equal(TokenName.WETH)
        expect(events![i].args!.token2Symbol).is.equal(TokenName.USDC)
        expect(events![i].args!.policyPeriod).is.equal(policyPeriods[i])
      }
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        tokenPairRepository.setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, premiumsParams),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert if policy periods array is empty', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPremiumsParams(TokenName.WETH, TokenName.USDC, [], premiumsParams),
      ).to.be.revertedWith('Empty policy periods array')
    })

    it('Should revert if policy periods array length != premium params array length', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPremiumsParams(TokenName.WETH, TokenName.USDC, [1, 2], premiumsParams),
      ).to.be.revertedWith('Policy periods and premium params length mismatch')
    })

    it('Should revert if policy period does not exist in config', async () => {
      protectionConfig.policyPeriodExists.returns(false)

      await expect(
        tokenPairRepository
          .connect(owner)
          .setPremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods, premiumsParams),
      ).to.be.revertedWith('Invalid policy period')
    })

    it('Should revert if token pair does not exist', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPremiumsParams('Does not', 'Exist', policyPeriods, premiumsParams),
      ).to.be.revertedWith(`TokenPairDoesNotExist()`)
    })
  })

  describe('deletePremiumParams', () => {
    beforeEach(async () => {
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)
    })

    it('Should delete premium params', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods, premiumsParams)

      const tx = await tokenPairRepository
        .connect(owner)
        .deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods)

      const events = await queryEvents([
        {
          contract: tokenPairRepository,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [tokenPairRepository.filters.PremiumParamsDeleted()],
        },
      ])

      for (let i = 0; i < policyPeriods.length; i++) {
        const retPremiumsParamsPeriod = await tokenPairRepository.getPremiumParams(
          TokenName.WETH,
          TokenName.USDC,
          policyPeriods[i],
        )

        assertPremiumParams(retPremiumsParamsPeriod, { A: 0, X0: 0, C: 0 })
        assertPremiumParams(events![i].args!.deletedParams, premiumsParams[i])

        expect(events![i].args!.token1Symbol).is.equal(TokenName.WETH)
        expect(events![i].args!.token2Symbol).is.equal(TokenName.USDC)
        expect(events![i].args!.policyPeriod).is.equal(policyPeriods[i])
      }
    })

    it('Should delete premium params when pair symbols are reversed', async () => {
      protectionConfig.policyPeriodExists.returns(true)

      await tokenPairRepository
        .connect(owner)
        .setPremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods, premiumsParams)

      const tx = await tokenPairRepository
        .connect(owner)
        .deletePremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods)

      const events = await queryEvents([
        {
          contract: tokenPairRepository,
          fromBlock: tx.blockNumber!,
          toBlock: tx.blockNumber!,
          filters: [tokenPairRepository.filters.PremiumParamsDeleted()],
        },
      ])

      for (let i = 0; i < policyPeriods.length; i++) {
        const retPremiumsParamsPeriod = await tokenPairRepository.getPremiumParams(
          TokenName.USDC,
          TokenName.WETH,
          policyPeriods[i],
        )

        assertPremiumParams(retPremiumsParamsPeriod, { A: 0, X0: 0, C: 0 })
        assertPremiumParams(events![i].args!.deletedParams, premiumsParams[i])

        expect(events![i].args!.token1Symbol).is.equal(TokenName.WETH)
        expect(events![i].args!.token2Symbol).is.equal(TokenName.USDC)
        expect(events![i].args!.policyPeriod).is.equal(policyPeriods[i])
      }
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        tokenPairRepository.deletePremiumsParams(TokenName.WETH, TokenName.USDC, policyPeriods),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert if token pair does not exist', async () => {
      await expect(
        tokenPairRepository.connect(owner).deletePremiumsParams('Does not', 'Exist', policyPeriods),
      ).to.be.revertedWith(`TokenPairDoesNotExist()`)
    })

    it('Should revert if policy periods array is empty', async () => {
      await expect(
        tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.WETH, TokenName.USDC, []),
      ).to.be.revertedWith('Empty policy periods array')
    })

    it('Should revert if policy period does not exist in config', async () => {
      protectionConfig.policyPeriodExists.returns(false)

      await expect(
        tokenPairRepository.connect(owner).deletePremiumsParams(TokenName.USDC, TokenName.WETH, policyPeriods),
      ).to.be.revertedWith('Invalid policy period')
    })
  })

  describe('setCollateralCapComponent', () => {
    beforeEach(async () => {
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.LINK, ethUSDOracle.address, usdUsdOracle.address)

      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.BAT, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)
    })

    it('Should set collateral cap component', async () => {
      const tx = await tokenPairRepository
        .connect(owner)
        .setCollateralCapComponent(TokenName.WETH, TokenName.USDC, ethUsdcCollateralCapComponentBN)

      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.CollateralCapComponentChanged()],
          },
        ])
      )[0].args

      expect(await tokenPairRepository.getCollateralCapComponent(TokenName.WETH, TokenName.USDC)).is.equal(
        ethUsdcCollateralCapComponentBN,
      )

      expect(eventArgs!.token1Symbol).is.equal(TokenName.WETH)
      expect(eventArgs!.token2Symbol).is.equal(TokenName.USDC)
      expect(eventArgs!.prevValue).is.equal(0)
      expect(eventArgs!.newValue).is.equal(ethUsdcCollateralCapComponentBN)
    })

    it('Should set collateral cap component when token pair is reversed', async () => {
      const tx = await tokenPairRepository
        .connect(owner)
        .setCollateralCapComponent(TokenName.USDC, TokenName.WETH, ethUsdcCollateralCapComponentBN)

      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.CollateralCapComponentChanged()],
          },
        ])
      )[0].args

      expect(await tokenPairRepository.getCollateralCapComponent(TokenName.WETH, TokenName.USDC)).is.equal(
        ethUsdcCollateralCapComponentBN,
      )

      expect(eventArgs!.token1Symbol).is.equal(TokenName.WETH)
      expect(eventArgs!.token2Symbol).is.equal(TokenName.USDC)
      expect(eventArgs!.prevValue).is.equal(0)
      expect(eventArgs!.newValue).is.equal(ethUsdcCollateralCapComponentBN)
    })

    it('Should set collateral cap components for several tokens', async () => {
      await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 5000)
      await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.WETH, TokenName.LINK, 4000)
      await tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.BAT, TokenName.USDC, 3000)

      expect(await tokenPairRepository.getCollateralCapComponent(TokenName.WETH, TokenName.USDC)).is.equal(5000)

      expect(await tokenPairRepository.getCollateralCapComponent(TokenName.WETH, TokenName.LINK)).is.equal(4000)

      expect(await tokenPairRepository.getCollateralCapComponent(TokenName.BAT, TokenName.USDC)).is.equal(3000)
    })

    it('Should revert if collateral cap component is above MAX_PRECISION', async () => {
      await expect(
        tokenPairRepository.connect(owner).setCollateralCapComponent(TokenName.USDC, TokenName.WETH, 10001),
      ).to.be.revertedWith('collateralCapComponent is out of range')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(
        tokenPairRepository.setCollateralCapComponent(TokenName.WETH, TokenName.USDC, 5000),
      ).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert if token pair does not exist', async () => {
      await expect(
        tokenPairRepository.connect(owner).setCollateralCapComponent('Some', 'Token', 5000),
      ).to.be.revertedWith(`TokenPairDoesNotExist()`)
    })
  })

  describe('setPriceTokenDecimals', () => {
    it('Should set price token decimals', async () => {
      const newDecimals = 7

      ethUSDOracle.decimals.returns(newDecimals)
      usdUsdOracle.decimals.returns(newDecimals)

      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      const tx = await tokenPairRepository.connect(owner).setPriceTokenDecimals(newDecimals)

      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.PriceTokenDecimalsChanged()],
          },
        ])
      )[0].args

      expect(await tokenPairRepository.priceTokenDecimals()).is.equal(7)
      expect(eventArgs!.prevValue).is.equal(priceOracleUsdPairDecimals)
      expect(eventArgs!.newValue).is.equal(newDecimals)
    })

    it('Should revert on decimals mismatch (first aggregator)', async () => {
      ethUSDOracle.decimals.returns(usdcDecimals)
      usdUsdOracle.decimals.returns(priceOracleUsdPairDecimals)

      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      await expect(
        tokenPairRepository.connect(owner).setPriceTokenDecimals(priceOracleUsdPairDecimals),
      ).to.be.revertedWith('Decimals mismatch with current aggregators')
    })

    it('Should revert on decimals mismatch (second aggregator)', async () => {
      ethUSDOracle.decimals.returns(priceOracleUsdPairDecimals)
      usdUsdOracle.decimals.returns(usdcDecimals)

      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      await expect(
        tokenPairRepository.connect(owner).setPriceTokenDecimals(priceOracleUsdPairDecimals),
      ).to.be.revertedWith('Decimals mismatch with current aggregators')
    })

    it('Should revert if there are no token pairs', async () => {
      await expect(
        tokenPairRepository.connect(owner).setPriceTokenDecimals(priceOracleUsdPairDecimals),
      ).to.be.revertedWith('No existing tokens pairs')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(tokenPairRepository.setPriceTokenDecimals(6)).to.be.revertedWith(accessControlRevertStr)
    })
  })

  describe('setILProtectionConfig', () => {
    it('Should set ILProtectionConfig', async () => {
      const tx = await tokenPairRepository.connect(owner).setILProtectionConfig(address1)

      const eventArgs = (
        await queryEvents([
          {
            contract: tokenPairRepository,
            fromBlock: tx.blockNumber!,
            toBlock: tx.blockNumber!,
            filters: [tokenPairRepository.filters.ILProtectionConfigChanged()],
          },
        ])
      )[0].args

      expect(await tokenPairRepository.protectionConfig()).is.equal(address1)
      expect(eventArgs!.prevValue).is.equal(protectionConfig.address)
      expect(eventArgs!.newValue).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(tokenPairRepository.setILProtectionConfig(address1)).to.be.revertedWith(accessControlRevertStr)
    })

    it('Should revert ILProtectionConfig address is invalid', async () => {
      await expect(tokenPairRepository.connect(owner).setILProtectionConfig(AddressZero)).to.be.revertedWith(
        'Invalid address',
      )
    })
  })

  describe('getTokenPrice', () => {
    beforeEach(async () => {
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)
    })

    it('Should get first token price', async () => {
      ethUSDOracle.latestRoundData.returns([0, ethInitialPriceBN, 0, 0, 0])

      const price = await tokenPairRepository.getTokenPrice(TokenName.WETH, TokenName.USDC, true)

      expect(price).is.equal(ethInitialPriceBN)
    })

    it('Should get second token price', async () => {
      usdUsdOracle.latestRoundData.returns([0, usdInitialPriceBN, 0, 0, 0])

      const price = await tokenPairRepository.getTokenPrice(TokenName.WETH, TokenName.USDC, false)

      expect(price).is.equal(usdInitialPriceBN)
    })

    it('Should get first token price when tokens symbols are reversed', async () => {
      usdUsdOracle.latestRoundData.returns([0, ethInitialPriceBN, 0, 0, 0])

      const price = await tokenPairRepository.getTokenPrice(TokenName.USDC, TokenName.WETH, true)

      expect(price).is.equal(ethInitialPriceBN)
    })

    it('Should get second token price when tokens symbols are reversed', async () => {
      usdUsdOracle.latestRoundData.returns([0, usdInitialPriceBN, 0, 0, 0])

      const price = await tokenPairRepository.getTokenPrice(TokenName.USDC, TokenName.WETH, false)

      expect(price).is.equal(usdInitialPriceBN)
    })

    it('Should revert if price is negative', async () => {
      usdUsdOracle.latestRoundData.returns([0, fromNumber(-200, priceOracleUsdPairDecimals), 0, 0, 0])

      await expect(tokenPairRepository.getTokenPrice(TokenName.USDC, TokenName.WETH, false)).to.be.revertedWith(
        'Invalid price - negative',
      )
    })
  })

  describe('getPairs', () => {
    it('Should return pairs', async () => {
      await tokenPairRepository
        .connect(owner)
        .setPair(TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address)

      await tokenPairRepository.connect(owner).setPair(TokenName.WETH, TokenName.LINK, address1, address2)

      const pairs = await tokenPairRepository.getPairs()

      expect(pairs.length).is.equal(2)
      assertPair(pairs[0], TokenName.WETH, TokenName.USDC, ethUSDOracle.address, usdUsdOracle.address, true)
      assertPair(pairs[1], TokenName.WETH, TokenName.LINK, address1, address2, true)
    })

    it('Should return empty pairs list if there are no existing pairs', async () => {
      const pairs = await tokenPairRepository.getPairs()

      expect(pairs.length).is.equal(0)
    })
  })
})
