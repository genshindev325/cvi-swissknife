import { CustomError, GlobalEventsInversifyService, ZapperApiInversifyService } from '../../../src'
import { initInversify, InitInversifyReturnType } from './init-inversify'

export function beforeAfterEach(options?: { ignoreErrorsDuringTest?: boolean }) {
  let zapperApiInversifyService: ZapperApiInversifyService
  let globalEventsInversifyService: GlobalEventsInversifyService

  let errors: Error[] = []

  let container: InitInversifyReturnType

  function onError(error: Error) {
    errors.push(error)
  }

  beforeEach(async () => {
    errors = []
    container = initInversify()
    zapperApiInversifyService = await container.getAsync('ZapperApiInversifyService')
    globalEventsInversifyService = await container.getAsync('GlobalEventsInversifyService')
    globalEventsInversifyService.eventEmitter.on('errors', onError)
  })

  afterEach(async () => {
    await container.closeContainer()
    if (!options?.ignoreErrorsDuringTest && errors.length > 0) {
      console.error(`during the test, the app sent errors to sentry - fix them to make your test pass:`)
      for (const error of errors) {
        CustomError.printErrorToConsole(error)
      }
      throw new Error(`test failed due to errors`)
    }
  })

  return {
    getZapperApiInversifyService: () => zapperApiInversifyService,
  }
}
