/* eslint-disable no-console */
import { useCallback } from 'react'

export function useLog() {
  return useCallback((...args: unknown[]) => {
    // if first argument is boolean, and the boolean is true, the log will not appear.
    console.log(`${new Date().toISOString()}, ${process.env.PUBLIC_GIT_COMMIT_HASH!.slice(0, 10)}`, ...args)
  }, [])
}
