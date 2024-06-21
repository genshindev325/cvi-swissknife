import type {
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from 'beta-cvi-ui/public/charting_library/charting_library'

import helper from './helper'

export const supportedResolutions = [
  '1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '180',
  '240',
  '1D',
  '2D',
  '3D',
  '4D',
] as ResolutionString[]

export const configurationData: DatafeedConfiguration = {
  supported_resolutions: supportedResolutions,
  symbols_types: [
    {
      name: 'crypto',
      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'crypto',
    },
    {
      name: 'index',
      value: 'index',
    },
    {
      name: 'all',
      value: 'all',
    },
  ],
}

export default () => ({
  onReady: function (callback: OnReadyCallback): void {
    setTimeout(() => callback(configurationData))
  },
  searchSymbols: async function (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) {
    const allSymbols = await helper.getAllSymbols()
    const newSymbols = allSymbols.filter(symbol => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange
      const isFullSymbolContainsInput = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
      return isExchangeValid && isFullSymbolContainsInput
    })

    const chooseType = newSymbols.filter(symbol => symbol.type === symbolType)

    let chosenSymbols
    if (symbolType === 'all' || !symbolType) {
      chosenSymbols = newSymbols
    } else {
      chosenSymbols = chooseType
    }
    onResult(chosenSymbols)
  },
  resolveSymbol: async function (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: SymbolResolveExtension | undefined,
  ) {
    // expects a symbolInfo object in response

    const allSymbols = await helper.getAllSymbols()

    const symbolItem = allSymbols.find(({ full_name }) => full_name === symbolName)
    const splitName = symbolName.split(/[:/]/)

    if (!symbolItem) {
      // eslint-disable-next-line no-console
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
      onError('cannot resolve symbol')
      return
    }

    const symbolStub: LibrarySymbolInfo = {
      name: symbolItem.full_name,
      ticker: symbolItem.ticker,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      exchange: symbolName,
      timezone: 'Etc/UTC',
      full_name: symbolItem.full_name,
      listed_exchange: symbolItem.exchange,
      format: 'price',
      pricescale: 100000000,
      minmov: 1,
      visible_plots_set: 'ohlcv',
      supported_resolutions:
        symbolItem.symbol === 'CVI'
          ? (['60', '120', '180', '240', '1D', '2D', '3D', '4D'] as ResolutionString[])
          : supportedResolutions,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      has_daily: true,
      has_weekly_and_monthly: true,

      volume_precision: 2,
      data_status: 'pulsed',
    }
    const toSymbol: string = splitName.length === 1 ? splitName[0] : splitName[2]

    if (toSymbol.match(/USD|CVI|GOVI|EUR|JPY|AUD|GBP|KRW|CNY/)) {
      symbolStub.pricescale = 1000
    }

    setTimeout(() => {
      onResolve(symbolStub)
    })
  },
  getBars: function (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback,
  ) {
    const parsedSymbol = helper.parseFullSymbol(symbolInfo.full_name)

    if (parsedSymbol) {
      helper
        .historyData(parsedSymbol, resolution, periodParams, symbolInfo)
        .then(bars => {
          if (bars.length) {
            onResult(bars, { noData: false })
          } else {
            onResult(bars, { noData: true })
          }
        })
        .catch(error => onError(error))
    } else {
      return []
    }
  },
  subscribeBars: function (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ) {
    // console.log(symbolInfo, '---', resolution, '====', listenerGuid, '=====subscribeBars runnning')
  },
  unsubscribeBars: function (listenerGuid: string): void {
    // console.log('=====unsubscribeBars running')
  },
})
