import type { CviOldPlatformContractsEventsInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, toTimeString, toNumber, isNum } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class Platform {
  public readonly PlatformMenu: { [key: string]: MenuItem } = {
    p: { description: 'position events', action: () => this.positionEvents() },
    l: { description: 'liquidity events', action: () => this.liquidityEvents() },
    1: { description: 'liquidity balance', action: () => this.liquidityBalance() },
    i: { description: 'platform info', action: () => this.platformInfo() },
    m: { description: 'set max time allowed after last round (owner)', action: () => this.maxTimeAllowed() },
    w: { description: 'withdraw', action: () => this.withdraw() },
    s: { description: 'lp stats', action: () => this.lpStats() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<CviOldPlatformContractsEventsInversifyService> {
    const chainId = this.inverifyContext.useCVIChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CviOldPlatformContractsEventsInversifyService',
    )
  }

  public async lpStats(): Promise<void> {
    const service = await this.getService()
    const answer = await this.wrappers.question(`(number) period of last number of days (leave empty for all days)`)
    const fromBlock = isNum(answer)
      ? (await this.inverifyContext.latestBlockInfoInversifyService.getBlockSecondsAgo(+answer * 86400)).block
      : undefined
    const toBlock = undefined
    const { depositEvents, events } = await service.getLiquidityEvents({ fromBlock, toBlock })
    const acc = service.getUniqueAccountsFromEvents(depositEvents).sort()
    const accounts = acc
    const [balancesStart, balancesEnd] = await Promise.all([
      Promise.all(accounts.map(account => service.getLiquidityBalance({ account, block: fromBlock }))),
      Promise.all(accounts.map(account => service.getLiquidityBalance({ account, block: toBlock }))),
    ])
    const pnls = accounts.map(a => {
      const accountEvents = events.filter(e => e.args.account === a)
      const balanceStart = balancesStart.find(b => b.account === a)
      const balanceEnd = balancesEnd.find(b => b.account === a)
      if (balanceStart === undefined || balanceEnd === undefined) {
        throw new Error('balances are undefined')
      }
      return service.calculateLiquidityPNL(a, balanceStart, balanceEnd, accountEvents)
    })
    this.wrappers.writeOutput(
      pnls
        .sort((a, b) => b.percent - a.percent)
        .map(({ account, pnlString, percentString }) => `[${account}] ${pnlString} ${percentString}`)
        .join('\n'),
    )
  }

  public async liquidityBalance(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const { usdcBalanceString } = await service.getLiquidityBalance({ account: address })
    this.wrappers.writeOutput(`liquidity balance: ${usdcBalanceString}`)
  }

  public async platformInfo(): Promise<void> {
    const service = await this.getService()
    const [buyersLockup, lpLockup] = await Promise.all([
      service.platform.buyersLockupPeriod(),
      service.platform.lpsLockupPeriod(),
    ])
    this.wrappers.writeOutput(
      `buyersLockup: ${toTimeString(buyersLockup.toNumber())} lpLockup: ${toTimeString(lpLockup.toNumber())}`,
    )
  }

  public async positionEvents(): Promise<void> {
    const service = await this.getService()
    const answer = await this.wrappers.question(`(string) address to filter (leave empty to get all events)`)
    const account = answer.length !== 42 ? undefined : answer
    const { openedEvents, closedEvents, liquidatedEvents, events } = await service.getPositionEvents({ account })
    console.log(`open events: ${JSON.stringify(openedEvents)}`)
    console.log(`close events: ${JSON.stringify(closedEvents)}`)
    console.log(`liquidated events: ${JSON.stringify(liquidatedEvents)}`)
    this.wrappers.writeOutput(`events length: ${events.length}`)
    this.wrappers.writeOutput(`events: ${events.map(service.positionEventToString)}`)
  }

  public async liquidityEvents(): Promise<void> {
    const service = await this.getService()
    const answer = await this.wrappers.question(`(string) address to filter (leave empty to get all events)`)
    const account = answer.length !== 42 ? undefined : answer
    const { depositEvents, withdrawEvents, events } = await service.getLiquidityEvents({ account })
    console.log(`deposit events: ${JSON.stringify(depositEvents)}`)
    console.log(`withdraw events: ${JSON.stringify(withdrawEvents)}`)
    this.wrappers.writeOutput(`events length: ${events.length}`)
    this.wrappers.writeOutput(`events: ${events.map(service.liquidityEventsToString)}`)
  }

  public async maxTimeAllowed(): Promise<void> {
    const service = await this.getService()
    const providerService = this.inverifyContext.providerInversifyService
    const owner = await service.platform.owner()
    const ownerSigner = providerService.provider.getSigner(owner)
    await service.platform.connect(ownerSigner).setMaxTimeAllowedAfterLatestRound(356 * 24 * 60 * 60)
  }

  public async withdraw(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const balanceAmount = await service.platform.balanceOf(signerService.address)
    const balance = toNumber(balanceAmount, 18)
    console.log(`balance: ${balance}`)
    const answer = await this.wrappers.question(`(number) amount to withdraw (empty to withdraw all) [${balance}]`)

    await service.platform
      .connect(signerService.signer)
      .withdrawLPTokens(isNum(answer) ? toNumber(balanceAmount, 18) : balanceAmount)

    const balanceAfter = await service.platform.balanceOf(signerService.address)
    console.log(`balance after: ${toNumber(balanceAfter, 18)}`)
  }
}
