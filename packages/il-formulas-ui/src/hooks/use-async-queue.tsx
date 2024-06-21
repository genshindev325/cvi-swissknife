import type { QueueObject } from 'async'
import async from 'async'
import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncQueue<T> = {
  stats: {
    processingCount: number
    pendingCount: number
  }
  push: (t: T) => void
}

export function useAsyncQueue<T>(cuncurrency: number, runTask: (t: T) => Promise<void>): AsyncQueue<T> {
  const [pendingCount, setPendingCount] = useState(0)
  const [processingCount, setProcessingCount] = useState(0)

  const runTaskWrapper = useCallback(
    async (t: T, done: (error?: Error) => void) => {
      try {
        setPendingCount(prev => prev - 1)
        setProcessingCount(prev => prev + 1)
        await runTask(t)
        done()
      } catch (error) {
        done(error)
      } finally {
        setProcessingCount(prev => prev - 1)
      }
    },
    [runTask],
  )

  const runTaskWrapperRef = useRef(runTaskWrapper)

  useEffect(() => {
    runTaskWrapperRef.current = runTaskWrapper
  }, [runTaskWrapper])

  const [queue, setQueue] = useState<QueueObject<T>>()

  useEffect(() => {
    const q = async.queue((t: T, done) => runTaskWrapperRef.current(t, done), cuncurrency)
    setQueue(q)
    return () => {
      q.drain()
      q.kill()
    }
  }, [cuncurrency])

  const [pending, setPending] = useState<T[]>([])

  useEffect(() => {
    if (queue) {
      for (const task of pending) {
        queue.push(task)
        setPending(prev => prev.filter(t => t !== task))
      }
    }
  }, [pending, queue])

  const push = useCallback((t: T): void => {
    setPending(prev => [...prev, t])
    setPendingCount(prev => prev + 1)
  }, [])

  return {
    stats: {
      processingCount,
      pendingCount,
    },
    push,
  }
}
