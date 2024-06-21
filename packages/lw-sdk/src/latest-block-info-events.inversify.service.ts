import { inject, injectable, preDestroy } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { Block, ChainId } from './types'
import { CHAIN_IDS_INFO, NetworkName } from './types'
import { Stator } from './state'
import { BLOCK_RATE_BY_CHAIN } from './block-rate'
import type { AsyncQueueInversifyService } from './async-queue.inversify.service'

export interface BlockHeader {
  number: number
  hash: string
  parentHash: string
  nonce: string
  sha3Uncles: string
  logsBloom: string
  transactionRoot: string
  stateRoot: string
  receiptsRoot: string
  miner: string
  extraData: string
  gasLimit: number
  gasUsed: number
  timestamp: number | string
  baseFeePerGas?: number
}

@injectable()
export class LatestBlockInfoInversifyService {
  // private isClosed = false

  private readonly cleanups: Array<() => void> = []

  private currentBlock: Block | undefined

  constructor(
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') readonly chainId: ChainId,
    @inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
    @inject('AsyncQueueInversifyService') private readonly asyncQueueInversifyService: AsyncQueueInversifyService,
  ) {
    this.getAndEmitCurrentBlockWithoutCache()
    const chainInfo = CHAIN_IDS_INFO[chainId]
    if (chainInfo.networkName === NetworkName.Mainnet) {
      const id = setInterval(() => {
        if (this.currentBlock) {
          this.currentBlock = {
            number: this.currentBlock.number + 1,
            timestamp: Math.ceil(
              this.currentBlock.timestamp + BLOCK_RATE_BY_CHAIN[CHAIN_IDS_INFO[chainId].blockchainName],
            ),
          }

          this.globalEventsInversifyService.eventEmitter.emit('latestBlock', Stator.resolve(this.currentBlock))
        }
      }, BLOCK_RATE_BY_CHAIN[CHAIN_IDS_INFO[chainId].blockchainName] * 1000)
      this.cleanups.push(() => clearInterval(id))

      const syncId = setInterval(() => this.getAndEmitCurrentBlockWithoutCache(), 100_000)
      this.cleanups.push(() => clearInterval(syncId))

      // ws is too expensive $$$
      // const webSocket = new WebSocket(chainInfo.wssUrl)
      // this.cleanups.push(() => {
      //   if (webSocket.readyState === webSocket.OPEN) {
      //     webSocket.close()
      //   }
      // })
      // webSocket.onmessage = async event => {
      //   const data: BlockHeader | undefined = JSON.parse(event.data.toString())?.params?.result
      //   if (data) {
      //     const block: Block = {
      //       number: Number(data.number),
      //       timestamp: Number(data.timestamp),
      //     }
      //     this.currentBlock = block
      //     globalEventsInversifyService.eventEmitter.emit('latestBlock', Stator.resolve<Block>(block))
      //   }
      // }
      // webSocket.onopen = () => {
      //   if (!this.isClosed) {
      //     webSocket.send(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_subscribe', params: ['newHeads'] }))
      //   }
      // }
    } else {
      ethersJsonRpcBatchProvider.on('block', async a => {
        await this.getAndEmitCurrentBlockWithoutCache()
      })
    }
  }

  public async getCurrentBlock(): Promise<Block> {
    return this.currentBlock ?? this.getAndEmitCurrentBlockWithoutCache()
  }

  public async getPeriod({ fromBlock, toBlock }: { fromBlock: number | string; toBlock: number | string }) {
    const [{ timestamp: fromTimestamp }, { timestamp: toTimestamp }] = await Promise.all([
      this.ethersJsonRpcBatchProvider.getBlock(fromBlock),
      this.ethersJsonRpcBatchProvider.getBlock(toBlock),
    ])
    return toTimestamp - fromTimestamp
  }

  public getBlockSecondsAgoFromOtherBlock(fromBlock: number, seconds: number) {
    return Math.floor(fromBlock - seconds * BLOCK_RATE_BY_CHAIN[CHAIN_IDS_INFO[this.chainId].blockchainName])
  }

  public async getBlockSecondsAgo(seconds: number, fromBlock?: Block) {
    const { number, timestamp } = fromBlock ?? (await this.getCurrentBlock())
    const block = Math.floor(number - seconds * BLOCK_RATE_BY_CHAIN[CHAIN_IDS_INFO[this.chainId].blockchainName])
    return { block, currentBlockTimestamp: timestamp }
  }

  public async getAndEmitCurrentBlockWithoutCache(): Promise<Block> {
    const block = await this.asyncQueueInversifyService.push(
      () =>
        this.ethersJsonRpcBatchProvider.getBlock('latest').then(r => ({
          number: r.number,
          timestamp: r.timestamp,
        })),
      'getBlock',
    )

    this.currentBlock = block
    this.globalEventsInversifyService.eventEmitter.emit('latestBlock', Stator.resolve(block))
    return block
  }

  @preDestroy()
  public async destroy() {
    // this.isClosed = true
    this.cleanups.forEach(cleanup => cleanup())
  }
}
