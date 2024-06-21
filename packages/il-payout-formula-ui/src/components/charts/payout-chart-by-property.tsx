import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Point } from '@coti-cvi/lw-sdk'
import { isNumeric, Stator } from '@coti-cvi/lw-sdk'
import Chart from 'react-apexcharts'
import type { ChartName } from '../../types'
import { downloadSerieThunk, useAppDispatch, useAppSelector } from '../../redux'
import useInversify from '../../use-inversify'
import { getChartDisplayName } from '../../utils'

type Props = {
  min: number
  max: number
  interval?: number
  chartName: ChartName
}

export const PayoutChartBy: FC<Props> = ({ min, max, interval = Math.round((max - min) / 100), chartName }) => {
  const { ilContractsInversifyService, tokenUSDC } = useInversify()
  const dispatch = useAppDispatch()
  const chainId = useAppSelector(state => state.state.chainId)
  const overrides = useAppSelector(state => state.state.overrides)
  const chartData = useAppSelector(state => {
    const chart = state.state.charts.find(r => r.chartName === chartName)
    if (chart) {
      return chart.seriesSortedByCreationDateAsc.map(serie => ({
        name: serie.name,
        dataState: state.state.chartsData[serie.id] ?? Stator.pending(),
      }))
    }
    return []
  })
  const currentMaxIlRatio = useAppSelector(state => state.state.currentMaxIlRatio)

  const [inputs, setInputs] = useState({
    min: min.toString(),
    max: max.toString(),
    interval: interval.toString(),
  })

  const isLoadedInitialSerie = useRef(false)
  const downloadSerie = useCallback(() => {
    if (
      !isNumeric(inputs.min) ||
      !isNumeric(inputs.max) ||
      !isNumeric(inputs.interval) ||
      !ilContractsInversifyService ||
      !tokenUSDC ||
      currentMaxIlRatio.status !== 'resolved'
    ) {
      return
    }
    isLoadedInitialSerie.current = true
    dispatch(
      downloadSerieThunk({
        ilContractsInversifyService,
        tokenUSDC: tokenUSDC,
        serieInfo: {
          name: getChartDisplayName({ chartName }),
          chainId,
          chartName,
          creationDateUtc: new Date().toISOString(),
          rangeInfo: {
            min: Number(inputs.min),
            max: Number(inputs.max),
            interval: Number(inputs.interval),
          },
          payoutValues: overrides,
        },
        currentMaxIlRatio: currentMaxIlRatio.data,
      }),
    )
  }, [chainId, chartName, dispatch, currentMaxIlRatio, ilContractsInversifyService, inputs, overrides, tokenUSDC])

  useEffect(() => {
    if (!isLoadedInitialSerie.current) {
      downloadSerie()
    }
  }, [downloadSerie])

  return (
    <div>
      <div>
        {getChartDisplayName({ chartName })} Chart:
        <button disabled={chartData.some(s => s.dataState.status === 'pending')} onClick={() => downloadSerie()}>
          re-evaluate
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
        onChange={e => setInputs({ ...inputs, min: e.target.value })}
      />{' '}
      max:{' '}
      <input
        type="text"
        style={{
          width: '60px',
        }}
        value={inputs.max}
        onChange={e => setInputs({ ...inputs, max: e.target.value })}
      />{' '}
      and interval :{' '}
      <input
        type="text"
        style={{
          width: '60px',
        }}
        value={inputs.interval}
        onChange={e => setInputs({ ...inputs, interval: e.target.value })}
      />
      <div>
        <Chart
          type="line"
          height={450}
          width={'90%'}
          series={chartData
            .map(s => ({
              name: s.name,
              data: s.dataState.data,
            }))
            .filter((s): s is { name: string; data: Point[] } => Boolean(s.data))}
          options={{
            chart: {
              zoom: {
                enabled: true,
                type: 'xy',
              },
              animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                  enabled: true,
                  delay: 50,
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 800,
                },
              },
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  selection: false,
                  zoom: false,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                },
                autoSelected: 'zoom',
              },
            },
            xaxis: {
              tickAmount: 10,
              title: {
                text: getChartDisplayName({ chartName }),
              },
              labels: {
                formatter: val => {
                  switch (chartName) {
                    case 'lpTokensWorthAtBuyTimeUSD':
                    case 'token0EndPriceUSD':
                    case 'token1EndPriceUSD':
                      return `$${parseFloat(val).toFixed(0)}`
                  }
                },
              },
            },
            yaxis: {
              tickAmount: 7,
              title: {
                text: 'Payout',
              },
              labels: {
                formatter: val => `$${val.toFixed(val >= 10 ? 0 : 2)}`,
              },
            },
            tooltip: {
              y: {
                formatter: (val: number) => `$${val.toFixed(val >= 10 ? 0 : 2)}`,
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
