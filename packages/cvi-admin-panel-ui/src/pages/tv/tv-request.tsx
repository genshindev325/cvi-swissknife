import classNames from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventsTable } from '../../components/events-table'
import { ToAddress } from '../../components/to-address'
import { TvCharts } from '../../components/tv/charts/tv-charts'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useStrictParams } from '../../hooks/use-strict-params'
import { useEvents } from '../../hooks'
import { vtEventsTypes } from '../../components/vt/types'

type Props = {}

export const TvRequest: FC<Props> = () => {
  const navigate = useNavigate()
  const params = useStrictParams()
  const events = useEvents()

  if (params.requestId === undefined) {
    throw new Error('TvRequest - Request id is not exit in the url params')
  }

  const { vtRequests } = useFilteredEvents()
  const tvCurrentRequest = useMemo(
    () => vtRequests.find(r => r.requestId === params.requestId),
    [params.requestId, vtRequests],
  )

  return (
    <div className="py-8 px-4 w-full">
      <button type="button" className="px-4 py-2 my-2 rounded-lg bg-gray-600" onClick={() => navigate(-1)}>
        Back
      </button>

      <h2>
        <b>Account:</b>{' '}
        <ToAddress address={events.tvEventsAsc.find(e => e.args.requestId === params.requestId)?.args.account} />
        <br />
        <b>Request id:</b> {params.requestId}
      </h2>

      <div className="flex flex-col-reverse">
        {Object.values(vtEventsTypes).map(table => {
          const event = tvCurrentRequest?.eventsByType[table]
          return (
            <div
              key={table}
              className={classNames({
                'order-0 my-2': true,
                'opacity-50': !event,
                'order-1': event,
              })}
            >
              <EventsTable table={table} events={event ? [event] : []} showAccountAddress={false} />
            </div>
          )
        })}
      </div>
      <TvCharts />
    </div>
  )
}
