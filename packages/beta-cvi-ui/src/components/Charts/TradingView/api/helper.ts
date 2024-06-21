import { BackendEnvironment, getCviOracleEventsBackend, NetworkName, strictObjectKeys } from '@coti-cvi/lw-sdk'
import type { MinimalCviOracleEventOhlcDto } from 'auto-generated-code/src/backend-client-apis/cvi-oracle-events-backend-swagger-client'
import { GetCviOracleHistoryDataQueryDto } from 'auto-generated-code/src/backend-client-apis/cvi-oracle-events-backend-swagger-client'
import type {
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SearchSymbolResultItem,
} from 'beta-cvi-ui/public/charting_library/charting_library'

type HolcvType = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}
type HolcvBarType = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volumefrom: number
  volumeto: number
}
export type HolcType = {
  time: number
  open: number
  high: number
  low: number
  close: number
}
const historyForSubscription: { [_: string]: { lastBar: HolcType } } = {}

let dayHistory:
  | {
      time: number
      open: number
      high: number
      low: number
      close: number
      // volume: d[5],
    }[]
  | undefined

let hourHistory:
  | {
      time: number
      open: number
      high: number
      low: number
      close: number
      // volume: d[5],
    }[]
  | undefined

const exchangesArr = [
  {
    // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
    value: 'Binance',

    // filter name
    name: 'Binance',

    // full exchange name displayed in the filter popup
    desc: 'Binance',
  },

  {
    value: 'Coinbase',
    name: 'Coinbase',
    desc: 'Coinbase',
  },
  {
    value: 'uniswapv2',
    name: 'uniswapv2',
    desc: 'uniswapv2',
  },
  {
    value: 'uniswapv3',
    name: 'uniswapv3',
    desc: 'uniswapv3',
  },
]

export let allSymbols: SearchSymbolResultItem[] = []
export const getHourData = async () => {
  if (!hourHistory) {
    const res = await getCviOracleEventsBackend({
      backendEnvironment: BackendEnvironment.K8s,
      network: NetworkName.Mainnet,
    }).cviOracle.cviOracleApiControllerGetAllCviIndexesOhlc({
      requestBody: {
        fromBlockTimestamp: 0,
        groupBy: GetCviOracleHistoryDataQueryDto.groupBy.HOUR,
      },
    })
    hourHistory = res.events.map(d => ({
      time: d[0] * 1000,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
      // volume: d[5],
    }))
  }
}

export default {
  historyForSubscription,
  makeApiRequest: async function (path: string) {
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/${path}api_key=456b6f0caea2e0ec790ff94fb657f4eeeb9b7f5b742102d301db0e8d6a4602be`,
      )
      return response.json()
    } catch (error) {
      throw new Error(`CryptoCompare request error: ${error.status}`)
    }
  },
  generateSymbol: function (exchange: string, fromSymbol: string, toSymbol: string) {
    const short = `${fromSymbol}/${toSymbol}`
    return {
      short,
      full: `${exchange}:${short}`,
    }
  },
  parseFullSymbol: function (fullSymbol: string) {
    // first match --> exchange:fsym/tsym
    // seconde match --> fsym/tsym
    // third match --> fsym (like index)

    const fullmatch = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/) ?? fullSymbol.match(/^(\w+):(\w+)$/)
    const match = fullSymbol.match(/(\w+)\/(\w+)$/) ?? fullSymbol.match(/(\w+)$/)

    if (!match && !fullmatch) {
      return null
    }

    if (fullmatch) {
      return { exchange: fullmatch[1], fromSymbol: fullmatch[2], toSymbol: fullmatch[3] }
    } else if (match) {
      return { exchange: '', fromSymbol: match[1], toSymbol: match[2] ?? '' }
    }
  },
  getAllSymbols: async function () {
    const cviSymbol = [
      {
        symbol: 'CVI', // short
        ticker: 'CVI', // short
        full_name: 'CVI',
        description: 'Crypto Volatility Index',
        exchange: 'CVI Platform',
        type: 'index',
      },
    ]
    if (allSymbols.length === 0) {
      const exchangesHistory = await this.makeApiRequest('data/v4/all/exchanges?')

      allSymbols = [...cviSymbol]
      for (const exchange of exchangesArr ?? []) {
        const pairs = exchangesHistory.Data.exchanges[exchange.value].pairs
        for (const leftPairPart of Object.keys(pairs)) {
          const symbols = Object.keys(pairs[leftPairPart].tsyms).map((rightPairPart: string) => {
            const symbol = this.generateSymbol(exchange.value, leftPairPart, rightPairPart)
            return {
              symbol: symbol.short,
              ticker: symbol.full,
              full_name: symbol.full,
              description: symbol.short,
              exchange: exchange.value,
              type: 'crypto',
            }
          })
          allSymbols = [...allSymbols, ...symbols]
        }
      }
    }
    return allSymbols
  },
  convertDataToBarFromat: function (data: MinimalCviOracleEventOhlcDto) {
    // Bar format is the return type of tradingview to the chart. e.g. the type that the chart receive

    return data.events.map(d => ({
      time: d[0] * 1000,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
      volume: d[5],
    }))
  },

  historyData: async function (
    parsedSymbol: { exchange: string; fromSymbol: string; toSymbol: string },
    resolution: ResolutionString,
    periodParams: PeriodParams,
    symbolInfo: LibrarySymbolInfo,
  ) {
    const { from, to, firstDataRequest } = periodParams

    // console.log(parsedSymbol)
    if (parsedSymbol.fromSymbol === 'CVI') {
      if (resolution.includes('D')) {
        if (!dayHistory) {
          const res = await getCviOracleEventsBackend({
            backendEnvironment: BackendEnvironment.K8s,
            network: NetworkName.Mainnet,
          }).cviOracle.cviOracleApiControllerGetAllCviIndexesOhlc({
            requestBody: {
              fromBlockTimestamp: 0,
              groupBy: GetCviOracleHistoryDataQueryDto.groupBy.DAY,
            },
          })
          dayHistory = this.convertDataToBarFromat(res)
          // console.log(new Date('October 15, 2021 02:00:00').getTime())
          // console.log(dayHistory[0].time, ' -- ', dayHistory[dayHistory.length - 1].time)
          // for (let i = 0; i < dayHistory.length; i++) {
          //   console.log(format(new Date(dayHistory[i].time), 'dd/MM/yyyy HH:mm:ss'))
          // }

          return this.convertDataToBarFromat(res)
        }

        if (dayHistory[0].time > from * 1000) {
          return []
        }
        return dayHistory
      }

      if (!hourHistory) {
        const res = await getCviOracleEventsBackend({
          backendEnvironment: BackendEnvironment.K8s,
          network: NetworkName.Mainnet,
        }).cviOracle.cviOracleApiControllerGetAllCviIndexesOhlc({
          requestBody: {
            fromBlockTimestamp: 0,
            groupBy: GetCviOracleHistoryDataQueryDto.groupBy.HOUR,
          },
        })
        hourHistory = this.convertDataToBarFromat(res)

        return this.convertDataToBarFromat(res)
      }

      // console.log(format(new Date(hourHistory[0].time), 'dd/MM/yyyy HH:mm:ss'))
      // console.log(format(new Date(hourHistory[hourHistory.length - 1].time), 'dd/MM/yyyy HH:mm:ss'))

      if (hourHistory[0].time > from * 1000) {
        return []
      }
      return hourHistory
    }
    const url = resolution.includes('D')
      ? 'data/v2/histoday'
      : !isNaN(Number(resolution)) && Number(resolution) >= 60
      ? 'data/v2/histohour'
      : 'data/v2/histominute'

    const urlParameters: {
      e: string
      fsym: string
      tsym: string
      limit: number
      toTs: number
    } = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      limit: 2000,
      toTs: Math.round(to),
    }

    const query = strictObjectKeys(urlParameters)
      .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&')

    const data = await this.makeApiRequest(`${url}?${query}&`)

    if ((data.Response && data.Response === 'Error') || data.Data.length === 0) {
      // "noData" should be set if there is no data in the requested period.
      return []
    }

    const bars: HolcvType[] = []
    data.Data.Data.forEach((bar: HolcvBarType) => {
      // if (bar.time >= from * 1000 && bar.time < to * 1000) {
      bars.push({
        time: bar.time * 1000,
        low: bar.low,
        high: bar.high,
        open: bar.open,
        close: bar.close,
        volume: bar.volumefrom,
      })
      // }
    })
    // Save the last bar for subscription
    if (firstDataRequest) {
      historyForSubscription[symbolInfo.name] = { lastBar: bars[bars.length - 1] }
    }

    // eslint-disable-next-line no-console
    // console.log(`[getBars]: returned ${bars.length} bar(s)`)

    return bars
  },
}
