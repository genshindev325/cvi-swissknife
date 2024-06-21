import axios from 'axios'
import { inject, injectable } from 'inversify'
import { CustomError, ErrorKind } from '../custom-error'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import { ArmadilloSupportedTokenName, ChainId } from '../types'
import { catDecimalsWithRound, startTimer, theGraphUrls } from '../util'
import type { ParsedUniswapV3PairData } from './types'
import { MAX_THE_GRAPH_RESPONSE_LENGTH } from './types'
import type { S3InversifyService } from '../s3.inversify.service'

const S3_DATA_SCHEMA_VERSION = 1

type RawPairData = {
  id: string
  createdAtTimestamp: string
  createdAtBlockNumber: string
  liquidity: string
  token0Price: string
  token1Price: string
  tick: string
  observationIndex: string
  volumeToken0: string
  volumeToken1: string
  volumeUSD: string
  feesUSD: string
  collectedFeesToken0: string
  collectedFeesToken1: string
  collectedFeesUSD: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  liquidityProviderCount: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: string
    totalSupply: string
    volume: string
    volumeUSD: string
    untrackedVolumeUSD: string
    totalValueLockedUSD: string
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: string
    totalSupply: string
    volume: string
    volumeUSD: string
    untrackedVolumeUSD: string
    totalValueLockedUSD: string
  }
}

@injectable()
export class FetchUniswapV3PairsInversifyService {
  private readonly s3BucketKey = `all-uniswap-v3-pairs-info::version::2`

  public readonly pairs = new Map<string, ParsedUniswapV3PairData>()

  private _isReady = false

  constructor(
    @inject('S3InversifyService') private readonly s3InversifyService: S3InversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {}

  public isReady() {
    return this._isReady
  }

  public getSupportedPairs(): ParsedUniswapV3PairData[] {
    const symbols = new Set(Object.values(ArmadilloSupportedTokenName).map(r => r.toString()))
    return Array.from(this.pairs.values()).filter(
      pair => symbols.has(pair.token0.symbol) && symbols.has(pair.token1.symbol),
    )
  }

  public getAllPairsContainsToken(anyTokenSymbol: string): ParsedUniswapV3PairData[] {
    return Array.from(this.pairs.values()).filter(
      pair => anyTokenSymbol === pair.token0.symbol || anyTokenSymbol === pair.token1.symbol,
    )
  }

  private pairToString(pair: ParsedUniswapV3PairData) {
    return `${pair.token0.symbol}-${pair.token1.symbol}`
  }

  private async resetCacheInS3() {
    await this.s3InversifyService.writeToS3Key_legacy<ParsedUniswapV3PairData[]>(this.s3BucketKey, {
      version: S3_DATA_SCHEMA_VERSION,
      value: [],
    })
  }

  public startPolling(options?: { onEnd?: (pairs: Map<string, ParsedUniswapV3PairData>) => void }) {
    const endPollingTimer = startTimer()
    let continuePolling = true
    let pollingPromise: Promise<unknown> | undefined

    const polling = async () => {
      // await this.resetCacheInS3()
      const result = await this.s3InversifyService.readS3Key_legacy<ParsedUniswapV3PairData[]>(this.s3BucketKey)

      const fromS3: ParsedUniswapV3PairData[] =
        result?.version === S3_DATA_SCHEMA_VERSION ? result.value.slice(0, 3000) : []
      console.log(`fetched ${fromS3.length} uniswap-v3 cached pairs from S3`)
      // await fs.promises.writeFile(
      //   path.join(__dirname, 'uniswap-v3-tokens.json'),
      //   JSON.stringify(fromS3, null, 2),
      //   'utf8',
      // )

      for (const pair of fromS3) {
        this.pairs.set(this.pairToString(pair), pair)
      }

      // this._isReady = true
      // if (options?.onEnd) {
      //   options.onEnd(this.pairs)
      // }

      const saveToS3 = async () => {
        await this.s3InversifyService.writeToS3Key_legacy<ParsedUniswapV3PairData[]>(this.s3BucketKey, {
          version: S3_DATA_SCHEMA_VERSION,
          value: Array.from(this.pairs.values()),
        })
      }

      let fetchAfterVolumeUSD: number | undefined = fromS3.length > 0 ? fromS3[fromS3.length - 1].volumeUSD : undefined
      // eslint-disable-next-line radar/no-one-iteration-loop
      while (continuePolling) {
        const end1 = startTimer()
        console.log(
          `Fetching uniswap v3 pairs from volumeUSD: ${
            fetchAfterVolumeUSD !== undefined ? fetchAfterVolumeUSD : 'from-the-start'
          }`,
        )
        const results: ParsedUniswapV3PairData[] = await this.getPairs(fetchAfterVolumeUSD)
        if (results.length === 0) {
          continuePolling = false
          this._isReady = true
          if (options?.onEnd) {
            options.onEnd(this.pairs)
          }
          console.log(
            `Fetched 0 new uniswap v3 pairs. total pairs: ${this.pairs.size}. exiting polling (${endPollingTimer()}s)`,
          )
          break
        } else {
          fetchAfterVolumeUSD = results[results.length - 1].volumeUSD
          for (const pair of results) {
            const last = this.pairs.get(this.pairToString(pair))
            if (last) {
              if (last.createdAtTimestamp < pair.createdAtTimestamp) {
                this.pairs.set(this.pairToString(pair), pair)
              }
            } else {
              this.pairs.set(this.pairToString(pair), pair)
            }
          }
          console.log(`Fetched ${results.length} new uniswap v3 pairs. total pairs: ${this.pairs.size} (${end1()}s)`)
        }
        await saveToS3()

        continuePolling = false
        this._isReady = true
        if (options?.onEnd) {
          options.onEnd(this.pairs)
        }
        break
      }
    }

    const timeoutId = setTimeout(async () => {
      try {
        const p = polling()
        pollingPromise = p
        await p
      } catch (error) {
        this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      }
    }, 0)

    return {
      cleanup: async () => {
        continuePolling = false
        clearTimeout(timeoutId)
        await pollingPromise
      },
    }
  }

  private transformRawResult(rawResult: RawPairData[]): ParsedUniswapV3PairData[] {
    return rawResult.map<ParsedUniswapV3PairData>(rawData => ({
      dex: 'uniswap-v3',
      chainId: ChainId.EthereumMainnet,
      id: rawData.id,
      token0: {
        id: rawData.token0.id,
        symbol: rawData.token0.symbol,
        decimals: catDecimalsWithRound(Number(rawData.token0.decimals), 2),
      },
      token1: {
        id: rawData.token1.id,
        symbol: rawData.token1.symbol,
        decimals: catDecimalsWithRound(Number(rawData.token1.decimals), 2),
      },
      createdAtTimestamp: Number(rawData.createdAtTimestamp),
      createdAtTimestampUtc: new Date(Number(rawData.createdAtTimestamp) * 1000).toISOString(),
      createdAtBlockNumber: Number(rawData.createdAtBlockNumber),
      liquidity: catDecimalsWithRound(Number(rawData.liquidity), 2),
      token0Price: catDecimalsWithRound(Number(rawData.token0Price), 2),
      token1Price: catDecimalsWithRound(Number(rawData.token1Price), 2),
      tick: catDecimalsWithRound(Number(rawData.tick), 2),
      observationIndex: catDecimalsWithRound(Number(rawData.observationIndex), 2),
      volumeToken0: catDecimalsWithRound(Number(rawData.volumeToken0), 2),
      volumeToken1: catDecimalsWithRound(Number(rawData.volumeToken1), 2),
      volumeUSD: catDecimalsWithRound(Number(rawData.volumeUSD), 2),
      feesUSD: catDecimalsWithRound(Number(rawData.feesUSD), 2),
      collectedFeesToken0: catDecimalsWithRound(Number(rawData.collectedFeesToken0), 2),
      collectedFeesToken1: catDecimalsWithRound(Number(rawData.collectedFeesToken1), 2),
      collectedFeesUSD: catDecimalsWithRound(Number(rawData.collectedFeesUSD), 2),
      totalValueLockedToken0: catDecimalsWithRound(Number(rawData.totalValueLockedToken0), 2),
      totalValueLockedToken1: catDecimalsWithRound(Number(rawData.totalValueLockedToken1), 2),
      totalValueLockedUSD: catDecimalsWithRound(Number(rawData.totalValueLockedUSD), 2),
      liquidityProviderCount: catDecimalsWithRound(Number(rawData.liquidityProviderCount), 2),
    }))
  }

  private async getPairs(fetchAfterVolumeUSD?: number, retry = 1): Promise<ParsedUniswapV3PairData[]> {
    if (retry > 5) {
      throw new CustomError({
        name: 'UniswapTheGraphError-DailySwaps',
        message: `errors caught when sending graphql request to uniswap the graph ${retry} times`,
        errorKind: ErrorKind.SystemError,
      })
    }

    const { data } = await axios.post<{ data: { pools: RawPairData[]; errors?: unknown } } | { errors: unknown[] }>(
      theGraphUrls.uniswapV3.ethereum,
      {
        query: `query q1 {
                  pools(first: ${MAX_THE_GRAPH_RESPONSE_LENGTH}
                               orderBy: volumeUSD,
                               orderDirection: desc ${
                                 fetchAfterVolumeUSD ? `, where: { volumeUSD_lt: "${fetchAfterVolumeUSD}" } ` : ''
                               }) {
                  id
                  createdAtTimestamp
                  createdAtBlockNumber
                  liquidity
                  token0Price
                  token1Price
                  tick
                  observationIndex
                  volumeToken0
                  volumeToken1
                  volumeUSD
                  feesUSD
                  collectedFeesToken0
                  collectedFeesToken1
                  collectedFeesUSD
                  totalValueLockedToken0
                  totalValueLockedToken1
                  totalValueLockedUSD
                  liquidityProviderCount
                  token0 {
                    id
                    symbol
                    name
                    decimals
                    totalSupply
                    volume
                    volumeUSD
                    untrackedVolumeUSD
                    totalValueLockedUSD
                  }
                  token1 {
                    id
                    symbol
                    name
                    decimals
                    totalSupply
                    volume
                    volumeUSD
                    untrackedVolumeUSD
                    totalValueLockedUSD
                  }
              }
        }`,
        variables: {},
      },
    )

    if ('errors' in data) {
      console.error(
        `errors caught when sending graphql request to uniswap the graph. retrying...${retry + 1}`,
        JSON.stringify(data.errors, null, 2),
      )
      return this.getPairs(fetchAfterVolumeUSD, retry + 1)
    }
    return this.transformRawResult(data.data.pools)
  }
}
