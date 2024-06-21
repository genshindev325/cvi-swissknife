import { Contract } from 'ethers'
import type { BigNumber } from 'ethers'
import type { JsonRpcProvider, Provider } from '@ethersproject/providers'
import { getCreate2Address } from '@ethersproject/address'
import { pack, keccak256 } from '@ethersproject/solidity'
import { abi as UNIV2_ABI } from '@uniswap/v2-core/build/UniswapV2Pair.json'
import type * as GitContractTypes from '@coti-cvi/auto-generated-code/contracts'
import { TokenCurrency } from './currency'
import type { Currency } from './currency'

const getPairAddress = (factoryAddress: string, tokenA: Currency, tokenB: Currency, codeHash: string): string => {
  const [t0, t1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  const salt = keccak256(['bytes'], [pack(['address', 'address'], [t0.address, t1.address])])
  return getCreate2Address(factoryAddress, salt, codeHash)
}

const getContract = (address: string) => {
  return new Contract(address, UNIV2_ABI) as GitContractTypes.UniswapV2Pair
}

export type Pair = {
  readonly address: string
  readonly tokenA: Currency
  readonly tokenB: Currency
}

export class UnconnectedPair {
  constructor(public readonly base: Currency, public readonly quote: Currency) {}

  public isConnected = (): boolean => false

  public toString = (): string => `${this.base.symbol}<!>${this.quote.symbol}`
}

export class ConnectedPair extends UnconnectedPair {
  constructor(
    base: Currency,
    quote: Currency,
    public readonly address: string,
    public readonly reserves: { reserve0: number; reserve1: number },
    public readonly decimals: number,
  ) {
    super(base, quote)
  }

  public get reverse(): ConnectedPair {
    return new ConnectedPair(
      this.quote,
      this.base,
      this.address,
      {
        reserve0: this.reserves.reserve1,
        reserve1: this.reserves.reserve0,
      },
      this.decimals,
    )
  }

  public override isConnected = (): this is ConnectedPair => true

  public static getAddress = (factoryAddress: string, tokenA: Currency, tokenB: Currency, codeHash: string): string => {
    return getPairAddress(factoryAddress, tokenA, tokenB, codeHash)
  }

  public static getContract = (address: string) => {
    return new Contract(address, UNIV2_ABI) as GitContractTypes.UniswapV2Pair
  }

  public static create(
    base: Currency,
    quote: Currency,
    address: string,
    reserves: { _reserve0: BigNumber; _reserve1: BigNumber; _blockTimestampLast: number },
    decimals: number,
  ) {
    return new ConnectedPair(
      base,
      quote,
      address,
      {
        reserve0: base.toNumber(base.sortsBefore(quote) ? reserves._reserve0 : reserves._reserve1),
        reserve1: quote.toNumber(base.sortsBefore(quote) ? reserves._reserve1 : reserves._reserve0),
      },
      decimals,
    )
  }

  public get currency(): TokenCurrency {
    return new TokenCurrency(this.address, `${this.base.symbol}-${this.quote.symbol}-UNIV2`, 18)
  }

  private connectedProvider?: GitContractTypes.UniswapV2Pair

  public contract(provider: JsonRpcProvider): GitContractTypes.UniswapV2Pair {
    // todo: move this section to the contractor
    if (!this.connectedProvider) {
      this.connectedProvider = getContract(this.address).connect(provider)
    }
    return this.connectedProvider
  }

  public get basePrice(): number {
    return this.reserves.reserve1 !== 0 ? this.reserves.reserve0 / this.reserves.reserve1 : 1
  }

  public get quotePrice(): number {
    return this.reserves.reserve0 !== 0 ? this.reserves.reserve1 / this.reserves.reserve0 : 1
  }

  public toString = (): string => `${this.base.symbol}<=>${this.quote.symbol} (${this.quotePrice.toPrecision(6)})`
}

export class PairFactory {
  constructor(
    public readonly factoryAddress: string,
    public readonly codeHash: string,
    private readonly provider: Provider,
  ) {}

  public buildPair = (tokenA: Currency, tokenB: Currency): Pair => {
    const address = getPairAddress(this.factoryAddress, tokenA, tokenB, this.codeHash)
    return { address, tokenA, tokenB }
  }

  public resolve = async (pair: Pair): Promise<ConnectedPair | UnconnectedPair> => {
    const contract = getContract(pair.address)
    try {
      const [reserves, decimals] = await Promise.all([
        contract.connect(this.provider).getReserves(),
        contract.connect(this.provider).decimals(),
      ])
      return ConnectedPair.create(pair.tokenA, pair.tokenB, pair.address, reserves, decimals)
    } catch (e) {
      return new UnconnectedPair(pair.tokenA, pair.tokenB)
    }
  }

  public resolveConnected = async (pair: Pair): Promise<ConnectedPair> => {
    const contract = getContract(pair.address)
    const [reserves, decimals] = await Promise.all([
      contract.connect(this.provider).getReserves(),
      contract.connect(this.provider).decimals(),
    ])
    return ConnectedPair.create(pair.tokenA, pair.tokenB, pair.address, reserves, decimals)
  }
}
