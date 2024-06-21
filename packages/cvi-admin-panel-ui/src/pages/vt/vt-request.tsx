import classNames from 'classnames'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToAddress } from '../../components/to-address'
import { EventsTable } from '../../components/events-table'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useStrictParams } from '../../hooks/use-strict-params'
import { vtEventsTypes } from '../../components/vt/types'

type Props = {}

export const VtRequest: FC<Props> = () => {
  const navigate = useNavigate()
  const params = useStrictParams()

  if (params.requestId === undefined) {
    throw new Error('VtRequest - Request id is not exit in the url params')
  }

  const filteredEvents = useFilteredEvents()
  const currentRequest = filteredEvents.vtRequests.find(r => r.requestId === params.requestId)

  return (
    <div className="py-8 px-4 w-full">
      <button type="button" className="px-4 py-2 my-2 rounded-lg bg-gray-600" onClick={() => navigate(-1)}>
        Back
      </button>

      <h2>
        <b>Account:</b>
        <ToAddress
          address={
            filteredEvents.vtEventsWithoutTransferAndSwapAsc.find(e => e.args.requestId === params.requestId)?.args
              .account
          }
        />
        <br />
        <b>Request id:</b> {params.requestId}
      </h2>

      <div className="flex flex-col-reverse">
        {Object.values(vtEventsTypes).map(table => {
          const events = currentRequest?.events.flat().flatMap(e => (e?.type === table ? [e] : [])) ?? []
          return (
            <div
              key={table}
              className={classNames({
                'order-0 my-2': true,
              })}
            >
              <EventsTable table={table} events={events} showAccountAddress={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
