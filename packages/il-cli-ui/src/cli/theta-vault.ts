import type { ThetaVaultInversifyService } from '@coti-cvi/lw-sdk'
import { isNum, isDev, CHAIN_IDS_INFO, toTimeString, TvRequestType } from '@coti-cvi/lw-sdk'
import type { BigNumber } from 'ethers'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'
import { format } from 'date-fns'

export class ThetaVault {
  public readonly ThetaVaultMenu: { [key: string]: MenuItem } = {
    1: { description: 'account position', action: () => this.position() },
    2: { description: 'account P&L', action: () => this.accountPNL() },
    i: { description: 'info', action: () => this.info({ watch: false }) },
    iw: { description: 'info --watch', action: () => this.info({ watch: true }) },
    ar: {
      description: 'advance time to end of pending request',
      action: () => this.advanceTimeToPendingRequest(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    aw: {
      description: 'advance time to end of withdraw lock',
      action: () => this.advanceTimeToEndOfLock(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
    t: { description: 'tvl', action: () => this.tvl() },
    m: { description: 'max capacity', action: () => this.maxCapacity() },
    pl: { description: 'p&l', action: () => this.pnl() },
    a: { description: 'apr', action: () => this.apr() },
    p: { description: 'get pending requests', action: () => this.pendingRequests() },
    e: { description: 'get all events', action: () => this.events() },
    pd: { description: 'pre deposit', action: () => this.preDeposit() },
    d: { description: 'deposit', action: () => this.deposit() },
    pw: { description: 'pre withdraw', action: () => this.preWithdraw() },
    w: { description: 'withdraw', action: () => this.withdraw() },
    c: { description: 'check upkeep', action: () => this.checkUpkeep() },
    u: { description: 'upkeep', action: () => this.upkeep() },
    fd: { description: 'fast deposit', action: () => this.fastDeposit() },
    fw: { description: 'fast withdraw', action: () => this.fastWithdraw() },
    dd: { description: 'fulfill manual deposit', action: () => this.fulfillDeposit() },
    ww: { description: 'fulfill manual withdraw', action: () => this.fulfillWithdraw() },
    r: { description: 'rebalance', action: () => this.rebalance() },
    h: { description: 'history info', action: () => this.historyInfo() },
    sp: { description: 'set periods (owner)', action: () => this.setPeriods() },
    et: {
      description: 'exposure test',
      action: () => this.exposureTest(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<ThetaVaultInversifyService> {
    const chainId = this.inverifyContext.useTVChainId()
    this.inverifyContext.inversifyContainer.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'CVIUSDCThetaToken')
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'ThetaVaultInversifyService',
    )
  }

  private async getVolTokenService() {
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

  private async getOracleService() {
    const chainId = this.inverifyContext.useTVChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CVIOracleInversifyService',
    )
  }

  public async exposureTest(): Promise<void> {
    const depositDelay = 30 * 60
    const mintDelay = 60 * 60
    const slippage = 0.01
    let exposure = 0
    const [thetaService, vtService, oracleService, answer] = await Promise.all([
      this.getService(),
      this.getVolTokenService(),
      this.getOracleService(),
      this.wrappers.question(`(number) initial mint amount (leave empty for 50,000)`),
    ])
    let currentMintAmount = isNum(answer) ? +answer : 50000
    const [{ cviNumber: cviIndex }] = await Promise.all([
      oracleService.getCviIndex(),
      vtService.approveUsdc(),
      thetaService.approveUsdc(),
    ])
    const { tvCollateralRatio, tvUtilizationPercentage } = await thetaService.info({ cviIndex })
    this.wrappers.writeOutput(`initial CR:${tvCollateralRatio} UP:${tvUtilizationPercentage}`)
    const fastMint = async (amount: number) => {
      const submitRes = await vtService.submitMintRequest(amount, mintDelay, slippage)
      if (!submitRes || !submitRes.id) {
        throw new Error('failed to submit mint')
      }
      const id: number = +submitRes?.id.toString()
      await this.inverifyContext.HardhatAdvanceTimeInversifyService.simpleAdvanceTime(mintDelay)
      await vtService.fulfillMint(id)
      exposure += amount
    }
    const fastDeposit = async (amount: number) => {
      await thetaService.deposit(amount)
      await this.inverifyContext.HardhatAdvanceTimeInversifyService.simpleAdvanceTime(depositDelay)
      await thetaService.upkeep()
    }
    const getCR = async () => {
      const { tvCollateralRatio, tvUtilizationPercentage } = await thetaService.info({ cviIndex })
      return `CR:${tvCollateralRatio} UP:${tvUtilizationPercentage}`
    }
    const getBalanceString = async () => {
      return vtService.tokenUSDC.balanceToString(this.inverifyContext.signerInversifyService.address)
    }
    const getInfo = async () => {
      const [crString, balanceString] = await Promise.all([getCR(), getBalanceString()])
      return `${crString} ${balanceString}`
    }
    for (let i = 0; currentMintAmount > 100; i++) {
      try {
        console.log(`before --- current exposure: ${exposure} ${await getInfo()}`)
        await fastMint(currentMintAmount)
        this.wrappers.writeOutput(`current exposure: ${exposure} ${await getInfo()}`)
        console.log(`mint --- current exposure: ${exposure} ${await getInfo()}`)
        await fastDeposit(0.1)
        console.log(`deposit --- current exposure: ${exposure} ${await getInfo()}`)
      } catch (error) {
        console.log(`error ${error.message}`)
        currentMintAmount = currentMintAmount / 2
      }
    }
    this.wrappers.writeOutput(`exposure: $${exposure}`)
  }

  public async setPeriods() {
    const service = await this.getService()
    const { signer, address } = this.inverifyContext.signerInversifyService
    const { provider } = this.inverifyContext.providerInversifyService
    const [owner, lockupPeriod, liquidationPeriod] = await Promise.all([
      service.cviContractsInversifyService.vaultCvi.owner(),
      (await service.cviContractsInversifyService.vaultCvi.lockupPeriod()).toNumber(),
      (await service.cviContractsInversifyService.vaultCvi.liquidationPeriod()).toNumber(),
    ])
    const ownerSigner = owner === address ? signer : provider.getSigner(owner)
    const lockupPeriodAnswer = await this.wrappers.question(
      `(number) set lockup period (leave empty to leave it as is - ${lockupPeriod})`,
    )
    const liquidationPeriodAnswer = await this.wrappers.question(
      `(number) set liquidation period (leave empty to leave it as is - ${liquidationPeriod})`,
    )
    if (isNum(lockupPeriodAnswer) || isNum(liquidationPeriodAnswer)) {
      await service.setPeriods(
        ownerSigner,
        isNum(lockupPeriodAnswer) ? +lockupPeriodAnswer : lockupPeriod,
        isNum(liquidationPeriodAnswer) ? +liquidationPeriodAnswer : liquidationPeriod,
      )
    }
  }

  public async info({ watch }: { watch: boolean }): Promise<void> {
    const refreshSeconds = 5
    if (watch) {
      this.wrappers.clearOutput()
      this.wrappers.writeOutput(
        `${format(new Date(), 'HH:mm:ss')} - Automatic refresh is enabled every ${refreshSeconds} seconds`,
      )
      this.wrappers.writeOutput(`Fetching data...`)
    }
    type Change = {
      dateMs: number
      data: {
        dexCviBalanceUsdcByPlatformPrice: number
        dexCviBalanceUsdc: number
        platformUSDCLiquidity: number
        platformVtBalanceUsdcByPlatformPrice: number
        currentThetaVaultUsdcBalance: number
        dexCviBalance: number
        collateralRatio: number
        tvUtilizationPercentage: number
        balanceSupplyRatio: number
        maxWithdraw: number
      }
    }
    const changes: Change[] = []
    const run = async () => {
      const dateMs = Date.now()
      let blockTag: number | undefined
      if (!watch) {
        const answer = await this.wrappers.question(`(number) blocks in the past (leave empty for current block)`)
        blockTag = isNum(answer)
          ? this.inverifyContext.providerInversifyService.provider.blockNumber - +answer
          : undefined
      }
      const service = await this.getService()
      const chainId = this.inverifyContext.useTVChainId()
      const cviOracleInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
        CHAIN_IDS_INFO[chainId].blockchainName,
        'CVIOracleInversifyService',
      )
      const cviIndex = await cviOracleInversifyService.getCviIndex(blockTag).then(r => r.cviNumber)
      const [
        {
          dexCviBalanceUsdcByPlatformPrice,
          dexCviBalanceUsdc,
          platformUSDCLiquidity,
          platformVtBalanceUsdcByPlatformPrice,
          currentThetaVaultUsdcBalance,
          dexCviBalance,
          tvCollateralRatio: collateralRatio,
          tvUtilizationPercentage,
          tvPlatformPnl: balanceSupplyRatio,
        },
        maxWithdraw,
        { totalDepositRequestsNumber, totalDepositRequestsString },
        { depositCapString },
        { pnl },
      ] = await Promise.all([
        service.info({ overrides: { blockTag }, cviIndex }),
        service.getMaxWithdraw(blockTag),
        service.getTotalDepositRequestsAmount(blockTag),
        service.maxCapacity(blockTag),
        service.calculatePNL({ endBlock: blockTag }),
        this.maxCapacity(blockTag),
        this.tvl(blockTag),
      ])
      const change: Change = {
        dateMs,
        data: {
          dexCviBalanceUsdcByPlatformPrice: Number(dexCviBalanceUsdcByPlatformPrice.toFixed(5)),
          dexCviBalanceUsdc: Number(dexCviBalanceUsdc.toFixed(5)),
          platformUSDCLiquidity: Number(platformUSDCLiquidity.toFixed(5)),
          platformVtBalanceUsdcByPlatformPrice: Number(platformVtBalanceUsdcByPlatformPrice.toFixed(5)),
          currentThetaVaultUsdcBalance: Number(currentThetaVaultUsdcBalance.toFixed(5)),
          dexCviBalance: Number(dexCviBalance.toFixed(5)),
          collateralRatio: Number(collateralRatio.toFixed(5)),
          tvUtilizationPercentage: Number(tvUtilizationPercentage.toFixed(5)),
          balanceSupplyRatio: Number(balanceSupplyRatio.toFixed(5)),
          maxWithdraw: Number(maxWithdraw.toFixed(5)),
        },
      }
      if (changes.length === 0 || JSON.stringify(changes[changes.length - 1]) !== JSON.stringify(change)) {
        changes.push(change)
      }
      if (watch) {
        this.wrappers.clearOutput()
        this.wrappers.writeOutput(
          `${format(new Date(dateMs), 'HH:mm:ss')} - Automatic refresh is enabled every ${refreshSeconds} seconds`,
        )
        const table = changes.map(change => ({
          time: format(new Date(change.dateMs), 'HH:mm:ss'),
          'dex balances': `$${change.data.dexCviBalanceUsdcByPlatformPrice} - $${change.data.dexCviBalanceUsdc}`,
          'position balance': `$${change.data.platformVtBalanceUsdcByPlatformPrice} - $${change.data.dexCviBalance}`,
          'liquidity balance': `$${change.data.platformUSDCLiquidity.toFixed(2)}`,
          'total theta vault balance': `$${change.data.currentThetaVaultUsdcBalance} collateral ratio ${change.data.collateralRatio}%`,
          'theta vault balance / supply ratio': change.data.balanceSupplyRatio,
          'max withdraw': change.data.maxWithdraw,
        }))
        console.clear()
        console.table(table)
      }
      this.wrappers.writeOutput('------')
      this.wrappers.writeOutput(`dex values VOL:$${dexCviBalanceUsdcByPlatformPrice} USDC:$${dexCviBalanceUsdc}`)
      this.wrappers.writeOutput(`position balance: $${platformVtBalanceUsdcByPlatformPrice} - ${dexCviBalance}`)
      this.wrappers.writeOutput(`liquidity balance: $${platformUSDCLiquidity}`)
      this.wrappers.writeOutput(`total theta vault balance: $${currentThetaVaultUsdcBalance}`)
      this.wrappers.writeOutput(`collateral ratio ${collateralRatio}%`)
      this.wrappers.writeOutput(`utilization ratio: ${tvUtilizationPercentage}%`)
      this.wrappers.writeOutput(`theta vault balance / supply ratio: ${balanceSupplyRatio}`)
      this.wrappers.writeOutput(`theta vault P&L: ${pnl.toFixed(4)}%`)
      this.wrappers.writeOutput(`max withdraw: ${maxWithdraw}`)
      this.wrappers.writeOutput(`total deposit requests: ${totalDepositRequestsString}`)
      const currentCapacity = (totalDepositRequestsNumber + currentThetaVaultUsdcBalance).toFixed(6)
      this.wrappers.writeOutput(`current capacity: ${currentCapacity} out of ${depositCapString}`)

      if (watch) {
        await new Promise<void>(resolve => {
          setTimeout(async () => {
            await run()
            resolve()
          }, refreshSeconds * 1000)
        })
      }
    }
    await run()
  }

  public async tvl(blockTag?: number): Promise<void> {
    const service = await this.getService()
    const { balance } = await service.tvl(blockTag)
    this.wrappers.writeOutput(`tvl: ${service.tokenUSDC.toString(balance)}`)
  }

  public async apr(): Promise<void> {
    const service = await this.getService()
    const { period, apr } = await service.calculateAPR()
    const { period: periodOld, apr: aprOld } = await service.calculateAPR(undefined, [])
    this.wrappers.writeOutput(`last ${toTimeString(period)} average - APR: ${apr.toFixed(4)}%`)
    this.wrappers.writeOutput(`old (no smoothing) last ${toTimeString(periodOld)} average - APR: ${aprOld.toFixed(4)}%`)
  }

  public async maxCapacity(blockTag?: number): Promise<void> {
    const service = await this.getService()
    const { depositCapString } = await service.maxCapacity(blockTag)
    this.wrappers.writeOutput(`max capacity: ${depositCapString}`)
  }

  public async pnl(): Promise<void> {
    const service = await this.getService()
    const answer = await this.wrappers.question(`(number) period of last number of days (leave empty for all days)`)
    const startBlock = isNum(answer)
      ? (await service.latestBlockInfoInversifyService.getBlockSecondsAgo(+answer * 86400)).block
      : undefined
    const { fromBlock, toBlock, pnl } = await service.calculatePNL({ startBlock })
    const { pnl: oldPNL } = await service.calculatePNL({ startBlock, samples: [] })
    const period = await service.latestBlockInfoInversifyService.getPeriod({ fromBlock, toBlock })
    this.wrappers.writeOutput(`theta vault P&L: ${pnl.toFixed(6)}% over ${toTimeString(period)}`)
    this.wrappers.writeOutput(`old (no smoothing) theta vault P&L: ${oldPNL.toFixed(6)}% over ${toTimeString(period)}`)
  }

  public async accountPNL(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(`(string) address to filter (leave empty for current signer address)`)
    const account = answer.length !== 42 ? signerService.address : answer
    const { pnl, percent } = await service.calculateAccountPNL(account)
    this.wrappers.writeOutput(`[${account}] P&L: ${pnl.toFixed(6)} USDC (${percent.toFixed(2)}%)`)
  }

  public async historyInfo(): Promise<void> {
    const service = await this.getService()
    const blockAnswer = await this.wrappers.question(`(number) block number (leave empty for latest block)`)
    const collateralRatio = await service.getCollateralRatio({
      blockTag: isNum(blockAnswer) ? +blockAnswer : undefined,
    })
    this.wrappers.writeOutput(`collateral ratio ${collateralRatio}%`)
  }

  public async position(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const [
      { positionBalanceUsdcBn: value, balanceThetaTokensBn: balance, sharePercentage: share },
      { isLocked, timeLeftSeconds: timeLeft },
    ] = await Promise.all([
      service.positionOfAddress(signerService.address),
      service.checkWithdrawLock(signerService.address),
    ])
    const posString = `${service.tokenUSDC.toString(value)} - ${service.tokenThetaCvi.toString(balance)} (${share}%)`
    const lockString = isLocked ? `locked for ${toTimeString(timeLeft)}` : 'not locked'
    this.wrappers.writeOutput(`position: ${posString}, withdraw lock: ${lockString}`)
  }

  public async advanceTimeToEndOfLock(): Promise<void> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const hardhatService = this.inverifyContext.HardhatAdvanceTimeInversifyService
    const { isLocked, timeLeftSeconds: timeLeft } = await service.checkWithdrawLock(signerService.address)
    if (isLocked) {
      const timePassed = await hardhatService.simpleAdvanceTime(timeLeft)
      this.wrappers.writeOutput(`advanced ${toTimeString(timePassed)}`)
    } else {
      this.wrappers.writeOutput(`not locked`)
    }
  }

  public async advanceTimeToPendingRequest(type?: TvRequestType) {
    const service = await this.getService()
    const tvContractsEventsInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'TvContractsEventsInversifyService',
    )
    const signerService = this.inverifyContext.signerInversifyService
    const hardhatService = this.inverifyContext.HardhatAdvanceTimeInversifyService
    const blockService = this.inverifyContext.latestBlockInfoInversifyService
    const { pendingRequests } = await tvContractsEventsInversifyService.getEvents(signerService.address)
    const filteredRequests = type ? pendingRequests.filter(p => p.requestType === type) : pendingRequests
    const selectedRequest = await this.wrappers.selectItem('pending request', filteredRequests, service.eventToString)
    const { timestamp } = await blockService.getCurrentBlock()
    if (selectedRequest.request.args.targetTimestamp - timestamp > 0) {
      const passed = await hardhatService.simpleAdvanceTime(selectedRequest.request.args.targetTimestamp - timestamp)
      this.wrappers.writeOutput(`advanced ${toTimeString(passed)}`)
    } else {
      this.wrappers.writeOutput(`already past target timestamp`)
    }
    return selectedRequest
  }

  public async pendingRequests(type?: TvRequestType) {
    const service = await this.getService()
    const tvContractsEventsInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'TvContractsEventsInversifyService',
    )
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const account = answer === 'a' ? undefined : answer.length !== 42 ? signerService.address : answer
    const { pendingRequests } = await tvContractsEventsInversifyService.getEvents(account)
    const filteredRequests = type ? pendingRequests.filter(p => p.requestType === type) : pendingRequests
    this.wrappers.writeOutput(`pending:\n${filteredRequests.map(service.eventToString).join('\n')}`)
    return filteredRequests
  }

  public async events(): Promise<void> {
    const service = await this.getService()
    const tvContractsEventsInversifyService = await this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[this.inverifyContext.useTVChainId()].blockchainName,
      'TvContractsEventsInversifyService',
    )
    const signerService = this.inverifyContext.signerInversifyService
    const answer = await this.wrappers.question(
      `(string) address to filter (leave empty for current signer address (a) for all events)`,
    )
    const account = answer === 'a' ? undefined : answer.length !== 42 ? signerService.address : answer
    const { events } = await tvContractsEventsInversifyService.getEvents(account)

    this.wrappers.writeOutput(`all events:\n${events.map(service.eventToString).join('\n')}`)
  }

  public async preDeposit(): Promise<{ usdcAmount: number; receiveTheta: number }> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const balance = await service.tokenUSDC.balanceToString(signerService.address)
    const answer = await this.wrappers.question(`enter deposit amount - number [${balance}]`)
    if (!isNum(answer)) {
      throw new Error('invalid amount')
    }
    const usdcAmount = +answer
    const { thetaTokenAmount, thetaTokenAmountBN } = await service.USDCToThetaToken(usdcAmount)
    this.wrappers.writeOutput(`will receive: ${service.tokenThetaCvi.toString(thetaTokenAmountBN)}`)
    return { usdcAmount, receiveTheta: thetaTokenAmount }
  }

  public async deposit(): Promise<void> {
    const service = await this.getService()
    const { usdcAmount } = await this.preDeposit()
    await service.approveUsdc(usdcAmount)
    const receipt = await service.deposit(usdcAmount)
    if (receipt) {
      this.wrappers.writeOutput(`txHash: ${receipt.transactionHash}`)
    }
  }

  public async preWithdraw(): Promise<{
    usdcAmount: number
    usdcAmountBN: BigNumber
    thetaTokenAmount: number
    thetaTokenAmountBN: BigNumber
    isFull: boolean
  }> {
    const service = await this.getService()
    const signerService = this.inverifyContext.signerInversifyService
    const [{ positionBalanceUsdc, positionBalanceUsdcBn }, maxWithdraw] = await Promise.all([
      service.positionOfAddress(signerService.address),
      service.getMaxWithdraw(),
    ])
    const balanceString = service.tokenUSDC.toString(positionBalanceUsdcBn)
    const maxWithdrawString = `max withdraw: ${maxWithdraw} ${service.tokenUSDC.symbol}`
    const answer = await this.wrappers.question(
      `enter withdraw amount (usdc) - number (empty for full withdraw) [${balanceString}] ${maxWithdrawString}`,
    )
    const usdcAmount = isNum(answer) ? +answer : positionBalanceUsdc
    const usdcAmountBN = isNum(answer) ? service.tokenUSDC.fromNumber(+answer) : positionBalanceUsdcBn
    const [{ thetaTokenAmount, thetaTokenAmountBN }, willSucceed] = await Promise.all([
      service.USDCToThetaToken(usdcAmountBN),
      service.willWithdrawSucceed(usdcAmount),
    ])
    this.wrappers.writeOutput(
      `will receive: ${service.tokenUSDC.toString(
        usdcAmountBN,
      )} - ${thetaTokenAmountBN.toString()}, will succeed: ${willSucceed}`,
    )
    return { usdcAmount, usdcAmountBN, thetaTokenAmount, thetaTokenAmountBN, isFull: !isNum(answer) }
  }

  public async withdraw(): Promise<void> {
    const service = await this.getService()
    const { address } = this.inverifyContext.signerInversifyService
    const { usdcAmount, thetaTokenAmountBN, isFull } = await this.preWithdraw()
    await service.approveTvCviX2(isFull ? await service.tokenThetaCvi.getBalance(address) : thetaTokenAmountBN)
    const receipt = isFull ? await service.withdrawFull() : await service.withdraw(usdcAmount)
    if (receipt) {
      this.wrappers.writeOutput(`txHash: ${receipt.transactionHash}`)
    }
  }

  public async checkUpkeep(): Promise<void> {
    const service = await this.getService()
    const { upkeepNeeded, performData: data } = await service.checkUpkeep()
    const contract = service.cviContractsInversifyService.requestFulfiller
    const gasString = upkeepNeeded ? ` - gas cost: ${(await contract.estimateGas.performUpkeep(data)).toString()}` : ''
    this.wrappers.writeOutput(`check upkeep ${upkeepNeeded}${gasString}`)
  }

  public async upkeep(): Promise<void> {
    const service = await this.getService()
    const upkeep = await service.upkeep()
    this.wrappers.writeOutput(
      `upkeep ${upkeep.upkeepNeeded ? 'performed' : 'not needed'} gas cost: ${
        upkeep.upkeepNeeded ? upkeep.receipt.gasUsed.toString() : 0
      }`,
    )
  }

  public async fulfillDeposit(): Promise<void> {
    const service = await this.getService()
    const pendingRequest = await this.pendingRequests(TvRequestType.Deposit)
    const pendingDeposits = pendingRequest.filter(p => p.requestType === 1)
    const selection = await this.wrappers.selectItem('select pending deposit', pendingDeposits, service.eventToString)
    await service.fulfillDeposit(selection.requestId)
    this.wrappers.writeOutput(`fulfilled deposit ${selection.requestId}`)
  }

  public async fulfillWithdraw(): Promise<void> {
    const service = await this.getService()
    const pendingRequest = await this.pendingRequests(TvRequestType.Withdraw)
    const pendingWithdraws = pendingRequest.filter(p => p.requestType === 2)
    const selection = await this.wrappers.selectItem('select pending withdraw', pendingWithdraws, service.eventToString)
    await service.fulfillWithdraw(selection.requestId)
    this.wrappers.writeOutput(`fulfilled withdraw ${selection.requestId}`)
  }

  public async fastDeposit(): Promise<void> {
    await this.deposit()
    await this.advanceTimeToPendingRequest(TvRequestType.Deposit)
    await this.upkeep()
  }

  public async fastWithdraw(): Promise<void> {
    await this.withdraw()
    await this.advanceTimeToPendingRequest(TvRequestType.Withdraw)
    await this.upkeep()
  }

  public async rebalance(): Promise<void> {
    const service = await this.getService()
    const owner = await service.cviContractsInversifyService.vaultCvi.owner()
    const ownerSigner = this.inverifyContext.providerInversifyService.provider.getSigner(owner)
    const tx = await service.rebalance(ownerSigner)
    this.wrappers.writeOutput(`rebalance ${tx.status}`)
  }
}
