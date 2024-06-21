import { fromNumber, StakedTokenName } from '@coti-cvi/lw-sdk/src'
import { AddressZero } from '@ethersproject/constants'
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
  runContractsFixtures,
  TestHelper,
  expect,
  getLatestBlockTimestamp,
  secondsPerDay,
  setNextBlockTimestampAndMine,
  getAccessControlRevertStr,
  secondsPerYear,
  adminRole,
  tokensPerInterval,
} from '../utils'

describe('GOVI vester tests', () => {
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
  let rewardRouter: RewardRouter
  let goviVester: GOVIVester

  before(() => {
    helper = TestHelper.get(ethers)
  })

  beforeEach(async () => {
    ;({ owner, alice, bob, deployer, mallory } = await helper.getNamedSigners())
    ;({ esGovi, govi, goviVester, goviTrackerRewardDist, goviRewardTracker, rewardRouter } =
      await runContractsFixtures())

    operatorRole = await goviVester.OPERATOR_ROLE()
  })

  it('Initialize', async () => {
    expect(await goviVester.owner()).is.equal(owner.address)
    expect(await goviVester.hasRole(adminRole, owner.address))
    expect(await goviVester.hasRole(operatorRole, rewardRouter.address))
    expect(await goviVester.name()).is.equal('Vested GOVI')
    expect(await goviVester.symbol()).is.equal('veGOVI')
    expect(await goviVester.vestingDuration()).is.equal(secondsPerYear)
    expect(await goviVester.esToken()).is.equal(esGovi.address)
    expect(await goviVester.pairToken()).is.equal(goviRewardTracker.address)
    expect(await goviVester.claimableToken()).is.equal(govi.address)
    expect(await goviVester.rewardTracker()).is.equal(goviRewardTracker.address)
    expect(await goviVester.hasPairToken()).is.equal(true)
    expect(await goviVester.hasRewardTracker()).is.equal(true)
    expect(await goviVester.hasMaxVestableAmount()).is.equal(true)
  })

  it('deposit, claim, withdraw', async () => {
    await goviVester.connect(owner).setPairToken(AddressZero)
    await goviVester.connect(owner).setRewardTracker(AddressZero)
    await goviVester.connect(owner).setHasMaxVestableAmount(false)

    await expect(goviVester.connect(alice).deposit(0)).to.be.revertedWith('Vester: invalid _amount')

    await expect(goviVester.connect(alice).deposit(fromNumber(1000, 18))).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance',
    )

    expect(await goviVester.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.getTotalVested(alice.address)).is.equal(0)
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(0)

    await esGovi.connect(owner).mint(alice.address, fromNumber(1000, 18))
    await goviVester.connect(alice).deposit(fromNumber(1000, 18))

    let blockTime = await getLatestBlockTimestamp()

    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).gt('2730000000000000000') // 1000 / 365 => ~2.739
    expect(await goviVester.claimable(alice.address)).lt('2750000000000000000')
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await expect(goviVester.connect(alice).claim()).to.be.revertedWith('ERC20: transfer amount exceeds balance')

    await govi.mint(goviVester.address, fromNumber(2000, 18))

    await goviVester.connect(alice).claim()
    blockTime = await getLatestBlockTimestamp()

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).gt('2730000000000000000')
    expect(await govi.balanceOf(alice.address)).lt('2750000000000000000')

    let gmxAmount = await govi.balanceOf(alice.address)
    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18).sub(gmxAmount))

    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + 2 * secondsPerDay)

    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimable(alice.address)).gt('5478000000000000000') // 1000 / 365 * 2 => ~5.479
    expect(await goviVester.claimable(alice.address)).lt('5480000000000000000')

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + 181 * secondsPerDay)

    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimable(alice.address)).gt(fromNumber(500, 18)) // 1000 / 2 => 500
    expect(await goviVester.claimable(alice.address)).lt(fromNumber(502, 18))

    await goviVester.connect(alice).claim()
    blockTime = await getLatestBlockTimestamp()

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).gt(fromNumber(503, 18))
    expect(await govi.balanceOf(alice.address)).lt(fromNumber(505, 18))

    gmxAmount = await govi.balanceOf(alice.address)
    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18).sub(gmxAmount))

    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(gmxAmount)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    // vesting rate should be the same even after claiming
    expect(await goviVester.claimable(alice.address)).gt('2730000000000000000') // 1000 / 365 => ~2.739
    expect(await goviVester.claimable(alice.address)).lt('2750000000000000000')

    await esGovi.connect(owner).mint(alice.address, fromNumber(500, 18))
    await goviVester.connect(alice).deposit(fromNumber(500, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviVester.claimable(alice.address)).gt('6840000000000000000') // 1000 / 365 + 1500 / 365 => 6.849
    expect(await goviVester.claimable(alice.address)).lt('6860000000000000000')

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).is.equal(gmxAmount)

    await goviVester.connect(alice).withdraw()

    expect(await esGovi.balanceOf(alice.address)).gt(fromNumber(989, 18))
    expect(await esGovi.balanceOf(alice.address)).lt(fromNumber(990, 18))
    expect(await govi.balanceOf(alice.address)).gt(fromNumber(510, 18))
    expect(await govi.balanceOf(alice.address)).lt(fromNumber(512, 18))

    expect(await goviVester.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.getTotalVested(alice.address)).is.equal(0)
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(0)

    await esGovi.connect(owner).mint(alice.address, fromNumber(1000, 18))
    await goviVester.connect(alice).deposit(fromNumber(1000, 18))
    blockTime = await getLatestBlockTimestamp()

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).gt('2730000000000000000') // 1000 / 365 => ~2.739
    expect(await goviVester.claimable(alice.address)).lt('2750000000000000000')
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await goviVester.connect(alice).claim()
  })

  it('depositForAccount, claimForAccount', async () => {
    await goviVester.connect(owner).setPairToken(AddressZero)
    await goviVester.connect(owner).setRewardTracker(AddressZero)
    await goviVester.connect(owner).setHasMaxVestableAmount(false)

    expect(await goviVester.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.getTotalVested(alice.address)).is.equal(0)
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(0)

    await esGovi.connect(owner).mint(alice.address, fromNumber(1000, 18))

    await expect(
      goviVester.connect(deployer).depositForAccount(alice.address, fromNumber(1000, 18)),
    ).to.be.revertedWith(getAccessControlRevertStr(deployer.address.toLowerCase(), operatorRole))

    await goviVester.connect(owner).grantRole(operatorRole, deployer.address)
    await goviVester.connect(deployer).depositForAccount(alice.address, fromNumber(1000, 18))

    let blockTime = await getLatestBlockTimestamp()

    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).gt('2730000000000000000') // 1000 / 365 => ~2.739
    expect(await goviVester.claimable(alice.address)).lt('2750000000000000000')
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await expect(goviVester.connect(alice).claim()).to.be.revertedWith('ERC20: transfer amount exceeds balance')

    await govi.mint(goviVester.address, fromNumber(2000, 18))

    await expect(goviVester.connect(owner).claimForAccount(alice.address, mallory.address)).to.be.revertedWith(
      getAccessControlRevertStr(owner.address.toLowerCase(), operatorRole),
    )

    await goviVester.connect(owner).grantRole(operatorRole, owner.address)
    await goviVester.connect(owner).claimForAccount(alice.address, mallory.address)
    blockTime = await getLatestBlockTimestamp()

    expect(await esGovi.balanceOf(mallory.address)).is.equal(0)
    expect(await govi.balanceOf(mallory.address)).gt('2730000000000000000')
    expect(await govi.balanceOf(mallory.address)).lt('2750000000000000000')

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.balanceOf(alice.address)).gt(fromNumber(996, 18))
    expect(await goviVester.balanceOf(alice.address)).lt(fromNumber(998, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).gt('2730000000000000000')
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).lt('2750000000000000000')
    expect(await goviVester.claimedAmounts(alice.address)).gt('2730000000000000000')
    expect(await goviVester.claimedAmounts(alice.address)).lt('2750000000000000000')
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)
  })

  it('Handles multiple deposits', async () => {
    await goviVester.connect(owner).setPairToken(AddressZero)
    await goviVester.connect(owner).setRewardTracker(AddressZero)
    await goviVester.connect(owner).setHasMaxVestableAmount(false)

    expect(await goviVester.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.getTotalVested(alice.address)).is.equal(0)
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(0)

    await esGovi.connect(owner).mint(alice.address, fromNumber(1000, 18))
    await goviVester.connect(alice).deposit(fromNumber(1000, 18))

    let blockTime = await getLatestBlockTimestamp()

    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await govi.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1000, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).gt('2730000000000000000') // 1000 / 365 => ~2.739
    expect(await goviVester.claimable(alice.address)).lt('2750000000000000000')
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await expect(goviVester.connect(alice).claim()).to.be.revertedWith('ERC20: transfer amount exceeds balance')

    await govi.mint(goviVester.address, fromNumber(2000, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviVester.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))

    await esGovi.connect(owner).mint(alice.address, fromNumber(500, 18))
    await goviVester.connect(alice).deposit(fromNumber(500, 18))
    blockTime = await getLatestBlockTimestamp()

    expect(await goviVester.balanceOf(alice.address)).gt(fromNumber(1494, 18))
    expect(await goviVester.balanceOf(alice.address)).lt(fromNumber(1496, 18))
    expect(await goviVester.getTotalVested(alice.address)).is.equal(fromNumber(1500, 18))
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).gt('5470000000000000000') // 5.47, 1000 / 365 * 2 => ~5.48
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).lt('5490000000000000000') // 5.49
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).gt('5470000000000000000')
    expect(await goviVester.claimable(alice.address)).lt('5490000000000000000')
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(blockTime)

    await goviVester.connect(alice).withdraw()

    expect(await esGovi.balanceOf(alice.address)).gt(fromNumber(1494, 18))
    expect(await esGovi.balanceOf(alice.address)).lt(fromNumber(1496, 18))
    expect(await govi.balanceOf(alice.address)).gt('5470000000000000000')
    expect(await govi.balanceOf(alice.address)).lt('5490000000000000000')
    expect(await goviVester.balanceOf(alice.address)).is.equal(0)
    expect(await goviVester.getTotalVested(alice.address)).is.equal(0)
    expect(await goviVester.cumulativeClaimAmounts(alice.address)).is.equal(0) // 5.47, 1000 / 365 * 2 => ~5.48
    expect(await goviVester.claimedAmounts(alice.address)).is.equal(0)
    expect(await goviVester.claimable(alice.address)).is.equal(0)
    expect(await goviVester.pairAmounts(alice.address)).is.equal(0)
    expect(await goviVester.lastVestingTimes(alice.address)).is.equal(0)
  })

  it('Handles pairing', async () => {
    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval) // 0.02066798941 esGovi per second

    await govi.mint(goviVester.address, fromNumber(2000, 18))

    await govi.mint(alice.address, fromNumber(1000, 18))
    await govi.mint(bob.address, fromNumber(500, 18))
    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(1000, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(500, 18))

    await rewardRouter.connect(alice).stake(StakedTokenName.GOVI, fromNumber(1000, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.GOVI, fromNumber(500, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1190, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1191, 18))
    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(594, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(596, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(bob.address)).is.equal(0)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    expect(await esGovi.balanceOf(deployer.address)).is.equal(0)
    expect(await esGovi.balanceOf(owner.address)).is.equal(0)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(1190, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(1191, 18))
    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(594, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(596, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(1190, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(1191, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(594, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(596, 18))
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)

    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).gt('830000000000000000') // 0.83, 1000 / 1190 => ~0.84
    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).lt('850000000000000000') // 0.85
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).gt('830000000000000000') // 0.83, 500 / 595 => ~0.84
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).lt('850000000000000000') // 0.85
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(1, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1, 18))).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(2380, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(2382, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(1189, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(1191, 18))

    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).gt('410000000000000000') // 0.41, 1000 / 2380 => ~0.42
    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).lt('430000000000000000') // 0.43
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).gt('410000000000000000') // 0.41, 1000 / 1190 => ~0.42
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).lt('430000000000000000') // 0.43

    await esGovi.connect(owner).mint(alice.address, fromNumber(2385, 18))
    await expect(goviVester.connect(alice).deposit(fromNumber(2385, 18))).to.be.revertedWith(
      'RewardTracker: transfer amount exceeds balance',
    )

    await govi.mint(alice.address, fromNumber(500, 18))
    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(500, 18))
    await rewardRouter.connect(alice).stake(StakedTokenName.GOVI, fromNumber(500, 18))

    await expect(goviVester.connect(alice).deposit(fromNumber(2385, 18))).to.be.revertedWith(
      'Vester: max vestable amount exceeded',
    )

    await govi.mint(deployer.address, fromNumber(1, 18))
    await expect(goviVester.connect(deployer).deposit(fromNumber(1, 18))).to.be.revertedWith(
      'Vester: max vestable amount exceeded',
    )

    expect(await esGovi.balanceOf(alice.address)).is.equal(fromNumber(2385, 18))
    expect(await esGovi.balanceOf(goviVester.address)).is.equal(0)
    expect(await goviRewardTracker.balanceOf(alice.address)).is.equal(fromNumber(1500, 18))
    expect(await goviRewardTracker.balanceOf(goviVester.address)).is.equal(0)

    await goviVester.connect(alice).deposit(fromNumber(2380, 18))

    expect(await esGovi.balanceOf(alice.address)).is.equal(fromNumber(5, 18))
    expect(await esGovi.balanceOf(goviVester.address)).is.equal(fromNumber(2380, 18))
    expect(await goviRewardTracker.balanceOf(alice.address)).gt(fromNumber(499, 18))
    expect(await goviRewardTracker.balanceOf(alice.address)).lt(fromNumber(501, 18))
    expect(await goviRewardTracker.balanceOf(goviVester.address)).gt(fromNumber(999, 18))
    expect(await goviRewardTracker.balanceOf(goviVester.address)).lt(fromNumber(1001, 18))

    await rewardRouter.connect(bob).unstake(StakedTokenName.GOVI, fromNumber(499, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(4164, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(4166, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(1190, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(1192, 18))

    // // (1000 * 2380 / 4164) + (1500 * 1784 / 4164) => 1214.21709894
    // // 1214.21709894 / 4164 => ~0.29

    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).gt('280000000000000000') // 0.28
    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).lt('300000000000000000') // 0.30
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).gt('410000000000000000') // 0.41, 1000 / 2380 => ~0.42
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).lt('430000000000000000') // 0.43

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + 30 * secondsPerDay)

    await goviVester.connect(alice).withdraw()

    expect(await goviRewardTracker.balanceOf(alice.address)).is.equal(fromNumber(1500, 18))
    expect(await govi.balanceOf(alice.address)).gt(fromNumber(201, 18)) // 2380 / 12 = ~198
    expect(await govi.balanceOf(alice.address)).lt(fromNumber(203, 18))
    expect(await esGovi.balanceOf(alice.address)).gt(fromNumber(2182, 18)) // 5 + 2380 - 202  = 2183
    expect(await esGovi.balanceOf(alice.address)).lt(fromNumber(2183, 18))
  })

  it('Handles existing pair tokens', async () => {
    await goviTrackerRewardDist.connect(owner).setTokensPerInterval(tokensPerInterval) // 0.02066798941 esGovi per second

    await govi.mint(goviVester.address, fromNumber(2000, 18))

    await govi.mint(alice.address, fromNumber(1000, 18))
    await govi.mint(bob.address, fromNumber(500, 18))
    await govi.connect(alice).approve(goviRewardTracker.address, fromNumber(1000, 18))
    await govi.connect(bob).approve(goviRewardTracker.address, fromNumber(500, 18))

    await rewardRouter.connect(alice).stake(StakedTokenName.GOVI, fromNumber(1000, 18))
    await rewardRouter.connect(bob).stake(StakedTokenName.GOVI, fromNumber(500, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1190, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1191, 18))
    expect(await goviRewardTracker.claimable(bob.address)).gt(fromNumber(594, 18))
    expect(await goviRewardTracker.claimable(bob.address)).lt(fromNumber(596, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(bob.address)).is.equal(0)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    expect(await esGovi.balanceOf(deployer.address)).is.equal(0)
    expect(await esGovi.balanceOf(owner.address)).is.equal(0)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await esGovi.balanceOf(alice.address)).is.equal(0)
    expect(await esGovi.balanceOf(bob.address)).is.equal(0)
    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(1190, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(1191, 18))
    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(594, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(596, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(1190, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(1191, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(594, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(596, 18))
    expect(await goviVester.getMaxVestableAmount(deployer.address)).is.equal(0)
    expect(await goviVester.getMaxVestableAmount(owner.address)).is.equal(0)

    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).gt('830000000000000000') // 0.83, 1000 / 1190 => ~0.84
    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).lt('850000000000000000') // 0.85
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).gt('830000000000000000') // 0.83, 500 / 595 => ~0.84
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).lt('850000000000000000') // 0.85
    expect(await goviVester.getPairAmount(deployer.address, fromNumber(1, 18))).is.equal(0)
    expect(await goviVester.getPairAmount(owner.address, fromNumber(1, 18))).is.equal(0)

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    await goviRewardTracker.connect(alice).claim(deployer.address)
    await goviRewardTracker.connect(bob).claim(owner.address)

    expect(await esGovi.balanceOf(deployer.address)).gt(fromNumber(2380, 18))
    expect(await esGovi.balanceOf(deployer.address)).lt(fromNumber(2382, 18))
    expect(await esGovi.balanceOf(owner.address)).gt(fromNumber(1189, 18))
    expect(await esGovi.balanceOf(owner.address)).lt(fromNumber(1191, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(2380, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(2382, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).gt(fromNumber(1189, 18))
    expect(await goviVester.getMaxVestableAmount(bob.address)).lt(fromNumber(1191, 18))

    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).gt('410000000000000000') // 0.41, 1000 / 2380 => ~0.42
    expect(await goviVester.getPairAmount(alice.address, fromNumber(1, 18))).lt('430000000000000000') // 0.43
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).gt('410000000000000000') // 0.41, 1000 / 1190 => ~0.42
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1, 18))).lt('430000000000000000') // 0.43

    expect(await goviVester.getPairAmount(alice.address, fromNumber(2380, 18))).gt(fromNumber(999, 18))
    expect(await goviVester.getPairAmount(alice.address, fromNumber(2380, 18))).lt(fromNumber(1000, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1189, 18))).gt(fromNumber(499, 18))
    expect(await goviVester.getPairAmount(bob.address, fromNumber(1189, 18))).lt(fromNumber(500, 18))

    expect(await goviRewardTracker.balanceOf(alice.address)).is.equal(fromNumber(1000, 18))
    await esGovi.connect(owner).mint(alice.address, fromNumber(2380, 18))
    await goviVester.connect(alice).deposit(fromNumber(2380, 18))

    expect(await goviRewardTracker.balanceOf(alice.address)).gt(0)
    expect(await goviRewardTracker.balanceOf(alice.address)).lt(fromNumber(1, 18))

    await setNextBlockTimestampAndMine((await getLatestBlockTimestamp()) + secondsPerDay)

    expect(await goviRewardTracker.claimable(alice.address)).gt(fromNumber(1190, 18))
    expect(await goviRewardTracker.claimable(alice.address)).lt(fromNumber(1191, 18))

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(2380, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(2382, 18))

    await goviRewardTracker.connect(alice).claim(deployer.address)

    expect(await goviVester.getMaxVestableAmount(alice.address)).gt(fromNumber(3571, 18))
    expect(await goviVester.getMaxVestableAmount(alice.address)).lt(fromNumber(3572, 18))

    expect(await goviVester.getPairAmount(alice.address, fromNumber(3570, 18))).gt(fromNumber(999, 18))
    expect(await goviVester.getPairAmount(alice.address, fromNumber(3570, 18))).lt(fromNumber(1000, 18))

    const goviRewardTrackerBalance = await goviRewardTracker.balanceOf(alice.address)

    await esGovi.connect(owner).mint(alice.address, fromNumber(1190, 18))
    await goviVester.connect(alice).deposit(fromNumber(1190, 18))

    expect(goviRewardTrackerBalance).is.equal(await goviRewardTracker.balanceOf(alice.address))

    await expect(rewardRouter.connect(alice).unstake(StakedTokenName.GOVI, fromNumber(2, 18))).to.be.revertedWith(
      'RewardTracker: burn amount exceeds balance',
    )

    await goviVester.connect(alice).withdraw()

    await rewardRouter.connect(alice).unstake(StakedTokenName.GOVI, fromNumber(2, 18))
  })
})
