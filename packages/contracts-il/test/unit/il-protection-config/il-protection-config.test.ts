import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { ILProtectionConfig } from '@coti-cvi/auto-generated-code/contracts'
import { expect, premiumGrowthStartBN, premiumSlopeBN, runFixture, TestHelper } from '../../utils'
import { AddressZero } from '@ethersproject/constants'
import { state } from '../../../../contracts-deploy/src'

describe('ILProtectionConfig unit tests', () => {
  let ilProtectionConfig: ILProtectionConfig

  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress

  beforeEach(async () => {
    const helper = TestHelper.get(ethers)
    ;({ owner, alice, bob } = await helper.getNamedSigners())

    await runFixture(['il-protection-config'])

    ilProtectionConfig = await helper.connect('ILProtectionConfig')
  })

  describe('initialize', () => {
    it('Should set the right owner', async () => {
      expect(await ilProtectionConfig.owner()).to.equal(owner.address)
    })

    it('Should have the correct initial state', async () => {
      const {
        minAmountToBePaid,
        maxILProtected,
        buyILProtectionEnabled,
        ilProtectionFee,
        expectedLPTokensValueGrowth,
      } = state

      expect(await ilProtectionConfig.minAmountToBePaid()).to.equal(minAmountToBePaid)
      expect(await ilProtectionConfig.maxILProtected()).to.equal(maxILProtected)
      expect(await ilProtectionConfig.buyILProtectionEnabled()).to.equal(buyILProtectionEnabled)
      expect(await ilProtectionConfig.feeComponent()).to.equal(ilProtectionFee)
      expect(await ilProtectionConfig.expectedLPTokensValueGrowth()).to.equal(expectedLPTokensValueGrowth)
      expect(await ilProtectionConfig.premiumGrowthStart()).to.equal(premiumGrowthStartBN)
      expect(await ilProtectionConfig.premiumSlope()).to.equal(premiumSlopeBN)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(ilProtectionConfig.initialize(AddressZero, 1, 1, true, 1, 1, [1], 1, 1)).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('role check', () => {
    it('Should revert when calling setters by not admin', async () => {
      const config = ilProtectionConfig.connect(bob)
      const notAdminError = `AccessControl: account ${bob.address.toLowerCase()} is missing role ${await config.DEFAULT_ADMIN_ROLE()}`
      await expect(config.setMinAmountToBePaid(100)).to.be.revertedWith(notAdminError)
      await expect(config.setBuyILProtectionEnabled(true)).to.be.revertedWith(notAdminError)
      await expect(config.setFeeComponent(1)).to.be.revertedWith(notAdminError)
      await expect(config.setPolicyPeriodsInSeconds([])).to.be.revertedWith(notAdminError)
      await expect(config.setExpectedLPTokensValueGrowth(1)).to.be.revertedWith(notAdminError)
      await expect(config.setPremiumGrowthStart(10)).to.be.revertedWith(notAdminError)
      await expect(config.setPremiumSlope(10)).to.be.revertedWith(notAdminError)
    })

    it('Should revert when setting setMaxILProtected by not controller', async () => {
      const config = ilProtectionConfig.connect(bob)
      const notControllerError = `AccessControl: account ${bob.address.toLowerCase()} is missing role ${await config.PROTECTION_CONTROLLER_ROLE()}`
      await expect(config.setMaxILProtected(1500)).to.be.revertedWith(notControllerError)
    })
  })

  describe('setters', () => {
    it('Should setBuyILProtectionEnabled successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)

      const res = await config.setBuyILProtectionEnabled(false)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.BuyILProtectionEnabledChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.equal(false)
      expect(await config.buyILProtectionEnabled()).to.equal(false)
    })

    it('Should revert when setting setBuyILProtectionEnabled false twice', async () => {
      const config = ilProtectionConfig.connect(owner)

      await config.setBuyILProtectionEnabled(false)
      const error = 'Setting buyILProtectionEnabled to same value'
      await expect(ilProtectionConfig.connect(owner).setBuyILProtectionEnabled(false)).to.be.revertedWith(error)
    })

    it('Should revert when setting setBuyILProtectionEnabled true twice', async () => {
      const config = ilProtectionConfig.connect(owner)
      await config.setBuyILProtectionEnabled(false)

      await config.setBuyILProtectionEnabled(true)
      const error = 'Setting buyILProtectionEnabled to same value'
      await expect(ilProtectionConfig.connect(owner).setBuyILProtectionEnabled(true)).to.be.revertedWith(error)
    })

    it('Should setMinAmountToBePaid with 10000 successfully with event', async () => {
      const res = await ilProtectionConfig.connect(owner).setMinAmountToBePaid(10000)
      const block = (await res.wait()).blockNumber
      const events = await ilProtectionConfig.queryFilter(
        ilProtectionConfig.filters.MinAmountToBePaidChanged(),
        block,
        block,
      )
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.equal(10000)
      expect(await ilProtectionConfig.minAmountToBePaid()).to.be.equal(10000)
    })

    it('Should setMaxILProtected with 1500 successfully with event', async () => {
      await ilProtectionConfig
        .connect(owner)
        .grantRole(await ilProtectionConfig.PROTECTION_CONTROLLER_ROLE(), alice.address)

      const config = ilProtectionConfig.connect(alice)
      const res = await config.setMaxILProtected(1500)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.MaxILProtectedChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.equal(1500)
      expect(await config.maxILProtected()).to.be.equal(1500)
    })

    it('Should revert when setting setMaxILProtected with out of range param', async () => {
      await ilProtectionConfig
        .connect(owner)
        .grantRole(await ilProtectionConfig.PROTECTION_CONTROLLER_ROLE(), alice.address)

      const config = ilProtectionConfig.connect(alice)
      await config.setMaxILProtected(1500)

      const max = await config.MAX_PRECISION()
      const error = `Param is out of range`

      await expect(config.setMaxILProtected(max)).to.not.be.revertedWith(error)
      await expect(config.setMaxILProtected(max + 1)).to.be.revertedWith(error)
    })

    it('Should setExpectedLPTokensValueGrowth with 10000 successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)
      const res = await config.setExpectedLPTokensValueGrowth(10000)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.ExpectedLPTokensValueGrowthChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.equal(10000)
      expect(await config.expectedLPTokensValueGrowth()).to.be.equal(10000)
    })

    it('Should revert when setting setExpectedLPTokensValueGrowth with 0', async () => {
      const error = 'expectedLPTokensValueGrowth must be > 0'
      await expect(ilProtectionConfig.connect(owner).setExpectedLPTokensValueGrowth(0)).to.be.revertedWith(error)
    })

    it('Should setFee with 10 successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)
      const res = await config.setFeeComponent(10)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.FeeComponentChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.equal(10)
      expect(await config.feeComponent()).to.be.equal(10)
    })

    it('Should revert when setting setFee with out of range param', async () => {
      const config = ilProtectionConfig.connect(owner)

      const max = await config.MAX_PRECISION()
      const error = `Param is out of range`

      await expect(config.setFeeComponent(max)).to.not.be.revertedWith(error)
      await expect(config.setFeeComponent(max + 1)).to.be.revertedWith(error)
    })

    it('Should setPolicyPeriodsInSeconds successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)
      const periods = [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)]
      const res = await config.setPolicyPeriodsInSeconds(periods)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.PolicyPeriodChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.newValue).to.deep.equal(periods)
      expect(await config.getPolicyPeriodsInSeconds()).to.deep.equal(periods)
    })

    it('Should revert when setting setPolicyPeriodsInSeconds with empty array', async () => {
      const error = `Policy periods array is empty`
      await expect(ilProtectionConfig.connect(owner).setPolicyPeriodsInSeconds([])).to.be.revertedWith(error)
    })

    it('Should revert when setting a policy period with a 0 value', async () => {
      await expect(ilProtectionConfig.connect(owner).setPolicyPeriodsInSeconds([1, 2, 0])).to.be.revertedWith(
        'Policy period cannot be 0',
      )
    })

    it('Should setPremiumGrowthStart successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)
      const res = await config.setPremiumGrowthStart(15)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.PremiumGrowthStartChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.prevValue).to.equal(premiumGrowthStartBN)
      expect(events[0].args.newValue).to.equal(15)
      expect(await config.premiumGrowthStart()).to.equal(15)
    })

    it('Should setPremiumSlope successfully with event', async () => {
      const config = ilProtectionConfig.connect(owner)
      const res = await config.setPremiumSlope(5)
      const block = (await res.wait()).blockNumber
      const events = await config.queryFilter(config.filters.PremiumSlopeChanged(), block, block)
      expect(events.length).to.equal(1)
      expect(events[0].args.prevValue).to.equal(premiumSlopeBN)
      expect(events[0].args.newValue).to.equal(5)
      expect(await config.premiumSlope()).to.equal(5)
    })

    it('Should revert when setting premium slope with a 0 value', async () => {
      await expect(ilProtectionConfig.connect(owner).setPremiumSlope(0)).to.be.revertedWith('premiumSlope must be > 0')
    })
  })

  describe('policy periods', () => {
    it('Should return false when calling policyPeriodExists with invalid period', async () => {
      expect(await ilProtectionConfig.policyPeriodExists(20)).to.be.equal(false)
    })

    it('Should return true when calling policyPeriodExists with valid periods', async () => {
      await Promise.all(
        state.policyPeriods.map(async period =>
          expect(await ilProtectionConfig.policyPeriodExists(period)).to.be.equal(true),
        ),
      )
    })
  })
})
