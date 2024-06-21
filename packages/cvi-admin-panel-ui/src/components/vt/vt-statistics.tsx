import {
  VtBurnEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventArgsDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { TokenName } from '@coti-cvi/lw-sdk'
import { chain } from 'lodash'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { useAppSelector } from '../../redux'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { useEffect, useMemo } from 'react'

export const VtPlatformStatistics = () => {
  const filteredEvents = useFilteredEvents()
  const generalInfoOfEvent = useAppSelector(state => state.updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent)
  const latestBlock = useAppSelector(state => state.latestBlock.data)
  const vtStatisticsApi = useVtStatisticsApi()

  const pnlInfo = useMemo(() => vtStatisticsApi?.calculateTradersPnlUsdc(), [vtStatisticsApi])

  useEffect(() => {
    const addresses = filteredEvents.addresses
    console.log(`pnl info of: "${addresses.length < 10 ? addresses : 'alot-of-addresses'}"`, pnlInfo)
  }, [filteredEvents.addresses, pnlInfo])

  const requestsStatus = useMemo(
    () => ({
      requests: chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.requestId)
        .values()
        .value().length,
      minted: chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.requestId)
        .filter(events => events.some(e => e.type === VtMintEventDto.type.VT_MINT_EVENT))
        .value().length,
      boughtInDex: chain(vtStatisticsApi?.eventsTransferAndSwapAsc)
        .flatMap(e => (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : []))
        .filter(e => e.args.tokenNameAmountIn === VtUniswapSwapEventArgsDto.tokenNameAmountIn.USDC)
        .value().length,
      soldToDex: chain(vtStatisticsApi?.eventsTransferAndSwapAsc)
        .flatMap(e => (e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : []))
        .filter(e => e.args.tokenNameAmountOut === VtUniswapSwapEventArgsDto.tokenNameAmountOut.USDC)
        .value().length,
      burned: chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.requestId)
        .filter(events => events.some(e => e.type === VtBurnEventDto.type.VT_BURN_EVENT))
        .value().length,
      liquidated: chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.requestId)
        .filter(events => events.some(e => e.type === VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT))
        .value().length,
    }),
    [vtStatisticsApi?.eventsTransferAndSwapAsc, vtStatisticsApi?.eventsWithoutTransferAndSwapAsc],
  )

  const tvRequestsCount = requestsStatus.requests + requestsStatus.boughtInDex + requestsStatus.soldToDex

  const pending = useMemo(
    () => ({
      all: chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.requestId)
        .filter(events => events.length === 1)
        .value().length,
      queueing:
        latestBlock &&
        chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
          .groupBy(e => e.args.requestId)
          .flatMap(r => {
            const vtSubmitRequest = r.flatMap(e => (r.length === 1 && e.type === 'VtSubmitEvent' ? e : []))[0]
            if (vtSubmitRequest) {
              const overTarget = vtSubmitRequest.args.targetTimestamp + 60 * 60 < latestBlock.timestamp
              return vtSubmitRequest && overTarget ? vtSubmitRequest : []
            }
            return []
          })
          .value().length,
      failingToFullfil:
        latestBlock &&
        chain(vtStatisticsApi?.eventsWithoutTransferAndSwapAsc)
          .groupBy(e => e.args.requestId)
          .flatMap(r => {
            const vtSubmitRequest = r.flatMap(e => (r.length === 1 && e.type === 'VtSubmitEvent' ? e : []))[0]
            if (vtSubmitRequest) {
              const overTarget = vtSubmitRequest.args.targetTimestamp + 60 * 60 >= latestBlock.timestamp
              return vtSubmitRequest && overTarget ? vtSubmitRequest : []
            }
            return []
          })
          .value().length,
    }),
    [latestBlock, vtStatisticsApi?.eventsWithoutTransferAndSwapAsc],
  )

  const mintFeesUsdc = useMemo(() => vtStatisticsApi?.calculateRequestsMintFees(), [vtStatisticsApi])
  const burnFeesUsdc = useMemo(() => vtStatisticsApi?.calculateRequestsBurnFees(), [vtStatisticsApi])

  const volume24h$ = useMemo(
    () =>
      vtStatisticsApi
        ?.NewVtStatisticsApi({
          eventsAsc: vtStatisticsApi?.eventsAsc.filter(e => {
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            return e.blockTimestamp * 1000 >= startOfDay.getTime()
          }),
        })
        .calcVolumeUsdc(),
    [vtStatisticsApi],
  )

  const volume1w$ = useMemo(
    () =>
      vtStatisticsApi
        ?.NewVtStatisticsApi({
          eventsAsc: vtStatisticsApi?.eventsAsc.filter(
            e => e.blockTimestamp * 1000 >= Date.now() - 1000 * 60 * 60 * 24 * 7,
          ),
        })
        .calcVolumeUsdc(),
    [vtStatisticsApi],
  )

  const volume1m$ = useMemo(
    () =>
      vtStatisticsApi
        ?.NewVtStatisticsApi({
          eventsAsc: vtStatisticsApi?.eventsAsc.filter(
            e => e.blockTimestamp * 1000 >= Date.now() - 1000 * 60 * 60 * 24 * 30,
          ),
        })
        .calcVolumeUsdc(),
    [vtStatisticsApi],
  )

  const volumeAllTime$ = useMemo(() => vtStatisticsApi?.calcVolumeUsdc(), [vtStatisticsApi])

  return useMemo(
    () => (
      <>
        <div className="flex flex-col flex-wrap">
          <span>Vt Stats</span>
          <div className="flex mt-4 gap-4 max-w-full flex-wrap">
            <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
              <p>
                <b>Status:</b>
              </p>

              <p className="flex gap-1">
                Minted / All:
                <b className="flex gap-1">
                  <DisplayNumber state={requestsStatus.minted} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={(requestsStatus.minted * 100) / tvRequestsCount} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Bought / All:
                <b className="flex gap-1">
                  <DisplayNumber state={requestsStatus.boughtInDex} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={(requestsStatus.boughtInDex * 100) / tvRequestsCount} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Burned / All:
                <b className="flex gap-1">
                  <DisplayNumber state={requestsStatus.burned} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={(requestsStatus.burned * 100) / tvRequestsCount} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Sold / All:
                <b className="flex gap-1">
                  <DisplayNumber state={requestsStatus.soldToDex} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={(requestsStatus.soldToDex * 100) / tvRequestsCount} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Liquidated / All:
                <b className="flex gap-1">
                  <DisplayNumber state={requestsStatus.liquidated} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={(requestsStatus.liquidated * 100) / tvRequestsCount} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Pending / All:
                <b className="flex gap-1">
                  <DisplayNumber state={pending.all} />
                  <span>/</span>
                  <DisplayNumber
                    state={tvRequestsCount}
                    moreInfoInBrackets={<DisplayNumber percentage state={(pending.all * 100) / tvRequestsCount} />}
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Queueing / Pending:
                <b className="flex gap-1">
                  <DisplayNumber state={pending.queueing} />
                  <span>/</span>
                  <DisplayNumber
                    state={pending.all}
                    moreInfoInBrackets={
                      <DisplayNumber percentage state={pending.queueing && (pending.queueing * 100) / pending.all} />
                    }
                  />
                </b>
              </p>

              <p className="flex gap-1">
                Failing To Fulfill / Pending:
                <b className="flex gap-1">
                  <DisplayNumber state={pending.failingToFullfil} />
                  <span>/</span>
                  <DisplayNumber
                    state={pending.all}
                    moreInfoInBrackets={
                      <DisplayNumber
                        percentage
                        state={pending.failingToFullfil && (pending.failingToFullfil * 100) / pending.all}
                      />
                    }
                  />
                </b>
              </p>
            </div>

            <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
              <p title="Fees paid by the platform users">
                <b>Mint/Burn Fees:</b>
              </p>
              <p className="flex gap-1">
                Mint Fees:
                <b className="flex gap-1">
                  <DisplayNumber state={mintFeesUsdc} dollar />
                  <span>/</span>
                  <DisplayNumber
                    state={
                      mintFeesUsdc !== undefined && burnFeesUsdc !== undefined ? mintFeesUsdc + burnFeesUsdc : undefined
                    }
                    dollar
                    moreInfoInBrackets={
                      <DisplayNumber
                        state={
                          mintFeesUsdc !== undefined && burnFeesUsdc !== undefined
                            ? (mintFeesUsdc * 100) / (mintFeesUsdc + burnFeesUsdc)
                            : undefined
                        }
                        percentage
                      />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Burn Fees:
                <b className="flex gap-1">
                  <DisplayNumber state={burnFeesUsdc} dollar />
                  <span>/</span>
                  <DisplayNumber
                    state={
                      mintFeesUsdc !== undefined && burnFeesUsdc !== undefined ? mintFeesUsdc + burnFeesUsdc : undefined
                    }
                    dollar
                    moreInfoInBrackets={
                      <DisplayNumber
                        state={
                          mintFeesUsdc !== undefined && burnFeesUsdc !== undefined
                            ? (burnFeesUsdc * 100) / (mintFeesUsdc + burnFeesUsdc)
                            : undefined
                        }
                        percentage
                      />
                    }
                  />
                </b>
              </p>
            </div>

            <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
              <p title="Fees paid by the platform users">
                <b>
                  Successful Requests ({pnlInfo?.debugging.groupByRequestIdWithoutLiquidations.length}/
                  {
                    new Set(
                      vtStatisticsApi?.eventsAsc.flatMap(e =>
                        e.type === VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT ? [e.args.requestId] : [],
                      ),
                    ).size
                  }
                  )
                </b>
              </p>
              <p className="flex gap-1">
                Accounts:
                <b>
                  {
                    Array.from(filteredEvents.updatedGeneralInfoOfEventByAddressMap.values()).filter(
                      a => a.vtCvix1BalanceInUsdc > 1,
                    ).length
                  }{' '}
                  Active Traders / {filteredEvents.addressesWithCvisx1AllTime.size} Total
                </b>
              </p>
              <p className="flex gap-1">
                Minted Tokens:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.debugging.cvix1Info.minted}
                    tokenName={TokenName.CVI}
                    moreInfoInBrackets={
                      <DisplayNumber state={pnlInfo?.debugging.usdcInfo.minted$} className="text-cyan-400" dollar />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Bought Tokens from DEX:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.debugging.cvix1Info.boughtCviFromDex}
                    tokenName={TokenName.CVI}
                    moreInfoInBrackets={
                      <DisplayNumber
                        state={pnlInfo?.debugging.usdcInfo.boughtCviFromDex$}
                        className="text-cyan-400"
                        dollar
                      />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Burned Tokens:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.debugging.cvix1Info.burned}
                    tokenName={TokenName.CVI}
                    moreInfoInBrackets={
                      <DisplayNumber state={pnlInfo?.debugging.usdcInfo.burned$} className="text-cyan-400" dollar />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Sold Tokens to DEX:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.debugging.cvix1Info.soldCviToDex}
                    tokenName={TokenName.CVI}
                    moreInfoInBrackets={
                      <DisplayNumber
                        state={pnlInfo?.debugging.usdcInfo.soldCviToDex$}
                        className="text-cyan-400"
                        dollar
                      />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Current CVI Balance:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.debugging.cvix1Info.currentBalance}
                    tokenName={TokenName.CVI}
                    moreInfoInBrackets={
                      <DisplayNumber
                        state={pnlInfo?.debugging.usdcInfo.currentCvisBalance$}
                        className="text-cyan-400"
                        dollar
                      />
                    }
                  />
                </b>
              </p>
              <p className="flex gap-1">
                Funding Fees:
                <b>
                  <DisplayNumber state={pnlInfo?.debugging.cvix1Info.fundingFeesUntilNow} tokenName={TokenName.CVI} />
                </b>
              </p>
              <p className="flex gap-1">
                Traders P&L:
                <b>
                  <DisplayNumber
                    state={pnlInfo?.pnlInUsdc}
                    className="text-cyan-400"
                    dollar
                    addPositiveNegativeSymbol
                  />
                </b>
              </p>
            </div>

            <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
              <p>
                <b>Indexes & Prices</b>
              </p>
              <p className="flex gap-1">
                CVI:
                <b>
                  <DisplayNumber state={generalInfoOfEvent?.cviIndex} />
                </b>
              </p>
              <p className="flex gap-1">
                CVI (Platform):
                <b>
                  <DisplayNumber dollar state={generalInfoOfEvent?.vtCviPriceInUsdc} />
                </b>
              </p>
              <p className="flex gap-1">
                CVI (DEX):
                <b>
                  <DisplayNumber dollar state={generalInfoOfEvent?.vtCviPriceDexInUsdc} />
                </b>
              </p>
              <p className="flex gap-1">
                TvCvi:
                <b>
                  <DisplayNumber dollar state={generalInfoOfEvent?.tvCvix1PriceInUsdc} />
                </b>
              </p>
            </div>

            <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
              <p>
                <b>Volume (In & Out)</b>
              </p>
              <p className="flex gap-1">
                24h (Platform):
                <b>
                  <DisplayNumber dollar state={volume24h$} />
                </b>
              </p>
              <p className="flex gap-1">
                1w:
                <b>
                  <DisplayNumber dollar state={volume1w$} />
                </b>
              </p>
              <p className="flex gap-1">
                1m:
                <b>
                  <DisplayNumber dollar state={volume1m$} />
                </b>
              </p>
              <p className="flex gap-1">
                All Time:
                <b>
                  <DisplayNumber state={volumeAllTime$} />
                </b>
              </p>
            </div>
          </div>
        </div>
      </>
    ),
    [
      burnFeesUsdc,
      filteredEvents.addressesWithCvisx1AllTime.size,
      filteredEvents.updatedGeneralInfoOfEventByAddressMap,
      generalInfoOfEvent?.cviIndex,
      generalInfoOfEvent?.tvCvix1PriceInUsdc,
      generalInfoOfEvent?.vtCviPriceDexInUsdc,
      generalInfoOfEvent?.vtCviPriceInUsdc,
      mintFeesUsdc,
      pending.all,
      pending.failingToFullfil,
      pending.queueing,
      pnlInfo?.debugging.cvix1Info.boughtCviFromDex,
      pnlInfo?.debugging.cvix1Info.burned,
      pnlInfo?.debugging.cvix1Info.currentBalance,
      pnlInfo?.debugging.cvix1Info.fundingFeesUntilNow,
      pnlInfo?.debugging.cvix1Info.soldCviToDex,
      pnlInfo?.debugging.usdcInfo.boughtCviFromDex$,
      pnlInfo?.debugging.usdcInfo.burned$,
      pnlInfo?.debugging.usdcInfo.currentCvisBalance$,
      pnlInfo?.debugging.usdcInfo.soldCviToDex$,
      pnlInfo?.debugging.cvix1Info.minted,
      pnlInfo?.debugging.groupByRequestIdWithoutLiquidations.length,
      pnlInfo?.debugging.usdcInfo.minted$,
      pnlInfo?.pnlInUsdc,
      requestsStatus.boughtInDex,
      requestsStatus.burned,
      requestsStatus.liquidated,
      requestsStatus.minted,
      requestsStatus.soldToDex,
      tvRequestsCount,
      volume1m$,
      volume1w$,
      volume24h$,
      volumeAllTime$,
      vtStatisticsApi?.eventsAsc,
    ],
  )
}
