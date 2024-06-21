import type { GlobalEventsInversifyService, GetContractInversifyService } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useState } from 'react'
import usePromise from 'react-use-promise'
import React from 'react'
import { useAppSelector } from './redux'
import type { InitInversifyReturnType } from './init-inversify'
import { initInversify } from './init-inversify'

export interface InversifyContext {
  inversify?: InitInversifyReturnType
  globalEventsInversifyService?: GlobalEventsInversifyService
  getContractInversifyService?: GetContractInversifyService
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inversifyContext = createContext<InversifyContext>({})

export const InversifyProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const chainId = useAppSelector(state => state.chainId)
  const [inversify, setInversify] = useState<InitInversifyReturnType | undefined>()

  useEffect(() => {
    const i = initInversify(chainId)
    setInversify(i)
    return () => i.closeContainer()
  }, [chainId])

  const [globalEventsInversifyService] = usePromise(
    async () => inversify && inversify.getAsync('GlobalEventsInversifyService'),
    [inversify],
  )

  return (
    <inversifyContext.Provider
      value={{
        inversify,
        globalEventsInversifyService,
      }}
    >
      {children}
    </inversifyContext.Provider>
  )
}
