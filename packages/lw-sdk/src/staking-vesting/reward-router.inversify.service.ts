import type { BigNumber } from 'ethers'
import { inject, injectable, optional } from 'inversify'
import type { RewardTracker } from '@coti-cvi/auto-generated-code/contracts'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { IERC20, TokenName, TvSupportedChainIds } from '../types'
import { StakedTokenName } from '../types'
import type { Token } from '../token'
import { type UntypedToken } from '../token'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import { CustomError } from '../custom-error'
import type { VestingContractsInversifyService } from '../vesting-contracts'

@injectable()
export class RewardRouterInversifyService {
  constructor(
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('VestingContractsInversifyService')
    public readonly vestingContractsInversifyService: VestingContractsInversifyService,
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('TokenGOVI') public readonly tokenGOVI: Token<IERC20, TokenName.GOVI>,
    @inject('TokenEsGOVI') public readonly tokenEsGOVI: UntypedToken,
    @inject('CVIUSDCThetaToken') public readonly tokenThetaCvi: UntypedToken,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {}

  public getStakeToken(stakeToken: StakedTokenName): UntypedToken {
    switch (stakeToken) {
      case StakedTokenName.GOVI:
        return this.tokenGOVI
      case StakedTokenName.ES_GOVI:
        return this.tokenEsGOVI
      case StakedTokenName.THETA_VAULT:
        return this.tokenThetaCvi
    }
  }

  public getRewardTrackingContract(stakeToken: StakedTokenName): RewardTracker {
    switch (stakeToken) {
      case StakedTokenName.THETA_VAULT:
        return this.vestingContractsInversifyService.thetaVaultRewardTracker
      case StakedTokenName.GOVI:
        return this.vestingContractsInversifyService.goviRewardTracker
      case StakedTokenName.ES_GOVI:
        return this.vestingContractsInversifyService.esGoviRewardTracker
    }
  }

  private async staked(stakeToken: StakedTokenName, account: string) {
    return this.getRewardTrackingContract(stakeToken).stakedAmounts(account)
  }

  private async depositBalances(stakeToken: StakedTokenName, account: string) {
    return this.getRewardTrackingContract(stakeToken).depositBalances(account, this.getStakeToken(stakeToken).address)
  }

  private async balance(stakeToken: StakedTokenName, account: string) {
    return this.getRewardTrackingContract(stakeToken).balances(account)
  }

  async claimable(stakeToken: StakedTokenName, account: string) {
    const claimableEsGoviAmount = await this.getRewardTrackingContract(stakeToken).claimable(account)
    return {
      claimableEsGoviAmount,
      claimableEsGoviNumber: this.tokenEsGOVI.toNumber(claimableEsGoviAmount),
      claimableEsGoviString: this.tokenEsGOVI.toString(claimableEsGoviAmount),
    }
  }

  async getUnstakableBalance(stakeToken: StakedTokenName, account: string) {
    const [depositBalance, balance] = await Promise.all([
      this.depositBalances(stakeToken, account),
      this.balance(stakeToken, account),
    ])
    const balanceAmount = depositBalance.lt(balance) ? depositBalance : balance
    return {
      balanceAmount,
      balanceNumber: this.getStakeToken(stakeToken).toNumber(balanceAmount),
      balanceString: this.getStakeToken(stakeToken).toString(balanceAmount),
      depositBalanceAmount: balanceAmount,
      depositBalanceNumber: this.getStakeToken(stakeToken).toNumber(balanceAmount),
      depositBalanceString: this.getStakeToken(stakeToken).toString(balanceAmount),
    }
  }

  async getStaked(stakeToken: StakedTokenName, account: string) {
    const stakedAmount = await this.staked(stakeToken, account)
    return { stakedAmount, stakedNumber: this.tokenEsGOVI.toNumber(stakedAmount) }
  }

  async compound(stakeToken: StakedTokenName) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(this.signerService.signer)
      .compound(stakeToken, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to claim.'))
      })
    if (tx) {
      return await tx.wait()
    }
  }

  async claim(stakeToken: StakedTokenName) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(this.signerService.signer)
      .claim(stakeToken, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to claim.'))
      })
    if (tx) {
      return await tx.wait()
    }
  }

  async stake(stakeToken: StakedTokenName, tokenAmount: number | BigNumber) {
    const token = this.getStakeToken(stakeToken)
    const amount = typeof tokenAmount === 'number' ? token.fromNumber(tokenAmount) : tokenAmount
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    await token
      .approve({
        signer,
        to: this.getRewardTrackingContract(stakeToken).address,
        overrides: await this.overridesService.get(),
      })
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to approve.'))
      })

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(signer)
      .stake(stakeToken, amount, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to stake.'))
      })
    if (tx) {
      return await tx.wait()
    }
  }

  async unstake(stakeToken: StakedTokenName, tokenAmount: number | BigNumber) {
    const token = this.getStakeToken(stakeToken)
    const amount = typeof tokenAmount === 'number' ? token.fromNumber(tokenAmount) : tokenAmount
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(signer)
      .unstake(stakeToken, amount, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error(error.reason ?? 'Failed to unstake.'))
      })

    if (tx) {
      return await tx.wait()
    }
  }

  async stakeAll(stakeToken: StakedTokenName) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    return this.stake(stakeToken, await this.getStakeToken(stakeToken).getBalance(this.signerService.address))
  }

  async unstakeAll(stakeToken: StakedTokenName) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    return this.unstake(
      stakeToken,
      (await this.getUnstakableBalance(stakeToken, this.signerService.address)).balanceAmount,
    )
  }

  async signalTransfer(receiver: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(this.signerService.signer)
      .signalTransfer(receiver, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error(error.reason ?? 'Failed to unstake.'))
      })

    if (tx) {
      return await tx.wait()
    }
  }

  async acceptTransfer(sender: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.vestingContractsInversifyService.rewardRouter
      .connect(this.signerService.signer)
      .acceptTransfer(sender, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error(error.reason ?? 'Failed to unstake.'))
      })

    if (tx) {
      return await tx.wait()
    }
  }
}
