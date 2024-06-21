import type { BigNumber } from 'ethers'
import { inject, injectable, optional } from 'inversify'
import type { GOVIVester, ThetaVaultVester } from '@coti-cvi/auto-generated-code/contracts'

import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { IERC20, TokenName, TvSupportedChainIds } from '../types'
import { Vester } from '../types'
import type { Token } from '../token'
import { type UntypedToken } from '../token'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import { CustomError } from '../custom-error'
import type { VestingContractsInversifyService } from '../vesting-contracts'

@injectable()
export class VestingInversifyService {
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

  public getVestingContract(vester: Vester): ThetaVaultVester | GOVIVester {
    return vester === Vester.THETA
      ? this.vestingContractsInversifyService.thetaVaultVester
      : this.vestingContractsInversifyService.goviVester
  }

  private async claimable(vester: Vester, account: string) {
    return this.getVestingContract(vester).claimable(account)
  }

  async getClaimable(vester: Vester, account: string) {
    const claimableGoviAmount = await this.claimable(vester, account)
    return {
      claimableGoviAmount,
      claimableGoviNumber: this.tokenGOVI.toNumber(claimableGoviAmount),
      claimableGoviString: this.tokenGOVI.toString(claimableGoviAmount),
    }
  }

  async getPairAmount(vester: Vester, account: string, esGoviAmount: number | BigNumber) {
    const pairAmount = await this.getVestingContract(vester).getPairAmount(account, esGoviAmount)
    return {
      pairAmount,
      pairNumber: this.tokenEsGOVI.toNumber(pairAmount),
      pairString: this.tokenEsGOVI.toString(pairAmount),
    }
  }

  async getMaxVestableAmount(vester: Vester, account: string) {
    const maxVestableAmount = await this.getVestingContract(vester).getMaxVestableAmount(account)
    return {
      maxVestableAmount,
      maxVestableNumber: this.tokenEsGOVI.toNumber(maxVestableAmount),
      maxVestableString: this.tokenEsGOVI.toString(maxVestableAmount),
    }
  }

  async getTotalVested(vester: Vester, account: string) {
    const vestedAmount = await this.getVestingContract(vester).getTotalVested(account)
    return {
      vestedAmount,
      vestedNumber: this.tokenEsGOVI.toNumber(vestedAmount),
      vestedString: this.tokenEsGOVI.toString(vestedAmount),
    }
  }

  async claim(vester: Vester) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.getVestingContract(vester)
      .connect(this.signerService.signer)
      .claim(await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to claim.'))
      })
    if (tx) {
      return await tx.wait()
    }
  }

  async deposit(vester: Vester, esGoviAmount: number | BigNumber) {
    const amount = typeof esGoviAmount === 'number' ? this.tokenEsGOVI.fromNumber(esGoviAmount) : esGoviAmount
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    await this.tokenEsGOVI
      .approve({
        signer,
        to: this.getVestingContract(vester).address,
        overrides: await this.overridesService.get(),
      })
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to approve.'))
      })

    const tx = await this.getVestingContract(vester)
      .connect(signer)
      .deposit(amount, await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error('Failed to deposit.'))
      })
    if (tx) {
      return await tx.wait()
    }
  }

  async withdraw(vester: Vester) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer

    const tx = await this.getVestingContract(vester)
      .connect(signer)
      .withdraw(await this.overridesService.get())
      .catch(error => {
        CustomError.printErrorToConsole(error)
        this.globalEventsInversifyService.eventEmitter.emit('errors', new Error(error.reason ?? 'Failed to withdraw.'))
      })

    if (tx) {
      return await tx.wait()
    }
  }

  async depositAll(vester: Vester) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    return this.deposit(vester, await this.tokenEsGOVI.getBalance(this.signerService.address))
  }
}
