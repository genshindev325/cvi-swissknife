import { BigNumber } from 'ethers'
import type { CVIUSDCPlatform, StakingRewards } from '@coti-cvi/auto-generated-code/src/git-contract-types'
import type {
  ClosePositionEvent,
  OpenPositionEvent,
  LiquidatePositionEvent,
  DepositEvent,
  WithdrawEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/Platform'
import { inject, injectable } from 'inversify'
import type { GetContractInversifyService } from '../../get-contract.inversify.service'
import type { Token } from '../../token'
import type { IERC20, TokenName, CVISupportedChainIds } from '../../types'
import { CHAIN_IDS_INFO, BlockchainName } from '../../types'
import { sortEventsAsc, toNumber } from '../../util'

@injectable()
export class CviOldPlatformContractsEventsInversifyService {
  public readonly platform: CVIUSDCPlatform

  public readonly stakingRewards: StakingRewards | undefined

  constructor(
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
  ) {
    this.platform = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CVIUSDCPlatform',
    )
    if (CHAIN_IDS_INFO[chainId].blockchainName === BlockchainName.POLYGON) {
      this.stakingRewards = this.getContractService.getContractFromDeploymentsFile(
        BlockchainName.POLYGON,
        'CVIUSDCLPStakingRewards',
      )
    }
  }

  public getStakedLP = async ({ account, block }: { account: string; block?: number | string }) => {
    return this.stakingRewards ? this.stakingRewards.balanceOf(account, { blockTag: block }) : BigNumber.from(0)
  }

  public getLiquidityBalance = async ({ account, block }: { account: string; block?: number | string }) => {
    const [lpBalance, totalBalance, totalSupply, lpStaked] = await Promise.all([
      this.platform.balanceOf(account, { blockTag: block }),
      this.platform.totalBalance(true, { blockTag: block }),
      this.platform.totalSupply({ blockTag: block }),
      this.getStakedLP({ account, block }),
    ])
    const balance = lpBalance.add(lpStaked)
    const usdcBalance = totalSupply.isZero() ? BigNumber.from(0) : balance.mul(totalBalance).div(totalSupply)
    return {
      account,
      block,
      lpBalance,
      lpBalanceNumber: toNumber(balance, 18),
      lpBalanceString: `${toNumber(balance, 18)} USDC-LP`,
      usdcBalance,
      usdcBalanceNumber: this.tokenUSDC.toNumber(usdcBalance),
      usdcBalanceString: this.tokenUSDC.toString(usdcBalance),
    }
  }

  public calculateLiquidityPNL = (
    account: string,
    balanceStart: { usdcBalanceNumber: number; lpBalance: BigNumber },
    balanceEnd: { usdcBalanceNumber: number; lpBalance: BigNumber },
    events: (DepositEvent | WithdrawEvent)[],
    zeroBalanceReset = false,
  ) => {
    const isDeposit = (e: DepositEvent | WithdrawEvent): e is DepositEvent => e.event === 'Deposit'
    const { currentPNL, sum, stopped } = events.reduce(
      (
        a: { currentPNL: number; sum: number; balance: BigNumber; stopped: boolean },
        e: DepositEvent | WithdrawEvent,
      ) => {
        if (a.stopped || (zeroBalanceReset && a.balance.isZero())) {
          return { ...a, stopped: true }
        }
        const balanceChange = e.args.lpTokensAmount.mul(isDeposit(e) ? -1 : 1)
        const amountNumber = this.tokenUSDC.toNumber(e.args.tokenAmount)
        const feeNumber = this.tokenUSDC.toNumber(e.args.feeAmount)
        const currentPNL = a.currentPNL + (isDeposit(e) ? feeNumber - amountNumber : amountNumber - feeNumber)
        const sum = a.sum + (isDeposit(e) ? amountNumber : 0)
        return { currentPNL, sum, balance: a.balance.add(balanceChange), stopped: false }
      },
      { currentPNL: balanceEnd.usdcBalanceNumber, sum: 0, balance: balanceEnd.lpBalance, stopped: false },
    )
    const pnl = stopped ? currentPNL : currentPNL - balanceStart.usdcBalanceNumber
    const percent = sum === 0 ? 0 : (pnl / sum) * 100
    return { account, pnl, percent, pnlString: `${pnl.toFixed(6)} USDC`, percentString: `(${percent.toFixed(2)}%)` }
  }

  isLiquidationEvent = (
    event: DepositEvent | WithdrawEvent | ClosePositionEvent | OpenPositionEvent | LiquidatePositionEvent,
  ): event is LiquidatePositionEvent => {
    return event.event === 'LiquidatePosition'
  }

  public getUniqueAccountsFromEvents = (events: (DepositEvent | OpenPositionEvent)[]) => {
    return events.map(e => e.args.account).filter((item, i, a) => i === a.indexOf(item))
  }

  public getLiquidityEvents = async ({
    account,
    fromBlock,
    toBlock,
  }: {
    account?: string
    fromBlock?: string | number
    toBlock?: string | number
  }) => {
    const depositFilter = this.platform.filters.Deposit(account)
    const withdrawFilter = this.platform.filters.Withdraw(account)
    const events = await Promise.all([
      this.platform.queryFilter(depositFilter, fromBlock, toBlock),
      this.platform.queryFilter(withdrawFilter, fromBlock, toBlock),
    ])
    return {
      depositEvents: events[0].sort(sortEventsAsc),
      withdrawEvents: events[1].sort(sortEventsAsc),
      events: events.flat().sort(sortEventsAsc),
    }
  }

  public getPositionEvents = async ({
    account,
    fromBlock,
    toBlock,
  }: {
    account?: string
    fromBlock?: string | number
    toBlock?: string | number
  }) => {
    const openFilter = this.platform.filters.OpenPosition(account)
    const closeFilter = this.platform.filters.ClosePosition(account)
    const liquidatedFilter = this.platform.filters.LiquidatePosition(account)
    const events = await Promise.all([
      this.platform.queryFilter(openFilter, fromBlock, toBlock),
      this.platform.queryFilter(closeFilter, fromBlock, toBlock),
      this.platform.queryFilter(liquidatedFilter, fromBlock, toBlock),
    ])
    return {
      openedEvents: events[0].sort(sortEventsAsc),
      closedEvents: events[1].sort(sortEventsAsc),
      liquidatedEvents: events[2].sort(sortEventsAsc),
      events: events.flat().sort(sortEventsAsc),
    }
  }

  public liquidityEventsToString = (event: DepositEvent | WithdrawEvent): string => {
    const amount = `amount ${this.tokenUSDC.toNumber(event.args.tokenAmount)}`
    const lpTokens = `balance ${this.tokenUSDC.toNumber(event.args.lpTokensAmount)}`
    return `\n[${event.blockNumber}] ${event.args.account} ${event.event} ${amount} ${lpTokens}`
  }

  public positionEventToString = (event: ClosePositionEvent | OpenPositionEvent | LiquidatePositionEvent): string => {
    const address =
      event.event === 'LiquidatePosition'
        ? (event as LiquidatePositionEvent).args.positionAddress
        : (event as OpenPositionEvent | ClosePositionEvent).args.account
    const start = `[${event.blockNumber}] ${address} ${event.event} pos: ${this.tokenUSDC.toNumber(
      event.args.positionUnitsAmount,
    )}`
    let content = ''
    if (event.event === 'OpenPosition' || event.event === 'ClosePosition') {
      const e = event as OpenPositionEvent | ClosePositionEvent
      const { tokenAmount, feeAmount, cviValue } = e.args
      const feePercent = (this.tokenUSDC.toNumber(feeAmount) / this.tokenUSDC.toNumber(tokenAmount)) * 100
      const amount = `amount ${this.tokenUSDC.toString(tokenAmount)}`
      const fee = `fee ${this.tokenUSDC.toString(feeAmount)} (${feePercent.toFixed(2)}%)`
      content = `${amount} fee ${fee} - ${cviValue.toNumber() / 100} CVI`
    }
    return `\n${start} ${content}`
  }
}
