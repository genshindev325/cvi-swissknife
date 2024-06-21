import type { ConnectedPair, SimplePendingVolTokenEvent, VtInversifyService } from '@coti-cvi/lw-sdk'
import { isNum, isDev, CHAIN_IDS_INFO, toTimeString } from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class VolatilityToken {
  public readonly volatilityTokenMenu: { [key: string]: MenuItem } = {
    1: { description: 'account balance', action: () => this.accountBalance() },
    i: { description: 'info', action: () => this.info() },
    pm: { description: 'pre mint', action: () => this.preMint() },
    pb: { description: 'pre burn', action: () => this.preBurn() },
    sm: { description: 'submit mint', action: () => this.submitMint() },
    sb: { description: 'submit burn', action: () => this.submitBurn() },
    fmr: {
      description: 'fulfill mint with request id',
      action: async () => this.fulfillMint(await this.inputRequestId()),
    },
    fm: { description: 'fulfill mint', action: () => this.fulfillMint() },
    fbr: {
      description: 'fulfill burn with request id',
      action: async () => this.fulfillBurn(await this.inputRequestId()),
    },
    fb: { description: 'fulfill burn', action: () => this.fulfillBurn() },
    e: { description: 'get events', action: () => this.events() },
    t: {
      description: 'advance time to end of pending request',
      action: () => this.advanceTimeToPendingRequest(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    p: { description: 'pending requests', action: () => this.pendingRequests() },
    c: { description: 'check upkeep', action: () => this.checkUpkeep() },
    u: { description: 'upkeep', action: () => this.upkeep() },
    r: {
      description: 'rebase (owner)',
      action: () => this.rebase(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    ri: { description: 'rebase info', action: () => this.rebaseInfo() },
    ru: { description: 'rebase upkeep', action: () => this.rebaseUpkeep() },
    al: { description: 'add liquidity', action: () => this.addLiquidity() },
    mm: { description: 'fast mint', action: () => this.fastMint() },
    bb: { description: 'fast burn', action: () => this.fastBurn() },
    aa: { description: 'arbitrage', action: () => this.arbitrage() },
    l: { description: 'liquidate request', action: async () => this.liquidate(await this.inputRequestId()) },
    ff: { description: 'funding fee values', action: () => this.getFundingFeeValues() },
    sf: { description: 'set funding fee params', action: () => this.setFundingFeeParams() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<VtInversifyService> {
    const chainId = this.inverifyContext.useTVChainId()
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIUSDCShortToken')
    this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CVIUSDCVolatilityToken',
    )
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'VtInversifyService',
    )
  }

  public async liquidate(requestId?: number): Promise<void> {
    const service = await this.getService()
    if (!requestId) {
      throw new Error('undefined reqeust id')
    }
    await service.liquidate(requestId)
    this.wrappers.writeOutput(`liquidated request id ${requestId}`)
  }

  public async getFundingFeeValues(): Promise<void> {
    const service = await this.getService()
    const oracleService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'CVIOracleInversifyService',
    )
    const tvService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'ThetaVaultInversifyService',
    )
    // const values = await Promise.all([...Array(9)].map((_, i) => service.getFundingFeeValues(i * 10, (i + 1) * 10)))
    const [currentUP, fundingFee, { cviNumber }] = await Promise.all([
      tvService.getTvUtilizationPercentage(),
      service.getHourlyFundingFee(),
      oracleService.getCviIndex(),
    ])
    const answer = await this.wrappers.question(`(number) enter utilization (default ${currentUP.toFixed(2)}%)`)
    const collateral = isNum(answer) ? +answer : currentUP
    const values = await service.getFundingFeeValues(Math.round(collateral))
    const getValuesString = (x = 1) =>
      values.map(
        (v, i) =>
          `${(i + 1).toString().padStart(4)}: ${(v / x).toFixed(6).toString().padStart(10)}${i % 10 === 9 ? '\n' : ''}`,
      )
    this.wrappers.writeOutput(`current utilization ${currentUP.toFixed(6)}% and cvi ${cviNumber.toFixed(6)}`)
    this.wrappers.writeOutput(
      `hourly funding fee values (current: ${fundingFee.toFixed(6)}): \n| ${getValuesString(24).join('| ')}`,
    )
    this.wrappers.writeOutput(
      `daily funding fee values (current: ${(fundingFee * 24).toFixed(6)}): \n| ${getValuesString().join('| ')}`,
    )
  }

  public async setFundingFeeParams(): Promise<void> {
    const service = await this.getService()
    const { signer, address } = this.inverifyContext.signerInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const {
      owner,
      fundingFeeMinRate,
      fundingFeeMaxRate,
      minFundingFeeCviThreshold,
      maxFundingFeeCviThreshold,
      fundingFeeDivisionFactor,
      fundingFeeCoefficients,
      fundingFeeConstantRate,
    } = await service.getFundingFeeParams()
    const ownerSigner = owner === address ? signer : provider.getSigner(owner)
    const constantRateAnswer = await this.wrappers.question(
      `(number) set constant rate (leave empty to leave it as is - ${fundingFeeConstantRate})`,
    )
    if (isNum(constantRateAnswer)) {
      await service.setFundingFeeConstantRate(+constantRateAnswer, ownerSigner)
    }

    const minRateAnswer = await this.wrappers.question(
      `(number) set min rate (leave empty to leave it as is - ${fundingFeeMinRate})`,
    )
    if (isNum(minRateAnswer)) {
      await service.setFundingFeeMinRate(+minRateAnswer, ownerSigner)
    }

    const maxRateAnswer = await this.wrappers.question(
      `(number) set max rate (leave empty to leave it as is - ${fundingFeeMaxRate})`,
    )
    if (isNum(maxRateAnswer)) {
      await service.setFundingFeeMaxRate(+maxRateAnswer, ownerSigner)
    }

    const minFundingFeeCviThresholdAnswer = await this.wrappers.question(
      `(number) set min threshold (leave empty to leave it as is - ${minFundingFeeCviThreshold})`,
    )
    if (isNum(minFundingFeeCviThresholdAnswer)) {
      await service.setMinFundingFeeCviThreshold(+minFundingFeeCviThresholdAnswer, ownerSigner)
    }

    const maxFundingFeeCviThresholdAnswer = await this.wrappers.question(
      `(number) set max threshold (leave empty to leave it as is - ${maxFundingFeeCviThreshold})`,
    )
    if (isNum(maxFundingFeeCviThresholdAnswer)) {
      await service.setMaxFundingFeeCviThreshold(+maxFundingFeeCviThresholdAnswer, ownerSigner)
    }

    const fundingFeeDivisionFactorAnswer = await this.wrappers.question(
      `(number) set division factor (leave empty to leave it as is - ${fundingFeeDivisionFactor})`,
    )
    if (isNum(fundingFeeDivisionFactorAnswer)) {
      await service.setFundingFeeDivisionFactor(+fundingFeeDivisionFactorAnswer, ownerSigner)
    }

    const fundingFeeCoefficientsAnswer = await this.wrappers.question(
      `(number) set division factor (leave empty to leave it as is - ${fundingFeeCoefficients})`,
    )
    if (fundingFeeCoefficientsAnswer.split(',').length === fundingFeeDivisionFactor) {
      await service.setFundingFeeCoefficients(
        fundingFeeCoefficientsAnswer.split(',').map(f => +f),
        ownerSigner,
      )
    }
  }

  public async info() {
    const maxUtil = 35
    const service = await this.getService()
    const uniswapService = this.inverifyContext.uniswapInversifyService
    const [tokenA, tokenB] = [service.tokenUSDC.symbol, service.tokenVOL.symbol]
    const [
      dexPrice,
      intrinsicPrice,
      { reserveA, reserveB },
      maxMintAmount,
      fundingFee,
      turbulence,
      maxMintAmountFromUtil,
    ] = await Promise.all([
      service.getDexPrice(),
      service.getIntrinsicPrice(),
      uniswapService.getPairInfo(service.tokenUSDC, service.tokenVOL),
      service.getMaxMintAmount(),
      service.getHourlyFundingFee(),
      service.getTurbulencePercent(),
      service.getMaxMintAmountFromUtilizationPercentage(maxUtil),
    ])
    this.wrappers.writeOutput(`dex price: $${dexPrice.toFixed(2)}  intrinsic price $${intrinsicPrice.toFixed(2)}`)
    this.wrappers.writeOutput(`reserves: ${reserveA} ${tokenA} - ${reserveB} ${tokenB}`)
    this.wrappers.writeOutput(`max amount to mint for liquidity: ${maxMintAmount} USDC`)
    this.wrappers.writeOutput(`max amount to mint for utilization percent of ${maxUtil}: ${maxMintAmountFromUtil}`)
    this.wrappers.writeOutput(`funding fee - hourly: ${fundingFee.toFixed(6)}, daily: ${(fundingFee * 24).toFixed(6)}`)
    this.wrappers.writeOutput(`turbulence - ${turbulence}%`)
  }

  public async accountBalance() {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const answerAddress = await this.wrappers.question(
      `(string) enter address (leave empty for current signer address)`,
    )
    const account = answerAddress.length !== 42 ? signerService.address : answerAddress
    const answerBlockNumber = await this.wrappers.question(
      `(number) enter block-number (leave empty for latest block-number)`,
    )
    const blockNumber = answerBlockNumber ? Number(answerBlockNumber) : undefined
    const [balance, price] = await Promise.all([
      service.tokenVOL.getBalance(account, blockNumber),
      service.getIntrinsicPrice(blockNumber),
    ])
    const usdcBalance = service.tokenVOL.toNumber(balance) * price
    this.wrappers.writeOutput(`user balance: ${service.tokenVOL.toString(balance)} ($${usdcBalance.toFixed(6)})`)
  }

  public async pendingRequests(isKeepers = true) {
    const service = await this.getService()
    const vtContractsEventsInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'VtContractsEventsInversifyService',
    )
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const address = answer === 'a' ? undefined : answer?.length !== 42 ? signerService.address : answer
    const { pendingRequests } = await vtContractsEventsInversifyService.getSimpleEvents({ address })
    console.log(`pendingRequests ${pendingRequests.length}`)
    const pendingData = await Promise.all(pendingRequests.map(r => service.checkPendingRequest(r, isKeepers)))
    this.wrappers.writeOutput(
      `pending:\n${pendingRequests
        .map((p, i) => `${service.simpleEventToString(p)} data: ${JSON.stringify(pendingData[i])}`)
        .join('\n')}`,
    )
    return pendingRequests
  }

  public async events() {
    const service = await this.getService()
    const vtContractsEventsInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'VtContractsEventsInversifyService',
    )
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const address = answer === 'a' ? undefined : answer.length !== 42 ? signerService.address : answer
    const { events } = await vtContractsEventsInversifyService.getSimpleEvents({ address })
    this.wrappers.writeOutput(`all events:\n${events.map(service.simpleEventToString).join('\n')}`)
    return events
  }

  public async advanceTimeToPendingRequest(requestId?: number): Promise<void> {
    const service = await this.getService()
    const hardhatService = this.inverifyContext.HardhatAdvanceTimeInversifyService
    const providerService = this.inverifyContext.providerInversifyService
    const getTargetTimestamp = async (requestId?: number): Promise<number> => {
      if (requestId) {
        return (await service.getRequest(requestId)).targetTimestamp
      }
      const pendingRequests = await this.pendingRequests()
      const selectedRequest = await this.wrappers.selectItem(
        'pending request',
        pendingRequests,
        service.simpleEventToString,
      )
      if (!selectedRequest) {
        throw new Error('no pending request selected')
      }
      return selectedRequest.request.args.targetTimestamp
    }
    const [targetTimestamp, { timestamp: currentTimestamp }] = await Promise.all([
      getTargetTimestamp(requestId),
      providerService.provider.getBlock('latest'),
    ])
    if (targetTimestamp > currentTimestamp) {
      const passed = await hardhatService.simpleAdvanceTime(targetTimestamp - currentTimestamp)
      this.wrappers.writeOutput(`advanced ${toTimeString(passed)}`)
    } else {
      this.wrappers.writeOutput(`already past target timestamp`)
    }
  }

  public async preMint(overrideAmount?: number): Promise<{ amount: number; delay: number }> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const [balance, { minTimeWindow, maxTimeWindow }] = await Promise.all([
      service.tokenUSDC.balanceToString(signerService.address),
      service.getTimeWindow(),
    ])
    if (overrideAmount) {
      return { amount: overrideAmount, delay: maxTimeWindow }
    }
    const amountAnswer = await this.wrappers.question(`enter mint amount - number [${balance}]`)
    if (!isNum(amountAnswer)) {
      throw new Error('invalid amount')
    }
    const amount = +amountAnswer
    const delayAnswer = await this.wrappers.question(
      `enter target time delay - number [${minTimeWindow}-${maxTimeWindow}] (default: ${maxTimeWindow})`,
    )
    const delay = isNum(delayAnswer) ? +delayAnswer : maxTimeWindow
    const [res, utilizationPercentAfterMint] = await Promise.all([
      service.preMint(amount, delay),
      service.predictUtilizationPercentageAfterMint(amount),
    ])
    this.wrappers.writeOutput(`will mint ${res.expectedVolTokensAmount} vol tokens for ${res.netMintAmount} USDC`)
    this.wrappers.writeOutput(`utilization percentage after mint: ${utilizationPercentAfterMint.toFixed(4)}%`)
    this.wrappers.writeOutput(`${JSON.stringify(res)}`)
    return { amount, delay }
  }

  public async preBurn(overrideAmount?: number): Promise<{ amount: number | BigNumber; delay: number }> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const [balance, { minTimeWindow, maxTimeWindow }] = await Promise.all([
      service.tokenVOL.getBalance(signerService.address),
      service.getTimeWindow(),
    ])
    const balanceString = service.tokenVOL.toString(balance)
    if (overrideAmount) {
      return { amount: overrideAmount, delay: maxTimeWindow }
    }
    const amountAnswer = await this.wrappers.question(`enter burn amount - number [${balanceString}] (else for all)`)
    const amount = isNum(amountAnswer) ? +amountAnswer : balance
    const delayAnswer = await this.wrappers.question(
      `enter target time delay - number [${minTimeWindow}-${maxTimeWindow}] (default: ${maxTimeWindow})`,
    )
    const delay = isNum(delayAnswer) ? +delayAnswer : maxTimeWindow
    const res = await service.preBurn(amount, delay)
    this.wrappers.writeOutput(
      `will burn ${res.netBurnAmount} vol tokens for ${res.expectedUSDCAmount} USDC | ${JSON.stringify(res)}`,
    )
    return { amount, delay }
  }

  public async submitMint(overrideAmount?: number, overrideSlippage?: string): Promise<number | undefined> {
    const service = await this.getService()
    const { amount, delay } = await this.preMint(overrideAmount)

    const slippage =
      overrideSlippage !== undefined
        ? overrideSlippage
        : await this.wrappers.question(`enter slippage percent - number [0,100] (default: 0.01%)`)

    await service.approveUsdc(amount)

    const response = await service.submitMintRequest(amount, delay, isNum(slippage) ? +slippage : undefined)
    if (response) {
      this.wrappers.writeOutput(`submitMint receipt id ${response.id} ${response.receipt.transactionHash} `)
      return response.id
    }
  }

  public async submitBurn(overrideAmount?: number): Promise<number | undefined> {
    const service = await this.getService()
    const { amount, delay } = await this.preBurn(overrideAmount)

    await service.approveCviX2(amount)

    const response = await service.submitBurnRequest(amount, delay)
    if (response) {
      this.wrappers.writeOutput(`submitBurn receipt id ${response.id} ${response.receipt.transactionHash} `)
      return response.id
    }
  }

  public async inputRequestId() {
    const requestIdAnswer = await this.wrappers.question(`enter request id`)
    return isNum(requestIdAnswer) ? +requestIdAnswer : undefined
  }

  public async fulfillMint(requestId?: number) {
    const service = await this.getService()
    let selectedRequest: SimplePendingVolTokenEvent | number | undefined
    if (!requestId) {
      const pendingRequests = await this.pendingRequests(false)
      const mintRequests = pendingRequests.filter(r => r.requestType === 1)
      selectedRequest =
        requestId !== undefined
          ? mintRequests.find(r => r.requestId === requestId)
          : await this.wrappers.selectItem('pending request', mintRequests, service.simpleEventToString)
      if (!selectedRequest) {
        throw new Error('no pending mint request found')
      }
    } else {
      selectedRequest = +requestId
    }

    const slippage =
      requestId !== undefined
        ? undefined
        : await this.wrappers.question(`override slippage percent - number [0,100] (empty to not override)`)

    const res = await service.fulfillMint(selectedRequest, isNum(slippage) ? +slippage : undefined)
    const amountsString = `${service.tokenVOL.toString(res.minted)} for ${service.tokenUSDC.toString(res.amountUSDC)}`
    this.wrappers.writeOutput(`fulfillMint receipt - Minted: ${amountsString}`)
    return res
  }

  public async fulfillBurn(requestId?: number) {
    const service = await this.getService()
    let selectedRequest: SimplePendingVolTokenEvent | number | undefined
    if (!requestId) {
      const pendingRequests = await this.pendingRequests(false)
      const burnRequests = pendingRequests.filter(r => r.requestType === 2)
      selectedRequest =
        requestId !== undefined
          ? burnRequests.find(r => r.requestId === requestId)
          : await this.wrappers.selectItem('pending request', burnRequests, service.simpleEventToString)
      if (!selectedRequest) {
        throw new Error('no pending burn request found')
      }
    } else {
      selectedRequest = requestId
    }
    const res = await service.fulfillBurn(selectedRequest)
    const amountsString = `${service.tokenVOL.toString(res.burned)} for ${service.tokenUSDC.toString(res.amountUSDC)}`
    this.wrappers.writeOutput(`fulfillBurn receipt - Burned: ${amountsString}`)
    return res
  }

  public async addLiquidity(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const uniswapService = this.inverifyContext.uniswapInversifyService
    const volToken = service.tokenVOL
    const usdcToken = service.tokenUSDC
    const pair = await uniswapService.getPair(volToken, usdcToken)
    if (!pair.isConnected()) {
      this.wrappers.writeOutput('Pair does not exist')
      return
    }
    const volBalance = await volToken.balanceToString(signerService.address)
    const volAnswer = await this.wrappers.question(`enter vol token liquidity to add - number [${volBalance}]`)
    const usdcBalance = await usdcToken.balanceToString(signerService.address)
    const usdcAnswer = await this.wrappers.question(`enter usdc token liquidity to add - number [${usdcBalance}]`)
    if (!isNum(volAnswer) || !isNum(usdcAnswer)) {
      throw new Error('invalid amount')
    }
    const tx = await uniswapService.addLiquidity(+volAnswer, pair, {
      slippage: 0,
      quoteDesired: +usdcAnswer,
    })
    this.wrappers.writeOutput(`${pair} tx: ${tx.status}`)
  }

  public async checkUpkeep(): Promise<void> {
    const service = await this.getService()
    const { upkeepNeeded } = await service.checkUpkeep()
    this.wrappers.writeOutput(`check upkeep ${upkeepNeeded}`)
  }

  public async upkeep(): Promise<void> {
    const service = await this.getService()
    const { upkeepNeeded } = await service.upkeep()
    this.wrappers.writeOutput(`upkeep ${upkeepNeeded ? 'performed' : 'not needed'}`)
  }

  public async rebase(): Promise<void> {
    const service = await this.getService()
    const chainId = this.inverifyContext.useTVChainId()
    const rebaserService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'VtReBaserInversifyService',
    )

    this.wrappers.writeOutput(`price before rebase: ${await service.getIntrinsicPrice()}`)
    const receipt = await rebaserService.rebase()
    this.wrappers.writeOutput(`rebase done hash:${receipt.transactionHash} price: ${await service.getIntrinsicPrice()}`)
  }

  public async rebaseInfo(): Promise<void> {
    const service = await this.getService()
    const { minDeviation, maxDeviation } = await service.getRebaseInfo()
    this.wrappers.writeOutput(`rebase deviation min:${minDeviation}% maxDeviation: ${maxDeviation}%`)
  }

  public async rebaseUpkeep(): Promise<void> {
    const service = await this.getService()
    const chainId = this.inverifyContext.useTVChainId()
    const rebaserService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'VtReBaserInversifyService',
    )

    this.wrappers.writeOutput(`price before rebase: ${await service.getIntrinsicPrice()}`)
    const { upkeepNeeded } = await rebaserService.upkeep()
    this.wrappers.writeOutput(
      `upkeep ${upkeepNeeded ? 'performed' : 'not needed'} price: ${await service.getIntrinsicPrice()}`,
    )
  }

  private calculateOptimal(
    dexPrice: number,
    intrinsicPrice: number,
    pair: ConnectedPair,
  ): { isBurn: boolean; optimal: number; profit: number } {
    if (dexPrice === 0 || intrinsicPrice === 0) {
      return { isBurn: false, optimal: 0, profit: 0 }
    }
    const isBurn = dexPrice < intrinsicPrice
    const { reserve0: reserveUSDC, reserve1: reserveCvi } = pair.reserves
    const optimal = isBurn
      ? (-1.997 * reserveUSDC +
          Math.sqrt(3.988 * intrinsicPrice * reserveUSDC * reserveCvi + 0.000009 * reserveUSDC * reserveUSDC)) /
        1.994
      : (-1.997 * intrinsicPrice * reserveCvi +
          Math.sqrt(
            3.988 * intrinsicPrice * reserveUSDC * reserveCvi +
              0.000009 * reserveCvi * reserveCvi * intrinsicPrice * intrinsicPrice,
          )) /
        1.988018

    const bought = (optimal / (isBurn ? dexPrice : intrinsicPrice)) * 0.997
    const sold = (isBurn ? intrinsicPrice : dexPrice) * bought * 0.997
    const profit = (sold - optimal) / 2
    return { isBurn, optimal, profit }
  }

  public async arbitrage() {
    const service = await this.getService()
    const uniswapService = this.inverifyContext.uniswapInversifyService
    const { address } = this.inverifyContext.signerInversifyService
    const [dexPrice, intrinsicPrice, pair, balance] = await Promise.all([
      service.getDexPrice(),
      service.getIntrinsicPrice(),
      uniswapService.getPair(service.tokenUSDC, service.tokenVOL),
      service.tokenUSDC.balanceToString(this.inverifyContext.signerInversifyService.address),
    ])
    if (!pair.isConnected()) {
      throw new Error('pair does not exist')
    }
    const { isBurn, optimal, profit } = this.calculateOptimal(dexPrice, intrinsicPrice, pair)
    const action = isBurn ? 'burn' : 'mint'
    this.wrappers.writeOutput(`dex price: $${dexPrice.toFixed(2)}, intrinsic price $${intrinsicPrice.toFixed(2)}`)
    this.wrappers.writeOutput(`best action: ${action}, optimal: ${optimal.toFixed(2)}, profit: $${profit.toFixed(2)}`)

    const answer = await this.wrappers.question(`enter usdc to ${action} - number [${balance}] (empty for optimal)`)
    const amount = isNum(answer) ? +answer : optimal

    const slippage = await this.wrappers.question(`enter slippage percent - number [0,100] (default: 0.01%)`)
    const slippageAmount = isNum(slippage) ? +slippage : 0.01

    if (isBurn) {
      const { received } = await uniswapService.swap(amount, [pair], slippageAmount)
      const id = await this.submitBurn(received)
      await this.advanceTimeToPendingRequest(id)
      await this.fulfillBurn(id)
    } else {
      const id = await this.submitMint(amount, slippage)
      await this.advanceTimeToPendingRequest(id)
      const { minted } = await this.fulfillMint(id)
      await uniswapService.swap(minted, [pair.reverse], slippageAmount)
    }

    const usdcBalanceAfter = await service.tokenUSDC.balanceToString(address)
    const volBalanceAfter = await service.tokenVOL.balanceToString(address)
    this.wrappers.writeOutput(`balances after: ${usdcBalanceAfter} <===> ${volBalanceAfter}`)
  }

  public async fastMint(): Promise<void> {
    const id = await this.submitMint()
    await this.advanceTimeToPendingRequest(id)
    await this.upkeep()
  }

  public async fastBurn(): Promise<void> {
    const id = await this.submitBurn()
    await this.advanceTimeToPendingRequest(id)
    await this.upkeep()
  }
}
