import type { IlBackendClientApi } from '@coti-cvi/auto-generated-code/src'
import { safeObjectEntries, toTimeString } from '@coti-cvi/lw-sdk'
import sum from 'lodash/sum'
import millify from 'millify'
import type { ReactNode } from 'react'
import React from 'react'
import { useAppSelector } from '../../redux'
import { filteredWalletProtectionsSelector } from '../../redux/selectors'

const Stat = ({ bold, children }: { bold?: boolean; children: ReactNode }) => (
  <div className={`flex flex-col border rounded-lg px-5 py-3 ${bold ? 'border-white' : 'border-dark-100'}`}>
    {children}
  </div>
)

const Total = ({ values, title, isPercentage }: { values: number[]; isPercentage?: boolean; title: string }) => (
  <Stat bold={(title === 'Revenue:' || title === 'Profit:') ?? true}>
    <b>{title}</b>
    {values.map((v, i) => (
      <div key={i} className="flex gap-2">
        <p>
          {i === 0 && 'Total:'} {i === 1 && 'Active:'} {i === 2 && 'Expired:'}{' '}
        </p>
        {isPercentage ? (
          v < 0 ? (
            <span className="text-common-orange">{v.toFixed(0)}%</span>
          ) : (
            <span className="text-common-lightGreen">{v.toFixed(0)}%</span>
          )
        ) : (
          <span>${millify(v)}</span>
        )}
      </div>
    ))}
  </Stat>
)

const ObjectStats = ({
  title,
  stats,
  symbol,
}: {
  title: string
  stats: Record<string, string | number | undefined>
  symbol?: '%' | '$'
}) => {
  return (
    <Stat bold={false}>
      <b>{title}:</b>
      {safeObjectEntries(stats).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <p>{key}:</p>
          <span>
            {value !== undefined ? (
              typeof value === 'string' ? (
                value
              ) : (
                <>{symbol ? symbol === '$' ? `$${millify(value)}` : `${value.toFixed(2)}%` : <></>}</>
              )
            ) : (
              <>Loading...</>
            )}
          </span>
        </div>
      ))}
    </Stat>
  )
}

export const Stats = () => {
  const fullMode = useAppSelector(state => state.fullMode)
  const currentLiquidityUsdc = useAppSelector(state => state.currentLiquidityUsdc)
  const walletsProtections = useAppSelector(state => state.walletsProtections)
  const filteredWalletsProtections = useAppSelector(filteredWalletProtectionsSelector)
  const currentFreeLiquidityUsdc = useAppSelector(state => state.currentFreeLiquidityUsdc)
  const currentWorkingCapitalUsdc = useAppSelector(state => state.currentWorkingCapitalUsdc)

  const liquidityStats = { currentLiquidityUsdc, currentWorkingCapitalUsdc, currentFreeLiquidityUsdc }

  const arrayProtectedAmount = [
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections.map(p => p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => !p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc),
      ),
    ),
  ]

  const arrayPremiumCost = [
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections.map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => !p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD),
      ),
    ),
  ]

  const arrayPayouts = [
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections.map(p => p.protectionInfo.status.payoutOrDuePayoutUsdc),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => !p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.status.payoutOrDuePayoutUsdc),
      ),
    ),
    sum(
      filteredWalletsProtections.flatMap(walletProtections =>
        walletProtections.protections
          .filter(p => p.protectionInfo.expiredEvent)
          .map(p => p.protectionInfo.status.payoutOrDuePayoutUsdc),
      ),
    ),
  ]

  const arrayRevenue = arrayPremiumCost.map(
    (premiumUsdc, indexInPremiums) => premiumUsdc - arrayPayouts[indexInPremiums],
  )

  const profitRevenue = arrayPremiumCost.map((premiumCost, indexInPremiums) =>
    premiumCost === 0 ? 0 : (arrayRevenue[indexInPremiums] / premiumCost) * 100,
  )

  const revenueOutOfLiquidityStats = {
    Total: liquidityStats.currentLiquidityUsdc ? (arrayRevenue[0] * 100) / liquidityStats.currentLiquidityUsdc : 0,
    'Active % Working':
      liquidityStats.currentWorkingCapitalUsdc === undefined
        ? 'Loading...'
        : liquidityStats.currentWorkingCapitalUsdc === 0
        ? '-'
        : (arrayRevenue[1] * 100) / liquidityStats.currentWorkingCapitalUsdc,
  }

  const protections = filteredWalletsProtections.flatMap(w => w.protections)
  const calcMargin = (protections: IlBackendClientApi.ProtectionIdWithInfoDto[]) =>
    protections.length === 0
      ? 'No Protections'
      : sum(protections.map(protection => protection.protectionInfo.status.withoutMinPayout?.lpProfitPercentage)) /
        protections.length

  const margin = {
    Total: calcMargin(protections),
    Active: calcMargin(protections.filter(p => !p.protectionInfo.expiredEvent)),
    Expired: calcMargin(protections.filter(p => p.protectionInfo.expiredEvent)),
  }

  let newestProtection: IlBackendClientApi.ProtectionIdWithInfoDto | undefined = undefined
  if (filteredWalletsProtections.length > 0) {
    newestProtection = filteredWalletsProtections
      .flatMap(p => p.protections)
      .reduce((previous, current) =>
        previous.protectionInfo.boughtEvent.blockNumber > current.protectionInfo.boughtEvent.blockNumber
          ? previous
          : current,
      )
  }

  const usedEmbedDiscount = {
    Total: `${protections.filter(p => p.protectionInfo.metadata.embedDiscount).length} ($${sum(
      protections.map(p => p.protectionInfo.metadata.embedDiscount?.discountUsdc ?? 0),
    ).toFixed(0)})`,
    Active: `${
      protections.filter(p => !p.protectionInfo.expiredEvent).filter(p => p.protectionInfo.metadata.embedDiscount)
        .length
    } ($${sum(
      protections
        .filter(p => !p.protectionInfo.expiredEvent)
        .map(p => p.protectionInfo.metadata.embedDiscount?.discountUsdc ?? 0),
    ).toFixed(0)})`,
    Expired: `${
      protections.filter(p => p.protectionInfo.expiredEvent).filter(p => p.protectionInfo.metadata.embedDiscount).length
    } ($${sum(
      protections
        .filter(p => p.protectionInfo.expiredEvent)
        .map(p => p.protectionInfo.metadata.embedDiscount?.discountUsdc ?? 0),
    ).toFixed(0)})`,
  }

  return (
    <div className="mb-8">
      <div className="flex items-center my-1 gap-4 flex-wrap">
        <div className="flex flex-wrap w-full gap-4">
          {fullMode && (
            <Stat>
              Accounts:{' '}
              <b>
                {filteredWalletsProtections.length === walletsProtections.length
                  ? walletsProtections.length
                  : `${filteredWalletsProtections.length}/${walletsProtections.length}`}
              </b>
            </Stat>
          )}

          <Stat>
            Protections:{' '}
            <b>
              {sum(filteredWalletsProtections.map(p => p.protections.length)) ===
              sum(walletsProtections.map(p => p.protections.length))
                ? sum(walletsProtections.map(p => p.protections.length))
                : `${sum(filteredWalletsProtections.map(p => p.protections.length))}/
              ${sum(walletsProtections.map(p => p.protections.length))}`}
            </b>
          </Stat>

          <Stat>
            Active protections (Max to be paid $):{' '}
            <b>
              {sum(
                filteredWalletsProtections.map(p => p.protections.filter(p => !p.protectionInfo.expiredEvent).length),
              )}{' '}
              ($
              {millify(
                sum(
                  filteredWalletsProtections.flatMap(walletProtections =>
                    walletProtections.protections
                      .filter(p => !p.protectionInfo.expiredEvent)
                      .map(p => p.protectionInfo.metadata.maxAmountToBePaidUsdc),
                  ),
                ),
                {
                  precision: 0,
                  lowercase: true,
                },
              )}
              )
            </b>
          </Stat>

          <Stat>
            Expired protections:{' '}
            <b>
              {sum(
                filteredWalletsProtections.map(p => p.protections.filter(p => p.protectionInfo.expiredEvent).length),
              )}
            </b>
          </Stat>
          <Stat>
            Newest protection:{' '}
            <b>
              {newestProtection
                ? `${toTimeString(
                    newestProtection.protectionInfo.boughtEvent.args.protectionStartTimestamp - Date.now() / 1000,
                    0,
                  )} protecting $${newestProtection.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc.toLocaleString()}
                   for a ${newestProtection.protectionInfo.boughtEvent.args.policyPeriodDays.toFixed(
                     0,
                   )} days period (Max to be paid: $${newestProtection.protectionInfo.metadata.maxAmountToBePaidUsdc.toFixed(
                    2,
                  )})`
                : 'n/a'}
            </b>
          </Stat>
        </div>
        <div className="flex flex-wrap w-full gap-2">
          <Total title="TVP:" values={arrayProtectedAmount} />
          <Total title="Premiums:" values={arrayPremiumCost} />
          <Total title="Payout:" values={arrayPayouts} />
          <Total title="LP Revenue:" values={arrayRevenue} />
          {fullMode && <Total title="LP Profit:" values={profitRevenue} isPercentage={true} />}
          <ObjectStats
            title="Liquidity"
            symbol="$"
            stats={{
              Total: liquidityStats.currentLiquidityUsdc,
              'Working C.': liquidityStats.currentWorkingCapitalUsdc,
              Free: liquidityStats.currentFreeLiquidityUsdc,
            }}
          />
          <ObjectStats title="LP Revenue % Liquidity" symbol="%" stats={revenueOutOfLiquidityStats} />
          <ObjectStats title="LP Margin" symbol="%" stats={margin} />
          <ObjectStats title="Used Embed Discount" stats={usedEmbedDiscount} />
        </div>
      </div>
    </div>
  )
}
