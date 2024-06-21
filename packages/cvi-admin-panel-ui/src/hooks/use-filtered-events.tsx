import { useContext } from 'react'
import { filteredEventsContext } from '../contexts/filtered-events-context'

export function useFilteredEvents() {
  return useContext(filteredEventsContext)
}
