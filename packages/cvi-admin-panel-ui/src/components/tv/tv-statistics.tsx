import { cviTradingCompetitionDates, TokenName } from '@coti-cvi/lw-sdk'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk'
import { useMemo } from 'react'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { useAppSelector } from '../../redux'
import { DatesRangeOptions } from '../../redux/types'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { calculateTvPnl, getStatusOfTvRequest } from '../../utils'
import { useEvents } from '../../hooks'
import _ from 'lodash'
import {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvSubmitEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'

export const TvPlatformStatistics = () => {
  const events = useEvents()
  const filteredEvents = useFilteredEvents()
  const generalInfoOfEvent = useAppSelector(state => state.updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent)
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(filteredEvents.tvEventsAsc), [filteredEvents.tvEventsAsc])

  const accounts = filteredEvents.addressesWithTvCvisx1AllTime.size

  const deposits = useMemo(() => tvStatisticsApi.countDepositRequests(), [tvStatisticsApi])
  const withdrawals = useMemo(() => tvStatisticsApi.countWithdrawRequests(), [tvStatisticsApi])
  const pending = useMemo(() => tvStatisticsApi.countPendingRequests(), [tvStatisticsApi])
  const expired = useMemo(() => tvStatisticsApi.countExpiredRequests(), [tvStatisticsApi])
  const totalRequests = useMemo(() => tvStatisticsApi.countRequests(), [tvStatisticsApi])

  const moreStats = useMemo(
    () => (
      <>
        <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
          <p>
            <b>Theta Vault APR</b>
          </p>
          {generalInfoOfEvent &&
            Object.values(DatesRangeOptions).flatMap(range => {
              if (range === DatesRangeOptions.Custom) {
                return []
              }
              let percentage: number
              let multiply: number
              switch (range) {
                case DatesRangeOptions.TradingCompetition1:
                  percentage = calculateTvPnl(
                    events.allEventsAsc.filter(
                      e =>
                        cviTradingCompetitionDates.currentCompetition.fromTimestamp <= e.blockTimestamp &&
                        e.blockTimestamp <= cviTradingCompetitionDates.currentCompetition.toTimestamp,
                    ),
                  )
                  multiply = 30 * 12
                  break
                case DatesRangeOptions.Last24Hours:
                  percentage = calculateTvPnl(
                    events.allEventsAsc.filter(e => e.blockTimestamp > Date.now() / 1000 - 60 * 60 * 24),
                  )
                  multiply = 30 * 12
                  break
                case DatesRangeOptions.Last3Days:
                  percentage = calculateTvPnl(
                    events.allEventsAsc.filter(e => e.blockTimestamp > Date.now() / 1000 - 60 * 60 * 24 * 3),
                  )
                  multiply = 10 * 12
                  break
                case DatesRangeOptions.LastWeek:
                  percentage = calculateTvPnl(
                    events.allEventsAsc.filter(e => e.blockTimestamp > Date.now() / 1000 - 60 * 60 * 24 * 7),
                  )
                  multiply = 4 * 12
                  break
                case DatesRangeOptions.LastMonth:
                  multiply = 12
                  percentage = generalInfoOfEvent.tvAprByLast30Days / multiply
                  break
                case DatesRangeOptions.All:
                  percentage = calculateTvPnl(events.allEventsAsc)
                  multiply = 1
                  break
              }
              return (
                <p className="flex gap-1" key={range}>
                  <span>{range}:</span>
                  <span className="flex gap-1">
                    <b>
                      <DisplayNumber percentage state={percentage * multiply} addPositiveNegativeSymbol />
                    </b>
                    <span>APR</span>
                  </span>
                </p>
              )
            })}
        </div>
        <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
          <p>
            <b>Volume</b>
          </p>
          <p className="flex gap-1">
            24h (Platform):
            <b>
              <DisplayNumber
                dollar
                state={new TvStatisticsApi(
                  tvStatisticsApi.allEventsAsc.filter(e => {
                    const startOfDay = new Date()
                    startOfDay.setHours(0, 0, 0, 0)
                    return e.blockTimestamp * 1000 >= startOfDay.getTime()
                  }),
                ).calcVolumeUsdc()}
              />
            </b>
          </p>
          <p className="flex gap-1">
            1w:
            <b>
              <DisplayNumber
                dollar
                state={new TvStatisticsApi(
                  tvStatisticsApi.allEventsAsc.filter(
                    e => e.blockTimestamp * 1000 >= Date.now() - 1000 * 60 * 60 * 24 * 7,
                  ),
                ).calcVolumeUsdc()}
              />
            </b>
          </p>
          <p className="flex gap-1">
            1m:
            <b>
              <DisplayNumber
                dollar
                state={new TvStatisticsApi(
                  tvStatisticsApi.allEventsAsc.filter(
                    e => e.blockTimestamp * 1000 >= Date.now() - 1000 * 60 * 60 * 24 * 30,
                  ),
                ).calcVolumeUsdc()}
              />
            </b>
          </p>
          <p className="flex gap-1">
            All Time:
            <b>
              <DisplayNumber dollar state={tvStatisticsApi.calcVolumeUsdc()} />
            </b>
          </p>
        </div>
        <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
          <p>
            <b>Deposits/Withraws</b>
          </p>
          <p className="flex gap-1">
            Total Deposits:
            <b>
              <DisplayNumber
                dollar
                state={_.sum(
                  filteredEvents.tvRequests
                    .filter(r => getStatusOfTvRequest(r) === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT)
                    .flatMap(r => r.events.flatMap(e => (e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT ? [e] : [])))
                    .map(e => e.args.tokenAmountInUsdc),
                )}
                moreInfoInBrackets={
                  <DisplayNumber
                    tokenName={TokenName.T_CVI_LP}
                    state={_.sum(
                      filteredEvents.tvRequests
                        .filter(r => getStatusOfTvRequest(r) === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT)
                        .flatMap(r =>
                          r.events.flatMap(e =>
                            e.type === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT ? [e] : [],
                          ),
                        )
                        .map(e => e.args.mintedThetaTokens),
                    )}
                  />
                }
              />
            </b>
          </p>
          <p className="flex gap-1">
            Total Withraws:
            <b>
              <DisplayNumber
                dollar
                state={_.sum(
                  filteredEvents.tvRequests
                    .filter(r => getStatusOfTvRequest(r) === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT)
                    .flatMap(r =>
                      r.events.flatMap(e =>
                        e.type === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT ? [e] : [],
                      ),
                    )
                    .map(e => e.args.usdcAmountReceived),
                )}
                moreInfoInBrackets={
                  <DisplayNumber
                    tokenName={TokenName.T_CVI_LP}
                    state={_.sum(
                      filteredEvents.tvRequests
                        .filter(
                          r => getStatusOfTvRequest(r) === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT,
                        )
                        .flatMap(r =>
                          r.events.flatMap(e => (e.type === TvSubmitEventDto.type.TV_SUBMIT_EVENT ? [e] : [])),
                        )
                        .map(e => e.args.tokenAmount),
                    )}
                  />
                }
              />
            </b>
          </p>
          <p className="flex gap-1">
            Balance:
            <b>
              <DisplayNumber
                dollar
                state={_.sum(
                  Array.from(filteredEvents.updatedGeneralInfoOfEventByAddressMap.values()).map(
                    a => a.tvCvix1BalanceInUsdc,
                  ),
                )}
                moreInfoInBrackets={
                  <DisplayNumber
                    tokenName={TokenName.T_CVI_LP}
                    state={_.sum(
                      Array.from(filteredEvents.updatedGeneralInfoOfEventByAddressMap.values()).map(
                        a => a.tvCvix1Balance,
                      ),
                    )}
                  />
                }
              />
            </b>
          </p>
        </div>
      </>
    ),
    [
      events.allEventsAsc,
      filteredEvents.tvRequests,
      filteredEvents.updatedGeneralInfoOfEventByAddressMap,
      generalInfoOfEvent,
      tvStatisticsApi,
    ],
  )

  return (
    <>
      <div className="flex flex-col flex-wrap">
        <span>Tv Stats</span>
        <div className="flex mt-4 gap-4 max-w-full flex-wrap">
          <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
            <p>
              <b>Totals actions</b>
            </p>
            <p className="flex gap-1">
              Accounts:
              <b>
                <DisplayNumber state={accounts} />
              </b>
            </p>
            <p className="flex gap-1">
              Deposits:
              <b>
                <DisplayNumber state={deposits} />
              </b>
            </p>
            <p className="flex gap-1">
              Withdrawals:
              <b>
                <DisplayNumber state={withdrawals} />
              </b>
            </p>
            <p className="flex gap-1">
              Pending:
              <b>
                <DisplayNumber state={pending} />
              </b>
            </p>
            <p className="flex gap-1">
              Expired:
              <b>
                <DisplayNumber state={expired} />
              </b>
            </p>
            <p className="flex gap-1">
              Total:
              <b>
                <DisplayNumber state={totalRequests} />
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
              TvCvix1:
              <b>
                <DisplayNumber dollar state={generalInfoOfEvent?.tvCvix1PriceInUsdc} />
              </b>
            </p>
          </div>

          <div className="bg-dark-300 shadow-sm border border-white border-opacity-70 rounded-md p-4 text-sm">
            <p>
              <b>Theta Vault Summary</b>
            </p>
            <p className="flex">
              Current Liquidity:&nbsp;
              <b>
                <DisplayNumber dollar state={tvStatisticsApi.getCurrentThetaVaultUsdcBalance()} />
              </b>
            </p>

            <p className="flex">
              Platform PnL:&nbsp;
              <b>
                <DisplayNumber state={tvStatisticsApi.getLatestTvPlatformPnl()} />
              </b>
            </p>

            <p className="flex">
              DEX CVOLs Worth:&nbsp;
              <b>
                <DisplayNumber
                  dollar
                  state={tvStatisticsApi.getLatestTvDexCvix1BalanceUsdc()}
                  moreInfoInBrackets={
                    <DisplayNumber state={tvStatisticsApi.getLatestTvDexCvix1Balance()} tokenName={TokenName.CVI} />
                  }
                />
              </b>
            </p>

            <p className="flex">
              Collateral:&nbsp;
              <b>
                <DisplayNumber percentage state={tvStatisticsApi.getLatestTvCollateralRatio()} />
              </b>
            </p>

            <p className="flex">
              Utilization:&nbsp;
              <b>
                <DisplayNumber percentage state={generalInfoOfEvent?.tvInfo.tvUtilizationPercentage} />
              </b>
            </p>
            <p className="flex">
              Locked:&nbsp;
              <b>
                <DisplayNumber
                  dollar
                  state={generalInfoOfEvent?.tvInfo.tvLockedUsdc}
                  moreInfoInBrackets={
                    <DisplayNumber percentage state={generalInfoOfEvent?.tvInfo.tvLockedPercentageOfTvCurrentBalance} />
                  }
                />
              </b>
            </p>
          </div>
          {moreStats}
        </div>
      </div>
    </>
  )
}
