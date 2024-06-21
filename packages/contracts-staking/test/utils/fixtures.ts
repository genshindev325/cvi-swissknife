import type { FakeCVIUSDCThetaVault, FakeGOVI } from '../../../auto-generated-code/src/git-contract-types'
import { esGoviDistributorAmount } from '../../../contracts-deploy/src/state/staking-state'
import { runFixture, TestHelper } from '../../../contracts-deploy/test/utils'

export const distributorInitialAmount = esGoviDistributorAmount
export const tokensPerInterval = '20667989410000000'

export async function runContractsFixtures() {
  const helper = TestHelper.get()

  await runFixture([
    'test-staking-govi',
    'staking-es-govi',
    'staking-reward-distributors',
    'staking-reward-trackers',
    'staking-vesters',
    'staking-reward-router',
    'staking-initial-permissions',
    'staking-set-state',
  ])

  return {
    esGovi: await helper.connect('EsGOVI'),
    govi: (await helper.connect('GOVI')) as unknown as FakeGOVI,
    thetaVault: (await helper.connect('CVIUSDCThetaVault')) as unknown as FakeCVIUSDCThetaVault,
    thetaVaultTrackerRewardDist: await helper.connect('ThetaVaultRewardTrackerDistributor'),
    goviTrackerRewardDist: await helper.connect('GOVIRewardTrackerDistributor'),
    thetaVaultRewardTracker: await helper.connect('ThetaVaultRewardTracker'),
    goviRewardTracker: await helper.connect('GOVIRewardTracker'),
    thetaVaultVester: await helper.connect('ThetaVaultVester'),
    goviVester: await helper.connect('GOVIVester'),
    rewardRouter: await helper.connect('RewardRouter'),
  }
}
