import type { Dashboard } from '@arction/lcjs'
import { Themes } from '@arction/lcjs'
import { AxisTickStrategies } from '@arction/lcjs'
import { VtUniswapSwapEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllTvEvents, AllVtEvents, TvRequestsEvents, TvStatisticsApi, VtStatisticsApi } from '@coti-cvi/lw-sdk'
import { sortEventsAsc } from '@coti-cvi/lw-sdk'
import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import type { TokensDailyPriceHistory } from '../redux/types'
import type { BuildChartFn } from './vt/charts/lt-chart'

export class BuildCommonCharts {
  private readonly allEventsAsc: (AllTvEvents | AllVtEvents)[]

  constructor(
    private readonly tokensDailyPriceHistory: TokensDailyPriceHistory,
    private readonly tvStatisticsApi: TvStatisticsApi,
    private readonly vtStatisticsApi: VtStatisticsApi,
  ) {
    this.allEventsAsc = [...tvStatisticsApi.allEventsAsc, ...vtStatisticsApi.eventsAsc]
      .filter(e => e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity > 0)
      .sort(sortEventsAsc)
  }

  public buildCviDailyPriceHistory: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({
      columnIndex,
      rowIndex,
      disableAnimations: true,
      theme: Themes.duskInLapland,
    })

    chart.setTitle('CVI')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Daily Index').setAxisInteractionZoomByWheeling(false)
    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setName('CVI')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .setPointSize(3)
      .add(
        this.tokensDailyPriceHistory.tokensDailyPriceHistory_arbitrumCvi.x.map((x, i) => ({
          x,
          y: this.tokensDailyPriceHistory.tokensDailyPriceHistory_arbitrumCvi.y[i],
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildCviCviUcviDailyPriceHistory: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({
      columnIndex,
      rowIndex,
      disableAnimations: true,
      theme: Themes.duskInLapland,
    })

    chart.setTitle('CVI vs UCVI')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Daily Price').setAxisInteractionZoomByWheeling(false)
    chart.setMouseInteractionWheelZoom(false)

    for (const [chartName, data] of safeObjectEntries(this.tokensDailyPriceHistory).filter(
      r => r[0] === 'tokensDailyPriceHistory_ucvi' || r[0] === 'tokensDailyPriceHistory_arbitrumCvi',
    )) {
      chart
        .addPointLineSeries()
        .setName(chartName === 'tokensDailyPriceHistory_arbitrumCvi' ? 'CVI' : 'UCVI')
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .setPointSize(3)
        .add(data.x.map((x, i) => ({ x, y: data.y[i] })))
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildWBtcDailyPriceHistory: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('WBTC')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Daily Price').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    for (const [chartName, data] of safeObjectEntries(this.tokensDailyPriceHistory).filter(
      r => r[0] === 'tokensDailyPriceHistory_WBTC',
    )) {
      chart
        .addPointLineSeries()
        .setName(chartName)
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .setPointSize(3)
        .add(data.x.map((x, i) => ({ x, y: data.y[i] })))
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildEthDailyPriceHistory: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('ETH')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Daily Price').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    for (const [chartName, data] of safeObjectEntries(this.tokensDailyPriceHistory).filter(
      r => r[0] === 'tokensDailyPriceHistory_ETH',
    )) {
      chart
        .addPointLineSeries()
        .setName(chartName)
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .setPointSize(3)
        .add(data.x.map((x, i) => ({ x, y: data.y[i] })))
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildUniqueAddressesOverTimeChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Accumulated Unique Addresses Over Time')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Count').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    function getData(events: (TvRequestsEvents | AllVtEvents)[]): { x: number; y: number }[] {
      return events.map((e, i) => ({
        x: e.blockTimestamp * 1000,
        y: new Set(
          events
            .slice(0, i + 1)
            .flatMap(e =>
              e.type === 'VtCviTransferEvent' ? [e.args.fromAccount, e.args.toAccount] : [e.args.account],
            ),
        ).size,
      }))
    }

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Total')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(getData(this.allEventsAsc))

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Volatility Tokens (Platform)')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        getData(
          this.vtStatisticsApi.eventsAsc.flatMap(e =>
            e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
          ),
        ),
      )

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Volatility Tokens (DEX)')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        getData(
          this.vtStatisticsApi.eventsAsc.flatMap(e =>
            e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
          ),
        ),
      )

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Theta Vault')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(getData(this.tvStatisticsApi.allEventsAsc))

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }
}
