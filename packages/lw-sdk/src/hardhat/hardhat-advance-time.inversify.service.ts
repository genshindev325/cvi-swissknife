import { inject, injectable } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { HardhatCommandsInversifyService } from './hardhat-commands.inversify.service'
import type { LatestBlockInfoInversifyService } from '../latest-block-info-events.inversify.service'

@injectable()
export class HardhatAdvanceTimeInversifyService {
  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
    @inject('HardhatCommandsInversifyService') private readonly hardhatCommandsService: HardhatCommandsInversifyService,
    @inject('LatestBlockInfoInversifyService')
    private readonly latestBlockInfoInversifyService: LatestBlockInfoInversifyService,
  ) {}

  public async simpleAdvanceTime(seconds: number): Promise<number> {
    const beforeBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()

    await this.hardhatCommandsService.mineCommand(seconds)

    const afterBlock = await this.latestBlockInfoInversifyService.getAndEmitCurrentBlockWithoutCache()
    return afterBlock.timestamp - beforeBlock.timestamp
  }

  public async setTime(timestamp: number): Promise<number> {
    const beforeBlock = await this.latestBlockInfoInversifyService.getCurrentBlock()

    await this.hardhatCommandsService.setTimestampCommand(timestamp)

    const afterBlock = await this.latestBlockInfoInversifyService.getAndEmitCurrentBlockWithoutCache()
    return afterBlock.timestamp - beforeBlock.timestamp
  }
}
