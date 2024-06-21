import { BigNumber } from 'ethers'
import type { Signer } from 'ethers'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { LatestBlockInfoInversifyService } from './latest-block-info-events.inversify.service'
import type { SignerInversifyService } from './signer.inversify.service'
import type {
  IERC20,
  Protections,
  PeriodSeconds,
  AntonPremiumParamsByPeriod,
  CalculateCustomPremiumValues,
  StaticProtectionMetadataDto,
  ArmadilloSupportedPair,
  ProtectionMetadata,
  ProtectionInfo,
} from './types'
import { TokenName, ArmadilloSupportedTokenName } from './types'
import { StrictEventEmitter } from 'strict-event-emitter'
import { CustomError, ErrorKind } from './custom-error'
import {
  extractSolidityContractErrorReason,
  secondsToString,
  transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber,
} from './util/utils'
import type { Token } from './token'
import type { CVIOracleInversifyService } from './cvi-oracle.inversify.service'
import { toNumber, toTimeString } from './util'
import type { OverridesInversifyService } from './overrides.inversify.service'
import { Stator } from './state'
import type { State } from './state'
import type { IlContractsInversifyService } from './il-contracts'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import { getPyParabolaCoefficientsClient } from './get-auto-generated-backend-clients'
import type { BlockTag } from '@ethersproject/providers'
import type { PyParabolaCoefficientsClientApi } from '@coti-cvi/auto-generated-code'
import { inject, injectable, optional } from 'inversify'

@injectable()
export class ILProtectionInversifyService {
  public readonly allProtectionsEventEmitter = new StrictEventEmitter<{
    protections: (state: State<Protections>) => void
  }>()

  public readonly leftTvpUsdcAvailableEventEmitter = new StrictEventEmitter<{
    leftTvpUsdcAvailable: (state: State<BigNumber>) => void
  }>()

  constructor(
    @inject('LatestBlockInfoInversifyService')
    public readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('IlContractsInversifyService') public readonly ilContractsInversifyService: IlContractsInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('TokenUSDC') public readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIOracleInversifyService') public readonly cVIOracleInversifyService: CVIOracleInversifyService,
    @inject('OverridesInversifyService') public readonly overridesService: OverridesInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {}

  public async getProtectionMetadata(protectionId: string): Promise<ProtectionMetadata> {
    const [metadata, details] = await Promise.all([
      this.ilContractsInversifyService.controller.openProtectionsWithMetadata(protectionId),
      this.ilContractsInversifyService.nft.getProtectionDetails(protectionId).catch(error => {
        throw new CustomError({
          name: 'getProtectionDetails',
          message: 'Failed to get protection details',
          errorKind: ErrorKind.SystemError,
          cause: error,
          extras: {
            protectionId,
          },
        })
      }),
    ])

    const token1 = Object.values(ArmadilloSupportedTokenName).find(t => t === details.token1Symbol)
    const token2 = Object.values(ArmadilloSupportedTokenName).find(t => t === details.token2Symbol)

    if (!token1 || !token2) {
      throw new Error(`Unknown token(s): ${details.token1Symbol}-${details.token2Symbol}`)
    }

    return {
      id: protectionId,
      lpTokensWorthAtBuyTimeUSD: this.tokenUSDC.toNumber(details.lpTokensWorthAtBuyTimeUSD),
      owner: details.owner,
      policyPeriodSeconds: details.protectionEndTimestamp.toNumber() - details.protectionStartTimestamp.toNumber(),
      protectionStartTimestamp: details.protectionStartTimestamp.toNumber(),
      protectionEndTimestamp: details.protectionEndTimestamp.toNumber(),
      premiumCostUSD: this.tokenUSDC.toNumber(details.premiumCostUSD),
      tokenName1: {
        ArmadilloSupportedTokenName: token1,
      },
      tokenName2: {
        ArmadilloSupportedTokenName: token2,
      },
      maxAmountToBePaidUsdc: this.tokenUSDC.toNumber(metadata.maxAmountToBePaid),
      policyPeriodDays:
        (details.protectionEndTimestamp.toNumber() - details.protectionStartTimestamp.toNumber()) / 86400,
      protectionStartTimestampUtc: new Date(details.protectionStartTimestamp.toNumber() * 1000).toISOString(),
      protectionEndTimestampUtc: new Date(details.protectionEndTimestamp.toNumber() * 1000).toISOString(),
      feeUsdc: this.tokenUSDC.toNumber(metadata.fee),
      feePercentage: 0.123456789, // tbd
    }
  }

  public async getTotalProtectionsCount(): Promise<number> {
    const totalSupply = await this.ilContractsInversifyService.nft.totalSupply()
    return totalSupply.toNumber()
  }

  // how much liquidity is locked
  public async getWorkingCapitalUsdc(): Promise<BigNumber> {
    return this.ilContractsInversifyService.controller.collateral()
  }

  public async getPairs(): Promise<ArmadilloSupportedPair[]> {
    const r = await this.ilContractsInversifyService.tokenPairRepository.getPairs()
    return r.map(p => {
      const tokenName1 = Object.values(ArmadilloSupportedTokenName).find(t => t === p.token1Symbol)
      const tokenName2 = Object.values(ArmadilloSupportedTokenName).find(t => t === p.token2Symbol)
      if (!tokenName1 || !tokenName2) {
        throw new Error(`Unknown token pair ${p.token1Symbol}/${p.token2Symbol}. you need to add it to TokenName enum`)
      }
      return {
        tokenName1,
        tokenName2,
      }
    })
  }

  public async getAntonCurrentPremiumParams(overrides?: { baseUrl?: string }): Promise<AntonPremiumParamsByPeriod[]> {
    const result = await getPyParabolaCoefficientsClient(overrides)
      .default.calcCoefficientsAllPairsCalculateCoefficientsAllPairsGet()
      .catch<PyParabolaCoefficientsClientApi.CalcResponseAllPairs>(error => {
        this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        return {
          results: [],
        }
      })

    return result.results
      .flatMap(perPair => {
        if (perPair.info.symbol0 === 'ETH') {
          perPair.info.symbol0 = TokenName.WETH
        }
        if (perPair.info.symbol1 === 'ETH') {
          perPair.info.symbol1 = TokenName.WETH
        }
        if (perPair.info.symbol0 === 'BTC') {
          perPair.info.symbol0 = TokenName.WBTC
        }
        if (perPair.info.symbol1 === 'BTC') {
          perPair.info.symbol1 = TokenName.WBTC
        }
        if (perPair.info.symbol0 === 'USD') {
          return [
            TokenName.DAI,
            TokenName.USDC,
            TokenName.USDT,
          ].map<PyParabolaCoefficientsClientApi.CalcResponseOnePair>(token => ({
            ...perPair,
            info: {
              ...perPair.info,
              symbol0: token,
            },
          }))
        }
        if (perPair.info.symbol1 === 'USD') {
          return [
            TokenName.DAI,
            TokenName.USDC,
            TokenName.USDT,
          ].map<PyParabolaCoefficientsClientApi.CalcResponseOnePair>(token => ({
            ...perPair,
            info: {
              ...perPair.info,
              symbol1: token,
            },
          }))
        }
        return perPair
      })
      .flatMap<AntonPremiumParamsByPeriod>(perPair => {
        const tokenName1 = Object.values(ArmadilloSupportedTokenName).find(t => t === perPair.info.symbol0)
        const tokenName2 = Object.values(ArmadilloSupportedTokenName).find(t => t === perPair.info.symbol1)
        if (!tokenName1 || !tokenName2) {
          throw new Error(
            `Unknown token pair ${perPair.info.symbol0}/${perPair.info.symbol1}. you need to add it to TokenName enum`,
          )
        }
        return perPair.results.map<AntonPremiumParamsByPeriod>(perPeriod => ({
          period: {
            periodSeconds: perPeriod.period * 24 * 60 * 60,
            periodSecondsFormat: secondsToString(perPeriod.period * 24 * 60 * 60),
          },
          pair: {
            tokenName1,
            tokenName2,
          },
          premiumParams: {
            A: Number(Math.abs(perPeriod.a).toFixed(10)),
            X0: Number(Math.abs(perPeriod.X0).toFixed(10)),
            C: Number(Math.abs(perPeriod.c).toFixed(10)),
          },
        }))
      })
  }

  public async getPremiumParamsForPairAndProtectionPeriod(
    tokenName1: string,
    tokenName2: string,
    policyPeriod: Number,
  ): Promise<{ A: number; X0: number; C: number }> {
    const tokenUSDC = this.tokenUSDC
    const values = await this.ilContractsInversifyService.tokenPairRepository.getPremiumParams(
      tokenName1,
      tokenName2,
      BigNumber.from(policyPeriod),
    )

    const A = transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
      tokenUSDC,
      propertyName: 'A',
      propertyValue: values.A,
    })

    const X0 = transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
      tokenUSDC,
      propertyName: 'X0',
      propertyValue: values.X0,
    })

    const C = transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
      tokenUSDC,
      propertyName: 'C',
      propertyValue: values.C,
    })

    return { A, X0, C }
  }

  public async getExpectedLPTokensValueGrowth(blockTag?: BlockTag) {
    const result = await this.ilContractsInversifyService.config.expectedLPTokensValueGrowth({ blockTag })
    const decimals = 4
    const bn = BigNumber.from(result)
    return {
      decimals,
      bn,
      number: toNumber(bn, decimals),
    }
  }

  public async getMaxILProtectedPercentage(blockTag?: BlockTag) {
    const result = await this.ilContractsInversifyService.config.maxILProtected({ blockTag })
    const decimals = 2
    const bn = BigNumber.from(result)

    return {
      decimals,
      bn,
      number: toNumber(bn, decimals),
    }
  }

  public async calculatePremiumUsdc({
    pair,
    lpTokensWorthAtBuyTimeUSD,
    policyPeriod,
    address = '0x0000000000000000000000000000000000000000', // address without embed account
  }: {
    pair: ArmadilloSupportedPair
    lpTokensWorthAtBuyTimeUSD: BigNumber
    policyPeriod: number
    address?: string
  }) {
    // TODO: remove this when we have a new version of the contract

    const result = await this.ilContractsInversifyService.controller.calculatePremiumDetailsAndMaxAmountToBePaid(
      address,
      pair.tokenName1,
      pair.tokenName2,
      lpTokensWorthAtBuyTimeUSD,
      policyPeriod,
    )

    const originalPremiumUsdc = this.tokenUSDC.toNumber(result.premium)
    const premiumDiscountUsdc = this.tokenUSDC.toNumber(result.premiumDiscount)
    const originalFeeUsdc = this.tokenUSDC.toNumber(result.fee)
    const feeDiscountUsdc = this.tokenUSDC.toNumber(result.feeDiscount)
    const maxAmountToBePaidUsdc = this.tokenUSDC.toNumber(result.maxAmountToBePaid)

    const discountUsdc = premiumDiscountUsdc + feeDiscountUsdc
    const duePaymentUsdc = originalPremiumUsdc + originalFeeUsdc - discountUsdc

    return {
      originalPremiumUsdc,
      originalFeeUsdc,
      discountUsdc,
      duePaymentUsdc,
      maxAmountToBePaidUsdc,
      premium: result.premium, // do not use
      fee: result.fee, // do not use
      maxAmountToBePaid: result.maxAmountToBePaid, // do not use
    }
  }

  public async calculateCustomPremiumUsdc({
    lpTokensWorthAtBuyTimeUsdc,
    totalLPTokensWorthAtBuyTimeUsdc,
    expectedLPTokensValueGrowth,
    liquidityUsdc,
    maxILProtectedPercentage,
    premiumParams,
    cvi,
    premiumGrowthStart,
    premiumSlope,
  }: CalculateCustomPremiumValues): Promise<BigNumber> {
    return this.ilContractsInversifyService.controller.calculateParameterizedPremium(
      lpTokensWorthAtBuyTimeUsdc,
      totalLPTokensWorthAtBuyTimeUsdc,
      expectedLPTokensValueGrowth,
      liquidityUsdc,
      maxILProtectedPercentage,
      premiumParams,
      cvi,
      premiumGrowthStart,
      premiumSlope,
    )
  }

  public async getPeriodsSeconds(): Promise<PeriodSeconds[]> {
    const periods = await this.ilContractsInversifyService.config.getPolicyPeriodsInSeconds()
    return periods.map<PeriodSeconds>(periodSeconds => ({
      periodSeconds: periodSeconds.toNumber(),
      periodSecondsFormat: secondsToString(periodSeconds.toNumber()),
    }))
  }

  public async getLiquidity(blockTag?: BlockTag): Promise<BigNumber> {
    return this.ilContractsInversifyService.liquidity.liquidity({ blockTag })
  }

  public listenToAccumulatedTvpUsdc() {
    const get = async () =>
      this.globalEventsInversifyService.emit('ilAccumulatedTvpUsdc', async () =>
        this.tokenUSDC.toNumber(
          await this.ilContractsInversifyService.controller.cumulativeSumLPTokensWorthAtBuyTimeUSD(),
        ),
      )

    get()

    this.globalEventsInversifyService.eventEmitter.on('ilNewContractEventProtectionsBought', get)

    return () => {
      this.globalEventsInversifyService.eventEmitter.off('ilNewContractEventProtectionsBought', get)
    }
  }

  public async getTvpUsdc() {
    return this.tokenUSDC.toNumber(await this.ilContractsInversifyService.controller.totalLPTokensWorthAtBuyTimeUSD())
  }

  public listenToTvpUsdc() {
    const get = async () => this.globalEventsInversifyService.emit('ilTvpUsdc', async () => this.getTvpUsdc())

    get()

    this.globalEventsInversifyService.eventEmitter.on('ilNewContractEventProtectionsBought', get)

    return () => {
      this.globalEventsInversifyService.eventEmitter.off('ilNewContractEventProtectionsBought', get)
    }
  }

  public async getProtectionsMetadata(account: string): Promise<StaticProtectionMetadataDto[]> {
    const ownerProtections = await this.ilContractsInversifyService.nft.getOwnerProtections(account)
    return ownerProtections.map<StaticProtectionMetadataDto>(
      ({
        id,
        owner,
        protectionStartTimestamp,
        protectionEndTimestamp,
        premiumCostUSD,
        lpTokensWorthAtBuyTimeUSD,
        token1Symbol,
        token2Symbol,
        policyPeriod,
      }) => ({
        id: id.toString(),
        owner,
        protectionStartTimestamp: protectionStartTimestamp.toNumber(),
        protectionEndTimestamp: protectionEndTimestamp.toNumber(),
        premiumCostUSD: premiumCostUSD.toString(),
        lpTokensWorthAtBuyTimeUSD: lpTokensWorthAtBuyTimeUSD.toString(),
        tokenName1: token1Symbol as ArmadilloSupportedTokenName,
        tokenName2: token2Symbol as ArmadilloSupportedTokenName,
        policyPeriodSeconds: policyPeriod.toNumber(),
      }),
    )
  }

  public async getActiveProtectionIlPercentage({
    protectionId,
    blockTag,
  }: {
    protectionId: string
    blockTag?: BlockTag
  }): Promise<number | undefined> {
    const currentILsForOpenProtections = await this.ilContractsInversifyService.controller
      .calculateOpenProtectionIL(protectionId, { blockTag })
      .catch(() => {
        // this method was created only a while ago, so it might not be available yet
        return undefined
      })
    if (currentILsForOpenProtections === undefined) {
      return undefined
    }
    // Note, the contract talks ratio, rather than percentage, so 0.01 means 1% IL
    const currentILsRatio = toNumber(BigNumber.from(currentILsForOpenProtections), 4)
    return currentILsRatio * 100
  }

  public async addLiquidity(amountUSD: number) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }

    const signer = this.signerService.signer
    await this.tokenUSDC.approve({
      signer,
      to: this.ilContractsInversifyService.liquidity.address,
      overrides: await this.overridesService.get(),
    })
    return (
      await this.ilContractsInversifyService.controller
        .connect(signer)
        .addLiquidity(this.tokenUSDC.fromNumber(amountUSD), await this.overridesService.get())
    ).wait()
  }

  public async withdrawLiquidity(amountUSD: number, to?: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    to = to || this.signerService.address
    return (
      await this.ilContractsInversifyService.controller
        .connect(signer)
        .withdrawLiquidity(this.tokenUSDC.fromNumber(amountUSD), to, await this.overridesService.get())
    ).wait()
  }

  public async getCurrentTvpUsdc(): Promise<number> {
    const currentValueProtectedBN: BigNumber =
      await this.ilContractsInversifyService.controller.totalLPTokensWorthAtBuyTimeUSD()

    return transformCalculateCustomPremiumUsdcParamsPropertyValueToNumber({
      tokenUSDC: this.tokenUSDC,
      propertyName: 'totalLPTokensWorthAtBuyTimeUsdc',
      propertyValue: currentValueProtectedBN,
    })
  }

  // how much lp-tokens the contract can protect until he will be in 100% colateral ratio
  public async getLeftTvpUsdcAvailable(pair: ArmadilloSupportedPair) {
    return this.ilContractsInversifyService.controller.calcMaxValueOfTokensWorthToProtect(
      pair.tokenName1,
      pair.tokenName2,
    )
  }

  public getLeftTvpUsdcAvailableEventEmitter(pair: ArmadilloSupportedPair) {
    let leftTvpUsdcAvailable: State<BigNumber> = Stator.pending()
    const get = async () => {
      leftTvpUsdcAvailable = Stator.pending(leftTvpUsdcAvailable)
      this.leftTvpUsdcAvailableEventEmitter.emit('leftTvpUsdcAvailable', leftTvpUsdcAvailable)
      leftTvpUsdcAvailable = Stator.resolve(await this.getLeftTvpUsdcAvailable(pair))
      this.leftTvpUsdcAvailableEventEmitter.emit('leftTvpUsdcAvailable', leftTvpUsdcAvailable)
    }

    const start = () => {
      const id = setInterval(get, 30_000)
      get()

      return () => {
        clearInterval(id)
      }
    }

    return {
      eventEmitter: this.leftTvpUsdcAvailableEventEmitter,
      start,
    }
  }

  public async buyProtection({
    pair,
    amountUSD,
    periodSeconds,
    maxPremiumCostUsdc,
    signer,
  }: {
    pair: ArmadilloSupportedPair
    amountUSD: number
    periodSeconds: number
    maxPremiumCostUsdc: BigNumber
    signer?: Signer
  }) {
    const getSigner = () => {
      if (signer) {
        return signer
      }
      if (!this.signerService) {
        throw new Error(`can't perform write operation - signer was not supplied`)
      }
      return this.signerService.signer
    }
    try {
      const selectedSigner = getSigner()
      this.globalEventsInversifyService.eventEmitter.emit('messages', {
        id: 'buyProtection',
        type: 'info',
        message: 'Please confirm the transaction in your wallet',
      })
      await this.tokenUSDC.approve({
        signer: selectedSigner,
        to: this.ilContractsInversifyService.liquidity.address,
        overrides: await this.overridesService.get(),
      })

      const tx = await this.ilContractsInversifyService.controller
        .connect(selectedSigner)
        .buyProtection(
          pair.tokenName1,
          pair.tokenName2,
          this.tokenUSDC.fromNumber(amountUSD),
          maxPremiumCostUsdc,
          periodSeconds,
          await this.overridesService.get(),
        )

      const wait = await tx.wait()

      this.globalEventsInversifyService.eventEmitter.emit('messages', {
        id: 'buyProtection',
        type: 'success',
        message: 'Transaction success!',
      })

      return wait
    } catch (error) {
      throw new CustomError({
        name: 'BuyProtectionError',
        message: 'failed to buy protection',
        errorKind: ErrorKind.SystemError,
        cause: error,
        extras: {
          reason: extractSolidityContractErrorReason(error),
        },
      })
    }
  }

  public async closeProtection(id: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    return (
      await this.ilContractsInversifyService.controller
        .connect(signer)
        .closeProtections([BigNumber.from(id)], await this.overridesService.get())
    ).wait()
  }

  public async checkUpkeep() {
    return await this.ilContractsInversifyService.controller.checkUpkeep([0])
  }

  public async performUpkeep(performData: string) {
    if (!this.signerService) {
      throw new Error(`can't perform write operation - signer was not supplied`)
    }
    const signer = this.signerService.signer
    const tx = await this.ilContractsInversifyService.controller
      .connect(signer)
      .performUpkeep(performData, await this.overridesService.get())
    return tx.wait()
  }

  public async checkAndPerformUpkeep() {
    const { upkeepNeeded, performData } = await this.checkUpkeep()
    if (upkeepNeeded) {
      return this.performUpkeep(performData)
    }
  }

  public async grantLiquidityProviderRole(owner: Signer, account: string) {
    const role = await this.ilContractsInversifyService.controller.LIQUIDITY_PROVIDER_ROLE()
    return (
      await this.ilContractsInversifyService.controller
        .connect(owner)
        .grantRole(role, account, await this.overridesService.get())
    ).wait()
  }

  public async setEnabledNFTDiscount(owner: Signer, enable: boolean) {
    return (
      await this.ilContractsInversifyService.ilProtectionDiscountNftController.connect(owner).setEnabled(enable)
    ).wait()
  }

  public protectionToString({ boughtEvent, expiredEvent, status }: ProtectionInfo, timestamp: number): string {
    if (expiredEvent) {
      return `[${boughtEvent.args.id}-Expired] payout ${status.payoutOrDuePayoutUsdc}$ expired at ${boughtEvent.args.protectionEndTimestampUtc}`
    }
    return `[${boughtEvent.args.id}-Active] payout ${status.payoutOrDuePayoutUsdc}$ time left ${toTimeString(
      boughtEvent.args.protectionEndTimestamp - timestamp,
    )}`
  }
}
