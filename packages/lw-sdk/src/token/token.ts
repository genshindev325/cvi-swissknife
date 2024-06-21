import type { BigNumber } from 'ethers'
import { Contract } from 'ethers'
import type { Overrides, Signer } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { abi as ERC20_ABI } from '@openzeppelin/contracts/build/contracts/ERC20.json'
import type { Provider, TransactionReceipt } from '@ethersproject/providers'
import { NATIVE_TOKEN_BY_CHAIN, tokenAddresses } from '../data'
import type { TokenData, InteractableTokenName } from '../data'
import { injectable } from 'inversify'
import { StrictEventEmitter } from 'strict-event-emitter'
import { Stator } from '../state'
import type { State } from '../state'
import type { IERC20, ApproveOptions, TokenInterface, TokenName, BlockchainName } from '../types'
import { tokenDecimals } from '../types'
import type { Currency } from './currency'
import { TokenCurrency, NativeCurrency } from './currency'

export class NativeToken extends NativeCurrency implements TokenInterface {
  protected constructor(
    wrappedToken: TokenCurrency,
    symbol: string,
    decimals: number,
    private readonly signerOrProvider: Signer | Provider,
  ) {
    super(wrappedToken, symbol, decimals)
  }

  public static create(blockchainName: BlockchainName, signerOrProvider: Signer | Provider): NativeToken {
    const { symbol, wrapped } = NATIVE_TOKEN_BY_CHAIN[blockchainName]
    const tokens = tokenAddresses[blockchainName] as Record<TokenName, string>
    const wrappedToken = new TokenCurrency(tokens[wrapped], wrapped, tokenDecimals[wrapped])
    return new NativeToken(wrappedToken, symbol, tokenDecimals[symbol], signerOrProvider)
  }

  public static fromCurrency(currency: NativeCurrency, signerOrProvider: Signer | Provider): NativeToken {
    return new NativeToken(currency.wrappedToken, currency.symbol, currency.decimals, signerOrProvider)
  }

  async getBalance(address: string): Promise<BigNumber> {
    return this.signerOrProvider.getBalance(address)
  }

  async transfer(signer: Signer, to: string, amount: number, overrides?: Overrides): Promise<TransactionReceipt> {
    const tokenAmount = this.fromNumber(amount)
    return (await signer.sendTransaction({ to, value: tokenAmount, ...overrides })).wait()
  }

  async approve(options: {
    signer: Signer
    to: string
    approveOptions?: ApproveOptions
    overrides: Overrides
  }): Promise<TransactionReceipt | undefined> {
    return
  }

  async balanceToString(account: string): Promise<string> {
    return this.toString(await this.getBalance(account))
  }
}

export class UntypedToken extends TokenCurrency implements TokenInterface {
  protected constructor(symbol: string, decimals: number, public readonly contract: IERC20) {
    super(contract.address, symbol, decimals)
  }

  public static getContract(address: string, signerOrProvider?: Signer | Provider | undefined): IERC20 {
    return new Contract(address, ERC20_ABI, signerOrProvider) as IERC20
  }

  public static fromCurrency(currency: Currency, signerOrProvider: Signer | Provider): UntypedToken | NativeToken {
    if (currency.isNative()) {
      return NativeToken.fromCurrency(currency, signerOrProvider)
    }
    return UntypedToken.fromTokenCurrency(currency, signerOrProvider)
  }

  public static fromTokenCurrency(tokenCurrency: TokenCurrency, signerOrProvider: Signer | Provider): UntypedToken {
    const contract = UntypedToken.getContract(tokenCurrency.address, signerOrProvider)
    return new UntypedToken(tokenCurrency.symbol, tokenCurrency.decimals, contract)
  }

  public static async fromAddress(tokenAddress: string, signerOrProvider: Signer | Provider): Promise<UntypedToken> {
    const contract = UntypedToken.getContract(tokenAddress, signerOrProvider)
    const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()])
    return new UntypedToken(symbol, decimals, contract)
  }

  async getBalance(address: string, blockNumber?: number): Promise<BigNumber> {
    return this.contract.balanceOf(address, { blockTag: blockNumber })
  }

  async transfer(signer: Signer, to: string, amount: number, overrides?: Overrides): Promise<TransactionReceipt> {
    const tokenAmount = this.fromNumber(amount)
    const contract = this.contract.connect(signer)
    if (overrides) {
      return (await contract.transfer(to, tokenAmount, overrides)).wait()
    }
    return (await contract.transfer(to, tokenAmount)).wait()
  }

  async approve({
    signer,
    to,
    approveOptions,
    overrides,
  }: {
    signer: Signer
    to: string
    approveOptions?: ApproveOptions
    overrides: Overrides
  }): Promise<TransactionReceipt | undefined> {
    if (!this.contract) {
      return
    }
    const from = await signer.getAddress()
    const contract = this.contract.connect(signer)
    const allowance: BigNumber = await this.contract.allowance(from, to)

    if (!approveOptions?.force && allowance.gt(approveOptions?.amount ?? MaxUint256.div(2))) {
      // Consider any allowance above half of max as enough - no need to re-approve since it's Infinity/2
      return
    }

    if (allowance.toString() !== '0') {
      await (await contract.approve(to, '0', overrides)).wait()
    }
    const wait = await contract.approve(to, approveOptions?.amount ?? MaxUint256, overrides)
    return wait.wait()
  }

  async balanceToString(account: string): Promise<string> {
    return this.toString(await this.getBalance(account))
  }
}

@injectable()
export class Token<T extends IERC20, _TokenName extends TokenName> extends UntypedToken {
  constructor(
    public readonly name: InteractableTokenName,
    public readonly symbol: _TokenName,
    decimals: number,
    public readonly contract: T,
  ) {
    super(symbol, decimals, contract)
  }

  public static fromTokenData<T extends IERC20, _TokenName extends TokenName>(
    tokenData: TokenData<_TokenName>,
    contract: T,
  ): Token<T, _TokenName> {
    return new Token<T, _TokenName>(tokenData.name, tokenData.symbol, tokenData.decimals, contract)
  }

  public getBalanceEventEmitter(address: string) {
    type Data = { address: string; balance: BigNumber; asNumber: number; tokenName: _TokenName }
    const eventEmitter = new StrictEventEmitter<{
      balance: (state: State<Data>) => void
    }>()

    let state: State<Data> = Stator.pending()
    const get = async () => {
      const pending = Stator.pending(state)
      eventEmitter.emit('balance', pending)
      const balance = await this.getBalance(address)
      state = Stator.resolve({
        address,
        balance,
        asNumber: this.toNumber(balance),
        tokenName: this.symbol,
      })
      eventEmitter.emit('balance', state)
    }

    const start = () => {
      const id = setInterval(get, 30_000)
      get()

      return () => {
        clearInterval(id)
      }
    }

    return {
      eventEmitter,
      start,
      get,
    }
  }
}
