import { inject, injectable, optional } from 'inversify'
import { Zero } from '@ethersproject/constants'
import type { BigNumber, CallOverrides, Signer, ContractReceipt } from 'ethers'
import { ethers } from 'ethers'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { Token, UntypedToken } from '../token'
import type { TokenName, IERC20, ThetaVaultEvent, TvSupportedChainIds } from '../types'
import { TvRequestType } from '../types'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import type { GetForkNumberInversifyService } from '../util'
import { secondsToString } from '../util'
import { toNumber } from '../util'
import type { CviContractsInversifyService } from '../cvi-contracts'
import type {
  SubmitRequestEvent,
  LiquidateRequestEvent,
  FulfillDepositEvent,
  FulfillWithdrawEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/ThetaVault'
import type { CacheInversifyService } from '../cache.inversify.service'
import type { AsyncQueueInversifyService } from '../async-queue.inversify.service'

export type TvInfo = {
  dexCviBalanceUsdcByPlatformPrice: number
  dexCviBalanceUsdc: number
  currentThetaVaultUsdcBalance: number
  platformUSDCLiquidity: number
  platformVtBalanceUsdcByPlatformPrice: number
  dexCviBalance: number
  tvCollateralRatio: number
  tvUtilizationPercentage: number
  tvPlatformPnl: number
  tvLockedUsdc: number
  tvLockedPercentageOfTvCurrentBalance: number
}

@injectable()
export class ThetaVaultInversifyService {
  readonly defaultAPRDays = 30

  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('AsyncQueueInversifyService') private readonly asyncQueueInversifyService1: AsyncQueueInversifyService,
    @inject('CacheInversifyService') private readonly cacheInversifyService: CacheInversifyService,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCThetaToken') public readonly tokenThetaCvi: UntypedToken,
    @inject('CVIUSDCVolatilityToken') public readonly tokenCvi: UntypedToken,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('CviContractsInversifyService') public readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('GetForkNumberInversifyService')
    @optional()
    public readonly getForkNumberInversifyService?: GetForkNumberInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {}

  public balanceSupplyRatio = async (blockNumber?: number | 'latest') => {
    const [balance, supply] = await Promise.all([
      this.cacheInversifyService.get({
        key: 'balanceSupplyRatio-balance',
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.cviContractsInversifyService.vaultCvi
            .totalBalance({ blockTag: blockNumber })
            .then(r => this.tokenUSDC.toNumber(r.balance)),
      }),
      this.cacheInversifyService.get({
        key: 'balanceSupplyRatio-supply',
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.cviContractsInversifyService.vaultCvi
            .totalSupply({ blockTag: blockNumber })
            .then(r => this.tokenThetaCvi.toNumber(r)),
      }),
    ])
    return supply === 0 ? 1 : balance / supply
  }

  public averageBalanceSupplyRatio = async (
    creationBlock: number,
    currentBlock: number,
    block: number,
    samples: number[] = [1, 2, 3, 4, 5, 6, 7],
  ) => {
    const sampleBlocks = samples.flatMap(days => [
      { days, block: this.latestBlockInfoInversifyService.getBlockSecondsAgoFromOtherBlock(block, days * 86400) },
      { days, block: this.latestBlockInfoInversifyService.getBlockSecondsAgoFromOtherBlock(block, -days * 86400) },
    ])
    const ratios = await Promise.all(
      [
        ...(sampleBlocks.every(b => b.block >= creationBlock && b.block <= currentBlock) ? sampleBlocks : []),
        { days: 0, block },
      ].map(async b => ({ days: b.days, ratio: await this.balanceSupplyRatio(b.block) })),
    )
    const weightedAverage = (nums: [number, number][]) => {
      const [sum, weightSum] = nums.reduce(
        (acc, [n, w]) => {
          acc[0] = acc[0] + n * w
          acc[1] = acc[1] + w
          return acc
        },
        [0, 0],
      )
      return sum / weightSum
    }
    const dayToWeight = (day: number): number => (day === 0 ? 1 : 1 / day)
    return weightedAverage(ratios.map(({ days, ratio }) => [ratio, dayToWeight(days)]))
  }

  public calculatePNL = async (options?: {
    startBlock?: number | 'latest'
    endBlock?: number | 'latest'
    samples?: number[]
  }): Promise<{ fromBlock: number | 'latest'; toBlock: number | 'latest'; pnl: number }> => {
    const { fromBlock, toBlock } = this.cviContractsInversifyService.getContractInversifyService.getFromAndToBlock(
      this.cviContractsInversifyService.vaultCvi,
      options,
    )
    const { creationBlock } = this.cviContractsInversifyService.getContractInversifyService.getContractData(
      this.cviContractsInversifyService.vaultCvi,
    )
    const currentBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()
    const startBlock = fromBlock === 'latest' ? currentBlock.number : fromBlock
    const [ratioStart, ratioEnd] = await Promise.all([
      this.averageBalanceSupplyRatio(creationBlock, currentBlock.number, startBlock, options?.samples),
      this.balanceSupplyRatio(toBlock),
    ])
    return { fromBlock, toBlock, pnl: ((ratioEnd - ratioStart) / ratioStart) * 100 }
  }

  public calculateAPR = async (
    days = this.defaultAPRDays,
    samples?: number[],
    blockNumber?: number,
  ): Promise<{ period: number; apr: number }> => {
    const calcFromBlock =
      blockNumber === undefined
        ? undefined
        : await this.cacheInversifyService.get({
            key: 'block',
            blockTag: blockNumber,
            getFromBlockchain: () =>
              this.cviContractsInversifyService.getContractInversifyService.provider.getBlock(blockNumber).then(r => ({
                number: r.number,
                timestamp: r.timestamp,
              })),
          })
    const { block, currentBlockTimestamp } = await this.latestBlockInfoInversifyService.getBlockSecondsAgo(
      days * 86400,
      calcFromBlock,
    )

    const { creationBlock } = this.cviContractsInversifyService.getContractInversifyService.getContractData(
      this.cviContractsInversifyService.vaultCvi,
    )
    const startingBlock = creationBlock > block ? creationBlock : block
    const [fromBlock, { pnl }] = await Promise.all([
      this.cacheInversifyService.get({
        key: 'block',
        blockTag: startingBlock,
        getFromBlockchain: () =>
          this.cviContractsInversifyService.getContractInversifyService.provider.getBlock(startingBlock).then(r => ({
            number: r.number,
            timestamp: r.timestamp,
          })),
      }),
      this.calculatePNL({ startBlock: startingBlock, endBlock: blockNumber, samples }),
    ])
    const period = currentBlockTimestamp - fromBlock.timestamp
    return { period, apr: period === 0 ? 0 : (pnl * 365 * 24 * 60 * 60) / period }
  }

  public calculateAccountPNL = async (
    account: string,
    options?: {
      startBlock?: number | 'latest'
      endBlock?: number | 'latest'
      zeroBalanceReset?: boolean
    },
  ): Promise<{ pnl: number; percent: number }> => {
    const contract = this.cviContractsInversifyService.vaultCvi
    const zeroBalanceReset = options?.zeroBalanceReset === false ? false : true
    const { fromBlock, toBlock } = this.cviContractsInversifyService.getContractInversifyService.getFromAndToBlock(
      this.cviContractsInversifyService.vaultCvi,
      options,
    )
    const submitFilter = contract.filters.SubmitRequest(undefined, undefined, undefined, undefined, account)
    const depositFilter = contract.filters.FulfillDeposit(undefined, account)
    const withdrawFilter = contract.filters.FulfillWithdraw(undefined, account)
    const [submitEvents, depositEvents, withdrawEvents, balanceStart, balanceEnd] = await Promise.all([
      contract.queryFilter(submitFilter, fromBlock, toBlock),
      contract.queryFilter(depositFilter, fromBlock, toBlock),
      contract.queryFilter(withdrawFilter, fromBlock, toBlock),
      this.accountBalance(account, { blockTag: fromBlock }),
      this.accountBalance(account, { blockTag: toBlock }),
    ])
    const events = [...depositEvents, ...withdrawEvents].sort((a, b) => b.blockNumber - a.blockNumber)
    const completedIds = [...new Set(events.map(e => e.args.requestId.toString()))]
    const pendingWithdrawEvents = submitEvents.filter(
      e => !completedIds.includes(e.args.requestId.toString()) && e.args.requestType === TvRequestType.Withdraw,
    )
    const { usdcBalanceNumber, thetaBalanceAmount }: { usdcBalanceNumber: number; thetaBalanceAmount: BigNumber } =
      pendingWithdrawEvents.reduce(
        ({ usdcBalanceNumber, thetaBalanceAmount }, e) => ({
          usdcBalanceNumber:
            usdcBalanceNumber +
            this.tokenUSDC.toNumber(e.args.tokenAmount.mul(e.args.totalUSDCBalance).div(e.args.totalSupply)),
          thetaBalanceAmount: thetaBalanceAmount.add(e.args.tokenAmount),
        }),
        {
          usdcBalanceNumber: balanceEnd.balanceUSDCNumber,
          thetaBalanceAmount: balanceEnd.balanceAmount,
        },
      )
    const isDeposit = (e: FulfillDepositEvent | FulfillWithdrawEvent): e is FulfillDepositEvent =>
      'mintedThetaTokens' in e.args
    const { currentPNL, depositSum, stopped } = events.reduce(
      (
        a: { currentPNL: number; depositSum: number; balance: BigNumber; stopped: boolean },
        e: FulfillDepositEvent | FulfillWithdrawEvent,
      ) => {
        if (a.stopped || (zeroBalanceReset && a.balance.isZero())) {
          return { ...a, stopped: true }
        }
        const balanceChange = isDeposit(e) ? e.args.mintedThetaTokens.mul(-1) : e.args.burnedThetaTokens
        const currentPNL = a.currentPNL + this.tokenUSDC.toNumber(e.args.totalUSDCAmount.mul(isDeposit(e) ? -1 : 1))
        const depositSum = a.depositSum + (isDeposit(e) ? this.tokenUSDC.toNumber(e.args.totalUSDCAmount) : 0)
        return { currentPNL, depositSum, balance: a.balance.add(balanceChange), stopped: false }
      },
      { currentPNL: usdcBalanceNumber, depositSum: 0, balance: thetaBalanceAmount, stopped: false },
    )
    const pnl = stopped ? currentPNL : currentPNL - balanceStart.balanceUSDCNumber
    return { pnl, percent: depositSum === 0 ? 0 : (pnl / depositSum) * 100 }
  }

  public accountBalance = async (account: string, overrides: CallOverrides = { blockTag: 'latest' }) => {
    return this.cacheInversifyService.get({
      key: 'accountBalance',
      blockTag: overrides.blockTag,
      skipQueue: true,
      getFromBlockchain: async () => {
        const [balanceAmount, { balance }, supply] = await Promise.all([
          this.asyncQueueInversifyService1.push(
            () => this.cviContractsInversifyService.vaultCvi.balanceOf(account, overrides),
            `accountBalance::balanceOf`,
          ),
          this.asyncQueueInversifyService1.push(
            () => this.cviContractsInversifyService.vaultCvi.totalBalance(overrides),
            `accountBalance::totalBalance`,
          ),
          this.asyncQueueInversifyService1.push(
            () => this.cviContractsInversifyService.vaultCvi.totalSupply(overrides),
            `accountBalance::totalSupply`,
          ),
        ])
        if (balanceAmount.isZero()) {
          return {
            balanceNumber: 0,
            balanceString: '0',
            balanceUSDCNumber: 0,
            balanceUSDCString: '0',
            balanceAmount: Zero,
            balanceUSDCAmount: Zero,
          }
        }
        if (supply.isZero()) {
          throw new Error('[accountBalance] supply is zero')
        }
        const balanceUSDCAmount = balanceAmount.mul(balance).div(supply)
        return {
          balanceAmount,
          balanceUSDCAmount,
          balanceNumber: this.tokenThetaCvi.toNumber(balanceAmount),
          balanceString: this.tokenThetaCvi.toString(balanceAmount),
          balanceUSDCNumber: this.tokenUSDC.toNumber(balanceUSDCAmount),
          balanceUSDCString: this.tokenUSDC.toString(balanceUSDCAmount),
        }
      },
    })
  }

  public getTotalDepositRequestsAmount = async (blockTag?: number) => {
    return this.cacheInversifyService.get({
      key: 'getTotalDepositRequestsAmount',
      blockTag,
      getFromBlockchain: async () => {
        const totalDepositRequestsAmount = await this.cviContractsInversifyService.vaultCvi.totalDepositRequestsAmount({
          blockTag,
        })
        return {
          totalDepositRequestsNumber: this.tokenUSDC.toNumber(totalDepositRequestsAmount),
          totalDepositRequestsString: this.tokenUSDC.toString(totalDepositRequestsAmount),
        }
      },
    })
  }

  public getMinDeposit = async (blockTag?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getMinDeposit',
      blockTag,
      getFromBlockchain: async () => {
        const minDeposit = await this.cviContractsInversifyService.vaultCvi.minDepositAmount({ blockTag })

        return this.tokenUSDC.toNumber(minDeposit)
      },
    })
  }

  public getMinWithdraw = async (blockTag?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getMinWithdraw',
      blockTag,
      getFromBlockchain: async () => {
        const minWithdraw = await this.cviContractsInversifyService.vaultCvi.minWithdrawAmount({ blockTag })
        return this.tokenThetaCvi.toNumber(minWithdraw)
      },
    })
  }

  private getPoolAddress = (): string => {
    return this.cviContractsInversifyService.getContractInversifyService.getAddressOfDeployment(
      'CVIUSDCVolatilityTokenUSDCUNIV2Pair',
    )
  }

  public getMaxWithdraw = async (blockTag?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getMaxWithdraw',
      blockTag,
      getFromBlockchain: async () => {
        const { maxUSDCAmount } = await this.cviContractsInversifyService.helper.maxWithdrawAmount(
          this.cviContractsInversifyService.vaultCvi.address,
          {
            blockTag,
          },
        )
        return this.tokenUSDC.toNumber(maxUSDCAmount)
      },
    })
  }

  public willWithdrawSucceed = async (amount: number, blockTag?: number): Promise<boolean> => {
    return this.cviContractsInversifyService.helper.willWithdrawSucceed(
      this.cviContractsInversifyService.vaultCvi.address,
      (await this.USDCToThetaToken(amount)).thetaTokenAmountBN,
      {
        blockTag,
      },
    )
  }

  public getCollateralRatio = async (overrides: CallOverrides = { blockTag: 'latest' }): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getCollateralRatio',
      blockTag: overrides.blockTag,
      address: this.cviContractsInversifyService.platformContract.address,
      getFromBlockchain: async () => {
        const collateralRatio = await this.cviContractsInversifyService.getContractInversifyService
          .getHistoryContract(this.cviContractsInversifyService.helper, overrides)
          .collateralRatio(this.cviContractsInversifyService.platformContract.address, overrides)

        return toNumber(collateralRatio, 8)
      },
    })
  }

  public getTvUtilizationPercentage = async (overrides: CallOverrides = { blockTag: 'latest' }): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getTvUtilizationPercentage',
      blockTag: overrides.blockTag,
      address: this.cviContractsInversifyService.platformContract.address,
      getFromBlockchain: async () => {
        const utilizationRatio = await this.cviContractsInversifyService.getContractInversifyService
          .getHistoryContract(this.cviContractsInversifyService.helper, overrides)
          .premiumFeeCollateralRatio(this.cviContractsInversifyService.platformContract.address, overrides)
        return toNumber(utilizationRatio, 8)
      },
    })
  }

  public thetaTokenToUSDC = async (
    thetaAmount: number | BigNumber = this.tokenThetaCvi.fromNumber(1),
    blockNumber?: number,
  ) => {
    return this.cacheInversifyService.get({
      key: 'thetaTokenToUSDC',
      blockTag: blockNumber,
      address: this.cviContractsInversifyService.platformContract.address,
      skipQueue: true,
      getFromBlockchain: async () => {
        const amount = typeof thetaAmount === 'number' ? this.tokenThetaCvi.fromNumber(thetaAmount) : thetaAmount
        const [{ balance }, supply] = await Promise.all([
          this.asyncQueueInversifyService1.push(() => this.cviContractsInversifyService.vaultCvi.totalBalance()),
          this.asyncQueueInversifyService1.push(() => this.cviContractsInversifyService.vaultCvi.totalSupply()),
        ])
        if (supply.isZero()) {
          return { usdcAmountBN: this.tokenUSDC.fromNumber(0), usdcAmount: 0 }
        }
        const usdcAmountBN = amount.mul(balance).div(supply)
        return { usdcAmountBN, usdcAmount: this.tokenUSDC.toNumber(usdcAmountBN) }
      },
    })
  }

  public USDCToThetaToken = async (
    usdcAmount: number | BigNumber = this.tokenUSDC.fromNumber(1),
    blockNumber?: number,
  ) => {
    return this.cacheInversifyService.get({
      key: 'USDCToThetaToken',
      blockTag: blockNumber,
      address: this.cviContractsInversifyService.platformContract.address,
      skipQueue: true,
      getFromBlockchain: async () => {
        const amount = typeof usdcAmount === 'number' ? this.tokenUSDC.fromNumber(usdcAmount) : usdcAmount
        const [{ balance }, supply] = await Promise.all([
          this.asyncQueueInversifyService1.push(() => this.cviContractsInversifyService.vaultCvi.totalBalance()),
          this.asyncQueueInversifyService1.push(() => this.cviContractsInversifyService.vaultCvi.totalSupply()),
        ])
        if (balance.isZero()) {
          return { thetaTokenAmountBN: this.tokenThetaCvi.fromNumber(0), thetaTokenAmount: 0 }
        }
        const thetaTokenAmountBN = amount.mul(supply).div(balance)
        return { thetaTokenAmountBN, thetaTokenAmount: this.tokenThetaCvi.toNumber(thetaTokenAmountBN) }
      },
    })
  }

  public async getApproveUsdc(address: string, blockNumber?: number): Promise<number> {
    return this.cacheInversifyService.get({
      key: 'getApproveUsdc',
      blockTag: blockNumber,
      address: [address, this.cviContractsInversifyService.vaultCvi.address],
      getFromBlockchain: async () =>
        this.tokenUSDC.toNumber(
          await this.tokenUSDC.contract.allowance(address, this.cviContractsInversifyService.vaultCvi.address, {
            blockTag: blockNumber,
          }),
        ),
    })
  }

  public async getApproveTvCviX2(address: string, blockNumber?: number): Promise<number> {
    return this.cacheInversifyService.get({
      key: 'getApproveTvCvolX2',
      blockTag: blockNumber,
      address: [address, this.cviContractsInversifyService.vaultCvi.address],
      getFromBlockchain: async () =>
        this.tokenThetaCvi.toNumber(
          await this.cviContractsInversifyService.vaultCvi.allowance(
            address,
            this.cviContractsInversifyService.vaultCvi.address,
          ),
        ),
    })
  }

  public async approveUsdc(amountUsdc?: number): Promise<void> {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    await this.tokenUSDC.approve({
      signer: this.signerService.signer,
      to: this.cviContractsInversifyService.vaultCvi.address,
      overrides: await this.overridesService.get(),
      approveOptions: { amount: amountUsdc === undefined ? undefined : this.tokenUSDC.fromNumber(amountUsdc) },
    })
  }

  public async approveTvCviX2(amountTheta?: number | BigNumber): Promise<void> {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    await this.tokenThetaCvi.approve({
      signer: this.signerService.signer,
      to: this.cviContractsInversifyService.vaultCvi.address,
      overrides: await this.overridesService.get(),
      approveOptions: {
        amount:
          amountTheta === undefined
            ? undefined
            : typeof amountTheta === 'number'
            ? this.tokenThetaCvi.fromNumber(amountTheta)
            : amountTheta,
      },
    })
  }

  public info = async ({
    cviIndex,
    overrides = { blockTag: 'latest' },
  }: {
    cviIndex: number
    overrides?: CallOverrides
  }): Promise<TvInfo> => {
    return this.cacheInversifyService.get({
      key: 'tv-info',
      blockTag: overrides.blockTag,
      skipQueue: true,
      getFromBlockchain: async () => {
        const [balanceData, tvCollateralRatio, tvUtilizationPercentage, supply] = await Promise.all([
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.totalBalance(overrides),
          ),
          this.getCollateralRatio(overrides),
          this.getTvUtilizationPercentage(overrides),
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.totalSupply(overrides),
          ),
        ])
        const dexCviBalanceUsdcByPlatformPrice = this.tokenUSDC.toNumber(balanceData.intrinsicDEXVolTokenBalance)
        const dexCviBalanceUsdc = this.tokenUSDC.toNumber(balanceData.dexUSDCAmount)
        const platformUSDCLiquidity = this.tokenUSDC.toNumber(balanceData.usdcPlatformLiquidity)
        // platform includes what there is in DEX
        const platformVtBalanceUsdcByPlatformPrice = this.tokenUSDC.toNumber(balanceData.volTokenPositionBalance)
        // platform includes what there is in DEX
        const currentThetaVaultUsdcBalance = this.tokenUSDC.toNumber(balanceData.balance)
        const dexCviBalance = this.tokenCvi.toNumber(balanceData.dexVolTokensAmount)
        const tvPlatformPnl =
          this.tokenThetaCvi.toNumber(supply) > 0
            ? this.tokenUSDC.toNumber(balanceData.balance) / this.tokenThetaCvi.toNumber(supply)
            : 0

        const tvLockedUsdc = (((tvUtilizationPercentage / 100) * 200) / cviIndex) * currentThetaVaultUsdcBalance
        const tvLockedPercentageOfTvCurrentBalance = (tvLockedUsdc * 100) / currentThetaVaultUsdcBalance

        return {
          dexCviBalanceUsdcByPlatformPrice,
          dexCviBalanceUsdc,
          currentThetaVaultUsdcBalance,
          platformUSDCLiquidity,
          platformVtBalanceUsdcByPlatformPrice,
          dexCviBalance,
          tvCollateralRatio,
          tvUtilizationPercentage,
          tvPlatformPnl,
          tvLockedUsdc,
          tvLockedPercentageOfTvCurrentBalance,
        }
      },
    })
  }

  public deposit = async (amountUSDC: number /* , shouldStake = false */, signer?: Signer) => {
    const selectedSigner = signer ?? this.signerService?.signer
    if (!selectedSigner) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const tx = await this.cviContractsInversifyService.vaultCvi
      .connect(selectedSigner)
      .submitDepositRequest(
        this.tokenUSDC.fromNumber(amountUSDC) /* , shouldStake */,
        await this.overridesService.get(),
      )

    return tx.wait()
  }

  public withdraw = async (thetaTokenUsdcAmount: number) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService

    const positionOfAddress = await this.positionOfAddress(address)

    const thetaTokenAmount =
      (thetaTokenUsdcAmount / positionOfAddress.positionBalanceUsdc) * positionOfAddress.balanceThetaTokens

    const tx = await this.cviContractsInversifyService.vaultCvi
      .connect(signer)
      .submitWithdrawRequest(this.tokenThetaCvi.fromNumber(thetaTokenAmount), await this.overridesService.get())

    return tx.wait()
  }

  public withdrawFull = async () => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService

    const balanceAmount = await this.tokenThetaCvi.getBalance(address)

    const tx = await this.cviContractsInversifyService.vaultCvi
      .connect(signer)
      .submitWithdrawRequest(balanceAmount, await this.overridesService.get())

    return tx.wait()
  }

  public fulfillDeposit = async (requestId: string) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    return (
      await this.cviContractsInversifyService.vaultCvi
        .connect(this.signerService.signer)
        .fulfillDepositRequest(requestId)
    ).wait()
  }

  public fulfillWithdraw = async (requestId: string) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    return (
      await this.cviContractsInversifyService.vaultCvi
        .connect(this.signerService.signer)
        .fulfillWithdrawRequest(requestId)
    ).wait()
  }

  public checkWithdrawLock = async (
    account: string,
    blockNumber?: number,
  ): Promise<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }> => {
    return this.cacheInversifyService.get({
      key: 'checkWithdrawLock',
      blockTag: blockNumber,
      skipQueue: true,
      address: [account],
      getFromBlockchain: async () => {
        const [lockupPeriod, lastDeposit, { timestamp }] = await Promise.all([
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.lockupPeriod({ blockTag: blockNumber }),
          ),
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.lastDepositTimestamp(account, { blockTag: blockNumber }),
          ),
          this.latestBlockInfoInversifyService.getCurrentBlock(),
        ])
        const noDeposits = lastDeposit.isZero()

        if (noDeposits) {
          return { isLocked: false, lockEndTimestamp: 0, timeLeftSeconds: 0 }
        }
        const lockEnd = lastDeposit.add(lockupPeriod).toNumber()

        return { isLocked: lockEnd > timestamp, lockEndTimestamp: lockEnd, timeLeftSeconds: lockEnd - timestamp }
      },
    })
  }

  public positionOfAddress = async (address: string, blockTag?: number) => {
    return this.cacheInversifyService.get({
      key: 'positionOfAddress',
      blockTag,
      skipQueue: true,
      address,
      getFromBlockchain: async () => {
        const [balanceThetaTokensBn, { balance: totalBalanceUsdc }, totalSupplyThetaTokens] = await Promise.all([
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.balanceOf(address, { blockTag }),
          ),
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.totalBalance({ blockTag }),
          ),
          this.asyncQueueInversifyService1.push(() =>
            this.cviContractsInversifyService.vaultCvi.totalSupply({ blockTag }),
          ),
        ])
        if (totalSupplyThetaTokens.isZero()) {
          return {
            positionBalanceUsdcBn: ethers.constants.Zero,
            positionBalanceUsdc: 0,
            balanceThetaTokensBn: ethers.constants.Zero,
            balanceThetaTokens: 0,
            sharePercentage: 0,
          }
        }
        const positionBalanceUsdcBn = balanceThetaTokensBn.mul(totalBalanceUsdc).div(totalSupplyThetaTokens)
        const positionBalanceUsdc = this.tokenUSDC.toNumber(positionBalanceUsdcBn)
        const balanceThetaTokens = this.tokenThetaCvi.toNumber(balanceThetaTokensBn)
        const sharePercentage =
          (this.tokenThetaCvi.toNumber(balanceThetaTokensBn) / this.tokenThetaCvi.toNumber(totalSupplyThetaTokens)) *
          100

        return {
          positionBalanceUsdcBn,
          positionBalanceUsdc,
          balanceThetaTokensBn,
          balanceThetaTokens,
          sharePercentage,
        }
      },
    })
  }

  public tvl = async (blockTag?: number) => {
    return this.cacheInversifyService.get({
      key: 'tvl',
      blockTag,
      getFromBlockchain: () => this.cviContractsInversifyService.vaultCvi.totalBalance({ blockTag }),
    })
  }

  public maxCapacity = async (blockTag?: number) => {
    return this.cacheInversifyService.get({
      key: 'tv-maxCapacity',
      blockTag: blockTag,
      getFromBlockchain: async () => {
        const depositCapAmount = await this.cviContractsInversifyService.vaultCvi.depositCap({ blockTag })

        return {
          depositCapAmount,
          depositCapNumber: this.tokenUSDC.toNumber(depositCapAmount),
          depositCapString: this.tokenUSDC.toString(depositCapAmount),
        }
      },
    })
  }

  public async checkUpkeep(blockNumber?: number) {
    return this.cacheInversifyService.get({
      key: 'tv-checkUpkeep',
      blockTag: blockNumber,
      getFromBlockchain: () => this.cviContractsInversifyService.requestFulfiller.checkUpkeep([0]),
    })
  }

  public async performUpkeep(performData: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    return this.cviContractsInversifyService.requestFulfiller
      .connect(signer)
      .performUpkeep(performData, await this.overridesService.get())
  }

  public upkeep = async (): Promise<{ upkeepNeeded: false } | { upkeepNeeded: true; receipt: ContractReceipt }> => {
    const { upkeepNeeded, performData } = await this.checkUpkeep()
    if (upkeepNeeded) {
      const receipt = await (await this.performUpkeep(performData)).wait()
      return { upkeepNeeded, receipt }
    }
    return { upkeepNeeded }
  }

  public eventToString = (event: ThetaVaultEvent): string => {
    switch (event.status) {
      case 'pending':
        return `[⏱Processing] ${this.contractEventToString(event.request)}`
      case 'success':
        return `[✔Completed] ${this.contractEventToString(event.fulfill)}`
      case 'failure':
        return `[❌Failed] ${this.contractEventToString(event.liquidate)}`
    }
  }

  public contractEventToString = (
    event: SubmitRequestEvent | LiquidateRequestEvent | FulfillDepositEvent | FulfillWithdrawEvent,
  ): string => {
    const commonString = `[${event.blockNumber}-id:${event.args.requestId}] [${event.args.account}]`
    let eventString
    if (event.event === 'SubmitRequest') {
      const e = event as SubmitRequestEvent
      const timeString = new Date(e.args.targetTimestamp * 1000).toISOString()
      const amountString =
        e.args.requestType === TvRequestType.Deposit
          ? this.tokenUSDC.toString(e.args.tokenAmount)
          : this.tokenThetaCvi.toString(e.args.tokenAmount)
      eventString = `${TvRequestType[e.args.requestType]} - amount ${amountString}, target ${timeString} - ${
        Date.now() / 1000 - e.args.targetTimestamp < 0
          ? `due in: ${secondsToString(Date.now() / 1000 - e.args.targetTimestamp)}`
          : 'past due!'
      }`
    } else if (event.event === 'LiquidateRequest') {
      const e = event as LiquidateRequestEvent
      eventString = `${TvRequestType[e.args.requestType]} - ${e.args.tokenAmount}, liquidator: ${e.args.liquidator}`
    } else if (event.event === 'FulfillDeposit') {
      const e = event as FulfillDepositEvent
      const usdcAmount = this.tokenUSDC.toString(e.args.totalUSDCAmount)
      const mintedThetaTokenAmount = this.tokenThetaCvi.toString(e.args.mintedThetaTokens)
      eventString = `Deposit - amount ${usdcAmount} minted: ${mintedThetaTokenAmount}`
    } else if (event.event === 'FulfillWithdraw') {
      const e = event as FulfillWithdrawEvent
      const usdcAmount = this.tokenUSDC.toString(e.args.totalUSDCAmount)
      const burnedThetaTokenAmount = this.tokenThetaCvi.toString(e.args.burnedThetaTokens)
      eventString = `Withdraw - amount ${usdcAmount} burned: ${burnedThetaTokenAmount}`
    } else {
      throw new Error(`eventToString unknown event type ${event.event}`)
    }
    return `${commonString} ${eventString}`
  }

  public rebalance = async (owner: Signer) => {
    return (
      await this.cviContractsInversifyService.vaultCvi.connect(owner).rebalance(await this.overridesService.get())
    ).wait()
  }

  public setPeriods = async (owner: Signer, newLockupPeriod: number, newLiquidationPeriod: number) => {
    return (
      await this.cviContractsInversifyService.vaultCvi
        .connect(owner)
        .setPeriods(newLockupPeriod, newLiquidationPeriod, await this.overridesService.get())
    ).wait()
  }

  public serviceName(): 'thetaVault' {
    return 'thetaVault'
  }

  public emitPnlEvents = async (address: string) => {
    if (address) {
      return this.globalEventsInversifyService.emitWithAddress('tvPnl', address, async () =>
        this.calculateAccountPNL(address),
      )
    }
  }

  public emitAPREvents = async () => {
    return this.globalEventsInversifyService.emitTvault('tvAPR', async () => (await this.calculateAPR()).apr)
  }

  public emitLockWithdrawEvents = async (address: string) => {
    if (address) {
      return this.globalEventsInversifyService.emitWithAddress('tvWithdrawLockWithAddress', address, async () =>
        this.checkWithdrawLock(address),
      )
    }
  }
}
