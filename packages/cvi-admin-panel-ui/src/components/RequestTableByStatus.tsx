import { useAppSelector } from '../redux'
import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import { useNavigate } from 'react-router-dom'
import { EventsTable } from './events-table'
import { useStrictCurrentPath } from '../hooks/use-strict-current-path'
import type {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtFulfillRequestEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { TvRequest, VtRequest } from '../types'
import { getStatusOfTvRequest, getStatusOfVtRequest } from '../utils'

const ALL_OPTION = 'all'

type RequestsTableByStatusTypes = {
  showAccountAddress: boolean
  requests: (VtRequest | TvRequest)[]
  selectedRequestTable:
    | VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT
    | VtBurnEventDto.type.VT_BURN_EVENT
    | VtMintEventDto.type.VT_MINT_EVENT
    | VtFulfillRequestEventDto.type.VT_FULFILL_EVENT
    | VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT
    | TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT
    | TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT
    | TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT
    | TvSubmitEventDto.type.TV_SUBMIT_EVENT
    | typeof ALL_OPTION
}

export const RequestsTableByStatus = ({
  showAccountAddress,
  requests,
  selectedRequestTable,
}: RequestsTableByStatusTypes) => {
  const currentTabPath = useStrictCurrentPath()
  const navigate = useNavigate()

  const goToRequestPage = (requestId: number) => {
    navigate(`${currentTabPath}/request/${requestId}`)
  }

  const selectedColumnsInTables = useAppSelector(state => state.selectedColumnsInTables)

  switch (currentTabPath) {
    case '/theta_vaults': {
      const tables = safeObjectEntries(selectedColumnsInTables.tv)
        .filter(([table, _columns]) => (selectedRequestTable === ALL_OPTION ? true : selectedRequestTable === table))
        .sort(
          ([a], [b]) =>
            requests.filter(r => r.resource === 'tv' && getStatusOfTvRequest(r) === b).length -
            requests.filter(r => r.resource === 'tv' && getStatusOfTvRequest(r) === a).length,
        )
      return (
        <>
          {tables.map(([table, _columns]) => {
            const events = requests
              .flatMap(r => (r.resource === 'tv' ? [r] : []))
              .filter(r => getStatusOfTvRequest(r) === table)
              .flatMap(r => {
                const e = r.events.find(e => e.type === getStatusOfTvRequest(r))
                return e ? [e] : []
              })

            return (
              <EventsTable
                key={table}
                table={table}
                events={events}
                showAccountAddress={showAccountAddress}
                rowOnClick={event => goToRequestPage(event.args.requestId)}
              />
            )
          })}
        </>
      )
    }
    case '/volatility_tokens': {
      const tables = safeObjectEntries(selectedColumnsInTables.vt)
        .flatMap(t => (t[0] === 'VtCviTransferEvent' || t[0] === 'VtUniswapSwapEvent' ? [] : [t]))
        .filter(([table, _columns]) => (selectedRequestTable === ALL_OPTION ? true : selectedRequestTable === table))
        .sort(
          ([a], [b]) =>
            requests.filter(r => r.resource === 'vt' && getStatusOfVtRequest(r) === b).length -
            requests.filter(r => r.resource === 'vt' && getStatusOfVtRequest(r) === a).length,
        )

      return (
        <>
          {tables.map(([table, _columns]) => {
            const events = requests
              .flatMap(r => (r.resource === 'vt' ? [r] : []))
              .filter(r => getStatusOfVtRequest(r) === table)
              .flatMap(r => {
                const e = r.events.find(e => e.type === getStatusOfVtRequest(r))
                return e ? [e] : []
              })

            return (
              <EventsTable
                key={table}
                table={table}
                events={events}
                showAccountAddress={showAccountAddress}
                rowOnClick={event => goToRequestPage(event.args.requestId)}
              />
            )
          })}
        </>
      )
    }
    default:
      throw new Error(`tab not supported`)
  }
}
