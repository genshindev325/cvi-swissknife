import axios from 'axios'
import { inject, injectable } from 'inversify'
import { CustomError, ErrorKind } from '../custom-error'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import type { S3InversifyService } from '../s3.inversify.service'
import { ArmadilloSupportedTokenName, ChainId } from '../types'
import { catDecimalsWithRound, startTimer, theGraphUrls } from '../util'
import type { ParsedUniswapV2PairData } from './types'
import { MAX_THE_GRAPH_RESPONSE_LENGTH } from './types'

const S3_DATA_SCHEMA_VERSION = 1

type RawPairData = {
  id: string
  token0: {
    id: string
    symbol: string
    // name: string
    decimals: string
    // totalSupply: string
    // tradeVolume: string
    // tradeVolumeUSD: string
    // untrackedVolumeUSD: string
    // txCount: string
    // totalLiquidity: string
    // derivedETH: string
  }
  token1: {
    id: string
    symbol: string
    // name: string
    decimals: string
    // totalSupply: string
    // tradeVolume: string
    // tradeVolumeUSD: string
    // untrackedVolumeUSD: string
    // txCount: string
    // totalLiquidity: string
    // derivedETH: string
  }
  reserve0: string
  reserve1: string
  // totalSupply: string
  // reserveETH: string
  reserveUSD: string
  trackedReserveETH: string
  token0Price: string
  token1Price: string
  // volumeToken0: string
  // volumeToken1: string
  volumeUSD: string
  // untrackedVolumeUSD: string
  txCount: string
  createdAtTimestamp: string
  // createdAtBlockNumber: string
  liquidityProviderCount: string
}

@injectable()
export class FetchUniswapV2PairsInversifyService {
  private readonly s3BucketKey = `all-uniswap-v2-pairs-info::version::2`

  public readonly pairs = new Map<string, ParsedUniswapV2PairData>()

  private _isReady = false

  constructor(
    @inject('S3InversifyService') private readonly s3InversifyService: S3InversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {}

  public isReady() {
    return this._isReady
  }

  public getSupportedPairs(): ParsedUniswapV2PairData[] {
    const symbols = new Set(Object.values(ArmadilloSupportedTokenName).map(r => r.toString()))
    return Array.from(this.pairs.values()).filter(
      pair => symbols.has(pair.token0.symbol) && symbols.has(pair.token1.symbol),
    )
  }

  public getAllPairsContainsToken(anyTokenSymbol: string): ParsedUniswapV2PairData[] {
    return Array.from(this.pairs.values()).filter(
      pair => anyTokenSymbol === pair.token0.symbol || anyTokenSymbol === pair.token1.symbol,
    )
  }

  private pairToString(pair: ParsedUniswapV2PairData) {
    return `${pair.token0.symbol}-${pair.token1.symbol}`
  }

  private async resetCacheInS3() {
    await this.s3InversifyService.writeToS3Key_legacy<ParsedUniswapV2PairData[]>(this.s3BucketKey, {
      version: S3_DATA_SCHEMA_VERSION,
      value: [],
    })
  }

  public startPolling(options?: { onEnd?: (pairs: Map<string, ParsedUniswapV2PairData>) => void }) {
    const endPollingTimer = startTimer()
    let continuePolling = true
    let pollingPromise: Promise<unknown> | undefined

    const polling = async () => {
      // await this.resetCacheInS3()
      const Body = await this.s3InversifyService.readS3Key_legacy<ParsedUniswapV2PairData[]>(this.s3BucketKey)

      const fromS3: ParsedUniswapV2PairData[] =
        Body?.version === S3_DATA_SCHEMA_VERSION ? Body.value.slice(0, 3000) : []

      console.log(`fetched ${fromS3.length} uniswap-v2 cached pairs from S3`)

      // const fromS3: ParsedUniswapV2PairData[] = []

      // await fs.promises.writeFile(
      //   path.join(__dirname, 'uniswap-v2-tokens.json'),
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
        await this.s3InversifyService.writeToS3Key_legacy<ParsedUniswapV2PairData[]>(this.s3BucketKey, {
          version: S3_DATA_SCHEMA_VERSION,
          value: Array.from(this.pairs.values()),
        })
      }

      let fetchAfterVolumeUSD: number | undefined = fromS3.length > 0 ? fromS3[fromS3.length - 1].volumeUSD : undefined
      // eslint-disable-next-line radar/no-one-iteration-loop
      while (continuePolling) {
        const end1 = startTimer()

        console.log(
          `Fetching uniswap v2 pairs from volumeUSD: ${
            fetchAfterVolumeUSD !== undefined ? fetchAfterVolumeUSD : 'from-the-start'
          }`,
        )
        const results: ParsedUniswapV2PairData[] = await this.getPairs(fetchAfterVolumeUSD)
        if (results.length === 0) {
          continuePolling = false
          this._isReady = true
          if (options?.onEnd) {
            options.onEnd(this.pairs)
          }
          console.log(
            `Fetched 0 new uniswap v2 pairs. total pairs: ${this.pairs.size}. exiting polling (${endPollingTimer()}s)`,
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
          console.log(`Fetched ${results.length} new uniswap v2 pairs. total pairs: ${this.pairs.size} (${end1()}s)`)
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

  private transformRawResult(rawResult: RawPairData[]): ParsedUniswapV2PairData[] {
    return rawResult.map<ParsedUniswapV2PairData>(rawData => ({
      dex: 'uniswap-v2',
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
      reserve0: catDecimalsWithRound(Number(rawData.reserve0), 2),
      reserve1: catDecimalsWithRound(Number(rawData.reserve1), 2),
      reserveUSD: catDecimalsWithRound(Number(rawData.reserveUSD), 2),
      trackedReserveETH: catDecimalsWithRound(Number(rawData.trackedReserveETH), 2),
      token0Price: catDecimalsWithRound(Number(rawData.token0Price), 2),
      token1Price: catDecimalsWithRound(Number(rawData.token1Price), 2),
      volumeUSD: catDecimalsWithRound(Number(rawData.volumeUSD), 2),
      txCount: catDecimalsWithRound(Number(rawData.txCount), 2),
      createdAtTimestamp: Number(rawData.createdAtTimestamp),
      createdAtTimestampUtc: new Date(Number(rawData.createdAtTimestamp) * 1000).toISOString(),
      liquidityProviderCount: Number(rawData.liquidityProviderCount),
    }))
  }

  private async getPairs(fetchAfterVolumeUSD?: number, retry = 1): Promise<ParsedUniswapV2PairData[]> {
    if (retry > 5) {
      throw new CustomError({
        name: 'UniswapTheGraphError-DailySwaps',
        message: `errors caught when sending graphql request to uniswap the graph ${retry} times`,
        errorKind: ErrorKind.SystemError,
      })
    }
    const query = `query q1 {
  pairs(first: ${MAX_THE_GRAPH_RESPONSE_LENGTH}
               orderBy: volumeUSD,
               orderDirection: desc ${
                 fetchAfterVolumeUSD ? `, where: { volumeUSD_lt: "${fetchAfterVolumeUSD}" } ` : ''
               }) {
  id
  token0 {
    id
    symbol
    name
    decimals
    totalSupply
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    txCount
    totalLiquidity
    derivedETH
  }
  token1 {
    id
    symbol
    name
    decimals
    totalSupply
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    txCount
    totalLiquidity
    derivedETH
  }
  reserve0
  reserve1
  totalSupply
  reserveETH
  reserveUSD
  trackedReserveETH
  token0Price
  token1Price
  volumeToken0
  volumeToken1
  volumeUSD
  untrackedVolumeUSD
  txCount
  createdAtTimestamp
  createdAtBlockNumber
  liquidityProviderCount
}
}`
    const { data } = await axios.post<{ data: { pairs: RawPairData[]; errors?: unknown } } | { errors: unknown[] }>(
      theGraphUrls.uniswapV2.ethereum,
      {
        query,
        variables: {},
      },
    )

    if ('errors' in data) {
      console.error(
        `errors caught when sending graphql request to uniswap the graph. retrying...${retry + 1}`,
        // @ts-ignore
        JSON.stringify(data.errors, null, 2),
      )
      return this.getPairs(fetchAfterVolumeUSD, retry + 1)
    }
    return this.transformRawResult(data.data.pairs)
  }
}
