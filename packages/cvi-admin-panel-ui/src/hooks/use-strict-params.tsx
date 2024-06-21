import { useMatch } from 'react-router-dom'
import { ROUTES } from '../routes'
import { useEvents } from './use-events'

export type StrictParams = {
  address?: string
  requestId?: number
  vtRequestId?: number
  tvRequestId?: number
}

export function useStrictParams(): StrictParams {
  const events = useEvents()
  const vtAddressMatch = useMatch(`${ROUTES['Volatility tokens']}/:address`)
  const tvAddressMatch = useMatch(`${ROUTES['Theta vaults']}/:address`)
  const vtRequestIdMatch = useMatch(`${ROUTES['Volatility tokens']}/request/:requestId`)
  const tvRequestIdMatch = useMatch(`${ROUTES['Theta vaults']}/request/:requestId`)

  const requestIdString = vtRequestIdMatch?.params.requestId ?? tvRequestIdMatch?.params.requestId

  const requestId = requestIdString ? Number(requestIdString) : undefined
  const vtRequestId = vtRequestIdMatch?.params.requestId ? Number(vtRequestIdMatch?.params.requestId) : undefined
  const tvRequestId = tvRequestIdMatch?.params.requestId ? Number(tvRequestIdMatch?.params.requestId) : undefined

  const address =
    vtAddressMatch?.params.address ??
    tvAddressMatch?.params.address ??
    (vtRequestId !== undefined ? events.vtRequestIdToRequest.get(vtRequestId)?.address : undefined) ??
    (tvRequestId !== undefined ? events.tvRequestIdToRequest.get(tvRequestId)?.address : undefined)

  return {
    address,
    requestId,
    vtRequestId,
    tvRequestId,
  }
}
