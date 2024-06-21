import { inject, injectable, postConstruct } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { FormattedExecuteDecreasePositionEvent, FormattedExecuteIncreasePositionEvent } from '../contracts-events'
import type { GmxContractsEventsInversifyService } from '../contracts-events'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'
import type { S3InversifyService } from '../s3.inversify.service'
import range from 'lodash/range'

export type GmxEvent = FormattedExecuteIncreasePositionEvent | FormattedExecuteDecreasePositionEvent

@injectable()
export class GmxInversifyService {
  constructor(
    @inject('LatestBlockInfoInversifyService')
    private readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
    @inject('GmxContractsEventsInversifyService')
    private readonly gmxContractsEventsInversifyService: GmxContractsEventsInversifyService,
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('S3InversifyService') private readonly s3InversifyService: S3InversifyService,
  ) {}

  public byAddress = new Map<string, GmxEvent[]>()

  private saveInMemory(events: GmxEvent[]) {
    for (const event of events) {
      const r = this.byAddress.get(event.args.account)
      if (r) {
        r.push(event)
      } else {
        this.byAddress.set(event.args.account, [event])
      }
    }
  }

  private async fetchRange({
    address,
    from,
    to,
  }: {
    address?: string
    from?: number
    to?: number
  }): Promise<GmxEvent[]> {
    const version = 2
    const s3Key = `gmx::leverage-events::range::from::${from}::to::${to}::address::${address}::version::${version}`
    const fromS3 = await this.s3InversifyService.readS3Key<GmxEvent[]>(s3Key)
    if (fromS3) {
      this.saveInMemory(fromS3)
      return fromS3
    }

    const [increaseEvents, decreaseEvents] = await Promise.all([
      this.gmxContractsEventsInversifyService.getOldExecuteIncreasePositionEvents({ from, to, address }),
      this.gmxContractsEventsInversifyService.getOldExecuteDecreasePositionEvents({ from, to, address }),
    ])

    const events = [...increaseEvents, ...decreaseEvents]
    this.saveInMemory(events)
    await this.s3InversifyService.writeToS3Key(s3Key, events)
    return events
  }

  private async loadDataAndSaveInS3(address?: string): Promise<GmxEvent[]> {
    const blockNow = await this.latestBlockInfoInversifyService.getCurrentBlock()
    const interval = 100_000
    const to = blockNow.number
    const ranges = range(to - interval * 10, to, interval).map(from => ({
      from,
      to: from + interval - 1,
      address,
    }))
    const r = await Promise.all(ranges.map(range => this.fetchRange(range)))
    return r.flat()
  }

  @postConstruct()
  public async init() {
    const address = '0x72B31859c516947cE37A13bf0e6d4AD51d151A8e'
    const x = await this.loadDataAndSaveInS3(address)
  }
}
