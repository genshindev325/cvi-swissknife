import { useMemo } from 'react'
import { BuildCommonCharts as BuildCommonCharts } from '../components/build-common-charts'
import { useFilteredEvents } from './use-filtered-events'
import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import { useVtStatisticsApi } from './use-vt-statistics-api'
import { useAppSelector } from '../redux'
import { BuildTvCharts } from '../components/tv/charts/tv-build-charts'
import { BuildVtCharts } from '../components/vt/charts/vt-build-charts'

export const useCommonCharts = () => {
  const { tvEventsAsc } = useFilteredEvents()
  const vtStatisticsApi = useVtStatisticsApi()
  const tvStatisticsApi = useMemo(() => new TvStatisticsApi(tvEventsAsc), [tvEventsAsc])

  const { tokensDailyPriceHistory } = useFilteredEvents()
  const commonCharts = useMemo(
    () => vtStatisticsApi && new BuildCommonCharts(tokensDailyPriceHistory, tvStatisticsApi, vtStatisticsApi),
    [tokensDailyPriceHistory, tvStatisticsApi, vtStatisticsApi],
  )

  const updatedGeneralInfoOfEvent = useAppSelector(
    state => state.updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent,
  )

  const tvCharts = useMemo(
    () => vtStatisticsApi && new BuildTvCharts(tvStatisticsApi, vtStatisticsApi, updatedGeneralInfoOfEvent),
    [tvStatisticsApi, updatedGeneralInfoOfEvent, vtStatisticsApi],
  )

  const vtCharts = useMemo(
    () => vtStatisticsApi && new BuildVtCharts(tvStatisticsApi, vtStatisticsApi),
    [tvStatisticsApi, vtStatisticsApi],
  )

  return { commonCharts, tvCharts, vtCharts }
}
