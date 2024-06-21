import type { GeneralInfoOfEventByAddressDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { CviBackendClientApi } from '@coti-cvi/auto-generated-code'
import { chain } from 'lodash'
import _ from 'lodash'
import { VtRequestType } from '../types'
import { sortEventsAsc, catDecimalsNoRoundUp } from '../util'
import { arbSushiswapCviUsdcPoolAddress, getAddressGroupAndName, oneInchDexAddresses } from '../util/internal-accounts'
import { AddressGroup } from '../admin-panels'
import type { CviContractsInversifyService } from '../cvi-contracts'

export type VtSwapsAndTransferEvents =
  | CviBackendClientApi.VtUniswapSwapEventDto
  | CviBackendClientApi.VtCviTransferEventDto
export type VtRequestsEvents =
  | CviBackendClientApi.VtSubmitRequestEventDto
  | CviBackendClientApi.VtMintEventDto
  | CviBackendClientApi.VtLiquidateRequestEventDto
  | CviBackendClientApi.VtFulfillRequestEventDto
  | CviBackendClientApi.VtBurnEventDto
export type AllVtEvents = VtSwapsAndTransferEvents | VtRequestsEvents

export class VtStatisticsApi {
  public readonly eventsWithoutTransferAndSwapAsc: VtRequestsEvents[]

  public readonly eventsTransferAndSwapAsc: VtSwapsAndTransferEvents[]

  private readonly allAddressesInEventsSet: Set<string>

  private readonly addresses: string[]

  constructor(
    public readonly allEventsAsc: AllVtEvents[],
    public readonly eventsAsc: AllVtEvents[],
    public readonly cviContractsInversifyService: CviContractsInversifyService,
    public readonly updatedGeneralInfoOfEventByAddressMap: Map<string, GeneralInfoOfEventByAddressDto>,
    addresses?: string[],
  ) {
    this.addresses = addresses ?? []
    this.allAddressesInEventsSet = new Set<string>(
      this.eventsAsc.flatMap(e =>
        e.type === 'VtCviTransferEvent' ? [e.args.fromAccount, e.args.toAccount] : [e.args.account],
      ),
    )
    this.eventsWithoutTransferAndSwapAsc = this.eventsAsc.flatMap(e =>
      e.type !== CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
      e.type !== CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
        ? [e]
        : [],
    )
    this.eventsTransferAndSwapAsc = this.eventsAsc.flatMap(e =>
      e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT ||
      e.type === CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
        ? [e]
        : [],
    )
  }

  public NewVtStatisticsApi({
    allEventsAsc,
    eventsAsc,
    addresses,
  }: {
    allEventsAsc?: AllVtEvents[]
    eventsAsc: AllVtEvents[]
    addresses?: string[]
  }) {
    return new VtStatisticsApi(
      allEventsAsc ?? this.allEventsAsc,
      eventsAsc,
      this.cviContractsInversifyService,
      this.updatedGeneralInfoOfEventByAddressMap,
      addresses ?? this.addresses,
    )
  }

  public calcVolumeUsdc() {
    return _.sum(
      this.eventsAsc.map(e =>
        e.type === CviBackendClientApi.VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT
          ? e.args.tokenNameAmountPaid === CviBackendClientApi.SubmitRequestEventDto.tokenNameAmountPaid.USDC
            ? e.args.tokenAmountPaid
            : e.args.tokenAmountPaid * e.args.generalInfoOfEvent.vtCviPriceInUsdc
          : e.type === CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
          ? e.args.tokenNameAmountIn === CviBackendClientApi.VtUniswapSwapEventArgsDto.tokenNameAmountIn.USDC
            ? e.args.tokenAmountIn
            : e.args.tokenAmountIn * e.args.generalInfoOfEvent.vtCviPriceDexInUsdc
          : 0,
      ),
    )
  }

  public groupByEventTypes() {
    return chain(this.eventsAsc)
      .groupBy(e => e.type)
      .map((events, type) => ({ type, eventsAsc: events.sort(sortEventsAsc) }))
      .value()
  }

  public calculateFeesHistory() {
    let feesUntilNow = 0
    const history: { point: { dateMs: number; feesUntilNow: number }; event: AllVtEvents }[] = []
    for (const curr of this.eventsAsc) {
      let fees = 0
      if (curr.type === 'VtSubmitEvent') {
        fees += curr.args.submitFeesAmount
      } else if (curr.type === 'VtFulfillEvent') {
        fees += curr.args.fulfillFeesAmount
      } else if (curr.type === 'VtMintEvent') {
        fees += curr.args.buyingPremiumFee + curr.args.openPositionFee
      } else if (curr.type === 'VtBurnEvent') {
        fees += curr.args.closingPremiumFee + curr.args.closePositionFee
      } else {
        continue
      }
      feesUntilNow += fees
      history.push({ point: { dateMs: curr.blockTimestamp * 1000, feesUntilNow }, event: curr })
    }
    return { history, feesUntilNow }
  }

  public calculateRequestsMintFees() {
    return this.NewVtStatisticsApi({
      eventsAsc: this.eventsAsc.filter(
        e =>
          ('requestType' in e.args && e.args.requestType === VtRequestType.Mint) ||
          e.type === CviBackendClientApi.VtMintEventDto.type.VT_MINT_EVENT,
      ),
    }).calculateFeesHistory().feesUntilNow
  }

  public calculateRequestsBurnFees() {
    return this.NewVtStatisticsApi({
      eventsAsc: this.eventsAsc.filter(
        e =>
          ('requestType' in e.args && e.args.requestType === VtRequestType.Burn) ||
          e.type === CviBackendClientApi.VtBurnEventDto.type.VT_BURN_EVENT,
      ),
    }).calculateFeesHistory().feesUntilNow
  }

  public calculateRequestsBurnFeesAsUsdc() {
    return this.eventsAsc.reduce((prev, curr) => {
      let fees = 0
      if ('requestType' in curr.args && curr.args.requestType === VtRequestType.Burn) {
        if (curr.type === 'VtSubmitEvent') {
          fees += curr.args.generalInfoOfEvent.vtCviPriceInUsdc * curr.args.submitFeesAmount
        } else if (curr.type === 'VtFulfillEvent') {
          fees += curr.args.generalInfoOfEvent.vtCviPriceInUsdc * curr.args.fulfillFeesAmount
        } else if (curr.type === 'VtLiquidateEvent') {
          fees += curr.args.generalInfoOfEvent.vtCviPriceInUsdc * curr.args.findersFeeAmount
        }
      } else if (curr.type === 'VtBurnEvent') {
        fees +=
          curr.args.generalInfoOfEvent.vtCviPriceInUsdc * (curr.args.closingPremiumFee + curr.args.closePositionFee)
      }
      return prev + fees
    }, 0)
  }

  public calculateTradersPnlUsdc() {
    const requestsWithoutLiquidations = _.chain(this.eventsAsc)
      .flatMap(e =>
        e.type !== 'VtCviTransferEvent' &&
        e.type !== CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
          ? [e]
          : [],
      )
      .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.account))
      .filter(e => e.args.requestId !== 0)
      .groupBy(e => e.args.requestId)
      .flatMap((eventsWithSameRequestId, requestIdString) => {
        const submit =
          eventsWithSameRequestId
            .flatMap(e => (e.type === CviBackendClientApi.VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT ? [e] : []))
            .find(Boolean) ??
          this.allEventsAsc
            .flatMap(e =>
              e.type === CviBackendClientApi.VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT &&
              e.args.requestId === Number(requestIdString)
                ? [e]
                : [],
            )
            .find(Boolean)
        const fulfill = eventsWithSameRequestId
          .flatMap(e => (e.type === CviBackendClientApi.VtFulfillRequestEventDto.type.VT_FULFILL_EVENT ? [e] : []))
          .find(Boolean)
        const liquidate = eventsWithSameRequestId
          .flatMap(e => (e.type === CviBackendClientApi.VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT ? [e] : []))
          .find(Boolean)

        if (!submit) {
          console.log(`unexpected missing submit event for requestId: ${requestIdString}`)
          return []
        }

        if (!liquidate) {
          return { VtSubmitEvent: submit, VtFulfillEvent: fulfill, allEventsOfRequestId: eventsWithSameRequestId }
        }
        return []
      })
      .value()

    const fulfilledRequestsWithoutLiquidations = requestsWithoutLiquidations.flatMap(r =>
      r.VtFulfillEvent
        ? [
            {
              VtSubmitEvent: r.VtSubmitEvent,
              VtFulfillEvent: r.VtFulfillEvent,
              allEventsOfRequestId: r.allEventsOfRequestId,
            },
          ]
        : [],
    )

    const unfulfilledRequestsWithoutLiquidations = requestsWithoutLiquidations.flatMap(r =>
      r.VtFulfillEvent
        ? []
        : [
            {
              VtSubmitEvent: r.VtSubmitEvent,
            },
          ],
    )

    const updatedGeneralInfoOfEventByAddress = new Map<string, GeneralInfoOfEventByAddressDto>()
    Array.from(this.updatedGeneralInfoOfEventByAddressMap.entries())
      .filter(a => this.allAddressesInEventsSet.has(a[0]))
      .filter(a => this.addresses.length === 0 || this.addresses.includes(a[0]))
      .forEach(g => updatedGeneralInfoOfEventByAddress.set(g[0], g[1]))

    const cvisWorthFromLpTokens$ = _.sum(
      Array.from(updatedGeneralInfoOfEventByAddress.values()).map(r => r.vtCviUsdcLpTokensInUsdc / 2),
    )

    const usdcInfo = {
      boughtCvisFrom1Inch$: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            oneInchDexAddresses.includes(e.args.fromAccount)
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.toAccount))
          .map(e => e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceDexInUsdc),
      ),
      soldCvisTo1Inch$: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            oneInchDexAddresses.includes(e.args.toAccount)
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.fromAccount))
          .map(e => e.args.cviAmount * e.args.generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc),
      ),
      minted$: _.sum(
        fulfilledRequestsWithoutLiquidations
          .map(r => r.VtSubmitEvent)
          .filter(e => e.args.action === CviBackendClientApi.SubmitRequestEventDto.action.MINT)
          .map(e => e.args.tokenAmountPaid),
      ),
      cvisWorthFromLpTokens$,
      unfulfilledBurns$: _.sum(
        unfulfilledRequestsWithoutLiquidations
          .map(r => r.VtSubmitEvent)
          .filter(e => e.args.action === CviBackendClientApi.SubmitRequestEventDto.action.BURN)
          .map(e => e.args.tokenAmountPaid * e.args.generalInfoOfEvent.vtCviPriceInUsdc),
      ),
      burned$: _.sum(
        fulfilledRequestsWithoutLiquidations
          .flatMap(
            r =>
              r.allEventsOfRequestId
                .flatMap(e => (e.type === CviBackendClientApi.VtBurnEventDto.type.VT_BURN_EVENT ? [e] : []))
                .find(Boolean) ?? [],
          )
          .map(e => e.args.usdcAmountReceived),
      ),
      receivedCvixNotFromContracts$:
        this.addresses.length === 0
          ? 0
          : _.sum(
              this.eventsAsc
                .flatMap(e =>
                  e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
                  [AddressGroup.COMMUNITY, AddressGroup.GNOSIS_SAFE, AddressGroup.USERS].includes(
                    getAddressGroupAndName(e.args.fromAccount, this.cviContractsInversifyService).addressGroup,
                  ) &&
                  this.addresses.includes(e.args.toAccount)
                    ? [e]
                    : [],
                )
                .filter(e => this.addresses.includes(e.args.toAccount))
                .map(e => e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceInUsdc),
            ),
      sentCvixNotToContracts$:
        this.addresses.length === 0
          ? 0
          : _.sum(
              this.eventsAsc
                .flatMap(e =>
                  e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
                  [AddressGroup.COMMUNITY, AddressGroup.GNOSIS_SAFE, AddressGroup.USERS].includes(
                    getAddressGroupAndName(e.args.toAccount, this.cviContractsInversifyService).addressGroup,
                  ) &&
                  this.addresses.includes(e.args.fromAccount)
                    ? [e]
                    : [],
                )
                .filter(e => this.addresses.includes(e.args.fromAccount))
                .map(e => e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceInUsdc),
            ),
      boughtCvixFromSushiswap$: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            e.args.fromAccount === arbSushiswapCviUsdcPoolAddress
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.toAccount))
          .map(e => e.args.cviAmount * e.args.generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc),
      ),
      soldCvixInSushiswap$:
        _.sum(
          this.eventsAsc
            .flatMap(e =>
              e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
              e.args.toAccount === arbSushiswapCviUsdcPoolAddress
                ? [e]
                : [],
            )
            .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.fromAccount))
            .map(e => e.args.cviAmount * e.args.generalInfoOfEvent.vtCviPriceDexInUsdc),
        ) - cvisWorthFromLpTokens$,
      currentCvisBalance$: _.sum(
        Array.from(updatedGeneralInfoOfEventByAddress.values()).map(r => r.vtCvix1BalanceInUsdc),
      ),
      priorPositionWorth$: _.sum(
        (this.addresses.length > 0 ? this.addresses : Array.from(this.allAddressesInEventsSet)).map(address => {
          for (const e of this.eventsAsc) {
            if (e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (e.args.fromAccount === address) {
                return e.args.generalInfoOfEventBySenderOneBlockBefore.vtCvix1BalanceInUsdc
              }
              if (e.args.toAccount === address) {
                return e.args.generalInfoOfEventByReceiverOneBlockBefore.vtCvix1BalanceInUsdc
              }
            } else {
              if (e.args.account === address) {
                return e.args.generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc
              }
            }
          }
          return 0
          return 0
        }),
      ),
    }

    const boughtCviFromDex$ = usdcInfo.boughtCvixFromSushiswap$ + usdcInfo.soldCvisTo1Inch$
    const soldCviToDex$ = usdcInfo.soldCvixInSushiswap$ + usdcInfo.soldCvisTo1Inch$

    const usdcInfoExtended = {
      ...usdcInfo,
      boughtCviFromDex$,
      soldCviToDex$,
      inflows$: boughtCviFromDex$ + usdcInfo.minted$ + usdcInfo.receivedCvixNotFromContracts$,
      outflows$: soldCviToDex$ + usdcInfo.burned$ + usdcInfo.sentCvixNotToContracts$,
    }

    const usdcInfoExtended2 = {
      ...usdcInfoExtended,
      pnl$:
        -usdcInfoExtended.priorPositionWorth$ -
        usdcInfoExtended.inflows$ +
        usdcInfoExtended.outflows$ +
        usdcInfoExtended.currentCvisBalance$ +
        usdcInfoExtended.unfulfilledBurns$ +
        usdcInfoExtended.cvisWorthFromLpTokens$,
    }

    const cvix1Info = {
      boughtCvisFrom1Inch: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            oneInchDexAddresses.includes(e.args.fromAccount)
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.toAccount))
          .map(e => e.args.cviAmount),
      ),
      soldCvisTo1Inch: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            oneInchDexAddresses.includes(e.args.toAccount)
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.fromAccount))
          .map(e => e.args.cviAmount),
      ),
      currentBalance: _.sum(Array.from(updatedGeneralInfoOfEventByAddress.values()).map(r => r.vtCviBalance)),
      priorPosition: _.sum(
        (this.addresses.length > 0 ? this.addresses : Array.from(this.allAddressesInEventsSet)).map(address => {
          // debugger
          for (const e of this.eventsAsc) {
            if (e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (e.args.fromAccount === address) {
                return e.args.generalInfoOfEventBySenderOneBlockBefore.vtCviBalance
              }
              if (e.args.toAccount === address) {
                return e.args.generalInfoOfEventByReceiverOneBlockBefore.vtCviBalance
              }
            } else {
              if (e.args.account === address) {
                return e.args.generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance
              }
            }
          }
          return 0
        }),
      ),
      cvisFromLpTokens: _.sum(
        Array.from(updatedGeneralInfoOfEventByAddress.values()).map(r => r.vtCviUsdcLpTokensInCvi / 2),
      ),
      boughtcviFromSushiswap: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            e.args.fromAccount === arbSushiswapCviUsdcPoolAddress
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.toAccount))
          .map(e => e.args.cviAmount),
      ),
      minted: _.sum(
        fulfilledRequestsWithoutLiquidations
          .flatMap(r => r.allEventsOfRequestId)
          .flatMap(e => (e.type === CviBackendClientApi.VtMintEventDto.type.VT_MINT_EVENT ? [e] : []))
          .map(e => e.args.mintedTokens),
      ),
      receivedCvixNotFromContracts:
        this.addresses.length === 0
          ? 0
          : _.sum(
              this.eventsAsc
                .flatMap(e =>
                  e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
                  [AddressGroup.COMMUNITY, AddressGroup.GNOSIS_SAFE, AddressGroup.USERS].includes(
                    getAddressGroupAndName(e.args.fromAccount, this.cviContractsInversifyService).addressGroup,
                  ) &&
                  this.addresses.includes(e.args.toAccount)
                    ? [e]
                    : [],
                )
                .map(e => e.args.cviAmount),
            ),
      sentCvixNotToContracts:
        this.addresses.length === 0
          ? 0
          : _.sum(
              this.eventsAsc
                .flatMap(e =>
                  e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
                  [AddressGroup.COMMUNITY, AddressGroup.GNOSIS_SAFE, AddressGroup.USERS].includes(
                    getAddressGroupAndName(e.args.toAccount, this.cviContractsInversifyService).addressGroup,
                  ) &&
                  this.addresses.includes(e.args.fromAccount)
                    ? [e]
                    : [],
                )
                .map(e => e.args.cviAmount),
            ),
      soldcviToSushiswap: _.sum(
        this.eventsAsc
          .flatMap(e =>
            e.type === CviBackendClientApi.VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            e.args.toAccount === arbSushiswapCviUsdcPoolAddress
              ? [e]
              : [],
          )
          .filter(e => this.addresses.length === 0 || this.addresses.includes(e.args.fromAccount))
          .map(e => e.args.cviAmount),
      ),
      unfulfilledBurns: _.sum(
        unfulfilledRequestsWithoutLiquidations
          .map(r => r.VtSubmitEvent)
          .filter(e => e.args.action === CviBackendClientApi.SubmitRequestEventDto.action.BURN)
          .map(e => e.args.tokenAmountPaid),
      ),
      burned: _.sum(
        fulfilledRequestsWithoutLiquidations
          .flatMap(r => r.allEventsOfRequestId)
          .flatMap(e => (e.type === CviBackendClientApi.VtBurnEventDto.type.VT_BURN_EVENT ? [e] : []))
          .map(e => e.args.burnedTokensCvi),
      ),
    }

    const boughtCviFromDex = cvix1Info.boughtcviFromSushiswap + cvix1Info.soldCvisTo1Inch
    const soldCviToDex = cvix1Info.soldcviToSushiswap + cvix1Info.soldCvisTo1Inch

    const cvix1InfoExtended = {
      ...cvix1Info,
      boughtCviFromDex,
      soldCviToDex,
      inflows: boughtCviFromDex + cvix1Info.minted + cvix1Info.receivedCvixNotFromContracts,
      outflows: soldCviToDex + cvix1Info.burned + cvix1Info.sentCvixNotToContracts,
    }

    const cvix1InfoExtended2 = {
      ...cvix1InfoExtended,
      fundingFeesUntilNow: catDecimalsNoRoundUp(
        cvix1InfoExtended.priorPosition +
          cvix1InfoExtended.inflows -
          cvix1InfoExtended.outflows -
          cvix1InfoExtended.currentBalance -
          cvix1InfoExtended.unfulfilledBurns -
          cvix1InfoExtended.cvisFromLpTokens,
        10,
      ),
    }

    const marketingPnlPercentage =
      usdcInfoExtended.inflows$ < 1
        ? 0
        : catDecimalsNoRoundUp((usdcInfoExtended2.pnl$ * 100) / usdcInfoExtended.inflows$, 4)

    return {
      pnlInUsdc: usdcInfoExtended2.pnl$,
      debugging: {
        usdcInfo: usdcInfoExtended2,
        cvix1Info: cvix1InfoExtended2,
        updatedGeneralInfoOfEventByAddress,
        groupByRequestIdWithoutLiquidations: fulfilledRequestsWithoutLiquidations,
        eventsAsc: this.eventsAsc,
        marketingPnlPercentage,
      },
    }
  }

  public getLatestEvent() {
    return this.eventsAsc.sort((a, b) => b.blockNumber - a.blockNumber)[0] ?? []
  }

  public getFirstEvent() {
    return this.eventsAsc.sort(sortEventsAsc)[0] ?? []
  }

  public getLastEventBlockNumber() {
    return this.getLatestEvent().blockNumber
  }

  public getDiffBetweenLastEventBlockNumberAndCurrentBlock(latestBlockTimestamp: number) {
    return latestBlockTimestamp - this.getLatestEvent().blockNumber
  }

  public getLastEventBlockTimestamp() {
    return this.getLatestEvent()?.blockTimestamp ?? 0
  }
}
