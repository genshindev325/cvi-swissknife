import { inject, injectable, postConstruct, preDestroy } from 'inversify'
import { startTimer } from '../util'
import type { FetchUniswapV2PairsInversifyService } from './fetch-uniswap-v2-pairs.inversify.service'
import type { FetchUniswapV3PairsInversifyService } from './fetch-uniswap-v3-pairs.inversify.service'
import type { PairFromDex } from './types'

@injectable()
export class FetchDexesPairsInversifyService {
  private readonly cleanups: (() => Promise<void>)[] = []

  public readonly pairs: PairFromDex[] = []

  constructor(
    @inject('FetchUniswapV2PairsInversifyService')
    private readonly fetchUniswapV2PairsInversifyService: FetchUniswapV2PairsInversifyService,
    @inject('FetchUniswapV3PairsInversifyService')
    private readonly fetchUniswapV3PairsInversifyService: FetchUniswapV3PairsInversifyService,
  ) {}

  public isReady(): boolean {
    return Boolean(
      this.fetchUniswapV2PairsInversifyService.isReady() && this.fetchUniswapV3PairsInversifyService.isReady(),
    )
  }

  public isReadyInfo() {
    return {
      uniswapV2: Boolean(this.fetchUniswapV2PairsInversifyService.isReady()),
      uniswapV3: Boolean(this.fetchUniswapV3PairsInversifyService.isReady()),
    }
  }

  @postConstruct()
  public start() {
    const endTimer = startTimer()
    let ended = 0
    const onEnd = (pairs: Map<string, PairFromDex>) => {
      pairs.forEach(pairDexInfo => this.pairs.push(pairDexInfo))
      ended++
      if (ended === 2) {
        console.log(`finished fetching pairs info from all dexes (${endTimer().toFixed(0)}s)`)
      }
    }
    const v2 = this.fetchUniswapV2PairsInversifyService.startPolling({
      onEnd,
    })
    this.cleanups.push(v2.cleanup)
    const v3 = this.fetchUniswapV3PairsInversifyService.startPolling({
      onEnd,
    })
    this.cleanups.push(v3.cleanup)
  }

  @preDestroy()
  public async stop() {
    await Promise.all(this.cleanups.map(c => c()))
  }
}
