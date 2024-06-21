import { inject, injectable, optional } from 'inversify'
import { BigNumber, type ContractReceipt, type Signer } from 'ethers'
import type {
  CVIUSDCVolatilityToken,
  CVIUSDCVolTokenRequestFulfiller,
  CVIUSDCRequestFeesCalculator,
  CVIUSDCPlatform,
  PlatformHelper,
  CVIUSDCThetaVault,
  CVIUSDCFeesCalculator,
} from '@coti-cvi/auto-generated-code/contracts'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import type { OverridesInversifyService } from '../overrides.inversify.service'
import type { SignerInversifyService } from '../signer.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { Token, UntypedToken } from '../token'
import type {
  TokenName,
  IERC20,
  PendingFeeTableRowTypeExtraMint,
  PendingFeeTableRowTypeExtraBurn,
  TvSupportedChainIds,
} from '../types'
import { CHAIN_IDS_INFO } from '../types'
import type { GetForkNumberInversifyService } from '../util'
import { extractSolidityContractErrorReason, fromNumber, isDev, secondsToString, toNumber, toTimeString } from '../util'
import { VtRequestType } from '../types/vol-token-common-types'
import type {
  SimplePendingVolTokenEvent,
  PendingVolTokenEvent,
  VolTokenEvent,
  SimpleVolTokenEvent,
  GroupedFormattedVolTokenEvent,
  FormattedSimpleEvent,
} from '../types/vol-token-common-types'
import { Stator } from '../state'
import type {
  FormattedVtBurnEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtMintEvent,
  FormattedVtSubmitRequestEvent,
  GroupFormattedVolatilityTokensEvents,
} from '../contracts-events'
import type {
  SubmitRequestEvent,
  LiquidateRequestEvent,
  BurnEvent,
  FulfillRequestEvent,
  MintEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IVolatilityToken'
import type { CacheInversifyService } from '../cache.inversify.service'

@injectable()
export class VtInversifyService {
  private readonly helperContract: PlatformHelper

  private readonly volTokenContract: CVIUSDCVolatilityToken

  private readonly requestFulfillerContract: CVIUSDCVolTokenRequestFulfiller

  private readonly requestFeesCalculatorContract: CVIUSDCRequestFeesCalculator

  private readonly platformContract: CVIUSDCPlatform

  private readonly thetaVaultContract: CVIUSDCThetaVault

  private readonly feesCalculatorContract: CVIUSDCFeesCalculator

  public defaultSlippage = 0.01

  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('CacheInversifyService') private readonly cacheInversifyService: CacheInversifyService,
    @inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCVolatilityToken') public readonly tokenVOL: UntypedToken,
    @inject('CVIUSDCShortToken') public readonly tokenShort: UntypedToken,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('GetForkNumberInversifyService')
    @optional()
    public readonly getForkNumberInversifyService?: GetForkNumberInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {
    this.volTokenContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCVolatilityToken',
    )
    this.requestFulfillerContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCVolTokenRequestFulfiller',
    )
    this.requestFeesCalculatorContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCRequestFeesCalculator',
    )
    this.helperContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'PlatformHelper',
    )
    this.platformContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCPlatform',
    )
    this.thetaVaultContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCThetaVault',
    )
    this.feesCalculatorContract = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCFeesCalculator',
    )
  }

  private shouldUseCache(blockNumber: number) {
    if (isDev(this.chainId)) {
      if (blockNumber !== undefined) {
        return (
          this.getForkNumberInversifyService !== undefined &&
          this.getForkNumberInversifyService.stagingNodeForkBlockNumber !== undefined &&
          blockNumber < this.getForkNumberInversifyService.stagingNodeForkBlockNumber
        )
      }
    }

    return false
  }

  public registerNewPlatformUsdcEvent = () => {
    this.emitPlatformUsdcEvent()
    const id = setInterval(() => this.emitPlatformUsdcEvent(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewDexPriceEvent = () => {
    this.emitDexPriceEvent()
    const id = setInterval(() => this.emitDexPriceEvent(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewDailyFundingFeeEvent = () => {
    this.emitDailyFundingFeeEvent()
    const id = setInterval(() => this.emitDailyFundingFeeEvent(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewCollateralRatioEvent = () => {
    this.emitCollateralRatioEvent()
    const id = setInterval(() => this.emitCollateralRatioEvent(), 60_000)
    return () => clearInterval(id)
  }

  public registerNewBurnBalanceEvent = (address: string) => {
    this.emitBurnBalanceEvent(address)
    const id = setInterval(() => this.emitBurnBalanceEvent(address), 60_000)
    return () => clearInterval(id)
  }

  // public registerNewBuyingPremiumFeeEvent = (amountUSDC: number, timeWindow: number) => {
  //   this.emitPreMintEvent(amountUSDC, timeWindow)
  //   const id = setInterval(() => this.emitPreMintEvent(amountUSDC, timeWindow), 10_000)
  //   return () => clearInterval(id)
  // }

  public registerNewFundingFeeValuesEvent = (collateralPercentage: number) => {
    this.emitFundingFeeValuesEvent(collateralPercentage)
  }

  public getRebaseInfo = async (blockNumber?: number) => {
    const [minDeviation, maxDeviation] = await Promise.all([
      this.cacheInversifyService.get({
        key: 'minDeviationPercentage',
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.volTokenContract.minDeviationPercentage({ blockTag: blockNumber }).then(r => r / 100),
      }),
      this.cacheInversifyService.get({
        key: 'maxDeviationPercentage',
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.volTokenContract.maxDeviationPercentage({ blockTag: blockNumber }).then(r => r / 100),
      }),
    ])
    return { minDeviation, maxDeviation }
  }

  public getMaxMintAmount = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'MaxMintAmount',
      blockTag: blockNumber,
      address: this.tokenVOL.address,
      getFromBlockchain: () =>
        this.helperContract.maxMintAmount(this.tokenVOL.address).then(r => this.tokenUSDC.toNumber(r)),
    })
  }

  public getFundingFeeParams = async (blockNumber?: number) => {
    const contract = this.feesCalculatorContract
    const [
      owner,
      fundingFeeMinRate,
      fundingFeeMaxRate,
      minFundingFeeCviThreshold,
      maxFundingFeeCviThreshold,
      fundingFeeDivisionFactor,
      fundingFeeCoefficients,
      fundingFeeConstantRate,
    ] = await Promise.all([
      contract.owner({ blockTag: blockNumber }),
      contract.fundingFeeMinRate({ blockTag: blockNumber }),
      contract.fundingFeeMaxRate({ blockTag: blockNumber }),
      contract.minFundingFeeCviThreshold({ blockTag: blockNumber }),
      contract.maxFundingFeeCviThreshold({ blockTag: blockNumber }),
      contract.fundingFeeDivisionFactor({ blockTag: blockNumber }),
      contract.getFundingFeeCoefficients({ blockTag: blockNumber }),
      contract.fundingFeeConstantRate({ blockTag: blockNumber }),
    ])
    return {
      owner,
      fundingFeeMinRate: fundingFeeMinRate / 10000,
      fundingFeeMaxRate: fundingFeeMaxRate / 10000,
      minFundingFeeCviThreshold,
      maxFundingFeeCviThreshold,
      fundingFeeDivisionFactor,
      fundingFeeCoefficients,
      fundingFeeConstantRate,
    }
  }

  public setFundingFeeMinRate = async (min: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setFundingFeeMinRate(Math.floor(min * 10000))
    return tx.wait()
  }

  public setFundingFeeMaxRate = async (max: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setFundingFeeMaxRate(Math.floor(max * 10000))
    return tx.wait()
  }

  public setMinFundingFeeCviThreshold = async (min: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setMinFundingFeeCviThreshold(min)
    return tx.wait()
  }

  public setMaxFundingFeeCviThreshold = async (max: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setMaxFundingFeeCviThreshold(max)
    return tx.wait()
  }

  public setFundingFeeDivisionFactor = async (factor: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setFundingFeeDivisionFactor(factor)
    return tx.wait()
  }

  public setFundingFeeCoefficients = async (coefficients: number[], owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setFundingFeeCoefficients(coefficients)
    return tx.wait()
  }

  public setFundingFeeConstantRate = async (constantRate: number, owner: Signer) => {
    const tx = await this.feesCalculatorContract.connect(owner).setFundingFeeConstantRate(constantRate)
    return tx.wait()
  }

  public async getApproveUsdc(address: string, blockNumber?: number): Promise<number> {
    return this.cacheInversifyService.get({
      key: 'approveUsdc',
      blockTag: blockNumber,
      address: [address, this.tokenVOL.address],
      getFromBlockchain: () =>
        this.tokenUSDC.contract.allowance(address, this.tokenVOL.address).then(r => this.tokenUSDC.toNumber(r)),
    })
  }

  public predictUtilizationPercentageAfterMint = async (amount: number) => {
    const [vaultPositionUnits, totalPositionUnitsAmount, totalLeveragedTokensAmount, price] = await Promise.all([
      this.thetaVaultContract.vaultPositionUnits(),
      this.platformContract.totalPositionUnitsAmount(),
      this.platformContract.totalLeveragedTokensAmount(),
      this.helperContract.volTokenIntrinsicPrice(this.volTokenContract.address),
    ])

    const tokenAmount = this.tokenUSDC.fromNumber(amount)
    const newTotalUnits = totalPositionUnitsAmount.add(tokenAmount.mul(this.tokenUSDC.fromNumber(200)).div(price))
    const newTotalTokens = totalLeveragedTokensAmount.add(tokenAmount)

    const newRatio = newTotalUnits
      .sub(vaultPositionUnits)
      .mul(10 ** 10)
      .div(newTotalTokens)

    return toNumber(newRatio, 8)
  }

  public getMaxMintAmountFromUtilizationPercentage = async (maxUtilizationPercent = 35) => {
    const [vaultUnits, totalUnits, totalTokens, price] = await Promise.all([
      this.thetaVaultContract.vaultPositionUnits().then(r => this.tokenUSDC.toNumber(r)),
      this.platformContract.totalPositionUnitsAmount().then(r => this.tokenUSDC.toNumber(r)),
      this.platformContract.totalLeveragedTokensAmount().then(r => this.tokenUSDC.toNumber(r)),
      this.helperContract.volTokenIntrinsicPrice(this.volTokenContract.address).then(r => this.tokenUSDC.toNumber(r)),
    ])

    const maxRatio = maxUtilizationPercent / 100
    return (totalUnits - vaultUnits - maxRatio * totalTokens) / (maxRatio - 200 / price)
  }

  public getMinWaitTime = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'minWaitTime',
      blockTag: blockNumber,
      getFromBlockchain: () => this.requestFeesCalculatorContract.minWaitTime(),
    })
  }

  public getAfterTargetMaxTime = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'afterTargetMaxTime',
      blockTag: blockNumber,
      getFromBlockchain: () => this.requestFeesCalculatorContract.afterTargetMaxTime(),
    })
  }

  public getTurbulencePercent = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'calculateLatestTurbulenceIndicatorPercent',
      blockTag: blockNumber,
      getFromBlockchain: () => this.platformContract.calculateLatestTurbulenceIndicatorPercent().then(r => r / 100),
    })
  }

  public async approveUsdc(amountUsdc?: number): Promise<void> {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    await this.tokenUSDC.approve({
      signer: this.signerService.signer,
      to: this.tokenVOL.address,
      overrides: await this.overridesService.get(),
      approveOptions: { amount: amountUsdc === undefined ? undefined : this.tokenUSDC.fromNumber(amountUsdc) },
    })
  }

  public async getApproveCviX2(address: string, blockNumber?: number): Promise<number> {
    return this.cacheInversifyService.get({
      key: 'allowance',
      blockTag: blockNumber,
      address: [address, this.tokenVOL.address],
      getFromBlockchain: () =>
        this.tokenVOL.contract.allowance(address, this.tokenVOL.address).then(r => this.tokenVOL.toNumber(r)),
    })
  }

  public async approveCviX2(amountcvix2?: number | BigNumber): Promise<void> {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const amount =
      amountcvix2 === undefined
        ? undefined
        : typeof amountcvix2 === 'number'
        ? this.tokenVOL.fromNumber(amountcvix2)
        : amountcvix2
    await this.tokenVOL.approve({
      signer: this.signerService.signer,
      to: this.tokenVOL.address,
      overrides: await this.overridesService.get(),
      approveOptions: { amount },
    })
  }

  public getIntrinsicPrice = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getIntrinsicPrice',
      blockTag: blockNumber,
      address: [this.volTokenContract.address],
      getFromBlockchain: () =>
        this.getContractService
          .getHistoryContract(this.helperContract, { blockTag: blockNumber })
          .volTokenIntrinsicPrice(this.volTokenContract.address, {
            blockTag: blockNumber,
          })
          .catch(e => {
            if (extractSolidityContractErrorReason(e).toLowerCase().includes('No supply'.toLowerCase())) {
              return BigNumber.from(0)
            }
            throw e
          })
          .then(r => this.tokenUSDC.toNumber(r)),
    })
  }

  public getDexPrice = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getDexPrice',
      blockTag: blockNumber,
      address: this.thetaVaultContract.address,
      getFromBlockchain: () =>
        this.getContractService
          .getHistoryContract(this.helperContract, { blockTag: blockNumber })
          .volTokenDexPrice(this.thetaVaultContract.address, {
            blockTag: blockNumber,
          })
          .catch(e => {
            if (extractSolidityContractErrorReason(e).toLowerCase().includes('No liquidity'.toLowerCase())) {
              return BigNumber.from(0)
            }
            throw e
          })
          .then(r => this.tokenUSDC.toNumber(r)),
    })
  }

  public getHourlyFundingFee = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getHourlyFundingFee',
      blockTag: blockNumber,
      address: this.platformContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .dailyFundingFee(this.platformContract.address)
          .then(fee => (fee ? (this.tokenUSDC.toNumber(fee) * 100) / 24 : 0)),
    })
  }

  public getCollateralRatio = async (blockNumber?: number): Promise<number> => {
    return this.cacheInversifyService.get({
      key: 'getCollateralRatio',
      blockTag: blockNumber,
      address: this.platformContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .collateralRatio(this.platformContract.address)
          .then(collateralRatio => toNumber(collateralRatio, 8)),
    })
  }

  public getMinKeepersMintAmount = async (blockNumber?: number) => {
    const minAmount = await this.volTokenContract.minKeepersMintAmount({ blockTag: blockNumber })
    return { minAmount, minNumber: this.tokenUSDC.toNumber(minAmount) }
  }

  public getMinKeepersBurnAmount = async (blockNumber?: number) => {
    const minAmount = await this.volTokenContract.minKeepersBurnAmount({ blockTag: blockNumber })
    return { minAmount, minNumber: this.tokenVOL.toNumber(minAmount) }
  }

  public fundingFees = async (
    collateralPercentage: number,
    maxCollateralPercentage = collateralPercentage,
    blockNumber?: number,
  ): Promise<{ [CR: number]: { [CVI: number]: number } }> => {
    const minCVI = 1
    const maxCVI = 200
    const minCollateral = collateralPercentage
    const maxCollateral = maxCollateralPercentage

    return this.cacheInversifyService.get({
      key: 'fundingFees',
      blockTag: blockNumber,
      address: this.platformContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .fundingFeeValues(this.platformContract.address, minCVI, maxCVI, minCollateral, maxCollateral, {
            blockTag: blockNumber,
          })
          .then(feeArrayOfCollateralPercentages => {
            const fundingFeeValues: { [CR: number]: { [CVI: number]: number } } = {}
            for (let cr = 0; cr < feeArrayOfCollateralPercentages.length; cr++) {
              fundingFeeValues[cr + minCollateral] = {}
              for (let cvi = 0; cvi < feeArrayOfCollateralPercentages[0].length; cvi++) {
                fundingFeeValues[cr + minCollateral][cvi + minCVI] =
                  (this.tokenUSDC.toNumber(feeArrayOfCollateralPercentages[cr][cvi]) * 100) / 24
              }
            }

            return fundingFeeValues
          }),
    })
  }

  public getFundingFeeValues = async (
    collateralPercentage: number,
    maxCollateralPercentage = collateralPercentage,
    blockNumber?: number,
  ): Promise<number[]> => {
    const minCVI = 1
    const maxCVI = 200
    const minCollateral = collateralPercentage
    const maxCollateral = maxCollateralPercentage

    return this.cacheInversifyService.get({
      key: 'getFundingFeeValues',
      blockTag: blockNumber,
      address: this.platformContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .fundingFeeValues(this.platformContract.address, minCVI, maxCVI, minCollateral, maxCollateral, {
            blockTag: blockNumber,
          })
          .then(feeArrayOfCollateralPercentages => {
            const feeArrayOfCviIndexes = feeArrayOfCollateralPercentages[0]

            return feeArrayOfCviIndexes.map(fee => this.tokenUSDC.toNumber(fee) * 100)
          }),
    })
  }

  public getTimeWindow = async (blockNumber?: number): Promise<{ minTimeWindow: number; maxTimeWindow: number }> => {
    const [minTimeWindow, maxTimeWindow] = await Promise.all([
      this.cacheInversifyService.get({
        key: 'minTimeWindow',
        blockTag: blockNumber,
        getFromBlockchain: () => this.requestFeesCalculatorContract.minTimeWindow({ blockTag: blockNumber }),
      }),
      this.cacheInversifyService.get({
        key: 'maxTimeWindow',
        blockTag: blockNumber,
        getFromBlockchain: () => this.requestFeesCalculatorContract.maxTimeWindow({ blockTag: blockNumber }),
      }),
    ])
    return { minTimeWindow, maxTimeWindow }
  }

  public preMint = async (amountUSDC: number | BigNumber, timeWindow: number, blockNumber?: number) => {
    if (amountUSDC === 0) {
      return {
        netMintAmount: 0,
        expectedVolTokensAmount: toNumber(this.tokenUSDC.fromNumber(0), 2),
        buyingPremiumFeePercentage: 0,
        openPositionFee: 0,
        buyingPremiumFee: 0,
        timeWindowFee: 0,
        keepersFee: 0,
      }
    }
    const amount = typeof amountUSDC === 'number' ? this.tokenUSDC.fromNumber(amountUSDC) : amountUSDC

    return this.cacheInversifyService.get({
      key: 'preMint',
      blockTag: blockNumber,
      address: this.volTokenContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .calculatePreMint(this.volTokenContract.address, true, amount, timeWindow, {
            blockTag: blockNumber,
          })
          .then(res => ({
            netMintAmount: this.tokenUSDC.toNumber(res.netMintAmount),
            expectedVolTokensAmount: this.tokenVOL.toNumber(res.expectedVolTokensAmount),
            buyingPremiumFeePercentage: toNumber(res.buyingPremiumFeePercentage, 2),
            openPositionFee: this.tokenUSDC.toNumber(res.openPositionFee),
            buyingPremiumFee: this.tokenUSDC.toNumber(res.buyingPremiumFee),
            timeWindowFee: this.tokenUSDC.toNumber(res.timeWindowFee),
            keepersFee: this.tokenUSDC.toNumber(res.keepersFee),
          })),
    })
  }

  public checkPendingMint = async (
    requestId: number,
    isKeepers = true,
    blockNumber?: number,
  ): Promise<PendingFeeTableRowTypeExtraMint> => {
    return this.cacheInversifyService.get({
      key: 'checkPendingMint',
      blockTag: blockNumber,
      address: this.volTokenContract.address,
      getFromBlockchain: () =>
        this.helperContract
          .checkMintRequest(this.volTokenContract.address, requestId, isKeepers, { blockTag: blockNumber })
          .then(res => ({
            netMintAmount: this.tokenUSDC.toNumber(res.netMintAmount),
            expectedVolTokensAmount: this.tokenVOL.toNumber(res.expectedVolTokensAmount),
            buyingPremiumFeePercentage: toNumber(res.buyingPremiumFeePercentage, 2),
            insufficientLiquidity: res.insufficientLiquidity,
            insufficientSlippage: res.insufficientSlippage,
            openPositionFee: this.tokenUSDC.toNumber(res.openPositionFee),
            buyingPremiumFee: this.tokenUSDC.toNumber(res.buyingPremiumFee),
            timePenaltyFee: this.tokenUSDC.toNumber(res.timePenaltyFee),
            keepersFee: this.tokenUSDC.toNumber(res.keepersFee),
          })),
    })
  }

  public preBurn = async (amountVOL: number | BigNumber, timeWindow: number, blockNumber?: number) => {
    if (amountVOL === 0) {
      return {
        netBurnAmount: 0,
        expectedUSDCAmount: 0,
        closeFee: 0,
        timeWindowFee: 0,
        keepersFee: 0,
      }
    }
    const amount = typeof amountVOL === 'number' ? this.tokenVOL.fromNumber(amountVOL) : amountVOL

    return this.cacheInversifyService.get({
      key: 'preBurn',
      blockTag: blockNumber,
      address: this.volTokenContract.address,
      getFromBlockchain: async () => {
        const [res, price] = await Promise.all([
          this.helperContract.calculatePreBurn(this.volTokenContract.address, true, amount, timeWindow, {
            blockTag: blockNumber,
          }),
          this.getIntrinsicPrice(),
        ])
        return {
          netBurnAmount: this.tokenVOL.toNumber(res.netBurnAmount),
          expectedUSDCAmount: this.tokenUSDC.toNumber(res.expectedUSDCAmount),
          closeFee: this.tokenUSDC.toNumber(res.closeFee) / price,
          timeWindowFee: this.tokenUSDC.toNumber(res.timeWindowFee) / price,
          keepersFee: this.tokenUSDC.toNumber(res.keepersFee) / price,
        }
      },
    })
  }

  // NOTE: this function will revert if called with isKeepers = false
  // and the pending request is not yet out of the min wait time period (first 15 minutes)
  // checkPendingBurn with isKeepers = false should be called only when "Receive Now" is posible
  public checkPendingBurn = async (
    requestId: number,
    isKeepers = true,
    blockNumber?: number,
  ): Promise<PendingFeeTableRowTypeExtraBurn> => {
    return this.cacheInversifyService.get({
      key: 'checkPendingBurn',
      blockTag: blockNumber,
      address: this.volTokenContract.address,
      getFromBlockchain: async () => {
        const [res, price] = await Promise.all([
          this.helperContract.checkBurnRequest(this.volTokenContract.address, requestId, isKeepers, {
            blockTag: blockNumber,
          }),
          this.getIntrinsicPrice(),
        ])
        return {
          netBurnAmount: this.tokenVOL.toNumber(res.netBurnAmount),
          expectedUSDCAmount: this.tokenUSDC.toNumber(res.expectedUSDCAmount),
          closeFee: this.tokenUSDC.toNumber(res.closeFee) / price,
          timePenaltyFee: this.tokenUSDC.toNumber(res.timePenaltyFee) / price,
          keepersFee: this.tokenUSDC.toNumber(res.keepersFee) / price,
        }
      },
    })
  }

  public checkPendingRequest = async (
    pendingRequest: PendingVolTokenEvent | SimplePendingVolTokenEvent,
    isKeepers = true,
  ) => {
    return pendingRequest.requestType === VtRequestType.Mint
      ? this.checkPendingMint(pendingRequest.requestId, isKeepers)
      : this.checkPendingBurn(pendingRequest.requestId, isKeepers)
  }

  public submitMintRequest = async (
    amountUSDC: number,
    timeWindowInSeconds: number,
    slippage = this.defaultSlippage,
  ) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const { buyingPremiumFeePercentage } = await this.preMint(amountUSDC, timeWindowInSeconds)
    const amount = this.tokenUSDC.fromNumber(amountUSDC)
    const maxBuyingPremiumFeePercentage = fromNumber(slippage + buyingPremiumFeePercentage, 2)

    const tx = await this.volTokenContract
      .connect(signer)
      .submitKeepersMintRequest(amount, timeWindowInSeconds, maxBuyingPremiumFeePercentage)

    if (tx) {
      const receipt = await tx.wait()
      // emit update event
      if (receipt) {
        const id: number | undefined = receipt.events?.find(e => e.event === 'SubmitRequest')?.args?.requestId
        return { receipt, id }
      }
    }
  }

  public submitBurnRequest = async (amountVOL: number | BigNumber, timeWindowInSeconds: number) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const amount = typeof amountVOL === 'number' ? this.tokenVOL.fromNumber(amountVOL) : amountVOL

    const tx = await this.volTokenContract.connect(signer).submitKeepersBurnRequest(amount, timeWindowInSeconds)

    if (tx) {
      const receipt = await tx.wait()
      // emit update event
      if (receipt) {
        const id: number | undefined = receipt.events?.find(e => e.event === 'SubmitRequest')?.args?.requestId
        return { receipt, id }
      }
    }
  }

  public submitFullBurnRequest = async (timeWindowInSeconds: number) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const { signer, address } = this.signerService
    const amount = await this.tokenVOL.getBalance(address)

    const tx = await this.volTokenContract.connect(signer).submitKeepersBurnRequest(amount, timeWindowInSeconds)

    if (tx) {
      const receipt = await tx.wait()
      // emit update event
      if (receipt) {
        const id: string | undefined = receipt.events
          ?.find(e => e.event === 'SubmitRequest')
          ?.args?.requestId.toString()
        return { receipt, id }
      }
    }
  }

  public getRequest = async (requestId: number) => {
    return this.volTokenContract.requests(requestId)
  }

  public fulfillMint = async (
    pendingRequest: SimplePendingVolTokenEvent | PendingVolTokenEvent | number,
    overrideSlippage?: number,
  ) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const requestId = typeof pendingRequest === 'number' ? pendingRequest : pendingRequest.requestId
    const maxBuyingPremiumFeePercentage = overrideSlippage
      ? Math.round((overrideSlippage + (await this.checkPendingMint(requestId)).buyingPremiumFeePercentage) * 100)
      : typeof pendingRequest === 'number'
      ? (await this.getRequest(requestId)).maxBuyingPremiumFeePercentage
      : pendingRequest.request.args.maxBuyingPremiumFeePercentage

    const receipt = await (
      await this.volTokenContract.connect(signer).fulfillMintRequest(requestId, maxBuyingPremiumFeePercentage, false)
    ).wait()
    const event = receipt.events?.find(e => e.event === 'Mint') as MintEvent | undefined
    if (!event) {
      throw new Error(`fulfillMint - no mint event found in receipt`)
    }
    const minted = this.tokenVOL.toNumber(event.args.mintedTokens)
    const amountUSDC = this.tokenUSDC.toNumber(event.args.tokenAmount)
    return { receipt, minted, amountUSDC }
  }

  public fulfillBurn = async (pendingRequest: SimplePendingVolTokenEvent | PendingVolTokenEvent | number) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const requestId = typeof pendingRequest === 'number' ? pendingRequest : pendingRequest.requestId
    const receipt = await (await this.volTokenContract.connect(signer).fulfillBurnRequest(requestId, false)).wait()
    const event = receipt.events?.find(e => e.event === 'Burn') as BurnEvent | undefined
    if (!event) {
      throw new Error(`fulfillBurn - no burn event found in receipt`)
    }
    const burned = this.tokenVOL.toNumber(event.args.burnedTokens)
    const amountUSDC = this.tokenUSDC.toNumber(event.args.tokenAmount)
    return { receipt, burned, amountUSDC }
  }

  public async checkUpkeep() {
    return this.requestFulfillerContract.checkUpkeep([0])
  }

  public async performUpkeep(performData: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    console.log(
      `${new Date().toISOString()} - ${
        VtInversifyService.name
      } - trying to perform upkeep using signer: ${await signer.getAddress()}`,
    )
    return this.requestFulfillerContract.connect(signer).performUpkeep(performData, await this.overridesService.get())
  }

  public upkeep = async (): Promise<{ upkeepNeeded: false } | { upkeepNeeded: true; receipt: ContractReceipt }> => {
    const { upkeepNeeded, performData } = await this.checkUpkeep()
    if (upkeepNeeded) {
      const receipt = await (await this.performUpkeep(performData)).wait()
      return { upkeepNeeded, receipt }
    }
    return { upkeepNeeded }
  }

  public liquidate = async (requestId: number) => {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const tx = await this.volTokenContract.connect(signer).liquidateRequest(requestId)
    return tx.wait()
  }

  public eventToString = (event: VolTokenEvent): string => {
    switch (event.status) {
      case 'pending':
        return `[⏱Processing] ${this.contractEventToString(event.request)}`
      case 'success':
        return `[✔Completed] ${this.contractEventToString(
          event.requestType === 1 ? event.mint : event.burn,
        )} ${this.contractEventToString(event.fulfill)}`
      case 'failure':
        return `[❌Failed] ${this.contractEventToString(event.request)} ${this.contractEventToString(event.liquidate)}`
      default:
        throw new Error(`There is no appropriate status!`)
    }
  }

  public contractEventToString = (event: GroupFormattedVolatilityTokensEvents): string => {
    let commonString = `[${event.blockNumber}-id:${event.args.requestId}] [${event.args.account}]`
    let eventString
    if (event.type === 'VtSubmitEvent') {
      const e = event as FormattedVtSubmitRequestEvent
      const timeString = new Date(e.args.targetTimestamp * 1000).toISOString()
      const amountString =
        e.args.requestType === VtRequestType.Mint
          ? this.tokenUSDC.toString(e.args.tokenAmountPaid)
          : this.tokenVOL.toString(e.args.tokenAmountPaid)
      const slippage =
        e.args.requestType === VtRequestType.Mint ? ` slippage: ${e.args.maxBuyingPremiumFeePercentage / 100}` : ''
      eventString = `${VtRequestType[e.args.requestType]} - amount ${amountString}, target ${timeString} - ${
        Date.now() / 1000 - e.args.targetTimestamp < 0
          ? `due in: ${secondsToString(Date.now() / 1000 - e.args.targetTimestamp)}`
          : 'past due!'
      }, Use Keepers ${e.args.useKeepers}, ${slippage}`
    } else if (event.type === 'VtLiquidateEvent') {
      const e = event as FormattedVtLiquidateRequestEvent
      eventString = `${VtRequestType[e.args.requestType]} - liquidator: ${e.args.liquidator}`
      commonString = ''
    } else if (event.type === 'VtFulfillEvent') {
      const e = event as FormattedVtFulfillRequestEvent
      eventString = `fees: ${e.args.fulfillFeesAmount} ${e.args.tokenNameFulfillFeesAmount}, keepers: ${e.args.useKeepers}`
      commonString = ''
    } else if (event.type === 'VtMintEvent') {
      const e = event as FormattedVtMintEvent
      const usdcPaidAfterTimeDelayFee = this.tokenUSDC.toString(e.args.usdcPaidAfterTimeDelayFee)
      const mintedVolTokens = this.tokenVOL.toString(e.args.mintedTokens)
      const openFee = this.tokenUSDC.toString(e.args.openPositionFee)
      const premiumFee = this.tokenUSDC.toString(e.args.buyingPremiumFee)
      eventString = `Mint - amount-after-time-delay-fee ${usdcPaidAfterTimeDelayFee} minted: ${mintedVolTokens} open fee: ${openFee}, premium fee: ${premiumFee}`
    } else if (event.type === 'VtBurnEvent') {
      const e = event as FormattedVtBurnEvent
      const usdcAmount = this.tokenUSDC.toString(e.args.usdcAmountReceived)
      const burnedVolTokenAmount = this.tokenVOL.toString(e.args.burnedTokensCvi)
      const closeFee = this.tokenVOL.toString(e.args.closePositionFee)
      const premiumFee = this.tokenVOL.toString(e.args.closingPremiumFee)
      eventString = `Burn - amount ${usdcAmount} burned: ${burnedVolTokenAmount} close fee: ${closeFee}, premium fee: ${premiumFee}`
    }
    return `${commonString} ${eventString}`
  }

  public simpleEventToString = (event: SimpleVolTokenEvent): string => {
    switch (event.status) {
      case 'pending':
        return `[⏱Processing] ${this.simpleContractEventToString(event.request)}`
      case 'success':
        return `[✔Completed] ${this.simpleContractEventToString(
          event.requestType === 1 ? event.mint : event.burn,
        )} ${this.simpleContractEventToString(event.fulfill)}`
      case 'failure':
        return `[❌Failed] ${this.simpleContractEventToString(event.request)} ${this.simpleContractEventToString(
          event.liquidate,
        )}`
      default:
        throw new Error(`There is no appropriate status!`)
    }
  }

  public simpleContractEventToString = (event: GroupedFormattedVolTokenEvent): string => {
    let commonString = `[${event.blockNumber}-id:${event.args.requestId}] [${event.args.account}]`
    let eventString
    if (event.event === 'SubmitRequest') {
      const e = event as FormattedSimpleEvent<SubmitRequestEvent>
      const timeString = new Date(e.args.targetTimestamp * 1000).toISOString()
      const isMint = e.args.requestType === VtRequestType.Mint
      const amount = isMint ? this.tokenUSDC.toString(e.args.tokenAmount) : this.tokenVOL.toString(e.args.tokenAmount)
      const slippage = isMint ? ` slippage: ${e.args.maxBuyingPremiumFeePercentage / 100}` : ''
      const time = `target ${timeString} - ${toTimeString(Date.now() / 1000 - e.args.targetTimestamp)}`
      const keepers = `Use Keepers ${e.args.useKeepers}`
      eventString = `${VtRequestType[e.args.requestType]} - amount ${amount}, ${time}, ${keepers}, ${slippage}`
    } else if (event.event === 'LiquidateRequest') {
      const e = event as FormattedSimpleEvent<LiquidateRequestEvent>
      eventString = `${VtRequestType[e.args.requestType]} - liquidator: ${e.args.liquidator}`
      commonString = ''
    } else if (event.event === 'FulfillRequest') {
      const e = event as FormattedSimpleEvent<FulfillRequestEvent>
      eventString = `fees: ${e.args.fulfillFeesAmount}, keepers: ${e.args.useKeepers}`
      commonString = ''
    } else if (event.event === 'Mint') {
      const e = event as FormattedSimpleEvent<MintEvent>
      const mintedVolTokens = this.tokenVOL.toString(e.args.mintedTokens)
      const openFee = this.tokenUSDC.toString(e.args.openPositionFee)
      const premiumFee = this.tokenUSDC.toString(e.args.buyingPremiumFee)
      eventString = `Mint - minted: ${mintedVolTokens} open fee: ${openFee}, premium fee: ${premiumFee}`
    } else if (event.event === 'Burn') {
      const e = event as FormattedSimpleEvent<BurnEvent>
      const usdcAmount = this.tokenUSDC.toString(e.args.tokenAmount)
      const burnedVolTokenAmount = this.tokenVOL.toString(e.args.burnedTokens)
      const closeFee = this.tokenVOL.toString(e.args.closePositionFee)
      const premiumFee = this.tokenVOL.toString(e.args.closingPremiumFee)
      eventString = `Burn - amount ${usdcAmount} burned: ${burnedVolTokenAmount} close fee: ${closeFee}, premium fee: ${premiumFee}`
    }
    return `${commonString} ${eventString}`
  }

  public emitPlatformUsdcEvent = () => {
    this.globalEventsInversifyService.emitVolatility('vtPlatformUsdc', async () => this.getIntrinsicPrice())
  }

  public emitDexPriceEvent = () => {
    this.globalEventsInversifyService.emitVolatility('vtDexPrice', async () => this.getDexPrice())
  }

  public emitDailyFundingFeeEvent = () => {
    this.globalEventsInversifyService.emitVolatility('vtDailyFundingFee', async () => this.getHourlyFundingFee())
  }

  public emitCollateralRatioEvent = () => {
    this.globalEventsInversifyService.emitVolatility('vtCollateralRatio', async () => this.getCollateralRatio())
  }

  public emitBurnBalanceEvent = (address: string) => {
    this.globalEventsInversifyService.emitWithAddressVT('vtBurnBalance', address, async () =>
      this.tokenVOL.toNumber(await this.tokenVOL.getBalance(address)),
    )
  }

  public emitBalanceEvent = (address: string) => {
    this.globalEventsInversifyService.emitWithAddressVT('vtBalance', address, async () =>
      this.tokenUSDC.toNumber(await this.tokenUSDC.getBalance(address)),
    )
  }

  public emitMaxMintAmountEvent = () => {
    this.globalEventsInversifyService.emitVolatility('vtMaxMintAmount', async () => this.getMaxMintAmount())
  }

  public emitFundingFeeValuesEvent = async (collateralPercentage: number) => {
    try {
      this.globalEventsInversifyService.eventEmitterVolatility.emit(
        'vtFundingFeeValues',
        collateralPercentage,
        Stator.pending(),
      )

      const feePercentages = await this.getFundingFeeValues(collateralPercentage)
      this.globalEventsInversifyService.eventEmitterVolatility.emit(
        'vtFundingFeeValues',
        collateralPercentage,
        Stator.resolve(feePercentages),
      )
    } catch (error) {
      this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      this.globalEventsInversifyService.eventEmitterVolatility.emit(
        'vtFundingFeeValues',
        collateralPercentage,
        Stator.reject(undefined, error),
      )
    }
  }

  public serviceName(): 'volatilityTokens' {
    return 'volatilityTokens'
  }
}
