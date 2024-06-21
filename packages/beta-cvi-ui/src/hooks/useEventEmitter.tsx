/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react'
import type { EventMapType, StrictEventEmitter } from 'strict-event-emitter'
import type { State } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'

export type Stated<S> = S extends State<infer R> ? R : never

export function useEventEmitter<
  TEventRecord extends EventEmitterType extends StrictEventEmitter<infer U> ? U : never,
  SubscribeTo extends TEventRecord extends { [key in infer K]: unknown } ? K : never,
  EventEmitterType extends StrictEventEmitter<EventMapType>,
  _State extends {
    [Key in keyof TEventRecord]: TEventRecord[Key] extends (...params: infer Params) => void
      ? State<Stated<Params[0]>>
      : never
  },
>({
  getEventEmitter,
  subscribeTo,
}: {
  getEventEmitter: () => { eventEmitter: EventEmitterType; start: () => () => void } | undefined | false | ''
  subscribeTo: SubscribeTo | SubscribeTo[]
}): _State {
  const initialState = Object.fromEntries([subscribeTo].flat().map(t => [t, Stator.pending()])) as _State
  const [state, setState] = useState<_State>(initialState)

  const subscribeToAsString = [subscribeTo].flat().join(',')

  const subscribeToMemo = useMemo(() => subscribeToAsString.split(','), [subscribeToAsString])

  useEffect(() => {
    const result = getEventEmitter()
    if (result) {
      const cleanups: Array<() => void> = []

      for (const topic of subscribeToMemo) {
        const toState = (param: unknown) => {
          setState(prev => ({ ...prev, [topic]: param }))
        }
        const cleanup = result.start()
        result.eventEmitter.on(topic.toString(), toState)
        cleanups.push(cleanup)
      }

      return () => {
        for (const c of cleanups) {
          c()
        }
      }
    }
  }, [getEventEmitter, subscribeToMemo])

  return state
}
