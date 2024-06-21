import { fromNumber, StakedTokenName } from '@coti-cvi/lw-sdk/src'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import type {
  EsGOVI,
  FakeCVIUSDCThetaVault,
  FakeGOVI,
  GOVIRewardTracker,
  GOVIRewardTrackerDistributor,
  GOVIVester,
  RewardRouter,
  ThetaVaultRewardTracker,
  ThetaVaultRewardTrackerDistributor,
  ThetaVaultVester,
} from '../../../auto-generated-code/src/git-contract-types'
import {
  runContractsFixtures,
  TestHelper,
  expect,
  getAccessControlRevertStr,
  setNextBlockTimestampAndMine,
  getLatestBlockTimestamp,
  secondsPerDay,
  tokensPerInterval,
  adminRole,
} from '../utils'

describe('Reward router tests', () => {
  let helper: TestHelper
  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let mallory: SignerWithAddress
  let deployer: SignerWithAddress

  let operatorRole: string

  let esGovi: EsGOVI
  let govi: FakeGOVI
  let thetaVault: FakeCVIUSDCThetaVault
  let goviTrackerRewardDist: GOVIRewardTrackerDistributor
  let thetaVaultTrackerRewardDist: ThetaVaultRewardTrackerDistributor
  let goviRewardTracker: GOVIRewardTracker
  let thetaVaultRewardTracker: ThetaVaultRewardTracker
  let goviVester: GOVIVester
  let thetaVaultVester: ThetaVaultVester
  let rewardRouter: RewardRouter

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, alice, bob, deployer, mallory } = await helper.getNamedSigners())
    ;({
      esGovi,
      govi,
      thetaVault,
      goviTrackerRewardDist,
      thetaVaultTrackerRewardDist,
      goviRewardTracker,
      thetaVaultRewardTracker,
      goviVester,
      thetaVaultVester,
      rewardRouter,
    } = await runContractsFixtures())

    operatorRole = await goviRewardTracker.OPERATOR_ROLE()
  })

  it('Initialization', async () => {
    expect(await rewardRouter.owner()).is.equal(owner.address)
    expect(await rewardRouter.hasRole(adminRole, owner.address))

    expect(await rewardRouter.tokens(StakedTokenName.THETA_VAULT)).is.equal(thetaVault.address)
    expect(await rewardRouter.tokens(StakedTokenName.ES_GOVI)).is.equal(esGovi.address)
    expect(await rewardRouter.tokens(StakedTokenName.GOVI)).is.equal(govi.address)

    expect(await rewardRouter.rewardTrackers(StakedTokenName.THETA_VAULT)).is.equal(thetaVaultRewardTracker.address)
    expect(await rewardRouter.rewardTrackers(StakedTokenName.ES_GOVI)).is.equal(goviRewardTracker.address)
    expect(await rewardRouter.rewardTrackers(StakedTokenName.GOVI)).is.equal(goviRewardTracker.address)

    expect(await rewardRouter.vesters(StakedTokenName.THETA_VAULT)).is.equal(thetaVaultVester.address)
    expect(await rewardRouter.vesters(StakedTokenName.ES_GOVI)).is.equal(goviVester.address)
    expect(await rewardRouter.vesters(StakedTokenName.GOVI)).is.equal(goviVester.address)
  })

  it('stakeForAccount(GOVI), stake(GOVI), stake(esGOVI), unstake(GOVI), unstake(esGOVI), claim(esGOVI), compound, batchCompoundForAccounts', async () => {
    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    await govi.mint(alice.address, fromNumber(1500, 18))

    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(1000, 18))
    await expect(
      rewardRouter.connect(alice).stakeForAccount(StakedTokenName.GOVI, bob.address, fromNumber(1000, 18)),
    ).to.be.revertedWith(getAccessControlRevertStr(alice.address.toLowerCase(), operatorRole))

    await rewardRouter.connect(owner).grantRole(operatorRole, alice.address)
    await rewardRouter.connect(alice).stakeForAccount(StakedTokenName.GOVI, bob.address, fromNumber(800, 18))
    expect(await govi.balanceOf(alice.address)).is.equal(fromNumber(700, 18))

    await govi.mint(bob.address, fromNumber(200, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(200, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.GOVI, fromNumber(200, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(0)

    expect(await goviRewardTracker.stakedAmounts(alice.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(1000, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).is.equal(0)
    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(1785, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(1786, 18))

    await esGovi.connect(owner).mint(deployer.address, fromNumber(500, 18))
    await rewardRouter.connect(deployer).stake(StakedTokenName.ES_GOVI, fromNumber(500, 18))

    expect(await goviRewardTracker.stakedAmounts(alice.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.stakedAmounts(deployer.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).is.equal(fromNumber(500, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).is.equal(0)
    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(1786 + 1191, 18))
    expect(await goviRewardTracker.claimable(deployer.address)).gt(fromNumber(595, 18))
    expect(await goviRewardTracker.claimable(deployer.address)).lt(fromNumber(596, 18))

    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    await rewardRouter.connect(bob).claim(StakedTokenName.ES_GOVI)
    expect(await esGovi.balanceOf(bob.address)).gt(fromNumber(1785 + 1190, 18))
    expect(await esGovi.balanceOf(bob.address)).lt(fromNumber(1786 + 1191, 18))

    expect(await esGovi.balanceOf(deployer.address)).is.equal(0)
    await rewardRouter.connect(deployer).claim(StakedTokenName.ES_GOVI)
    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(595, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(596, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await rewardRouter.connect(bob).compound(StakedTokenName.GOVI)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await rewardRouter.connect(alice).batchCompoundForAccounts([bob.address, deployer.address], StakedTokenName.GOVI)

    expect(await goviRewardTracker.stakedAmounts(bob.address)).gt(fromNumber(3643, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).lt(fromNumber(3645, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(1000, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).gt(fromNumber(2643, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).lt(fromNumber(2645, 18))

    expect(await govi.balanceOf(bob.address)).is.equal(0)
    await rewardRouter.connect(bob).unstake(StakedTokenName.GOVI, fromNumber(300, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(300, 18))

    expect(await goviRewardTracker.stakedAmounts(bob.address)).gt(fromNumber(3343, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).lt(fromNumber(3345, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(700, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).gt(fromNumber(2643, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).lt(fromNumber(2645, 18))

    const esGmxBalance1 = await esGovi.balanceOf(bob.address)
    const esGmxUnstakeBalance1 = await goviRewardTracker.depositBalances(bob.address, esGovi.address)
    await rewardRouter.connect(bob).unstake(StakedTokenName.ES_GOVI, esGmxUnstakeBalance1)
    expect(await esGovi.balanceOf(bob.address)).is.equal(esGmxBalance1.add(esGmxUnstakeBalance1))

    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(700, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(700, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).is.equal(0)

    await expect(rewardRouter.connect(bob).unstake(StakedTokenName.ES_GOVI, fromNumber(1, 18))).to.be.revertedWith(
      'RewardTracker: _amount exceeds depositBalance',
    )
  })

  it('stake(ThetaVault), unstake(ThetaVault), compound, batchCompoundForAccounts', async () => {
    await thetaVaultTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    await thetaVault.mint(bob.address, fromNumber(1000, 18))
    expect(await thetaVault.balanceOf(bob.address)).is.equal(fromNumber(1000, 18))
    await thetaVault.connect(bob).approve(thetaVaultRewardTracker.address, fromNumber(1000, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.THETA_VAULT, fromNumber(1000, 18))
    expect(await thetaVault.balanceOf(bob.address)).is.equal(0)

    expect(await thetaVaultRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(1000, 18))
    expect(await thetaVaultRewardTracker.depositBalances(bob.address, thetaVault.address)).is.equal(
      fromNumber(1000, 18),
    )

    expect(await thetaVaultRewardTracker.claimable(bob.address)).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await thetaVaultRewardTracker.claimable(bob.address)).gt(fromNumber(1785, 18))
    expect(await thetaVaultRewardTracker.claimable(bob.address)).lt(fromNumber(1786, 18))

    await rewardRouter.connect(bob).unstake(StakedTokenName.THETA_VAULT, fromNumber(500, 18))
    expect(await thetaVault.balanceOf(bob.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.claimable(bob.address)).gt(fromNumber(1785, 18))
    expect(await thetaVaultRewardTracker.claimable(bob.address)).lt(fromNumber(1786, 18))

    expect(await thetaVault.balanceOf(deployer.address)).is.equal(0)
    await thetaVault.mint(deployer.address, fromNumber(500, 18))
    expect(await thetaVault.balanceOf(deployer.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.stakedAmounts(deployer.address)).is.equal(0)

    await thetaVault.connect(deployer).approve(thetaVaultRewardTracker.address, fromNumber(500, 18))
    await rewardRouter.connect(deployer).stake(StakedTokenName.THETA_VAULT, fromNumber(500, 18))
    expect(await thetaVault.balanceOf(deployer.address)).is.equal(0)
    expect(await thetaVaultRewardTracker.stakedAmounts(deployer.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.claimable(deployer.address)).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await thetaVaultRewardTracker.claimable(bob.address)).gt(fromNumber(1785 + 893, 18))
    expect(await thetaVaultRewardTracker.claimable(bob.address)).lt(fromNumber(1786 + 894, 18))
    expect(await thetaVaultRewardTracker.claimable(deployer.address)).gt(fromNumber(892, 18))
    expect(await thetaVaultRewardTracker.claimable(deployer.address)).lt(fromNumber(893, 18))

    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    await rewardRouter.connect(bob).claim(StakedTokenName.THETA_VAULT)
    expect(await esGovi.balanceOf(bob.address)).gt(fromNumber(1785 + 893, 18))
    expect(await esGovi.balanceOf(bob.address)).lt(fromNumber(1786 + 894, 18))
    expect(await thetaVaultRewardTracker.claimable(bob.address)).is.equal(0)
    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(0)

    expect(await esGovi.balanceOf(deployer.address)).is.equal(0)
    await rewardRouter.connect(deployer).claim(StakedTokenName.THETA_VAULT)
    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(892, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(893, 18))
    expect(await thetaVaultRewardTracker.claimable(deployer.address)).is.equal(0)
    expect(await goviRewardTracker.stakedAmounts(deployer.address)).is.equal(0)

    await rewardRouter.connect(bob).compound(StakedTokenName.THETA_VAULT)

    expect(await thetaVaultRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).gt(fromNumber(2066, 13))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).lt(fromNumber(2067, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).gt(fromNumber(2066, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).lt(fromNumber(2067, 13))

    expect(await goviRewardTracker.stakedAmounts(deployer.address)).is.equal(0)

    await rewardRouter.connect(owner).grantRole(operatorRole, alice.address)

    await rewardRouter.connect(alice).compoundForAccount(bob.address, StakedTokenName.THETA_VAULT)

    expect(await thetaVaultRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).gt(fromNumber(4133, 13))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).lt(fromNumber(4134, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).gt(fromNumber(4133, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).lt(fromNumber(4134, 13))

    await rewardRouter
      .connect(alice)
      .batchCompoundForAccounts([bob.address, deployer.address], StakedTokenName.THETA_VAULT)

    expect(await thetaVaultRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).gt(fromNumber(5166, 13))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).lt(fromNumber(5167, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).gt(fromNumber(5166, 13))
    expect(await goviRewardTracker.depositBalances(bob.address, esGovi.address)).lt(fromNumber(5167, 13))

    expect(await thetaVaultRewardTracker.stakedAmounts(deployer.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(deployer.address)).gt(fromNumber(4133, 13))
    expect(await goviRewardTracker.stakedAmounts(deployer.address)).lt(fromNumber(4134, 13))
    expect(await goviRewardTracker.depositBalances(deployer.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).gt(fromNumber(4133, 13))
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).lt(fromNumber(4134, 13))
  })

  it('batchStakeForAccount', async () => {
    await govi.mint(alice.address, fromNumber(700, 18))

    expect(await govi.balanceOf(alice.address)).is.equal(fromNumber(700, 18))

    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(700, 18))

    await rewardRouter.connect(owner).grantRole(operatorRole, alice.address)

    await rewardRouter
      .connect(alice)
      .batchStakeForAccount(
        StakedTokenName.GOVI,
        [alice.address, bob.address],
        [fromNumber(500, 18), fromNumber(200, 18)],
      )

    expect(await govi.balanceOf(alice.address)).is.equal(0)

    expect(await goviRewardTracker.stakedAmounts(alice.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.depositBalances(alice.address, govi.address)).is.equal(fromNumber(500, 18))
    expect(await goviRewardTracker.stakedAmounts(bob.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(bob.address, govi.address)).is.equal(fromNumber(200, 18))
  })

  it('govi: signalTransfer, acceptTransfer', async () => {
    await thetaVaultTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    await govi.mint(bob.address, fromNumber(200, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(200, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(200, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.GOVI, fromNumber(200, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(0)

    await govi.mint(deployer.address, fromNumber(200, 18))
    expect(await govi.balanceOf(deployer.address)).is.equal(fromNumber(200, 18))
    await govi.connect(deployer).approve(goviRewardTracker.address, fromNumber(400, 18))
    await rewardRouter.connect(deployer).stake(StakedTokenName.GOVI, fromNumber(200, 18))
    expect(await govi.balanceOf(deployer.address)).is.equal(0)

    await rewardRouter.connect(deployer).signalTransfer(bob.address)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await rewardRouter.connect(deployer).signalTransfer(bob.address)
    await rewardRouter.connect(bob).claim(StakedTokenName.GOVI)

    await expect(rewardRouter.connect(deployer).signalTransfer(bob.address)).to.be.revertedWith(
      'RewardRouter: rewardTracker.averageStakedAmounts > 0',
    )

    await rewardRouter.connect(deployer).signalTransfer(owner.address)

    await expect(rewardRouter.connect(owner).acceptTransfer(bob.address)).to.be.revertedWith(
      'RewardRouter: transfer not signaled',
    )

    await goviVester.connect(owner).setBonusRewards(deployer.address, fromNumber(100, 18))

    expect(await goviRewardTracker.depositBalances(deployer.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).is.equal(0)
    expect(await goviVester.transferredAverageStakedAmounts(owner.address)).is.equal(0)
    expect(await goviVester.transferredCumulativeRewards(owner.address)).is.equal(0)
    expect(await goviVester.bonusRewards(deployer.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.bonusRewards(owner.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)
    expect(await goviRewardTracker.claimable(deployer.address)).gt(fromNumber(826, 18))
    expect(await goviRewardTracker.claimable(deployer.address)).lt(fromNumber(827, 18))
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(826, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(826, 18))).is.equal(0)

    await rewardRouter.connect(owner).acceptTransfer(deployer.address)

    expect(await goviRewardTracker.depositBalances(deployer.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.claimable(deployer.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).gt(fromNumber(826, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).lt(fromNumber(827, 18))
    expect(await goviVester.transferredAverageStakedAmounts(owner.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.transferredCumulativeRewards(owner.address)).gt(fromNumber(826, 18))
    expect(await goviVester.transferredCumulativeRewards(owner.address)).lt(fromNumber(827, 18))
    expect(await goviVester.bonusRewards(deployer.address)).is.equal(0)
    expect(await goviVester.bonusRewards(owner.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(deployer.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).gt(fromNumber(926, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).lt(fromNumber(927, 18))
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(926, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(926, 18))).gt(fromNumber(199, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(926, 18))).lt(fromNumber(200, 18))

    await govi.connect(owner).approve(goviRewardTracker.address, fromNumber(400, 18))
    await rewardRouter.connect(owner).signalTransfer(mallory.address)
    await rewardRouter.connect(mallory).acceptTransfer(owner.address)

    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.claimable(owner.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(mallory.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(mallory.address, esGovi.address)).gt(fromNumber(826, 18))
    expect(await goviRewardTracker.depositBalances(mallory.address, esGovi.address)).lt(fromNumber(827, 18))
    expect(await goviVester.transferredAverageStakedAmounts(mallory.address)).gt(fromNumber(200, 18))
    expect(await goviVester.transferredAverageStakedAmounts(mallory.address)).lt(fromNumber(201, 18))
    expect(await goviVester.transferredCumulativeRewards(mallory.address)).gt(fromNumber(826, 18))
    expect(await goviVester.transferredCumulativeRewards(mallory.address)).lt(fromNumber(828, 18))
    expect(await goviVester.bonusRewards(owner.address)).is.equal(0)
    expect(await goviVester.bonusRewards(mallory.address)).is.equal(fromNumber(100, 18))
    expect(await goviRewardTracker.averageStakedAmounts(owner.address)).gt(fromNumber(1026, 18))
    expect(await goviRewardTracker.averageStakedAmounts(owner.address)).lt(fromNumber(1027, 18))
    expect(await goviVester.transferredAverageStakedAmounts(owner.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).gt(fromNumber(1026, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).lt(fromNumber(1027, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(mallory.address)).gt(fromNumber(200, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(mallory.address)).lt(fromNumber(201, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(mallory.address)).gt(fromNumber(926, 18))
    expect(await goviVester.getMaxVestableAmount(mallory.address)).lt(fromNumber(927, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(926, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(mallory.address, fromNumber(926, 18))).gt(fromNumber(199, 18))
    expect(await goviVester.getPairAmount(mallory.address, fromNumber(926, 18))).lt(fromNumber(200, 18))

    await expect(rewardRouter.connect(mallory).acceptTransfer(owner.address)).to.be.revertedWith(
      'RewardRouter: transfer not signaled',
    )
  })

  it('govi, thetaVault: signalTransfer, acceptTransfer', async () => {
    await thetaVaultTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)
    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval)

    await govi.mint(goviVester.address, fromNumber(10000, 18))
    await govi.mint(thetaVaultVester.address, fromNumber(10000, 18))

    await govi.mint(bob.address, fromNumber(200, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(200, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(200, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.GOVI, fromNumber(200, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(0)

    await govi.mint(deployer.address, fromNumber(200, 18))
    expect(await govi.balanceOf(deployer.address)).is.equal(fromNumber(200, 18))
    await govi.connect(deployer).approve(goviRewardTracker.address, fromNumber(400, 18))
    await rewardRouter.connect(deployer).stake(StakedTokenName.GOVI, fromNumber(200, 18))
    expect(await govi.balanceOf(deployer.address)).is.equal(0)

    await rewardRouter.connect(deployer).signalTransfer(bob.address)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await rewardRouter.connect(deployer).signalTransfer(bob.address)

    await rewardRouter.connect(bob).compound(StakedTokenName.GOVI)

    await expect(rewardRouter.connect(deployer).signalTransfer(bob.address)).to.be.revertedWith(
      'RewardRouter: rewardTracker.averageStakedAmounts > 0',
    )

    await rewardRouter.connect(deployer).signalTransfer(owner.address)

    await expect(rewardRouter.connect(owner).acceptTransfer(bob.address)).to.be.revertedWith(
      'RewardRouter: transfer not signaled',
    )

    await goviVester.connect(owner).setBonusRewards(deployer.address, fromNumber(100, 18))

    expect(await goviRewardTracker.depositBalances(deployer.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).is.equal(0)

    expect(await goviVester.transferredAverageStakedAmounts(owner.address)).is.equal(0)
    expect(await goviVester.transferredCumulativeRewards(owner.address)).is.equal(0)
    expect(await goviVester.bonusRewards(deployer.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.bonusRewards(owner.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(892, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(892, 18))).is.equal(0)

    await rewardRouter.connect(owner).acceptTransfer(deployer.address)

    expect(await goviRewardTracker.depositBalances(deployer.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(deployer.address, esGovi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).gt(fromNumber(892, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).lt(fromNumber(893, 18))

    expect(await goviVester.transferredAverageStakedAmounts(owner.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.transferredCumulativeRewards(owner.address)).gt(fromNumber(892, 18))
    expect(await goviVester.transferredCumulativeRewards(owner.address)).lt(fromNumber(893, 18))
    expect(await goviVester.bonusRewards(deployer.address)).is.equal(0)
    expect(await goviVester.bonusRewards(owner.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(deployer.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).is.equal(fromNumber(200, 18))
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).gt(fromNumber(992, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).lt(fromNumber(993, 18))
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(992, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(992, 18))).gt(fromNumber(199, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(992, 18))).lt(fromNumber(200, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(892, 18))).gt(fromNumber(199, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(892, 18))).lt(fromNumber(200, 18))

    await rewardRouter.connect(bob).compound(StakedTokenName.GOVI)

    await expect(rewardRouter.connect(owner).acceptTransfer(bob.address)).to.be.revertedWith(
      'RewardRouter: transfer not signaled',
    )

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await rewardRouter.connect(bob).claim(StakedTokenName.GOVI)
    await rewardRouter.connect(deployer).claim(StakedTokenName.GOVI)
    await rewardRouter.connect(owner).claim(StakedTokenName.GOVI)

    expect(await goviVester.getCombinedAverageStakedAmount(bob.address)).gt(fromNumber(646, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(bob.address)).lt(fromNumber(647, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).gt(fromNumber(646, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).lt(fromNumber(647, 18))

    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).gt(fromNumber(1885, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).lt(fromNumber(1887, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(1785, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(1787, 18))

    expect(await goviVester.getPairAmount(deployer.address, fromNumber(992, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1885, 18))).gt(fromNumber(646, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1885, 18))).lt(fromNumber(647, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1785, 18))).gt(fromNumber(646, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1785, 18))).lt(fromNumber(647, 18))

    await rewardRouter.connect(bob).compound(StakedTokenName.GOVI)

    await rewardRouter.connect(owner).compound(StakedTokenName.GOVI)

    await goviVester.connect(bob).deposit(fromNumber(892, 18))

    await rewardRouter.connect(bob).unstake(StakedTokenName.GOVI, fromNumber(200, 18))
    await expect(rewardRouter.connect(bob).unstake(StakedTokenName.ES_GOVI, fromNumber(699, 18))).to.be.revertedWith(
      'RewardTracker: burn amount exceeds balance',
    )

    await rewardRouter.connect(bob).unstake(StakedTokenName.ES_GOVI, fromNumber(570, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await esGovi.balanceOf(bob.address)).gt(fromNumber(570, 18))
    expect(await esGovi.balanceOf(bob.address)).lt(fromNumber(571, 18))
    expect(await govi.balanceOf(bob.address)).is.equal(fromNumber(200, 18))

    await goviVester.connect(bob).withdraw()

    expect(await esGovi.balanceOf(bob.address)).gt(fromNumber(1460, 18))
    expect(await esGovi.balanceOf(bob.address)).lt(fromNumber(1461, 18))

    expect(await govi.balanceOf(bob.address)).gt(fromNumber(202, 18))
    expect(await govi.balanceOf(bob.address)).lt(fromNumber(203, 18))

    await thetaVault.mint(owner.address, fromNumber(500, 18))
    expect(await thetaVault.balanceOf(owner.address)).is.equal(fromNumber(500, 18))
    await thetaVault.connect(owner).approve(thetaVaultRewardTracker.address, fromNumber(500, 18))
    await rewardRouter.connect(owner).stake(StakedTokenName.THETA_VAULT, fromNumber(500, 18))
    expect(await thetaVault.balanceOf(owner.address)).is.equal(0)

    await thetaVault.mint(bob.address, fromNumber(200, 18))
    expect(await thetaVault.balanceOf(bob.address)).is.equal(fromNumber(200, 18))
    await thetaVault.connect(bob).approve(thetaVaultRewardTracker.address, fromNumber(200, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.THETA_VAULT, fromNumber(200, 18))
    expect(await thetaVault.balanceOf(bob.address)).is.equal(0)

    expect(await thetaVaultRewardTracker.balanceOf(owner.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.balanceOf(bob.address)).is.equal(fromNumber(200, 18))

    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(892, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(893, 18))
    expect(await govi.balanceOf(owner.address)).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await thetaVaultRewardTracker.claimable(owner.address)).gt(fromNumber(1275, 18))
    expect(await thetaVaultRewardTracker.claimable(owner.address)).lt(fromNumber(1276, 18))

    await thetaVaultRewardTracker.connect(owner).claim(owner.address)

    await thetaVaultVester.connect(owner).deposit(fromNumber(1275, 18))

    expect(await thetaVaultRewardTracker.balanceOf(owner.address)).gt(0)
    expect(await thetaVaultRewardTracker.balanceOf(owner.address)).lt(fromNumber(1, 18))

    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(892, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(894, 18))
    expect(await govi.balanceOf(owner.address)).is.equal(0)

    await expect(
      rewardRouter.connect(owner).unstake(StakedTokenName.THETA_VAULT, fromNumber(500, 18)),
    ).to.be.revertedWith('RewardTracker: burn amount exceeds balance')

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await thetaVaultVester.connect(owner).withdraw()

    expect(await govi.balanceOf(owner.address)).gt(fromNumber(3, 18))
    expect(await govi.balanceOf(owner.address)).lt(fromNumber(4, 18))

    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(1275 + 892 - 3, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(1276 + 894 - 2, 18))

    expect(await govi.balanceOf(mallory.address)).is.equal(0)
    expect(await esGovi.balanceOf(mallory.address)).is.equal(0)

    expect(await thetaVaultRewardTracker.balanceOf(owner.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.balanceOf(mallory.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).gt(fromNumber(892, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).lt(fromNumber(893, 18))
    expect(await goviRewardTracker.depositBalances(mallory.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(mallory.address, esGovi.address)).is.equal(0)

    expect(await goviVester.transferredAverageStakedAmounts(mallory.address)).is.equal(0)
    expect(await goviVester.transferredCumulativeRewards(mallory.address)).is.equal(0)
    expect(await goviVester.bonusRewards(owner.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.bonusRewards(mallory.address)).is.equal(0)
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).gt(fromNumber(646, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).lt(fromNumber(647, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(mallory.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).gt(fromNumber(1885, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).lt(fromNumber(1886, 18))
    expect(await goviVester.getMaxVestableAmount(mallory.address)).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1885, 18))).gt(fromNumber(646, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1885, 18))).lt(fromNumber(647, 18))
    expect(await goviVester.getPairAmount(mallory.address, fromNumber(1885, 18))).is.equal(0)

    expect(await thetaVaultVester.transferredAverageStakedAmounts(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.transferredCumulativeRewards(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.bonusRewards(owner.address)).is.equal(0)
    expect(await thetaVaultVester.bonusRewards(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(owner.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.getMaxVestableAmount(owner.address)).gt(fromNumber(1275, 18))
    expect(await thetaVaultVester.getMaxVestableAmount(owner.address)).lt(fromNumber(1276, 18))
    expect(await thetaVaultVester.getMaxVestableAmount(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.getPairAmount(owner.address, fromNumber(1275, 18))).gt(fromNumber(499, 18))
    expect(await thetaVaultVester.getPairAmount(owner.address, fromNumber(1275, 18))).lt(fromNumber(500, 18))
    expect(await thetaVaultVester.getPairAmount(mallory.address, fromNumber(1275, 18))).is.equal(0)

    await thetaVault.connect(owner).approve(thetaVaultRewardTracker.address, fromNumber(500, 18))
    await govi.connect(owner).approve(goviRewardTracker.address, fromNumber(200, 18))

    await rewardRouter.connect(owner).signalTransfer(mallory.address)
    await rewardRouter.connect(mallory).acceptTransfer(owner.address)

    expect(await govi.balanceOf(owner.address)).gt(fromNumber(3, 18))
    expect(await govi.balanceOf(owner.address)).lt(fromNumber(4, 18))

    expect(await esGovi.balanceOf(mallory.address)).gt(fromNumber(1275 + 892 - 3, 18))
    expect(await esGovi.balanceOf(mallory.address)).lt(fromNumber(1276 + 894 - 2, 18))
    expect(await esGovi.balanceOf(owner.address)).is.equal(0)

    expect(await thetaVaultRewardTracker.balanceOf(mallory.address)).is.equal(fromNumber(500, 18))
    expect(await thetaVaultRewardTracker.balanceOf(owner.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(mallory.address, govi.address)).is.equal(fromNumber(200, 18))
    expect(await goviRewardTracker.depositBalances(mallory.address, esGovi.address)).gt(fromNumber(6303, 18))
    expect(await goviRewardTracker.depositBalances(mallory.address, esGovi.address)).lt(fromNumber(6304, 18))
    expect(await goviRewardTracker.depositBalances(owner.address, govi.address)).is.equal(0)
    expect(await goviRewardTracker.depositBalances(owner.address, esGovi.address)).is.equal(0)

    expect(await goviVester.transferredAverageStakedAmounts(mallory.address)).gt(fromNumber(958, 18))
    expect(await goviVester.transferredAverageStakedAmounts(mallory.address)).lt(fromNumber(959, 18))
    expect(await goviVester.transferredCumulativeRewards(mallory.address)).gt(fromNumber(5920, 18))
    expect(await goviVester.transferredCumulativeRewards(mallory.address)).lt(fromNumber(5921, 18))
    expect(await goviVester.bonusRewards(owner.address)).is.equal(0)
    expect(await goviVester.bonusRewards(mallory.address)).is.equal(fromNumber(100, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).gt(fromNumber(1092, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(owner.address)).lt(fromNumber(1093, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(mallory.address)).gt(fromNumber(958, 18))
    expect(await goviVester.getCombinedAverageStakedAmount(mallory.address)).lt(fromNumber(959, 18))
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(mallory.address)).gt(fromNumber(6020, 18))
    expect(await goviVester.getMaxVestableAmount(mallory.address)).lt(fromNumber(6021, 18))
    expect(await goviVester.getPairAmount(owner.address, fromNumber(6020, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(mallory.address, fromNumber(6020, 18))).gt(fromNumber(958, 18))
    expect(await goviVester.getPairAmount(mallory.address, fromNumber(6020, 18))).lt(fromNumber(959, 18))

    expect(await thetaVaultVester.transferredAverageStakedAmounts(mallory.address)).gt(fromNumber(499, 18))
    expect(await thetaVaultVester.transferredAverageStakedAmounts(mallory.address)).lt(fromNumber(500, 18))
    expect(await thetaVaultVester.transferredCumulativeRewards(mallory.address)).gt(fromNumber(2551, 18))
    expect(await thetaVaultVester.transferredCumulativeRewards(mallory.address)).lt(fromNumber(2552, 18))
    expect(await thetaVaultVester.bonusRewards(owner.address)).is.equal(0)
    expect(await thetaVaultVester.bonusRewards(mallory.address)).is.equal(0)
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(owner.address)).gt(fromNumber(499, 18))
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(owner.address)).lt(fromNumber(500, 18))
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(mallory.address)).gt(fromNumber(499, 18))
    expect(await thetaVaultVester.getCombinedAverageStakedAmount(mallory.address)).lt(fromNumber(500, 18))
    expect(await thetaVaultVester.getMaxVestableAmount(owner.address)).is.equal(0)
    expect(await thetaVaultVester.getMaxVestableAmount(mallory.address)).gt(fromNumber(2551, 18))
    expect(await thetaVaultVester.getMaxVestableAmount(mallory.address)).lt(fromNumber(2552, 18))
    expect(await thetaVaultVester.getPairAmount(owner.address, fromNumber(2551, 18))).is.equal(0)
    expect(await thetaVaultVester.getPairAmount(mallory.address, fromNumber(2551, 18))).gt(fromNumber(499, 18))
    expect(await thetaVaultVester.getPairAmount(mallory.address, fromNumber(2551, 18))).lt(fromNumber(500, 18))
  })
})
