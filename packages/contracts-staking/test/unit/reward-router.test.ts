import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { AddressZero } from '@ethersproject/constants'
import { TestHelper, expect } from '../utils'
import type { RewardRouter } from '../../../auto-generated-code/src/git-contract-types'
import { StakedTokenName } from '../../../lw-sdk/src'
import { address1, address2, adminRole, getAccessControlRevertStr } from '../../../contracts-il/test/utils'

describe('RewardTracker', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress

  let rewardRouter: RewardRouter
  let operatorRole: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice } = await helper.getNamedSigners())
  })

  beforeEach(async () => {
    rewardRouter = await helper.deployProxy(
      'RewardRouter',
      {},
      owner.address,
      [StakedTokenName.THETA_VAULT, StakedTokenName.GOVI, StakedTokenName.ES_GOVI],
      [AddressZero, AddressZero, AddressZero],
      [AddressZero, AddressZero, AddressZero],
      [AddressZero, AddressZero, AddressZero],
    )

    operatorRole = await rewardRouter.OPERATOR_ROLE()
  })

  describe('initialize', () => {
    it('Should revert if initialize is called a second time', async () => {
      await expect(
        rewardRouter.initialize(
          owner.address,
          [StakedTokenName.THETA_VAULT, StakedTokenName.GOVI, StakedTokenName.ES_GOVI],
          [AddressZero, AddressZero, AddressZero],
          [AddressZero, AddressZero, AddressZero],
          [AddressZero, AddressZero, AddressZero],
        ),
      ).to.be.revertedWith('Initializable: contract is already initialized')
    })

    it('Should revert if tokens names array has invalid length', async () => {
      await expect(
        helper.deployProxy('RewardRouter', {}, owner.address, [StakedTokenName.THETA_VAULT], [], [], []),
      ).to.be.revertedWith('RewardRouter: invalid _tokenNames length')
    })
  })

  describe('setRewardTrackers', () => {
    it('Should set reward trackers', async () => {
      await rewardRouter.connect(owner).setRewardTrackers([StakedTokenName.THETA_VAULT], [address1])

      expect(await rewardRouter.rewardTrackers(StakedTokenName.THETA_VAULT)).is.equal(address1)
    })

    it('Should revert if tokenNames array has 0 length', async () => {
      await expect(rewardRouter.connect(owner).setRewardTrackers([], [])).to.be.revertedWith(
        'RewardRouter: Invalid input params length',
      )
    })

    it('Should revert if rewardTrackers array length is different from tokenNames array length', async () => {
      await expect(
        rewardRouter.connect(owner).setRewardTrackers([StakedTokenName.ES_GOVI], [address1, address2]),
      ).to.be.revertedWith('RewardRouter: Invalid input params length')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(rewardRouter.connect(alice).setRewardTrackers([], [])).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setVesters', () => {
    it('Should set vesters', async () => {
      await rewardRouter.connect(owner).setVesters([StakedTokenName.THETA_VAULT], [address1])

      expect(await rewardRouter.vesters(StakedTokenName.THETA_VAULT)).is.equal(address1)
    })

    it('Should revert if tokenNames array has 0 length', async () => {
      await expect(rewardRouter.connect(owner).setVesters([], [])).to.be.revertedWith(
        'RewardRouter: Invalid input params length',
      )
    })

    it('Should revert if vesters array length is different from tokenNames array length', async () => {
      await expect(
        rewardRouter.connect(owner).setVesters([StakedTokenName.ES_GOVI], [address1, address2]),
      ).to.be.revertedWith('RewardRouter: Invalid input params length')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(rewardRouter.connect(alice).setVesters([], [])).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setTokens', () => {
    it('Should set tokens', async () => {
      await rewardRouter.connect(owner).setTokens([StakedTokenName.THETA_VAULT], [address1])

      expect(await rewardRouter.tokens(StakedTokenName.THETA_VAULT)).is.equal(address1)
    })

    it('Should revert if tokenNames array has 0 length', async () => {
      await expect(rewardRouter.connect(owner).setTokens([], [])).to.be.revertedWith(
        'RewardRouter: Invalid input params length',
      )
    })

    it('Should revert if tokens array length is different from tokenNames array length', async () => {
      await expect(
        rewardRouter.connect(owner).setTokens([StakedTokenName.ES_GOVI], [address1, address2]),
      ).to.be.revertedWith('RewardRouter: Invalid input params length')
    })

    it('Should revert on invalid permissions', async () => {
      await expect(rewardRouter.connect(alice).setTokens([], [])).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('stakeForAccount', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(
        rewardRouter.connect(alice).stakeForAccount(StakedTokenName.ES_GOVI, address1, 5),
      ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole))
    })
  })

  describe('batchStakeForAccount', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(
        rewardRouter.connect(alice).batchStakeForAccount(StakedTokenName.ES_GOVI, [], []),
      ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole))
    })
  })

  describe('compoundForAccount', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(
        rewardRouter.connect(alice).compoundForAccount(address1, StakedTokenName.ES_GOVI),
      ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole))
    })
  })

  describe('batchCompoundForAccounts', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(
        rewardRouter.connect(alice).batchCompoundForAccounts([address1], StakedTokenName.ES_GOVI),
      ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole))
    })
  })
})
