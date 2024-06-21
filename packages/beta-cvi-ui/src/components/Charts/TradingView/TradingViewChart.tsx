/* eslint-disable no-console */
import * as React from 'react'
import './TradingViewChart.scss'

import Datafeed from './api/index'

import { useEffect, useMemo, useRef } from 'react'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  TimeFrameType,
} from 'beta-cvi-ui/public/charting_library/charting_library'
import { useWindowSize } from 'beta-cvi-ui/src/hooks/useWindowSize'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { WebSite } from '@coti-cvi/lw-sdk'

export const TradingViwTimeRanges = {
  startOfTheData: { inMilisecond: 1553904000000 },
  week_month: { inMilisecond: 604800000 },
  three_month: { inMilisecond: 7889238000 },
  six_month: { inMilisecond: 15780000000 },
} as const
const TradingViewChart = () => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const userLastChartType = localStorage.getItem('userLastChartType')
  const windowSize = useWindowSize()
  const tvRef = useRef(null)

  const isMobileScreen = useMemo(() => {
    if (windowSize.width && windowSize.width < 640) {
      return true
    }
    return false
  }, [windowSize.width])

  useEffect(() => {
    if (!tvRef.current) {
      return
    }

    const widgetOptions: ChartingLibraryWidgetOptions = {
      debug: false,
      symbol: 'CVI',
      datafeed: Datafeed(), // our datafeed object
      time_frames: [
        { text: '1w', resolution: '1D' as ResolutionString, description: '1 Week', title: '1W' },
        { text: '1m', resolution: '1D' as ResolutionString, description: '1 Month', title: '1M' },
        { text: '3m', resolution: '1D' as ResolutionString, description: '3 Month', title: '3M' },
        { text: '6m', resolution: '1D' as ResolutionString, description: '6 Month', title: '6M' },
        { text: '1y', resolution: '1D' as ResolutionString, description: '12 Month', title: '1Y' },
        { text: '7y', resolution: '1D' as ResolutionString, description: 'All', title: 'All' },
      ],
      interval: '1D' as ResolutionString,
      container: tvRef.current,
      library_path: '/charting_library/',
      locale: 'en',
      timeframe: userLastChartType === '0' || userLastChartType === '1' || userLastChartType === '9' ? '6M' : '48M',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: [],
      client_id: 'test',
      user_id: 'public_user_id',
      theme: 'Dark',
      fullscreen: false,
      ...(isMobileScreen || themeWebSite === WebSite.Armadillo ? { preset: 'mobile' } : {}),
      compare_symbols: [
        { symbol: 'CVI', title: 'CVI' },
        { symbol: 'Coinbase:BTC/USD', title: 'BTC/USD' },
        { symbol: 'Coinbase:ETH/USD', title: 'ETH/USD' },
      ],
      custom_css_url: 'css/style.css',
      loading_screen: { foregroundColor: themeWebSite === WebSite.Armadillo ? '#4c57ff' : '#fea716' },
      overrides: {
        'paneProperties.backgroundType': 'solid',

        'mainSeriesProperties.showCountdown': true,

        'paneProperties.backgroundGradientStartColor': '#1b1d38',
        'paneProperties.backgroundGradientEndColor': '#1b1d38',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',

        'scalesProperties.textColor': '#fff',
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
        'paneProperties.crossHairProperties.width': 1,

        // Area styles
        'mainSeriesProperties.areaStyle.color1':
          themeWebSite === WebSite.Armadillo ? 'rgba(76, 87, 255, 1)' : 'rgba(254, 167, 22, 0.2)',
        'mainSeriesProperties.areaStyle.color2': themeWebSite === WebSite.Armadillo ? '#4c57ff' : '#fea716',
        'mainSeriesProperties.areaStyle.linecolor': themeWebSite === WebSite.Armadillo ? '#4c57ff' : '#fea716',
        'mainSeriesProperties.areaStyle.linewidth': 2,
        'mainSeriesProperties.areaStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.transparency': 70,

        // Line styles
        'mainSeriesProperties.lineStyle.color': themeWebSite === WebSite.Armadillo ? '#4c57ff' : '#fea716',
        'mainSeriesProperties.lineStyle.linewidth': 2,
        'mainSeriesProperties.lineStyle.priceSource': 'close',

        // Series style. See the supported values below
        // Bar = 0
        // Candle = 1
        // Line = 2
        // Area = 3
        // Renko = 4
        // Kagi = 5
        // Point&Figure = 6
        // Line Break = 7
        // Heikin Ashi = 8
        // Hollow Candle = 9
        // Baseline = 10
        // Range = 11
        // HiLo = 12
        // Column = 13
        'mainSeriesProperties.style': 3,
      },
    }
    const widget = new window.TradingView.widget(widgetOptions)
    widget.onChartReady(() => {
      if (themeWebSite === WebSite.Cvi) {
        if (userLastChartType) {
          widget.activeChart().setChartType(Number(userLastChartType))
        }
        widget
          .activeChart()
          .onChartTypeChanged()
          .subscribe(null, chartType => {
            if (chartType === 0 || chartType === 1 || chartType === 9) {
              widget
                .activeChart()
                .setVisibleRange({ from: (new Date().getTime() - TradingViwTimeRanges.six_month.inMilisecond) / 1000 })
            }

            return localStorage.setItem('userLastChartType', chartType.toString())
          })
        widget
          .activeChart()
          .onIntervalChanged()
          .subscribe(null, (interval, timeframeObj) => {
            if (interval.includes('D')) {
              widget
                .activeChart()
                .setVisibleRange(
                  { from: TradingViwTimeRanges.startOfTheData.inMilisecond / 1000 },
                  { percentRightMargin: 0 },
                )
              return (timeframeObj.timeframe = { value: '3M', type: 'period-back' as TimeFrameType.PeriodBack })
            }

            return (timeframeObj.timeframe = { value: '1W', type: 'period-back' as TimeFrameType.PeriodBack })
          })
      } else {
        widget.activeChart().setChartType(3)
        widget
          .activeChart()
          .setVisibleRange({ from: TradingViwTimeRanges.startOfTheData.inMilisecond / 1000 }, { percentRightMargin: 0 })
      }
    })
  }, [isMobileScreen, themeWebSite, userLastChartType])

  return <div ref={tvRef} className="TVChartContainer" />
}

export default TradingViewChart
