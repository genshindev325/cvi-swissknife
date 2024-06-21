import type {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import classNames from 'classnames'
import type { FC } from 'react'
import { useState } from 'react'
import { tvEventsTypes } from './types'
import { Tabs } from '../Tabs'
import { RequestsTableByStatus } from '../RequestTableByStatus'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useStrictParams } from '../../hooks/use-strict-params'
import { getStatusOfTvRequest } from '../../utils'

const ALL_OPTION = 'all'

type Props = {}

export const TvRequestsEvents: FC<Props> = () => {
  const [selectedRequestTable, setSelectedEventsTable] = useState<
    | TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT
    | TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT
    | TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT
    | TvSubmitEventDto.type.TV_SUBMIT_EVENT
    | typeof ALL_OPTION
  >(ALL_OPTION)
  const params = useStrictParams()
  const { tvRequests } = useFilteredEvents()

  const requestsWithStatus = tvRequests.filter(
    r => selectedRequestTable === ALL_OPTION || getStatusOfTvRequest(r) === selectedRequestTable,
  )

  const onClickRadioButtonRequests = (e: React.ChangeEvent<HTMLInputElement>) => {
    const array = [...Object.values(tvEventsTypes), ALL_OPTION] as const
    const selectedTab = array.find(s => s === e.target.value)
    if (selectedTab) {
      setSelectedEventsTable(selectedTab)
    } else {
      throw new Error(`can't be here`)
    }
  }

  return (
    <div className="flex mt-4 flex-col">
      <div className="w-full flex">
        <Tabs
          type="requests"
          tabs={[ALL_OPTION, ...Object.values(tvEventsTypes)]}
          onClick={onClickRadioButtonRequests}
          selectedRequestTable={selectedRequestTable}
        >
          {value => (
            <>
              <span
                className={classNames({
                  'top-0 right-0 absolute bg-dark-800 rounded-full w-6 h-6 text-xs flex justify-center items-center':
                    true,
                  'bg-green-600':
                    tvRequests.filter(r => value === ALL_OPTION || getStatusOfTvRequest(r) === value).length > 0,
                })}
              >
                <span className="flex item-center justify-center">
                  {value === ALL_OPTION
                    ? tvRequests.length
                    : tvRequests.filter(r => getStatusOfTvRequest(r) === value).length}
                </span>
              </span>
            </>
          )}
        </Tabs>
      </div>
      <RequestsTableByStatus
        showAccountAddress={!params.address}
        requests={requestsWithStatus}
        selectedRequestTable={selectedRequestTable}
      />
    </div>
  )
}
