import type { Dashboard } from '@arction/lcjs'
import { ColorCSS } from '@arction/lcjs'
import { SolidFill } from '@arction/lcjs'
import { AxisTickStrategies } from '@arction/lcjs'
import type { GeneralInfoOfEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  VtCviTransferEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'

import { getAddressGroupAndName, sortEventsAsc, TvStatisticsApi } from '@coti-cvi/lw-sdk'
import type { VtStatisticsApi, AllTvEvents, AllVtEvents } from '@coti-cvi/lw-sdk'
import { catDecimalsBase } from '@coti-cvi/lw-sdk'
import _, { chain } from 'lodash'
import { usdcToString } from '../../../../../il-admin-panel-ui/src/utils'
import type { BuildChartFn } from '../../vt/charts/lt-chart'

export class BuildTvCharts {
  private readonly allEventsAsc: (AllTvEvents | AllVtEvents)[]

  constructor(
    private readonly tvStatisticsApi: TvStatisticsApi,
    private readonly vtStatisticsApi: VtStatisticsApi,
    public readonly updatedGeneralInfoOfEvent?: GeneralInfoOfEventDto,
  ) {
    this.allEventsAsc = [...tvStatisticsApi.allEventsAsc, ...vtStatisticsApi.eventsAsc]
      .filter(e => e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity > 0)
      .sort(sortEventsAsc)
  }

  public buildEventsCountChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Count Of Events')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Count').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    for (const group of this.tvStatisticsApi.groupByEventTypes()) {
      chart
        .addPointLineSeries()
        .setPointSize(2)
        .setName(group.type)
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .add(group.eventsAsc.map((e, i) => ({ x: e.blockTimestamp * 1000, y: i + 1 })))
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvPriceUsdChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Theta Vault Price')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ TV Price').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('price')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map((e, i) => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvCvix1PriceInUsdc,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvPnlChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Theta Vault P&L')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('P&L').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('p&l')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc
          .filter(e => e.args.generalInfoOfEvent.tvInfo.tvPlatformPnl > 0)
          .map(e => ({
            x: e.blockTimestamp * 1000,
            y: e.args.generalInfoOfEvent.tvInfo.tvPlatformPnl,
          })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvCollateralPercentageChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Theta Vault Collateral %')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Collateral %').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Collateral %')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.tvCollateralRatio,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvUtilizationPercentageChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Theta Vault Utilization %')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Utilization %').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const minMs = Date.parse('2022-11-11T01:00:00.000Z')

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Utilization %')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc
          .filter(e => e.blockTimestamp * 1000 >= minMs)
          .map(e => ({
            x: e.blockTimestamp * 1000,
            y: e.args.generalInfoOfEvent.tvInfo.tvUtilizationPercentage,
          })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvLockedUsdcChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Theta Vault Locked $')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Locked $').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const minMs = Date.parse('2022-11-11T01:00:00.000Z')

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc
          .filter(e => e.blockTimestamp * 1000 >= minMs)
          .map(e => ({
            x: e.blockTimestamp * 1000,
            y: e.args.generalInfoOfEvent.tvInfo.tvLockedUsdc,
          })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvLockedPercentageChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Theta Vault Locked %')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Locked %').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const minMs = Date.parse('2022-11-11T01:00:00.000Z')

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc
          .filter(e => e.blockTimestamp * 1000 >= minMs)
          .map(e => ({
            x: e.blockTimestamp * 1000,
            y: e.args.generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance,
          })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildVtAmountInDexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Volatility Tokens Amount In Dex')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Amount').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Volatility Tokens Amount In Dex')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.dexCviBalance,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvPlatformDexLiquidityUsdChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Platform & Dex Liquidity')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Liquidity').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('$ Platform Liquidity')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity,
        })),
      )

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('$ Dex Liquidity')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdc * 2,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvPlatformDexLiquidityPercentageChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Platform & Dex Liquidity % From Total Liquidity')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('% From Total Liquidity').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Platform Liquidity % From Total Liquidity')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y:
            (e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity * 100) /
            (e.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdc * 2 +
              e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity),
        })),
      )

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('Dex Liquidity % From Total Liquidity')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y:
            (e.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice * 2 * 100) /
            (e.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdc * 2 +
              e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity),
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvLiquidityPieChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createPieChart({
      columnIndex,
      rowIndex,
      disableAnimations: true,
    })

    const last = this.allEventsAsc.length > 0 ? this.allEventsAsc[this.allEventsAsc.length - 1] : undefined

    const data = [
      { name: 'Platform', value: last?.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity ?? 0 },
      {
        name: 'DEX',
        value: last ? last.args.generalInfoOfEvent.tvInfo.dexCviBalanceUsdc * 2 : 0,
      },
    ]

    chart.setTitle(`$${usdcToString(_.sum(data.map(d => d.value)))} Liquidity`)

    chart.setLabelFormatter(
      (slice, relativeValue) =>
        `${slice.getName()}: $${usdcToString(slice.getValue())} (${catDecimalsBase(relativeValue * 100, 2)}%)`,
    )

    const disposes = data.map(item => chart.addSlice(item.name, item.value))

    return {
      dispose: () => {
        disposes.forEach(d => d.dispose())
        chart.dispose()
      },
    }
  }

  public buildTvPositionBalanceOfVolatilityTokensChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Platform Vt Balance (Including Vt In Dex) By Platform Price')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('$ Platform Vt Balance (Including Vt In Dex) By Platform Price')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvCurrentDepositsUsdcChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Theta Vault Current Deposits')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setPointSize(2)
      .setName('$ Theta Vault Current Deposits')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map(e => ({
          x: e.blockTimestamp * 1000,
          y: e.args.generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance,
        })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTvDepositsAndWithdrawTrendsByRequestIdChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('TV Disposits (Green) and Withdraws (Red) Trends')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const byRequestId = chain(this.tvStatisticsApi.allEventsAsc)
      .groupBy(e => e.args.requestId)
      .map((events, requestId) => ({
        requestId,
        action: events[0].args.action,
        events,
        data: events
          .sort(sortEventsAsc)
          .map(e => ({ x: e.blockTimestamp * 1000, y: e.args.generalInfoOfEvent.cviIndex }))
          .reverse()
          .slice(0, 1),
      }))
      .value()

    for (const { requestId, data, action } of byRequestId) {
      chart
        .addPointLineSeries()
        .setPointSize(3)
        .setName(requestId)
        .setStrokeStyle(stroke =>
          stroke
            .setThickness(3)
            .setFillStyle(new SolidFill({ color: ColorCSS(action === 'Deposit' ? 'green' : 'red') })),
        )
        .setPointFillStyle(new SolidFill({ color: ColorCSS(action === 'Deposit' ? 'green' : 'red') }))
        .add(data)
    }

    return chart
  }

  public buildTvVtTrendsByRequestIdtsChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('TV Deposits(Green), Withdraws(Red), Mints(Blue), Burns(Yellow) Trends')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const byRequestId = chain(
      this.allEventsAsc.flatMap(e =>
        e.type !== VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
        e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
          ? [e]
          : [],
      ),
    )
      .groupBy(e => `${e.args.action === 'Deposit' || e.args.action === 'Withdraw' ? 'tv' : 'vt'}/${e.args.requestId}`)
      .map((events, requestId) => ({
        requestId,
        action: events[0].args.action,
        events,
        data: events
          .sort(sortEventsAsc)
          .map(e => ({ x: e.blockTimestamp * 1000, y: e.args.generalInfoOfEvent.cviIndex }))
          .reverse()
          .slice(0, 1),
      }))
      .value()

    for (const { requestId, data, action } of byRequestId) {
      let color: string
      let thickness: number
      switch (action) {
        case 'Deposit':
          color = 'green'
          thickness = 3
          break
        case 'Withdraw':
          color = 'red'
          thickness = 3
          break
        case 'Mint':
          color = 'blue'
          thickness = 3
          break
        case 'Burn':
          color = 'yellow'
          thickness = 3
          break
        default:
          throw new Error(`can't be here`)
      }
      chart
        .addPointLineSeries()
        .setPointSize(thickness + 1)
        .setName(requestId)
        .setStrokeStyle(stroke =>
          stroke.setThickness(thickness).setFillStyle(new SolidFill({ color: ColorCSS(color) })),
        )
        .setPointFillStyle(new SolidFill({ color: ColorCSS(color) }))
        .add(data)
    }

    return chart
  }

  public buildTvDepositsAccodringToCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ TV Disposits According To CVI Index')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Numeric).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointSeries()
      .setPointSize(4)
      .setPointFillStyle(new SolidFill({ color: ColorCSS('green') }))
      .add(
        this.tvStatisticsApi.allEventsAsc
          .flatMap(e => (e.type === TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT ? [e] : []))
          .map(e => ({ x: e.args.submitRequestTokenAmountUsdc, y: e.args.generalInfoOfEvent.cviIndex })),
      )

    return chart
  }

  public buildTvWithdrawsAccodringToCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ TV Withdraws According To CVI Index')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Numeric).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointSeries()
      .setPointSize(4)
      .setPointFillStyle(new SolidFill({ color: ColorCSS('green') }))
      .add(
        this.tvStatisticsApi.allEventsAsc
          .flatMap(e => (e.type === TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT ? [e] : []))
          .map(e => ({ x: e.args.usdcAmountReceived, y: e.args.generalInfoOfEvent.cviIndex })),
      )

    return chart
  }

  public buildCountOfOpenTvPositionsChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Count Of Open TV Deposits')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Count').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map((e, i) => {
          const cviBalance = new Map<string, number>()
          for (let j = 0; j <= i; j++) {
            const event = this.allEventsAsc[j]
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.tvCvix1Balance)
              cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.tvCvix1Balance)
            } else {
              cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.tvCvix1Balance)
            }
          }
          return { x: e.blockTimestamp * 1000, y: Array.from(cviBalance.values()).filter(b => b > 0).length }
        }),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildSumOfOwnedTvCvisChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Sum of Owned TvCVIs')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('Count').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map((e, i) => {
          const cviBalance = new Map<string, number>()
          for (let j = 0; j <= i; j++) {
            const event = this.allEventsAsc[j]
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.tvCvix1Balance)
              cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.tvCvix1Balance)
            } else {
              cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.tvCvix1Balance)
            }
          }
          return { x: e.blockTimestamp * 1000, y: _.sum(Array.from(cviBalance.values())) }
        }),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildWorthOfOpenTvPositionsInUsdcChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Worth Of Open TV Deposits $')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map((e, i) => {
          const cviBalance = new Map<string, number>()
          for (let j = 0; j <= i; j++) {
            const event = this.allEventsAsc[j]
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.tvCvix1BalanceInUsdc)
              cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.tvCvix1BalanceInUsdc)
            } else {
              cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.tvCvix1BalanceInUsdc)
            }
          }
          return { x: e.blockTimestamp * 1000, y: _.sum(Array.from(cviBalance.values())) }
        }),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildAvgTotalOwnedTvCvisByCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Owned TvCVIs By CVI Index')
    chart.getDefaultAxisX().setTitle('Owned TvCVIs').setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart.addPointSeries().add(
      _.chain(this.allEventsAsc)
        .groupBy(e => e.args.generalInfoOfEvent.cviIndex)
        .flatMap((events, cviIndexString) => {
          const tvCviBalance = new Map<string, number>()
          for (const event of events) {
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (event.args.generalInfoOfEventBySender.tvCvix1Balance > 0) {
                tvCviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.tvCvix1Balance)
              }
              if (event.args.generalInfoOfEventByReceiver.tvCvix1Balance > 0) {
                tvCviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.tvCvix1Balance)
              }
            } else {
              if (event.args.generalInfoOfEventByAddress.tvCvix1Balance > 0) {
                tvCviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.tvCvix1Balance)
              }
            }
          }
          return Array.from(tvCviBalance.values()).map(tvCvix1Balance => ({
            x: tvCvix1Balance,
            y: Number(cviIndexString),
          }))
        })
        .filter(({ x }) => x > 0)
        .value(),
    )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildAvgWorthUsdcOfOwnedTvCvisByCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Worth ($) of Owned TvCVIs By CVI Index')
    chart.getDefaultAxisX().setTitle('Worth ($) Owned TvCVIs').setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart.addPointSeries().add(
      _.chain(this.allEventsAsc)
        .groupBy(e => e.args.generalInfoOfEvent.cviIndex)
        .flatMap((events, cviIndexString) => {
          const tvCviBalanceInUsdc = new Map<string, number>()
          for (const event of events) {
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (event.args.generalInfoOfEventBySender.tvCvix1BalanceInUsdc > 0) {
                tvCviBalanceInUsdc.set(
                  event.args.fromAccount,
                  event.args.generalInfoOfEventBySender.tvCvix1BalanceInUsdc,
                )
              }
              if (event.args.generalInfoOfEventByReceiver.tvCvix1BalanceInUsdc > 0) {
                tvCviBalanceInUsdc.set(
                  event.args.toAccount,
                  event.args.generalInfoOfEventByReceiver.tvCvix1BalanceInUsdc,
                )
              }
            } else {
              if (event.args.generalInfoOfEventByAddress.tvCvix1BalanceInUsdc > 0) {
                tvCviBalanceInUsdc.set(event.args.account, event.args.generalInfoOfEventByAddress.tvCvix1BalanceInUsdc)
              }
            }
          }
          return Array.from(tvCviBalanceInUsdc.values()).map(tvCvix1BalanceInUsdc => ({
            x: tvCvix1BalanceInUsdc,
            y: Number(cviIndexString),
          }))
        })
        .filter(({ x }) => x > 0)
        .value(),
    )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildPieAddressGroupTvCviBalanceGroupChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createPieChart({
      columnIndex,
      rowIndex,
      disableAnimations: true,
    })

    chart.setTitle(
      `TvCvi Balance: ${usdcToString(
        _.sum(
          Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.values()).map(a => a.tvCvix1Balance),
        ),
      )} ($${usdcToString(
        _.sum(
          Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.values()).map(
            a => a.tvCvix1BalanceInUsdc,
          ),
        ),
      )})`,
    )

    const groups = _.chain(Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.entries()))
      .groupBy(
        ([address]) => getAddressGroupAndName(address, this.vtStatisticsApi.cviContractsInversifyService).addressGroup,
      )
      .map(r => ({
        name: getAddressGroupAndName(r[0][0], this.vtStatisticsApi.cviContractsInversifyService).addressGroup,
        tvCvix1Balance: _.sum(r.map(a => a[1].tvCvix1Balance)),
        tvCvix1BalanceInUsdc: _.sum(r.map(a => a[1].tvCvix1BalanceInUsdc)),
      }))
      .value()

    chart.setLabelFormatter((slice, ratio) => {
      const groupIndex = groups.findIndex(g => g.name === slice.getName())
      if (groupIndex === -1) {
        throw new Error(`can't be here`)
      }

      return `${slice.getName()}: ${usdcToString(groups[groupIndex].tvCvix1Balance)} TvCvi ($${usdcToString(
        groups[groupIndex].tvCvix1BalanceInUsdc,
      )}) (${catDecimalsBase(ratio * 100, 2)}%)`
    })

    const disposes = groups.map(({ name, tvCvix1Balance }) => chart.addSlice(name, tvCvix1Balance))

    return {
      dispose: () => {
        disposes.forEach(d => d.dispose())
        chart.dispose()
      },
    }
  }

  public buildTvLockedFreePieChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createPieChart({
      columnIndex,
      rowIndex,
      disableAnimations: true,
    })

    chart.setTitle(
      `Tv Liquidity: $${usdcToString(this.updatedGeneralInfoOfEvent?.tvInfo.currentThetaVaultUsdcBalance ?? 0)}`,
    )

    chart.setLabelFormatter(
      (slice, relativeValue) =>
        `${slice.getName()}: $${usdcToString(slice.getValue())} (${catDecimalsBase(relativeValue * 100, 2)}%)`,
    )

    const disposes = [
      chart.addSlice('$ Locked', this.updatedGeneralInfoOfEvent?.tvInfo.tvLockedUsdc ?? 0),
      chart.addSlice(
        '$ Free',
        (this.updatedGeneralInfoOfEvent?.tvInfo.currentThetaVaultUsdcBalance ?? 0) -
          (this.updatedGeneralInfoOfEvent?.tvInfo.tvLockedUsdc ?? 0),
      ),
    ]

    return {
      dispose: () => {
        disposes.forEach(d => d.dispose())
        chart.dispose()
      },
    }
  }

  public buildVolumeInUsdcChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Volume')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        _.chain(this.tvStatisticsApi.allEventsAsc)
          .map((e, i) => ({
            x: e.blockTimestamp * 1000,
            y: new TvStatisticsApi(this.tvStatisticsApi.allEventsAsc.slice(0, i + 1)).calcVolumeUsdc(),
          }))
          .value(),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildVolumeInUsdcPrDayChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Volume')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        _.chain(this.tvStatisticsApi.allEventsAsc)
          .groupBy(e => {
            const startOfDay = new Date(e.blockTimestamp * 1000)
            startOfDay.setHours(0, 0, 0, 0)
            return startOfDay.getTime()
          })
          .map((eventsInSameDay, startOfDayMs) => ({
            x: Number(startOfDayMs),
            y: new TvStatisticsApi(eventsInSameDay).calcVolumeUsdc(),
          }))
          .value(),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }
}
