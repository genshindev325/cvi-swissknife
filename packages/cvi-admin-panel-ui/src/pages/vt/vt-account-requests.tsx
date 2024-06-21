import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToAddress } from '../../components/to-address'
import { VtCharts } from '../../components/vt/charts/vt-charts'
import { VtRequestsAndEventsTables } from '../../components/vt/VtRequestsAndEventsTables'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useStrictParams } from '../../hooks/use-strict-params'
import { Tabs } from '../../components/Tabs'

enum TabName {
  Requests = 'Requests',
  Charts = 'Charts',
}

type Props = {}

export const VtAccountRequests: FC<Props> = () => {
  const params = useStrictParams()
  const navigate = useNavigate()
  const { tvEventsAsc } = useFilteredEvents()

  const [currentTab, setCurrentTab] = useState<TabName>(TabName.Requests)

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
      case TabName.Requests: {
        return (
          <div className="flex mt-4 flex-col">
            <VtRequestsAndEventsTables address={params.address} />
          </div>
        )
      }
      case TabName.Charts: {
        return <VtCharts />
      }
    }
  }

  if (!params.address) {
    throw new Error('VolatilityTokensPerAccount.tsx - Address is not exit in the url params')
  }

  return (
    <div className="py-8 px-4 w-full">
      <button type="button" className="px-4 py-2 my-2 rounded-lg bg-gray-600" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2>
        <b>Account:</b> <ToAddress address={params.address} disableLink />
      </h2>
      <div className="flex">
        <Tabs type="main" tabs={Object.values(TabName)} onClick={onTabChange} selectedRequestTable={currentTab} />
      </div>
      {renderTable()}
    </div>
  )
}
