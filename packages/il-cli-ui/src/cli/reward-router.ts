import type { RewardRouterInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, isNum, StakedTokenName } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'
import { BACK, NONE } from './constants'

export class RewardRouter {
  public readonly RewardRouterMenu: { [key: string]: MenuItem } = {
    i: { description: 'info', action: () => this.info() },
    s: { description: 'stake', action: () => this.stake() },
    u: { description: 'unstake', action: () => this.unstake() },
    c: { description: 'claim', action: () => this.claim() },
    m: { description: 'compound', action: () => this.compound() },
    t: { description: 'signal transfer', action: () => this.signalTransfer() },
    a: { description: 'accept transfer', action: () => this.acceptTransfer() },
    e: { description: 'events', action: () => this.events() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<RewardRouterInversifyService> {
    const chainId = this.inverifyContext.useVestingChainId()
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenGOVI')
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenEsGOVI')
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'RewardRouterInversifyService',
    )
  }

  public async info(): Promise<void> {
    const service = await this.getService()
    const tokens = [service.tokenGOVI, service.tokenEsGOVI, service.tokenThetaCvi]
    const accounts: [name: string, address: string][] = [
      ['govi distributor', service.vestingContractsInversifyService.goviRewardTrackerDistributor.address],
      ['govi tracker', service.vestingContractsInversifyService.goviRewardTracker.address],
      ['govi vester', service.vestingContractsInversifyService.goviVester.address],
      ['thetaVault distributor', service.vestingContractsInversifyService.thetaVaultRewardTrackerDistributor.address],
      ['thetaVault tracker', service.vestingContractsInversifyService.thetaVaultRewardTracker.address],
      ['thetaVault vester', service.vestingContractsInversifyService.thetaVaultVester.address],
    ]
    const balances = await Promise.all(
      tokens.flatMap(t => accounts.map(async ([n, a]) => `[${t.symbol}] - ${n}: ${await t.balanceToString(a)}`)),
    )

    this.wrappers.writeOutput(`balances:\n${balances.join('\n')}`)
  }

  public async stake(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof StakedTokenName) => Promise<string> = async key =>
      `[${key}] - balance: ${await service.getStakeToken(StakedTokenName[key]).balanceToString(address)}`
    const stakedToken = await this.wrappers.selectEnum('staked token', StakedTokenName, printerFunction)
    const balance = await service.getStakeToken(stakedToken).balanceToString(address)
    const answer = await this.wrappers.question(`enter stake amount - number [${balance}] (leave empty for full stake)`)
    const response = isNum(answer) ? await service.stake(stakedToken, +answer) : await service.stakeAll(stakedToken)
    if (response) {
      this.wrappers.writeOutput(`staked, txHash: ${response.transactionHash}`)
    }
  }

  public async unstake(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof StakedTokenName) => Promise<string> = async key =>
      `[${key}] - unstakable: ${(await service.getUnstakableBalance(StakedTokenName[key], address)).balanceString}`
    const stakedToken = await this.wrappers.selectEnum('staked token', StakedTokenName, printerFunction)
    const { balanceString } = await service.getUnstakableBalance(stakedToken, address)
    const answer = await this.wrappers.question(
      `enter unstake amount - number [${balanceString}] (leave empty for full unstake)`,
    )
    const response = isNum(answer) ? await service.unstake(stakedToken, +answer) : await service.unstakeAll(stakedToken)
    if (response) {
      this.wrappers.writeOutput(`unstaked, txHash: ${response.transactionHash}`)
    }
  }

  public async claim(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof StakedTokenName) => Promise<string> = async key =>
      `[${key}] - claimable: ${(await service.claimable(StakedTokenName[key], address)).claimableEsGoviString}`
    const stakedToken = await this.wrappers.selectEnum('staked token', StakedTokenName, printerFunction)
    const response = await service.claim(stakedToken)
    if (response) {
      this.wrappers.writeOutput(`claimed, txHash: ${response.transactionHash}`)
    }
  }

  public async compound(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const printerFunction: (key: keyof typeof StakedTokenName) => Promise<string> = async key =>
      `[${key}] - claimable: ${(await service.claimable(StakedTokenName[key], address)).claimableEsGoviString}`
    const stakedToken = await this.wrappers.selectEnum('staked token', StakedTokenName, printerFunction)
    const response = await service.compound(stakedToken)
    if (response) {
      this.wrappers.writeOutput(`compounded, txHash: ${response.transactionHash}`)
    }
  }

  public async signalTransfer(): Promise<void> {
    const service = await this.getService()
    const account = await this.wrappers.selectAccount('select receiver account')
    const response = await service.signalTransfer(account)
    if (response) {
      this.wrappers.writeOutput(`signal transfered, txHash: ${response.transactionHash}`)
    }
  }

  public async acceptTransfer(): Promise<void> {
    const service = await this.getService()
    const account = await this.wrappers.selectAccount('select sender account')
    const response = await service.acceptTransfer(account)
    if (response) {
      this.wrappers.writeOutput(`accepted transfer, txHash: ${response.transactionHash}`)
    }
  }

  public async events(): Promise<void> {
    const { address } = this.inverifyContext.signerInversifyService
    const eventsService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'RewardRouterContractsEventsInversifyService',
    )
    let stakeToken: StakedTokenName | undefined = undefined
    try {
      stakeToken = await this.wrappers.selectEnum(
        'staked token (or [n]one for all events)',
        StakedTokenName,
        undefined,
        [BACK, NONE],
      )
    } catch (error) {
      if (error.message !== NONE.error) {
        throw error
      }
    }
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const account = answer === 'a' ? undefined : answer.length !== 42 ? address : answer
    const { allEvents } = await eventsService.getEvents({ stakeToken, account })
    this.wrappers.writeOutput(`all events:\n${allEvents.map(eventsService.eventToString).join('\n')}`)
  }
}
