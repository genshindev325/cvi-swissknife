import nock from 'nock'
import { cleanupBeforeAfter } from './cleanups'
import { StartNestAppGenerator } from './start-app/start-nest-app'
import type { StartNestAppOptions } from './types'

export * from './types'

export function nestBeforeAfterEach(options?: { addAdditionalAllowedNockCalls?: string[] }) {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    nock.enableNetConnect(host =>
      ['localhost', '127.0.0.1', ...(options?.addAdditionalAllowedNockCalls ?? [])].some(u => host.includes(u)),
    )
  })

  const cleanups = cleanupBeforeAfter()

  return {
    startApp: (options: StartNestAppOptions) => {
      const startNestAppGenerator = new StartNestAppGenerator(cleanups.cleanupsBeforAfterEach)
      return startNestAppGenerator.start(options)
    },
    cleanupAfterEach: cleanups.cleanupsBeforAfterEach,
  }
}
