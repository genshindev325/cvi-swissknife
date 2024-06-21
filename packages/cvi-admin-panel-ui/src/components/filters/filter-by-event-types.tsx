import type { FC } from 'react'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { Multiselect } from 'react-widgets'
import { useEvents } from '../../hooks'

type Props = {}

export const FilterByEventTypes: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const { allEventsAsc: allEvents } = useEvents()
  const eventTypes = useAppSelector(state => state.filters.eventTypes)

  return (
    <div className="justify-center flex gap-6">
      <span>Event Types:</span>
      <Multiselect
        className="w-10/12"
        data={Array.from(new Set(allEvents.map(e => e.type)))}
        value={eventTypes}
        onChange={newSelected => dispatch(actions.setFilteredEventTypes(newSelected))}
      />
    </div>
  )
}
