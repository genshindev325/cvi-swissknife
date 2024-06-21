import type { FC } from 'react'
import { useState } from 'react'
import { Tabs } from '../../components/Tabs'
import { VtAllAccountsEventsTable } from '../../components/vt/VtAllAccountsEventsTable'
import { VtCharts } from '../../components/vt/charts/vt-charts'
import { VtRequestsAndEventsTables } from '../../components/vt/VtRequestsAndEventsTables'
import { useVtStatisticsApi } from '../../hooks/use-vt-statistics-api'

enum TabName {
  ACCOUNT = 'Accounts',
  REQUEST_ID = 'Requests',
  CHARTS = 'Charts',
}

type Props = {}

export const MainVtPage: FC<Props> = () => {
  const vtStatisticsApi = useVtStatisticsApi()

  const [groupBy, setGroupBy] = useState<TabName>(TabName.ACCOUNT)

  const onTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const array = Object.values(TabName)
    const selectedTab = array.find(s => s === e.target.value)
    if (selectedTab) {
      setGroupBy(selectedTab)
    } else {
      throw new Error(`can't be here`)
    }
  }

  const renderTable = () => {
    switch (groupBy) {
      case TabName.ACCOUNT: {
        return <VtAllAccountsEventsTable statisticsApi={vtStatisticsApi} />
      }
      case TabName.REQUEST_ID: {
        return <VtRequestsAndEventsTables />
      }
      case TabName.CHARTS: {
        return <VtCharts />
      }
    }
  }

  return (
    <div className="py-8 px-4 w-full">
      <p className="mt-6">Group table by</p>
      <div className="flex">
        <Tabs type="main" tabs={Object.values(TabName)} onClick={onTabChange} selectedRequestTable={groupBy} />
      </div>

      {renderTable()}
    </div>
  )
}
