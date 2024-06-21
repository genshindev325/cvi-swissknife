import type { AllVtEvents } from '@coti-cvi/lw-sdk/src'
import { VtStatisticsApi } from '@coti-cvi/lw-sdk/src'
import { useMemo } from 'react'
import { useEvents } from './use-events'
import { useFilteredEvents } from './use-filtered-events'
import useInversify from './use-inversify'

export function useVtStatisticsApi(overrideVtEventsAsc?: AllVtEvents[]) {
  const allEvents = useEvents()
  const { vtEventsAsc, addresses, updatedGeneralInfoOfEventByAddressMap } = useFilteredEvents()
  const { cviContractsInversifyService } = useInversify()

  return useMemo(() => {
    let eventsAsc: AllVtEvents[]
    if (overrideVtEventsAsc) {
      eventsAsc = overrideVtEventsAsc
    } else {
      eventsAsc = vtEventsAsc
    }
    return (
      cviContractsInversifyService &&
      new VtStatisticsApi(
        allEvents.vtEventsAsc,
        eventsAsc,
        cviContractsInversifyService,
        updatedGeneralInfoOfEventByAddressMap,
        addresses,
      )
    )
  }, [
    overrideVtEventsAsc,
    cviContractsInversifyService,
    allEvents.vtEventsAsc,
    updatedGeneralInfoOfEventByAddressMap,
    addresses,
    vtEventsAsc,
  ])
}
