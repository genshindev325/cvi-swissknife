import { useContext } from 'react'
import { eventsContext } from '../contexts/events-context'

export function useEvents() {
  return useContext(eventsContext)
}
