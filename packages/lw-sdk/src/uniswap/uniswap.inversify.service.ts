import { inject, injectable, optional } from 'inversify'
import type { UniswapV2Factory, UniswapV2Router02 } from '@coti-cvi/auto-generated-code/contracts'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { CVISupportedChainIds } from '../types'
import { CHAIN_IDS_INFO, BlockchainName } from '../types'
import type { Currency, ValidCurrency, ConnectedPair, UnconnectedPair } from '../token'
import { UntypedToken } from '../token'
import { getCurrencies, PairFactory, TokenCurrency } from '../token'
import { ethers } from 'ethers'
import type { ContractReceipt } from 'ethers'
import type { CacheInversifyService } from '../cache.inversify.service'

type TokensPath = Currency[]

@injectable()
export class UniswapInversifyService {
  public readonly router: UniswapV2Router02

  public readonly factory: UniswapV2Factory

  public readonly currencies: Record<string, Currency>

  private readonly pairFactory: PairFactory

  constructor(
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('CacheInversifyService') private readonly cacheInversifyService: CacheInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {
    const blockchainName = CHAIN_IDS_INFO[this.chainId].blockchainName
    this.router = this.getContractService.getContractFromDeploymentsFile(blockchainName, 'UniswapV2Router02')
    this.factory = this.getContractService.getContractFromDeploymentsFile(blockchainName, 'UniswapV2Factory')
    this.currencies = getCurrencies(blockchainName)
    const codeHash =
      blockchainName === BlockchainName.ARBITRUM
        ? '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303'
        : '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
    this.pairFactory = new PairFactory(this.factory.address, codeHash, this.getContractService.provider)
    this.additionalCurrencies()
  }

  private additionalCurrencies() {
    const cviAddress = this.getContractService.getAddressOfDeploymentOrUndefined('CVIUSDCVolatilityToken')
    if (cviAddress) {
      this.currencies.CVI = new TokenCurrency(cviAddress, 'CVOL', 18)
    }
  }

  public async getPairInfo(currA: Currency, currB: Currency) {
    const pair = this.pairFactory.buildPair(currA, currB)
    try {
      const resolvedPair = await this.pairFactory.resolveConnected(pair)
      const { reserve0: reserveA, reserve1: reserveB } = resolvedPair.reserves
      return { reserveA, reserveB }
    } catch (e) {
      throw new Error(`pair ${currA}-${currB} not found`)
    }
  }

  public async addLiquidity(
    baseDesired: number,
    pair: ConnectedPair,
    options?: { slippage?: number; quoteDesired?: number },
  ) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService

    const quoteDesired = options?.quoteDesired ?? pair.quotePrice * baseDesired
    const slippage = options?.slippage ?? 0.1
    const baseMin = (baseDesired * (100 - slippage)) / 100
    const quoteMin = (quoteDesired * (100 - slippage)) / 100

    const baseDesiredAmount = pair.base.fromNumber(baseDesired)
    const quoteDesiredAmount = pair.quote.fromNumber(quoteDesired)
    const baseMinAmount = pair.base.fromNumber(baseMin)
    const quoteMinAmount = pair.quote.fromNumber(quoteMin)

    const baseToken = UntypedToken.fromCurrency(pair.base, signer)
    const quoteToken = UntypedToken.fromCurrency(pair.quote, signer)
    await baseToken.approve({ signer, to: this.router.address, overrides: await this.overridesService.get() })
    await quoteToken.approve({ signer, to: this.router.address, overrides: await this.overridesService.get() })

    const { timestamp } = await this.latestBlockInfoInversifyService.getCurrentBlock()
    const deadline = timestamp + 60 * 60 * 24

    const contract = this.router.connect(signer)
    const overrides = await this.overridesService.get()
    let tx: ethers.ContractTransaction
    if (baseToken.isNative() || quoteToken.isNative()) {
      const token = baseToken.isNative() ? quoteToken : baseToken
      const desired = baseToken.isNative() ? quoteDesiredAmount : baseDesiredAmount
      const desiredETH = baseToken.isNative() ? baseDesiredAmount : quoteDesiredAmount
      const min = baseToken.isNative() ? quoteMinAmount : baseMinAmount
      const minETH = baseToken.isNative() ? baseMinAmount : quoteMinAmount
      tx = await contract.addLiquidityETH(token.address, desired, min, minETH, address, deadline, {
        ...overrides,
        value: desiredETH,
      })
    } else {
      tx = await contract.addLiquidity(
        baseToken.address,
        quoteToken.address,
        baseDesiredAmount,
        quoteDesiredAmount,
        baseMinAmount,
        quoteMinAmount,
        address,
        deadline,
        overrides,
      )
    }

    return tx.wait()
  }

  public async removeLiquidity(liquidity: number, pair: ConnectedPair, options?: { slippage?: number }) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService

    // TODO: fix slippage
    const baseToken = pair.base
    const quoteToken = pair.quote
    const baseMin = 0
    const quoteMin = 0
    const baseMinAmount = baseToken.fromNumber(baseMin)
    const quoteMinAmount = quoteToken.fromNumber(quoteMin)

    const pairToken = UntypedToken.fromCurrency(pair.currency, signer)
    await pairToken.approve({ signer, to: this.router.address, overrides: await this.overridesService.get() })
    const liquidityAmount = pairToken.fromNumber(liquidity)

    const { timestamp } = await this.latestBlockInfoInversifyService.getCurrentBlock()
    const deadline = timestamp + 60 * 60 * 24

    const contract = this.router.connect(signer)
    const overrides = await this.overridesService.get()
    let tx: ethers.ContractTransaction
    if (baseToken.isNative() || quoteToken.isNative()) {
      const token = baseToken.isNative() ? quoteToken : baseToken
      const min = baseToken.isNative() ? quoteMinAmount : baseMinAmount
      const minETH = baseToken.isNative() ? baseMinAmount : quoteMinAmount
      tx = await contract.removeLiquidityETH(token.address, liquidityAmount, min, minETH, address, deadline, overrides)
    } else {
      tx = await contract.removeLiquidity(
        baseToken.address,
        quoteToken.address,
        liquidityAmount,
        baseMinAmount,
        quoteMinAmount,
        address,
        deadline,
        overrides,
      )
    }

    return tx.wait()
  }

  public async swap(amount: number, pairs: ConnectedPair[], slippage = 0) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService

    const srcCurrency = pairs[0].base
    const dstCurrency = pairs[pairs.length - 1].quote
    const srcToken = UntypedToken.fromCurrency(srcCurrency, signer)
    const dstToken = UntypedToken.fromCurrency(dstCurrency, signer)
    await srcToken.approve({ signer, to: this.router.address, overrides: await this.overridesService.get() })

    const amountIn = pairs[0].base.fromNumber(amount)
    const pathAddresses = [srcToken.address, ...pairs.map(pair => pair.quote.address)]
    const amountsOut = await this.router.getAmountsOut(amountIn, pathAddresses)
    const amountOut = amountsOut[amountsOut.length - 1]
    const amountOutMin = amountOut.mul(10000 - slippage * 100).div(10000)

    const { timestamp } = await this.latestBlockInfoInversifyService.getCurrentBlock()
    const deadline = timestamp + 60 * 60 * 24

    const contract = this.router.connect(signer)
    const overrides = await this.overridesService.get()
    let tx: ethers.ContractTransaction
    if (srcCurrency.isNative()) {
      tx = await contract.swapExactETHForTokens(amountOutMin, pathAddresses, address, deadline, {
        ...overrides,
        value: amountIn,
      })
    } else if (dstCurrency.isNative()) {
      tx = await contract.swapExactTokensForETH(amountIn, amountOutMin, pathAddresses, address, deadline, overrides)
    } else {
      tx = await contract.swapExactTokensForTokens(amountIn, amountOutMin, pathAddresses, address, deadline, overrides)
    }

    const receipt = await tx.wait()
    return { receipt, ...this.parseSwapEvent(receipt, srcToken, dstToken, address) }
  }

  public parseSwapEvent(receipt: ContractReceipt, srcToken: Currency, dstToken: Currency, address: string) {
    const abi = ['event Transfer(address indexed from, address indexed to, uint value)']
    const iface = new ethers.utils.Interface(abi)

    const transferEvents = receipt.logs
      .filter(l => l.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
      .map(l => iface.parseLog(l))
    const sentFrom = srcToken.isNative() ? this.router.address : address
    const sentTo = dstToken.isNative() ? this.router.address : address

    const sentEvent = transferEvents.find(e => e.args.from === sentFrom)
    const receivedEvent = transferEvents.find(e => e.args.to === sentTo)
    if (!sentEvent || !receivedEvent) {
      throw new Error(`swap - no transfer events found in receipt`)
    }
    const sent = srcToken.toNumber(sentEvent.args.value)
    const received = dstToken.toNumber(receivedEvent.args.value)
    return { sent, received }
  }

  public async price(pairs: (ConnectedPair | UnconnectedPair)[]): Promise<number> {
    if (!this.isValidPath(pairs)) {
      throw new Error('Invalid tokens path (no connection)')
    }
    return pairs.reduce((acc, pair) => (acc *= pair.quotePrice), 1)
  }

  public async buildPairGraphFromToken(src: Currency) {
    throw new Error('Not implemented')
  }

  public async buildPairGraph() {
    throw new Error('Not implemented')
  }

  public async conections(currencies: Currency[], token: Currency): Promise<ConnectedPair[]> {
    const allPairs = await Promise.all(currencies.map(t => this.getPair(token, t)))
    return allPairs.filter((pair): pair is ConnectedPair => pair.isConnected())
  }

  public isValidPath(pairs: (ConnectedPair | UnconnectedPair)[]): pairs is ConnectedPair[] {
    return pairs.every((pair): pair is ConnectedPair => pair.isConnected())
  }

  public buildPath(...tokenNames: [ValidCurrency, ValidCurrency, ...ValidCurrency[]]): TokensPath
  public buildPath(...tokenNames: ValidCurrency[]): TokensPath
  public buildPath(...tokenNames: ValidCurrency[] | [ValidCurrency, ValidCurrency, ...ValidCurrency[]]): TokensPath {
    if (tokenNames.length < 2) {
      throw new Error('Invalid path - must have at least 2 tokens')
    }
    if (tokenNames.some(t => !(t in this.currencies))) {
      throw new Error('Invalid token name')
    }
    return tokenNames.map(tokenName => this.currencies[tokenName])
  }

  public async getCViPair(): Promise<ConnectedPair> {
    const pair = this.pairFactory.buildPair(this.currencies.CVI, this.currencies.USDC)
    return this.pairFactory.resolveConnected(pair)
  }

  public async getPair(token0: Currency, token1: Currency): Promise<ConnectedPair | UnconnectedPair> {
    return this.pairFactory.resolve(this.pairFactory.buildPair(token0, token1))
  }

  public async getPairs(...path: TokensPath): Promise<(ConnectedPair | UnconnectedPair)[]> {
    return Promise.all(this.pairsFromPath(...path).map(({ t0, t1 }) => this.getPair(t0, t1)))
  }

  private pairsFromPath(...path: TokensPath): { t0: Currency; t1: Currency }[] {
    const pairs: { t0: Currency; t1: Currency }[] = []
    for (let i = 0; i < path.length - 1; i++) {
      pairs.push({ t0: path[i], t1: path[i + 1] })
    }
    return pairs
  }

  public getPairContract(pair: ConnectedPair) {
    return pair.contract(this.getContractService.provider)
  }

  public getEvents = async (
    pair: ConnectedPair,
    options?: { sender?: string; receiver?: string; fromBlockNumber?: number; toBlockNumber?: number },
  ) => {
    const pairContract = this.getPairContract(pair)
    const filter = pairContract.filters.Swap(options?.sender, null, null, null, null, options?.receiver)
    return pairContract.queryFilter(filter, options?.fromBlockNumber, options?.toBlockNumber)
  }
}
