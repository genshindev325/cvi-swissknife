import type { CleanupFunction } from './types'

export function cleanupBeforeAfter(): {
  cleanupsBeforAfterEach: CleanupFunction[]
} {
  const cleanupsBeforAfterEach: CleanupFunction[] = []

  beforeEach(() => {
    cleanupsBeforAfterEach.splice(0, cleanupsBeforAfterEach.length)
  })

  afterEach(async () => {
    const results = await Promise.allSettled(cleanupsBeforAfterEach.map(func => func()))
    if (results.some(r => r.status === 'rejected')) {
      console.group('end-test-errors')
      for (const r of results) {
        if (r.status === 'rejected') {
          console.error(r.reason)
        }
      }
      console.groupEnd()
      throw new Error(`test could not complete successfully`)
    }
  })

  return {
    cleanupsBeforAfterEach,
  }
}
