import type { Dashboard } from '@arction/lcjs'
import { ColorCSS, SolidFill } from '@arction/lcjs'
import { AxisTickStrategies } from '@arction/lcjs'
import {
  VtMintEventDto,
  VtBurnEventDto,
  VtCviTransferEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import type { AllTvEvents, AllVtEvents, TvStatisticsApi, VtStatisticsApi } from '@coti-cvi/lw-sdk'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk'
import { AddressGroup } from '@coti-cvi/lw-sdk'
import { sortEventsAsc } from '@coti-cvi/lw-sdk'
import { catDecimalsBase } from '@coti-cvi/lw-sdk'
import { VtRequestType } from '@coti-cvi/lw-sdk'
import _ from 'lodash'
import { chain } from 'lodash'
import { usdcToString } from '../../../../../il-admin-panel-ui/src/utils'
import type { BuildChartFn } from './lt-chart'

export class BuildVtCharts {
  private readonly allEventsAsc: (AllTvEvents | AllVtEvents)[]

  constructor(tvStatisticsApi: TvStatisticsApi, private readonly vtStatisticsApi: VtStatisticsApi) {
    this.allEventsAsc = [...tvStatisticsApi.allEventsAsc, ...vtStatisticsApi.eventsAsc]
      .filter(e => e.args.generalInfoOfEvent.tvInfo.platformUSDCLiquidity > 0)
      .sort(sortEventsAsc)
  }

  public buildAccumulateeFeesByEventChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })
    chart.setTitle('Accumulated Fees By Event')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Fees').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    for (const group of this.vtStatisticsApi.groupByEventTypes()) {
      chart
        .addPointLineSeries()
        .setName(group.type)
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .add(
          this.vtStatisticsApi
            .NewVtStatisticsApi({ eventsAsc: group.eventsAsc })
            .calculateFeesHistory()
            .history.map(({ point }) => ({ x: point.dateMs, y: point.feesUntilNow })),
        )
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildCountOfOpenPositionsChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Count Of Open Positions (Platform + DEX)')
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
              cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.vtCviBalance)
              cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.vtCviBalance)
            } else {
              cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.vtCviBalance)
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

  public buildSumOfOwnedCvisChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Sum of Owned CVIs')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const l = chart
      .addPointLineSeries()
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.allEventsAsc.map((e, i) => {
          const cviBalance = new Map<string, number>()
          for (let j = 0; j <= i; j++) {
            const event = this.allEventsAsc[j]
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.vtCviBalance)
              cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.vtCviBalance)
            } else {
              cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.vtCviBalance)
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

    for (const group of this.vtStatisticsApi.groupByEventTypes()) {
      chart
        .addPointLineSeries()
        .setName(group.type)
        .setStrokeStyle(stroke => stroke.setThickness(1))
        .add(group.eventsAsc.map((e, i) => ({ x: e.blockTimestamp * 1000, y: i + 1 })))
    }

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildMintBurnFeesChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Fees Of Events')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Fees').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const mintData = this.vtStatisticsApi
      .NewVtStatisticsApi({
        eventsAsc: this.vtStatisticsApi.eventsAsc.filter(
          e =>
            ('requestType' in e.args && e.args.requestType === VtRequestType.Mint) ||
            e.type === VtMintEventDto.type.VT_MINT_EVENT,
        ),
      })
      .calculateFeesHistory().history

    const burnData = this.vtStatisticsApi
      .NewVtStatisticsApi({
        eventsAsc: this.vtStatisticsApi.eventsAsc.filter(
          e =>
            ('requestType' in e.args && e.args.requestType === VtRequestType.Burn) ||
            e.type === VtBurnEventDto.type.VT_BURN_EVENT,
        ),
      })
      .calculateFeesHistory().history

    chart
      .addPointLineSeries()
      .setName('Mint Fees')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(mintData.map(d => ({ x: d.point.dateMs, y: d.point.feesUntilNow })))

    chart
      .addPointLineSeries()
      .setName('Burn Fees')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(burnData.map(d => ({ x: d.point.dateMs, y: d.point.feesUntilNow })))

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildTotalMintBurnFeesChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Total Mint & Burn Fees')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('$ Total Fees').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart
      .addPointLineSeries()
      .setName('Total Fees')
      .setStrokeStyle(stroke => stroke.setThickness(1))
      .add(
        this.vtStatisticsApi.calculateFeesHistory().history.map(d => ({ x: d.point.dateMs, y: d.point.feesUntilNow })),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildVtMintAndBurnTrendsByRequestIdChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Vt Mints (Blue) and Burns (Yellow) Trends')
    chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime).setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    const byRequestId = chain(
      this.vtStatisticsApi.eventsAsc.flatMap(e =>
        e.type !== VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
        e.type !== VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
          ? [e]
          : [],
      ),
    )
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
            .setFillStyle(new SolidFill({ color: ColorCSS(action === 'Mint' ? 'blue' : 'yellow') })),
        )
        .setPointFillStyle(new SolidFill({ color: ColorCSS(action === 'Mint' ? 'blue' : 'yellow') }))
        .add(data)
    }

    return chart
  }

  public buildAvgTotalOwnedCvisByCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Owned CVIs By CVI Index')
    chart.getDefaultAxisX().setTitle('Owned CVIs').setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart.addPointSeries().add(
      _.chain(this.allEventsAsc)
        .groupBy(e => e.args.generalInfoOfEvent.cviIndex)
        .flatMap((events, cviIndexString) => {
          const cviBalance = new Map<string, number>()
          for (const event of events) {
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (event.args.generalInfoOfEventBySender.vtCviBalance > 0) {
                cviBalance.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.vtCviBalance)
              }
              if (event.args.generalInfoOfEventByReceiver.vtCviBalance > 0) {
                cviBalance.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.vtCviBalance)
              }
            } else {
              if (event.args.generalInfoOfEventByAddress.vtCviBalance > 0) {
                cviBalance.set(event.args.account, event.args.generalInfoOfEventByAddress.vtCviBalance)
              }
            }
          }
          return Array.from(cviBalance.values()).map(vtCviBalance => ({
            x: vtCviBalance,
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

  public buildAvgWorthUsdcOfOwnedCvisByCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('Worth ($) of Owned CVIs By CVI Index')
    chart.getDefaultAxisX().setTitle('Worth ($) Owned CVIs').setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart.addPointSeries().add(
      _.chain(this.allEventsAsc)
        .groupBy(e => e.args.generalInfoOfEvent.cviIndex)
        .flatMap((events, cviIndexString) => {
          const cviBalanceInUsdc = new Map<string, number>()
          for (const event of events) {
            if (event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT) {
              if (event.args.generalInfoOfEventBySender.vtCvix1BalanceInUsdc > 0) {
                cviBalanceInUsdc.set(event.args.fromAccount, event.args.generalInfoOfEventBySender.vtCvix1BalanceInUsdc)
              }
              if (event.args.generalInfoOfEventByReceiver.vtCvix1BalanceInUsdc > 0) {
                cviBalanceInUsdc.set(event.args.toAccount, event.args.generalInfoOfEventByReceiver.vtCvix1BalanceInUsdc)
              }
            } else {
              if (event.args.generalInfoOfEventByAddress.vtCvix1BalanceInUsdc > 0) {
                cviBalanceInUsdc.set(event.args.account, event.args.generalInfoOfEventByAddress.vtCvix1BalanceInUsdc)
              }
            }
          }
          return Array.from(cviBalanceInUsdc.values()).map(vtCvix1BalanceInUsdc => ({
            x: vtCvix1BalanceInUsdc,
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
        _.chain(this.vtStatisticsApi.eventsAsc)
          .map((e, i) => ({
            x: e.blockTimestamp * 1000,
            y: this.vtStatisticsApi
              .NewVtStatisticsApi({ eventsAsc: this.vtStatisticsApi.eventsAsc.slice(0, i + 1) })
              .calcVolumeUsdc(),
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
        _.chain(this.vtStatisticsApi.eventsAsc)
          .groupBy(e => {
            const startOfDay = new Date(e.blockTimestamp * 1000)
            startOfDay.setHours(0, 0, 0, 0)
            return startOfDay.getTime()
          })
          .map((eventsInSameDay, startOfDayMs) => ({
            x: Number(startOfDayMs),
            y: this.vtStatisticsApi
              .NewVtStatisticsApi({ eventsAsc: eventsInSameDay.sort(sortEventsAsc) })
              .calcVolumeUsdc(),
          }))
          .value(),
      )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }

  public buildPieAddressGroupcviBalanceGroupChart: BuildChartFn = ({
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
      `CVI Balance: $${usdcToString(
        _.sum(Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.values()).map(a => a.vtCviBalance)),
      )} ($${usdcToString(
        _.sum(
          Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.values()).map(
            a => a.vtCvix1BalanceInUsdc,
          ),
        ),
      )})`,
    )

    const groups = _.chain(Array.from(this.vtStatisticsApi.updatedGeneralInfoOfEventByAddressMap.entries()))
      .filter(
        ([address]) =>
          getAddressGroupAndName(address, this.vtStatisticsApi.cviContractsInversifyService).addressGroup !==
          AddressGroup.DEX_CONTRACTS,
      )
      .groupBy(
        ([address]) => getAddressGroupAndName(address, this.vtStatisticsApi.cviContractsInversifyService).addressGroup,
      )
      .map(r => ({
        name:
          getAddressGroupAndName(r[0][0], this.vtStatisticsApi.cviContractsInversifyService).addressGroup ===
          AddressGroup.CVI_CONTRACTS
            ? 'Theta Vault'
            : getAddressGroupAndName(r[0][0], this.vtStatisticsApi.cviContractsInversifyService).addressGroup,
        vtCviBalance: _.sum(r.map(a => a[1].vtCviBalance)),
        vtCvix1BalanceInUsdc: _.sum(r.map(a => a[1].vtCvix1BalanceInUsdc)),
      }))
      .value()

    chart.setLabelFormatter((slice, ratio) => {
      const groupIndex = groups.findIndex(g => g.name === slice.getName())
      if (groupIndex === -1) {
        throw new Error(`can't be here`)
      }

      return `${slice.getName()}: ${usdcToString(groups[groupIndex].vtCviBalance)} CVI ($${usdcToString(
        groups[groupIndex].vtCvix1BalanceInUsdc,
      )}) (${catDecimalsBase(ratio * 100, 2)}%)`
    })

    const disposes = groups.map(({ name, vtCviBalance }) => chart.addSlice(name, vtCviBalance))

    return {
      dispose: () => {
        disposes.forEach(d => d.dispose())
        chart.dispose()
      },
    }
  }

  public buildFeesPerCviIndexChart: BuildChartFn = ({
    dashboard,
    columnIndex,
    rowIndex,
  }: {
    dashboard: Dashboard
    columnIndex: number
    rowIndex: number
  }) => {
    const chart = dashboard.createChartXY({ columnIndex, rowIndex, disableAnimations: true })

    chart.setTitle('$ Fees Per CVI Index')
    chart.getDefaultAxisX().setTitle('$ Fees').setAxisInteractionZoomByWheeling(false)
    chart.getDefaultAxisY().setTitle('CVI').setAxisInteractionZoomByWheeling(false)

    chart.setMouseInteractionWheelZoom(false)

    chart.addPointSeries().add(
      _.chain(this.vtStatisticsApi.eventsWithoutTransferAndSwapAsc)
        .groupBy(e => e.args.generalInfoOfEvent.cviIndex)
        .map((events, cviIndexStr) => ({
          x: this.vtStatisticsApi.NewVtStatisticsApi({ eventsAsc: events.sort(sortEventsAsc) }).calculateFeesHistory()
            .feesUntilNow,
          y: Number(cviIndexStr),
        }))
        .filter(({ x }) => x > 0)
        .value(),
    )

    if (chart.getSeries().length > 1) {
      chart.addLegendBox().add(chart)
    }
    return chart
  }
}
