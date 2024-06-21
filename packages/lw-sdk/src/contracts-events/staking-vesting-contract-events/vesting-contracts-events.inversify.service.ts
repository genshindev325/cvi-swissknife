import { inject, injectable } from 'inversify'
import type {
  DepositEvent,
  WithdrawEvent,
  ClaimEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/Vester'

import type { Vester } from './../../types'
import type { VestingInversifyService } from '@coti-cvi/lw-sdk'

@injectable()
export class VestingContractsEventsInversifyService {
  constructor(@inject('VestingInversifyService') private readonly vestingInversifyService: VestingInversifyService) {}

  private getVesterContracts(vester?: Vester) {
    return vester
      ? [this.vestingInversifyService.getVestingContract(vester)]
      : [
          this.vestingInversifyService.vestingContractsInversifyService.goviVester,
          this.vestingInversifyService.vestingContractsInversifyService.thetaVaultVester,
        ]
  }

  public async getDepositEvents({ vester, account }: { vester?: Vester; account?: string }) {
    const vesters = this.getVesterContracts(vester)
    return (await Promise.all(vesters.map(v => v.queryFilter(v.filters.Deposit(account))))).flat()
  }

  public async getWithdrawEvents({ vester, account }: { vester?: Vester; account?: string }) {
    const vesters = this.getVesterContracts(vester)
    return (await Promise.all(vesters.map(v => v.queryFilter(v.filters.Withdraw(account))))).flat()
  }

  public async getClaimEvents({ vester, account }: { vester?: Vester; account?: string }) {
    const vesters = this.getVesterContracts(vester)
    return (await Promise.all(vesters.map(v => v.queryFilter(v.filters.Claim(account))))).flat()
  }

  public async getPairTransferEvents({ vester, from, to }: { vester?: Vester; from?: string; to?: string }) {
    const vesters = this.getVesterContracts(vester)
    return (await Promise.all(vesters.map(v => v.queryFilter(v.filters.PairTransfer(from, to))))).flat()
  }

  public async getBaseEvents(filters: { vester?: Vester; account?: string }) {
    const eventSplitted = await Promise.all([
      this.getDepositEvents(filters),
      this.getWithdrawEvents(filters),
      this.getClaimEvents(filters),
    ])

    const allEvents = eventSplitted.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)

    return {
      eventSplitted,
      allEvents,
    }
  }

  async getEvents(filters: { vester?: Vester; account?: string }) {
    const baseEvents = await this.getBaseEvents(filters)

    const [depositEvents, withdrawEvents, claimEvents] = baseEvents.eventSplitted

    const allEvents = baseEvents.allEvents

    return { allEvents, depositEvents, withdrawEvents, claimEvents }
  }

  public eventToString = (event: DepositEvent | WithdrawEvent | ClaimEvent): string => {
    const commonString = `[${event.blockNumber}]`
    let eventString
    if (event.event === 'Deposit') {
      const e = event as DepositEvent
      const amountString = this.vestingInversifyService.tokenEsGOVI.toString(e.args.amount)
      eventString = `Deposit - [${e.args.account}] ${amountString}`
    } else if (event.event === 'Withdraw') {
      const e = event as WithdrawEvent
      const claimedString = this.vestingInversifyService.tokenGOVI.toString(e.args.claimedAmount)
      const balanceString = this.vestingInversifyService.tokenEsGOVI.toString(e.args.balance)
      eventString = `Withdraw - [${e.args.account}] claimed ${claimedString} withdrawn ${balanceString}`
    } else if (event.event === 'Claim') {
      const e = event as ClaimEvent
      const amountString = this.vestingInversifyService.tokenEsGOVI.toString(e.args.amount)
      eventString = `Claim - [${e.args.receiver}] ${amountString}`
    } else {
      throw new Error(`[Vesting] eventToString unknown event type ${event.event}`)
    }
    return `${commonString} ${eventString}`
  }
}
