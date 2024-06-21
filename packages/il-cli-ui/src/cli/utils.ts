import axios from 'axios'
import { Wallet } from 'ethers'
import type { ChainId, MainnetWhale } from '@coti-cvi/lw-sdk'
import { getHardhatAPIURL } from '@coti-cvi/lw-sdk'
import {
  getNamedAccounts,
  MAINNET_WHALES_BY_CHAIN,
  bigNumberToString,
  isNum,
  toTimeString,
  CHAIN_IDS_INFO,
  isDev,
} from '@coti-cvi/lw-sdk'
import { deploymentTags } from '@coti-cvi/auto-generated-code'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'
import { DEV_ACCOUNTS } from './constants'

export class Utils {
  public readonly utilMenu: Record<string, MenuItem> = {
    a: {
      description: 'advance time',
      action: () => this.advanceTime(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    m: {
      description: 'set auto mine',
      action: () => this.automine(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    i: {
      description: 'set mining interval',
      action: () => this.miningInterval(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    1: {
      description: 'impersonate account',
      action: () => this.impersonate(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    2: {
      description: 'stop impersonating account',
      action: () => this.stopImpersonating(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    3: {
      description: 'set balance to account',
      action: () => this.setBalance(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    4: {
      description: 'get tokens',
      action: () => this.getTokens(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    r: {
      description: 'reset fork',
      action: () => this.resetFork(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    c: { description: 'change chain', action: () => this.changeChainId() },
    s: { description: 'change and impersonate signer account', action: () => this.changeSigner() },
    l: { description: 'load signer account', action: () => this.loadSigner() },
    g: { description: 'get block', action: () => this.block() },
    bc: { description: 'get bytecode', action: () => this.bytecode() },
    cs: {
      description: 'create snapshot',
      action: () => this.createSnapshot(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    rs: {
      description: 'revert to snapshot',
      action: () => this.revertSnapshot(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    d: { description: 'deploy', action: () => this.deploy(), condition: () => isDev(this.inverifyContext.chainId) },
    mm: { description: 'metamask connect', action: () => this.connectWallet('MetaMask') },
    wc: { description: 'wallet connect', action: () => this.connectWallet('WalletConnect') },
    cb: { description: 'coin base connect', action: () => this.connectWallet('Coinbase Wallet') },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  public async connectWallet(wallet: 'MetaMask' | 'WalletConnect' | 'Coinbase Wallet') {
    this.wrappers.writeOutput(`connecting wallet ${wallet}`)
    const wagmiClient = this.inverifyContext.useWagmiClient()
    // @ts-ignore
    const connector = wagmiClient.connectors.find(c => c.name === wallet)
    if (!connector) {
      throw new Error(`invalid connector name ${wallet}`)
    }
    const { account } = await connector.connect()
    const signer = await connector.getSigner()
    this.inverifyContext.setSigner({ signer })
    this.wrappers.writeOutput(`connected account ${account}`)
  }

  public async getTokens(): Promise<void> {
    const hardhatService = this.inverifyContext.hardhatCommandsInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const { address } = this.inverifyContext.signerInversifyService
    const whales = MAINNET_WHALES_BY_CHAIN[CHAIN_IDS_INFO[this.inverifyContext.chainId].blockchainName]
    const sendToken = async ({ tokenName, tokenAddress, whaleAccount }: MainnetWhale) => {
      const token = this.inverifyContext.getContractInversifyService.getGenericErc20TokenByAddress(tokenAddress)
      const [balance] = await Promise.all([
        token.balanceOf(whaleAccount),
        hardhatService.impersonateAccountCommand(whaleAccount),
        hardhatService.setBalance(whaleAccount, 1),
      ])
      await token.connect(provider.getSigner(whaleAccount)).transfer(address, balance)
      this.wrappers.writeOutput(`${tokenName} transferred ${balance.toString()} from ${whaleAccount} to ${address}`)
    }
    await Promise.all(whales.map(w => sendToken(w)))
  }

  public async setupAllAccounts(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const accounts = [...DEV_ACCOUNTS, ...getNamedAccounts({ chainId: this.inverifyContext.chainId })]
    await Promise.all(
      accounts.flatMap(({ address }) => [
        service.impersonateAccountCommand(address),
        service.setBalance(address, 10000),
      ]),
    )
  }

  public async deploy(): Promise<void> {
    const chainId = this.inverifyContext.useHardhatChainId()
    const tags = deploymentTags.map((t, i) => `${t}${i % 5 === 0 ? '\n' : ', '}`).join('')
    const answer = await this.wrappers.question(`(coma separated string) deployment tags - tags: ${tags}`)
    if (answer.length === 0) {
      throw new Error('invalid tags')
    }
    console.log(`url: ${getHardhatAPIURL(chainId)}/deploy`)
    const res = await axios.get(getHardhatAPIURL(chainId) + '/deploy', { params: { tags: answer } })
    this.wrappers.writeOutput(`deploy res ${JSON.stringify(res.data)}`)
  }

  public async createSnapshot(): Promise<void> {
    const { provider } = this.inverifyContext.providerInversifyService
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const snapshotId = await service.createSnapshot()
    localStorage.setItem('snapshotId', snapshotId)
    const { number } = await provider.getBlock('latest')
    this.wrappers.writeOutput(`created snapshot with id: ${snapshotId} (can only be used once) - at block ${number}`)
  }

  public async revertSnapshot(): Promise<void> {
    const { provider } = this.inverifyContext.providerInversifyService
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const { number: before } = await provider.getBlock('latest')
    const snapshotId = localStorage.getItem('snapshotId')
    const snapshotIdString = snapshotId ? ` (or empty for saved snapshot ${snapshotId})` : ''
    const answer = await this.wrappers.question(`(string) snapshot id - at block: ${before}${snapshotIdString}`)
    const id = answer.length === 0 && snapshotId ? snapshotId : answer
    const success = await service.revertToSnapshot(answer.length === 0 && snapshotId ? snapshotId : answer)
    if (success) {
      const { number } = await provider.getBlock('latest')
      await this.createSnapshot()
      const timePassed = await this.inverifyContext.HardhatAdvanceTimeInversifyService.simpleAdvanceTime(1)
      this.wrappers.writeOutput(`reverted to snapshot: ${id} - at block: ${number} (${toTimeString(timePassed)})`)
    } else {
      this.wrappers.writeOutput(`not reverted - invalid snapshot id`)
    }
  }

  public async bytecode(): Promise<void> {
    const service = this.inverifyContext.providerInversifyService
    const answer = await this.wrappers.question(`(string) contract address`)
    const bytecode = await service.provider.getCode(answer)
    this.wrappers.writeOutput(JSON.stringify(bytecode))
  }

  public async block(): Promise<void> {
    const service = this.inverifyContext.providerInversifyService
    const answer = await this.wrappers.question(`(number) block number (${await service.provider.getBlockNumber()})`)
    const { number, timestamp, hash } = await service.provider.getBlock(isNum(answer) ? +answer : 'latest')
    this.wrappers.writeOutput(`[${number}]: ${timestamp} (${new Date(timestamp * 1000).toLocaleString()}) ${hash}`)
  }

  public async advanceTime(): Promise<void> {
    const service = this.inverifyContext.HardhatAdvanceTimeInversifyService
    const period = await this.wrappers.selectTimePeriod()
    const answer = await this.wrappers.question(`(number) advance ${period[0]}`)
    if (!isNaN(+answer)) {
      const timePassed = await service.simpleAdvanceTime(+answer * period[1])
      this.wrappers.writeOutput(`advanced ${toTimeString(timePassed)}`)
    } else {
      this.wrappers.writeOutput('canceling: not a number')
    }
  }

  public async automine(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const current = await service.getAutomineCommand()

    const answer = await this.wrappers.question(`(string) set automine state (t/f) (current state:${current}}`)
    if (answer === 't') {
      await service.setAutomineCommand(true)
    } else if (answer === 'f') {
      await service.setAutomineCommand(false)
    } else {
      this.wrappers.writeOutput('canceling: invalid answer')
    }
  }

  public async miningInterval(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const answer = await this.wrappers.question(`(number) mining interval in seconds (0 to disable)`)
    if (!isNaN(+answer)) {
      await service.setIntervalMiningCommand(+answer * 1000)
    } else {
      this.wrappers.writeOutput('canceling: not a number')
    }
  }

  public async impersonate(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const answer = await this.wrappers.question(`(string) address to impersonate`)
    if (answer) {
      await service.impersonateAccountCommand(answer)
    }
  }

  public async stopImpersonating(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const answer = await this.wrappers.question(`(string) address to stop impersonating`)
    if (answer) {
      await service.stopImpersonatingAccountCommand(answer)
    }
  }

  public async setBalance(): Promise<void> {
    const signerService = this.inverifyContext.signerInversifyService
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const provider = this.inverifyContext.providerInversifyService
    const answerAddress = await this.wrappers.question(`(string) address to set balance (default: signer address)`)
    const address = answerAddress.length === 42 ? answerAddress : signerService.address
    const balance = bigNumberToString(await provider.getBalance(address), { magnitude: 18 })
    const answer = await this.wrappers.question(
      `(number) native token amount to set (default: 100000) - current balance ${balance}`,
    )
    await service.setBalance(address, isNum(answer) ? +answer : 100000)
  }

  public async resetFork(): Promise<void> {
    const service = this.inverifyContext.hardhatCommandsInversifyService
    const { address } = this.inverifyContext.signerInversifyService
    const answerBlockNumber = await this.wrappers.question(`(number) enter block number (default: latest)`)
    const blockNumber = isNum(answerBlockNumber) ? +answerBlockNumber : undefined
    await service.resetForkCommand(this.inverifyContext.chainId, blockNumber)
    const [{ number, timestamp }] = await Promise.all([
      this.inverifyContext.providerInversifyService.provider.getBlock('latest'),
      service.impersonateAccountCommand(address),
      service.setBalance(address, 10000),
      this.setupAllAccounts(),
      this.getTokens(),
    ])
    this.wrappers.writeOutput(`fork reset - now at block: ${number} (${new Date(timestamp * 1000).toLocaleString()})`)
  }

  public async changeChainId(): Promise<void> {
    const selectString = `from supported chains: (current: ${
      CHAIN_IDS_INFO[this.inverifyContext.chainId].hardhatConfigNetworkName
    })`
    const answer = await this.wrappers.selectReadonly(
      selectString,
      Object.keys(CHAIN_IDS_INFO) as ChainId[],
      i => CHAIN_IDS_INFO[i].hardhatConfigNetworkName,
    )
    this.inverifyContext.setChainId(answer)
    localStorage.setItem('chainId', answer)
    this.wrappers.writeOutput(`new chain id: ${answer}`)
  }

  public async changeSigner(): Promise<void> {
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.selectAccount(`new signer address [current: ${signerService.address}]`)
    if (answer) {
      if (isDev(this.inverifyContext.chainId)) {
        await this.inverifyContext.hardhatCommandsInversifyService.impersonateAccountCommand(answer)
      }
      this.inverifyContext.setSigner({ impersonatedPublicWalletAddress: answer })
      localStorage.setItem('account', answer)
    }
  }

  public async loadSigner(): Promise<void> {
    const { provider } = this.inverifyContext.providerInversifyService
    const privateKey = await this.wrappers.question(`enter private key`)
    const wallet = new Wallet(privateKey, provider)
    this.inverifyContext.setSigner({ privateKey })
    localStorage.setItem('account', wallet.address)
    this.wrappers.writeOutput(`loaded new signer: ${wallet.address}`)
  }
}
