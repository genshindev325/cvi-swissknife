import type { ILProtectionInversifyService } from '@coti-cvi/lw-sdk'
import { isDev, CHAIN_IDS_INFO, toTimeString } from '@coti-cvi/lw-sdk'
import { BigNumber } from 'ethers'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import { BACK } from './constants'
import type { Wrappers } from './wrappers'

export class Il {
  public readonly ilMenu: Record<string, MenuItem> = {
    at: {
      description: 'advance time to protection end',
      action: () => this.advanceTimeToEndOfProtection(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    1: { description: 'account info', action: () => this.accountInfo() },
    2: { description: 'pairs info', action: () => this.pairsInfo() },
    a: { description: 'add liquidity', action: () => this.addLiquidity() },
    w: { description: 'withdraw liquidity', action: () => this.withdrawLiquidity() },
    p: { description: 'purchase il protection', action: () => this.buyProtection() },
    c: { description: 'close il protection', action: () => this.closeProtection() },
    u: { description: 'upkeep', action: () => this.upkeep() },
    g: { description: 'grant liquidity provider role', action: () => this.grantRole() },
    t: { description: 'transfer', action: () => this.transfer() },
    e: { description: 'events', action: () => this.events() },
    s: { description: 'get protected sum', action: () => this.sum() },
    es: { description: 'get protected events sum', action: () => this.eventsSum() },
    ed: { description: 'enable/disable NFT discount (owner)', action: () => this.setEnabledNFTDiscount() },
    em: { description: 'check for embded discount', action: () => this.checkForEmbedDiscount() },
    m: {
      description: 'mint embd discount (by impersonating embed)',
      action: () => this.mintEmbedDiscountForWallet(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<ILProtectionInversifyService> {
    const chainId = this.inverifyContext.useILChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'ILProtectionInversifyService',
    )
  }

  public async pairsInfo(): Promise<void> {
    const service = await this.getService()
    const pairs = await service.getPairs()
    const avalibleToProtect = await Promise.all(pairs.map(async pair => service.getLeftTvpUsdcAvailable(pair)))
    pairs.map((pair, i) =>
      this.wrappers.writeOutput(
        `[${pair.tokenName1}-${pair.tokenName2}]: Available to protect: ${service.tokenUSDC.toString(
          avalibleToProtect[i],
        )}`,
      ),
    )
  }

  public async events(): Promise<void> {
    const service = await this.getService()
    const boughtFilter = service.ilContractsInversifyService.controller.filters.ProtectionBought()
    const closedFilter = service.ilContractsInversifyService.controller.filters.ProtectionClosed()

    const events = await Promise.all([
      service.ilContractsInversifyService.controller.queryFilter(boughtFilter),
      service.ilContractsInversifyService.controller.queryFilter(closedFilter),
    ])
    events
      .flat()
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .forEach(event => {
        this.wrappers.writeOutput(
          `[${event.blockNumber}] ${event.args.id}: ${event.event} ${service.tokenUSDC.toString(
            event.args.premiumCostUSD,
          )}`,
        )
      })
  }

  public async eventsSum(): Promise<void> {
    const service = await this.getService()
    const events = await service.ilContractsInversifyService.nft.queryFilter(
      service.ilContractsInversifyService.nft.filters.ProtectionMint(),
    )
    const eventsSum = events.reduce((acc, event) => acc.add(event.args.lpTokensWorthAtBuyTimeUSD), BigNumber.from(0))
    this.wrappers.writeOutput(`eventsSum: ${service.tokenUSDC.toString(eventsSum)}`)
  }

  public async mintEmbedDiscountForWallet() {
    const signerService = this.inverifyContext.signerInversifyService
    const embed = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'EmbedArmadilloDiscountInversifyService',
    )
    const embedHardhatImpersonationInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'EmbedHardhatImpersonationInversifyService',
    )

    if (embed.discountTypesInfo.length === 0) {
      this.wrappers.writeOutput(`no embed discount types found. please investigate`)
      return
    }

    const answer1 = await this.wrappers.question(
      `enter address for embed discount minting or enter for current address`,
    )
    const address = answer1 || signerService.address

    this.wrappers.writeOutput(
      `selected address for minting is "${address}" (${
        address === signerService.address ? 'current address' : 'given address'
      })`,
    )

    const answer2 = await this.wrappers.question(
      `enter type (number) of embed discount: ${embed.discountTypesInfo
        .map(d => `${d.typeId} (${d.name})`)
        .join(', ')}. nothing for default: ${embed.discountTypesInfo[0].typeId}`,
    )
    const discountTypeId = Number(answer2) || embed.discountTypesInfo[0].typeId

    this.wrappers.writeOutput(`selected discount for minting is "${discountTypeId}"`)

    await embedHardhatImpersonationInversifyService.mintNft(address, discountTypeId)

    this.wrappers.writeOutput(`minted embed discount "${discountTypeId}" for address: ${address}`)
  }

  public async checkForEmbedDiscount(): Promise<void> {
    const signerService = this.inverifyContext.signerInversifyService
    const embed = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'EmbedArmadilloDiscountInversifyService',
    )

    const answer = await this.wrappers.question(
      `do you want to chk current address or override? (if yes, enter address)`,
    )

    const address = answer || signerService.address

    const result = await embed.getEligiblilityForEmbedDiscount(address)

    if (result) {
      this.wrappers.writeOutput(JSON.stringify(result, null, 2))
    } else {
      this.wrappers.writeOutput(`No embed discount eligibility found for this user`)
    }
  }

  public async sum(): Promise<void> {
    const service = await this.getService()
    const sum = await service.ilContractsInversifyService.controller.cumulativeSumLPTokensWorthAtBuyTimeUSD()
    this.wrappers.writeOutput(`sum: ${service.tokenUSDC.toString(sum)}`)
  }

  public async accountInfo(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const providerService = this.inverifyContext.ethersJsonRpcBatchProvider
    const ilAdminApiInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'ILAdminApiInversifyService',
    )
    const currentBlockNumber = await this.inverifyContext.latestBlockInfoInversifyService
      .getCurrentBlock()
      .then(r => r.number)
    const walletsProtections = await ilAdminApiInversifyService.getOldProtections(
      currentBlockNumber,
      signerService.address,
    )
    const walletProtections = Array.from(walletsProtections.get(signerService.address)?.values() ?? [])
    const { timestamp } = await providerService.getBlock('latest')
    walletProtections
      .filter(p => !p.expiredEvent)
      .forEach((item, i) =>
        this.wrappers.writeOutput(`${service.protectionToString(item, timestamp)}\n\t - raw: ${JSON.stringify(item)}`),
      )
    walletProtections
      .filter(p => p.expiredEvent)
      .forEach(item =>
        this.wrappers.writeOutput(`${service.protectionToString(item, timestamp)}\n\t - raw: ${JSON.stringify(item)}`),
      )
  }

  public async advanceTimeToEndOfProtection(): Promise<void> {
    const timeService = this.inverifyContext.HardhatAdvanceTimeInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    const { timestamp } = await timeService.ethersJsonRpcBatchProvider.getBlock('latest')
    const ilAdminApiInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'ILAdminApiInversifyService',
    )
    const currentBlockNumber = await this.inverifyContext.latestBlockInfoInversifyService
      .getCurrentBlock()
      .then(r => r.number)
    const walletsProtections = await ilAdminApiInversifyService.getOldProtections(
      currentBlockNumber,
      signerService.address,
    )
    const walletProtections = Array.from(walletsProtections.get(signerService.address)?.values() ?? [])

    const choice = await this.wrappers.selectItem(
      'choose protection (first -> new protections)',
      walletProtections
        .filter(p => !p.expiredEvent)
        .sort((a, b) => a.boughtEvent.args.protectionStartTimestamp - b.boughtEvent.args.protectionStartTimestamp),
      i =>
        `[${i.boughtEvent.args.id.toString()}] time left: ${toTimeString(
          i.boughtEvent.args.protectionEndTimestamp - timestamp,
        )} (${new Date(i.boughtEvent.args.protectionEndTimestamp * 1000).toISOString()})`,
    )
    const timePassed = await timeService.setTime(choice.boughtEvent.args.protectionEndTimestamp + 1)
    this.wrappers.writeOutput(`advanced ${toTimeString(timePassed)}`)
  }

  public async addLiquidity(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const balanceUSDC = await service.tokenUSDC.balanceToString(signerService.address)
    const answer = await this.wrappers.question(`liquidity to add amount - number [${balanceUSDC}]`)
    if (isNaN(+answer)) {
      throw new Error('invalid amount')
    }
    const amountUSD = +answer
    const receipt = await service.addLiquidity(amountUSD)
    this.wrappers.writeOutput(`added liquidity: ${receipt.transactionHash}`)
  }

  public async withdrawLiquidity(): Promise<void> {
    const service = await this.getService()
    const amount = await service.getLiquidity()
    const answer = await this.wrappers.question(
      `liquidity to withdraw amount - number [${service.tokenUSDC.toString(amount)}]`,
    )
    if (isNaN(+answer)) {
      throw new Error('invalid amount')
    }
    const amountUSD = +answer
    const receipt = await service.withdrawLiquidity(amountUSD)
    this.wrappers.writeOutput(`withdrawn liquidity: ${receipt.transactionHash}`)
  }

  public async buyProtection(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const periods = await service.getPeriodsSeconds()
    const [balanceUSDC, pairs] = await Promise.all([
      service.tokenUSDC.balanceToString(signerService.address),
      service.getPairs(),
    ])
    const pair = await this.wrappers.selectItem('pair', pairs, pair => `${pair.tokenName1}-${pair.tokenName2}`)
    const period = await this.wrappers.selectItem('policy period', periods, period => period.periodSecondsFormat)
    const answer = await this.wrappers.question(`enter open amount - number [${balanceUSDC}]`)
    if (isNaN(+answer)) {
      throw new Error('invalid amount')
    }
    const amountUSD = +answer
    const receipt = await service.buyProtection({
      pair,
      amountUSD,
      periodSeconds: period.periodSeconds,
      maxPremiumCostUsdc: service.tokenUSDC.fromNumber(Number(amountUSD) * 2),
    })
    this.wrappers.writeOutput(`bought protection: ${receipt.transactionHash}`)
  }

  public async closeProtection(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const providerService = this.inverifyContext.ethersJsonRpcBatchProvider
    const { timestamp } = await providerService.getBlock('latest')
    const ilAdminApiInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'ILAdminApiInversifyService',
    )
    const currentBlockNumber = await this.inverifyContext.latestBlockInfoInversifyService
      .getCurrentBlock()
      .then(r => r.number)
    const walletsProtections = await ilAdminApiInversifyService.getOldProtections(
      currentBlockNumber,
      signerService.address,
    )
    const walletProtections = Array.from(walletsProtections.get(signerService.address)?.values() ?? [])

    const choice = await this.wrappers.selectItem(
      'choose protection to close from protections that should be expired (first -> new protections)',
      walletProtections
        .filter(p => !p.expiredEvent)
        .filter(i => i.boughtEvent.args.protectionEndTimestamp < timestamp)
        .sort((a, b) => a.boughtEvent.args.protectionStartTimestamp - b.boughtEvent.args.protectionStartTimestamp),
      i =>
        `[${i.boughtEvent.args.id.toString()}] time left: ${toTimeString(
          i.boughtEvent.args.protectionEndTimestamp - timestamp,
        )} (${new Date(i.boughtEvent.args.protectionEndTimestamp * 1000).toISOString()})`,
    )
    const receipt = await service.closeProtection(choice.boughtEvent.args.id)
    this.wrappers.writeOutput(`closed protection ${choice.boughtEvent.args.id}: ${receipt.transactionHash}`)
  }

  public async upkeep(): Promise<void> {
    const service = await this.getService()
    const receipt = await service.checkAndPerformUpkeep()
    if (receipt) {
      this.wrappers.writeOutput(`performed upkeep: ${receipt.transactionHash}`)
    } else {
      this.wrappers.writeOutput('skipped upkeep')
    }
  }

  public async grantRole(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const owner = await service.ilContractsInversifyService.controller.owner()
    const deployerSigner = service.getContractInversifyService.provider.getSigner(owner)
    const receipt = await service.grantLiquidityProviderRole(deployerSigner, signerService.address)
    this.wrappers.writeOutput(
      `granted liquidity provider role to ${signerService.address} hash:${receipt.transactionHash}`,
    )
  }

  public async setEnabledNFTDiscount(): Promise<void> {
    const service = await this.getService()
    const [owner, isEnabled] = await Promise.all([
      service.ilContractsInversifyService.ilProtectionDiscountNftController.owner(),
      service.ilContractsInversifyService.ilProtectionDiscountNftController.enabled(),
    ])
    const signer = service.getContractInversifyService.provider.getSigner(owner)
    const currenctState = `[current state: ${isEnabled ? 'enabled' : 'disabled'}]`
    const answer = await this.wrappers.select(`choose embd NFTDiscount state - ${currenctState}`, ['enable', 'disable'])
    const enabled = answer === 0
    const receipt = await service.setEnabledNFTDiscount(signer, enabled)
    this.wrappers.writeOutput(`set NFTDiscount state to ${enabled} hash:${receipt.transactionHash}`)
  }

  public async transfer(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const providerService = this.inverifyContext.ethersJsonRpcBatchProvider
    const { timestamp } = await providerService.getBlock('latest')
    const ilAdminApiInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useILChainId()].blockchainName,
      'ILAdminApiInversifyService',
    )
    const currentBlockNumber = await this.inverifyContext.latestBlockInfoInversifyService
      .getCurrentBlock()
      .then(r => r.number)
    const walletsProtections = await ilAdminApiInversifyService.getOldProtections(
      currentBlockNumber,
      signerService.address,
    )
    const walletProtections = Array.from(walletsProtections.get(signerService.address)?.values() ?? [])

    const allProtections = [
      ...walletProtections.filter(p => !p.expiredEvent),
      ...walletProtections.filter(p => p.expiredEvent),
    ]

    const choice = await this.wrappers.selectItem(
      'nft',
      allProtections,
      i => service.protectionToString(i, timestamp),
      [BACK],
      false,
    )
    const answer = await this.wrappers.question(`(string) address to transfer to`)
    const receipt = await (
      await service.ilContractsInversifyService.nft.transferFrom(
        signerService.address,
        answer,
        choice.boughtEvent.args.id,
      )
    ).wait()
    this.wrappers.writeOutput(`transfered success hash:${receipt.transactionHash}`)
  }
}
