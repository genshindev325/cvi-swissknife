import type { BigNumber } from 'ethers'
import { inject, injectable, optional } from 'inversify'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { IERC20, TokenName } from '../types'
import type { TvSupportedChainIds } from '../types'
import type { Token } from '../token'
import { aprToAPY, toNumber } from '../util'
import type { State } from '../state'
import { Stator } from '../state'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import { CustomError } from '../custom-error'
import type { CviContractsInversifyService } from '../cvi-contracts'
import type { StakingContractsEventsInversifyService } from '../contracts-events'

type UserStake = State<{
  currentStake: number
  currentStakeAmount: BigNumber
  share: number
  xGOVIAmount: BigNumber
  xGOVI: number
}>
export type PlatformStaking = {
  apy: State<number>
  totalValueLocked: State<number>
}
export type UserStaking = {
  currentStake: State<number>
  availableToStake: State<number>
}

@injectable()
export class StakingInversifyService {
  constructor(
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('CviContractsInversifyService') public readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('StakingContractsEventsInversifyService')
    public readonly stakingContractsEventsInversifyService: StakingContractsEventsInversifyService,
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('TokenGOVI') public readonly tokenGOVI: Token<IERC20, TokenName.GOVI>,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {}

  public checkUnstakeLock = async (
    account: string,
  ): Promise<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }> => {
    const [lockupPeriod, lastStake, { timestamp }] = await Promise.all([
      this.cviContractsInversifyService.stakingV2.stakeLockupTime(),
      this.cviContractsInversifyService.stakingV2.stakeTimestamps(account),
      this.latestBlockInfoInversifyService.getCurrentBlock(),
    ])
    if (lastStake.isZero()) {
      return { isLocked: false, lockEndTimestamp: 0, timeLeftSeconds: 0 }
    }
    const lockEnd = lastStake.add(lockupPeriod).toNumber()
    return { isLocked: lockEnd > timestamp, lockEndTimestamp: lockEnd, timeLeftSeconds: lockEnd - timestamp }
  }

  async getAPY(): Promise<PlatformStaking['apy']> {
    try {
      const aprAmount = await this.cviContractsInversifyService.helper.calculateStakingAPR()
      const aprAmountNumber = toNumber(aprAmount, 2)
      const api = aprToAPY(aprAmountNumber)
      return Stator.resolve(api)
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return Stator.reject(undefined, error)
    }
  }

  async getTVL(): Promise<PlatformStaking['totalValueLocked']> {
    try {
      const tvlAmount = await this.tokenGOVI.getBalance(this.cviContractsInversifyService.stakingV2.address)
      return Stator.resolve(this.tokenGOVI.toNumber(tvlAmount))
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return Stator.reject(undefined, error)
    }
  }

  async getAvailableToStake(account: string): Promise<UserStaking['availableToStake']> {
    try {
      const availableToStake = await this.tokenGOVI.getBalance(account)
      return Stator.resolve(this.tokenGOVI.toNumber(availableToStake))
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return Stator.reject(undefined, error)
    }
  }

  async getCurrentStake(account: string): Promise<UserStaking['currentStake']> {
    try {
      const currentStakeAwaited = await this.cviContractsInversifyService.helper.stakedGOVI(account)
      return Stator.resolve(this.tokenGOVI.toNumber(currentStakeAwaited.stakedAmount))
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return Stator.reject(undefined, error)
    }
  }

  async getStake(account: string): Promise<UserStake> {
    try {
      const stakeAwaited = await Promise.all([
        this.cviContractsInversifyService.helper.stakedGOVI(account),
        this.cviContractsInversifyService.stakingV2.balanceOf(account),
        this.cviContractsInversifyService.stakingV2.decimals(),
      ])
      const [{ stakedAmount: currentStakeAmount, share }, xGOVIAmount, decimals] = stakeAwaited

      const xGOVI = toNumber(xGOVIAmount, decimals)

      return Stator.resolve({
        currentStakeAmount,
        currentStake: this.tokenGOVI.toNumber(currentStakeAmount), // current stake
        share: share.toNumber(), // user share
        xGOVIAmount,
        xGOVI,
      })
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      return Stator.reject(undefined, error)
    }
  }

  async getPlatformStakeDetails(): Promise<PlatformStaking> {
    const platformStakeDetails = await Promise.allSettled([this.getAPY(), this.getTVL()])
    const [apy, totalValueLocked] = platformStakeDetails.map<State<number>>(item =>
      item.status === 'fulfilled' ? item.value : Stator.reject(item.reason),
    )

    return {
      apy,
      totalValueLocked,
    }
  }

  async getUserStakeDetails(account: string): Promise<UserStaking> {
    const userStakeDetails = await Promise.allSettled([
      this.getCurrentStake(account),
      this.getAvailableToStake(account),
    ])

    const [currentStake, availableToStake] = userStakeDetails.map<State<number>>(item =>
      item.status === 'fulfilled' ? item.value : Stator.reject(item.reason),
    )

    return {
      currentStake,
      availableToStake,
    }
  }

  async stake(goviAmount: number | BigNumber) {
    const amount = typeof goviAmount === 'number' ? this.tokenGOVI.fromNumber(goviAmount) : goviAmount
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    await this.tokenGOVI
      .approve({
        signer,
        to: this.cviContractsInversifyService.stakingV2.address,
        overrides: await this.overridesService.get(),
      })
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to approve.'))
      })

    const tx = await this.cviContractsInversifyService.stakingV2
      .connect(signer)
      .stake(amount, await this.overridesService.get())

    if (tx) {
      const wait = await tx.wait()
      this.emitUserStakingEvents(this.signerService.address)

      return wait
    }
  }

  async unstake(goviAmount: number | BigNumber) {
    const amount = typeof goviAmount === 'number' ? this.tokenGOVI.fromNumber(goviAmount) : goviAmount
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    const xGOVI = await this.cviContractsInversifyService.helper.convertGOVIToXGOVI(amount).catch(error => {
      CustomError.printErrorToConsole(error)
      this.globalEventsInversifyService.eventEmitter.emit(
        'errors',
        new Error(error.reason ?? 'Failed to convert xGOVI'),
      )
    })

    if (xGOVI) {
      const tx = await this.cviContractsInversifyService.stakingV2
        .connect(signer)
        .unstake(xGOVI, await this.overridesService.get())

      if (tx) {
        const wait = await tx.wait()
        this.emitUserStakingEvents(this.signerService.address)

        return wait
      }
    }
  }

  async unstakeAll() {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const balance = await this.cviContractsInversifyService.stakingV2
      .balanceOf(this.signerService.address)
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to get balance'))
      })

    if (balance) {
      const tx = await this.cviContractsInversifyService.stakingV2
        .connect(signer)
        .unstake(balance, await this.overridesService.get())
        .catch(error => {
          CustomError.printErrorToConsole(error)
          this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to unstake all'))
        })

      if (tx) {
        const wait = await tx.wait()
        this.emitUserStakingEvents(this.signerService.address)

        return wait
      }
    }
  }

  async getRewardRate() {
    const rewardRate = await this.cviContractsInversifyService.stakingV2.rewardPerSecond()
    const rewardRateNumber = this.tokenGOVI.toNumber(rewardRate)
    return { rewardRate, rewardRateNumber }
  }

  async stakeAll() {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    return this.stake(await this.tokenGOVI.getBalance(this.signerService.address))
  }

  public getBaseEvents = async (address?: string) => {
    const [stakedFilter, unstakedFilter] = [
      this.stakingContractsEventsInversifyService.getOldStakedEvents(address),
      this.stakingContractsEventsInversifyService.getOldUnStakedEvents(address),
    ]

    const eventSplitted = await Promise.all([stakedFilter, unstakedFilter])

    const allEvents = eventSplitted.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    return {
      eventSplitted,
      allEvents,
    }
  }

  public emitLockUstakeEvents = async (address: string) => {
    if (address) {
      return this.globalEventsInversifyService.emitWithAddress('stakeUnstakeLockWithAddress', address, async () =>
        this.checkUnstakeLock(address),
      )
    }
  }

  public emitUserStakingEvents = async (address: string) => {
    if (address) {
      return this.globalEventsInversifyService.emitWithAddress('stakeStakingInfo', address, async () =>
        this.getUserStakeDetails(address),
      )
    }
  }

  public emitPlatformStakingEvents = async () => {
    return this.globalEventsInversifyService.emit('stakePlatformStakingInfo', async () =>
      this.getPlatformStakeDetails(),
    )
  }
}
