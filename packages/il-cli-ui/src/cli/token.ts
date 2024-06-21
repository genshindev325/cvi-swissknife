import type { TokenInterface } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, BlockchainName, getNamedAccounts, UntypedToken, isNum } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

const deploymentsOfInterest: Record<BlockchainName, string[]> = {
  [BlockchainName.POLYGON]: ['LiquidityController'],
  [BlockchainName.ARBITRUM]: ['CVIUSDCPlatform'],
  [BlockchainName.ETHEREUM]: [],
}

export class Token {
  public readonly TokenMenu: { [key: string]: MenuItem } = {
    1: { description: 'get named balances', action: () => this.namedBalances() },
    t: { description: 'transfer', action: () => this.transfer() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getToken(): Promise<TokenInterface> {
    const chainId = this.inverifyContext.useCVIChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'TokenUSDC')
  }

  public async namedBalances(): Promise<void> {
    const contractService = this.inverifyContext.getContractInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    const chainId = this.inverifyContext.chainId
    const token = await this.getToken()
    const namedAccounts = getNamedAccounts({ chainId })

    const accountsOfInterest: { name: string; address: string }[] = [
      { name: 'signer', address: signerService.address },
      ...namedAccounts.map(a => ({ name: a.name, address: a.address })),
      ...deploymentsOfInterest[CHAIN_IDS_INFO[chainId].blockchainName].map(d => ({
        name: d,
        address: contractService.getAddressOfDeployment(d),
      })),
    ]

    const balances = await Promise.all(accountsOfInterest.map(async a => token.balanceToString(a.address)))
    accountsOfInterest.forEach((a, i) => this.wrappers.writeOutput(`[${a.name}-${a.address}] balance: ${balances[i]}`))
  }

  public async transfer(): Promise<void> {
    const service = this.inverifyContext.uniswapInversifyService
    const { signer, address } = this.inverifyContext.signerInversifyService
    const choice = await this.wrappers.selectItem('choose token', Object.values(service.currencies), i => `${i.symbol}`)
    const token = UntypedToken.fromCurrency(choice, signer)
    const balance = await token.balanceToString(address)
    const amountAnswer = await this.wrappers.question(`(number) enter amount to transfer [balance: ${balance}]`)
    if (!isNum(amountAnswer)) {
      throw new Error('invalid amount')
    }
    const addressAnswer = await this.wrappers.question(`(address) enter address to transfer`)
    await token.transfer(signer, addressAnswer, +amountAnswer)
    this.wrappers.writeOutput(`transfered ${+amountAnswer} to ${addressAnswer}`)
  }
}
