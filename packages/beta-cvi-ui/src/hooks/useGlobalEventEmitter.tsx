/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import type { StrictEventEmitter } from 'strict-event-emitter'
import type { GlobalEventsInversifyService, State } from '@coti-cvi/lw-sdk'
import { Stator } from '@coti-cvi/lw-sdk'
import usePromise from 'react-use-promise'
import { useWallet } from './useWallet'

type Events = GlobalEventsInversifyService['eventEmitter'] extends StrictEventEmitter<infer U> ? U : never

type Topics = keyof Events

export type Stated<S> = S extends State<infer R> ? R : never

export function useGlobalEventEmitter<
  SubscribeTo extends Topics,
  _State extends Events[SubscribeTo] extends (...params: infer Params) => void ? State<Stated<Params[0]>> : never,
>(subscribeTo: SubscribeTo): _State {
  const { inversifyContainer } = useWallet()

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const [state, setState] = useState<_State>(Stator.pending() as any)

  useEffect(() => {
    if (globalEventsInversifyService) {
      const toState = (param: any) => setState(param)

      globalEventsInversifyService.eventEmitter.on(subscribeTo, toState)

      return () => {
        globalEventsInversifyService.eventEmitter.off(subscribeTo, toState)
      }
    }
  }, [globalEventsInversifyService, subscribeTo])

  return state
}
