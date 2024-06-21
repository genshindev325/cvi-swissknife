import Chart from 'react-apexcharts'
import type { FC, SyntheticEvent } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import type { State } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import { typeOfCvi } from './Charts'
import CviInfoButton from './CviInfoButton'
import { actions, useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux'
import { useDebounce } from 'use-debounce'
import classNames from 'classnames'
import Spinner from '../Spinner/Spinner'
import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import { useWindowSize } from 'beta-cvi-ui/src/hooks/useWindowSize'
import { VolatilityTokensChartsTabsPaths } from 'beta-cvi-ui/src/types/common.types'
import { useLocation } from 'react-router-dom'

type Props = {
  selectedCvi: keyof typeof typeOfCvi
  setSelectedCvi: React.Dispatch<React.SetStateAction<keyof typeof typeOfCvi>>
}

const FubdingFeeChart: FC<Props> = ({ selectedCvi, setSelectedCvi }) => {
  const currentCvi = useAppSelector(state => state.state.currentCvi)
  const dailyFundingFee = useAppSelector(state => state.state.cvi.volatilityToken.dailyFundingFee)
  const dispatch = useAppDispatch()
  const { globalEventsInversifyService, vtInversifyService } = useTvInversifyServices()
  const fundingFeeValues = useAppSelector(state => state.state.cvi.volatilityToken.fundingFeeValues)
  const collateralRatio = useAppSelector(state => state.state.cvi.volatilityToken.collateralRatio)
  const [percentageState, setPercentageState] = useState<number>(40)
  const [collateralPercentageValue] = useDebounce(percentageState, 500)
  const [onProgressBarFocus, setOnProgressBarFocus] = useState(false)
  const [isDataExists, setIsDataExists] = useState(true)
  const [prevPercentage, setPrevPercentage] = useState(percentageState)
  const [disabledScroll, setDisabledScroll] = useState(false)
  const [isFirstCollateralData, setIsFirstCollateralData] = useState(true)

  const windowWidth = useWindowSize()
  const location = useLocation()
  useEffect(() => {
    if (location.hash.includes(VolatilityTokensChartsTabsPaths['funding-fee'])) {
      if (window.gtag) {
        window.gtag('event', `funding_fee_chart`, {
          page_title: `funding_fee_chart`,
          funding_fee_chart_title: `User clicked on funding fee chart`,
          description: `User clicked on funding fee chart to look`,
          page_path: window.location.pathname,
        })
      }
    }
  }, [location.hash])

  const fundingFeePoint = useMemo(() => {
    if (currentCvi.data && dailyFundingFee.data) {
      return { x: currentCvi.data.cviIndex, y: catDecimalsNoRoundUp(dailyFundingFee.data, 6) }
    }
    return { x: 0, y: 0 }
  }, [currentCvi.data, dailyFundingFee.data])

  useEffect(() => {
    if (isFirstCollateralData) {
      setPercentageState(prev => (collateralRatio.data !== undefined ? Math.trunc(collateralRatio.data) : prev))
      if (collateralRatio.data !== undefined) {
        setIsFirstCollateralData(false)
      }
    }
  }, [collateralRatio, isFirstCollateralData])

  useEffect(() => {
    function fetchNewDataOfNewCollateral() {
      if (!globalEventsInversifyService || !vtInversifyService || onProgressBarFocus || !isDataExists) {
        return
      }

      const save = (collateralPercentage: number, feeByCviValue: State<number[]>) => {
        dispatch(actions.setFundingFeeValues({ collateralPercentage, feeByCviValue }))
      }

      globalEventsInversifyService.eventEmitterVolatility.on('vtFundingFeeValues', save)

      vtInversifyService.registerNewFundingFeeValuesEvent(collateralPercentageValue)
      return () => {
        globalEventsInversifyService.eventEmitterVolatility.off('vtFundingFeeValues', save)
      }
    }

    fetchNewDataOfNewCollateral()
  }, [
    dispatch,
    globalEventsInversifyService,
    collateralPercentageValue,
    vtInversifyService,
    percentageState,
    onProgressBarFocus,
    isDataExists,
  ])

  useEffect(() => {
    if (fundingFeeValues[percentageState]?.status === 'resolved') {
      setIsDataExists(false)

      setPrevPercentage(percentageState)
    } else {
      setIsDataExists(true)
    }
    if (fundingFeeValues[percentageState]?.status !== 'resolved' && !onProgressBarFocus) {
      setDisabledScroll(true)
    } else {
      setDisabledScroll(false)
    }
  }, [fundingFeeValues, onProgressBarFocus, percentageState])

  const formatToFundingFeeArrayByCviIndex = () => {
    const fundingFeeArrayByCviIndex = !isDataExists
      ? fundingFeeValues[percentageState]?.data
      : fundingFeeValues[prevPercentage]?.data

    if (fundingFeeArrayByCviIndex !== undefined) {
      return fundingFeeArrayByCviIndex.map(f => f / 24)
    }
    return []
  }
  return (
    <>
      <span className="flex flex-row gap-4 ml-4">
        {safeObjectEntries(typeOfCvi).map(([key, value]) => (
          <CviInfoButton
            key={value.name}
            title={value.name}
            selected={typeOfCvi[selectedCvi].name === value.name}
            handleClick={(event: SyntheticEvent) => {
              setSelectedCvi(key)
            }}
          />
        ))}
      </span>
      <span className="flex flex-col 2xl:flex-row gap-6">
        <span className=" w-full relative ">
          {/* <span className=" 2xl:w-9/12 relative "> */}
          {(onProgressBarFocus === true || fundingFeeValues[percentageState]?.status !== 'resolved') && (
            <span className="absolute z-30 bottom-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-lg">
              <Spinner
                className={classNames({
                  'h-8 w-8 border-2 ml-4  mt-4 ': true,
                })}
              />
            </span>
          )}
          {
            <span
              className={classNames({
                // 'w-full ': true,
                ' 2xl:w-9/12': true,
                'bg-dark-600 opacity-30 ':
                  onProgressBarFocus === true || fundingFeeValues[percentageState]?.status !== 'resolved',
              })}
            >
              <Chart
                type="line"
                width="100%"
                height={315}
                series={[
                  {
                    name: '1h funding fee',
                    data: formatToFundingFeeArrayByCviIndex(),
                  },
                ]}
                options={{
                  dataLabels: {
                    enabled: false,
                  },
                  tooltip: {
                    enabled: true,
                    x: {
                      show: true,

                      formatter: val => `CVI: <b>${val}</b>`,
                    },
                  },
                  chart: {
                    foreColor: 'white',
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
                    position: 'front',
                    points: [
                      {
                        x: Math.floor(fundingFeePoint.x),
                        y: fundingFeePoint.y,
                        marker: {
                          size: 5,
                          strokeColor: '#fff',
                          fillColor: '#2775ca',
                        },
                      },
                    ],
                  },
                  xaxis: {
                    type: 'numeric',
                    tickAmount: windowWidth.width !== undefined && windowWidth.width < 640 ? 10 : 20,

                    title: { style: { color: 'white' } },
                    labels: {
                      style: { colors: 'white' },
                      showDuplicates: false,
                    },
                  },
                  yaxis: {
                    tickAmount: 6,
                    labels: {
                      style: { colors: 'white' },
                      formatter: function (val) {
                        return `${catDecimalsNoRoundUp(val, 6)}%`
                      },
                    },
                  },
                  fill: { colors: ['#2775ca'] },
                  grid: {
                    borderColor: '#282828',
                  },
                  stroke: {
                    width: 1.8,
                  },
                  colors: ['#2775ca'],
                }}
              />
            </span>
          }
        </span>

        {/* <FundingFeeProgressBar
          setOnProgressBarFocus={setOnProgressBarFocus}
          percentageState={percentageState}
          setPercentageState={setPercentageState}
          disabledScroll={disabledScroll}
        /> */}
      </span>
    </>
  )
}

export default FubdingFeeChart
