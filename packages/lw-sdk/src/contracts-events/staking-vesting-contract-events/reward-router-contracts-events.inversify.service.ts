import { inject, injectable } from 'inversify'
import type {
  StakeTokenEvent,
  UnstakeTokenEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/RewardRouter'
import type { ClaimEvent } from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/RewardTracker'

import type { RewardRouterInversifyService } from './../../staking-vesting/reward-router.inversify.service'
import type { StakedTokenName } from './../../types'
import type { UntypedToken } from './../../token/token'

@injectable()
export class RewardRouterContractsEventsInversifyService {
  constructor(
    @inject('RewardRouterInversifyService') private readonly rewardRouterInversifyService: RewardRouterInversifyService,
  ) {}

  private getStakeTokenFromAddress(tokenAddress: string): UntypedToken {
    const token = [
      this.rewardRouterInversifyService.tokenGOVI,
      this.rewardRouterInversifyService.tokenEsGOVI,
      this.rewardRouterInversifyService.tokenThetaCvi,
    ].find(t => t.address.toLowerCase() === tokenAddress.toLowerCase())
    if (!token) {
      throw new Error(`tokenAddress ${tokenAddress} is missing from stake tokens`)
    }
    return token
  }

  public getStakeTokenEvents({ stakeToken, account }: { stakeToken?: StakedTokenName; account?: string }) {
    const tokenAddress = stakeToken ? this.rewardRouterInversifyService.getStakeToken(stakeToken).address : undefined
    return this.rewardRouterInversifyService.vestingContractsInversifyService.rewardRouter.queryFilter(
      this.rewardRouterInversifyService.vestingContractsInversifyService.rewardRouter.filters.StakeToken(
        tokenAddress,
        account,
      ),
    )
  }

  public getUnstakeTokenEvents({ stakeToken, account }: { stakeToken?: StakedTokenName; account?: string }) {
    const tokenAddress = stakeToken ? this.rewardRouterInversifyService.getStakeToken(stakeToken).address : undefined
    return this.rewardRouterInversifyService.vestingContractsInversifyService.rewardRouter.queryFilter(
      this.rewardRouterInversifyService.vestingContractsInversifyService.rewardRouter.filters.UnstakeToken(
        tokenAddress,
        account,
      ),
    )
  }

  public async getClaimEvents({ stakeToken, account }: { stakeToken?: StakedTokenName; account?: string }) {
    const rewardTrakers = stakeToken
      ? [this.rewardRouterInversifyService.getRewardTrackingContract(stakeToken)]
      : [
          this.rewardRouterInversifyService.vestingContractsInversifyService.goviRewardTracker,
          this.rewardRouterInversifyService.vestingContractsInversifyService.thetaVaultRewardTracker,
        ]
    return (await Promise.all(rewardTrakers.map(r => r.queryFilter(r.filters.Claim(account))))).flat()
  }

  public async getBaseEvents(filters: { stakeToken?: StakedTokenName; account?: string }) {
    const eventSplitted = await Promise.all([
      this.getStakeTokenEvents(filters),
      this.getUnstakeTokenEvents(filters),
      this.getClaimEvents(filters),
    ])

    const allEvents = eventSplitted.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    return {
      eventSplitted,
      allEvents,
    }
  }

  async getEvents(filters: { stakeToken?: StakedTokenName; account?: string }) {
    const baseEvents = await this.getBaseEvents(filters)

    const [stakeTokenEvents, unstakeTokenEvents, claimEvents] = baseEvents.eventSplitted

    const allEvents = baseEvents.allEvents

    return { allEvents, stakeTokenEvents, unstakeTokenEvents, claimEvents }
  }

  public eventToString = (event: StakeTokenEvent | UnstakeTokenEvent | ClaimEvent): string => {
    const commonString = `[${event.blockNumber}]`
    let eventString
    if (event.event === 'StakeToken' || event.event === 'UnstakeToken') {
      const e = event as StakeTokenEvent | UnstakeTokenEvent
      const tokenAddress = e.args.tokenName
      const token = this.getStakeTokenFromAddress(tokenAddress)
      const amountString = token.toString(e.args.amount)
      eventString = `${event.event === 'StakeToken' ? 'Stake' : 'Unstake'} - [${e.args.account}] ${amountString}`
    } else if (event.event === 'Claim') {
      const e = event as ClaimEvent
      const amountString = this.rewardRouterInversifyService.tokenEsGOVI.toString(e.args.amount)
      eventString = `Claim - [${e.args.receiver}] ${amountString}`
    } else {
      throw new Error(`[RewardRouter] eventToString unknown event type ${event.event}`)
    }
    return `${commonString} ${eventString}`
  }
}
