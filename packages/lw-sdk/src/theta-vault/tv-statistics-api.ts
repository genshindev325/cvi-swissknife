import { CviBackendClientApi } from '@coti-cvi/auto-generated-code'
import type {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { chain } from 'lodash'
import _ from 'lodash'
import { sortEventsAsc } from '../util'

export type TvRequestsEvents =
  | CviBackendClientApi.TvSubmitEventDto
  | TvFulfillDepositEventDto
  | TvFulfillWithdrawEventDto
  | TvLiquidateEventDto

export type AllTvEvents = TvRequestsEvents

export class TvStatisticsApi {
  public readonly allEventsAsc: AllTvEvents[]

  constructor(_allEvents: AllTvEvents[]) {
    this.allEventsAsc = _allEvents.slice().sort(sortEventsAsc)
  }

  public calcVolumeUsdc() {
    return _.sum(
      this.allEventsAsc
        .flatMap(e => (e.type === CviBackendClientApi.TvSubmitEventDto.type.TV_SUBMIT_EVENT ? [e] : []))
        .map(e => e.args.tokenAmountInUsdc),
    )
  }

  public groupByEventTypes() {
    return chain(this.allEventsAsc)
      .groupBy(e => e.type)
      .map((events, type) => ({ type, eventsAsc: events.sort(sortEventsAsc) }))
      .value()
  }

  public countDepositRequests() {
    return chain(this.allEventsAsc)
      .groupBy(e => e.args.requestId)
      .values()
      .flatMap()
      .filter(e => e.type === 'TvFulfillDepositEvent')
      .value().length
  }

  public countWithdrawRequests() {
    return chain(this.allEventsAsc)
      .groupBy(e => e.args.requestId)
      .values()
      .flatMap()
      .filter(e => e.type === 'TvFulfillWithdrawEvent')
      .value().length
  }

  public countPendingRequests() {
    return chain(this.allEventsAsc)
      .groupBy(e => e.args.requestId)
      .values()
      .flatMap(r => (r.length === 1 ? r.find(e => e.type === 'TvSubmitEvent') || [] : []))
      .value().length
  }

  public countExpiredRequests() {
    return chain(this.allEventsAsc)
      .groupBy(e => e.args.requestId)
      .values()
      .flatMap(r => r.find(e => e.type === 'TvLiquidateEvent') || [])
      .value().length
  }

  public getTryingToFulfillRequests(latestBlockTimestamp: number) {
    return chain(this.allEventsAsc)
      .groupBy('args.requestId')
      .values()
      .flatMap(r => {
        const vtSubmitRequest = r.flatMap(e => (e.type === 'TvSubmitEvent' ? e : []))[0]
        if (vtSubmitRequest) {
          const overTarget = vtSubmitRequest.args.targetTimestamp + 60 * 60 > latestBlockTimestamp
          return vtSubmitRequest && overTarget ? vtSubmitRequest : []
        }
        return []
      })
      .value()
  }

  public countTryingToFulfillRequests(latestBlockTimestamp: number) {
    return this.getTryingToFulfillRequests(latestBlockTimestamp).length
  }

  public getTryingToLiquidateRequests(latestBlockTimestamp: number) {
    return chain(this.allEventsAsc)
      .groupBy('args.requestId')
      .values()
      .flatMap(r => {
        const vtSubmitRequest = r.flatMap(e => (r.length === 1 && e.type === 'TvSubmitEvent' ? e : []))[0]
        if (vtSubmitRequest) {
          const overTarget =
            vtSubmitRequest.args.targetTimestamp > latestBlockTimestamp &&
            vtSubmitRequest.args.targetTimestamp + 60 * 60 < latestBlockTimestamp
          return vtSubmitRequest && overTarget ? vtSubmitRequest : []
        }
        return []
      })
      .value()
  }

  public countTryingToLiquidateRequests(latestBlockTimestamp: number) {
    return this.getTryingToLiquidateRequests(latestBlockTimestamp).length
  }

  public countRequests() {
    return (
      this.countDepositRequests() +
      this.countWithdrawRequests() +
      this.countPendingRequests() +
      this.countExpiredRequests()
    )
  }

  public calculateMintUsdcPaid() {
    return this.allEventsAsc.reduce((prev, curr) => {
      const paid = curr.type === 'TvFulfillDepositEvent' ? curr.args.submitRequestTokenAmountUsdc : 0
      return prev + paid
    }, 0)
  }

  public calculateWithdrawUsdcReceived() {
    return this.allEventsAsc.reduce((prev, curr) => {
      const received = curr.type === 'TvFulfillWithdrawEvent' ? curr.args.usdcAmountReceived : 0
      return prev + received
    }, 0)
  }

  public getAllProblems() {
    return chain(this.allEventsAsc).groupBy(e => e.args.requestId)
  }

  public getLatestEvent() {
    if (this.allEventsAsc.length > 0) {
      return this.allEventsAsc[this.allEventsAsc.length - 1]
    }
  }

  public getFirstEvent() {
    return this.allEventsAsc.sort(sortEventsAsc)[0] ?? []
  }

  public getLastCviIndexEvent() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.cviIndex
  }

  public getLastEventBlockNumber() {
    return this.getLatestEvent()?.blockNumber
  }

  public getDiffBetweenLastEventBlockNumberAndCurrentBlock(latestBlockTimestamp: number) {
    const last = this.getLatestEvent()
    if (last) {
      return latestBlockTimestamp - last.blockNumber
    }
  }

  public getLastEventBlockTimestamp() {
    return this.getLatestEvent()?.blockTimestamp
  }

  public getLatestCviIndex() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.cviIndex
  }

  public getLatesttvCvix1PriceInUsdc() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvCvix1PriceInUsdc
  }

  public getLatestvtCviPriceDexInUsdc() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.vtCviPriceDexInUsdc
  }

  public getLatestvtCviPriceInUsdc() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.vtCviPriceInUsdc
  }

  public getCurrentThetaVaultUsdcBalance() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance
  }

  public getLatestTvPlatformPnl() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.tvPlatformPnl
  }

  public getLatestTvDexCvix1Balance() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.dexCviBalance
  }

  public getLatestTvDexCvix1BalanceUsdc() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdc
  }

  public getLatestTvdexCviBalanceUsdcByPlatformPrice() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice
  }

  public getLatestVtBalanceUsdcByPlatformPrice() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice
  }

  public getLatestTvCollateralRatio() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.tvCollateralRatio
  }

  public getLatestTvCurrentDepositsUsdc() {
    return this.getLatestEvent()?.args.generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance
  }
}
