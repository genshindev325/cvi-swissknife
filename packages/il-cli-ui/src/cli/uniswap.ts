import type { ConnectedPair, UnconnectedPair, ValidCurrency } from '@coti-cvi/lw-sdk'
import { TokenName, UntypedToken, isNum } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'
import { BACK, DONE } from './constants'

export class Uniswap {
  public readonly uniswapMenu: { [key: string]: MenuItem } = {
    p: { description: 'price', action: () => this.selectPath(p => this.price(p), { ignoreNative: true }) },
    a: { description: 'add liquidity', action: () => this.selectPath(p => this.addLiquidity(p), { maxPathSize: 1 }) },
    r: {
      description: 'remove liquidity',
      action: () => this.selectPath(p => this.removeLiquidity(p), { maxPathSize: 1 }),
    },
    s: { description: 'swap', action: () => this.selectPath(p => this.swap(p)) },
    e: { description: 'events', action: () => this.selectPath(p => this.events(p), { maxPathSize: 1 }) },
    tp: { description: 'test path price', action: () => this.useTestPaths(p => this.price(p)) },
    fsu: {
      description: 'fast swap usdc->cvi with $1000',
      action: () =>
        this.getCviPair().then(p => this.swap([p.reverse], { overrideAmount: 1000, overrideSlippage: 0.1 })),
    },
    fsc: {
      description: 'fast swap cvi->usdc with 10 CVI',
      action: () => this.getCviPair().then(p => this.swap([p], { overrideAmount: 10, overrideSlippage: 0.1 })),
    },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private testPaths(): ValidCurrency[][] {
    return [
      [TokenName.LINK, TokenName.WETH, TokenName.WMATIC],
      [TokenName.WMATIC, TokenName.DAI],
      [TokenName.WETH, TokenName.USDC],
      [TokenName.GOVI, TokenName.WETH, TokenName.USDC],
      [TokenName.WBTC, TokenName.USDC, TokenName.WETH, TokenName.GOVI],
      [TokenName.MATIC, TokenName.WBTC, TokenName.USDC],
    ]
  }

  private async useTestPaths(func: (path: (ConnectedPair | UnconnectedPair)[]) => Promise<unknown>) {
    const service = this.inverifyContext.uniswapInversifyService
    await Promise.allSettled(this.testPaths().map(async p => func(await service.getPairs(...service.buildPath(...p)))))
  }

  private async getCviPair(): Promise<ConnectedPair> {
    return this.inverifyContext.uniswapInversifyService.getCViPair()
  }

  private async selectPath(
    func: (path: ConnectedPair[]) => Promise<unknown>,
    options?: { ignoreNative?: boolean; maxPathSize?: number },
  ): Promise<unknown> {
    const { ignoreNative, maxPathSize } = { ignoreNative: false, maxPathSize: Number.MAX_SAFE_INTEGER, ...options }
    const service = this.inverifyContext.uniswapInversifyService
    const currencies = ignoreNative
      ? Object.values(service.currencies).filter(c => !c.isNative())
      : Object.values(service.currencies)
    const token = await this.wrappers.selectItem('select start token', currencies, c => c.symbol)
    const path = [token]
    const pairs: ConnectedPair[] = []
    try {
      for (let i = 0; i < maxPathSize; i++) {
        const rejects = pairs.length === 0 ? [BACK] : [BACK, DONE]
        const connections = await service.conections(
          currencies.filter(c => !path.includes(c)),
          path[path.length - 1],
        )
        const pair = await this.wrappers.selectItem('select next token', connections, undefined, rejects, false)
        path.push(pair.quote)
        pairs.push(pair)
      }
    } catch (error) {
      if (error.message !== DONE.error) {
        throw error
      }
    }
    return func(pairs)
  }

  public async price(pairs: (ConnectedPair | UnconnectedPair)[]): Promise<void> {
    const service = this.inverifyContext.uniswapInversifyService
    const price = await service.price(pairs)
    this.wrappers.writeOutput(`${pairs.join(' ==> ')} price: ${price.toPrecision(6)}`)
  }

  public async testPath(pairs: (ConnectedPair | UnconnectedPair)[]) {
    const service = this.inverifyContext.uniswapInversifyService
    const valid = service.isValidPath(pairs)
    this.wrappers.writeOutput(`${pairs.join(' ==> ')} valid: ${valid}`)
    if (!valid) {
      throw new Error('invalid path')
    }
  }

  public async addLiquidity(pairs: (ConnectedPair | UnconnectedPair)[]) {
    const service = this.inverifyContext.uniswapInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    if (pairs.length !== 1) {
      throw new Error(`removeLiquidity invalid path: ${pairs.join(' ==> ')}`)
    }
    const pair = pairs[0]
    if (!pair.isConnected()) {
      throw new Error(`removeLiquidity pair does not exist: ${pair}`)
    }
    const tokenA = UntypedToken.fromCurrency(pair.base, provider)
    const tokenB = UntypedToken.fromCurrency(pair.quote, provider)
    const balanceA = await tokenA.balanceToString(signerService.address)
    const balanceB = await tokenB.balanceToString(signerService.address)
    const answer = await this.wrappers.question(`enter add liquidity amount  - number [${balanceA}-${balanceB}]`)
    if (!isNum(answer)) {
      throw new Error('invalid amount')
    }
    const slippageAnswer = await this.wrappers.question(`enter slippage percent - number [0,100] (default: 0%)`)
    const slippage = isNum(slippageAnswer) ? +slippageAnswer : undefined

    const tx = await service.addLiquidity(+answer, pair, { slippage })
    this.wrappers.writeOutput(`${pair} tx: ${tx.status}`)
  }

  public async removeLiquidity(pairs: (ConnectedPair | UnconnectedPair)[]) {
    const service = this.inverifyContext.uniswapInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    if (pairs.length !== 1) {
      throw new Error(`removeLiquidity invalid path: ${pairs.join(' ==> ')}`)
    }
    const pair = pairs[0]
    if (!pair.isConnected()) {
      throw new Error(`removeLiquidity pair does not exist: ${pair}`)
    }
    const pairToken = UntypedToken.fromCurrency(pair.currency, provider)
    const balance = await pairToken.balanceToString(signerService.address)
    const answer = await this.wrappers.question(`enter remove liquidity amount  - number [${balance}]`)
    if (!isNum(answer)) {
      throw new Error('invalid amount')
    }
    const tx = await service.removeLiquidity(+answer, pair)
    this.wrappers.writeOutput(`${pair} tx: ${tx.status}`)
  }

  public async swap(pairs: ConnectedPair[], overrides?: { overrideAmount?: number; overrideSlippage?: number }) {
    await this.price(pairs)
    const service = this.inverifyContext.uniswapInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    const srcToken = UntypedToken.fromCurrency(pairs[0].base, provider)
    const dstToken = UntypedToken.fromCurrency(pairs[pairs.length - 1].quote, provider)
    const srcBalance = await srcToken.balanceToString(signerService.address)
    const dstBalance = await dstToken.balanceToString(signerService.address)
    let amount: number
    let slippage: number | undefined
    if (overrides && overrides.overrideAmount !== undefined) {
      amount = overrides.overrideAmount
    } else {
      const answer = await this.wrappers.question(`enter swap amount  - number [${srcBalance} <===> ${dstBalance}]`)
      if (!isNum(answer)) {
        throw new Error('invalid amount')
      }
      amount = +answer
    }
    if (overrides && overrides.overrideSlippage !== undefined) {
      slippage = overrides.overrideSlippage
    } else {
      const slippageAnswer = await this.wrappers.question(`enter slippage percent - number [0,100] (default: 0%)`)
      slippage = isNum(slippageAnswer) ? +slippageAnswer : undefined
    }
    const { receipt, sent, received } = await service.swap(amount, pairs, slippage)
    this.wrappers.writeOutput(`swap tx: ${receipt.status} sent: ${sent.toFixed(2)} received ${received.toFixed(2)}`)

    const srcBalanceAfter = await srcToken.balanceToString(signerService.address)
    const dstBalanceAfter = await dstToken.balanceToString(signerService.address)
    this.wrappers.writeOutput(`balances after: ${srcBalanceAfter} <===> ${dstBalanceAfter}`)
  }

  public async events(pairs: (ConnectedPair | UnconnectedPair)[]) {
    const service = this.inverifyContext.uniswapInversifyService
    const signerService = this.inverifyContext.signerInversifyService
    if (pairs.length !== 1) {
      throw new Error(`removeLiquidity invalid path: ${pairs.join(' ==> ')}`)
    }
    const pair = pairs[0]
    if (!pair.isConnected()) {
      throw new Error(`removeLiquidity pair does not exist: ${pair}`)
    }
    const senderAnswer = await this.wrappers.question(
      `(string) sender address to filter (leave empty for current signer address (a) for all events)`,
    )
    const sender = senderAnswer === 'a' ? undefined : senderAnswer.length !== 42 ? signerService.address : senderAnswer
    const events = await service.getEvents(pair, { sender })
    this.wrappers.writeOutput(`events: ${events.map(e => JSON.stringify(e)).join('\n')}`)
  }
}
