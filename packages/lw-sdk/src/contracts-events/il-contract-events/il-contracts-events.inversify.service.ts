import { inject, injectable } from 'inversify'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { IlContractsInversifyService } from '../../il-contracts'
import type {
  ProtectionBoughtEvent,
  ProtectionClosedEvent,
} from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionController'
import type { TypedListener } from '../../../../auto-generated-code/src/git-contract-types/common'
import type {
  LiquidityAddedEvent,
  LiquidityWithdrawnEvent,
} from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/LiquidityController'
import type { FormatILContractsEventsInversifyService } from './format-il-contract-events.inversify.service'
import type { FormattedProtectionBoughtEvent, FormattedProtectionClosedEvent } from '../il-types'
import type { ProtectionMintDiscountDetailsEvent } from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionNFT'

@injectable()
export class ILContractsEventsInversifyService {
  constructor(
    @inject('FormatILContractsEventsInversifyService')
    private readonly formatILContractsEventsInversifyService: FormatILContractsEventsInversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('IlContractsInversifyService') private readonly ilContractsInversifyService: IlContractsInversifyService,
  ) {}

  public registerNewProtectionsBoughtEvents(address?: string) {
    const filter = this.ilContractsInversifyService.controller.filters.ProtectionBought(undefined, address)

    const listener: TypedListener<ProtectionBoughtEvent> = (...params) => {
      const payload = params[11]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilNewContractEventProtectionsBought',
        this.formatILContractsEventsInversifyService.toFormattedProtectionBoughtEvent(payload),
      )
    }

    this.ilContractsInversifyService.controller.on(filter, listener)

    return () => {
      this.ilContractsInversifyService.controller.off(filter, listener)
    }
  }

  public registerNewProtectionClosedEvents(address?: string) {
    const filter = this.ilContractsInversifyService.controller.filters.ProtectionClosed(undefined, undefined, address)

    const listener: TypedListener<ProtectionClosedEvent> = (...params) => {
      const payload = params[12]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilNewContractEventProtectionClosed',
        this.formatILContractsEventsInversifyService.toFormattedProtectionClosedEvent(payload),
      )
    }

    this.ilContractsInversifyService.controller.on(filter, listener)

    return () => {
      this.ilContractsInversifyService.controller.off(filter, listener)
    }
  }

  public registerNewLiquidityAddedEvents() {
    const filter = this.ilContractsInversifyService.liquidity.filters.LiquidityAdded()

    const listener: TypedListener<LiquidityAddedEvent> = (...params) => {
      const payload = params[3]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilNewLiquidityAddedEvents',
        this.formatILContractsEventsInversifyService.toFormattedLiquidityAddedEvent(payload),
      )
    }

    this.ilContractsInversifyService.liquidity.on(filter, listener)

    return () => {
      this.ilContractsInversifyService.liquidity.removeListener(filter, listener)
    }
  }

  public registerNewLiquidityWithdrawnEvents() {
    const filter = this.ilContractsInversifyService.liquidity.filters.LiquidityWithdrawn()

    const listener: TypedListener<LiquidityWithdrawnEvent> = (...params) => {
      const payload = params[3]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilNewLiquidityWithdrawnEvents',
        this.formatILContractsEventsInversifyService.toFormattedLiquidityWithdrawnEvent(payload),
      )
    }

    this.ilContractsInversifyService.liquidity.on(filter, listener)

    return () => {
      this.ilContractsInversifyService.liquidity.removeListener(filter, listener)
    }
  }

  public getProtectionsBoughtEventsUpToNow(address?: string): Promise<FormattedProtectionBoughtEvent[]> {
    return this.ilContractsInversifyService.controller
      .queryFilter(
        this.ilContractsInversifyService.controller.filters.ProtectionBought(undefined, address),
        0,
        'latest',
      )
      .then(r => r.map(e => this.formatILContractsEventsInversifyService.toFormattedProtectionBoughtEvent(e)))
  }

  public getProtectionsClosedEventsUpToNow(address?: string): Promise<FormattedProtectionClosedEvent[]> {
    return this.ilContractsInversifyService.controller
      .queryFilter(
        this.ilContractsInversifyService.controller.filters.ProtectionClosed(undefined, undefined, address),
        0,
        'latest',
      )
      .then(r => r.map(e => this.formatILContractsEventsInversifyService.toFormattedProtectionClosedEvent(e)))
  }

  public getOldPremiumGrowthChangedEvents() {
    return this.ilContractsInversifyService.config.queryFilter(
      this.ilContractsInversifyService.config.filters.ExpectedLPTokensValueGrowthChanged(),
      0,
      'latest',
    )
  }

  public getOldFeePercentageChangedEvents() {
    return this.ilContractsInversifyService.config.queryFilter(
      this.ilContractsInversifyService.config.filters.FeeComponentChanged(),
      0,
      'latest',
    )
  }

  public getOldMaxILProtectedPercentageChangedEvents() {
    return this.ilContractsInversifyService.config.queryFilter(
      this.ilContractsInversifyService.config.filters.MaxILProtectedChanged(),
      0,
      'latest',
    )
  }

  public getOldPolicyPeriodChangedEvents() {
    return this.ilContractsInversifyService.config.queryFilter(
      this.ilContractsInversifyService.config.filters.PolicyPeriodChanged(),
      0,
      'latest',
    )
  }

  public getOldMinAmountToBePaidChangedEvents() {
    return this.ilContractsInversifyService.config.queryFilter(
      this.ilContractsInversifyService.config.filters.MinAmountToBePaidChanged(),
      0,
      'latest',
    )
  }

  public getOldMaxProtectionsInUpkeepChangedEvents() {
    return this.ilContractsInversifyService.controller.queryFilter(
      this.ilContractsInversifyService.controller.filters.MaxProtectionsInUpkeepChanged(),
      0,
      'latest',
    )
  }

  public getOldLiquidityAddedEvents() {
    return this.ilContractsInversifyService.liquidity
      .queryFilter(this.ilContractsInversifyService.liquidity.filters.LiquidityAdded(), 0, 'latest')
      .then(r => r.map(e => this.formatILContractsEventsInversifyService.toFormattedLiquidityAddedEvent(e)))
  }

  public getOldLiquidityWithdrawnEvents() {
    return this.ilContractsInversifyService.liquidity
      .queryFilter(this.ilContractsInversifyService.liquidity.filters.LiquidityWithdrawn(), 0, 'latest')
      .then(r => r.map(e => this.formatILContractsEventsInversifyService.toFormattedLiquidityWithdrawnEvent(e)))
  }

  public registerNewLiquidityAddedEvents1() {
    const filter = this.ilContractsInversifyService.liquidity.filters.LiquidityAdded()

    const listener: TypedListener<LiquidityAddedEvent> = (...params) => {
      const payload = params[3]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilNewLiquidityAddedEvents',
        this.formatILContractsEventsInversifyService.toFormattedLiquidityAddedEvent(payload),
      )
    }

    this.ilContractsInversifyService.liquidity.on(filter, listener)

    return () => {
      this.ilContractsInversifyService.liquidity.removeListener(filter, listener)
    }
  }

  public registerNewProtectionMintDiscountDetailsEvents() {
    const filter = this.ilContractsInversifyService.nft.filters.ProtectionMintDiscountDetails()

    const listener: TypedListener<ProtectionMintDiscountDetailsEvent> = (...params) => {
      const payload = params[5]
      this.globalEventsInversifyService.eventEmitter.emit(
        'ilContractNewEventProtectionMintDiscountDetailsEvent',
        this.formatILContractsEventsInversifyService.toFormattedProtectionMintDiscountDetails(payload),
      )
    }

    this.ilContractsInversifyService.nft.on(
      this.ilContractsInversifyService.nft.filters.ProtectionMintDiscountDetails(),
      listener,
    )

    return () => {
      this.ilContractsInversifyService.nft.off(filter, listener)
    }
  }

  public getOldProtectionMintDiscountDetailsEvents() {
    return this.ilContractsInversifyService.nft
      .queryFilter(this.ilContractsInversifyService.nft.filters.ProtectionMintDiscountDetails(), 0, 'latest')
      .then(r => r.map(e => this.formatILContractsEventsInversifyService.toFormattedProtectionMintDiscountDetails(e)))
  }
}
