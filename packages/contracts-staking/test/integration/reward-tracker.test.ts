import { fromNumber } from '@coti-cvi/lw-sdk/src'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import type {
  EsGOVI,
  FakeGOVI,
  GOVIRewardTracker,
  GOVIRewardTrackerDistributor,
  GOVIVester,
  RewardRouter,
} from '../../../auto-generated-code/src/git-contract-types'
import {
  getLatestBlockTimestamp,
  runContractsFixtures,
  setNextBlockTimestampAndMine,
  TestHelper,
  expect,
  distributorInitialAmount,
  getAccessControlRevertStr,
  adminRole,
  secondsPerDay,
  tokensPerInterval,
} from '../utils'

describe('Reward Tracker tests', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let mallory: SignerWithAddress
  let deployer: SignerWithAddress

  let operatorRole: string

  let esGovi: EsGOVI
  let govi: FakeGOVI
  let goviTrackerRewardDist: GOVIRewardTrackerDistributor
  let goviRewardTracker: GOVIRewardTracker
  let goviVester: GOVIVester
  let rewardRouter: RewardRouter

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, alice, bob, deployer, mallory } = await helper.getNamedSigners())
    ;({ esGovi, govi, goviTrackerRewardDist, goviRewardTracker, rewardRouter, goviVester } =
      await runContractsFixtures())

    operatorRole = await goviRewardTracker.OPERATOR_ROLE()
  })

  it('Initialization', async () => {
    expect(await goviRewardTracker.owner()).is.equal(owner.address)
    expect(await goviRewardTracker.hasRole(adminRole, owner.address))
    expect(await goviRewardTracker.hasRole(operatorRole, rewardRouter.address))
    expect(await goviRewardTracker.hasRole(operatorRole, goviVester.address))
    expect(await goviRewardTracker.name()).is.equal('Staked GOVI')
    expect(await goviRewardTracker.symbol()).is.equal('stGOVI')
    expect(await goviRewardTracker.isDepositToken(owner.address)).is.equal(false)
    expect(await goviRewardTracker.isDepositToken(govi.address)).is.equal(true)
    expect(await goviRewardTracker.isDepositToken(esGovi.address)).is.equal(true)
    expect(await goviRewardTracker.distributor()).is.equal(goviTrackerRewardDist.address)
    expect(await goviRewardTracker.rewardToken()).is.equal(esGovi.address)
    expect(await goviRewardTracker.inPrivateTransferMode()).is.equal(true)
    expect(await goviRewardTracker.inPrivateStakingMode()).is.equal(true)
    expect(await goviRewardTracker.inPrivateClaimingMode()).is.equal(false)
  })

  it('stake, unstake, claim', async () => {
    await govi.mint(alice.address, fromNumber(1000, 18))

    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    // Private staking mode is enabled by default
    await expect(goviRewardTracker.connect(alice).stake(govi.address, fromNumber(1000, 18))).to.be.revertedWith(
      'RewardTracker: action not enabled',
    )

    await goviRewardTracker.connect(owner).setInPrivateStakingMode(false)

    await expect(goviRewardTracker.connect(alice).stake(alice.address, 0)).to.be.revertedWith(
      'RewardTracker: invalid _amount',
    )

    await expect(goviRewardTracker.connect(alice).stake(bob.address, fromNumber(1000, 18))).to.be.revertedWith(
      'RewardTracker: invalid _depositToken',
    )

    await expect(goviRewardTracker.connect(alice).stake(govi.address, fromNumber(1000, 18))).to.be.revertedWith(
      'ERC20: insufficient allowance',
    )

    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(1000, 18))
    await goviRewardTracker.connect(alice).stake(govi.address, fromNumber(1000, 18))
    expect(await goviRewardTracker.stakedAmounts(alice.address)).is.is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).is.is.equal(fromNumber(1000, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).above(fromNumber(1785, 18)) // currAmountOfRewardsPerSec * secondsIn24Hours
    expect(await goviRewardTracker.claimable(alice.address)).below(fromNumber(1786, 18))

    await esGovi.connect(owner).mint(bob.address, fromNumber(500, 18))
    await esGovi.connect(bob).approve(goviRewardTracker.address, fromNumber(500, 18))
    await goviRewardTracker.connect(bob).stake(esGovi.address, fromNumber(500, 18))

    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(0, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).is.equal(fromNumber(500, 18))

    expect(await goviRewardTracker.totalDepositSupply(govi.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.totalDepositSupply(esGovi.address)).is.equal(fromNumber(500, 18))

    expect(await goviRewardTracker.averageStakedAmounts(alice.address)).is.equal(0)
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).is.equal(0)
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).is.equal(0)
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1786 + 1191, 18))

    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(595, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(596, 18))

    await goviRewardTracker.connect(owner).setInPrivateStakingMode(true)

    await expect(goviRewardTracker.connect(alice).unstake(esGovi.address, fromNumber(1001, 18))).to.be.revertedWith(
      'RewardTracker: action not enabled',
    )

    await goviRewardTracker.connect(owner).setInPrivateStakingMode(false)

    await expect(goviRewardTracker.connect(alice).unstake(esGovi.address, 0)).to.be.revertedWith(
      'RewardTracker: invalid _amount',
    )

    await expect(goviRewardTracker.connect(alice).unstake(owner.address, fromNumber(1001, 18))).to.be.revertedWith(
      'RewardTracker: invalid _depositToken',
    )

    await expect(goviRewardTracker.connect(alice).unstake(esGovi.address, fromNumber(1000, 18))).to.be.revertedWith(
      'RewardTracker: _amount exceeds depositBalance',
    )

    await expect(goviRewardTracker.connect(alice).unstake(govi.address, fromNumber(1001, 18))).to.be.revertedWith(
      'RewardTracker: _amount exceeds stakedAmount',
    )

    expect(await govi.balanceOf(alice.address)).is.equal(0)
    await goviRewardTracker.connect(alice).unstake(govi.address, fromNumber(1000, 18))
    expect(await govi.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.totalDepositSupply(govi.address)).is.equal(0)
    expect(await goviRewardTracker.totalDepositSupply(esGovi.address)).is.equal(fromNumber(500, 18))

    expect(await goviRewardTracker.averageStakedAmounts(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).lt(fromNumber(1786 + 1191, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).is.equal(0)
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).is.equal(0)

    await expect(goviRewardTracker.connect(alice).unstake(govi.address, 1)).to.be.revertedWith(
      'RewardTracker: _amount exceeds stakedAmount',
    )

    await goviRewardTracker.connect(owner).setInPrivateClaimingMode(true)

    await expect(goviRewardTracker.connect(alice).claim(deployer.address)).to.be.revertedWith(
      'RewardTracker: action not enabled',
    )

    await goviRewardTracker.connect(owner).setInPrivateClaimingMode(false)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    await goviRewardTracker.connect(alice).claim(deployer.address)
    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(1786 + 1191, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).is.equal(0)

    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(595 + 1785, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(596 + 1786, 18))

    await govi.mint(bob.address, fromNumber(300, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(300, 18))
    await goviRewardTracker.connect(bob).stake(govi.address, fromNumber(300, 18))
    expect(await goviRewardTracker.totalDepositSupply(govi.address)).is.equal(fromNumber(300, 18))
    expect(await goviRewardTracker.totalDepositSupply(esGovi.address)).is.equal(fromNumber(500, 18))

    expect(await goviRewardTracker.averageStakedAmounts(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).lt(fromNumber(1786 + 1191, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).gt(fromNumber(595 + 1785, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).lt(fromNumber(596 + 1786, 18))

    await expect(goviRewardTracker.connect(bob).unstake(govi.address, fromNumber(301, 18))).to.be.revertedWith(
      'RewardTracker: _amount exceeds depositBalance',
    )

    await expect(goviRewardTracker.connect(bob).unstake(esGovi.address, fromNumber(501, 18))).to.be.revertedWith(
      'RewardTracker: _amount exceeds depositBalance',
    )

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + 2 * secondsPerDay)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await goviRewardTracker.averageStakedAmounts(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).lt(fromNumber(1786 + 1191, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).gt(fromNumber(679, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).lt(fromNumber(681, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).gt(fromNumber(595 + 1785 + 1785 * 2, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).lt(fromNumber(596 + 1786 + 1786 * 2, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + 2 * secondsPerDay)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await goviRewardTracker.averageStakedAmounts(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.cumulativeRewards(alice.address)).lt(fromNumber(1786 + 1191, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).gt(fromNumber(724, 18))
    expect(await goviRewardTracker.averageStakedAmounts(bob.address)).lt(fromNumber(726, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).gt(fromNumber(595 + 1785 + 1785 * 4, 18))
    expect(await goviRewardTracker.cumulativeRewards(bob.address)).lt(fromNumber(596 + 1786 + 1786 * 4, 18))

    expect(await esGovi.balanceOf(deployer.address)).is.equal(await goviRewardTracker.cumulativeRewards(alice.address))
    expect(await esGovi.balanceOf(owner.address)).is.equal(await goviRewardTracker.cumulativeRewards(bob.address))

    expect(await govi.balanceOf(bob.address)).is.equal(0)
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    await goviRewardTracker.connect(bob).unstake(govi.address, fromNumber(300, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(300, 18))
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    await goviRewardTracker.connect(bob).unstake(esGovi.address, fromNumber(500, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(300, 18))
    expect(await esGovi.balanceOf(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.totalDepositSupply(govi.address)).is.equal(0)
    expect(await goviRewardTracker.totalDepositSupply(esGovi.address)).is.equal(0)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    const distributed = distributorInitialAmount.sub(await esGovi.balanceOf(goviTrackerRewardDist.address))
    const cumulativeReward0 = await goviRewardTracker.cumulativeRewards(alice.address)
    const cumulativeReward1 = await goviRewardTracker.cumulativeRewards(bob.address)
    const totalCumulativeReward = cumulativeReward0.add(cumulativeReward1)

    expect(distributed).gt(totalCumulativeReward.sub(fromNumber(1, 18)))
    expect(distributed).lt(totalCumulativeReward.add(fromNumber(1, 18)))
  })

  it('stakeForAccount, unstakeForAccount, claimForAccount', async () => {
    const deployerAccessControlRevertMsg = getAccessControlRevertStr(deployer.address.toLowerCase(), operatorRole)

    await govi.mint(mallory.address, fromNumber(1000, 18))

    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    await goviRewardTracker.connect(owner).setInPrivateStakingMode(true)
    await expect(goviRewardTracker.connect(alice).stake(govi.address, fromNumber(1000, 18))).to.be.revertedWith(
      'RewardTracker: action not enabled',
    )

    await expect(
      goviRewardTracker
        .connect(deployer)
        .stakeForAccount(mallory.address, alice.address, govi.address, fromNumber(1000, 18)),
    ).to.be.revertedWith(deployerAccessControlRevertMsg)

    await goviRewardTracker.connect(owner).grantRole(operatorRole, deployer.address)

    await expect(
      goviRewardTracker
        .connect(deployer)
        .stakeForAccount(mallory.address, alice.address, govi.address, fromNumber(1000, 18)),
    ).to.be.revertedWith('ERC20: insufficient allowance')

    await govi.connect(mallory).approve(goviRewardTracker.address, fromNumber(1000, 18))

    await goviRewardTracker
      .connect(deployer)
      .stakeForAccount(mallory.address, alice.address, govi.address, fromNumber(1000, 18))
    expect(await goviRewardTracker.stakedAmounts(alice.address)).eq(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).eq(fromNumber(1000, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1785, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1786, 18))

    await goviRewardTracker.connect(owner).revokeRole(operatorRole, deployer.address)
    await expect(
      goviRewardTracker
        .connect(deployer)
        .unstakeForAccount(alice.address, esGovi.address, fromNumber(1000, 18), bob.address),
    ).to.be.revertedWith(deployerAccessControlRevertMsg)

    await goviRewardTracker.connect(owner).grantRole(operatorRole, deployer.address)

    await expect(
      goviRewardTracker
        .connect(deployer)
        .unstakeForAccount(alice.address, esGovi.address, fromNumber(1000, 18), bob.address),
    ).to.be.revertedWith('RewardTracker: _amount exceeds depositBalance')

    await expect(
      goviRewardTracker
        .connect(deployer)
        .unstakeForAccount(alice.address, govi.address, fromNumber(1001, 18), bob.address),
    ).to.be.revertedWith('RewardTracker: _amount exceeds stakedAmount')

    expect(await govi.balanceOf(alice.address)).eq(0)
    expect(await goviRewardTracker.stakedAmounts(alice.address)).eq(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).eq(fromNumber(1000, 18))

    expect(await goviRewardTracker.balanceOf(alice.address)).eq(fromNumber(1000, 18))
    await goviRewardTracker.connect(owner).setInPrivateTransferMode(false)
    await goviRewardTracker.connect(alice).transfer(bob.address, fromNumber(50, 18))
    expect(await goviRewardTracker.balanceOf(alice.address)).eq(fromNumber(950, 18))
    expect(await goviRewardTracker.balanceOf(bob.address)).eq(fromNumber(50, 18))

    await goviRewardTracker.connect(owner).setInPrivateTransferMode(true)
    await expect(goviRewardTracker.connect(alice).transfer(bob.address, fromNumber(50, 18))).to.be.revertedWith(
      getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole),
    )

    await goviRewardTracker.connect(owner).revokeRole(operatorRole, deployer.address)
    await expect(
      goviRewardTracker.connect(deployer).transferFrom(bob.address, alice.address, fromNumber(50, 18)),
    ).to.be.revertedWith('RewardTracker: transfer amount exceeds allowance')

    await goviRewardTracker.connect(owner).grantRole(operatorRole, deployer.address)
    await goviRewardTracker.connect(deployer).transferFrom(bob.address, alice.address, fromNumber(50, 18))
    expect(await goviRewardTracker.balanceOf(alice.address)).eq(fromNumber(1000, 18))
    expect(await goviRewardTracker.balanceOf(bob.address)).eq(0)

    await goviRewardTracker
      .connect(deployer)
      .unstakeForAccount(alice.address, govi.address, fromNumber(100, 18), bob.address)

    expect(await govi.balanceOf(bob.address)).eq(fromNumber(100, 18))
    expect(await goviRewardTracker.stakedAmounts(alice.address)).eq(fromNumber(900, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).eq(fromNumber(900, 18))

    await expect(goviRewardTracker.connect(owner).claimForAccount(alice.address, owner.address)).to.be.revertedWith(
      getAccessControlRevertStr(owner.address.toLowerCase(), operatorRole),
    )

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1785, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1787, 18))
    expect(await esGovi.balanceOf(alice.address)).eq(0)
    expect(await esGovi.balanceOf(owner.address)).eq(0)

    await goviRewardTracker.connect(deployer).claimForAccount(alice.address, owner.address)

    expect(await goviRewardTracker.claimable(alice.address)).eq(0)
    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(1785, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(1787, 18))
  })
})
