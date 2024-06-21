import type { StakingInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, isNum, toTimeString } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class Staking {
  public readonly StakingMenu: { [key: string]: MenuItem } = {
    e: { description: 'get events', action: () => this.events() },
    i: { description: 'info', action: () => this.info() },
    t: { description: 'tvl', action: () => this.tvl() },
    a: { description: 'apy', action: () => this.apy() },
    c: { description: 'current stake', action: () => this.staked() },
    s: { description: 'stake', action: () => this.stake() },
    u: { description: 'unstake', action: () => this.unstake() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<StakingInversifyService> {
    const chainId = this.inverifyContext.useTVChainId()
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenGOVI')
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'StakingInversifyService',
    )
  }

  public async info(): Promise<void> {
    const service = await this.getService()
    const stakingVaultAddress = service.cviContractsInversifyService.stakingVault.address
    const [stakingVaultBalance, { rewardRateNumber }] = await Promise.all([
      service.tokenGOVI.balanceToString(stakingVaultAddress),
      service.getRewardRate(),
    ])
    const period = 86400 * 7 // week
    const rewardRatePerWeek = rewardRateNumber * period
    this.wrappers.writeOutput(`[${stakingVaultAddress}] staking vault balance: ${stakingVaultBalance}`)
    this.wrappers.writeOutput(`reward: ${rewardRatePerWeek} GOVI per ${toTimeString(period)}`)
  }

  public async tvl(): Promise<void> {
    const service = await this.getService()
    const tvlData = await service.getTVL()
    if (tvlData.data && tvlData.status === 'resolved') {
      this.wrappers.writeOutput(`tvl: ${tvlData.data}`)
    }
  }

  public async apy(): Promise<void> {
    const service = await this.getService()
    const apy = await service.getAPY()
    if (apy.data && apy.status === 'resolved') {
      this.wrappers.writeOutput(`apy: ${apy.data}%`)
    }
  }

  public async staked(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const result = await service.getStake(signerService.address)
    if (result.data) {
      this.wrappers.writeOutput(
        `stake: ${service.tokenGOVI.toString(result.data.currentStakeAmount)} (${result.data.share}%)`,
      )
    }
  }

  public async events(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const account = answer === 'a' ? undefined : answer.length !== 42 ? signerService.address : answer
    const { allEvents } = await service.getBaseEvents(account)
    this.wrappers.writeOutput(`${allEvents.length} events:\n${allEvents.map(e => JSON.stringify(e)).join('\n')}`)
  }

  public async stake(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const balance = await service.tokenGOVI.balanceToString(signerService.address)
    const answer = await this.wrappers.question(`enter stake amount - number [${balance}]`)
    if (!isNum(answer)) {
      throw new Error('invalid amount')
    }
    const amount = +answer
    const response = await service.stake(amount)
    if (response) {
      this.wrappers.writeOutput(`txHash: ${response.transactionHash}`)
    }
  }

  public async unstake(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const stakeData = await service.getStake(signerService.address)
    if (stakeData.data && stakeData.status === 'resolved') {
      const answer = await this.wrappers.question(
        `enter unstake amount - number [${service.tokenGOVI.toString(
          stakeData.data.currentStakeAmount,
        )}] (leave empty for full unstake)`,
      )
      const response = isNum(answer) ? await service.unstake(+answer) : await service.unstakeAll()
      if (response) {
        this.wrappers.writeOutput(`txHash: ${response.transactionHash}`)
      }
    }
  }
}
