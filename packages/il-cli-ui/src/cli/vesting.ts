import type { VestingInversifyService } from '@coti-cvi/lw-sdk'
import { Vester } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, isNum } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'
import { BACK, NONE } from './constants'

export class Vesting {
  public readonly VestingMenu: { [key: string]: MenuItem } = {
    d: { description: 'deposit', action: () => this.deposit() },
    w: { description: 'withdraw', action: () => this.withdraw() },
    c: { description: 'claim', action: () => this.claim() },
    e: { description: 'events', action: () => this.events() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<VestingInversifyService> {
    const chainId = this.inverifyContext.useVestingChainId()
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenGOVI')
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenEsGOVI')
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'VestingInversifyService',
    )
  }

  public async deposit(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const balance = await service.tokenEsGOVI.getBalance(address)
    const printerFunction: (key: keyof typeof Vester) => Promise<string> = async key =>
      `[${key}] - max vestible amount: ${(await service.getMaxVestableAmount(Vester[key], address)).maxVestableString}`
    const vester = await this.wrappers.selectEnum('vester to deposit', Vester, printerFunction)
    const answer = await this.wrappers.question(
      `enter stake amount - number [${service.tokenEsGOVI.toString(balance)}] (leave empty for full stake)`,
    )
    const response = isNum(answer) ? await service.deposit(vester, +answer) : await service.depositAll(vester)
    if (response) {
      this.wrappers.writeOutput(`deposited, txHash: ${response.transactionHash}`)
    }
  }

  public async withdraw(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof Vester) => Promise<string> = async key =>
      `[${key}] - vested: ${(await service.getTotalVested(Vester[key], address)).vestedString}, claimable: ${
        (await service.getClaimable(Vester[key], address)).claimableGoviString
      }`
    const vester = await this.wrappers.selectEnum('vester to withdraw', Vester, printerFunction)
    const response = await service.withdraw(vester)
    if (response) {
      this.wrappers.writeOutput(`withdrawn txHash: ${response.transactionHash}`)
    }
  }

  public async claim(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof Vester) => Promise<string> = async key =>
      `[${key}] - claimable: ${(await service.getClaimable(Vester[key], address)).claimableGoviString}`
    const vester = await this.wrappers.selectEnum('vester to claim', Vester, printerFunction)
    const response = await service.claim(vester)
    if (response) {
      this.wrappers.writeOutput(`claimed, txHash: ${response.transactionHash}`)
    }
  }

  public async events(): Promise<void> {
    const { address } = this.inverifyContext.signerInversifyService
    const eventsService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'VestingContractsEventsInversifyService',
    )
    let vester: Vester | undefined = undefined
    try {
      vester = await this.wrappers.selectEnum('vester (or [n]one for all events)', Vester, undefined, [BACK, NONE])
    } catch (error) {
      if (error.message !== NONE.error) {
        throw error
      }
    }
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const account = answer === 'a' ? undefined : answer.length !== 42 ? address : answer
    const { allEvents } = await eventsService.getEvents({ vester, account })
    this.wrappers.writeOutput(`all events:\n${allEvents.map(eventsService.eventToString).join('\n')}`)
  }
}
