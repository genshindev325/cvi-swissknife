import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { AddressZero } from '@ethersproject/constants'
import { adminRole, getAccessControlRevertStr, TestHelper } from '../utils'
import type { Vester } from '../../../auto-generated-code/src/git-contract-types'
import { address1, address2, expect } from '@coti-cvi/contracts-il/test/utils'

describe('Vester', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress

  let vester: Vester
  let operatorRole: string

  before(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, alice } = await helper.getNamedSigners())
  })

  beforeEach(async () => {
    vester = await helper.deployProxy(
      'Vester',
      {},
      owner.address,
      '',
      '',
      0,
      AddressZero,
      AddressZero,
      AddressZero,
      AddressZero,
    )

    operatorRole = await vester.OPERATOR_ROLE()
  })

  describe('initialize', () => {
    it('Should revert if initialize is called a second time', async () => {
      await expect(
        vester.initialize(owner.address, '', '', 0, AddressZero, AddressZero, AddressZero, AddressZero),
      ).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('depositForAccount', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).depositForAccount(address1, 1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
      )
    })
  })

  describe('claimForAccount', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).claimForAccount(address1, address2)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
      )
    })
  })

  describe('setHasMaxVestableAmount', () => {
    it('Should set max vestable amount', async () => {
      expect(await vester.hasMaxVestableAmount()).is.equal(false)

      await vester.connect(owner).setHasMaxVestableAmount(true)

      expect(await vester.hasMaxVestableAmount()).is.equal(true)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setHasMaxVestableAmount(true)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setPairToken', () => {
    it('Should set pair token', async () => {
      expect(await vester.pairToken()).is.equal(AddressZero)

      await vester.connect(owner).setPairToken(address1)

      expect(await vester.pairToken()).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setPairToken(address1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setRewardTracker', () => {
    it('Should set reward tracker', async () => {
      expect(await vester.rewardTracker()).is.equal(AddressZero)

      await vester.connect(owner).setRewardTracker(address1)

      expect(await vester.rewardTracker()).is.equal(address1)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setRewardTracker(address1)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setTransferredAverageStakedAmounts', () => {
    it('Should set transferred average staked amounts', async () => {
      expect(await vester.transferredAverageStakedAmounts(address1)).is.equal(0)

      await vester.connect(owner).setTransferredAverageStakedAmounts(address1, 5)

      expect(await vester.transferredAverageStakedAmounts(address1)).is.equal(5)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setTransferredAverageStakedAmounts(address1, 5)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setCumulativeRewardDeductions', () => {
    it('Should set cumulative reward deductions', async () => {
      expect(await vester.cumulativeRewardDeductions(address1)).is.equal(0)

      await vester.connect(owner).setCumulativeRewardDeductions(address1, 4)

      expect(await vester.cumulativeRewardDeductions(address1)).is.equal(4)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setCumulativeRewardDeductions(address1, 4)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('setBonusRewards', () => {
    it('Should set bonus rewards', async () => {
      expect(await vester.bonusRewards(address1)).is.equal(0)

      await vester.connect(owner).setBonusRewards(address1, 10)

      expect(await vester.bonusRewards(address1)).is.equal(10)
    })

    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).setBonusRewards(address1, 10)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('withdrawToken', () => {
    it('Should revert on invalid permissions', async () => {
      await expect(vester.connect(alice).withdrawToken(address1, address2, 10)).to.be.revertedWith(
        getAccessControlRevertStr(alice.address.toLowerCase(), adminRole),
      )
    })
  })

  describe('transfer', () => {
    it('Should revert', async () => {
      await expect(vester.transfer(address1, 10)).to.be.revertedWith('Vester: non-transferrable')
    })
  })

  describe('approve', () => {
    it('Should revert', async () => {
      it('Should revert', async () => {
        await expect(vester.approve(address1, 10)).to.be.revertedWith('Vester: non-transferrable')
      })
    })
  })

  describe('transferFrom', () => {
    it('Should revert', async () => {
      it('Should revert', async () => {
        await expect(vester.transferFrom(address1, address2, 10)).to.be.revertedWith('Vester: non-transferrable')
      })
    })
  })
})
