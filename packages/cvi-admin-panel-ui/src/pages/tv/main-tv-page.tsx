import { TvStatisticsApi } from '@coti-cvi/lw-sdk/src'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'
import { Tabs } from '../../components/Tabs'
import { TvCharts } from '../../components/tv/charts/tv-charts'
import { TvAllAccountsEventsTable } from '../../components/tv/TvAllAccountsEventsTable'
import { TvRequestsEvents } from '../../components/tv/TvRequestEvents'

enum TabName {
  ACCOUNT = 'Accounts',
  REQUEST_ID = 'Requests',
  CHARTS = 'Charts',
}

type Props = {}

export const MainTvPage: FC<Props> = () => {
  const { tvEventsAsc: tvEvents } = useFilteredEvents()

  const tvStatisticsApi = useMemo(() => {
    return new TvStatisticsApi(tvEvents)
  }, [tvEvents])
  const vtStatisticsApi = useVtStatisticsApi()

  const [currentTab, setCurrentTab] = useState<TabName>(TabName.ACCOUNT)

  const onTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const array = Object.values(TabName)
    const selectedTab = array.find(s => s === e.target.value)
    if (selectedTab) {
      setCurrentTab(selectedTab)
    } else {
      throw new Error(`can't be here`)
    }
  }

  const renderTable = () => {
    switch (currentTab) {
      case TabName.ACCOUNT: {
        return <TvAllAccountsEventsTable />
      }
      case TabName.REQUEST_ID: {
        return <TvRequestsEvents />
      }
      case TabName.CHARTS: {
        return <TvCharts />
      }
    }
  }

  return (
    <div className="py-8 px-4 w-full">
      <p className="mt-6">Group table by</p>
      <div className="flex">
        <Tabs type="main" tabs={Object.values(TabName)} onClick={onTabChange} selectedRequestTable={currentTab} />
      </div>
      {renderTable()}
    </div>
  )
}
