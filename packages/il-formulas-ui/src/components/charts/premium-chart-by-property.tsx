import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { getChartDisplayName } from '../../utils'
import type { PeriodSeconds } from '@coti-cvi/lw-sdk'
import { isNumeric } from '@coti-cvi/lw-sdk'
import Chart from 'react-apexcharts'
import { actions, useAppDispatch, useAppSelector } from '../../redux'
import type { ChartNames, RangeInfo } from '../../types'
import { useSeriesDownloader } from '../../hooks/use-series-downloader'

type Props = {
  chartName: ChartNames
}

const getSweetPointMaximumPremiumPercentDependingOnPeriod = (periodSeconds: PeriodSeconds): number | undefined => {
  switch (periodSeconds.periodSeconds) {
    case 60 * 60 * 24 * 14:
      return 0.6 // ok to pay max. 0.6% for 14 days IL protection

    case 60 * 60 * 24 * 30:
      return 1.1 // ok to pay max. 1.1% for 30 days IL protection

    case 60 * 60 * 24 * 60:
      return 1.6 // ok to pay max. 1.6% for 60 days IL protection

    default:
      return undefined
  }
}

function getValidRangeInfo(range?: RangeInfo<string>): RangeInfo<number> | undefined {
  if (!range || !isNumeric(range.min) || !isNumeric(range.max) || !isNumeric(range.interval)) {
    return
  }
  return {
    min: Number(range.min),
    max: Number(range.max),
    interval: Number(range.interval),
  }
}

export const PremiumChartBy: FC<Props> = ({ chartName }) => {
  const queue = useSeriesDownloader()
  const dispatch = useAppDispatch()
  const {
    chainId,
    overridenValues,
    chartsRanges,
    chartsSeries,
    seriesData,
    premiumPriceUsdcFromOverridenValues,
    selectedPairAndPeriod,
  } = useAppSelector(state => state.state)

  const chartRange = chartsRanges[chartName]
  const chartSeries = chartsSeries[chartName]

  const [inputs, setInputs] = useState<RangeInfo<string>>({
    min: '',
    max: '',
    interval: '',
  })

  useEffect(() => {
    const valid = getValidRangeInfo(inputs)
    if (valid) {
      dispatch(
        actions.setChartRangeInfo({
          chartName,
          range: valid,
        }),
      )
    }
  }, [chartName, dispatch, inputs])

  useEffect(() => {
    setInputs(prev =>
      chartRange && JSON.stringify(getValidRangeInfo(prev)) !== JSON.stringify(chartRange)
        ? {
            min: chartRange.min.toString(),
            max: chartRange.max.toString(),
            interval: chartRange.interval.toString(),
          }
        : prev,
    )
  }, [chartRange])

  const propertyValueNumber = overridenValues && Number(overridenValues[chartName])

  const chartSeriesData =
    chartSeries
      .map(s => ({
        name: s.name,
        data: seriesData[s.id],
      }))
      .filter((s): s is { name: string; data: [x: number, y: number][] } => Boolean(s.data)) ?? []

  const points:
    | {
        x: number
        y: number
        marker: {
          size: number
          fillColor?: string
          strokeColor?: string
          radius?: number
          cssClass?: string
        }
        label: {
          text: string
        }
      }[]
    | undefined = chartSeries // SHOW the border points - i.e: current config intersection points with graph
    .map(f => f.borderPoint)
    .map(([x, y]) => ({
      x,
      y,
      marker: {
        size: 8,
      },
      label: {
        text: (() => {
          const yPrettified = `${y <= 10 ? y.toFixed(2) : y.toFixed(0)}`
          switch (chartName) {
            case 'premiumGrowthStart':
              return `Premium Growth Start = ${x}, Premium % = ${yPrettified}%)`
            case 'premiumSlope':
              return `Premium Slope = ${x}, Premium % = ${yPrettified}%)`
            case 'cvi':
              return `CVI Index = ${x}, Premium % = ${yPrettified}%)` // chng
            case 'expectedLPTokensValueGrowth':
              return `Growth = ${x}, Premium % = ${yPrettified}%`
            case 'maxILProtectedPercentage':
              return `Max IL = ${x}%, Premium % = ${yPrettified}%`
            case 'liquidityUsdc':
              return `Liquidity = $${x <= 10 ? x.toFixed(2) : x.toFixed(0)}, Premium % = ${yPrettified}%`
            case 'lpTokensWorthAtBuyTimeUsdc':
              return `Protected Amount = $${x <= 10 ? x.toFixed(2) : x.toFixed(0)}, Premium % = ${yPrettified}%`
            case 'totalLPTokensWorthAtBuyTimeUsdc':
              return `TVP = $${x <= 10 ? x.toFixed(2) : x.toFixed(0)}, Premium % = ${yPrettified}%`
          }
        })(),
      },
    }))

  // Now we need to add to points, per each chart, the reasonablePremiumPercentPoints as far as un-acceptable high premium % depending on period of protection
  // const reasonablePremiumPercentPoints:
  //   | {
  //       x: number
  //       y: number
  //       marker: {
  //         size: number
  //         fillColor: string
  //         strokeColor: string
  //         radius: number
  //         cssClass: string
  //       }
  //       label: {
  //         text: string
  //         borderColor: string
  //         style: {
  //           color: string
  //           background: string
  //         }
  //       }
  //     }[]
  //   | undefined = []

  // for (const serieInfo of chartSeries) {
  //   const yMax = getSweetPointMaximumPremiumPercentDependingOnPeriod(serieInfo.selectedPairAndPeriod.period)
  //   // console.log(`chart: ${chart.periodSeconds.periodSecondsFormat}`)
  //   if (yMax !== undefined) {
  //     const data: Point[] | undefined = seriesData[serieInfo.id]

  //     if (data != undefined) {
  //       // console.log(
  //       //   `chart: ${chart.chartName} - yMax: ${yMax} for ${chart.chartName} chart.periodSeconds: ${chart.periodSeconds.periodSecondsFormat} and ${data?.length} data points`,
  //       // )

  //       for (const [index, [x, y]] of data.entries()) {
  //         const maxLocal = y >= yMax && data[index - 1]?.[1] < yMax
  //         const minLocal = y < yMax && data[index - 1]?.[1] >= yMax
  //         if (minLocal || maxLocal) {
  //           reasonablePremiumPercentPoints.push({
  //             x,
  //             y,
  //             marker: {
  //               size: 8,
  //               fillColor: '#ff0000',
  //               strokeColor: '#ffffff',
  //               radius: 2,
  //               cssClass: 'apexcharts-custom-class',
  //             },
  //             label: {
  //               text: `${maxLocal ? 'Max' : 'Min'} ${getFormattedValueAndUnitsForChartName(
  //                 chartName,
  //                 x,
  //               )} for reasonable ${
  //                 serieInfo.selectedPairAndPeriod.period.periodSecondsFormat
  //               } protection premium under ${y.toFixed(2)}%`,
  //               borderColor: '#FF4560',

  //               style: {
  //                 color: '#fff',
  //                 background: '#FF4560',
  //               },
  //             },
  //           })
  //         }
  //       }
  //     }
  //   }
  // }

  // console.log(
  //   `reasonablePremiumPercentPoints: ${reasonablePremiumPercentPoints?.length}: ${JSON.stringify(
  //     reasonablePremiumPercentPoints,
  //   )}`,
  // )

  // points = points ?? []
  // points = [...points, ...reasonablePremiumPercentPoints]

  const isButtonDisabled = !selectedPairAndPeriod || !overridenValues
  return (
    <div>
      <div>
        {getChartDisplayName(chartName, propertyValueNumber)} Chart:{' '}
        <button
          disabled={isButtonDisabled}
          onClick={() => {
            if (!selectedPairAndPeriod || !overridenValues) {
              return
            }
            queue.push({
              selectedPairAndPeriod,
              chartName,
              premiumValues: overridenValues,
            })
          }}
        >
          {isButtonDisabled ? `re-evaluate (Please choose pair/period)` : 're-evaluate'}
        </button>
      </div>
      <br />
      <br />
      Set min:{' '}
      <input
        type="text"
        style={{
          width: '60px',
        }}
        value={inputs.min}
        disabled={!inputs.min}
        onChange={e => setInputs({ ...inputs, min: e.target.value })}
      />{' '}
      max:{' '}
      <input
        type="text"
        style={{
          width: '60px',
        }}
        value={inputs.max}
        disabled={!inputs.max}
        onChange={e => setInputs({ ...inputs, max: e.target.value })}
      />{' '}
      and interval :{' '}
      <input
        type="text"
        style={{
          width: '60px',
        }}
        value={inputs.interval}
        disabled={!inputs.interval}
        onChange={e => setInputs({ ...inputs, interval: e.target.value })}
      />
      <div>
        <Chart
          type="line"
          height={450}
          width={'90%'}
          series={chartSeriesData}
          options={{
            chart: {
              zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true,
              },
              animations: {
                enabled: false,
              },
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                },
                autoSelected: 'zoom',
              },
            },
            annotations: {
              points: points ?? [],
            },
            xaxis: {
              tickAmount: 10,
              title: {
                text: getChartDisplayName(chartName, propertyValueNumber),
              },
              labels: {
                formatter: val => {
                  switch (chartName) {
                    case 'premiumGrowthStart':
                    case 'premiumSlope':
                    case 'cvi':
                      return parseFloat(val).toFixed(0)
                    case 'expectedLPTokensValueGrowth':
                      return parseFloat(val).toFixed(2)
                    case 'maxILProtectedPercentage':
                      return `${parseFloat(val).toFixed(0)}%`
                    case 'liquidityUsdc':
                    case 'lpTokensWorthAtBuyTimeUsdc':
                    case 'totalLPTokensWorthAtBuyTimeUsdc':
                      return `$${parseFloat(val).toFixed(0)}`
                  }
                },
              },
            },
            yaxis: {
              tickAmount: 3,
              title: {
                text: 'Premium %',
              },
              labels: {
                formatter: val => `${val.toFixed(val >= 10 ? 0 : 2)}%`,
              },
            },
            tooltip: {
              y: {
                formatter: (val: number) => {
                  try {
                    return `${val?.toFixed(val >= 10 ? 0 : 2)}% IL premium`
                  } catch (e) {
                    console.error(e)
                    console.error(chartSeriesData)
                    throw e
                  }
                },
              },
            },
          }}
        />
      </div>
      <hr
        style={{
          color: '#fffccc',
          backgroundColor: '#fffccc',
          marginTop: '100px',
        }}
      />
      <br></br>
    </div>
  )
}
