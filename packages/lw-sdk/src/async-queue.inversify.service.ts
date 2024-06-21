import { inject, injectable, optional, preDestroy } from 'inversify'
import async from 'async'
import type { PackageName } from './types'
import { CustomError, ErrorKind } from './custom-error'

@injectable()
export class AsyncQueueInversifyService {
  private waitingTasks = 0

  private runningTasks = 0

  private readonly queue = async.queue<() => Promise<unknown>, unknown>((func, done) => {
    this.waitingTasks--
    this.runningTasks++
    return func()
      .finally(() => {
        this.runningTasks--
      })
      .then(
        r =>
          // @ts-ignore
          done(null, r),
        done,
      )
  }, this.asyncQueueLimit)

  private readonly id?: NodeJS.Timeout

  constructor(
    @inject('PackageName')
    @optional()
    private readonly packageName?: PackageName,
    @inject('AsyncQueueLimit')
    @optional()
    private readonly asyncQueueLimit: number = 700, // max can be 1000
    @inject('AsyncQueueRetries')
    @optional()
    private readonly asyncQueueRetries: number = 3,
  ) {
    console.log(
      `${new Date().toISOString()} - ${
        AsyncQueueInversifyService.name
      } - asyncQueueLimit=${asyncQueueLimit}, asyncQueueRetries=${asyncQueueRetries}`,
    )
    if (this.packageName !== 'beta-cvi-ui') {
      this.id = setInterval(() => this.logStats(), 1000)
    }
  }

  private lastWaitingTasks = 0

  private lastRunningTasks = 0

  private lastLogStatsDateMs = 0

  private logStats() {
    if (
      this.lastWaitingTasks === this.waitingTasks &&
      this.lastRunningTasks === this.runningTasks &&
      Date.now() - this.lastLogStatsDateMs <= 5_000
    ) {
      this.lastLogStatsDateMs = Date.now()
      return
    }

    if (this.waitingTasks > 0 || this.runningTasks > 0) {
      console.log(
        `${new Date().toISOString()} - ${AsyncQueueInversifyService.name} - waiting tasks: ${
          this.waitingTasks
        }, running tasks: ${this.runningTasks}`,
      )
    } else {
      if (this.lastWaitingTasks > 0 || this.lastRunningTasks > 0) {
        console.log(`${new Date().toISOString()} - ${AsyncQueueInversifyService.name}  - Queue is Empty`)
      }
    }

    this.lastLogStatsDateMs = Date.now()
    this.lastWaitingTasks = this.waitingTasks
    this.lastRunningTasks = this.runningTasks
  }

  private async _addToQueue<R>({
    func,
    requestId,
    retry = 0,
    description,
  }: {
    func: () => Promise<R>
    requestId: number
    retry?: number
    description?: string
  }): Promise<R> {
    this.waitingTasks++
    try {
      return await this.queue.pushAsync<R>(func)
    } catch (error) {
      const e = new CustomError({
        name: `RequestFailure`,
        errorKind: ErrorKind.SystemError,
        message:
          retry === this.asyncQueueRetries
            ? `could not run ${
                description ? `"${description}" (request-id: ${requestId})` : `queue-request-id: ${requestId}`
              } after ${retry + 1} retries`
            : `failed to run ${
                description ? `"${description}" (request-id: ${requestId})` : `queue-request-id: ${requestId}`
              }. (${retry + 1}/${this.asyncQueueRetries + 1} retries)`,
        cause: error,
        extras: {
          requestId,
          retriesUntilNow: retry + 1,
          maxRetries: this.asyncQueueRetries + 1,
        },
      })
      CustomError.printErrorToConsole(e)
      if (retry === this.asyncQueueRetries) {
        throw e
      } else {
        return await this._addToQueue({ func, requestId, retry: retry + 1, description })
      }
    } finally {
      this.logStats()
    }
  }

  private requestId = 0

  public async push<R>(func: () => Promise<R>, description?: string): Promise<R> {
    return this._addToQueue({ func, requestId: this.requestId++, description })
  }

  @preDestroy()
  public async destructor() {
    if (this.id) {
      clearInterval(this.id)
    }
    this.queue.kill()
    await this.queue.drain()
  }
}
