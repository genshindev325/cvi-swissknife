import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { TestHelper, expect } from '../utils'
import type { RewardDistributor } from '../../../auto-generated-code/src/git-contract-types'
import {
  address1,
  address2,
  adminRole,
  getAccessControlRevertStr,
  getLatestBlockTimestamp,
  setNextBlockTimestampAndMine,
} from '../../../contracts-il/test/utils'

describe('RewardDistributor', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress

  let rewardDistributor: RewardDistributor
  let operatorRole: string
  let timestamp: number

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice } = await helper.getNamedSigners())
  })

  beforeEach(async () => {
    rewardDistributor = await helper.deployProxy('RewardDistributor', {}, owner.address, address1, 10)

    operatorRole = await rewardDistributor.OPERATOR_ROLE()
  })

  describe('initialize', () => {
    it('Should have correct init data', async () => {
      expect(await rewardDistributor.owner()).is.equal(owner.address)
      expect(await rewardDistributor.hasRole(adminRole, owner.address)).is.equal(true)
      expect(await rewardDistributor.rewardToken()).is.equal(address1)
      expect(await rewardDistributor.tokensPerInterval()).is.equal(10)
    })

    it('Should revert if initialize is called a second time', async () => {
      await expect(rewardDistributor.initialize(owner.address, address1, 10)).to.be.revertedWith(
        'Initializable: contract is already initialized',
      )
    })
  })

  describe('updateLastDistributionTime', () => {
    it('Should set last distribution time', async () => {
      timestamp = (await getLatestBlockTimestamp()) + 1500

      await setNextBlockTimestampAndMine(timestamp)

      await rewardDistributor.connect(owner).updateLastDistributionTime()

      expect(await rewardDistributor.lastDistributionTime()).gte(timestamp)
      expect(await rewardDistributor.lastDistributionTime()).lt(timestamp + 1000)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(rewardDistributor.connect(alice).updateLastDistributionTime()).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setTokensPerInterval', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(rewardDistributor.connect(alice).setTokensPerInterval(500)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setRewardTracker', () => {
    it('Should set reward tracker', async () => {
      await rewardDistributor.connect(owner).setRewardTracker(address2)

      expect(await rewardDistributor.rewardTracker()).is.equal(address2)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(rewardDistributor.connect(alice).setRewardTracker(address2)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('distribute', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(rewardDistributor.connect(alice).distribute()).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
      )
    })
  })

  describe('withdrawToken', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(rewardDistributor.connect(alice).withdrawToken(address1, address2, 10)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })
})
