import { getIlBackendClient } from '@coti-cvi/lw-sdk/src/get-auto-generated-backend-clients'
import type { FC } from 'react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import usePromise from 'react-use-promise'
import { useAppSelector } from '../../redux'
import { Filters } from '../AllProtections/filters/filters'
import { ProtectionIlHistoryChart } from '../charts/protection-il-history'
import { ProtectionLpProfitHistoryChart } from '../charts/protection-lp-profit-history'
import { ProtectionLpRevenuHistoryChart } from '../charts/protection-lp-revenue-history'

type Props = {
  showFilters: boolean
}

export const Protection: FC<Props> = ({ showFilters }) => {
  const params = useParams()
  const protectionId = params.protectionId
  const ilBackendBaseUrl = useAppSelector(state => state.ilBackendBaseUrl)
  const chainId = useAppSelector(state => state.chainId)
  const protection = useAppSelector(state =>
    state.walletsProtections.flatMap(w => w.protections).find(p => p.protectionId === protectionId),
  )

  const [protectionHistoricalData] = usePromise(
    async () =>
      protection?.protectionId
        ? getIlBackendClient(chainId, {
            baseUrl: ilBackendBaseUrl,
          }).accounts.adminApiControllerGetDuePayoutsForProtectionId({
            protectionId: protection?.protectionId,
            pointsToCalculate: 50,
          })
        : undefined,
    [chainId, ilBackendBaseUrl, protection?.protectionId],
  )

  return (
    <div className="flex flex-col items-center px-4 w-full">
      {showFilters && <Filters />}
      <div className="w-full flex flex-col items-center relative">
        {protection ? (
          <span>
            <Link to={`/wallet/${protection.protectionInfo.boughtEvent.args.owner}`}>
              {protection.protectionInfo.boughtEvent.args.owner}
            </Link>
            : {protection.protectionId}
          </span>
        ) : (
          <span>Loading...</span>
        )}

        <ProtectionIlHistoryChart protectionHistoricalData={protectionHistoricalData} />
        <ProtectionLpProfitHistoryChart protectionHistoricalData={protectionHistoricalData} />
        <ProtectionLpRevenuHistoryChart protectionHistoricalData={protectionHistoricalData} />
      </div>
    </div>
  )
}
