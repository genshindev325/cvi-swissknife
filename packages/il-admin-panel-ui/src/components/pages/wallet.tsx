import { Stator } from '@coti-cvi/lw-sdk/src/state'
import { secondsToString, catDecimalsBase } from '@coti-cvi/lw-sdk/src/util'
import { Checkbox } from '@mui/material'
import { format } from 'date-fns'
import sum from 'lodash/sum'
import type { FC } from 'react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import PoolPair from '../../../../beta-cvi-ui/src/components/PoolPair/PoolPair'
import { GetSvg } from '../../../../beta-cvi-ui/src/utils/GetSvg'
import { actions, useAppDispatch, useAppSelector } from '../../redux'
import {
  filteredWalletProtectionsSelector,
  filteredWalletProtectionsWithoutSelectedProtectionIdsSelector,
} from '../../redux/selectors'
import { Filters } from '../AllProtections/filters/filters'

type Props = {
  showFilters: boolean
}

export const Wallet: FC<Props> = ({ showFilters }) => {
  const params = useParams()
  const address = params.address
  const dispatch = useAppDispatch()
  const filteredWalletProtections = useAppSelector(filteredWalletProtectionsSelector).find(
    w => w.wallet.toLowerCase() === address?.toLocaleLowerCase(),
  )
  const filteredWalletProtectionsWithoutSelectedProtectionIds = useAppSelector(
    filteredWalletProtectionsWithoutSelectedProtectionIdsSelector,
  )

  const filtered = filteredWalletProtectionsWithoutSelectedProtectionIds.find(
    w => w.wallet.toLocaleLowerCase() === address?.toLocaleLowerCase(),
  )

  const selectedProtectionIds = useAppSelector(state => state.selected.protectionIds)

  const protections = filtered?.protections ?? []

  return (
    <div className="flex flex-col items-center px-4">
      {showFilters && <Filters />}
      <div className="w-full flex flex-col items-center px-4 overflow-x-auto relative">
        <div>{address}</div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6 text-left flex gap-1">
                <Checkbox
                  checked={filtered?.protections.every(p => selectedProtectionIds.includes(p.protectionId))}
                  onChange={(_, checked) =>
                    dispatch(
                      actions.setSelectedProtectionIds(
                        checked
                          ? [
                              ...new Set([
                                ...selectedProtectionIds,
                                ...(filtered?.protections ?? []).map(p => p.protectionId),
                              ]),
                            ]
                          : selectedProtectionIds.filter(id => filtered?.protections.every(p => p.protectionId !== id)),
                      ),
                    )
                  }
                />
                <span>ID</span>
                <span>({filteredWalletProtections?.protections.length})</span>
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                Pair
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                Start Time
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                End Time
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                Status
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                Duration
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                <div className="flex">
                  $ Price (
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(sum(protections.map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD)))}
                  />
                  )
                </div>
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                <div className="flex">
                  $ Protected (
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(
                      sum(protections.map(p => p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc)),
                    )}
                  />
                  )
                </div>
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                <div className="flex">
                  $ Payout (
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(
                      sum(protections.map(p => p.protectionInfo.status.withoutMinPayout.payoutOrDuePayoutUsdc)),
                    )}
                  />
                  )
                </div>
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                IL %
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                <div className="flex">
                  LP Profit % (
                  <DisplayNumber
                    percentage
                    millify
                    withTooltip
                    state={Stator.resolve(
                      (() => {
                        const price = sum(protections.map(p => p.protectionInfo.boughtEvent.args.premiumCostUSD))
                        const payout = sum(
                          protections.map(p => p.protectionInfo.status.withoutMinPayout.payoutOrDuePayoutUsdc),
                        )
                        const lpRevenue = payout - price
                        // eslint-disable-next-line radar/prefer-immediate-return
                        const lpProfit = (lpRevenue / price) * 100
                        return lpProfit
                      })(),
                    )}
                  />
                  )
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {protections.map(({ protectionId, protectionInfo: { boughtEvent, metadata, status, expiredEvent } }) => (
              <tr
                key={protectionId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
              >
                <th scope="row" className="flex py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Checkbox
                    checked={selectedProtectionIds.includes(protectionId)}
                    onChange={(_, checked) =>
                      dispatch(
                        actions.setSelectedProtectionIds(
                          checked
                            ? [...selectedProtectionIds.filter(s => protectionId !== s), protectionId]
                            : selectedProtectionIds.filter(s => protectionId !== s),
                        ),
                      )
                    }
                  />
                  {protectionId}
                  <Link to={`/protection/${boughtEvent.args.id}`}>
                    <GetSvg svgName="link" className="fill-white" />
                  </Link>
                </th>
                <td scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <PoolPair
                    tokenName1={boughtEvent.args.tokenName1.ArmadilloSupportedTokenName}
                    tokenName2={boughtEvent.args.tokenName2.ArmadilloSupportedTokenName}
                  />
                </td>
                <td className="py-4 px-6">
                  {format(new Date(boughtEvent.args.protectionStartTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
                </td>
                <td className="py-4 px-6">
                  {format(new Date(boughtEvent.args.protectionEndTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
                </td>
                <td className="py-4 px-6">{expiredEvent ? 'Expired' : 'Active'}</td>
                <td className="py-4 px-6">{secondsToString(boughtEvent.args.policyPeriodSeconds)}</td>
                <td className="py-4 px-6">
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(boughtEvent.args.premiumCostUSD)}
                    moreInfoInBrackets={`${catDecimalsBase(
                      (boughtEvent.args.premiumCostUSD / metadata.lpTokensWorthAtBuyTimeUsdc) * 100,
                      2,
                    )}%`}
                  />
                </td>
                <td className="py-4 px-6">
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(metadata.lpTokensWorthAtBuyTimeUsdc)}
                  />
                </td>
                <td className="py-4 px-6">
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(status.withoutMinPayout.payoutOrDuePayoutUsdc)}
                  />
                </td>
                <td className="py-4 px-6">
                  <DisplayNumber percentage millify withTooltip state={Stator.resolve(status.ilPercentage)} />
                </td>
                <td className="py-4 px-6">
                  <DisplayNumber
                    percentage
                    millify
                    withTooltip
                    state={Stator.resolve(status.withoutMinPayout.lpProfitPercentage)}
                    moreInfoInBrackets={`$${catDecimalsBase(status.withoutMinPayout.lpRevenueUsdc, 2)}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
